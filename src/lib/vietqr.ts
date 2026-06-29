// Tạo URL ảnh QR theo chuẩn VietQR (img.vietqr.io).
// Thông tin tài khoản nhận tiền KHÔNG bí mật nên dùng biến NEXT_PUBLIC_*.
// Cấu hình trong .env.local:
//   NEXT_PUBLIC_VIETQR_BANK=970436        (mã BIN ngân hàng, vd Vietcombank)
//   NEXT_PUBLIC_VIETQR_ACCOUNT=0011000123456
//   NEXT_PUBLIC_VIETQR_NAME=CUA HANG TRUC AM

export interface VietQRConfig {
  bank: string; // mã BIN ngân hàng (vd BIDV = 970418)
  bankName: string; // tên ngân hàng hiển thị cho khách
  account: string;
  name: string;
}

export function getVietQRConfig(): VietQRConfig | null {
  const bank = process.env.NEXT_PUBLIC_VIETQR_BANK;
  const account = process.env.NEXT_PUBLIC_VIETQR_ACCOUNT;
  const name = process.env.NEXT_PUBLIC_VIETQR_NAME;
  const bankName = process.env.NEXT_PUBLIC_VIETQR_BANK_NAME || "Ngân hàng";
  if (!bank || !account || !name) return null;
  return { bank, bankName, account, name };
}

export function buildVietQRUrl(
  cfg: VietQRConfig,
  amount: number,
  orderCode: string,
): string {
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: `Thanh toan ${orderCode}`,
    accountName: cfg.name,
  });
  return `https://img.vietqr.io/image/${cfg.bank}-${cfg.account}-compact2.png?${params}`;
}
