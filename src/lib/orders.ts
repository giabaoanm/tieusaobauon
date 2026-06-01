import "server-only";
import { promises as fs } from "fs";
import path from "path";

// ──────────────────────────────────────────────────────────────
// Lưu trữ đơn hàng phía server (Sprint 2: ghi ra file JSON).
// Sprint 3+ sẽ thay bằng Supabase/PostgreSQL.
// LƯU Ý: file JSON chỉ phù hợp môi trường dev/máy chủ có ổ đĩa
// bền (không dùng được trên serverless như Vercel — sẽ chuyển DB).
// ──────────────────────────────────────────────────────────────

export type PaymentMethod = "cod" | "vietqr" | "vnpay";
export type OrderStatus = "new" | "confirmed" | "shipping" | "done" | "canceled";
export type PaymentStatus = "pending" | "paid";

export interface OrderItem {
  productId: string;
  name: string;
  price: number; // giá tại thời điểm mua (tính lại từ server)
  qty: number;
}

export interface Order {
  orderCode: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function readAll(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

// Sinh mã đơn dạng TA-XXXXXX (dễ đọc, không lộ số thứ tự)
export function generateOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TA-${code}`;
}

export async function saveOrder(order: Order): Promise<void> {
  const orders = await readAll();
  orders.push(order);
  await writeAll(orders);
}

// Tra cứu đơn theo mã + số điện thoại (cần đúng cả hai để bảo mật)
export async function findOrder(
  code: string,
  phone: string,
): Promise<Order | null> {
  const orders = await readAll();
  const order = orders.find(
    (o) =>
      o.orderCode.toUpperCase() === code.trim().toUpperCase() &&
      o.phone === phone.trim(),
  );
  return order ?? null;
}

// Lấy đơn theo mã (dùng nội bộ: xử lý thanh toán, admin)
export async function getOrderByCode(code: string): Promise<Order | null> {
  const orders = await readAll();
  return (
    orders.find(
      (o) => o.orderCode.toUpperCase() === code.trim().toUpperCase(),
    ) ?? null
  );
}

// Lấy toàn bộ đơn (admin), mới nhất trước
export async function listOrders(): Promise<Order[]> {
  const orders = await readAll();
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// Cập nhật một đơn theo mã
export async function updateOrder(
  code: string,
  patch: Partial<Pick<Order, "orderStatus" | "paymentStatus">>,
): Promise<Order | null> {
  const orders = await readAll();
  const idx = orders.findIndex(
    (o) => o.orderCode.toUpperCase() === code.trim().toUpperCase(),
  );
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...patch };
  await writeAll(orders);
  return orders[idx];
}
