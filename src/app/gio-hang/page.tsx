"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/types";

export default function CartPage() {
  const { items, total, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mb-4 text-5xl">🛒</div>
        <h1 className="font-serif text-2xl font-bold text-bamboo-800">
          Giỏ hàng trống
        </h1>
        <p className="mt-3 text-bamboo-700">
          Bạn chưa thêm sản phẩm nào. Khám phá các cây sáo, tiêu của chúng tôi
          nhé.
        </p>
        <Link
          href="/san-pham"
          className="mt-6 inline-block rounded-full bg-bamboo-600 px-6 py-3 font-medium text-white transition hover:bg-bamboo-700"
        >
          ← Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-8 font-serif text-3xl font-bold text-bamboo-800">
        Giỏ hàng
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Danh sách sản phẩm */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-2xl border border-bamboo-200 bg-white p-4"
            >
              <Link
                href={`/san-pham/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-bamboo-100"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <Link
                  href={`/san-pham/${item.slug}`}
                  className="font-medium text-bamboo-900 hover:text-bamboo-600"
                >
                  {item.name}
                </Link>
                <p className="mt-0.5 text-sm text-bamboo-600">
                  🎵 {item.toneLabel} · {item.typeLabel}
                </p>
                <p className="text-xs text-bamboo-500">Độc bản · 1 cây</p>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-bold text-clay-700">
                    {formatPrice(item.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="text-sm text-bamboo-500 hover:text-clay-600"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tóm tắt đơn */}
        <aside className="h-fit rounded-2xl border border-bamboo-200 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="mb-4 font-semibold text-bamboo-800">Tóm tắt đơn hàng</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-bamboo-700">
              <span>Tạm tính</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-bamboo-700">
              <span>Phí vận chuyển</span>
              <span>Tính khi đặt hàng</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-bamboo-200 pt-4 text-lg font-bold text-bamboo-900">
            <span>Tổng</span>
            <span className="text-clay-700">{formatPrice(total)}</span>
          </div>

          <Link
            href="/thanh-toan"
            className="mt-6 block rounded-full bg-bamboo-600 px-6 py-3 text-center font-medium text-white transition hover:bg-bamboo-700"
          >
            Tiến hành đặt hàng
          </Link>
          <Link
            href="/san-pham"
            className="mt-3 block text-center text-sm text-bamboo-600 hover:underline"
          >
            ← Tiếp tục mua sắm
          </Link>
        </aside>
      </div>
    </div>
  );
}
