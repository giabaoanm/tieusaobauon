"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Tôi mới chơi, nên chọn tone nào?",
    a: "Người mới thường hợp với sáo tone Đô (C) hoặc Rê (D) vì dễ thổi, hơi nhẹ. Động tiêu tone trầm (D, C) cho âm sâu lắng nhưng cần hơi dài hơn. Bạn cứ nhắn Zalo, shop sẽ tư vấn theo nhu cầu của bạn.",
  },
  {
    q: "Có được nghe thử âm thanh trước khi mua không?",
    a: "Có. Mỗi cây đều kèm video thổi thử bằng chính cây đó (nút “Nghe thử” ở trang sản phẩm), để bạn cảm nhận âm sắc thật trước khi quyết định.",
  },
  {
    q: "Mỗi mẫu có nhiều cây giống nhau không?",
    a: "Không. Mỗi cây là độc bản — chỉ có duy nhất 1 cây, được làm và canh âm thủ công, nên âm sắc và vân trúc mỗi cây một vẻ.",
  },
  {
    q: "Giao hàng và thanh toán thế nào?",
    a: "Shop giao toàn quốc, đóng gói chống va đập. Bạn có thể thanh toán khi nhận hàng (COD) hoặc chuyển khoản VietQR. Phí vận chuyển hiển thị rõ khi đặt hàng.",
  },
  {
    q: "Nếu cây bị lỗi thì sao?",
    a: "Bạn được đổi trả trong 15 ngày nếu sản phẩm có lỗi do người bán, và được hỗ trợ bảo hành với lỗi kỹ thuật. Thông tin từng cây được lưu lại để tra cứu bảo hành về sau.",
  },
  {
    q: "Cách bảo quản động tiêu, sáo trúc?",
    a: "Tránh để nơi quá ẩm hoặc nắng gắt, lau khô sau khi thổi, thi thoảng tra một chút dầu bảo dưỡng. Trúc đã được xử lý chống mối mọt nên khá bền nếu giữ gìn đúng cách.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-14">
      <h2 className="mb-8 text-center font-serif text-2xl font-bold text-bamboo-800">
        Câu hỏi thường gặp
      </h2>
      <div className="space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-bamboo-200 bg-white"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-medium text-bamboo-900 transition hover:bg-bamboo-50"
              >
                <span>{f.q}</span>
                <span
                  className={`shrink-0 text-bamboo-500 transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  ＋
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 leading-relaxed text-bamboo-700">
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
