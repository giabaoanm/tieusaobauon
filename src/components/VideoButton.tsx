"use client";

import { useEffect, useState } from "react";

// ──────────────────────────────────────────────────────────────
// Nút "▶ Nghe thử" — mở modal/popup phát video thổi thử sản phẩm.
// Dùng ở trang chi tiết và (tùy chọn) thẻ sản phẩm.
// ──────────────────────────────────────────────────────────────

interface VideoButtonProps {
  videoUrl: string;
  productName: string;
  // Kiểu hiển thị nút: "full" (lớn, trang chi tiết) | "compact" (nhỏ)
  variant?: "full" | "compact";
}

export default function VideoButton({
  videoUrl,
  productName,
  variant = "full",
}: VideoButtonProps) {
  const [open, setOpen] = useState(false);

  // Đóng modal bằng phím Esc + khóa cuộn nền khi mở
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const btnClass =
    variant === "full"
      ? "inline-flex items-center justify-center gap-2 rounded-full bg-clay-600 px-6 py-3 font-medium text-white transition hover:bg-clay-700"
      : "inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-clay-700 shadow transition hover:bg-white";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={btnClass}
        aria-label={`Nghe thử ${productName}`}
      >
        <span aria-hidden>▶</span> Nghe thử
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Video thổi thử ${productName}`}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-2xl text-white hover:text-bamboo-200"
              aria-label="Đóng"
            >
              ✕
            </button>
            <div className="overflow-hidden rounded-xl bg-black shadow-2xl">
              <div className="relative aspect-video">
                <iframe
                  src={`${videoUrl}?autoplay=1`}
                  title={`Video thổi thử ${productName}`}
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <p className="mt-3 text-center text-sm text-white">
              🎵 Âm thanh thực tế: {productName}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
