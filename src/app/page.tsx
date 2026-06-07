import Image from "next/image";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import { getFeaturedProducts } from "@/lib/products-db";
import { PRODUCT_TYPE_LABELS, ProductType } from "@/lib/types";

export const dynamic = "force-dynamic";

const categories: { type: ProductType; emoji: string; image?: string }[] = [
  { type: "tieu_truc", emoji: "🪈", image: "/danh-muc/dong-tieu.jpg" },
  { type: "sao_truc", emoji: "🎋", image: "/danh-muc/sao-truc.jpg" },
  { type: "khac", emoji: "🎐" },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      {/* Hero — banner tiên ông (2 ảnh tự chuyển 30s / bấm để đổi) */}
      <HeroBanner />

      {/* Dải giới thiệu — giữ đoạn văn đầy đủ trên nền vàng trúc */}
      <section className="bg-gradient-to-br from-bamboo-600 to-bamboo-800 px-4 py-12 text-white md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-pretty text-base leading-relaxed text-white/90 md:text-lg">
            Động tiêu, sáo trúc làm thủ công từ niềm đam mê cháy bỏng — người làm
            đã dồn hết tâm, sức để thổi hồn vào từng cây trúc, tạo nên những cây
            động tiêu, sáo trúc có một không hai. Mỗi cây đều mang theo hương
            rừng, gió núi, thanh âm bốn mùa của người&nbsp;Việt.
          </p>
          <p className="mt-4 text-lg font-semibold text-white md:text-xl">
            Hãy trải nghiệm và thăng hoa cùng với những giai điệu âm nhạc của
            bạn!
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
              className="group overflow-hidden rounded-2xl border border-bamboo-200 bg-white text-center transition hover:border-bamboo-400 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-bamboo-100">
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={PRODUCT_TYPE_LABELS[c.type]}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-5xl">
                    {c.emoji}
                  </div>
                )}
              </div>
              <span className="block p-4 font-medium text-bamboo-800">
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

      {/* Cảm nhận khách hàng */}
      <Testimonials />

      {/* Câu hỏi thường gặp */}
      <Faq />
    </div>
  );
}
