import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-primary mb-4">404</p>
      <h2 className="text-xl font-bold mb-2">页面不存在</h2>
      <p className="text-sm text-muted-foreground mb-6">
        你所寻找的页面可能已被删除或地址有误
      </p>
      <Link href="/" className={cn(buttonVariants())}>
        <Home className="size-4" />
        <span className="ml-1.5">返回首页</span>
      </Link>
    </div>
  );
}
