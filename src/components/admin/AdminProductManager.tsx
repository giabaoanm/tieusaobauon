"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import {
  PRODUCT_TYPE_LABELS,
  TONE_LABELS,
  ProductType,
  Tone,
  formatPrice,
  MAX_PRODUCTS,
} from "@/lib/types";

type FormState = {
  id?: string;
  name: string;
  type: ProductType;
  tone: Tone;
  toneLabel: string;
  lengthCm: string;
  diameterMm: string;
  weightGrams: string;
  loai: string;
  price: string;
  sold: boolean;
  description: string;
  videoUrl: string;
  featured: boolean;
  imageMain: string;
  imageDetail: string;
};

const empty: FormState = {
  name: "",
  type: "sao_truc",
  tone: "C",
  toneLabel: "",
  lengthCm: "",
  diameterMm: "",
  weightGrams: "",
  loai: "",
  price: "",
  sold: false,
  description: "",
  videoUrl: "",
  featured: false,
  imageMain: "",
  imageDetail: "",
};

function toForm(p: Product): FormState {
  return {
    id: p.id,
    name: p.name,
    type: p.type,
    tone: p.tone,
    toneLabel: p.toneLabel,
    lengthCm: String(p.lengthCm),
    diameterMm: String(p.diameterMm),
    weightGrams: p.weightGrams ? String(p.weightGrams) : "",
    loai: p.loai ?? "",
    price: String(p.price),
    sold: !!p.sold,
    description: p.description,
    videoUrl: p.videoUrl,
    featured: !!p.featured,
    imageMain: p.imageMain,
    imageDetail: p.imageDetail,
  };
}

export default function AdminProductManager({
  initialProducts,
  enabled,
}: {
  initialProducts: Product[];
  enabled: boolean;
}) {
  const [list, setList] = useState<Product[]>(initialProducts);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openNew() {
    setError("");
    setForm({ ...empty });
  }
  function openEdit(p: Product) {
    setError("");
    setForm(toForm(p));
  }
  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    setError("");
    const payload = {
      id: form.id,
      name: form.name,
      type: form.type,
      tone: form.tone,
      toneLabel: form.toneLabel,
      lengthCm: Number(form.lengthCm) || 0,
      diameterMm: Number(form.diameterMm) || 0,
      weightGrams: Number(form.weightGrams) || 0,
      loai: form.loai,
      price: Number(form.price) || 0,
      sold: form.sold,
      description: form.description,
      videoUrl: form.videoUrl,
      featured: form.featured,
      imageMain: form.imageMain,
      imageDetail: form.imageDetail,
    };
    try {
      const res = await fetch("/api/admin/products", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Lưu thất bại.");
        setSaving(false);
        return;
      }
      const saved: Product = data.product;
      setList((prev) =>
        form.id
          ? prev.map((p) => (p.id === saved.id ? saved : p))
          : [saved, ...prev],
      );
      setForm(null);
    } catch {
      setError("Không kết nối được máy chủ.");
    }
    setSaving(false);
  }

  // Bật/tắt nhanh trạng thái "đã bán" (gửi lại toàn bộ dữ liệu sản phẩm)
  async function toggleSold(p: Product) {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: p.id,
        name: p.name,
        type: p.type,
        tone: p.tone,
        toneLabel: p.toneLabel,
        lengthCm: p.lengthCm,
        diameterMm: p.diameterMm,
        weightGrams: p.weightGrams ?? 0,
        loai: p.loai ?? "",
        price: p.price,
        sold: !p.sold,
        description: p.description,
        videoUrl: p.videoUrl,
        featured: p.featured,
        imageMain: p.imageMain,
        imageDetail: p.imageDetail,
      }),
    });
    const data = await res.json();
    if (res.ok)
      setList((prev) => prev.map((x) => (x.id === p.id ? data.product : x)));
    else alert(data.error || "Cập nhật thất bại.");
  }

  async function remove(p: Product) {
    if (!confirm(`Xóa sản phẩm "${p.name}"?`)) return;
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id }),
    });
    if (res.ok) setList((prev) => prev.filter((x) => x.id !== p.id));
    else {
      const d = await res.json();
      alert(d.error || "Xóa thất bại.");
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={openNew}
          disabled={!enabled || list.length >= MAX_PRODUCTS}
          className="rounded-full bg-bamboo-600 px-5 py-2.5 font-medium text-white transition hover:bg-bamboo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Thêm sản phẩm
        </button>
        <span className="text-sm text-bamboo-600">
          Đã dùng <strong>{list.length}</strong>/{MAX_PRODUCTS} ô
        </span>
        {!enabled && (
          <span className="text-sm text-bamboo-500">
            (cần kết nối Supabase để bật)
          </span>
        )}
        {enabled && list.length >= MAX_PRODUCTS && (
          <span className="text-sm text-clay-600">
            Đã đủ {MAX_PRODUCTS} ô — hãy xóa hoặc thay nội dung ô có sẵn.
          </span>
        )}
      </div>

      {/* Form thêm/sửa */}
      {form && (
        <div className="mb-8 rounded-2xl border border-bamboo-300 bg-white p-6">
          <h2 className="mb-4 font-semibold text-bamboo-800">
            {form.id ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tên sản phẩm *" full>
              <input
                className="inp"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Sáo trúc Đô (C5) — Trúc tím"
              />
            </Field>

            <Field label="Kiểu">
              <select
                className="inp"
                value={form.type}
                onChange={(e) => set("type", e.target.value as ProductType)}
              >
                {(Object.keys(PRODUCT_TYPE_LABELS) as ProductType[]).map((t) => (
                  <option key={t} value={t}>
                    {PRODUCT_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tone">
              <select
                className="inp"
                value={form.tone}
                onChange={(e) => set("tone", e.target.value as Tone)}
              >
                {(Object.keys(TONE_LABELS) as Tone[]).map((t) => (
                  <option key={t} value={t}>
                    {TONE_LABELS[t]}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Nhãn tone hiển thị (vd: Đô (C5))">
              <input
                className="inp"
                value={form.toneLabel}
                onChange={(e) => set("toneLabel", e.target.value)}
                placeholder="Để trống = tự lấy theo Tone"
              />
            </Field>

            <Field label="Giá (VND) *">
              <input
                className="inp"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))}
                placeholder="350000"
              />
            </Field>

            <Field label="Kích thước — chiều dài (cm)">
              <input
                className="inp"
                inputMode="numeric"
                value={form.lengthCm}
                onChange={(e) =>
                  set("lengthCm", e.target.value.replace(/\D/g, ""))
                }
                placeholder="62"
              />
            </Field>

            <Field label="Đường kính miệng thổi (mm)">
              <input
                className="inp"
                inputMode="numeric"
                value={form.diameterMm}
                onChange={(e) =>
                  set("diameterMm", e.target.value.replace(/\D/g, ""))
                }
                placeholder="22"
              />
            </Field>

            <Field label="Trọng lượng (gam)">
              <input
                className="inp"
                inputMode="numeric"
                value={form.weightGrams}
                onChange={(e) =>
                  set("weightGrams", e.target.value.replace(/\D/g, ""))
                }
                placeholder="120"
              />
            </Field>

            <Field label="Loại">
              <select
                className="inp"
                value={form.loai}
                onChange={(e) => set("loai", e.target.value)}
              >
                <option value="">— Chọn loại —</option>
                <option value="Động tiêu bát khổng">Động tiêu bát khổng</option>
                <option value="Sáo trúc 6 lỗ">Sáo trúc 6 lỗ</option>
                <option value="Loại khác">Loại khác</option>
              </select>
            </Field>

            <Field label="Trạng thái">
              <select
                className="inp"
                value={form.sold ? "sold" : "available"}
                onChange={(e) => set("sold", e.target.value === "sold")}
              >
                <option value="available">Còn hàng</option>
                <option value="sold">Đã bán</option>
              </select>
            </Field>

            <Field label="Link video thổi thử (YouTube embed)" full>
              <input
                className="inp"
                value={form.videoUrl}
                onChange={(e) => set("videoUrl", e.target.value)}
                placeholder="https://www.youtube.com/embed/XXXXXXXX"
              />
            </Field>

            <Field label="Mô tả" full>
              <textarea
                className="inp min-h-24"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Chất liệu, âm sắc, người làm..."
              />
            </Field>

            <ImageUploader
              label="Ảnh 1 (ảnh chính) *"
              value={form.imageMain}
              onChange={(url) => set("imageMain", url)}
            />
            <ImageUploader
              label="Ảnh 2 (ảnh chi tiết)"
              value={form.imageDetail}
              onChange={(url) => set("imageDetail", url)}
            />

            <label className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 accent-bamboo-600"
              />
              <span className="text-sm text-bamboo-700">
                Hiện ở mục “Sản phẩm nổi bật” (trang chủ)
              </span>
            </label>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-clay-300 bg-clay-50 px-4 py-2.5 text-sm text-clay-700">
              {error}
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-full bg-bamboo-600 px-6 py-2.5 font-medium text-white transition hover:bg-bamboo-700 disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu sản phẩm"}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="rounded-full border border-bamboo-300 px-6 py-2.5 font-medium text-bamboo-700 hover:bg-bamboo-50"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Danh sách sản phẩm */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <div
            key={p.id}
            className="overflow-hidden rounded-2xl border border-bamboo-200 bg-white"
          >
            <div className="relative aspect-video bg-bamboo-100">
              {p.imageMain && (
                <Image
                  src={p.imageMain}
                  alt={p.name}
                  fill
                  sizes="33vw"
                  className={`object-cover ${p.sold ? "opacity-60 grayscale" : ""}`}
                />
              )}
              {p.sold && (
                <span className="absolute right-2 top-2 rounded-full bg-clay-700 px-2.5 py-1 text-xs font-bold text-white">
                  ĐÃ BÁN
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="line-clamp-1 font-medium text-bamboo-900">
                {p.name}
              </div>
              <div className="mt-1 text-sm text-bamboo-600">
                🎵 {p.toneLabel} · {PRODUCT_TYPE_LABELS[p.type]}
              </div>
              <div className="mt-1 font-bold text-clay-700">
                {formatPrice(p.price)}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(p)}
                  disabled={!enabled}
                  className="rounded-full bg-bamboo-100 px-4 py-1.5 text-sm font-medium text-bamboo-700 hover:bg-bamboo-200 disabled:opacity-50"
                >
                  Sửa / Thay cây mới
                </button>
                <button
                  type="button"
                  onClick={() => toggleSold(p)}
                  disabled={!enabled}
                  className="rounded-full bg-bamboo-50 px-4 py-1.5 text-sm font-medium text-bamboo-700 ring-1 ring-bamboo-300 hover:bg-bamboo-100 disabled:opacity-50"
                >
                  {p.sold ? "Mở bán lại" : "Đánh dấu đã bán"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  disabled={!enabled}
                  className="rounded-full bg-clay-100 px-4 py-1.5 text-sm font-medium text-clay-700 hover:bg-clay-200 disabled:opacity-50"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        :global(.inp) {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #e2d0a4;
          background: #fff;
          padding: 0.55rem 0.8rem;
          font-size: 0.95rem;
          color: #45351c;
          outline: none;
        }
        :global(.inp:focus) {
          border-color: #a07d3a;
          box-shadow: 0 0 0 3px rgba(160, 125, 58, 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block text-sm font-medium text-bamboo-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function ImageUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) setErr(data.error || "Tải ảnh thất bại.");
      else onChange(data.url);
    } catch {
      setErr("Không tải được ảnh.");
    }
    setUploading(false);
  }

  return (
    <div className="block">
      <span className="mb-1 block text-sm font-medium text-bamboo-700">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-bamboo-200 bg-bamboo-100">
          {value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="preview"
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="block text-sm text-bamboo-700 file:mr-3 file:rounded-full file:border-0 file:bg-bamboo-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-bamboo-700 hover:file:bg-bamboo-200"
          />
          {uploading && (
            <p className="mt-1 text-xs text-bamboo-500">Đang tải ảnh...</p>
          )}
          {err && <p className="mt-1 text-xs text-clay-600">{err}</p>}
        </div>
      </div>
    </div>
  );
}
