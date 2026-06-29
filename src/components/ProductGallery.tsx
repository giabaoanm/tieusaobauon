"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Thư viện ảnh sản phẩm: ảnh lớn + ảnh nhỏ. Bấm ảnh nhỏ để đổi ảnh lớn;
// bấm ảnh lớn để xem ở khổ lớn (phóng to toàn màn hình).

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const valid = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  // Đóng khổ lớn bằng Esc + khóa cuộn nền khi mở
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom]);

  if (valid.length === 0) return null;

  return (
    <div>
      {/* Ảnh lớn — bấm để phóng to */}
      <button
        type="button"
        onClick={() => setZoom(true)}
        className="relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-bamboo-200 bg-bamboo-100"
        aria-label="Xem ảnh khổ lớn"
      >
        <Image
          src={valid[active]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
          🔍 Bấm để phóng to
        </span>
      </button>

      {/* Ảnh nhỏ (nếu có nhiều hơn 1 ảnh) */}
      {valid.length > 1 && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {valid.map((img, i) => (
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
      )}

      {/* Lớp xem khổ lớn */}
      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setZoom(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Ảnh khổ lớn: ${alt}`}
        >
          <button
            type="button"
            onClick={() => setZoom(false)}
            className="absolute right-4 top-4 z-10 text-3xl text-white hover:text-bamboo-200"
            aria-label="Đóng"
          >
            ✕
          </button>

          <div className="relative h-full max-h-[88vh] w-full max-w-5xl">
            <Image
              src={valid[active]}
              alt={alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {valid.length > 1 && (
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
              {valid.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(i);
                  }}
                  aria-label={`Ảnh ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    active === i ? "bg-white" : "bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
