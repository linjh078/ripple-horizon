// ============================================================================
// 简易内存速率限制器
// 基于滑动窗口，适合单机部署（多机需 Redis）
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number; // 窗口重置时间戳
}

const store = new Map<string, RateLimitEntry>();

// 每 60 秒清理过期条目
const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  for (const [key, entry] of store) {
    if (now >= entry.resetAt) store.delete(key);
  }
  lastCleanup = now;
}

/**
 * 检查请求是否超出速率限制
 * @param key 唯一标识（通常是 IP 或 IP+路由）
 * @param maxRequests 窗口内最大请求数
 * @param windowMs 时间窗口（毫秒）
 * @returns { allowed: boolean; remaining: number; resetAt: number }
 */
export function rateLimit(
  key: string,
  maxRequests: number = 30,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  // 窗口已过期 → 重置
  if (!entry || now >= entry.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

/**
 * 从 NextRequest 提取客户端 IP
 */
export function getClientIp(req: Request): string {
  // 尝试从代理头部获取真实 IP（生产环境 Nginx/Vercel 会设置）
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}
