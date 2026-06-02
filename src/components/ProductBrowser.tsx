"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import {
  Product,
  ProductType,
  Tone,
  PRODUCT_TYPE_LABELS,
  TONE_LABELS,
} from "@/lib/types";

// ──────────────────────────────────────────────────────────────
// Bộ duyệt sản phẩm: lọc theo Loại / Tone / Khoảng giá + sắp xếp.
// Nhận sẵn toàn bộ products và lọc phía client (Sprint 1).
// initialType: lọc sẵn theo loại khi vào từ danh mục (?type=...).
// ──────────────────────────────────────────────────────────────

type SortKey = "popular" | "price_asc" | "price_desc";

export default function ProductBrowser({
  allProducts,
  initialType,
}: {
  allProducts: Product[];
  initialType?: ProductType;
}) {
  const [type, setType] = useState<ProductType | "all">(initialType ?? "all");
  const [tone, setTone] = useState<Tone | "all">("all");
  const [maxPrice, setMaxPrice] = useState<number>(25000000);
  const [sort, setSort] = useState<SortKey>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false); // mở/đóng lọc trên ĐT

  const types = Object.keys(PRODUCT_TYPE_LABELS) as ProductType[];
  const tones = Object.keys(TONE_LABELS) as Tone[];

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (type !== "all" && p.type !== type) return false;
      if (tone !== "all" && p.tone !== tone) return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    if (sort === "price_asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc")
      list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [allProducts, type, tone, maxPrice, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Cột lọc */}
      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        {/* Nút bật/tắt bộ lọc (chỉ điện thoại) */}
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-2xl border border-bamboo-200 bg-white px-5 py-3 font-medium text-bamboo-800 lg:hidden"
          aria-expanded={filtersOpen}
        >
          <span>🔎 Bộ lọc sản phẩm</span>
          <span aria-hidden>{filtersOpen ? "▲" : "▼"}</span>
        </button>

        <div
          className={`space-y-6 ${filtersOpen ? "block" : "hidden"} lg:block`}
        >
          <div className="rounded-2xl border border-bamboo-200 bg-white p-5">
            <h3 className="mb-3 font-semibold text-bamboo-800">Loại nhạc cụ</h3>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={type === "all"} onClick={() => setType("all")}>
              Tất cả
            </FilterChip>
            {types.map((t) => (
              <FilterChip
                key={t}
                active={type === t}
                onClick={() => setType(t)}
              >
                {PRODUCT_TYPE_LABELS[t]}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-bamboo-200 bg-white p-5">
          <h3 className="mb-3 font-semibold text-bamboo-800">Tone</h3>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={tone === "all"} onClick={() => setTone("all")}>
              Tất cả
            </FilterChip>
            {tones.map((t) => (
              <FilterChip
                key={t}
                active={tone === t}
                onClick={() => setTone(t)}
              >
                {TONE_LABELS[t]}
              </FilterChip>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-bamboo-200 bg-white p-5">
          <h3 className="mb-3 font-semibold text-bamboo-800">
            Giá tối đa:{" "}
            <span className="text-clay-700">
              {new Intl.NumberFormat("vi-VN").format(maxPrice)}đ
            </span>
          </h3>
          <input
            type="range"
            min={100000}
            max={25000000}
            step={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-bamboo-600"
          />
          </div>
        </div>
      </aside>

      {/* Cột kết quả */}
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-bamboo-700">
            Tìm thấy <strong>{filtered.length}</strong> sản phẩm
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-bamboo-300 bg-white px-4 py-2 text-sm text-bamboo-800"
          >
            <option value="popular">Phổ biến</option>
            <option value="price_asc">Giá: thấp → cao</option>
            <option value="price_desc">Giá: cao → thấp</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-bamboo-300 bg-white p-12 text-center text-bamboo-600">
            Không có sản phẩm phù hợp bộ lọc. Thử nới rộng điều kiện nhé.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-bamboo-600 text-white"
          : "bg-bamboo-100 text-bamboo-700 hover:bg-bamboo-200"
      }`}
    >
      {children}
    </button>
  );
}
