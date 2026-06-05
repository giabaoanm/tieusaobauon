// Kiểu dữ liệu dùng chung cho toàn bộ ứng dụng.
// Ở Sprint 1 dữ liệu nằm trong file mẫu; Sprint 2+ sẽ thay bằng Supabase/PostgreSQL.

// Số ô sản phẩm tối đa (mỗi cây là độc bản, đăng từng cây một)
export const MAX_PRODUCTS = 61;

// Tone âm nhạc (nốt gốc của cây sáo/tiêu)
export type Tone =
  | "C"
  | "C#"
  | "D"
  | "E"
  | "F"
  | "G"
  | "G#"
  | "A"
  | "Bb"
  | "B";

// Kiểu/loại sản phẩm
export type ProductType =
  | "sao_truc" // Sáo trúc
  | "tieu_truc" // Động tiêu trúc
  | "khac"; // Sản phẩm khác

export interface Product {
  id: string;
  slug: string; // URL thân thiện, vd: "sao-truc-do-c5"
  name: string;
  type: ProductType;
  tone: Tone;
  toneLabel: string; // Hiển thị: "Đô (C5)"
  lengthCm: number; // Chiều dài (kích thước)
  diameterMm: number; // Đường kính miệng thổi
  weightGrams?: number; // Trọng lượng (gam)
  loai?: string; // Loại (ô tự nhập: vd trúc tím, bát khổng...)
  price: number; // Giá (VND)
  sold: boolean; // Độc bản: đã bán hay còn hàng
  imageMain: string; // Ảnh 1 (ảnh chính)
  imageDetail: string; // Ảnh 2 (ảnh chi tiết)
  videoUrl: string; // Video thổi thử (nút "Nghe thử")
  description: string;
  featured?: boolean; // Sản phẩm nổi bật (hiện trang chủ)
}

// Nhãn hiển thị tiếng Việt cho từng loại sản phẩm
export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  tieu_truc: "Động tiêu trúc",
  sao_truc: "Sáo trúc",
  khac: "Sản phẩm khác",
};

// Nhãn hiển thị cho tone (kèm tên Việt)
export const TONE_LABELS: Record<Tone, string> = {
  C: "Đô (C)",
  "C#": "Đô thăng (C#)",
  D: "Rê (D)",
  E: "Mi (E)",
  F: "Fa (F)",
  G: "Sol (G)",
  "G#": "Sol thăng (G#)",
  A: "La (A)",
  Bb: "Si giáng (Bb)",
  B: "Si (B)",
};

// Định dạng giá tiền VND
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}
