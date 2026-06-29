"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/types";

const SHIPPING_FEE = 30000;

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [payment, setPayment] = useState<"cod" | "vietqr" | "vnpay">("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Chỉ hiện VNPay khi đã bật (đặt NEXT_PUBLIC_VNPAY_ENABLED=1 trên Vercel)
  const vnpayEnabled = process.env.NEXT_PUBLIC_VNPAY_ENABLED === "1";

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          paymentMethod: payment,
          items: items.map((i) => ({ productId: i.productId, qty: 1 })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
        setSubmitting(false);
        return;
      }
      clear();
      // VNPay: chuyển hướng sang cổng thanh toán
      if (data.payUrl) {
        window.location.href = data.payUrl;
        return;
      }
      router.push(
        `/dat-hang-thanh-cong?code=${data.orderCode}&total=${data.total}&method=${data.paymentMethod}`,
      );
    } catch {
      setError("Không kết nối được máy chủ. Vui lòng thử lại.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold text-bamboo-800">
          Giỏ hàng trống
        </h1>
        <p className="mt-3 text-bamboo-700">
          Hãy thêm sản phẩm trước khi đặt hàng.
        </p>
        <Link
          href="/san-pham"
          className="mt-6 inline-block rounded-full bg-bamboo-600 px-6 py-3 font-medium text-white transition hover:bg-bamboo-700"
        >
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 font-serif text-3xl font-bold text-bamboo-800">
        Đặt hàng
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1fr_320px]"
      >
        <div className="space-y-6">
          {/* Thông tin giao hàng */}
          <section className="rounded-2xl border border-bamboo-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-bamboo-800">
              Thông tin giao hàng
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Họ và tên *">
                <input
                  required
                  value={form.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                  className="input"
                  placeholder="Nguyễn Văn A"
                />
              </Field>
              <Field label="Số điện thoại *">
                <input
                  required
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="input"
                  placeholder="0901234567"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="input"
                  placeholder="email@example.com"
                />
              </Field>
              <Field label="Địa chỉ giao hàng *" full>
                <input
                  required
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className="input"
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/TP"
                />
              </Field>
              <Field label="Ghi chú" full>
                <textarea
                  value={form.note}
                  onChange={(e) => update("note", e.target.value)}
                  className="input min-h-20"
                  placeholder="Ghi chú cho người bán (không bắt buộc)"
                />
              </Field>
            </div>
          </section>

          {/* Phương thức thanh toán */}
          <section className="rounded-2xl border border-bamboo-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-bamboo-800">
              Phương thức thanh toán
            </h2>
            <div className="space-y-3">
              <PaymentOption
                active={payment === "cod"}
                onClick={() => setPayment("cod")}
                icon="💵"
                title="Thanh toán khi nhận hàng (COD)"
                desc="Trả tiền mặt cho người giao hàng."
              />
              <PaymentOption
                active={payment === "vietqr"}
                onClick={() => setPayment("vietqr")}
                icon="📱"
                title="Chuyển khoản QR (VietQR)"
                desc="Quét mã QR ngân hàng để chuyển khoản sau khi đặt."
              />
              {vnpayEnabled && (
                <PaymentOption
                  active={payment === "vnpay"}
                  onClick={() => setPayment("vnpay")}
                  icon="🏦"
                  title="VNPay (thẻ ATM / Visa / Mastercard / QR)"
                  desc="Thanh toán online qua cổng VNPay (cả thẻ quốc tế), xác nhận tự động."
                />
              )}
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-clay-300 bg-clay-50 px-4 py-3 text-sm text-clay-700">
              {error}
            </div>
          )}
        </div>

        {/* Tóm tắt */}
        <aside className="h-fit rounded-2xl border border-bamboo-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 font-semibold text-bamboo-800">Đơn hàng</h2>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.productId} className="flex justify-between text-sm">
                <span className="text-bamboo-700">{i.name}</span>
                <span className="shrink-0 font-medium">
                  {formatPrice(i.price)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-bamboo-200 pt-4 text-sm">
            <div className="flex justify-between text-bamboo-700">
              <span>Tạm tính</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-bamboo-700">
              <span>Phí vận chuyển</span>
              <span>{formatPrice(SHIPPING_FEE)}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-bamboo-200 pt-3 text-lg font-bold text-bamboo-900">
            <span>Tổng</span>
            <span className="text-clay-700">
              {formatPrice(total + SHIPPING_FEE)}
            </span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-bamboo-600 px-6 py-3 font-medium text-white transition hover:bg-bamboo-700 disabled:opacity-50"
          >
            {submitting ? "Đang xử lý..." : "Hoàn tất đặt hàng"}
          </button>
        </aside>
      </form>

      {/* style tiện cho input */}
      <style jsx>{`
        :global(.input) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2d0a4;
          background: #fff;
          padding: 0.625rem 0.875rem;
          font-size: 0.95rem;
          color: #45351c;
          outline: none;
        }
        :global(.input:focus) {
          border-color: #a07d3a;
          box-shadow: 0 0 0 3px rgba(160, 125, 58, 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-sm font-medium text-bamboo-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function PaymentOption({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
        active
          ? "border-bamboo-500 bg-bamboo-50"
          : "border-bamboo-200 hover:border-bamboo-300"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span>
        <span className="block font-medium text-bamboo-900">{title}</span>
        <span className="block text-sm text-bamboo-600">{desc}</span>
      </span>
      <span
        className={`ml-auto mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${
          active ? "border-bamboo-600 bg-bamboo-600" : "border-bamboo-300"
        }`}
      />
    </button>
  );
}
