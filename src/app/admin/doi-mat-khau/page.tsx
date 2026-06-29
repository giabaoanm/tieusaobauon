import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Đổi mật khẩu" };

export default async function ChangePasswordPage() {
  await requireAdmin();
  const configured = isSupabaseConfigured();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold text-bamboo-800">
          Đổi mật khẩu quản trị
        </h1>
        <Link
          href="/admin"
          className="rounded-full border border-bamboo-300 px-4 py-2 text-sm font-medium text-bamboo-700 transition hover:bg-bamboo-50"
        >
          ← Về quản trị
        </Link>
      </div>

      {!configured ? (
        <div className="rounded-xl border border-clay-300 bg-clay-50 px-5 py-4 text-sm text-clay-800">
          Cần kết nối Supabase mới đổi được mật khẩu trên web.
        </div>
      ) : (
        <ChangePasswordForm />
      )}
    </div>
  );
}
