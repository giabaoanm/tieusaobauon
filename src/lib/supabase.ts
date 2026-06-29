import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ──────────────────────────────────────────────────────────────
// Kết nối Supabase phía SERVER (dùng service role key).
// Mọi truy cập DB/Storage đều qua server — key bí mật KHÔNG lộ ra
// trình duyệt. Nhờ vậy có thể bật RLS khóa hết truy cập công khai
// (an toàn hơn) mà website vẫn đọc/ghi được qua server.
//
// Cấu hình .env.local:
//   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... (Settings → API → service_role)
// ──────────────────────────────────────────────────────────────

export const PRODUCT_BUCKET = "product-images";

let cached: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase chưa được cấu hình (.env.local).");
  }
  if (!cached) {
    cached = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return cached;
}
