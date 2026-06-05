export const metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-bamboo-800">
        Câu chuyện Động tiêu Bá Uôn
      </h1>

      <div className="mt-6 space-y-4 leading-relaxed text-bamboo-700">
        <p>
          Vào một ngày đầu năm 2021, trong lúc lang thang trên Internet, tôi vô
          tình nghe được tiếng độc tấu của một loại nhạc cụ mộc mạc mà trầm ấm
          đến lạ. Đó không đơn thuần là âm thanh, mà như một vòng tay vỗ về, ấm
          áp và yêu thương, len lỏi vào tận sâu thẳm tâm hồn. Tìm hiểu thêm, tôi
          mới biết đó là tiếng của cây động tiêu.
        </p>
        <p>
          Mong có được những phút giây thư giãn sau công việc, tôi lùng mua vài
          cây động tiêu trên thị trường — từ loại bình thường đến loại cao cấp —
          nhưng không cây nào chạm tới được thứ âm thanh đã khiến lòng tôi rung
          động ngày ấy. Vậy là tôi bắt đầu lặng lẽ mày mò, đêm ngày nghiên cứu
          cách chế tác: thử qua đủ loại trúc, tìm cách xử lý thân trúc để chống
          mối mọt và nứt vỡ theo thời tiết, rồi trăn trở làm sao để người thổi
          không chỉ chuẩn âm, đủ quãng, mà tiếng tiêu còn ngân lên đầy màu sắc và
          cảm xúc.
        </p>
        <p>
          Sau hơn ba năm miệt mài, thành quả mang lại không hề nhỏ. Hàng loạt cây
          động tiêu, sáo trúc với âm thanh thực sự hay đã lần lượt ra đời. Tôi
          yêu quý từng cây tiêu, cây sáo mình đã bao ngày đêm uốn nắn, phơi khô
          rồi gọt giũa nên hình — có lúc chẳng thổi, chỉ mang ra ngắm thôi cũng
          đủ thấy vui trong lòng.
        </p>
        <p>
          Để chia sẻ niềm đam mê này cùng những sản phẩm tâm huyết nhất đến với
          mọi người, tôi lập nên trang này, với mong mỏi được góp một phần nhỏ
          vào việc cùng mọi người tạo nên những giai điệu đẹp, nâng niu và làm
          giàu thêm cho cuộc sống.
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
