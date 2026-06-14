import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/**
 * BackButton — 返回上级页面
 *
 * 默认返回 /explore，可通过 href 覆盖。
 */
export function BackButton({ href = "/explore", label = "返回探索" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
    >
      <ArrowLeft className="size-4" />
      {label}
    </Link>
  );
}
