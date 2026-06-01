import Image from "next/image";
import Link from "next/link";
import { Product, PRODUCT_TYPE_LABELS, formatPrice } from "@/lib/types";
import VideoButton from "./VideoButton";

// Thẻ sản phẩm hiển thị trong danh sách / trang chủ.
// Hiện ảnh chính, tên, tone, kích thước, kiểu, giá + nút nghe thử nhanh.

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-bamboo-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/san-pham/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-bamboo-100">
          <Image
            src={product.imageMain}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-bamboo-600 px-2.5 py-1 text-xs font-medium text-white">
            {PRODUCT_TYPE_LABELS[product.type]}
          </span>
          {product.stock <= 5 && (
            <span className="absolute right-3 top-3 rounded-full bg-clay-600 px-2.5 py-1 text-xs font-medium text-white">
              Sắp hết
            </span>
          )}
          {/* Nút nghe thử nhanh ở góc dưới ảnh */}
          <div className="absolute bottom-3 right-3">
            <VideoButton
              videoUrl={product.videoUrl}
              productName={product.name}
              variant="compact"
            />
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="line-clamp-1 font-medium text-bamboo-900 hover:text-bamboo-600">
            {product.name}
          </h3>
        </Link>

        {/* 3 dòng thông số: Tone / Kích thước / Kiểu */}
        <dl className="mt-2 space-y-0.5 text-sm text-bamboo-700">
          <div className="flex gap-2">
            <dt>🎵 Tone:</dt>
            <dd className="font-medium">{product.toneLabel}</dd>
          </div>
          <div className="flex gap-2">
            <dt>📏 Kích thước:</dt>
            <dd>
              {product.lengthCm}cm · Ø{product.diameterMm}mm
            </dd>
          </div>
          <div className="flex gap-2">
            <dt>🎋 Kiểu:</dt>
            <dd>{PRODUCT_TYPE_LABELS[product.type]}</dd>
          </div>
        </dl>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-clay-700">
            {formatPrice(product.price)}
          </span>
          <Link
            href={`/san-pham/${product.slug}`}
            className="rounded-full bg-bamboo-100 px-3 py-1.5 text-sm font-medium text-bamboo-700 transition hover:bg-bamboo-200"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
