# Bảo mật — Trúc Âm

Tổng hợp các biện pháp bảo mật đã triển khai và việc cần làm khi lên môi trường thật.

## Đã triển khai (trong mã nguồn)

| Hạng mục | Mô tả | Vị trí |
|---|---|---|
| **Băm mật khẩu** | Mật khẩu admin băm bằng **bcrypt** (cost 12), lưu base64 trong `ADMIN_PASSWORD_HASH` | `src/lib/admin-auth.ts` |
| **2FA (TOTP)** | Tùy chọn — bật bằng `ADMIN_TOTP_SECRET`; đăng nhập cần mã 6 số (Google Authenticator/Authy) | `src/lib/admin-auth.ts` |
| **Khóa chống dò mật khẩu** | Sai 5 lần → khóa IP 10 phút | `src/lib/login-guard.ts` |
| **Giới hạn tần suất** | Rate limit cho đặt hàng, tra cứu, đăng nhập | `src/lib/rate-limit.ts` |
| **Phiên đăng nhập** | Cookie `httpOnly` + `SameSite=lax`, token ký HMAC-SHA256 | `src/lib/admin-auth.ts` |
| **Bảo vệ route admin** | Chưa đăng nhập → chuyển login (trang) / 401 (API) | `src/app/admin/*`, `src/app/api/admin/*` |
| **Chống gian lận giá** | Giá & tồn kho tính lại từ server, không tin client | `src/app/api/orders/route.ts` |
| **Xác minh thanh toán** | VNPay return & IPN xác minh chữ ký HMAC-SHA512; đối chiếu số tiền | `src/lib/vnpay.ts` |
| **Tra cứu đơn 2 yếu tố** | Cần đúng mã đơn + SĐT | `src/app/api/orders/route.ts` |
| **Content-Security-Policy** | Chỉ cho phép tài nguyên từ nguồn tin cậy (chống XSS) | `next.config.js` |
| **Security headers** | X-Frame-Options: DENY, nosniff, Referrer-Policy, Permissions-Policy, HSTS; ẩn X-Powered-By | `next.config.js` |
| **Chống injection** | React tự escape; validate & làm sạch đầu vào; không nối chuỗi | toàn bộ API |
| **Không commit bí mật** | `.env.local`, `data/orders.json` đã gitignore | `.gitignore` |

## Cần làm khi lên môi trường thật (production)

- [ ] **Đổi mật khẩu admin**: `node scripts/hash-password.mjs 'MatKhauRatManh#...'` rồi cập nhật `ADMIN_PASSWORD_HASH`.
- [ ] **Đổi `ADMIN_SECRET`** thành chuỗi ngẫu nhiên: `openssl rand -hex 32`.
- [ ] **Bật 2FA**: `node scripts/setup-2fa.mjs`, quét QR, dán `ADMIN_TOTP_SECRET`.
- [ ] **HTTPS bắt buộc** + đặt sau **Cloudflare** (WAF, chống DDoS, lọc bot).
- [ ] **Khóa thật của VNPay** (production, không dùng sandbox); cấu hình URL IPN công khai.
- [ ] Chuyển lưu trữ từ file JSON sang **CSDL** (Supabase/PostgreSQL) — bền & an toàn hơn.
- [ ] **Sao lưu CSDL** định kỳ; bật log & cảnh báo bất thường.
- [ ] Cân nhắc **CAPTCHA** (Cloudflare Turnstile) ở form đặt hàng/đăng nhập.
- [ ] Rà soát lại CSP sau khi thêm dịch vụ mới (đảm bảo không chặn nhầm).

## Ghi chú

- Rate limit & khóa đăng nhập hiện lưu **trong bộ nhớ** — khi chạy nhiều máy chủ cần chuyển sang Redis/Upstash để dùng chung.
- File `data/orders.json` chứa **thông tin khách hàng** — tuyệt đối không đưa lên git/nơi công khai.
