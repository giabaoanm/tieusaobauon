import "server-only";

// ──────────────────────────────────────────────────────────────
// Giới hạn tần suất (rate limiting) đơn giản, lưu trong bộ nhớ.
// Chống spam/brute-force ở mức cơ bản cho Sprint 2.
// Sprint 4 sẽ thay bằng giải pháp phân tán (Redis/Upstash) + Cloudflare.
// ──────────────────────────────────────────────────────────────

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/**
 * @returns true nếu ĐƯỢC phép, false nếu vượt giới hạn.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

// Dọn các bucket hết hạn định kỳ để tránh phình bộ nhớ
setInterval(() => {
  const now = Date.now();
  for (const [key, b] of buckets) {
    if (now > b.resetAt) buckets.delete(key);
  }
}, 60_000).unref?.();
