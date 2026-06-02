// Thay sản phẩm demo cũ bằng 5 ô sản phẩm nổi bật (ảnh thật của shop).
// Chạy: node scripts/seed-featured.mjs
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

// Ảnh thật của shop (đặt trong public/)
const TIEU_IMG = "/banner/dong-tieu-real.jpg";
const TIEU_IMG2 = "/cam-nang/truc-uon-1.jpg";
const SAO_IMG = "/gioi-thieu/sao-hoan-thien.jpg";
const SAO_IMG2 = "/cam-nang/truc-uon-2.jpg";

const rows = [
  {
    slug: "dong-tieu-tone-do-c",
    name: "Động tiêu trúc tone Đô (C)",
    type: "tieu_truc",
    tone: "C",
    price: 750000,
    description:
      "Động tiêu trúc tone Đô (C) — âm trầm ấm, sâu lắng. Chế tác thủ công, chuẩn tone, đứng cân bằng trên mặt phẳng.",
    image_main: TIEU_IMG,
    image_detail: TIEU_IMG2,
  },
  {
    slug: "sao-truc-tone-bb",
    name: "Sáo trúc tone Si giáng (Bb)",
    type: "sao_truc",
    tone: "Bb",
    price: 350000,
    description:
      "Sáo trúc tone Si giáng (Bb) — âm sắc mềm mại, dễ thổi. Chế tác thủ công, chuẩn tone.",
    image_main: SAO_IMG,
    image_detail: SAO_IMG2,
  },
  {
    slug: "dong-tieu-tone-re-d",
    name: "Động tiêu trúc tone Rê (D)",
    type: "tieu_truc",
    tone: "D",
    price: 700000,
    description:
      "Động tiêu trúc tone Rê (D) — phổ biến, dễ thổi, âm thanh trong trẻo mà sâu. Chế tác thủ công, chuẩn tone.",
    image_main: TIEU_IMG,
    image_detail: TIEU_IMG2,
  },
  {
    slug: "dong-tieu-tone-si-b",
    name: "Động tiêu trúc tone Si (B)",
    type: "tieu_truc",
    tone: "B",
    price: 800000,
    description:
      "Động tiêu trúc tone Si (B) — âm trầm sâu, phù hợp người chơi quen hơi dài. Chế tác thủ công, chuẩn tone.",
    image_main: TIEU_IMG,
    image_detail: TIEU_IMG2,
  },
  {
    slug: "sao-truc-tone-la-a",
    name: "Sáo trúc tone La (A)",
    type: "sao_truc",
    tone: "A",
    price: 330000,
    description:
      "Sáo trúc tone La (A) — âm sắc cân bằng giữa trầm và bổng. Chế tác thủ công, chuẩn tone.",
    image_main: SAO_IMG,
    image_detail: SAO_IMG2,
  },
].map((r) => ({
  ...r,
  tone_label: null,
  length_cm: 0,
  diameter_mm: 0,
  sold: false,
  video_url: "",
  featured: true,
  is_active: true,
}));

(async () => {
  // Xóa toàn bộ sản phẩm cũ (demo)
  const { data: old } = await sb
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000")
    .select("id");
  console.log("Đã xóa", (old || []).length, "sản phẩm cũ.");

  const { data, error } = await sb.from("products").insert(rows).select("name");
  if (error) {
    console.error("Lỗi tạo:", error.message);
    process.exit(1);
  }
  console.log("Đã tạo", data.length, "sản phẩm nổi bật:");
  data.forEach((d) => console.log(" -", d.name));
})();
