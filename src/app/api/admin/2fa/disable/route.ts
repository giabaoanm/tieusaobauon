import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn, verifyTotp, disable2FA } from "@/lib/admin-auth";

export const runtime = "nodejs";

// Tắt 2FA: cần nhập mã 6 số hiện tại để xác nhận chính chủ.
export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  if (!(await verifyTotp((body.code || "").trim()))) {
    return NextResponse.json(
      { error: "Mã 2FA không đúng." },
      { status: 400 },
    );
  }

  try {
    await disable2FA();
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "Lỗi tắt 2FA." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
