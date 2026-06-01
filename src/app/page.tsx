import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/data/products";
import { PRODUCT_TYPE_LABELS, ProductType } from "@/lib/types";

const categories: { type: ProductType; emoji: string }[] = [
  { type: "sao_truc", emoji: "🎋" },
  { type: "tieu_truc", emoji: "🪈" },
  { type: "sao_meo", emoji: "🐱" },
  { type: "sao_bau", emoji: "🍐" },
];

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <div>
      {/* Hero — nền vàng trúc khô, chữ nâu gỗ */}
      <section className="relative overflow-hidden border-b border-bamboo-500 bg-gradient-to-br from-bamboo-300 via-bamboo-400 to-bamboo-500 text-bamboo-900">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-bamboo-800">
              Nhạc cụ dân tộc thủ công
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
              Tiếng trúc vọng hồn quê
            </h1>
            <p className="mt-4 text-lg text-bamboo-800">
              Sáo trúc, động tiêu và nhạc cụ truyền thống chế tác thủ công bởi
              nghệ nhân làng nghề. Mỗi cây sáo — một âm sắc riêng, nghe thử trực
              tiếp qua video.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/san-pham"
                className="rounded-full bg-bamboo-900 px-6 py-3 font-medium text-white transition hover:bg-bamboo-800"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                href="/gioi-thieu"
                className="rounded-full border border-bamboo-800/50 px-6 py-3 font-medium text-bamboo-900 transition hover:bg-bamboo-900/10"
              >
                Câu chuyện của chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-bamboo-800">
          Danh mục nhạc cụ
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.type}
              href={`/san-pham?type=${c.type}`}
              className="flex flex-col items-center gap-2 rounded-2xl border border-bamboo-200 bg-white p-6 text-center transition hover:border-bamboo-400 hover:shadow-md"
            >
              <span className="text-4xl">{c.emoji}</span>
              <span className="font-medium text-bamboo-800">
                {PRODUCT_TYPE_LABELS[c.type]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="mx-auto max-w-6xl px-4 pb-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-bamboo-800">
            Sản phẩm nổi bật
          </h2>
          <Link
            href="/san-pham"
            className="text-sm font-medium text-bamboo-600 hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Cam kết */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: "🎵", title: "Nghe thử trước khi mua", desc: "Mỗi sản phẩm có video thổi thử âm thanh thực tế." },
            { icon: "🤲", title: "Thủ công làng nghề", desc: "Chế tác bởi nghệ nhân, chuẩn tone, bền đẹp." },
            { icon: "🔒", title: "Mua sắm an toàn", desc: "Thanh toán bảo mật, đổi trả minh bạch." },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-bamboo-200 bg-white p-6 text-center"
            >
              <div className="mb-3 text-3xl">{item.icon}</div>
              <h3 className="mb-1 font-semibold text-bamboo-800">
                {item.title}
              </h3>
              <p className="text-sm text-bamboo-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
