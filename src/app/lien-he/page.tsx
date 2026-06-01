export const metadata = { title: "Liên hệ" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-bamboo-800">Liên hệ</h1>
      <p className="mt-3 text-bamboo-700">
        Cần tư vấn chọn sáo/tiêu hợp với bạn? Liên hệ với chúng tôi:
      </p>
      <div className="mt-6 space-y-3 rounded-2xl border border-bamboo-200 bg-white p-6 text-bamboo-800">
        <p>📞 Hotline: 0900 000 000</p>
        <p>✉️ Email: lienhe@trucam.vn</p>
        <p>📍 Địa chỉ: Hà Nội, Việt Nam</p>
        <p>🕘 Giờ làm việc: 8h00 – 20h00 hàng ngày</p>
      </div>
      <p className="mt-4 text-sm text-bamboo-600">
        Form liên hệ có CAPTCHA chống spam sẽ được thêm ở Sprint 4 (bảo mật).
      </p>
    </div>
  );
}
