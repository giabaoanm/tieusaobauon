import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ChatWidget from "@/components/ChatWidget";
import { CartProvider } from "@/lib/cart";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = "https://tieutrucviet.com.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Động tiêu Bá Uôn — Động tiêu, sáo trúc thủ công cao cấp",
    template: "%s | Động tiêu Bá Uôn",
  },
  description:
    "Động tiêu Bá Uôn — chuyên động tiêu trúc, tiêu bát khổng, sáo trúc thủ công cao cấp, độc bản. Mỗi cây kèm video thổi thử, chuẩn tone, kích thước Lỗ Ban. Giao toàn quốc.",
  keywords: [
    "động tiêu",
    "động tiêu trúc",
    "động tiêu cao cấp",
    "tiêu bát khổng",
    "tiêu trúc",
    "sáo trúc",
    "sáo trúc cao cấp",
    "nhạc cụ truyền thống",
    "động tiêu Bá Uôn",
    "động tiêu Sơn La",
  ],
  alternates: { canonical: "/" },
  verification: {
    google: "8G8ynWA6T63TUyxAdglbWoocC9i6TiRoi3PdlWbY6uc",
  },
  openGraph: {
    title: "Động tiêu Bá Uôn — Động tiêu, sáo trúc thủ công cao cấp",
    description:
      "Động tiêu trúc, tiêu bát khổng, sáo trúc thủ công, độc bản. Nghe thử trực tiếp qua video từng cây.",
    url: SITE_URL,
    siteName: "Động tiêu Bá Uôn",
    type: "website",
    locale: "vi_VN",
    images: [
      {
        url: "/banner/hero-tien-ong.jpg",
        width: 1360,
        height: 768,
        alt: "Động tiêu Bá Uôn — động tiêu, sáo trúc thủ công",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Động tiêu Bá Uôn — Động tiêu, sáo trúc thủ công cao cấp",
    description:
      "Động tiêu trúc, tiêu bát khổng, sáo trúc thủ công, độc bản.",
    images: ["/banner/hero-tien-ong.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Động tiêu Bá Uôn",
    image: `${SITE_URL}/banner/hero-tien-ong.jpg`,
    logo: `${SITE_URL}/logo-512.png`,
    url: SITE_URL,
    telephone: "+84993666625",
    description:
      "Chuyên động tiêu trúc, tiêu bát khổng, sáo trúc thủ công cao cấp, độc bản.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Số 28, Ngõ Hồ 50, phường Chiềng Sinh",
      addressLocality: "Tỉnh Sơn La",
      addressRegion: "Sơn La",
      addressCountry: "VN",
    },
    sameAs: ["https://www.facebook.com/trinh.ba.uon"],
    priceRange: "₫₫",
  };

  return (
    <html lang="vi" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <GoogleAnalytics />
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
