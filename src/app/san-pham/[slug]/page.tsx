import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import VideoButton from "@/components/VideoButton";
import AddToCartButton from "@/components/AddToCartButton";
import { getProductBySlug, getAllProducts } from "@/lib/products-db";
import { PRODUCT_TYPE_LABELS, formatPrice } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageMain],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // Sản phẩm liên quan: cùng loại, khác id
  const all = await getAllProducts();
  const related = all
    .filter((p) => p.type === product.type && p.id !== product.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.imageMain, product.imageDetail].filter(Boolean),
    description: product.description,
    category: PRODUCT_TYPE_LABELS[product.type],
    brand: { "@type": "Brand", name: "Động tiêu Bá Uôn" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability: product.sold
        ? "https://schema.org/SoldOut"
        : "https://schema.org/InStock",
      url: `https://tieutrucviet.com.vn/san-pham/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-bamboo-600">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link href="/san-pham" className="hover:underline">
          Sản phẩm
        </Link>{" "}
        / <span className="text-bamboo-800">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Cột ảnh (2 ảnh) */}
        <ProductGallery
          images={[product.imageMain, product.imageDetail]}
          alt={product.name}
        />

        {/* Cột thông tin */}
        <div>
          <span className="inline-block rounded-full bg-bamboo-100 px-3 py-1 text-sm font-medium text-bamboo-700">
            {PRODUCT_TYPE_LABELS[product.type]}
          </span>

          <h1 className="mt-3 font-serif text-3xl font-bold text-bamboo-900">
            {product.name}
          </h1>

          <p className="mt-4 text-3xl font-bold text-clay-700">
            {formatPrice(product.price)}
          </p>

          {!!product.rating && product.rating > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span aria-hidden className="text-lg leading-none text-amber-500">
                {"★".repeat(Math.round(product.rating / 2))}
                <span className="text-bamboo-200">
                  {"★".repeat(5 - Math.round(product.rating / 2))}
                </span>
              </span>
              <span className="font-bold text-bamboo-900">
                {dec(product.rating)}/10
              </span>
              <span className="text-sm text-bamboo-500">
                · Đánh giá chất lượng
              </span>
            </div>
          )}

          {/* Thông số sản phẩm */}
          <dl className="mt-6 space-y-3 rounded-2xl border border-bamboo-200 bg-white p-5">
            <Spec label="🎵 Tone" value={product.toneLabel} />
            <Spec
              label="📏 Kích thước"
              value={
                product.lengthCm > 0
                  ? `Dài ${dec(product.lengthCm)} cm`
                  : "Đang cập nhật"
              }
            />
            <Spec
              label="⭕ Đường kính miệng thổi"
              value={
                product.diameterMm > 0
                  ? `Ø ${dec(product.diameterMm)} mm`
                  : "Đang cập nhật"
              }
            />
            <Spec
              label="⚖️ Trọng lượng"
              value={
                product.weightGrams && product.weightGrams > 0
                  ? `${dec(product.weightGrams)} g`
                  : "Đang cập nhật"
              }
            />
            <Spec label="🎋 Kiểu" value={PRODUCT_TYPE_LABELS[product.type]} />
            {!!product.loai && <Spec label="🏷️ Loại" value={product.loai} />}
            <Spec
              label="📦 Tình trạng"
              value={product.sold ? "Đã bán" : "Còn hàng"}
            />
          </dl>

          {/* Nút nghe thử + thêm giỏ */}
          <div className="mt-6 space-y-3">
            <VideoButton
              videoUrl={product.videoUrl}
              productName={product.name}
              variant="full"
            />
            <AddToCartButton
              sold={product.sold}
              item={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.imageMain,
                toneLabel: product.toneLabel,
                typeLabel: PRODUCT_TYPE_LABELS[product.type],
              }}
            />
          </div>

          {/* Cam kết tạo niềm tin */}
          <ul className="mt-5 grid grid-cols-1 gap-2 rounded-2xl border border-bamboo-200 bg-bamboo-50 p-4 text-sm text-bamboo-800 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <span className="text-bamboo-600">✓</span> Hàng độc bản — chỉ 1 cây
              duy nhất
            </li>
            <li className="flex items-center gap-2">
              <span className="text-bamboo-600">✓</span> Đã thổi thử kỹ, chuẩn âm
            </li>
            <li className="flex items-center gap-2">
              <span className="text-bamboo-600">✓</span> Đổi trả trong 15 ngày
            </li>
            <li className="flex items-center gap-2">
              <span className="text-bamboo-600">✓</span> Thanh toán an toàn, giao
              tận nơi
            </li>
          </ul>

          {/* Mô tả */}
          <div className="mt-8">
            <h2 className="mb-2 font-semibold text-bamboo-800">Mô tả</h2>
            <p className="leading-relaxed text-bamboo-700">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Sản phẩm liên quan */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-bold text-bamboo-800">
            Sản phẩm cùng loại
          </h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Hiển thị số kiểu Việt: dùng dấu phẩy cho phần thập phân (81.5 → "81,5")
function dec(n: number): string {
  return String(n).replace(".", ",");
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap gap-x-3 border-b border-bamboo-100 pb-2 last:border-0 last:pb-0">
      <dt className="w-36 shrink-0 text-bamboo-600">{label}</dt>
      <dd className="font-medium text-bamboo-900">{value}</dd>
    </div>
  );
}
