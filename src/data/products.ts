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
    sold: false,
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
    sold: false,
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
    sold: false,
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
    sold: false,
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
    sold: false,
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
    sold: true,
    imageMain:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    imageDetail:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
    videoUrl: "https://www.youtube.com/embed/HuFYqnbVbzY",
    description:
      "Sáo La âm sắc cân bằng giữa trầm và bổng. Trúc già phơi đủ nắng 3 năm cho tiếng chắc, ít bị ù.",
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
