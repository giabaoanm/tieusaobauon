"use client";

import { useState } from "react";

export default function TwoFactorManager({
  initialEnabled,
}: {
  initialEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [step, setStep] = useState<"idle" | "setup">("idle");
  const [qr, setQr] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  // Bắt đầu bật: lấy QR + secret
  async function startSetup() {
    setError("");
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Không tạo được mã QR.");
      else {
        setQr(data.qr);
        setSecret(data.secret);
        setCode("");
        setStep("setup");
      }
    } catch {
      setError("Không kết nối được máy chủ.");
    }
    setLoading(false);
  }

  // Xác nhận bật
  async function confirmEnable() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, code }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Bật 2FA thất bại.");
      else {
        setEnabled(true);
        setStep("idle");
        setMsg("✓ Đã bật đăng nhập 2 lớp! Lần sau đăng nhập sẽ cần mã 6 số.");
      }
    } catch {
      setError("Không kết nối được máy chủ.");
    }
    setLoading(false);
  }

  // Tắt 2FA
  async function disable() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Tắt 2FA thất bại.");
      else {
        setEnabled(false);
        setCode("");
        setMsg("Đã tắt đăng nhập 2 lớp.");
      }
    } catch {
      setError("Không kết nối được máy chủ.");
    }
    setLoading(false);
  }

  const codeInput = (
    <input
      inputMode="numeric"
      maxLength={6}
      value={code}
      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
      placeholder="123456"
      className="w-40 rounded-xl border border-bamboo-300 px-4 py-2.5 text-center font-mono tracking-widest text-bamboo-900 outline-none focus:border-bamboo-500"
    />
  );

  return (
    <div className="max-w-md rounded-2xl border border-bamboo-200 bg-white p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-2xl">🛡️</span>
        <span className="font-semibold text-bamboo-800">
          Trạng thái:{" "}
          {enabled ? (
            <span className="text-bamboo-700">ĐANG BẬT</span>
          ) : (
            <span className="text-clay-700">ĐANG TẮT</span>
          )}
        </span>
      </div>

      {/* Khi đang TẮT */}
      {!enabled && step === "idle" && (
        <>
          <p className="mb-4 text-sm text-bamboo-700">
            Bật để mỗi lần đăng nhập admin cần thêm mã 6 số từ app điện thoại
            (Google Authenticator / Authy) — an toàn hơn nhiều.
          </p>
          <button
            type="button"
            onClick={startSetup}
            disabled={loading}
            className="rounded-full bg-bamboo-600 px-6 py-3 font-medium text-white transition hover:bg-bamboo-700 disabled:opacity-50"
          >
            {loading ? "Đang tạo..." : "Bật đăng nhập 2 lớp"}
          </button>
        </>
      )}

      {/* Bước thiết lập (quét QR) */}
      {!enabled && step === "setup" && (
        <div className="space-y-3">
          <p className="text-sm text-bamboo-700">
            <strong>Bước 1:</strong> Mở app <strong>Google Authenticator</strong>{" "}
            (hoặc Authy) trên điện thoại → bấm <strong>+</strong> →{" "}
            <strong>Quét mã QR</strong> dưới đây:
          </p>
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qr}
              alt="Mã QR 2FA"
              className="mx-auto w-48 rounded-lg border border-bamboo-200"
            />
          )}
          <p className="text-xs text-bamboo-500">
            Không quét được? Nhập tay mã này vào app:{" "}
            <code className="break-all font-mono">{secret}</code>
          </p>
          <p className="text-sm text-bamboo-700">
            <strong>Bước 2:</strong> Nhập mã 6 số đang hiện trên app để xác nhận:
          </p>
          {codeInput}
          {error && <p className="text-sm text-clay-700">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={confirmEnable}
              disabled={loading || code.length !== 6}
              className="rounded-full bg-bamboo-600 px-6 py-2.5 font-medium text-white transition hover:bg-bamboo-700 disabled:opacity-50"
            >
              {loading ? "Đang bật..." : "Xác nhận bật"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("idle");
                setError("");
              }}
              className="rounded-full border border-bamboo-300 px-6 py-2.5 font-medium text-bamboo-700 hover:bg-bamboo-50"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Khi đang BẬT → cho tắt */}
      {enabled && (
        <div className="space-y-3">
          <p className="text-sm text-bamboo-700">
            Đăng nhập 2 lớp đang bảo vệ tài khoản. Muốn tắt thì nhập mã 6 số hiện
            tại để xác nhận:
          </p>
          {codeInput}
          {error && <p className="text-sm text-clay-700">{error}</p>}
          <button
            type="button"
            onClick={disable}
            disabled={loading || code.length !== 6}
            className="block rounded-full border border-clay-300 bg-clay-50 px-6 py-2.5 font-medium text-clay-700 transition hover:bg-clay-100 disabled:opacity-50"
          >
            {loading ? "Đang tắt..." : "Tắt đăng nhập 2 lớp"}
          </button>
        </div>
      )}

      {msg && (
        <div className="mt-4 rounded-xl border border-bamboo-300 bg-bamboo-50 px-4 py-2.5 text-sm text-bamboo-800">
          {msg}
        </div>
      )}
    </div>
  );
}
