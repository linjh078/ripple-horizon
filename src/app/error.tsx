"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      <AlertCircle className="size-12 text-destructive mb-4" />
      <h2 className="text-xl font-bold mb-2">出了点问题</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {process.env.NODE_ENV === "development"
          ? error.message
          : "页面加载失败，请稍后重试"}
      </p>
      <Button onClick={reset} variant="outline">
        重新加载
      </Button>
    </div>
  );
}
