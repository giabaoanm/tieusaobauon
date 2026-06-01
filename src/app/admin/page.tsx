import { requireAdmin } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/types";
import AdminOrderTable from "@/components/admin/AdminOrderTable";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản trị đơn hàng" };

export default async function AdminPage() {
  await requireAdmin();
  const orders = await listOrders();

  // Thống kê nhanh
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((s, o) => s + o.total, 0);
  const newCount = orders.filter((o) => o.orderStatus === "new").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-bamboo-800">
            Quản trị đơn hàng
          </h1>
          <p className="mt-1 text-bamboo-600">Trúc Âm — khu vực Admin</p>
        </div>
        <AdminLogoutButton />
      </div>

      {/* Thẻ thống kê */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Tổng số đơn" value={String(orders.length)} />
        <StatCard label="Đơn mới chờ xử lý" value={String(newCount)} />
        <StatCard label="Doanh thu đã thu" value={formatPrice(totalRevenue)} />
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-bamboo-300 bg-white p-12 text-center text-bamboo-600">
          Chưa có đơn hàng nào.
        </div>
      ) : (
        <AdminOrderTable orders={orders} />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-bamboo-200 bg-white p-5">
      <div className="text-sm text-bamboo-600">{label}</div>
      <div className="mt-1 text-2xl font-bold text-bamboo-900">{value}</div>
    </div>
  );
}
