"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Hai ảnh banner — chủ thể (tiên ông) ở vị trí ngược nhau nên chữ bên trái
// không che mất tiên ông ở ảnh 2.
const SLIDES = [
  {
    src: "/banner/hero-tien-ong.jpg",
    alt: "Tiên ông thổi động tiêu trên non cao lúc hoàng hôn",
    position: "object-[18%_center]", // chủ thể bên trái
  },
  {
    src: "/banner/hero-tien-ong-2.jpg",
    alt: "Tiên ông thổi động tiêu bên suối, hạc bay trong ráng chiều",
    position: "object-[72%_center]", // chủ thể bên phải
  },
  {
    src: "/banner/sanpham-1.jpg",
    alt: "Cận cảnh các lỗ bấm động tiêu, sáo trúc thủ công",
    position: "object-center",
  },
  {
    src: "/banner/sanpham-2.jpg",
    alt: "Hàng động tiêu, sáo trúc dựng đứng khoe lỗ bấm",
    position: "object-center",
  },
  {
    src: "/banner/sanpham-3.jpg",
    alt: "Miệng thổi động tiêu bát khổng khoét tinh xảo",
    position: "object-center",
  },
  {
    src: "/banner/sanpham-4.jpg",
    alt: "Dãy đầu thổi động tiêu trúc bóng đẹp",
    position: "object-center",
  },
  {
    src: "/banner/sanpham-5.jpg",
    alt: "Đầu thổi các cây động tiêu xòe ra",
    position: "object-center",
  },
  {
    src: "/banner/sanpham-6.jpg",
    alt: "Cận cảnh đầu thổi 5 cây động tiêu trúc",
    position: "object-center",
  },
  {
    src: "/banner/sanpham-7.jpg",
    alt: "Thân động tiêu với hàng lỗ bấm đều tăm tắp",
    position: "object-center",
  },
];

const INTERVAL = 10000; // 10 giây

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % SLIDES.length);

  // Tự chuyển sau mỗi 30s (đặt lại đồng hồ mỗi khi index đổi do bấm chuột)
  useEffect(() => {
    const timer = setTimeout(next, INTERVAL);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <section className="relative w-full overflow-hidden border-b border-bamboo-700">
      <div className="relative h-[480px] sm:h-auto sm:aspect-[2/1] md:aspect-[5/2] lg:aspect-[3/1]">
        {/* Lớp ảnh nền — bấm vào để chuyển banner */}
        <button
          type="button"
          onClick={next}
          aria-label="Chuyển ảnh banner"
          className="absolute inset-0 block h-full w-full cursor-pointer"
        >
          {SLIDES.map((s, i) => (
            <Image
              key={s.src}
              src={s.src}
              alt={s.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${s.position} transition-opacity duration-1000 ease-in-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </button>

        {/* Lớp phủ tối để chữ rõ (không chặn chuột) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />

        {/* Nội dung overlay (chỉ các nút mới nhận chuột) */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-7 sm:pb-10 md:pb-14">
            <div className="w-full max-w-xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 drop-shadow sm:text-sm">
                Nhạc cụ dân tộc thủ công
              </p>
              <h1 className="font-serif text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
                Thổi hồn vào trúc
              </h1>
              <p className="mt-2 max-w-md text-sm text-white/90 drop-shadow sm:mt-3 sm:text-lg">
                Động tiêu &amp; sáo trúc làm thủ công — mang theo hương rừng, gió
                núi, thanh âm bốn mùa của người Việt.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 sm:mt-7 sm:gap-4">
                <Link
                  href="/san-pham"
                  className="pointer-events-auto rounded-full bg-white px-5 py-2.5 text-sm font-medium text-bamboo-900 shadow-lg transition hover:bg-bamboo-50 sm:px-6 sm:py-3 sm:text-base"
                >
                  Khám phá sản phẩm
                </Link>
                <Link
                  href="/gioi-thieu"
                  className="pointer-events-auto rounded-full border border-white/70 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15 sm:px-6 sm:py-3 sm:text-base"
                >
                  Câu chuyện của chúng tôi
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Chấm chỉ báo / chuyển nhanh */}
        <div className="absolute bottom-3 right-4 z-20 flex gap-2 sm:bottom-4 sm:right-6">
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === index}
              className={`h-2.5 w-2.5 rounded-full ring-1 ring-black/20 transition ${
                i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
