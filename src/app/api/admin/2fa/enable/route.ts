import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn, checkTotp, enable2FA } from "@/lib/admin-auth";

export const runtime = "nodejs";

// Bật 2FA: xác nhận mã 6 số khớp với secret vừa tạo, rồi mới lưu.
export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  let body: { secret?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const secret = (body.secret || "").trim();
  const code = (body.code || "").trim();
  if (!secret || !code) {
    return NextResponse.json(
      { error: "Thiếu mã hoặc secret." },
      { status: 400 },
    );
  }
  if (!checkTotp(code, secret)) {
    return NextResponse.json(
      { error: "Mã không đúng. Hãy nhập mã đang hiện trên app Authenticator." },
      { status: 400 },
    );
  }

  try {
    await enable2FA(secret);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "Lỗi bật 2FA." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
