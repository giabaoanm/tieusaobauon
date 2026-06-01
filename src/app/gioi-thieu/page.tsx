export const metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-bamboo-800">
        Câu chuyện Động tiêu Bá Uôn
      </h1>
      <div className="mt-6 space-y-4 leading-relaxed text-bamboo-700">
        <p>
          Động tiêu Bá Uôn ra đời từ tình yêu với tiếng sáo, tiếng tiêu — những âm thanh
          mộc mạc gắn liền với hồn quê Việt Nam. Mỗi cây sáo, cây tiêu tại đây
          đều được chế tác thủ công bởi nghệ nhân làng nghề, chọn lọc từ những
          đốt trúc già nhất, phơi nắng đủ năm để cho âm thanh chuẩn và bền.
        </p>
        <p>
          Chúng tôi tin rằng mua một cây sáo không nên chỉ nhìn ảnh — mà phải
          được <strong>nghe</strong>. Vì thế mỗi sản phẩm đều kèm video thổi thử
          để bạn cảm nhận âm sắc thật trước khi quyết định.
        </p>
      </div>
    </div>
  );
}
