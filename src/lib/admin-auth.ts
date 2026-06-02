import "server-only";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const SETTINGS_TABLE = "app_settings";
const PW_KEY = "admin_password_hash";

// ──────────────────────────────────────────────────────────────
// Xác thực khu vực quản trị.
// - Mật khẩu: ưu tiên ADMIN_PASSWORD_HASH (bcrypt). Nếu chưa có thì
//   tạm dùng ADMIN_PASSWORD (thô) — KÉM AN TOÀN, chỉ để chạy thử.
// - 2FA (TOTP): bật khi có ADMIN_TOTP_SECRET. Khi bật, đăng nhập cần
//   thêm mã 6 số từ app Authenticator.
// - Phiên: token ký HMAC bằng ADMIN_SECRET, lưu cookie httpOnly.
// ──────────────────────────────────────────────────────────────

export const ADMIN_COOKIE = "admin_session";

function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

// Đọc hash mật khẩu đã lưu trong Supabase (nếu có) — cho phép đổi
// mật khẩu ngay trên web mà không cần sửa biến môi trường.
async function getStoredPasswordHash(): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const sb = getSupabaseAdmin();
    const { data } = await sb
      .from(SETTINGS_TABLE)
      .select("value")
      .eq("key", PW_KEY)
      .maybeSingle();
    return data?.value || null;
  } catch {
    return null;
  }
}

/** Lưu hash mật khẩu mới vào Supabase. */
export async function setAdminPassword(newPassword: string): Promise<void> {
  const hash = bcrypt.hashSync(newPassword, 12);
  const sb = getSupabaseAdmin();
  const { error } = await sb
    .from(SETTINGS_TABLE)
    .upsert({ key: PW_KEY, value: hash, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}

// So khớp mật khẩu với một chuỗi hash (hỗ trợ cả bcrypt thô và base64)
function matchHash(input: string, rawHash: string): boolean {
  let hash = rawHash;
  if (!hash.startsWith("$2")) {
    try {
      const decoded = Buffer.from(hash, "base64").toString("utf8");
      if (decoded.startsWith("$2")) hash = decoded;
    } catch {
      /* giữ nguyên */
    }
  }
  try {
    return bcrypt.compareSync(input, hash);
  } catch {
    return false;
  }
}

/**
 * Kiểm tra mật khẩu nhập vào. Ưu tiên hash đã lưu trên Supabase
 * (đổi được trên web), rồi tới ADMIN_PASSWORD_HASH, cuối cùng mật khẩu thô.
 */
export async function verifyPassword(input: string): Promise<boolean> {
  const stored = await getStoredPasswordHash();
  if (stored) return matchHash(input, stored);

  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (envHash) return matchHash(input, envHash);

  const plain = process.env.ADMIN_PASSWORD;
  if (plain) return timingSafeEqualStr(input, plain);
  return false;
}

/** 2FA có được bật không? */
export function is2FAEnabled(): boolean {
  return !!process.env.ADMIN_TOTP_SECRET;
}

/** Xác minh mã TOTP 6 số. */
export function verifyTotp(code: string): boolean {
  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret) return true; // 2FA tắt → coi như hợp lệ
  if (!code) return false;
  try {
    return authenticator.check(code.trim(), secret);
  } catch {
    return false;
  }
}

/** Sinh token phiên (ký HMAC) để đặt vào cookie sau khi đăng nhập. */
export function createSessionToken(): string {
  const secret = process.env.ADMIN_SECRET || "";
  return crypto.createHmac("sha256", secret).update("admin").digest("hex");
}

/** Xác thực token phiên. */
export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return timingSafeEqualStr(token, createSessionToken());
}

/** Đọc cookie phiên hiện tại và kiểm tra hợp lệ. */
export async function isLoggedIn(): Promise<boolean> {
  const store = await cookies();
  return isValidSession(store.get(ADMIN_COOKIE)?.value);
}

/** Dùng đầu các trang admin: chưa đăng nhập → chuyển sang /admin/login. */
export async function requireAdmin(): Promise<void> {
  if (!(await isLoggedIn())) redirect("/admin/login");
}
