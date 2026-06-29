import "server-only";
import { Resend } from "resend";
import { Order } from "@/lib/orders";
import { formatPrice } from "@/lib/types";

// ──────────────────────────────────────────────────────────────
// Thông báo cho CHỦ SHOP khi có đơn hàng mới.
// Hỗ trợ 2 kênh (kênh nào để trống thì tự bỏ qua):
//   1) Email cho chủ shop  → OWNER_NOTIFY_EMAIL  (cần RESEND_API_KEY)
//   2) Telegram (đẩy về điện thoại tức thì)
//        → TELEGRAM_BOT_TOKEN  +  TELEGRAM_CHAT_ID
//
// Vì sao dùng Telegram thay cho Zalo/Messenger?
//   Zalo (OA) và Facebook Messenger chỉ cho gửi tin chủ động khi đã có
//   Official Account / App được duyệt — thủ tục phức tạp. Telegram tạo bot
//   miễn phí trong ~5 phút, báo tức thì về điện thoại — tiện như Zalo.
// ──────────────────────────────────────────────────────────────

const PAYMENT_LABELS: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  vietqr: "Chuyển khoản VietQR",
  vnpay: "VNPay",
};

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://tieutrucviet.com.vn"
  );
}

function trackUrl(order: Order): string {
  return `${siteUrl()}/tra-cuu-don-hang?code=${encodeURIComponent(
    order.orderCode,
  )}&phone=${encodeURIComponent(order.phone)}`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── 1) Email cho chủ shop ──────────────────────────────────────
function ownerEmailHtml(order: Order): string {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${i.name} <span style="color:#888">× ${i.qty}</span></td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap;">${formatPrice(i.price * i.qty)}</td>
      </tr>`,
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#45351c;">
    <div style="background:#985b3d;color:#fff;padding:18px 24px;border-radius:12px 12px 0 0;">
      <h1 style="margin:0;font-size:19px;">🔔 ĐƠN HÀNG MỚI</h1>
    </div>
    <div style="border:1px solid #eee;border-top:none;border-radius:0 0 12px 12px;padding:22px 24px;">
      <div style="background:#faf6ea;border-radius:10px;padding:12px 16px;margin-bottom:16px;">
        <div style="color:#888;font-size:13px;">Mã đơn hàng</div>
        <div style="font-size:22px;font-weight:bold;letter-spacing:1px;">${order.orderCode}</div>
      </div>

      <div style="font-size:14px;line-height:1.8;margin-bottom:14px;">
        <strong>Khách:</strong> ${escapeHtml(order.customerName)}<br/>
        <strong>Điện thoại:</strong> ${escapeHtml(order.phone)}<br/>
        <strong>Địa chỉ:</strong> ${escapeHtml(order.address)}<br/>
        <strong>Thanh toán:</strong> ${PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
        ${order.note ? `<br/><strong>Ghi chú:</strong> ${escapeHtml(order.note)}` : ""}
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${rows}
        <tr><td style="padding:10px 0 0;font-weight:bold;font-size:16px;">Tổng cộng</td><td style="padding:10px 0 0;text-align:right;font-weight:bold;font-size:16px;color:#985b3d;">${formatPrice(order.total)}</td></tr>
      </table>

      <div style="margin-top:20px;text-align:center;">
        <a href="${trackUrl(order)}" style="display:inline-block;background:#a07522;color:#fff;text-decoration:none;padding:11px 22px;border-radius:999px;font-weight:bold;">Xem chi tiết đơn</a>
      </div>
    </div>
  </div>`;
}

async function sendOwnerEmail(order: Order): Promise<boolean> {
  const to = process.env.OWNER_NOTIFY_EMAIL?.trim();
  if (!process.env.RESEND_API_KEY || !to) return false;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from =
      process.env.EMAIL_FROM || "Động tiêu Bá Uôn <onboarding@resend.dev>";
    await resend.emails.send({
      from,
      to,
      subject: `🔔 Đơn mới ${order.orderCode} — ${order.customerName} (${formatPrice(
        order.total,
      )})`,
      html: ownerEmailHtml(order),
    });
    return true;
  } catch (e) {
    console.error("Gửi email báo đơn cho chủ shop lỗi:", (e as Error).message);
    return false;
  }
}

// ── 2) Telegram (đẩy về điện thoại) ────────────────────────────
function telegramText(order: Order): string {
  const items = order.items
    .map((i) => `• ${escapeHtml(i.name)} — ${formatPrice(i.price * i.qty)}`)
    .join("\n");
  return [
    `🔔 <b>ĐƠN HÀNG MỚI</b>`,
    `Mã: <b>${order.orderCode}</b>`,
    ``,
    `👤 ${escapeHtml(order.customerName)} — ${escapeHtml(order.phone)}`,
    `📍 ${escapeHtml(order.address)}`,
    `💳 ${PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}`,
    order.note ? `📝 ${escapeHtml(order.note)}` : ``,
    ``,
    items,
    `💰 <b>Tổng: ${formatPrice(order.total)}</b>`,
    ``,
    `🔎 ${trackUrl(order)}`,
  ]
    .filter((line) => line !== ``)
    .join("\n");
}

async function sendTelegram(order: Order): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return false;
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramText(order),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );
    return res.ok;
  } catch (e) {
    console.error("Gửi Telegram báo đơn lỗi:", (e as Error).message);
    return false;
  }
}

/**
 * Báo cho chủ shop qua tất cả kênh đã cấu hình (email + Telegram).
 * Không bao giờ ném lỗi ra ngoài — đơn vẫn đặt bình thường.
 */
export async function notifyNewOrder(order: Order): Promise<void> {
  await Promise.allSettled([sendOwnerEmail(order), sendTelegram(order)]);
}
