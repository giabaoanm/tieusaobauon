import { NextRequest, NextResponse } from "next/server";
import { findOrder, updateOrder } from "@/lib/orders";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Khách tự hủy đơn — chỉ khi đơn CHƯA được admin xác nhận (trạng thái "new").
// Cần đúng mã đơn + số điện thoại (xác minh chính chủ).
export async function POST(req: NextRequest) {
  if (!rateLimit(`cancel:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json(
      { error: "Bạn thao tác quá nhanh, thử lại sau." },
      { status: 429 },
    );
  }

  let body: { code?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const code = (body.code || "").trim();
  const phone = (body.phone || "").trim();
  if (!code || !phone) {
    return NextResponse.json(
      { error: "Cần mã đơn và số điện thoại." },
      { status: 400 },
    );
  }

  const order = await findOrder(code, phone);
  if (!order) {
    return NextResponse.json(
      { error: "Không tìm thấy đơn khớp." },
      { status: 404 },
    );
  }

  if (
    order.orderStatus === "canceled" ||
    order.orderStatus === "canceled_customer"
  ) {
    return NextResponse.json(
      { error: "Đơn này đã được hủy trước đó." },
      { status: 400 },
    );
  }
  // Đã xác nhận / đang giao / hoàn tất → không cho tự hủy
  if (order.orderStatus !== "new") {
    return NextResponse.json(
      {
        error:
          "Đơn đã được xác nhận/đang xử lý nên không thể tự hủy. Vui lòng liên hệ shop để được hỗ trợ.",
      },
      { status: 409 },
    );
  }

  const updated = await updateOrder(order.orderCode, {
    orderStatus: "canceled_customer",
  });
  return NextResponse.json({ order: updated });
}
