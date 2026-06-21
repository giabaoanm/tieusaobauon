import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import { getAllProducts, getArchivedProducts } from "@/lib/products-db";
import { PRODUCT_TYPE_LABELS, formatPrice } from "@/lib/types";
import AdminOrderTable, {
  type OrderItemInfo,
} from "@/components/admin/AdminOrderTable";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản trị đơn hàng" };

export default async function AdminPage() {
  await requireAdmin();
  const orders = await listOrders();
  // Gồm cả cây đang bán và cây đã lưu trữ (đơn hoàn thành) để chi tiết đơn
  // luôn tra được Tên / Thông số / Loại phục vụ bảo hành.
  const products = [
    ...(await getAllProducts()),
    ...(await getArchivedProducts()),
  ];

  // Bản đồ thông số sản phẩm (để hiện Tên / Thông số / Loại trong chi tiết đơn)
  const productInfo: Record<string, OrderItemInfo> = {};
  for (const p of products) {
    productInfo[p.id] = {
      toneLabel: p.toneLabel,
      typeLabel: PRODUCT_TYPE_LABELS[p.type],
      loai: p.loai || "",
      lengthCm: p.lengthCm,
      diameterMm: p.diameterMm,
      weightGrams: p.weightGrams || 0,
      productCode: p.productCode || "",
    };
  }

  // Phân loại đơn theo 4 nhóm
  const isPending = (s: string) => s === "new";
  const isShipping = (s: string) => s === "shipping" || s === "confirmed";
  const isDone = (s: string) => s === "done";
  const isCanceled = (s: string) =>
    s === "canceled" || s === "canceled_customer";

  const pendingCount = orders.filter((o) => isPending(o.orderStatus)).length;
  const shippingCount = orders.filter((o) => isShipping(o.orderStatus)).length;
  const doneOrders = orders.filter((o) => isDone(o.orderStatus));
  const canceledCount = orders.filter((o) => isCanceled(o.orderStatus)).length;

  // Doanh thu = tổng tiền các đơn đã kết thúc
  const doneRevenue = doneOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-bamboo-800">
            Quản trị đơn hàng
          </h1>
          <p className="mt-1 text-bamboo-600">Động tiêu Bá Uôn — khu vực Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/san-pham"
            className="rounded-full bg-bamboo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-bamboo-700"
          >
            Quản lý sản phẩm
          </Link>
          <Link
            href="/admin/doi-mat-khau"
            className="rounded-full border border-bamboo-300 px-4 py-2 text-sm font-medium text-bamboo-700 transition hover:bg-bamboo-50"
          >
            Đổi mật khẩu
          </Link>
          <Link
            href="/admin/2fa"
            className="rounded-full border border-bamboo-300 px-4 py-2 text-sm font-medium text-bamboo-700 transition hover:bg-bamboo-50"
          >
            Đăng nhập 2 lớp
          </Link>
          <AdminLogoutButton />
        </div>
      </div>

      {/* Bảng theo dõi 4 loại đơn */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Đơn chờ xử lý"
          value={String(pendingCount)}
          tone="amber"
        />
        <StatCard
          label="Đã xác nhận — đang vận chuyển"
          value={String(shippingCount)}
          tone="blue"
        />
        <StatCard
          label="Đơn đã hoàn thành"
          value={String(doneOrders.length)}
          sub={`Doanh thu: ${formatPrice(doneRevenue)}`}
          tone="green"
        />
        <StatCard
          label="Đơn bị huỷ (khách + admin)"
          value={String(canceledCount)}
          tone="red"
        />
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-bamboo-300 bg-white p-12 text-center text-bamboo-600">
          Chưa có đơn hàng nào.
        </div>
      ) : (
        <>
          <p className="mb-3 rounded-xl bg-bamboo-100 px-4 py-2.5 text-sm text-bamboo-700">
            💡 Bấm <strong>“Xác nhận”</strong> → đơn chuyển sang{" "}
            <strong>Đang vận chuyển</strong> (cây tự đánh dấu “Đã bán”). Bấm{" "}
            <strong>“Hoàn thành”</strong> → đơn <strong>Kết thúc</strong> và cộng
            vào doanh thu. <strong>“Huỷ đơn”</strong> sẽ mở bán lại cây.
          </p>
          <AdminOrderTable orders={orders} productInfo={productInfo} />
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  tone = "bamboo",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "amber" | "blue" | "green" | "red" | "bamboo";
}) {
  const tones: Record<string, string> = {
    amber: "border-amber-200 bg-amber-50",
    blue: "border-sky-200 bg-sky-50",
    green: "border-emerald-200 bg-emerald-50",
    red: "border-rose-200 bg-rose-50",
    bamboo: "border-bamboo-200 bg-white",
  };
  return (
    <div className={`rounded-2xl border p-5 ${tones[tone]}`}>
      <div className="text-sm text-bamboo-600">{label}</div>
      <div className="mt-1 text-3xl font-bold text-bamboo-900">{value}</div>
      {sub && <div className="mt-1 text-sm font-medium text-emerald-700">{sub}</div>}
    </div>
  );
}
