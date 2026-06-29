import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

// ──────────────────────────────────────────────────────────────
// Lưu trữ đơn hàng.
// - Đã cấu hình Supabase → lưu vào database (chạy được trên hosting).
// - Chưa cấu hình → ghi file JSON cục bộ (chỉ cho dev).
// ──────────────────────────────────────────────────────────────

export type PaymentMethod = "cod" | "vietqr" | "vnpay";
export type OrderStatus =
  | "new" // Chờ xử lý (khách vừa đặt)
  | "confirmed" // (cũ) — coi như đang vận chuyển
  | "shipping" // Đang vận chuyển (admin đã xác nhận)
  | "done" // Kết thúc (admin hoàn thành)
  | "canceled" // Admin huỷ
  | "canceled_customer"; // Khách huỷ
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

const TABLE = "orders";

// Sinh mã đơn dạng DH-XXXXXX (dễ đọc, không lộ số thứ tự)
export function generateOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `DH-${code}`;
}

// ── Ánh xạ DB (snake_case) ↔ Order (camelCase) ────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToOrder(r: any): Order {
  return {
    orderCode: r.order_code,
    customerName: r.customer_name,
    phone: r.phone,
    email: r.email || "",
    address: r.address,
    note: r.note || "",
    items: (r.items as OrderItem[]) || [],
    subtotal: Number(r.subtotal) || 0,
    shippingFee: Number(r.shipping_fee) || 0,
    total: Number(r.total) || 0,
    paymentMethod: r.payment_method,
    paymentStatus: r.payment_status,
    orderStatus: r.order_status,
    createdAt: r.created_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function orderToRow(o: Order) {
  return {
    order_code: o.orderCode,
    customer_name: o.customerName,
    phone: o.phone,
    email: o.email,
    address: o.address,
    note: o.note,
    items: o.items,
    subtotal: o.subtotal,
    shipping_fee: o.shippingFee,
    total: o.total,
    payment_method: o.paymentMethod,
    payment_status: o.paymentStatus,
    order_status: o.orderStatus,
    created_at: o.createdAt,
  };
}

// ── Dự phòng: file JSON cục bộ ────────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function readAllFile(): Promise<Order[]> {
  try {
    return JSON.parse(await fs.readFile(ORDERS_FILE, "utf8")) as Order[];
  } catch {
    return [];
  }
}
async function writeAllFile(orders: Order[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf8");
}

// ── API công khai ─────────────────────────────────────────────

export async function saveOrder(order: Order): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    const { error } = await sb.from(TABLE).insert(orderToRow(order));
    if (error) throw new Error(error.message);
    return;
  }
  const orders = await readAllFile();
  orders.push(order);
  await writeAllFile(orders);
}

// Tra cứu đơn theo mã + số điện thoại (cần đúng cả hai để bảo mật)
export async function findOrder(
  code: string,
  phone: string,
): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    const { data } = await sb
      .from(TABLE)
      .select("*")
      .ilike("order_code", code.trim())
      .eq("phone", phone.trim())
      .maybeSingle();
    return data ? rowToOrder(data) : null;
  }
  const orders = await readAllFile();
  return (
    orders.find(
      (o) =>
        o.orderCode.toUpperCase() === code.trim().toUpperCase() &&
        o.phone === phone.trim(),
    ) ?? null
  );
}

// Lấy đơn theo mã (nội bộ: xử lý thanh toán, admin)
export async function getOrderByCode(code: string): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    const { data } = await sb
      .from(TABLE)
      .select("*")
      .ilike("order_code", code.trim())
      .maybeSingle();
    return data ? rowToOrder(data) : null;
  }
  const orders = await readAllFile();
  return (
    orders.find(
      (o) => o.orderCode.toUpperCase() === code.trim().toUpperCase(),
    ) ?? null
  );
}

// Lấy toàn bộ đơn (admin), mới nhất trước
export async function listOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    const { data } = await sb
      .from(TABLE)
      .select("*")
      .order("created_at", { ascending: false });
    return (data ?? []).map(rowToOrder);
  }
  const orders = await readAllFile();
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// Cập nhật một đơn theo mã
export async function updateOrder(
  code: string,
  patch: Partial<Pick<Order, "orderStatus" | "paymentStatus">>,
): Promise<Order | null> {
  if (isSupabaseConfigured()) {
    const sb = getSupabaseAdmin();
    const row: Record<string, string> = {};
    if (patch.orderStatus) row.order_status = patch.orderStatus;
    if (patch.paymentStatus) row.payment_status = patch.paymentStatus;
    const { data } = await sb
      .from(TABLE)
      .update(row)
      .ilike("order_code", code.trim())
      .select("*")
      .maybeSingle();
    return data ? rowToOrder(data) : null;
  }
  const orders = await readAllFile();
  const idx = orders.findIndex(
    (o) => o.orderCode.toUpperCase() === code.trim().toUpperCase(),
  );
  if (idx === -1) return null;
  orders[idx] = { ...orders[idx], ...patch };
  await writeAllFile(orders);
  return orders[idx];
}
