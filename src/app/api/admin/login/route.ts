import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  verifyPassword,
  verifyTotp,
  is2FAEnabled,
  createSessionToken,
} from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";
import { lockRemainingMs, recordFailure, clearFailures } from "@/lib/login-guard";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  // Chống brute-force tầng 1: giới hạn tần suất
  if (!rateLimit(`admin-login:${ip}`, 8, 60_000)) {
    return NextResponse.json(
      { error: "Bạn thử quá nhiều lần. Vui lòng đợi 1 phút." },
      { status: 429 },
    );
  }

  // Chống brute-force tầng 2: khóa tạm sau nhiều lần sai
  const lockedMs = lockRemainingMs(ip);
  if (lockedMs > 0) {
    const mins = Math.ceil(lockedMs / 60000);
    return NextResponse.json(
      { error: `Đăng nhập bị tạm khóa. Thử lại sau ~${mins} phút.` },
      { status: 429 },
    );
  }

  let body: { password?: string; totp?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const twoFA = await is2FAEnabled();
  const passOk = !!body.password && (await verifyPassword(body.password));
  const totpOk = twoFA ? await verifyTotp(body.totp || "") : true;

  if (!passOk || !totpOk) {
    recordFailure(ip);
    // Thông báo chung chung, không tiết lộ sai ở đâu (chống dò)
    const msg =
      twoFA && passOk && !totpOk
        ? "Mã xác thực 2 lớp không đúng."
        : "Thông tin đăng nhập không đúng.";
    return NextResponse.json({ error: msg }, { status: 401 });
  }

  clearFailures(ip);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 giờ
  });
  return res;
}
