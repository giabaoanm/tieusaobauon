import "server-only";
import crypto from "crypto";

// ──────────────────────────────────────────────────────────────
// Tích hợp cổng thanh toán VNPay (chuẩn 2.1.0).
// Cấu hình trong .env.local:
//   VNPAY_TMN_CODE     — Mã website (Terminal ID) do VNPay cấp
//   VNPAY_HASH_SECRET  — Chuỗi bí mật để ký (HMAC-SHA512) — TUYỆT MẬT
//   VNPAY_URL          — URL cổng (sandbox/production)
//   VNPAY_RETURN_URL   — URL khách quay về sau khi thanh toán
//
// BẢO MẬT: Mọi phản hồi từ VNPay (return & IPN) đều được xác minh
// chữ ký bằng HASH_SECRET. Không tin response chưa xác minh.
// ──────────────────────────────────────────────────────────────

export interface VnpayConfig {
  tmnCode: string;
  hashSecret: string;
  url: string;
  returnUrl: string;
}

export function getVnpayConfig(): VnpayConfig | null {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const hashSecret = process.env.VNPAY_HASH_SECRET;
  const url = process.env.VNPAY_URL;
  const returnUrl = process.env.VNPAY_RETURN_URL;
  if (!tmnCode || !hashSecret || !url || !returnUrl) return null;
  return { tmnCode, hashSecret, url, returnUrl };
}

// Sắp xếp khóa theo alphabet và mã hóa giá trị (space -> "+") đúng
// cách VNPay yêu cầu, để chuỗi ký và chuỗi URL trùng khớp.
function sortAndEncode(obj: Record<string, string>): Record<string, string> {
  const sorted: Record<string, string> = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  }
  return sorted;
}

function buildQuery(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

function sign(data: string, secret: string): string {
  return crypto.createHmac("sha512", secret).update(data, "utf8").digest("hex");
}

// Ngày giờ định dạng yyyyMMddHHmmss theo giờ Việt Nam (GMT+7)
function vnpDate(d: Date): string {
  const vn = new Date(d.getTime() + 7 * 60 * 60 * 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    vn.getUTCFullYear().toString() +
    p(vn.getUTCMonth() + 1) +
    p(vn.getUTCDate()) +
    p(vn.getUTCHours()) +
    p(vn.getUTCMinutes()) +
    p(vn.getUTCSeconds())
  );
}

/** Tạo URL chuyển hướng sang VNPay để khách thanh toán. */
export function buildPaymentUrl(
  cfg: VnpayConfig,
  opts: { orderCode: string; amount: number; ipAddr: string },
): string {
  const now = new Date();
  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: cfg.tmnCode,
    vnp_Amount: String(opts.amount * 100), // VNPay tính theo đơn vị x100
    vnp_CurrCode: "VND",
    vnp_TxnRef: opts.orderCode,
    vnp_OrderInfo: `Thanh toan don hang ${opts.orderCode}`,
    vnp_OrderType: "other",
    vnp_Locale: "vn",
    vnp_ReturnUrl: cfg.returnUrl,
    vnp_IpAddr: opts.ipAddr || "127.0.0.1",
    vnp_CreateDate: vnpDate(now),
    vnp_ExpireDate: vnpDate(new Date(now.getTime() + 15 * 60 * 1000)),
  };

  const sorted = sortAndEncode(params);
  const signData = buildQuery(sorted);
  const secureHash = sign(signData, cfg.hashSecret);

  return `${cfg.url}?${signData}&vnp_SecureHash=${secureHash}`;
}

/**
 * Xác minh chữ ký phản hồi từ VNPay (return URL hoặc IPN).
 * @returns valid (chữ ký đúng) + success (đã thanh toán thành công).
 */
export function verifyVnpayResponse(
  cfg: VnpayConfig,
  query: Record<string, string>,
): { valid: boolean; success: boolean; orderCode: string; amount: number } {
  const received = query.vnp_SecureHash || "";

  // Loại bỏ trường chữ ký trước khi ký lại
  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(query)) {
    if (k !== "vnp_SecureHash" && k !== "vnp_SecureHashType") data[k] = v;
  }

  const sorted = sortAndEncode(data);
  const signData = buildQuery(sorted);
  const expected = sign(signData, cfg.hashSecret);

  // So sánh hằng-thời-gian chống tấn công timing
  const valid =
    received.length === expected.length &&
    crypto.timingSafeEqual(
      Buffer.from(received, "utf8"),
      Buffer.from(expected, "utf8"),
    );

  const success = valid && query.vnp_ResponseCode === "00";

  return {
    valid,
    success,
    orderCode: query.vnp_TxnRef || "",
    amount: Number(query.vnp_Amount || 0) / 100,
  };
}
