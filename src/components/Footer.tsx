import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/cam-nang", label: "Cẩm nang & chia sẻ" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/chinh-sach", label: "Chính sách" },
  { href: "/tra-cuu-don-hang", label: "Tra cứu đơn hàng" },
  { href: "/lien-he", label: "Liên hệ" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-bamboo-200 bg-bamboo-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Logo Động tiêu Bá Uôn"
                width={44}
                height={44}
                className="h-11 w-11 rounded-full object-cover ring-1 ring-bamboo-300"
              />
              <span className="font-serif text-lg font-bold text-bamboo-800">
                Động tiêu Bá Uôn
              </span>
            </div>
            <p className="text-sm text-bamboo-700">
              Chuyên động tiêu trúc và sáo trúc thủ công — mỗi cây tiêu, cây sáo
              được làm ra với sự tinh xảo và niềm đam mê cháy bỏng.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-bamboo-800">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-bamboo-700 transition hover:text-bamboo-900 hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-bamboo-800">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-bamboo-700">
              <li>👤 Bá Uôn</li>
              <li>
                📞{" "}
                <a href="tel:0993666625" className="hover:underline">
                  0993 666 625
                </a>
              </li>
              <li>
                💬{" "}
                <a
                  href="https://zalo.me/0993666625"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Zalo: 0993 666 625
                </a>
              </li>
              <li>📍 Số 28, Ngõ Hồ 50, P. Chiềng Sinh, tỉnh Sơn La</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-bamboo-200 pt-6 text-center text-xs text-bamboo-600">
          © {new Date().getFullYear()} Động tiêu Bá Uôn. Mọi quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
