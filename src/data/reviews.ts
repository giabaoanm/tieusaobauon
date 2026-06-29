// ──────────────────────────────────────────────────────────────
// ĐÁNH GIÁ / CẢM NHẬN KHÁCH HÀNG
// ⚠️ ĐÂY LÀ NỘI DUNG MẪU — hãy thay bằng cảm nhận THẬT của khách đã mua
//    (gửi tên + lời nhận xét cho người làm web để cập nhật).
//    Nếu để mảng rỗng [] thì mục đánh giá sẽ tự ẩn.
// ──────────────────────────────────────────────────────────────

export interface Review {
  name: string;
  location?: string;
  rating: number; // 1..5
  text: string;
}

export const reviews: Review[] = [
  {
    name: "Anh Minh",
    location: "Hà Nội",
    rating: 5,
    text: "Cây động tiêu tiếng trầm ấm, thổi rất nhẹ hơi mà âm vẫn đầy. Đóng gói cẩn thận, được nghe video thổi thử trước nên rất yên tâm.",
  },
  {
    name: "Chị Lan",
    location: "Đà Nẵng",
    rating: 5,
    text: "Mình mới tập nên hơi lo, nhưng cây sáo chuẩn âm, dễ thổi. Anh chủ tư vấn nhiệt tình, chọn đúng tone hợp với mình.",
  },
  {
    name: "Anh Tuấn",
    location: "TP. HCM",
    rating: 5,
    text: "Hàng thủ công, từng cây một nét riêng. Âm sắc hay, lên nước đẹp. Sẽ ủng hộ shop dài dài.",
  },
];
