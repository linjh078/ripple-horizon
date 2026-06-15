"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Loader2 } from "lucide-react";
import { updateUserRole, deleteUser, getUsers } from "@/lib/actions/admin";
import { toast } from "sonner";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  identity: string;
  userNumber: string | null;
  department: string | null;
  createdAt: Date;
  _count: { posts: number };
};

const ROLE_OPTIONS = [
  { value: "USER", label: "普通用户" },
  { value: "HR", label: "企业HR" },
  { value: "ADMIN", label: "管理员" },
];

const ROLE_LABEL_MAP: Record<string, string> = {
  USER: "普通用户",
  HR: "企业HR",
  ADMIN: "管理员",
};

const IDENTITY_LABELS: Record<string, string> = {
  STUDENT: "在校生",
  ALUMNI: "校友",
  TEACHER: "教师",
  COUNSELOR: "辅导员",
  HR: "企业HR",
};

export function AdminUserTable({ initialUsers }: { initialUsers: UserRow[] }) {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // 搜索防抖
  const handleSearch = useCallback(
    async (value: string) => {
      setSearch(value);
      setSearching(true);
      try {
        const result = await getUsers(value || undefined);
        if (result) setUsers(result.users);
      } catch {
        toast.error("搜索失败");
      } finally {
        setSearching(false);
      }
    },
    []
  );

  // 修改角色
  async function handleRoleChange(userId: string, role: string) {
    setChangingRole(userId);
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("role", role);
    try {
      const result = await updateUserRole(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("角色已更新");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
      router.refresh();
    } catch {
      toast.error("修改失败");
    } finally {
      setChangingRole(null);
    }
  }

  // 删除用户
  async function handleDelete(userId: string, userName: string) {
    if (!confirm(`确定要删除用户「${userName}」吗？此操作不可撤销，将同时删除该用户的所有帖子、评论等数据。`)) return;

    setDeleting(userId);
    const formData = new FormData();
    formData.append("userId", userId);
    try {
      const result = await deleteUser(formData);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(`已删除用户「${userName}」`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      router.refresh();
    } catch {
      toast.error("删除失败");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      {/* 搜索栏 */}
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="搜索用户名、邮箱或编号..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9"
        />
        {searching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* 用户表格 */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">用户</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap hidden sm:table-cell">编号</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap hidden md:table-cell">院系</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap hidden md:table-cell">身份</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap">权限</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap hidden lg:table-cell">帖子</th>
                <th className="text-left px-4 py-3 font-medium whitespace-nowrap hidden lg:table-cell">注册时间</th>
                <th className="text-right px-4 py-3 font-medium whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {user.userNumber || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {user.department || "—"}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge variant="outline" className="text-xs">
                      {IDENTITY_LABELS[user.identity] || user.identity}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {changingRole === user.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <select
                        defaultValue={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="rounded-md border px-2 py-1 text-xs font-medium bg-background cursor-pointer"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {user._count.posts}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                    {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:text-destructive"
                      disabled={deleting === user.id}
                      onClick={() => handleDelete(user.id, user.name)}
                    >
                      {deleting === user.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {search ? "没有找到匹配的用户" : "还没有用户"}
          </div>
        )}
      </div>
    </div>
  );
}
