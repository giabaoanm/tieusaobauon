# KẾ HOẠCH DỰ ÁN — Website bán nhạc cụ truyền thống (Sáo trúc & Tiêu)

> Công nghệ: **Next.js (tự code)** · Thanh toán: **COD + VietQR + Cổng online (VNPay/MoMo/PayOS) + Quốc tế (Stripe/PayPal)**
> Mục tiêu: Website bán hàng chuyên nghiệp, có phân tích người dùng, giỏ hàng, đặt hàng, thanh toán và bảo mật cao.

---

## 1. TỔNG QUAN & MỤC TIÊU

| Hạng mục | Nội dung |
|---|---|
| Sản phẩm | Sáo trúc, Tiêu trúc (và mở rộng: sáo Mèo, sáo bầu...) |
| Đặc thù | Hàng thủ công, mỗi cây có **tone** riêng, có **video thổi thử** |
| Khách hàng | Người chơi sáo/tiêu, người mới học, mua làm quà, khách quốc tế |
| Mục tiêu KD | Bán hàng online, xây thương hiệu, thu thập dữ liệu hành vi khách |

---

## 2. SƠ ĐỒ TRANG (Sitemap)

```
/                       Trang chủ (sản phẩm nổi bật, danh mục, banner)
/san-pham               Danh sách sản phẩm + bộ lọc (tone / loại / giá)
/san-pham/[slug]        Chi tiết sản phẩm (2 ảnh, tone, kích thước, video)
/gio-hang               Giỏ hàng
/thanh-toan             Đặt hàng + chọn phương thức thanh toán
/dat-hang-thanh-cong    Xác nhận đơn
/tra-cuu-don-hang       Tra cứu đơn theo mã + SĐT
/gioi-thieu             Giới thiệu (câu chuyện thương hiệu, nghệ nhân)
/lien-he                Liên hệ
/admin                  Khu quản trị (đăng nhập riêng, 2FA)
```

---

## 3. MÔ HÌNH DỮ LIỆU (Database Schema)

### Bảng `products` (sản phẩm)
| Trường | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | Khóa chính |
| slug | string | URL thân thiện (vd: `sao-truc-do-c5`) |
| name | string | Tên sản phẩm |
| type | enum | Kiểu: `sao_truc`, `tieu_truc`, `sao_meo`... |
| tone | enum | Tone: C, D, E, F, G, A, B (Đô–Rê–Mi...) |
| length_cm | number | Chiều dài (kích thước) |
| diameter_mm | number | Đường kính |
| price | number | Giá (VND) |
| stock | number | Tồn kho (quan trọng vì hàng thủ công) |
| image_main | string | **Ảnh 1** (ảnh chính) |
| image_detail | string | **Ảnh 2** (ảnh chi tiết) |
| video_url | string | Video thổi thử → nút "Nghe thử" |
| description | text | Mô tả (chất liệu trúc, nghệ nhân...) |
| is_active | bool | Hiện/ẩn |
| created_at | timestamp | |

### Bảng `orders` (đơn hàng)
| Trường | Kiểu | Ghi chú |
|---|---|---|
| id | UUID | |
| order_code | string | Mã đơn để tra cứu |
| customer_name | string | |
| phone | string | |
| email | string | |
| address | text | Địa chỉ giao hàng |
| total | number | Tổng tiền |
| payment_method | enum | `cod`, `vietqr`, `vnpay`, `momo`, `payos`, `stripe`, `paypal` |
| payment_status | enum | `pending`, `paid`, `failed`, `refunded` |
| order_status | enum | `new`, `confirmed`, `packing`, `shipping`, `done`, `canceled` |
| created_at | timestamp | |

### Bảng `order_items` (chi tiết đơn)
`id`, `order_id`, `product_id`, `quantity`, `price_at_purchase`

### Bảng `admins` (quản trị)
`id`, `email`, `password_hash` (bcrypt/argon2), `totp_secret` (2FA), `role`

---

## 4. TRANG CHI TIẾT SẢN PHẨM (yêu cầu cốt lõi)

Bố cục mỗi sản phẩm:

```
┌─────────────────────────────────────────────┐
│  [ Ảnh 1 - chính ]   [ Ảnh 2 - chi tiết ]    │
│                                              │
│  Tên sản phẩm: Sáo trúc Đô (C5)              │
│  ─────────────────────────────────────       │
│  🎵 Tone:        Đô (C5)                      │
│  📏 Kích thước:  Dài 62cm · Ø 22mm           │
│  🎋 Kiểu:        Sáo trúc 6 lỗ                │
│  💰 Giá:         350.000đ                     │
│                                              │
│  [ ▶ Nghe thử (video) ]   [ 🛒 Thêm giỏ ]    │
└─────────────────────────────────────────────┘
```

- Nút **"▶ Nghe thử"** mở **modal/popup** phát video thổi cây sáo đó.
- 3 dòng thông số **Tone / Kích thước / Kiểu** luôn hiển thị rõ dưới 2 ảnh.

---

## 5. TÍNH NĂNG THEO MODULE

### A. Khách hàng (Frontend)
- [ ] Trang chủ + danh mục
- [ ] Lọc/sắp xếp theo **tone, loại, khoảng giá**
- [ ] Tìm kiếm sản phẩm
- [ ] Trang chi tiết (2 ảnh + thông số + nút video)
- [ ] Giỏ hàng (lưu localStorage, giữ khi tải lại)
- [ ] Đặt hàng (form thông tin giao hàng)
- [ ] Thanh toán (4 phương thức — xem mục 6)
- [ ] Tra cứu đơn hàng
- [ ] Responsive (mobile/tablet/desktop)

### B. Quản trị (Admin)
- [ ] Đăng nhập có 2FA
- [ ] CRUD sản phẩm (upload 2 ảnh + video, nhập tone/kích thước/tồn kho)
- [ ] Quản lý đơn hàng (đổi trạng thái)
- [ ] Thống kê doanh thu cơ bản

### C. Phân tích người dùng
- [ ] Tích hợp **Google Analytics 4** (miễn phí) HOẶC **Umami/Plausible** (tự host, riêng tư hơn)
- [ ] Theo dõi: lượt truy cập, sản phẩm xem nhiều, tỉ lệ thêm giỏ → đặt hàng, nguồn traffic
- [ ] (Tùy chọn) Heatmap với Microsoft Clarity (miễn phí)

---

## 6. THANH TOÁN (4 phương thức đã chọn)

| Phương thức | Cách hoạt động | Ghi chú triển khai |
|---|---|---|
| **COD** | Nhận hàng trả tiền | Không cần tích hợp, chỉ tạo đơn `pending` |
| **VietQR** | Hiện mã QR ngân hàng, khách quét chuyển khoản | Sinh QR theo chuẩn VietQR (napas), admin đối soát thủ công hoặc qua webhook ngân hàng |
| **Cổng online VN** | VNPay / MoMo / PayOS | Khuyên dùng **PayOS** hoặc **VNPay** — dễ tích hợp, tự xác nhận qua webhook |
| **Quốc tế** | Stripe / PayPal | Cho khách nước ngoài, thanh toán thẻ quốc tế |

**Nguyên tắc bảo mật thanh toán:**
- KHÔNG tự lưu thông tin thẻ → để cổng xử lý (đạt chuẩn PCI-DSS).
- Xác thực **webhook bằng chữ ký (signature)** để chống giả mạo trạng thái đã thanh toán.
- Đối chiếu số tiền server-side, không tin giá trị gửi từ client.

---

## 7. KIẾN TRÚC KỸ THUẬT

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Người dùng │────▶│  Cloudflare      │────▶│  Next.js App │
│  (Browser)   │     │  (CDN/WAF/DDoS)  │     │  (Vercel)    │
└──────────────┘     └─────────────────┘     └──────┬───────┘
                                                     │
                          ┌──────────────────────────┼─────────────────┐
                          ▼                          ▼                  ▼
                   ┌─────────────┐          ┌────────────────┐  ┌─────────────┐
                   │ PostgreSQL  │          │  Storage        │  │ Cổng        │
                   │ (Supabase)  │          │ (ảnh/video)     │  │ thanh toán  │
                   └─────────────┘          │ Cloudinary/     │  │ (webhook)   │
                                            │ Supabase Storage│  └─────────────┘
                                            └────────────────┘
```

**Stack đề xuất:**
- Frontend + Backend: **Next.js 14+ (App Router)** + **TypeScript** + **Tailwind CSS**
- Database: **PostgreSQL** qua **Supabase** (kèm Auth, Storage)
- ORM: **Prisma** hoặc **Drizzle**
- Lưu ảnh/video: **Cloudinary** (tối ưu ảnh, stream video tốt) hoặc Supabase Storage
- Hosting: **Vercel** (frontend) + **Supabase** (DB)
- CDN/Bảo vệ: **Cloudflare**

---

## 8. BẢO MẬT (chống tấn công) — yêu cầu trọng tâm

| Lớp | Biện pháp |
|---|---|
| **Truyền tải** | Bắt buộc HTTPS/SSL, bật HSTS |
| **Xác thực admin** | Mật khẩu hash bằng **bcrypt/argon2**, **2FA (TOTP)**, session/JWT an toàn |
| **SQL Injection** | Dùng ORM (Prisma) / parameterized query — không nối chuỗi SQL |
| **XSS** | React tự escape; thêm sanitize cho nội dung HTML; **CSP header** |
| **CSRF** | Token CSRF cho form quan trọng; SameSite cookie |
| **Brute-force / spam** | **Rate limiting** theo IP; **CAPTCHA** (Cloudflare Turnstile) ở login & đặt hàng |
| **DDoS / Bot** | Đặt sau **Cloudflare** (WAF + chống DDoS, miễn phí) |
| **Thanh toán** | Không lưu thẻ; xác thực webhook bằng signature; kiểm tiền server-side |
| **Security headers** | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| **Upload file** | Giới hạn loại/dung lượng ảnh-video; quét tên file; lưu ngoài web root |
| **Bí mật** | Biến môi trường (`.env`), không commit khóa API; xoay khóa định kỳ |
| **Vận hành** | Backup DB tự động; cập nhật dependency; log & cảnh báo bất thường; phân quyền RBAC |

---

## 9. LỘ TRÌNH TRIỂN KHAI (theo Sprint)

### Sprint 1 — Nền tảng (tuần 1)
- Khởi tạo dự án Next.js + Tailwind + TypeScript
- Thiết lập Supabase + schema DB (products, orders...)
- Trang danh sách + chi tiết sản phẩm (2 ảnh, tone, kích thước, nút video)

### Sprint 2 — Mua hàng (tuần 2)
- Giỏ hàng (localStorage)
- Form đặt hàng + tạo đơn
- Thanh toán: COD + VietQR trước

### Sprint 3 — Thanh toán nâng cao + Admin (tuần 3)
- Tích hợp cổng VN (PayOS/VNPay) + quốc tế (Stripe/PayPal) qua webhook
- Trang admin: CRUD sản phẩm, quản lý đơn

### Sprint 4 — Phân tích + Bảo mật (tuần 4)
- Google Analytics 4 / Umami + Clarity
- Cloudflare, rate limit, CAPTCHA, security headers, 2FA admin

### Sprint 5 — Hoàn thiện (tuần 5)
- SEO (meta, sitemap, Open Graph), tối ưu tốc độ ảnh/video
- Kiểm thử (đặt hàng thử, thanh toán sandbox), sửa lỗi
- Nội dung thật + go-live

---

## 10. CHI PHÍ DỰ KIẾN (hàng tháng, ước tính)

| Hạng mục | Gói miễn phí | Khi scale |
|---|---|---|
| Vercel (hosting) | Free (đủ khởi đầu) | ~20$/tháng |
| Supabase (DB) | Free 500MB | ~25$/tháng |
| Cloudinary (media) | Free 25GB | theo dung lượng |
| Cloudflare | Free | Free/Pro 20$ |
| Tên miền | — | ~250–800k/năm |
| Cổng thanh toán | Miễn phí setup | Phí theo % giao dịch |

> Giai đoạn đầu gần như **chạy được trên các gói miễn phí**.

---

## 11. BƯỚC TIẾP THEO

1. Chốt tên miền + thông tin thương hiệu (logo, màu sắc, câu chuyện).
2. Chuẩn bị dữ liệu sản phẩm thật (ảnh 2 tấm/sp + video thổi thử).
3. Bắt đầu **Sprint 1** — tôi dựng khung dự án Next.js + trang sản phẩm mẫu.

---
*Tài liệu được tạo tự động — cập nhật khi dự án tiến triển.*
