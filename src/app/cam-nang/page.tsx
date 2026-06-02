export const metadata = {
  title: "Cẩm nang & chia sẻ",
  description:
    "Những chia sẻ thật từ người làm về động tiêu, sáo trúc: bí mật cái nút sáo, trúc Cao Bằng và trúc Hà Giang.",
};

export default function CamNangPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-serif text-3xl font-bold text-bamboo-800">
        Cẩm nang &amp; chia sẻ
      </h1>
      <p className="mt-2 text-bamboo-700">
        Vài điều rút ra từ những ngày tự tay làm động tiêu, sáo trúc — chia sẻ
        để cùng nhau chơi vui hơn.
      </p>

      {/* Bài 1 */}
      <article className="mt-10 rounded-2xl border border-bamboo-200 bg-white p-6 md:p-8">
        <h2 className="font-serif text-2xl font-bold text-bamboo-800">
          Một bí mật về cây sáo
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-bamboo-700">
          <p>
            Là người mới chơi và mới làm sáo, trong quá trình làm và thổi, tôi
            phát hiện một thứ tác động rất mạnh đến âm sắc cây sáo mà ít người để
            ý: <strong>cái nút sáo</strong>.
          </p>
          <p>
            Mọi người thường chú ý đến chất nứa, chất trúc, cách xử lý, cách
            khoét lỗ thổi, lỗ bấm, lỗ định âm... Nhưng qua nhiều lần thử nghiệm,
            tôi thấy cái nút sáo ảnh hưởng đến âm thanh không kém gì chất trúc
            hay các lỗ khoét:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Chất liệu</strong> làm nút (bằng gì) cho âm mềm hay đanh
              khác nhau
            </li>
            <li>
              <strong>Cách cắt</strong> nút, <strong>bề mặt</strong> nút nhẵn
              hay nhám
            </li>
            <li>
              <strong>Vị trí</strong> nút xa hay gần miệng thổi — tạo cộng hưởng
              âm thanh khác nhau, dễ thổi hay khó thổi, dễ lên quãng hay không
            </li>
          </ul>
          <p>Mọi người cùng thử nghiệm xem nhé!</p>
        </div>
      </article>

      {/* Bài 2 */}
      <article className="mt-8 rounded-2xl border border-bamboo-200 bg-white p-6 md:p-8">
        <h2 className="font-serif text-2xl font-bold text-bamboo-800">
          Được và mất: trúc Cao Bằng và trúc đá Hà Giang
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-bamboo-700">
          <p>
            Chỉ những ai đã từng làm sáo, tiêu từ A–Z bằng hai loại trúc Hà
            Giang và Cao Bằng mới thấu hết nỗi khổ — sướng, được — mất giữa hai
            loại trúc này.
          </p>
          <p>
            <strong>Khi mua:</strong> Trúc Cao Bằng dễ mua, anh em bán giá phải
            chăng, chất đẹp — trắng, bóng, thẳng, dày. Trúc Hà Giang ít người
            bán, khó mua, giá cao hơn Cao Bằng; chất trúc kén, dày chút ở gốc
            nhưng càng lên cao càng mỏng (mỏng hơn Cao Bằng).
          </p>
          <p>
            <strong>Khi uốn nắn:</strong> Trúc Cao Bằng cực dễ nắn. Ngược lại,
            trúc Hà Giang khó vô cùng — đốt to, thân lại zíc zắc. Có lần tôi nắn
            hơn 10 cây thì nứt, nổ mất 4 cây, ngồi cả giờ mới được một cây ưng ý,
            cong cả lưng, ê cả chân.
          </p>
          <p>
            <strong>Về âm thanh:</strong> Nếu thành công sau công đoạn phơi,
            thông nòng, khoét lỗ — trúc Cao Bằng cho độ trầm ấm, êm dịu tuyệt
            vời; còn trúc Hà Giang vừa có độ trầm, vừa thêm chút màu âm cao, hoa
            mỹ đi kèm. Trời thật công bằng với cả vạn vật!
          </p>
        </div>
      </article>
    </div>
  );
}
