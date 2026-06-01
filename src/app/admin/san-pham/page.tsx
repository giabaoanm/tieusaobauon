import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllProducts } from "@/lib/products-db";
import { isSupabaseConfigured } from "@/lib/supabase";
import AdminProductManager from "@/components/admin/AdminProductManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Quản lý sản phẩm" };

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await getAllProducts();
  const configured = isSupabaseConfigured();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-bold text-bamboo-800">
            Quản lý sản phẩm
          </h1>
          <p className="mt-1 text-bamboo-600">
            Thêm, sửa, xóa sản phẩm hiển thị trên web.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-full border border-bamboo-300 px-4 py-2 text-sm font-medium text-bamboo-700 transition hover:bg-bamboo-50"
        >
          ← Về quản trị đơn
        </Link>
      </div>

      {!configured && (
        <div className="mb-6 rounded-xl border border-clay-300 bg-clay-50 px-5 py-4 text-sm text-clay-800">
          <strong>Chưa kết nối Supabase.</strong> Đang hiển thị dữ liệu mẫu (chỉ
          xem). Để tự thêm/sửa sản phẩm và tải ảnh, hãy làm theo{" "}
          <span className="font-mono">HUONG-DAN-SUPABASE.md</span> để kết nối
          database. Sau khi cấu hình xong, tải lại trang này.
        </div>
      )}

      <AdminProductManager
        initialProducts={products}
        enabled={configured}
      />
    </div>
  );
}
