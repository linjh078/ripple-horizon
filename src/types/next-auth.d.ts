// 扩展 Auth.js Session 类型，添加用户 ID
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
