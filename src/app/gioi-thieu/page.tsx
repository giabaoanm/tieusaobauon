export const metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-bold text-bamboo-800">
        Câu chuyện Động tiêu Bá Uôn
      </h1>

      <div className="mt-6 space-y-4 leading-relaxed text-bamboo-700">
        <p>
          Động tiêu Bá Uôn ra đời từ niềm đam mê cháy bỏng với cây động tiêu —
          thứ thanh âm nhẹ nhàng, êm dịu, chậm rãi và sâu lắng, khiến người thổi
          được thư giãn, người nghe thấy dễ chịu.
        </p>
        <p>
          Những ngày đầu, anh Bá Uôn mua vài cây tiêu về trải nghiệm và nhận ra:
          mỗi loại trúc, mỗi người làm lại cho một kiểu âm thanh khác nhau — mà
          giá tiêu lại khá cao so với sáo. Cuối cùng anh quyết định <strong>tự
          làm</strong> để hiểu tận cùng cây tiêu. Sau hơn một năm mày mò, qua
          không biết bao lần sai hỏng, anh đã làm ra được những cây tiêu ưng ý
          đến mức <em>“đổi cả gia tài cũng không đổi”</em>.
        </p>

        <h2 className="pt-2 font-serif text-xl font-bold text-bamboo-800">
          Cam kết về chất lượng
        </h2>
        <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Mỗi cây <strong>đứng vững được trên mặt phẳng</strong>
            </li>
            <li>
              Chế tác chuẩn <strong>kích thước Lỗ Ban</strong>
            </li>
            <li>
              Lòng trong được{" "}
              <strong>sơn mài bằng sơn mài tự nhiên Nhật Bản</strong>
            </li>
            <li>
              Mỗi cây là <strong>độc bản</strong> — một âm sắc riêng, không cây
              nào giống cây nào
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
