"use client";

import Image from "next/image";
import { useState } from "react";

// Thư viện ảnh sản phẩm: ảnh lớn + 2 ảnh nhỏ (ảnh chính / ảnh chi tiết).
// Bấm ảnh nhỏ để đổi ảnh lớn.

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-bamboo-200 bg-bamboo-100">
        <Image
          src={images[active]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* 2 ảnh nhỏ */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-bamboo-100 transition ${
              active === i
                ? "border-bamboo-600"
                : "border-transparent hover:border-bamboo-300"
            }`}
            aria-label={`Xem ảnh ${i + 1}`}
          >
            <Image
              src={img}
              alt={`${alt} - ảnh ${i + 1}`}
              fill
              sizes="25vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
