-- ──────────────────────────────────────────────────────────────
-- Động tiêu Bá Uôn — Lược đồ database Supabase (chạy trong SQL Editor)
-- ──────────────────────────────────────────────────────────────

-- Bảng sản phẩm
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  type        text not null,          -- sao_truc | tieu_truc | khac
  tone        text not null,          -- C D E F G A B
  tone_label  text,                   -- nhãn hiển thị, vd "Đô (C5)"
  length_cm   numeric default 0,      -- kích thước: chiều dài (cm)
  diameter_mm numeric default 0,      -- đường kính miệng thổi (mm)
  weight_g    numeric default 0,      -- trọng lượng (gam)
  loai        text,                   -- loại (tự nhập: trúc tím, bát khổng...)
  price       numeric not null default 0,
  sold        boolean not null default false,  -- mỗi cây độc bản: đã bán?
  image_main  text,
  image_detail text,
  video_url   text,
  description text,
  featured    boolean default false,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

create index if not exists products_active_idx on public.products (is_active, created_at desc);

-- MIGRATION (chạy 1 lần nếu bảng products đã có sẵn, để thêm 2 cột mới):
alter table public.products add column if not exists weight_g numeric default 0;
alter table public.products add column if not exists loai text;

-- Bật RLS và KHÔNG tạo policy công khai:
-- Website chỉ truy cập qua server (service role key) nên dữ liệu
-- không bị đọc/ghi trực tiếp từ ngoài → an toàn hơn.
alter table public.products enable row level security;

-- (Tùy chọn) Thêm vài sản phẩm mẫu để xem thử:
-- insert into public.products (slug,name,type,tone,tone_label,length_cm,diameter_mm,price,sold,image_main,image_detail,video_url,description,featured)
-- values ('sao-truc-do-c5','Sáo trúc Đô (C5)','sao_truc','C','Đô (C5)',62,22,350000,false,
--   'https://...','https://...','https://www.youtube.com/embed/XXXX','Mô tả...',true);

-- ──────────────────────────────────────────────────────────────
-- Bảng đơn hàng (chạy đoạn này để lưu đơn trên Supabase thay cho file)
-- ──────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_code     text unique not null,
  customer_name  text not null,
  phone          text not null,
  email          text,
  address        text not null,
  note           text,
  items          jsonb not null,          -- danh sách sản phẩm trong đơn
  subtotal       numeric not null default 0,
  shipping_fee   numeric not null default 0,
  total          numeric not null default 0,
  payment_method text not null,           -- cod | vietqr | vnpay
  payment_status text not null default 'pending',  -- pending | paid
  order_status   text not null default 'new',      -- new|confirmed|shipping|done|canceled
  created_at     timestamptz default now()
);

create index if not exists orders_created_idx on public.orders (created_at desc);

-- Bật RLS, không policy công khai (chỉ server truy cập qua secret key).
alter table public.orders enable row level security;

-- ──────────────────────────────────────────────────────────────
-- Bảng cấu hình chung (vd: lưu mật khẩu admin để đổi ngay trên web)
-- ──────────────────────────────────────────────────────────────
create table if not exists public.app_settings (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

alter table public.app_settings enable row level security;
