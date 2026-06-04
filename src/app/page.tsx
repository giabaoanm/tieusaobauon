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
      {/* Hero — banner tiên ông thổi tiêu, chữ overlay phía dưới */}
      <section className="relative w-full overflow-hidden border-b border-bamboo-700">
        <div className="relative h-[480px] sm:h-auto sm:aspect-[2/1] md:aspect-[5/2] lg:aspect-[3/1]">
          <Image
            src="/banner/hero-tien-ong.jpg"
            alt="Tiên ông thổi động tiêu trên non cao lúc hoàng hôn"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[18%_center]"
          />
          {/* Lớp phủ tối để chữ rõ */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />

          {/* Nội dung overlay */}
          <div className="absolute inset-0 z-10">
            <div className="mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-7 sm:pb-10 md:pb-14">
              <div className="w-full max-w-xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 drop-shadow sm:text-sm">
                  Nhạc cụ dân tộc thủ công
                </p>
                <h1 className="font-serif text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
                  Thổi hồn vào trúc
                </h1>
                <p className="mt-2 max-w-md text-sm text-white/90 drop-shadow sm:mt-3 sm:text-lg">
                  Động tiêu &amp; sáo trúc làm thủ công — mang theo thanh âm bốn
                  mùa, hương rừng và đất núi của người Việt.
                </p>
                <div className="mt-4 flex flex-wrap gap-3 sm:mt-7 sm:gap-4">
                  <Link
                    href="/san-pham"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-bamboo-900 shadow-lg transition hover:bg-bamboo-50 sm:px-6 sm:py-3 sm:text-base"
                  >
                    Khám phá sản phẩm
                  </Link>
                  <Link
                    href="/gioi-thieu"
                    className="rounded-full border border-white/70 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15 sm:px-6 sm:py-3 sm:text-base"
                  >
                    Câu chuyện của chúng tôi
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dải giới thiệu — giữ đoạn văn đầy đủ trên nền vàng trúc */}
      <section className="bg-gradient-to-br from-bamboo-600 to-bamboo-800 px-4 py-12 text-white md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-base leading-relaxed text-white/90 md:text-lg">
            Động tiêu, sáo trúc làm thủ công từ niềm đam mê cháy bỏng — người làm
            đã dồn hết tâm, sức để thổi hồn vào từng cây trúc, tạo nên những cây
            động tiêu, sáo trúc có một không hai. Mỗi cây đều chất chứa thanh âm
            bốn mùa, mang theo hương rừng, đất núi của người Việt.
          </p>
          <p className="mt-4 text-lg font-semibold text-white md:text-xl">
            Hãy khám phá và nâng tầm trải nghiệm âm nhạc của bạn!
          </p>
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
