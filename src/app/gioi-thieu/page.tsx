export const metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-bamboo-800">
        Câu chuyện Động tiêu Bá Uôn
      </h1>

      <div className="mt-6 space-y-4 leading-relaxed text-bamboo-700">
        <p>
          Những ngày đầu, Bá Uôn cũng là người thích động tiêu và đi mua về để
          trải nghiệm, rồi nhận ra rất nhiều cây tiêu rất khó thổi, khó điều
          khiển, âm thanh phô — mặc dù giá không hề rẻ.
        </p>
        <p>
          Không thỏa mãn với những sản phẩm mua từ thị trường, anh một mình mày
          mò, đêm ngày nghiên cứu cách chế tạo động tiêu: thử nghiệm các loại
          trúc, cách xử lý thân trúc để chống mối mọt, nứt vỡ do thời tiết, và
          làm sao để người dùng thổi không chỉ chuẩn âm, đủ quãng mà còn cho ra
          những màu âm hay, chất chứa cảm xúc.
        </p>
        <p>
          Sau hơn 3 năm miệt mài, thành quả mang lại cho Bá Uôn không hề nhỏ —
          hàng loạt cây động tiêu, sáo trúc cực kỳ hay đã ra đời, tủ kệ sản phẩm
          mỗi ngày một nhiều thêm. Nhưng trong lòng thực sự không muốn bán những
          cây tiêu, cây sáo quý giá đã bao ngày đêm nắn nót từng mũi dao để làm
          ra; có lúc không thổi mà chỉ mang ra ngắm nhìn cũng thấy vui.
        </p>
        <p>
          Rồi một ngày, Bá Uôn nghĩ: những sản phẩm tuyệt vời nếu chỉ giữ riêng
          mình thì thật ích kỷ. Vì vậy anh quyết định chia sẻ niềm đam mê với mọi
          người, để những sản phẩm thực sự chất lượng đến với những ai có duyên
          gặp được <em>(số lượng chỉ có hạn)</em>.
        </p>

        <h2 className="pt-2 font-serif text-xl font-bold text-bamboo-800">
          Cam kết về chất lượng
        </h2>
        <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Mỗi cây tiêu được <strong>chuẩn âm thanh, khớp beat, dễ thổi, đủ
              quãng</strong>
            </li>
            <li>
              Chế tác <strong>tỉ mỉ, chuẩn kích thước Lỗ Ban</strong>, cân bằng
              khi dựng trên mặt phẳng
            </li>
            <li>
              Mỗi cây tiêu, sáo được <strong>thổi thử</strong> để nghe âm thanh
              thật trước khi chọn mua
            </li>
            <li>
              <strong>Đổi trả trong vòng 15 ngày</strong> nếu phát hiện sản phẩm
              lỗi do người bán
            </li>
          </ul>
          <figure className="m-0 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gioi-thieu/sao-hoan-thien.jpg"
              alt="Cây sáo trúc hoàn thiện"
              className="mx-auto max-h-[440px] w-auto rounded-2xl border border-bamboo-200 bg-white"
            />
            <figcaption className="mt-2 text-center text-xs text-bamboo-500">
              Một cây sáo trúc hoàn thiện
            </figcaption>
          </figure>
        </div>

        <p>
          Chúng tôi tin rằng mua một cây động tiêu, cây sáo không nên chỉ nhìn
          ảnh — mà phải được <strong>nghe</strong>. Vì thế mỗi sản phẩm đều kèm
          video thổi thử để bạn cảm nhận âm sắc thật trước khi quyết định.
        </p>
      </div>
    </div>
  );
}
