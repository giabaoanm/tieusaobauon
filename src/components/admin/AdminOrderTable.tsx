"use client";

import { Fragment, useState } from "react";
import type { Order, OrderStatus } from "@/lib/orders";
import { formatPrice } from "@/lib/types";

const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Mới đặt" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipping", label: "Đang giao" },
  { value: "done", label: "Hoàn tất" },
  { value: "canceled", label: "Đã hủy" },
];

const PAYMENT_LABELS: Record<string, string> = {
  cod: "COD",
  vietqr: "VietQR",
  vnpay: "VNPay",
};

export default function AdminOrderTable({ orders }: { orders: Order[] }) {
  const [list, setList] = useState(orders);
  const [busy, setBusy] = useState<string | null>(null);
  const [openCode, setOpenCode] = useState<string | null>(null);

  async function patch(
    orderCode: string,
    patch: { orderStatus?: OrderStatus; paymentStatus?: "pending" | "paid" },
  ) {
    setBusy(orderCode);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode, ...patch }),
      });
      const data = await res.json();
      if (res.ok) {
        setList((prev) =>
          prev.map((o) => (o.orderCode === orderCode ? data.order : o)),
        );
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-bamboo-200 bg-white">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-bamboo-200 text-left text-bamboo-600">
            <th className="px-4 py-3 font-medium">Mã đơn</th>
            <th className="px-4 py-3 font-medium">Khách hàng</th>
            <th className="px-4 py-3 font-medium">Tổng tiền</th>
            <th className="px-4 py-3 font-medium">Thanh toán</th>
            <th className="px-4 py-3 font-medium">Trạng thái</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {list.map((o) => (
            <Fragment key={o.orderCode}>
              <tr className="border-b border-bamboo-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="font-mono font-semibold text-bamboo-900">
                    {o.orderCode}
                  </div>
                  <div className="text-xs text-bamboo-500">
                    {new Date(o.createdAt).toLocaleString("vi-VN")}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-bamboo-900">{o.customerName}</div>
                  <div className="text-xs text-bamboo-500">{o.phone}</div>
                </td>
                <td className="px-4 py-3 font-semibold text-clay-700">
                  {formatPrice(o.total)}
                </td>
                <td className="px-4 py-3">
                  <div className="text-bamboo-700">
                    {PAYMENT_LABELS[o.paymentMethod] ?? o.paymentMethod}
                  </div>
                  <button
                    type="button"
                    disabled={busy === o.orderCode}
                    onClick={() =>
                      patch(o.orderCode, {
                        paymentStatus:
                          o.paymentStatus === "paid" ? "pending" : "paid",
                      })
                    }
                    className={`mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      o.paymentStatus === "paid"
                        ? "bg-bamboo-100 text-bamboo-700"
                        : "bg-clay-100 text-clay-700"
                    }`}
                  >
                    {o.paymentStatus === "paid"
                      ? "✓ Đã thanh toán"
                      : "Chưa TT — bấm để xác nhận"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.orderStatus}
                    disabled={busy === o.orderCode}
                    onChange={(e) =>
                      patch(o.orderCode, {
                        orderStatus: e.target.value as OrderStatus,
                      })
                    }
                    className="rounded-lg border border-bamboo-300 bg-white px-2 py-1.5 text-sm text-bamboo-800"
                  >
                    {ORDER_STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCode(openCode === o.orderCode ? null : o.orderCode)
                    }
                    className="text-bamboo-600 hover:underline"
                  >
                    {openCode === o.orderCode ? "Ẩn" : "Chi tiết"}
                  </button>
                </td>
              </tr>
              {openCode === o.orderCode && (
                <tr className="bg-bamboo-50">
                  <td colSpan={6} className="px-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="mb-1 font-medium text-bamboo-800">
                          Giao đến
                        </div>
                        <div className="text-bamboo-700">{o.address}</div>
                        {o.email && (
                          <div className="text-bamboo-600">{o.email}</div>
                        )}
                        {o.note && (
                          <div className="mt-1 text-bamboo-600">
                            Ghi chú: {o.note}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="mb-1 font-medium text-bamboo-800">
                          Sản phẩm
                        </div>
                        <ul className="space-y-1">
                          {o.items.map((it, i) => (
                            <li
                              key={i}
                              className="flex justify-between text-bamboo-700"
                            >
                              <span>
                                {it.name} × {it.qty}
                              </span>
                              <span>{formatPrice(it.price * it.qty)}</span>
                            </li>
                          ))}
                          <li className="flex justify-between border-t border-bamboo-200 pt-1 text-bamboo-600">
                            <span>Phí vận chuyển</span>
                            <span>{formatPrice(o.shippingFee)}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
