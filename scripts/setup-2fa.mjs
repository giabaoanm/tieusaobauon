// Thiết lập 2FA (TOTP) cho admin.
// Dùng:  node scripts/setup-2fa.mjs
// 1) Dán ADMIN_TOTP_SECRET vào .env.local
// 2) Mở link QR (hoặc nhập secret thủ công) trong app Google Authenticator / Authy
// 3) Khởi động lại server — khi đăng nhập admin sẽ cần thêm mã 6 số

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { authenticator } = require("otplib");

const secret = authenticator.generateSecret();
const account = "admin@trucam.vn";
const issuer = "Truc Am";
const otpauth = authenticator.keyuri(account, issuer, secret);
const qr =
  "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" +
  encodeURIComponent(otpauth);

console.log("\nADMIN_TOTP_SECRET=" + secret + "\n");
console.log("Nhập thủ công vào app Authenticator (nếu không quét QR):", secret);
console.log("\nLink QR để quét bằng Google Authenticator / Authy:\n" + qr + "\n");
console.log("Mã hiện tại (kiểm tra thử):", authenticator.generate(secret));
