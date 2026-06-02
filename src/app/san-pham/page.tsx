import { Metadata } from "next";
import ProductBrowser from "@/components/ProductBrowser";
import { getAllProducts } from "@/lib/products-db";
import { ProductType, PRODUCT_TYPE_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description:
    "Danh sách động tiêu trúc & sáo trúc thủ công — lọc theo tone, loại và giá.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  // Next 16: searchParams là Promise, cần await
  const { type } = await searchParams;
  const allProducts = await getAllProducts();

  // Lọc sẵn theo loại nếu vào từ danh mục (?type=sao_truc)
  const initialType =
    type && type in PRODUCT_TYPE_LABELS
      ? (type as ProductType)
      : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-bamboo-800">
          Sản phẩm
        </h1>
        <p className="mt-1 text-bamboo-700">
          Chọn nhạc cụ theo tone, loại và ngân sách của bạn.
        </p>
      </div>

      <ProductBrowser allProducts={allProducts} initialType={initialType} />
    </div>
  );
}
