import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products-db";
import { PRODUCT_TYPE_LABELS, ProductType } from "@/lib/types";

export const dynamic = "force-dynamic";

const categories: { type: ProductType; emoji: string }[] = [
  { type: "tieu_truc", emoji: "🪈" },
  { type: "sao_truc", emoji: "🎋" },
  { type: "khac", emoji: "🎐" },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      {/* Hero — 2 nửa: chữ bên trái, ảnh động tiêu thật bên phải */}
      <section className="relative overflow-hidden border-b border-bamboo-700">
        <div className="grid md:grid-cols-2">
          {/* Nửa trái: nội dung trên nền vàng trúc */}
          <div className="flex items-center bg-gradient-to-br from-bamboo-600 to-bamboo-800 px-4 py-16 text-white md:py-28">
            <div className="mx-auto max-w-xl md:ml-auto md:mr-10">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-bamboo-100">
                Nhạc cụ dân tộc thủ công
              </p>
              <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
                Thổi hồn vào trúc
              </h1>
              <p className="mt-4 text-lg text-white/90">
                Động tiêu, sáo trúc làm thủ công từ niềm đam mê cháy bỏng, người
                làm đã dồn hết tâm, sức để thổi hồn vào từng cây trúc, tạo nên
                những cây động tiêu, sáo trúc có một không hai. Mỗi cây động
                tiêu, sáo trúc đều chất chứa thanh âm bốn mùa, mang theo hương
                rừng, đất núi của người Việt.
              </p>
              <p className="mt-3 text-lg font-semibold text-white">
                Hãy khám phá và nâng tầm trải nghiệm âm nhạc của bạn!
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/san-pham"
                  className="rounded-full bg-white px-6 py-3 font-medium text-bamboo-900 transition hover:bg-bamboo-50"
                >
                  Khám phá sản phẩm
                </Link>
                <Link
                  href="/gioi-thieu"
                  className="rounded-full border border-white/60 px-6 py-3 font-medium text-white transition hover:bg-white/10"
                >
                  Câu chuyện của chúng tôi
                </Link>
              </div>
            </div>
          </div>

          {/* Nửa phải: ảnh động tiêu thật của shop */}
          <div className="relative min-h-[360px] md:min-h-0">
            <Image
              src="/banner/dong-tieu-real.jpg"
              alt="Động tiêu trúc thủ công - Bá Uôn"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Danh mục */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-8 text-center font-serif text-2xl font-bold text-bamboo-800">
          Danh mục nhạc cụ
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
            { icon: "🤲", title: "Làm từ đam mê", desc: "Mỗi cây dồn hết tâm sức của người làm, độc bản, chuẩn tone." },
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
