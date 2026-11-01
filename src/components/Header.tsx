"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/tra-cuu-don-hang", label: "Tra cứu đơn" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Header() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const phone = process.env.NEXT_PUBLIC_PHONE || "";
  const zalo = process.env.NEXT_PUBLIC_ZALO || "";
  const phoneDisplay = phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  const zaloHref = zalo
    ? zalo.startsWith("http")
      ? zalo
      : `https://zalo.me/${zalo}`
    : "";

  return (
    <header className="sticky top-0 z-40 border-b border-bamboo-200 bg-bamboo-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-1 px-3 py-3 sm:gap-2 sm:px-4 sm:py-4">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2" onClick={() => setMenuOpen(false)}>
          <Image
            src="/logo.png"
            alt="Logo Động tiêu Thành Đan"
            width={44}
            height={44}
            priority
            className="h-9 w-9 rounded-full object-cover ring-1 ring-bamboo-300 sm:h-11 sm:w-11"
          />
          <span className="whitespace-nowrap font-serif text-sm font-bold text-bamboo-800 min-[360px]:text-[15px] sm:text-xl md:text-lg lg:text-xl">
            Động tiêu Thành Đan
          </span>
        </Link>

        {/* Menu ngang (máy tính) */}
        <nav className="hidden items-center gap-3 whitespace-nowrap text-sm font-medium md:flex lg:gap-6">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-bamboo-600">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {phone && (
            <a
              href={`tel:${phone}`}
              aria-label={`Gọi ${phoneDisplay}`}
              className="flex items-center gap-1.5 rounded-full border border-bamboo-300 bg-white px-2 py-2 text-sm font-semibold text-bamboo-700 transition hover:bg-bamboo-50 sm:px-3"
            >
              <span aria-hidden>📞</span>
              <span className="hidden lg:inline">{phoneDisplay}</span>
            </a>
          )}
          <Link
            href="/gio-hang"
            className="relative flex items-center gap-2 whitespace-nowrap rounded-full bg-bamboo-600 px-2 py-2 text-sm font-medium text-white transition hover:bg-bamboo-700 sm:px-3 lg:px-4"
            onClick={() => setMenuOpen(false)}
          >
            🛒 <span className="hidden lg:inline">Giỏ hàng</span>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay-600 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {/* Nút menu (điện thoại) */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-8 items-center justify-center rounded-full text-2xl text-bamboo-800 transition hover:bg-bamboo-100 sm:w-10 md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Menu xổ xuống (điện thoại) */}
      {menuOpen && (
        <nav className="border-t border-bamboo-200 bg-bamboo-50 md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-3 font-medium text-bamboo-800 hover:bg-bamboo-100"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {phone && (
              <li>
                <a
                  href={`tel:${phone}`}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-3 font-medium text-bamboo-800 hover:bg-bamboo-100"
                >
                  📞 Gọi: {phoneDisplay}
                </a>
              </li>
            )}
            {zaloHref && (
              <li>
                <a
                  href={zaloHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-3 font-medium text-bamboo-800 hover:bg-bamboo-100"
                >
                  💬 Nhắn Zalo
                </a>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
