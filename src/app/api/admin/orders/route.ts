import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/admin-auth";
import { updateOrder, OrderStatus, PaymentStatus } from "@/lib/orders";
import { setProductSold } from "@/lib/products-db";

// Trạng thái đơn coi là "đã xác nhận bán" → đánh dấu cây Đã bán
const SOLD_STATUSES: OrderStatus[] = ["confirmed", "shipping", "done"];

export const runtime = "nodejs";

const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "shipping",
  "done",
  "canceled",
];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid"];

export async function PATCH(req: NextRequest) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  let body: {
    orderCode?: string;
    orderStatus?: OrderStatus;
    paymentStatus?: PaymentStatus;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  if (!body.orderCode) {
    return NextResponse.json({ error: "Thiếu mã đơn." }, { status: 400 });
  }

  const patch: { orderStatus?: OrderStatus; paymentStatus?: PaymentStatus } = {};
  if (body.orderStatus) {
    if (!ORDER_STATUSES.includes(body.orderStatus)) {
      return NextResponse.json(
        { error: "Trạng thái đơn không hợp lệ." },
        { status: 400 },
      );
    }
    patch.orderStatus = body.orderStatus;
  }
  if (body.paymentStatus) {
    if (!PAYMENT_STATUSES.includes(body.paymentStatus)) {
      return NextResponse.json(
        { error: "Trạng thái thanh toán không hợp lệ." },
        { status: 400 },
      );
    }
    patch.paymentStatus = body.paymentStatus;
  }

  const updated = await updateOrder(body.orderCode, patch);
  if (!updated) {
    return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
  }

  // ADMIN xác nhận đơn → đánh dấu các cây trong đơn là "Đã bán".
  // Hủy / về "Mới đặt" → mở bán lại (ô chờ admin thay cây mới).
  if (patch.orderStatus) {
    const makeSold = SOLD_STATUSES.includes(patch.orderStatus);
    for (const it of updated.items) {
      await setProductSold(it.productId, makeSold);
    }
  }

  return NextResponse.json({ order: updated });
}
