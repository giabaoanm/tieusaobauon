import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn, verifyPassword, setAdminPassword } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Cần kết nối Supabase để lưu mật khẩu mới." },
      { status: 503 },
    );
  }
  // Chống thử dồn dập
  if (!rateLimit(`change-pw:${clientIp(req)}`, 5, 60_000)) {
    return NextResponse.json(
      { error: "Bạn thao tác quá nhanh, thử lại sau 1 phút." },
      { status: 429 },
    );
  }

  let body: { currentPassword?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const current = body.currentPassword || "";
  const next = body.newPassword || "";

  if (!(await verifyPassword(current))) {
    return NextResponse.json(
      { error: "Mật khẩu hiện tại không đúng." },
      { status: 400 },
    );
  }
  if (next.length < 8) {
    return NextResponse.json(
      { error: "Mật khẩu mới phải có ít nhất 8 ký tự." },
      { status: 400 },
    );
  }
  if (next === current) {
    return NextResponse.json(
      { error: "Mật khẩu mới phải khác mật khẩu cũ." },
      { status: 400 },
    );
  }

  try {
    await setAdminPassword(next);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "Lỗi lưu mật khẩu." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
