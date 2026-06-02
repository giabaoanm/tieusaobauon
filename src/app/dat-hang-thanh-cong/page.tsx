"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/types";
import { getVietQRConfig } from "@/lib/vietqr";

function SuccessContent() {
  const params = useSearchParams();
  const code = params.get("code") ?? "";
  const total = Number(params.get("total") ?? 0);
  const method = params.get("method") ?? "cod";

  const vietqr = getVietQRConfig();
  const showQr = method === "vietqr" && !!vietqr && !!code;
  // Lấy ảnh QR qua API cùng tên miền (để hiển thị ổn định & tải về được)
  const qrSrc = `/api/vietqr?amount=${total}&code=${encodeURIComponent(code)}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <div className="rounded-2xl border border-bamboo-200 bg-white p-8 text-center">
        <div className="mb-3 text-5xl">🎉</div>
        <h1 className="font-serif text-2xl font-bold text-bamboo-800">
          Đặt hàng thành công!
        </h1>
        <p className="mt-2 text-bamboo-700">
          Cảm ơn bạn đã đặt hàng tại Động tiêu Bá Uôn. Chúng tôi sẽ liên hệ sớm để xác
          nhận.
        </p>

        <div className="mx-auto mt-6 w-fit rounded-xl bg-bamboo-50 px-6 py-3">
          <span className="text-sm text-bamboo-600">Mã đơn hàng</span>
          <div className="font-mono text-xl font-bold tracking-wider text-bamboo-900">
            {code || "—"}
          </div>
        </div>
        <p className="mt-2 text-sm text-bamboo-600">
          Tổng tiền: <strong>{formatPrice(total)}</strong>
        </p>

        {/* Hướng dẫn theo phương thức thanh toán */}
        {method === "cod" ? (
          <div className="mt-6 rounded-xl border border-bamboo-200 bg-bamboo-50 p-4 text-left text-sm text-bamboo-700">
            💵 Bạn chọn <strong>thanh toán khi nhận hàng (COD)</strong>. Vui lòng
            chuẩn bị {formatPrice(total)} tiền mặt khi nhận hàng.
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-bamboo-200 bg-bamboo-50 p-4 text-left text-sm text-bamboo-700">
            <p className="mb-3 font-medium text-bamboo-800">
              📱 Quét mã VietQR để chuyển khoản
            </p>
            {showQr && vietqr ? (
              <div>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <div className="flex shrink-0 flex-col items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrSrc}
                      alt={`Mã QR thanh toán đơn ${code}`}
                      className="w-56 rounded-lg border border-bamboo-200 bg-white"
                    />
                    <a
                      href={`${qrSrc}&download=1`}
                      className="rounded-full bg-bamboo-100 px-4 py-1.5 text-xs font-medium text-bamboo-700 transition hover:bg-bamboo-200"
                    >
                      ⬇ Tải mã QR về máy
                    </a>
                  </div>
                  {/* Thông tin chuyển khoản thủ công */}
                  <div className="w-full space-y-2 text-sm">
                    <TransferRow label="Ngân hàng" value={vietqr.bankName} />
                    <TransferRow
                      label="Số tài khoản"
                      value={vietqr.account}
                      copy
                    />
                    <TransferRow label="Chủ tài khoản" value={vietqr.name} />
                    <TransferRow label="Số tiền" value={formatPrice(total)} />
                    <TransferRow
                      label="Nội dung CK"
                      value={`Thanh toan ${code}`}
                      copy
                    />
                  </div>
                </div>

                {/* Hướng dẫn cho người xem trên điện thoại (không có máy thứ 2) */}
                <div className="mt-4 rounded-lg bg-white p-3 text-xs leading-relaxed text-bamboo-700">
                  <p className="mb-1 font-medium text-bamboo-800">
                    📱 Đang xem trên điện thoại? Thanh toán không cần máy thứ 2:
                  </p>
                  <p>
                    ① <strong>Tải mã QR về máy</strong> → mở app ngân hàng → chọn{" "}
                    <em>“Quét mã QR từ thư viện/ảnh”</em> → chọn ảnh vừa tải.
                  </p>
                  <p className="mt-1">
                    ② Hoặc <strong>chuyển khoản thủ công</strong>: bấm{" "}
                    <em>“Sao chép”</em> ở Số tài khoản và Nội dung, nhập đúng số
                    tiền.
                  </p>
                  <p className="mt-1 text-bamboo-500">
                    Vui lòng ghi đúng nội dung để shop đối soát nhanh.
                  </p>
                </div>
              </div>
            ) : (
              <p>
                Cửa hàng chưa cấu hình tài khoản VietQR. Vui lòng cấu hình{" "}
                <code>NEXT_PUBLIC_VIETQR_*</code> trong <code>.env.local</code>,
                hoặc liên hệ cửa hàng để được hướng dẫn chuyển khoản.
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/tra-cuu-don-hang"
            className="rounded-full bg-bamboo-600 px-6 py-3 font-medium text-white transition hover:bg-bamboo-700"
          >
            Tra cứu đơn hàng
          </Link>
          <Link
            href="/san-pham"
            className="rounded-full border border-bamboo-300 px-6 py-3 font-medium text-bamboo-800 transition hover:bg-bamboo-50"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

function TransferRow({
  label,
  value,
  copy,
}: {
  label: string;
  value: string;
  copy?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="flex items-center justify-between gap-2 border-b border-bamboo-200 pb-1.5">
      <span className="text-bamboo-600">{label}</span>
      <span className="flex items-center gap-2">
        <strong className="text-right text-bamboo-900">{value}</strong>
        {copy && (
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-md bg-bamboo-100 px-2 py-0.5 text-xs text-bamboo-700 hover:bg-bamboo-200"
            aria-label={`Sao chép ${label}`}
          >
            {copied ? "✓" : "Sao chép"}
          </button>
        )}
      </span>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Đang tải...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
