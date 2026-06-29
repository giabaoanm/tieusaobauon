"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);

    if (next !== confirm) {
      setError("Mật khẩu mới nhập lại không khớp.");
      return;
    }
    if (next.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Đổi mật khẩu thất bại.");
      } else {
        setDone(true);
        setCurrent("");
        setNext("");
        setConfirm("");
      }
    } catch {
      setError("Không kết nối được máy chủ.");
    }
    setLoading(false);
  }

  const inputCls =
    "w-full rounded-xl border border-bamboo-300 px-4 py-2.5 text-bamboo-900 outline-none focus:border-bamboo-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 rounded-2xl border border-bamboo-200 bg-white p-6"
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-bamboo-700">
          Mật khẩu hiện tại
        </span>
        <input
          type="password"
          required
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className={inputCls}
          placeholder="Mật khẩu đang dùng"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-bamboo-700">
          Mật khẩu mới
        </span>
        <input
          type="password"
          required
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={inputCls}
          placeholder="Ít nhất 8 ký tự"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-bamboo-700">
          Nhập lại mật khẩu mới
        </span>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputCls}
          placeholder="Gõ lại mật khẩu mới"
        />
      </label>

      {error && (
        <div className="rounded-xl border border-clay-300 bg-clay-50 px-4 py-2.5 text-sm text-clay-700">
          {error}
        </div>
      )}
      {done && (
        <div className="rounded-xl border border-bamboo-300 bg-bamboo-50 px-4 py-2.5 text-sm text-bamboo-800">
          ✓ Đổi mật khẩu thành công! Lần sau đăng nhập bằng mật khẩu mới.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-bamboo-600 px-6 py-3 font-medium text-white transition hover:bg-bamboo-700 disabled:opacity-50"
      >
        {loading ? "Đang lưu..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}
