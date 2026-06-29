import Link from "next/link";
import { requireAdmin, is2FAEnabled } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import TwoFactorManager from "@/components/admin/TwoFactorManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Đăng nhập 2 lớp" };

export default async function TwoFactorPage() {
  await requireAdmin();
  const configured = isSupabaseConfigured();
  const enabled = configured ? await is2FAEnabled() : false;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold text-bamboo-800">
          Đăng nhập 2 lớp (2FA)
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
          Cần kết nối Supabase mới bật được 2FA trên web.
        </div>
      ) : (
        <TwoFactorManager initialEnabled={enabled} />
      )}
    </div>
  );
}
