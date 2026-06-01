"use client";

import { useState } from "react";
import { useCart, CartItem } from "@/lib/cart";

// Nút "Thêm vào giỏ" cho sản phẩm độc bản: luôn 1 cây, khóa khi đã bán.

export default function AddToCartButton({
  item,
  sold,
}: {
  item: CartItem;
  sold: boolean;
}) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.some((i) => i.productId === item.productId);

  function handleAdd() {
    if (sold || inCart) return;
    add(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (sold) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-clay-100 px-6 py-3 font-medium text-clay-700">
        ✕ Đã bán
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={inCart}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-bamboo-600 px-6 py-3 font-medium text-white transition hover:bg-bamboo-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {inCart ? "✓ Đã có trong giỏ" : added ? "✓ Đã thêm" : "🛒 Thêm vào giỏ"}
    </button>
  );
}
