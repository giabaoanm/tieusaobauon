"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/types";

interface OrderView {
  orderCode: string;
  customerName: string;
  address: string;
  items: { name: string; price: number; qty: number }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: "Chờ xử lý",
  confirmed: "Đang vận chuyển",
  shipping: "Đang vận chuyển",
  done: "Kết thúc",
  canceled: "Đã huỷ",
  canceled_customer: "Bạn đã huỷ",
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  vietqr: "Chuyển khoản VietQR",
  vnpay: "VNPay",
};

function LookupContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderView | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [cancelMsg, setCancelMsg] = useState("");

  async function doSearch(c: string, p: string) {
    setError("");
    setCancelMsg("");
    setOrder(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/orders?code=${encodeURIComponent(c)}&phone=${encodeURIComponent(p)}`,
      );
      const data = await res.json();
      if (!res.ok) setError(data.error || "Không tìm thấy đơn.");
      else setOrder(data.order);
    } catch {
      setError("Không kết nối được máy chủ.");
    }
    setLoading(false);
  }

  // Tự điền & tra cứu khi mở từ link trong email (?code=...&phone=...)
  useEffect(() => {
    const c = searchParams.get("code") || "";
    const p = searchParams.get("phone") || "";
    if (c) setCode(c);
    if (p) setPhone(p);
    if (c && p) doSearch(c, p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function handleCancel() {
    if (!order) return;
    if (
      !confirm(
        `Bạn chắc chắn muốn hủy đơn ${order.orderCode}? Thao tác này không thể hoàn lại.`,
      )
    )
      return;
    setCancelMsg("");
    setError("");
    setCanceling(true);
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Hủy đơn thất bại.");
      } else {
        setOrder(data.order);
        setCancelMsg("✓ Đã hủy đơn hàng thành công.");
      }
    } catch {
      setError("Không kết nối được máy chủ.");
    }
    setCanceling(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    doSearch(code, phone);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="font-serif text-3xl font-bold text-bamboo-800">
        Tra cứu đơn hàng
      </h1>
      <p className="mt-2 text-bamboo-700">
        Nhập mã đơn và số điện thoại đã dùng khi đặt hàng.
      </p>

      <form
        onSubmit={handleSearch}
        className="mt-6 flex flex-col gap-3 rounded-2xl border border-bamboo-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6"
      >
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Mã đơn (DH-XXXXXX)"
          className="w-full min-w-0 flex-1 rounded-xl border border-bamboo-300 px-4 py-2.5 text-bamboo-900 outline-none focus:border-bamboo-500"
        />
        <input
          required
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Số điện thoại"
          className="w-full min-w-0 flex-1 rounded-xl border border-bamboo-300 px-4 py-2.5 text-bamboo-900 outline-none focus:border-bamboo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full shrink-0 rounded-xl bg-bamboo-600 px-6 py-2.5 font-medium text-white transition hover:bg-bamboo-700 disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Đang tìm..." : "Tra cứu"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border border-clay-300 bg-clay-50 px-4 py-3 text-sm text-clay-700">
          {error}
        </div>
      )}

      {order && (
        <div className="mt-6 rounded-2xl border border-bamboo-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-sm text-bamboo-600">Mã đơn</span>
              <div className="font-mono text-lg font-bold text-bamboo-900">
                {order.orderCode}
              </div>
            </div>
            <span className="rounded-full bg-bamboo-100 px-3 py-1 text-sm font-medium text-bamboo-800">
              {STATUS_LABELS[order.orderStatus] ?? order.orderStatus}
            </span>
          </div>

          <div className="mt-4 space-y-1 text-sm text-bamboo-700">
            <p>
              <strong>Người nhận:</strong> {order.customerName}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {order.address}
            </p>
            <p>
              <strong>Thanh toán:</strong>{" "}
              {PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod} ·{" "}
              {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
            </p>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="mt-4 space-y-2 border-t border-bamboo-200 pt-4">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 text-bamboo-700">
                  {i.name} <span className="text-bamboo-500">× {i.qty}</span>
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(i.price * i.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1 border-t border-bamboo-200 pt-4 text-sm">
            <div className="flex justify-between text-bamboo-700">
              <span>Tạm tính</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-bamboo-700">
              <span>Phí vận chuyển</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-bold text-bamboo-900">
              <span>Tổng</span>
              <span className="text-clay-700">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Hủy đơn — chỉ khi đơn chưa được xác nhận */}
          {order.orderStatus === "new" && (
            <div className="mt-5 border-t border-bamboo-200 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={canceling}
                className="rounded-full border border-clay-300 bg-clay-50 px-5 py-2.5 text-sm font-medium text-clay-700 transition hover:bg-clay-100 disabled:opacity-50"
              >
                {canceling ? "Đang hủy..." : "Hủy đơn hàng"}
              </button>
              <p className="mt-2 text-xs text-bamboo-500">
                Bạn có thể tự hủy khi đơn còn ở trạng thái “Chờ xử lý”. Sau khi
                shop xác nhận, vui lòng liên hệ shop để hủy.
              </p>
            </div>
          )}

          {cancelMsg && (
            <div className="mt-4 rounded-xl border border-bamboo-300 bg-bamboo-50 px-4 py-2.5 text-sm text-bamboo-800">
              {cancelMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OrderLookupPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Đang tải...</div>}>
      <LookupContent />
    </Suspense>
  );
}
