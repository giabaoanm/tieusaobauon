/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy: chỉ cho phép tài nguyên từ nguồn tin cậy.
// Dev cần 'unsafe-eval' cho HMR; production siết chặt hơn.
const csp = [
  `default-src 'self'`,
  `base-uri 'self'`,
  `object-src 'none'`,
  `frame-ancestors 'none'`, // chống nhúng iframe (clickjacking)
  `img-src 'self' data: blob: https://img.vietqr.io https://images.unsplash.com https://res.cloudinary.com https://i.ytimg.com https://*.supabase.co`,
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://www.googletagmanager.com`,
  `style-src 'self' 'unsafe-inline'`,
  `font-src 'self' data:`,
  `frame-src https://www.youtube.com https://www.youtube-nocookie.com https://*.vnpayment.vn`,
  `connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com`,
  `form-action 'self' https://*.vnpayment.vn`,
  `upgrade-insecure-requests`,
]
  .join("; ")
  .replace(/\s+/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // HSTS: ép HTTPS (chỉ có tác dụng khi chạy qua HTTPS thật)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // ẩn header X-Powered-By (giảm lộ thông tin)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
