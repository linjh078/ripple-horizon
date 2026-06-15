import { getUsers } from "@/lib/actions/admin";
import { AdminUserTable } from "@/components/admin/user-table";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const { users } = await getUsers();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <p className="text-sm text-muted-foreground mt-1">
          管理所有注册用户，修改权限，处理异常账户。共 {users.length} 位用户。
        </p>
      </div>
      <AdminUserTable initialUsers={users} />
    </div>
  );
}
