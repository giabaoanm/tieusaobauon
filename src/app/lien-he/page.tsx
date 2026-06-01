export const metadata = { title: "Liên hệ" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-bamboo-800">Liên hệ</h1>
      <p className="mt-3 text-bamboo-700">
        Cần tư vấn chọn sáo/tiêu hợp với bạn? Liên hệ với chúng tôi:
      </p>
      <div className="mt-6 space-y-3 rounded-2xl border border-bamboo-200 bg-white p-6 text-bamboo-800">
        <p>👤 Người liên hệ: Bá Uôn</p>
        <p>
          📞 Gọi điện:{" "}
          <a href="tel:0993666625" className="font-medium hover:underline">
            0993 666 625
          </a>
        </p>
        <p>
          💬 Zalo:{" "}
          <a
            href="https://zalo.me/0993666625"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
          >
            0993 666 625
          </a>
        </p>
        <p>🕘 Giờ làm việc: 8h00 – 20h00 hàng ngày</p>
      </div>
    </div>
  );
}
