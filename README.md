# Trúc Âm — Website bán sáo trúc & động tiêu

Website thương mại điện tử cho nhạc cụ dân tộc thủ công (sáo trúc, động tiêu,
sáo Mèo, sáo bầu). Xem kế hoạch tổng thể tại [KE-HOACH-DU-AN.md](./KE-HOACH-DU-AN.md).

## Công nghệ

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Google Analytics 4** (phân tích người dùng)
- Thanh toán: COD + VietQR + **VNPay** + quốc tế (các Sprint sau)

## Chạy dự án (lần đầu)

> Yêu cầu Node.js 18+ (đã cài sẵn bản 22 tại `~/.local/node`).

```bash
# 1. Cài thư viện
npm install

# 2. Tạo file môi trường từ mẫu
cp .env.local.example .env.local
# (mở .env.local điền NEXT_PUBLIC_GA_ID nếu muốn bật Analytics)

# 3. Chạy server phát triển
npm run dev
```

Mở http://localhost:3000

## Lệnh thường dùng

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | Chạy server phát triển |
| `npm run build` | Build bản production |
| `npm start` | Chạy bản đã build |
| `npm run lint` | Kiểm tra lỗi code |

## Cấu trúc thư mục

```
src/
├── app/                    # Các trang (App Router)
│   ├── layout.tsx          # Layout gốc + GA4 + Header/Footer
│   ├── page.tsx            # Trang chủ
│   ├── san-pham/
│   │   ├── page.tsx        # Danh sách + bộ lọc
│   │   └── [slug]/page.tsx # Chi tiết (2 ảnh, tone, video)
│   ├── gio-hang/           # Giỏ hàng (Sprint 2)
│   ├── gioi-thieu/         # Giới thiệu
│   └── lien-he/            # Liên hệ
├── components/             # Header, Footer, ProductCard, VideoButton...
├── data/products.ts        # Dữ liệu mẫu (sẽ thay bằng Supabase)
└── lib/                    # cart, orders, vietqr, vnpay, admin-auth, rate-limit
```

## Khu vực quản trị (Admin)

- Truy cập: **/admin** (chưa đăng nhập sẽ chuyển sang /admin/login)
- Mật khẩu: đặt ở `ADMIN_PASSWORD` trong `.env.local` — **đổi trước khi dùng thật**
- Chức năng: xem đơn, đổi trạng thái đơn, xác nhận thanh toán

## Thanh toán VNPay

- Điền `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET` (lấy ở sandbox.vnpayment.vn) vào `.env.local`.
- Để trống = ẩn/tắt VNPay (khách vẫn dùng COD, VietQR).
- IPN: cấu hình URL `…/api/payment/vnpay/ipn` trong cổng VNPay (cần tên miền công khai).

## Tiến độ (Sprint)

- [x] **Sprint 1** — Nền tảng + trang sản phẩm (2 ảnh, tone, kích thước, video)
- [x] **Sprint 2** — Giỏ hàng (localStorage) + đặt hàng + COD/VietQR + tra cứu đơn
- [x] **Sprint 3** — VNPay (ký HMAC + IPN) + trang Admin (đăng nhập, quản lý đơn)
- [x] **Sprint 4 (bảo mật)** — bcrypt + 2FA + khóa đăng nhập + CSP/headers (xem [BAO-MAT.md](./BAO-MAT.md))
- [ ] **Sprint 5** — Quốc tế (Stripe/PayPal) + Supabase + SEO + go-live
```
