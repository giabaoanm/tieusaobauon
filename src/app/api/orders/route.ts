import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";
import {
  Order,
  OrderItem,
  PaymentMethod,
  generateOrderCode,
  saveOrder,
  findOrder,
} from "@/lib/orders";
import { rateLimit } from "@/lib/rate-limit";
import { getVnpayConfig, buildPaymentUrl } from "@/lib/vnpay";

export const runtime = "nodejs"; // cần fs để ghi file

// Phí ship phẳng (Sprint 2). Sau này tính theo khu vực.
const SHIPPING_FEE = 30000;
const VALID_PAYMENTS: PaymentMethod[] = ["cod", "vietqr", "vnpay"];

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Số điện thoại VN: bắt đầu bằng 0, 10 chữ số
function isValidPhone(phone: string): boolean {
  return /^0\d{9}$/.test(phone.trim());
}

function sanitize(s: unknown, max = 500): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

// ── POST: tạo đơn hàng ─────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limit: tối đa 10 đơn / phút / IP
  if (!rateLimit(`order:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json(
      { error: "Bạn thao tác quá nhanh. Vui lòng thử lại sau." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  const customerName = sanitize(data.customerName, 100);
  const phone = sanitize(data.phone, 20);
  const email = sanitize(data.email, 120);
  const address = sanitize(data.address, 300);
  const note = sanitize(data.note, 500);
  const paymentMethod = data.paymentMethod as PaymentMethod;
  const rawItems = Array.isArray(data.items) ? data.items : [];

  // Validate
  if (!customerName) {
    return NextResponse.json({ error: "Vui lòng nhập họ tên." }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { error: "Số điện thoại không hợp lệ (cần 10 số, bắt đầu bằng 0)." },
      { status: 400 },
    );
  }
  if (!address) {
    return NextResponse.json(
      { error: "Vui lòng nhập địa chỉ giao hàng." },
      { status: 400 },
    );
  }
  if (!VALID_PAYMENTS.includes(paymentMethod)) {
    return NextResponse.json(
      { error: "Phương thức thanh toán không hợp lệ." },
      { status: 400 },
    );
  }
  if (rawItems.length === 0) {
    return NextResponse.json({ error: "Giỏ hàng trống." }, { status: 400 });
  }

  // Tính lại giá & kiểm tồn kho từ DỮ LIỆU SERVER (không tin giá client gửi lên)
  const items: OrderItem[] = [];
  for (const raw of rawItems) {
    const r = raw as Record<string, unknown>;
    const product = products.find((p) => p.id === r.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Sản phẩm không tồn tại.` },
        { status: 400 },
      );
    }
    const qty = Math.max(1, Math.min(Number(r.qty) || 1, product.stock));
    items.push({
      productId: product.id,
      name: product.name,
      price: product.price, // giá thật từ server
      qty,
    });
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + SHIPPING_FEE;

  const order: Order = {
    orderCode: generateOrderCode(),
    customerName,
    phone,
    email,
    address,
    note,
    items,
    subtotal,
    shippingFee: SHIPPING_FEE,
    total,
    paymentMethod,
    paymentStatus: "pending",
    orderStatus: "new",
    createdAt: new Date().toISOString(),
  };

  // Với VNPay: kiểm tra cấu hình & tạo URL TRƯỚC khi lưu đơn,
  // tránh tạo đơn rác khi cổng chưa sẵn sàng.
  let payUrl: string | null = null;
  if (paymentMethod === "vnpay") {
    const cfg = getVnpayConfig();
    if (!cfg) {
      return NextResponse.json(
        {
          error:
            "Cổng VNPay chưa được cấu hình. Vui lòng chọn phương thức khác hoặc liên hệ cửa hàng.",
        },
        { status: 503 },
      );
    }
    payUrl = buildPaymentUrl(cfg, {
      orderCode: order.orderCode,
      amount: order.total,
      ipAddr: clientIp(req),
    });
  }

  await saveOrder(order);

  return NextResponse.json({
    orderCode: order.orderCode,
    total: order.total,
    paymentMethod: order.paymentMethod,
    payUrl,
  });
}

// ── GET: tra cứu đơn theo ?code=&phone= ────────────────────────
export async function GET(req: NextRequest) {
  if (!rateLimit(`lookup:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json(
      { error: "Bạn thao tác quá nhanh. Vui lòng thử lại sau." },
      { status: 429 },
    );
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code") ?? "";
  const phone = searchParams.get("phone") ?? "";

  if (!code || !phone) {
    return NextResponse.json(
      { error: "Cần cả mã đơn và số điện thoại." },
      { status: 400 },
    );
  }

  const order = await findOrder(code, phone);
  if (!order) {
    return NextResponse.json(
      { error: "Không tìm thấy đơn hàng khớp." },
      { status: 404 },
    );
  }

  return NextResponse.json({ order });
}
