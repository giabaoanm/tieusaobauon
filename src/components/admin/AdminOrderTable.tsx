"use client";

import { Fragment, useState } from "react";
import type { Order, OrderStatus } from "@/lib/orders";
import { formatPrice } from "@/lib/types";

// Thông số sản phẩm kèm theo (để admin biết loại hàng cần gửi)
export type OrderItemInfo = {
  toneLabel: string;
  typeLabel: string;
  loai: string;
  lengthCm: number;
  diameterMm: number;
  weightGrams: number;
};

const PAYMENT_LABELS: Record<string, string> = {
  cod: "COD",
  vietqr: "VietQR",
  vnpay: "VNPay",
};

// Nhãn + màu cho từng trạng thái
function statusBadge(s: OrderStatus): { label: string; cls: string } {
  switch (s) {
    case "new":
      return { label: "Chờ xử lý", cls: "bg-amber-100 text-amber-800" };
    case "shipping":
    case "confirmed":
      return { label: "Đang vận chuyển", cls: "bg-sky-100 text-sky-800" };
    case "done":
      return { label: "Kết thúc", cls: "bg-emerald-100 text-emerald-800" };
    case "canceled_customer":
      return { label: "Khách huỷ", cls: "bg-rose-100 text-rose-700" };
    case "canceled":
      return { label: "Admin huỷ", cls: "bg-rose-100 text-rose-700" };
    default:
      return { label: s, cls: "bg-bamboo-100 text-bamboo-700" };
  }
}

export default function AdminOrderTable({
  orders,
  productInfo,
}: {
  orders: Order[];
  productInfo: Record<string, OrderItemInfo>;
}) {
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
      } else {
        alert(data.error || "Cập nhật thất bại.");
      }
    } finally {
      setBusy(null);
    }
  }

  function cancelOrder(o: Order) {
    if (
      !confirm(
        `Huỷ đơn ${o.orderCode}? Cây trong đơn sẽ được mở bán lại trên web.`,
      )
    )
      return;
    patch(o.orderCode, { orderStatus: "canceled" });
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-bamboo-200 bg-white">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-bamboo-200 text-left text-bamboo-600">
            <th className="px-4 py-3 font-medium">Mã đơn</th>
            <th className="px-4 py-3 font-medium">Khách hàng</th>
            <th className="px-4 py-3 font-medium">Tổng tiền</th>
            <th className="px-4 py-3 font-medium">Thanh toán</th>
            <th className="px-4 py-3 font-medium">Trạng thái</th>
            <th className="px-4 py-3 font-medium">Xử lý</th>
          </tr>
        </thead>
        <tbody>
          {list.map((o) => {
            const isBusy = busy === o.orderCode;
            const s = o.orderStatus;
            const isShipping = s === "shipping" || s === "confirmed";
            const canConfirm = s === "new";
            const canComplete = isShipping;
            const canCancel = s === "new" || isShipping;
            const badge = statusBadge(s);

            return (
              <Fragment key={o.orderCode}>
                <tr className="border-b border-bamboo-100 align-top last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-mono font-semibold text-bamboo-900">
                      {o.orderCode}
                    </div>
                    <div className="text-xs text-bamboo-500">
                      {new Date(o.createdAt).toLocaleString("vi-VN")}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenCode(
                          openCode === o.orderCode ? null : o.orderCode,
                        )
                      }
                      className="mt-1 text-xs text-bamboo-600 hover:underline"
                    >
                      {openCode === o.orderCode ? "Ẩn chi tiết" : "Xem chi tiết"}
                    </button>
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
                      disabled={isBusy}
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
                        ? "✓ Đã thu tiền"
                        : "Xác nhận đã thu (COD)"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badge.cls}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        disabled={isBusy || !canConfirm}
                        onClick={() =>
                          patch(o.orderCode, { orderStatus: "shipping" })
                        }
                        className="rounded-full bg-sky-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-bamboo-200 disabled:text-bamboo-400"
                      >
                        Xác nhận
                      </button>
                      <button
                        type="button"
                        disabled={isBusy || !canComplete}
                        onClick={() =>
                          patch(o.orderCode, { orderStatus: "done" })
                        }
                        className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-bamboo-200 disabled:text-bamboo-400"
                      >
                        Hoàn thành
                      </button>
                      <button
                        type="button"
                        disabled={isBusy || !canCancel}
                        onClick={() => cancelOrder(o)}
                        className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-bamboo-200 disabled:text-bamboo-400"
                      >
                        Huỷ đơn
                      </button>
                    </div>
                  </td>
                </tr>

                {openCode === o.orderCode && (
                  <tr className="bg-bamboo-50">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="grid gap-5 md:grid-cols-2">
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
                          <div className="mb-2 font-medium text-bamboo-800">
                            Sản phẩm cần gửi
                          </div>
                          <ul className="space-y-3">
                            {o.items.map((it, i) => {
                              const info = productInfo[it.productId];
                              const specs: string[] = [];
                              if (info) {
                                const dec = (n: number) =>
                                  String(n).replace(".", ",");
                                if (info.toneLabel)
                                  specs.push(`Tone ${info.toneLabel}`);
                                if (info.lengthCm > 0)
                                  specs.push(`Dài ${dec(info.lengthCm)}cm`);
                                if (info.diameterMm > 0)
                                  specs.push(`Ø ${dec(info.diameterMm)}mm`);
                                if (info.weightGrams > 0)
                                  specs.push(`${dec(info.weightGrams)}g`);
                              }
                              return (
                                <li
                                  key={i}
                                  className="rounded-xl border border-bamboo-200 bg-white p-3"
                                >
                                  <div className="flex justify-between gap-3">
                                    <span className="font-medium text-bamboo-900">
                                      {it.name}
                                    </span>
                                    <span className="shrink-0 font-medium text-clay-700">
                                      {formatPrice(it.price * it.qty)}
                                    </span>
                                  </div>
                                  {info ? (
                                    <div className="mt-1 space-y-0.5 text-xs text-bamboo-600">
                                      <div>
                                        <span className="text-bamboo-500">
                                          Kiểu:{" "}
                                        </span>
                                        {info.typeLabel}
                                        {info.loai && (
                                          <>
                                            {" · "}
                                            <span className="text-bamboo-500">
                                              Loại:{" "}
                                            </span>
                                            {info.loai}
                                          </>
                                        )}
                                      </div>
                                      {specs.length > 0 && (
                                        <div>
                                          <span className="text-bamboo-500">
                                            Thông số:{" "}
                                          </span>
                                          {specs.join(" · ")}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="mt-1 text-xs text-bamboo-400">
                                      (sản phẩm không còn trong danh mục)
                                    </div>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                          <div className="mt-2 flex justify-between border-t border-bamboo-200 pt-2 text-bamboo-600">
                            <span>Phí vận chuyển</span>
                            <span>{formatPrice(o.shippingFee)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
