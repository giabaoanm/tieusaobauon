import Link from "next/link";
import { getVnpayConfig, verifyVnpayResponse } from "@/lib/vnpay";
import { getOrderByCode, updateOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/types";

export const dynamic = "force-dynamic";

// VNPay chuyển khách về URL này kèm kết quả. Ta XÁC MINH CHỮ KÝ
// trước khi tin tưởng, rồi cập nhật trạng thái đơn.
// (IPN server-to-server mới là nguồn xác nhận chính thức — xem
//  /api/payment/vnpay/ipn. Trang này cập nhật bổ sung cho môi trường dev.)

export default async function VnpayReturnPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const query: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === "string") query[k] = v;
  }

  const cfg = getVnpayConfig();

  let state: "ok" | "failed" | "invalid" | "unconfigured" = "unconfigured";
  let orderCode = "";
  let amount = 0;

  if (cfg) {
    const result = verifyVnpayResponse(cfg, query);
    orderCode = result.orderCode;
    amount = result.amount;

    if (!result.valid) {
      state = "invalid"; // chữ ký sai → có thể bị giả mạo, KHÔNG cập nhật
    } else if (result.success) {
      // Cập nhật đơn (chỉ khi đang chờ, tránh ghi đè IPN)
      const order = await getOrderByCode(orderCode);
      if (order && order.paymentStatus !== "paid") {
        await updateOrder(orderCode, {
          paymentStatus: "paid",
          orderStatus: "confirmed",
        });
      }
      state = "ok";
    } else {
      state = "failed"; // khách hủy hoặc thanh toán thất bại
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <div className="rounded-2xl border border-bamboo-200 bg-white p-8 text-center">
        {state === "ok" && (
          <>
            <div className="mb-3 text-5xl">✅</div>
            <h1 className="font-serif text-2xl font-bold text-bamboo-800">
              Thanh toán thành công
            </h1>
            <p className="mt-2 text-bamboo-700">
              Đơn <strong className="font-mono">{orderCode}</strong> đã được
              thanh toán {formatPrice(amount)} qua VNPay.
            </p>
          </>
        )}
        {state === "failed" && (
          <>
            <div className="mb-3 text-5xl">⚠️</div>
            <h1 className="font-serif text-2xl font-bold text-bamboo-800">
              Thanh toán chưa hoàn tất
            </h1>
            <p className="mt-2 text-bamboo-700">
              Giao dịch cho đơn{" "}
              <strong className="font-mono">{orderCode}</strong> bị hủy hoặc thất
              bại. Đơn vẫn được giữ — bạn có thể thử thanh toán lại hoặc chọn
              COD.
            </p>
          </>
        )}
        {state === "invalid" && (
          <>
            <div className="mb-3 text-5xl">🚫</div>
            <h1 className="font-serif text-2xl font-bold text-bamboo-800">
              Không xác minh được giao dịch
            </h1>
            <p className="mt-2 text-bamboo-700">
              Chữ ký phản hồi không hợp lệ. Vì lý do an toàn, chúng tôi không cập
              nhật đơn. Vui lòng liên hệ cửa hàng.
            </p>
          </>
        )}
        {state === "unconfigured" && (
          <>
            <div className="mb-3 text-5xl">🛠️</div>
            <h1 className="font-serif text-2xl font-bold text-bamboo-800">
              VNPay chưa được cấu hình
            </h1>
            <p className="mt-2 text-bamboo-700">
              Cần khai báo <code>VNPAY_*</code> trong <code>.env.local</code>.
            </p>
          </>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/tra-cuu-don-hang"
            className="rounded-full bg-bamboo-600 px-6 py-3 font-medium text-white transition hover:bg-bamboo-700"
          >
            Tra cứu đơn hàng
          </Link>
          <Link
            href="/san-pham"
            className="rounded-full border border-bamboo-300 px-6 py-3 font-medium text-bamboo-800 transition hover:bg-bamboo-50"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
