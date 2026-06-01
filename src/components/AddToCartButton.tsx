"use client";

import { useState } from "react";
import { useCart, CartItem } from "@/lib/cart";

// Nút "Thêm vào giỏ" có chọn số lượng. Dùng ở trang chi tiết sản phẩm.

export default function AddToCartButton({
  item,
}: {
  item: Omit<CartItem, "qty">;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = item.stock <= 0;

  function handleAdd() {
    if (soldOut) return;
    add(item, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Bộ chọn số lượng */}
      <div className="flex items-center rounded-full border border-bamboo-300 bg-white">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 py-2 text-lg text-bamboo-700 disabled:opacity-40"
          disabled={soldOut || qty <= 1}
          aria-label="Giảm số lượng"
        >
          −
        </button>
        <span className="w-8 text-center font-medium">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(item.stock, q + 1))}
          className="px-3 py-2 text-lg text-bamboo-700 disabled:opacity-40"
          disabled={soldOut || qty >= item.stock}
          aria-label="Tăng số lượng"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={soldOut}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-bamboo-600 px-6 py-3 font-medium text-white transition hover:bg-bamboo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {soldOut ? "Tạm hết hàng" : added ? "✓ Đã thêm" : "🛒 Thêm vào giỏ"}
      </button>
    </div>
  );
}
