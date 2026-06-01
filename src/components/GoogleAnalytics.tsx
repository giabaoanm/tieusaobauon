import Script from "next/script";

// ──────────────────────────────────────────────────────────────
// Google Analytics 4 (GA4) — phân tích người dùng vào xem.
// Đặt mã đo lường (Measurement ID, dạng G-XXXXXXX) vào biến môi
// trường NEXT_PUBLIC_GA_ID trong file .env.local.
// Component tự ẩn nếu chưa cấu hình ID (vd: khi chạy local).
// ──────────────────────────────────────────────────────────────

export default function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  // Chưa cấu hình ID → không chèn script (tránh lỗi khi dev)
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
