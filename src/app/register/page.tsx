"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registerUser } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const IDENTITIES = [
  { value: "STUDENT", label: "在校生" },
  { value: "ALUMNI", label: "校友" },
  { value: "TEACHER", label: "教师" },
  { value: "COUNSELOR", label: "辅导员" },
  { value: "HR", label: "企业HR" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await registerUser(formData);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // 注册成功后自动登录
      const signInResult = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });

      if (signInResult?.error) {
        // 注册成功但登录失败 — 跳转到登录页
        router.push("/login?registered=true");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">加入观澜知远</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                name="name"
                placeholder="你的真实姓名"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identity">身份</Label>
              <Select name="identity" required>
                <SelectTrigger>
                  <SelectValue placeholder="选择你的身份" />
                </SelectTrigger>
                <SelectContent>
                  {IDENTITIES.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">院系（选填）</Label>
              <Input
                id="department"
                name="department"
                placeholder="如：计算机学院"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="至少 6 位字符"
                minLength={6}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "注册中..." : "注册"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            已有账号？{" "}
            <Link href="/login" className="text-primary hover:underline">
              立即登录
            </Link>
          </p>
        </CardContent>
      </Card>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-4")}
      >
        ← 返回首页
      </Link>
    </div>
  );
}
