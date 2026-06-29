import { NextRequest, NextResponse } from "next/server";
import { getVnpayConfig, verifyVnpayResponse } from "@/lib/vnpay";
import { getOrderByCode, updateOrder } from "@/lib/orders";

export const runtime = "nodejs";

// ──────────────────────────────────────────────────────────────
// IPN (Instant Payment Notification) — VNPay gọi server-to-server
// để báo kết quả. Đây là NGUỒN XÁC NHẬN CHÍNH THỨC (đáng tin hơn
// return URL của trình duyệt). Phải trả đúng định dạng {RspCode,Message}
// để VNPay biết đã nhận.
// ──────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const cfg = getVnpayConfig();
  if (!cfg) {
    return NextResponse.json({ RspCode: "99", Message: "Unknown error" });
  }

  const { searchParams } = new URL(req.url);
  const query: Record<string, string> = {};
  searchParams.forEach((v, k) => (query[k] = v));

  const result = verifyVnpayResponse(cfg, query);

  // Sai chữ ký → từ chối
  if (!result.valid) {
    return NextResponse.json({ RspCode: "97", Message: "Invalid checksum" });
  }

  const order = await getOrderByCode(result.orderCode);
  if (!order) {
    return NextResponse.json({ RspCode: "01", Message: "Order not found" });
  }

  // Đối chiếu số tiền (chống sửa số tiền)
  if (Math.round(order.total) !== Math.round(result.amount)) {
    return NextResponse.json({ RspCode: "04", Message: "Invalid amount" });
  }

  // Đã xử lý rồi → tránh cập nhật trùng
  if (order.paymentStatus === "paid") {
    return NextResponse.json({
      RspCode: "02",
      Message: "Order already confirmed",
    });
  }

  if (result.success) {
    await updateOrder(result.orderCode, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
    });
  } else {
    await updateOrder(result.orderCode, { orderStatus: "canceled" });
  }

  return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
}
