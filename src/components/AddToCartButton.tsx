"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartItem } from "@/lib/cart";

// Nút mua cho sản phẩm độc bản: "Mua ngay" (đi thẳng thanh toán) + "Thêm vào giỏ".
// Mỗi cây độc bản → luôn 1 cây, khóa khi đã bán.

export default function AddToCartButton({
  item,
  sold,
}: {
  item: CartItem;
  sold: boolean;
}) {
  const { add, items } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const inCart = items.some((i) => i.productId === item.productId);

  function handleAdd() {
    if (sold) return;
    if (!inCart) add(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function buyNow() {
    if (sold) return;
    if (!inCart) add(item);
    router.push("/thanh-toan");
  }

  if (sold) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-clay-100 px-6 py-3 font-medium text-clay-700">
        ✕ Đã bán
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={buyNow}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-clay-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-clay-700"
      >
        ⚡ Mua ngay
      </button>
      <button
        type="button"
        onClick={handleAdd}
        disabled={inCart}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-bamboo-600 bg-white px-6 py-3 font-medium text-bamboo-700 transition hover:bg-bamboo-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {inCart ? "✓ Đã có trong giỏ" : added ? "✓ Đã thêm" : "🛒 Thêm vào giỏ"}
      </button>
    </div>
  );
}
