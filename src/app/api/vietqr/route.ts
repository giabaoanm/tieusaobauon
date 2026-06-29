import { NextRequest, NextResponse } from "next/server";
import { getVietQRConfig, buildVietQRUrl } from "@/lib/vietqr";

export const runtime = "nodejs";

// Lấy ảnh mã QR VietQR qua server (cùng tên miền) → cho phép tải về
// và hiển thị ổn định. Tham số: ?amount=...&code=...&download=1
export async function GET(req: NextRequest) {
  const cfg = getVietQRConfig();
  if (!cfg) {
    return new NextResponse("VietQR chưa cấu hình", { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const amount = Math.max(0, Number(searchParams.get("amount")) || 0);
  const code = (searchParams.get("code") || "").trim().slice(0, 40);
  const download = searchParams.get("download") === "1";

  try {
    const qrUrl = buildVietQRUrl(cfg, amount, code);
    const upstream = await fetch(qrUrl);
    if (!upstream.ok) {
      return new NextResponse("Không tạo được mã QR", { status: 502 });
    }
    const buf = Buffer.from(await upstream.arrayBuffer());
    const headers: Record<string, string> = {
      "Content-Type": upstream.headers.get("content-type") || "image/png",
      "Cache-Control": "public, max-age=3600",
    };
    if (download) {
      headers["Content-Disposition"] =
        `attachment; filename="ma-qr-${code || "thanh-toan"}.png"`;
    }
    return new NextResponse(buf, { headers });
  } catch {
    return new NextResponse("Lỗi máy chủ", { status: 500 });
  }
}
