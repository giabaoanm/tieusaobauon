"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export default function Header() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-bamboo-200 bg-bamboo-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🎋</span>
          <span className="font-serif text-xl font-bold text-bamboo-800">
            Trúc Âm
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link href="/" className="hover:text-bamboo-600">
            Trang chủ
          </Link>
          <Link href="/san-pham" className="hover:text-bamboo-600">
            Sản phẩm
          </Link>
          <Link href="/tra-cuu-don-hang" className="hover:text-bamboo-600">
            Tra cứu đơn
          </Link>
          <Link href="/gioi-thieu" className="hover:text-bamboo-600">
            Giới thiệu
          </Link>
          <Link href="/lien-he" className="hover:text-bamboo-600">
            Liên hệ
          </Link>
        </nav>

        <Link
          href="/gio-hang"
          className="relative flex items-center gap-2 rounded-full bg-bamboo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-bamboo-700"
        >
          🛒 <span className="hidden sm:inline">Giỏ hàng</span>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay-600 px-1 text-xs font-bold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
