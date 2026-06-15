"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const LEVELS = [
  { key: "夯", label: "夯", color: "bg-amber-500", textColor: "text-amber-600" },
  { key: "顶级", label: "顶级", color: "bg-orange-500", textColor: "text-orange-600" },
  { key: "人上人", label: "人上人", color: "bg-blue-500", textColor: "text-blue-600" },
  { key: "NPC", label: "NPC", color: "bg-gray-400", textColor: "text-gray-500" },
  { key: "拉完了", label: "拉完了", color: "bg-red-500", textColor: "text-red-500" },
];

interface RatingBarProps {
  targetId: string;
  targetType: "subject" | "post" | "spot" | "material";
}

interface RatingData {
  counts: Record<string, number>;
  myVote: string | null;
}

export function RatingBar({ targetId, targetType }: RatingBarProps) {
  const { data: session } = useSession();
  const [data, setData] = useState<RatingData>({ counts: { "夯": 0, "顶级": 0, "人上人": 0, "NPC": 0, "拉完了": 0 }, myVote: null });
  const [loading, setLoading] = useState(false);

  const fetchRatings = useCallback(async () => {
    try {
      const res = await fetch(`/api/ratings?targetId=${targetId}&targetType=${targetType}`);
      if (res.ok) setData(await res.json());
    } catch { /* ignore */ }
  }, [targetId, targetType]);

  useEffect(() => { fetchRatings(); }, [fetchRatings]);

  async function vote(rating: string) {
    if (!session) { toast.error("请先登录后再评价"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId, targetType, rating }),
      });
      if (!res.ok) {
        const d = await res.json();
        toast.error(d.error || "评价失败");
        return;
      }
      await fetchRatings();
    } catch {
      toast.error("网络错误");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {LEVELS.map((level) => {
        const isMine = data.myVote === level.key;
        const count = data.counts[level.key] || 0;
        return (
          <button
            key={level.key}
            type="button"
            disabled={loading}
            onClick={() => vote(level.key)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
              "border hover:scale-105 active:scale-95",
              isMine
                ? `${level.color} text-white border-transparent shadow-sm`
                : "bg-card border-border text-muted-foreground hover:border-foreground/30"
            )}
            title={`${level.label}（${count} 人）`}
          >
            <span>{level.label}</span>
            <span className={cn("tabular-nums", isMine ? "text-white/80" : level.textColor)}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
