import { Product } from "@/lib/types";

// ──────────────────────────────────────────────────────────────
// DỮ LIỆU SẢN PHẨM MẪU (Sprint 1)
// Ở Sprint 2+ sẽ thay bằng truy vấn từ Supabase/PostgreSQL.
// Ảnh dùng tạm Unsplash; video dùng tạm YouTube embed (thay bằng
// video thổi thử thật của shop sau).
// ──────────────────────────────────────────────────────────────

export const products: Product[] = [
  {
    id: "1",
    slug: "sao-truc-do-c5",
    name: "Sáo trúc Đô (C5) — Trúc tím cao cấp",
    type: "sao_truc",
    tone: "C",
    toneLabel: "Đô (C5)",
    lengthCm: 62,
    diameterMm: 22,
    price: 350000,
    stock: 12,
    imageMain:
      "https://images.unsplash.com/photo-1558583055-d7ac00b1adca?w=800&q=80",
    imageDetail:
      "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    description:
      "Sáo trúc tone Đô (C5) làm từ trúc tím già, âm thanh trong trẻo, vang đều ở cả 3 quãng. Lỗ bấm chuẩn, phù hợp cho người mới học lẫn người chơi lâu năm.",
    featured: true,
  },
  {
    id: "2",
    slug: "sao-truc-re-d5",
    name: "Sáo trúc Rê (D5) — Trúc ngà truyền thống",
    type: "sao_truc",
    tone: "D",
    toneLabel: "Rê (D5)",
    lengthCm: 58,
    diameterMm: 21,
    price: 320000,
    stock: 8,
    imageMain:
      "https://images.unsplash.com/photo-1571974599782-87624638275e?w=800&q=80",
    imageDetail:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
    description:
      "Sáo Rê (D5) tone phổ biến nhất, dễ thổi, hợp đệm hát và độc tấu. Trúc ngà được xử lý chống mối mọt, độ bền cao.",
    featured: true,
  },
  {
    id: "3",
    slug: "dong-tieu-truc-sol-g4",
    name: "Động tiêu trúc Sol (G4) — 8 lỗ",
    type: "tieu_truc",
    tone: "G",
    toneLabel: "Sol (G4)",
    lengthCm: 80,
    diameterMm: 26,
    price: 680000,
    stock: 5,
    imageMain:
      "https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=800&q=80",
    imageDetail:
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/4xDzrJKXOOY",
    description:
      "Động tiêu trúc tone Sol trầm ấm, sâu lắng, mang âm hưởng thiền định. Thiết kế 8 lỗ bấm, đầu thổi hình chữ U (UV) chuẩn tiêu Nam.",
    featured: true,
  },
  {
    id: "4",
    slug: "dong-tieu-truc-fa-f4",
    name: "Động tiêu trúc Fa (F4) — Trúc đốt dài",
    type: "tieu_truc",
    tone: "F",
    toneLabel: "Fa (F4)",
    lengthCm: 85,
    diameterMm: 28,
    price: 750000,
    stock: 3,
    imageMain:
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=800&q=80",
    imageDetail:
      "https://images.unsplash.com/photo-1453090927415-5f45085b65c0?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/lTRiuFIWV54",
    description:
      "Tiêu Fa trầm, âm sắc dày và mộc mạc. Trúc đốt dài hiếm, vân đẹp tự nhiên. Phù hợp người chơi đã quen hơi dài.",
    featured: false,
  },
  {
    id: "5",
    slug: "sao-truc-sol-g5",
    name: "Sáo trúc Sol (G5) — Trúc tím khảm",
    type: "sao_truc",
    tone: "G",
    toneLabel: "Sol (G5)",
    lengthCm: 48,
    diameterMm: 19,
    price: 290000,
    stock: 15,
    imageMain:
      "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=800&q=80",
    imageDetail:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/DWcJFNfaw9c",
    description:
      "Sáo Sol nhỏ gọn, âm cao trong sáng, tiếng réo rắt. Khảm họa tiết tinh xảo ở hai đầu, dễ mang theo.",
    featured: false,
  },
  {
    id: "6",
    slug: "sao-truc-la-a4",
    name: "Sáo trúc La (A4) — Trúc già 3 năm",
    type: "sao_truc",
    tone: "A",
    toneLabel: "La (A4)",
    lengthCm: 54,
    diameterMm: 20,
    price: 310000,
    stock: 9,
    imageMain:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    imageDetail:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/HuFYqnbVbzY",
    description:
      "Sáo La âm sắc cân bằng giữa trầm và bổng. Trúc già phơi đủ nắng 3 năm cho tiếng chắc, ít bị ù.",
    featured: false,
  },
  {
    id: "7",
    slug: "sao-meo-re-d4",
    name: "Sáo Mèo Rê (D4) — Lưỡi gà đồng",
    type: "sao_meo",
    tone: "D",
    toneLabel: "Rê (D4)",
    lengthCm: 40,
    diameterMm: 18,
    price: 250000,
    stock: 11,
    imageMain:
      "https://images.unsplash.com/photo-1483412468200-72182dbbc544?w=800&q=80",
    imageDetail:
      "https://images.unsplash.com/photo-1535992165812-68d1861aa71e?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/qH5El5xH1Yo",
    description:
      "Sáo Mèo Tây Bắc, lưỡi gà bằng đồng, âm thanh đặc trưng vùng cao mượt mà, da diết. Dùng cho nhạc dân tộc H'Mông.",
    featured: false,
  },
  {
    id: "8",
    slug: "sao-bau-do-c4",
    name: "Sáo bầu Đô (C4) — Hồ lô 3 ống",
    type: "sao_bau",
    tone: "C",
    toneLabel: "Đô (C4)",
    lengthCm: 52,
    diameterMm: 24,
    price: 420000,
    stock: 6,
    imageMain:
      "https://images.unsplash.com/photo-1621360841013-c7683c659ec6?w=800&q=80",
    imageDetail:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/y7e-GC6oGhg",
    description:
      "Sáo bầu (Hulusi) bầu hồ lô tự nhiên, 3 ống, âm thanh êm như tiếng hát. Có ống bè tạo bè trầm đặc sắc.",
    featured: false,
  },
];

// Lấy 1 sản phẩm theo slug
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

// Lấy danh sách sản phẩm nổi bật
export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
