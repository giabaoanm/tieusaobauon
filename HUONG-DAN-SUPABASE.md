# Hướng dẫn kết nối Supabase (để tự quản lý sản phẩm + tải ảnh)

Làm 1 lần, khoảng 5–10 phút. Sau khi xong, bạn vào **/admin/san-pham** để tự
thêm/sửa/xóa sản phẩm và tải ảnh — không cần đụng tới code.

> Trong lúc chưa cấu hình, web vẫn chạy bình thường với dữ liệu mẫu.

---

## Bước 1 — Tạo dự án Supabase (miễn phí)

1. Vào https://supabase.com → **Sign in** (đăng nhập bằng GitHub hoặc email).
2. Bấm **New project**.
3. Đặt tên (vd `truc-am`), chọn **Region** gần nhất (Singapore), đặt **Database
   Password** (lưu lại phòng khi cần).
4. Bấm **Create new project**, đợi ~1 phút cho khởi tạo xong.

## Bước 2 — Tạo bảng sản phẩm

1. Trong dự án, mở **SQL Editor** (biểu tượng `</>` bên trái) → **New query**.
2. Mở file `supabase/schema.sql` trong dự án này, **copy toàn bộ** dán vào.
3. Bấm **Run**. Thấy "Success" là xong.

## Bước 3 — Tạo kho ảnh (Storage)

1. Mở **Storage** (bên trái) → **New bucket**.
2. Tên bucket: **`product-images`** (đúng y như vậy).
3. Bật **Public bucket** (để ảnh hiển thị công khai trên web) → **Create**.

## Bước 4 — Lấy khóa kết nối

1. Mở **Project Settings** (bánh răng) → **API**.
2. Copy 2 giá trị:
   - **Project URL** → dán vào `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** (mục *Project API keys*, bấm *Reveal*) → dán vào
     `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **service_role là khóa BÍ MẬT** — chỉ dùng phía server, KHÔNG chia sẻ,
> KHÔNG đưa lên git. (File `.env.local` đã được bỏ qua sẵn.)

## Bước 5 — Dán khóa vào `.env.local`

Mở file `.env.local` ở thư mục dự án, điền:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi....(chuỗi rất dài)
```

## Bước 6 — Khởi động lại server

```bash
export PATH="$HOME/.local/node/bin:$PATH"
npm run dev
```

Mở **http://localhost:3000/admin/san-pham** → giờ nút **“+ Thêm sản phẩm”** đã
bật. Thêm sản phẩm, tải 2 ảnh, dán link video → bấm **Lưu** → sản phẩm hiện ngay
trên web.

---

## Mẹo về video thổi thử

- Đăng video lên **YouTube** (có thể để chế độ *Không công khai / Unlisted*).
- Lấy link dạng nhúng: `https://www.youtube.com/embed/MÃ_VIDEO`
  (MÃ_VIDEO là phần sau `watch?v=` trong link YouTube).
- Dán vào ô **“Link video thổi thử”** khi thêm sản phẩm.

## Khi đưa web lên mạng (sau này)

- Đổi `VNPAY_RETURN_URL` và các URL sang tên miền thật.
- Đặt biến môi trường tương tự trên nền tảng hosting (Vercel…).
- Xem thêm `BAO-MAT.md` để bật 2FA, đổi mật khẩu admin, dùng Cloudflare.
