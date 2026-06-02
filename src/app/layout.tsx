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

export const metadata: Metadata = {
  title: {
    default: "Động tiêu Bá Uôn — Động tiêu & sáo trúc thủ công",
    template: "%s | Động tiêu Bá Uôn",
  },
  description:
    "Cửa hàng động tiêu trúc & sáo trúc thủ công, độc bản. Mỗi sản phẩm có video thổi thử, thông tin tone, kích thước rõ ràng.",
  keywords: ["động tiêu", "động tiêu trúc", "tiêu trúc", "sáo trúc", "nhạc cụ truyền thống"],
  openGraph: {
    title: "Động tiêu Bá Uôn — Động tiêu & sáo trúc thủ công",
    description:
      "Động tiêu, sáo trúc thủ công, độc bản. Nghe thử trực tiếp qua video từng cây.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
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
