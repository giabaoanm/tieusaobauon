import { is2FAEnabled, isLoggedIn } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Đăng nhập quản trị" };

export default async function AdminLoginPage() {
  // Đã đăng nhập rồi thì vào thẳng dashboard
  if (await isLoggedIn()) redirect("/admin");

  const twoFactor = is2FAEnabled();

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="rounded-2xl border border-bamboo-200 bg-white p-8">
        <div className="mb-6 text-center">
          <div className="text-4xl">🔐</div>
          <h1 className="mt-2 font-serif text-2xl font-bold text-bamboo-800">
            Đăng nhập quản trị
          </h1>
          <p className="mt-1 text-sm text-bamboo-600">Động tiêu Bá Uôn — khu vực Admin</p>
        </div>

        <AdminLoginForm twoFactor={twoFactor} />
      </div>
    </div>
  );
}
