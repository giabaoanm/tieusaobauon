export const metadata = {
  title: "Chính sách",
  description:
    "Chính sách bảo hành, đổi trả, vận chuyển và thanh toán của Động tiêu Bá Uôn.",
};

const sections = [
  {
    icon: "🛡️",
    title: "Bảo hành",
    items: [
      "Mỗi cây động tiêu, sáo trúc được kiểm tra và thổi thử kỹ trước khi giao.",
      "Hỗ trợ bảo hành trọn đời với lỗi kỹ thuật do người làm (nứt do xử lý trúc, sai âm…).",
      "Thông tin từng cây được lưu lại để tra cứu, hỗ trợ bảo hành về sau.",
    ],
  },
  {
    icon: "↩️",
    title: "Đổi trả",
    items: [
      "Đổi trả trong vòng 15 ngày nếu sản phẩm có lỗi do người bán.",
      "Sản phẩm đổi trả cần còn nguyên vẹn, chưa qua tác động làm hư hỏng.",
      "Phí vận chuyển đổi trả do lỗi người bán sẽ do shop chịu.",
    ],
  },
  {
    icon: "🚚",
    title: "Vận chuyển",
    items: [
      "Giao hàng toàn quốc qua đơn vị vận chuyển uy tín.",
      "Đóng gói cẩn thận, chống va đập để bảo vệ nhạc cụ.",
      "Hỗ trợ thanh toán khi nhận hàng (COD) để bạn yên tâm.",
    ],
  },
  {
    icon: "🔒",
    title: "Thanh toán & bảo mật",
    items: [
      "Nhận thanh toán COD, chuyển khoản VietQR an toàn.",
      "Thông tin khách hàng được bảo mật, chỉ dùng để xử lý đơn hàng.",
      "Không chia sẻ thông tin của bạn cho bên thứ ba vì mục đích quảng cáo.",
    ],
  },
];

export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-bamboo-800">
        Chính sách mua hàng
      </h1>
      <p className="mt-3 text-bamboo-700">
        Động tiêu Bá Uôn cam kết minh bạch và đặt sự hài lòng của bạn lên hàng
        đầu.
      </p>

      <div className="mt-8 space-y-5">
        {sections.map((s) => (
          <section
            key={s.title}
            className="rounded-2xl border border-bamboo-200 bg-white p-6"
          >
            <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-bamboo-800">
              <span aria-hidden>{s.icon}</span> {s.title}
            </h2>
            <ul className="mt-3 space-y-2 text-bamboo-700">
              {s.items.map((it, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-bamboo-500">•</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-bamboo-300 bg-bamboo-50 p-6 text-bamboo-800">
        <p className="font-medium">Cần hỗ trợ thêm?</p>
        <p className="mt-1 text-sm">
          Gọi / Zalo:{" "}
          <a href="tel:0993666625" className="font-semibold hover:underline">
            0993 666 625
          </a>{" "}
          (8h00 – 20h00 hàng ngày).
        </p>
      </div>
    </div>
  );
}
