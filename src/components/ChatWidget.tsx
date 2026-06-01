"use client";

import { useEffect, useState } from "react";

// ──────────────────────────────────────────────────────────────
// Nút chat nổi (góc phải dưới) → Messenger / Zalo / Gọi điện / SMS.
// Khách bấm là mở app tương ứng; chủ shop trả lời từ điện thoại.
// Cấu hình link/số trong .env.local (NEXT_PUBLIC_*). Kênh nào để trống
// thì tự ẩn.
// ──────────────────────────────────────────────────────────────

interface Channel {
  key: string;
  label: string;
  href: string;
  bg: string; // màu nền nút
  icon: React.ReactNode;
}

function buildChannels(): Channel[] {
  const fb = process.env.NEXT_PUBLIC_FB_MESSENGER?.trim();
  const zalo = process.env.NEXT_PUBLIC_ZALO?.trim();
  const phone = process.env.NEXT_PUBLIC_PHONE?.trim();

  const list: Channel[] = [];

  if (fb) {
    // fb có thể là username/id hoặc link đầy đủ
    const href = fb.startsWith("http") ? fb : `https://m.me/${fb}`;
    list.push({
      key: "messenger",
      label: "Messenger",
      href,
      bg: "bg-[#0084FF]",
      icon: <span className="text-lg">💬</span>,
    });
  }
  if (zalo) {
    const href = zalo.startsWith("http") ? zalo : `https://zalo.me/${zalo}`;
    list.push({
      key: "zalo",
      label: "Zalo",
      href,
      bg: "bg-[#0068FF]",
      icon: <span className="text-sm font-extrabold italic">Zalo</span>,
    });
  }
  if (phone) {
    list.push({
      key: "call",
      label: "Gọi điện",
      href: `tel:${phone}`,
      bg: "bg-green-600",
      icon: <span className="text-lg">📞</span>,
    });
    list.push({
      key: "sms",
      label: "Nhắn tin SMS",
      href: `sms:${phone}`,
      bg: "bg-amber-500",
      icon: <span className="text-lg">✉️</span>,
    });
  }
  return list;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const channels = buildChannels();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Chưa cấu hình kênh nào → không hiện gì
  if (channels.length === 0) return null;

  return (
    <>
      {/* Lớp bắt click ra ngoài để đóng */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {/* Danh sách kênh */}
        {open && (
          <div className="flex flex-col items-end gap-2">
            {channels.map((c) => (
              <a
                key={c.key}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-3 pr-1.5 shadow-lg ring-1 ring-black/5 transition hover:scale-105"
              >
                <span className="text-sm font-medium text-bamboo-800">
                  {c.label}
                </span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${c.bg}`}
                >
                  {c.icon}
                </span>
              </a>
            ))}
          </div>
        )}

        {/* Nút bật/tắt */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Đóng khung chat" : "Liên hệ với shop"}
          aria-expanded={open}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-bamboo-600 text-2xl text-white shadow-xl transition hover:bg-bamboo-700"
        >
          {open ? "✕" : "💬"}
        </button>
      </div>

      {/* Nhãn gợi ý khi đóng (chỉ desktop) */}
      {!open && (
        <span className="pointer-events-none fixed bottom-8 right-24 z-40 hidden rounded-full bg-bamboo-900/90 px-3 py-1.5 text-sm text-white shadow md:block">
          Chat với shop
        </span>
      )}
    </>
  );
}
