import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { isLoggedIn, newTotpSecret } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

// Tạo secret 2FA mới + ảnh QR (chưa lưu — chỉ lưu khi xác nhận mã đúng).
export async function POST() {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Cần kết nối Supabase để bật 2FA." },
      { status: 503 },
    );
  }

  const { secret, otpauth } = newTotpSecret();
  const qr = await QRCode.toDataURL(otpauth); // ảnh QR dạng data URL

  return NextResponse.json({ secret, qr });
}
