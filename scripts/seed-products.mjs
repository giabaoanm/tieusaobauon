// Nạp 8 sản phẩm mẫu vào Supabase để có dữ liệu thực hành.
// Chạy: node scripts/seed-products.mjs
// (Dùng upsert theo slug nên chạy lại không bị trùng.)

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { loadEnvConfig } = require("@next/env");
const { createClient } = require("@supabase/supabase-js");

loadEnvConfig(process.cwd());
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const img = (id) => `https://images.unsplash.com/${id}?w=800&q=80`;
const yt = (id) => `https://www.youtube.com/embed/${id}`;

const rows = [
  {
    slug: "sao-truc-do-c5", name: "Sáo trúc Đô (C5) — Trúc tím cao cấp",
    type: "sao_truc", tone: "C", tone_label: "Đô (C5)", length_cm: 62, diameter_mm: 22,
    price: 350000, sold: false, image_main: img("photo-1558583055-d7ac00b1adca"),
    image_detail: img("photo-1612225330812-01a9c6b355ec"), video_url: yt("5qap5aO4i9A"),
    description: "Sáo trúc tone Đô (C5) làm từ trúc tím già, âm thanh trong trẻo, vang đều ở cả 3 quãng. Lỗ bấm chuẩn.",
    featured: true,
  },
  {
    slug: "sao-truc-re-d5", name: "Sáo trúc Rê (D5) — Trúc ngà truyền thống",
    type: "sao_truc", tone: "D", tone_label: "Rê (D5)", length_cm: 58, diameter_mm: 21,
    price: 320000, sold: false, image_main: img("photo-1571974599782-87624638275e"),
    image_detail: img("photo-1516280440614-37939bbacd81"), video_url: yt("jfKfPfyJRdk"),
    description: "Sáo Rê (D5) tone phổ biến nhất, dễ thổi, hợp đệm hát và độc tấu. Trúc ngà xử lý chống mối mọt.",
    featured: true,
  },
  {
    slug: "dong-tieu-truc-sol-g4", name: "Động tiêu trúc Sol (G4) — 8 lỗ",
    type: "tieu_truc", tone: "G", tone_label: "Sol (G4)", length_cm: 80, diameter_mm: 26,
    price: 680000, sold: false, image_main: img("photo-1607457561901-e6ec3a6d16cf"),
    image_detail: img("photo-1519892300165-cb5542fb47c7"), video_url: yt("4xDzrJKXOOY"),
    description: "Động tiêu trúc tone Sol trầm ấm, sâu lắng, mang âm hưởng thiền định. 8 lỗ bấm, đầu thổi chữ U.",
    featured: true,
  },
  {
    slug: "dong-tieu-truc-fa-f4", name: "Động tiêu trúc Fa (F4) — Trúc đốt dài",
    type: "tieu_truc", tone: "F", tone_label: "Fa (F4)", length_cm: 85, diameter_mm: 28,
    price: 750000, sold: false, image_main: img("photo-1525201548942-d8732f6617a0"),
    image_detail: img("photo-1453090927415-5f45085b65c0"), video_url: yt("lTRiuFIWV54"),
    description: "Tiêu Fa trầm, âm sắc dày và mộc mạc. Trúc đốt dài hiếm, vân đẹp tự nhiên.",
    featured: false,
  },
  {
    slug: "sao-truc-sol-g5", name: "Sáo trúc Sol (G5) — Trúc tím khảm",
    type: "sao_truc", tone: "G", tone_label: "Sol (G5)", length_cm: 48, diameter_mm: 19,
    price: 290000, sold: false, image_main: img("photo-1465821185615-20b3c2fbf41b"),
    image_detail: img("photo-1574169208507-84376144848b"), video_url: yt("DWcJFNfaw9c"),
    description: "Sáo Sol nhỏ gọn, âm cao trong sáng, tiếng réo rắt. Khảm họa tiết tinh xảo ở hai đầu.",
    featured: false,
  },
  {
    slug: "sao-truc-la-a4", name: "Sáo trúc La (A4) — Trúc già 3 năm",
    type: "sao_truc", tone: "A", tone_label: "La (A4)", length_cm: 54, diameter_mm: 20,
    price: 310000, sold: true, image_main: img("photo-1493225457124-a3eb161ffa5f"),
    image_detail: img("photo-1511192336575-5a79af67a629"), video_url: yt("HuFYqnbVbzY"),
    description: "Sáo La âm sắc cân bằng giữa trầm và bổng. Trúc già phơi đủ nắng 3 năm cho tiếng chắc.",
    featured: false,
  },
];

const { data, error } = await sb
  .from("products")
  .upsert(rows.map((r) => ({ ...r, is_active: true })), { onConflict: "slug" })
  .select("id");

if (error) {
  console.error("Lỗi nạp:", error.message);
  process.exit(1);
}
console.log(`Đã nạp ${data.length} sản phẩm vào Supabase ✅`);
