// ──────────────────────────────────────────────────────────────
// ĐÁNH GIÁ / CẢM NHẬN KHÁCH HÀNG
// Chỉ thêm cảm nhận THẬT của khách đã mua (tên + lời nhận xét).
// Mảng rỗng [] thì mục đánh giá tự ẩn.
// ──────────────────────────────────────────────────────────────

export interface Review {
  name: string;
  location?: string;
  rating: number; // 1..5
  text: string;
}

export const reviews: Review[] = [];
