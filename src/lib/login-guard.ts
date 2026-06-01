import "server-only";

// ──────────────────────────────────────────────────────────────
// Chống dò mật khẩu (brute-force): khóa tạm theo IP khi sai nhiều lần.
// Lưu trong bộ nhớ (Sprint 4). Sprint sau dùng Redis khi chạy nhiều máy.
// ──────────────────────────────────────────────────────────────

const MAX_FAILS = 5; // số lần sai tối đa
const LOCK_MS = 10 * 60 * 1000; // khóa 10 phút

type Entry = { fails: number; lockedUntil: number };
const store = new Map<string, Entry>();

/** @returns số mili-giây còn bị khóa (0 nếu không bị khóa). */
export function lockRemainingMs(key: string): number {
  const e = store.get(key);
  if (!e) return 0;
  const left = e.lockedUntil - Date.now();
  return left > 0 ? left : 0;
}

/** Ghi nhận 1 lần đăng nhập sai; khóa nếu vượt ngưỡng. */
export function recordFailure(key: string): void {
  const e = store.get(key) ?? { fails: 0, lockedUntil: 0 };
  e.fails += 1;
  if (e.fails >= MAX_FAILS) {
    e.lockedUntil = Date.now() + LOCK_MS;
    e.fails = 0; // reset bộ đếm sau khi khóa
  }
  store.set(key, e);
}

/** Xóa lịch sử sai khi đăng nhập thành công. */
export function clearFailures(key: string): void {
  store.delete(key);
}
