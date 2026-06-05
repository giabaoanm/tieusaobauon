import Image from "next/image";
import Link from "next/link";
import { Product, formatPrice } from "@/lib/types";

// Thẻ sản phẩm trong danh sách / trang chủ.
// Chỉ hiện ảnh + tên + giá. Toàn bộ thông tin xem ở trang chi tiết.

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
            className={`object-cover transition duration-500 group-hover:scale-105 ${
              product.sold ? "opacity-60 grayscale" : ""
            }`}
          />
          {product.sold && (
            <span className="absolute right-3 top-3 rounded-full bg-clay-700 px-3 py-1 text-xs font-bold text-white">
              ĐÃ BÁN
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/san-pham/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.75rem] font-medium text-bamboo-900 hover:text-bamboo-600">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-clay-700">
            {formatPrice(product.price)}
          </span>
          <Link
            href={`/san-pham/${product.slug}`}
            className="whitespace-nowrap rounded-full bg-bamboo-100 px-3 py-1.5 text-center text-sm font-medium text-bamboo-700 transition hover:bg-bamboo-200"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
