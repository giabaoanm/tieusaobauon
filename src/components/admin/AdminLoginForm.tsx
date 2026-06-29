"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm({
  twoFactor,
}: {
  twoFactor: boolean;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, totp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Đăng nhập thất bại.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Không kết nối được máy chủ.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-bamboo-700">
          Mật khẩu
        </span>
        <input
          type="password"
          required
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-bamboo-300 px-4 py-2.5 text-bamboo-900 outline-none focus:border-bamboo-500"
          placeholder="••••••••"
        />
      </label>

      {twoFactor && (
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-bamboo-700">
            Mã xác thực 2 lớp (6 số)
          </span>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            value={totp}
            onChange={(e) => setTotp(e.target.value.replace(/\D/g, ""))}
            className="w-full rounded-xl border border-bamboo-300 px-4 py-2.5 font-mono tracking-widest text-bamboo-900 outline-none focus:border-bamboo-500"
            placeholder="123456"
          />
        </label>
      )}

      {error && (
        <div className="rounded-xl border border-clay-300 bg-clay-50 px-4 py-2.5 text-sm text-clay-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-bamboo-600 px-6 py-3 font-medium text-white transition hover:bg-bamboo-700 disabled:opacity-50"
      >
        {loading ? "Đang kiểm tra..." : "Đăng nhập"}
      </button>
    </form>
  );
}
