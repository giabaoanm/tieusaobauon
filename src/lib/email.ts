import "server-only";
import { Resend } from "resend";
import { Order } from "@/lib/orders";
import { formatPrice } from "@/lib/types";

// ──────────────────────────────────────────────────────────────
// Gửi email xác nhận đơn hàng qua Resend (resend.com).
// Cấu hình .env.local:
//   RESEND_API_KEY=re_xxx          (lấy ở resend.com → API Keys)
//   EMAIL_FROM="Động tiêu Bá Uôn <donhang@tieutrucviet.com.vn>"
//   NEXT_PUBLIC_SITE_URL=https://tieutrucviet.com.vn
// Chưa cấu hình → bỏ qua gửi mail (đơn vẫn đặt bình thường).
// ──────────────────────────────────────────────────────────────

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  vietqr: "Chuyển khoản VietQR",
  vnpay: "VNPay",
};

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://tieutrucviet.com.vn"
  );
}

function buildHtml(order: Order): string {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${i.name} <span style="color:#888">× ${i.qty}</span></td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">${formatPrice(i.price * i.qty)}</td>
      </tr>`,
    )
    .join("");

  const url = siteUrl();
  // Link tra cứu kèm sẵn mã đơn + SĐT để khách bấm là xem ngay, khỏi gõ
  const trackUrl = `${url}/tra-cuu-don-hang?code=${encodeURIComponent(
    order.orderCode,
  )}&phone=${encodeURIComponent(order.phone)}`;

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#45351c;">
    <div style="background:#a07522;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
      <h1 style="margin:0;font-size:20px;">🎋 Động tiêu Bá Uôn</h1>
    </div>
    <div style="border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
      <h2 style="margin:0 0 6px;">Cảm ơn bạn đã đặt hàng! 🎉</h2>
      <p style="margin:0 0 16px;color:#555;">Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ sớm để xác nhận.</p>

      <div style="background:#faf6ea;border-radius:10px;padding:14px 16px;margin-bottom:18px;">
        <div style="color:#888;font-size:13px;">Mã đơn hàng</div>
        <div style="font-size:22px;font-weight:bold;letter-spacing:1px;">${order.orderCode}</div>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${rows}
        <tr><td style="padding:8px 0;color:#555;">Tạm tính</td><td style="padding:8px 0;text-align:right;">${formatPrice(order.subtotal)}</td></tr>
        <tr><td style="padding:4px 0;color:#555;">Phí vận chuyển</td><td style="padding:4px 0;text-align:right;">${formatPrice(order.shippingFee)}</td></tr>
        <tr><td style="padding:10px 0 0;font-weight:bold;font-size:16px;">Tổng cộng</td><td style="padding:10px 0 0;text-align:right;font-weight:bold;font-size:16px;color:#985b3d;">${formatPrice(order.total)}</td></tr>
      </table>

      <div style="margin-top:18px;font-size:14px;line-height:1.7;">
        <strong>Người nhận:</strong> ${order.customerName}<br/>
        <strong>Điện thoại:</strong> ${order.phone}<br/>
        <strong>Địa chỉ:</strong> ${order.address}<br/>
        <strong>Thanh toán:</strong> ${PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
      </div>

      <div style="margin-top:22px;text-align:center;">
        <a href="${trackUrl}" style="display:inline-block;background:#a07522;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold;">Tra cứu đơn hàng</a>
      </div>
      <p style="margin-top:16px;font-size:12px;color:#888;text-align:center;">
        Bấm nút trên để xem chi tiết đơn (mã đơn và số điện thoại đã được điền sẵn).<br/>
        Cần hỗ trợ? Gọi/Zalo: 0993 666 625
      </p>
    </div>
  </div>`;
}

/** Gửi email xác nhận. Không bao giờ ném lỗi ra ngoài (đơn vẫn đặt OK). */
export async function sendOrderConfirmation(order: Order): Promise<boolean> {
  if (!isEmailConfigured() || !order.email) return false;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from =
      process.env.EMAIL_FROM ||
      "Động tiêu Bá Uôn <onboarding@resend.dev>";
    await resend.emails.send({
      from,
      to: order.email,
      subject: `Xác nhận đơn hàng ${order.orderCode} — Động tiêu Bá Uôn`,
      html: buildHtml(order),
    });
    return true;
  } catch (e) {
    console.error("Gửi email xác nhận thất bại:", (e as Error).message);
    return false;
  }
}
