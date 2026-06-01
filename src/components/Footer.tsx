export default function Footer() {
  return (
    <footer className="mt-20 border-t border-bamboo-200 bg-bamboo-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🎋</span>
              <span className="font-serif text-lg font-bold text-bamboo-800">
                Động tiêu Bá Uôn
              </span>
            </div>
            <p className="text-sm text-bamboo-700">
              Chuyên cung cấp sáo trúc, động tiêu và nhạc cụ dân tộc thủ công,
              chế tác bởi nghệ nhân làng nghề.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-bamboo-800">Liên kết</h4>
            <ul className="space-y-2 text-sm text-bamboo-700">
              <li>Sản phẩm</li>
              <li>Hướng dẫn chọn sáo</li>
              <li>Chính sách đổi trả</li>
              <li>Tra cứu đơn hàng</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-bamboo-800">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-bamboo-700">
              <li>👤 Bá Uôn</li>
              <li>📞 0993 666 625</li>
              <li>💬 Zalo: 0993 666 625</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-bamboo-200 pt-6 text-center text-xs text-bamboo-600">
          © {new Date().getFullYear()} Động tiêu Bá Uôn. Mọi quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
