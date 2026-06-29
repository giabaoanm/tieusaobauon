// Tạo chuỗi băm bcrypt cho mật khẩu admin.
// Dùng:  node scripts/hash-password.mjs 'matkhau-cua-ban'
// Rồi dán kết quả vào ADMIN_PASSWORD_HASH trong .env.local

import bcrypt from "bcryptjs";

const pw = process.argv[2];
if (!pw) {
  console.error("Thiếu mật khẩu. Ví dụ: node scripts/hash-password.mjs 'MatKhauManh#2026'");
  process.exit(1);
}

const hash = bcrypt.hashSync(pw, 12);
// Mã hóa base64 để tránh ký tự '$' bị dotenv hiểu nhầm là biến môi trường.
const b64 = Buffer.from(hash, "utf8").toString("base64");
console.log("\nADMIN_PASSWORD_HASH=" + b64 + "\n");
console.log("→ Dán dòng trên vào .env.local và XÓA dòng ADMIN_PASSWORD (mật khẩu thô).");
