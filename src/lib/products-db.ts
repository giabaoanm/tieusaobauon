import "server-only";
import { Product, Tone, ProductType, TONE_LABELS } from "@/lib/types";
import { products as sampleProducts } from "@/data/products";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

// ──────────────────────────────────────────────────────────────
// Lớp dữ liệu sản phẩm.
// - Đã cấu hình Supabase → đọc/ghi từ database.
// - Chưa cấu hình → dùng dữ liệu mẫu (chỉ đọc) để web vẫn chạy.
// ──────────────────────────────────────────────────────────────

const TABLE = "products";

// Dữ liệu admin nhập vào (chưa có id/slug hệ thống tự lo nếu thiếu)
export interface ProductInput {
  slug: string;
  name: string;
  type: ProductType;
  tone: Tone;
  toneLabel?: string;
  lengthCm: number;
  diameterMm: number;
  weightGrams: number;
  loai: string;
  price: number;
  sold: boolean;
  imageMain: string;
  imageDetail: string;
  videoUrl: string;
  description: string;
  featured: boolean;
}

// Hàng trong DB (snake_case) → đối tượng Product (camelCase)
/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToProduct(r: any): Product {
  return {
    id: String(r.id),
    slug: r.slug,
    name: r.name,
    type: r.type,
    tone: r.tone,
    toneLabel: r.tone_label || TONE_LABELS[r.tone as Tone] || r.tone,
    lengthCm: Number(r.length_cm) || 0,
    diameterMm: Number(r.diameter_mm) || 0,
    weightGrams: Number(r.weight_g) || 0,
    loai: r.loai || "",
    price: Number(r.price) || 0,
    sold: !!r.sold,
    imageMain: r.image_main || "",
    imageDetail: r.image_detail || "",
    videoUrl: r.video_url || "",
    description: r.description || "",
    featured: !!r.featured,
  };
}

function inputToRow(input: ProductInput, includeExtras = true) {
  const row: Record<string, any> = {
    slug: input.slug,
    name: input.name,
    type: input.type,
    tone: input.tone,
    tone_label: input.toneLabel || null,
    length_cm: input.lengthCm,
    diameter_mm: input.diameterMm,
    price: input.price,
    sold: input.sold,
    image_main: input.imageMain,
    image_detail: input.imageDetail,
    video_url: input.videoUrl,
    description: input.description,
    featured: input.featured,
    is_active: true,
  };
  // Cột mới (weight_g, loai) — nếu DB chưa thêm cột thì bỏ qua để vẫn lưu được.
  if (includeExtras) {
    row.weight_g = input.weightGrams || 0;
    row.loai = input.loai || null;
  }
  return row;
}

// Lỗi "cột chưa tồn tại" (DB chưa chạy migration thêm weight_g/loai)
function isMissingExtraColumn(message: string): boolean {
  const m = message.toLowerCase();
  return (
    (m.includes("weight_g") || m.includes("loai")) &&
    (m.includes("column") || m.includes("schema cache") || m.includes("find"))
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Đọc (công khai) ────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return sampleProducts;
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Supabase getAllProducts:", error.message);
    return sampleProducts;
  }
  return (data ?? []).map(rowToProduct);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) {
    return sampleProducts.find((p) => p.slug === slug);
  }
  const sb = getSupabaseAdmin();
  // Chỉ trả cây đang hiển thị (is_active) cho trang công khai.
  // Cây đã hoàn tất đơn (lưu trữ bảo hành) sẽ không xem được ngoài web.
  const { data } = await sb
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return data ? rowToProduct(data) : undefined;
}

// Cây đã lưu trữ (is_active=false) — phục vụ tra cứu bảo hành trong admin
export async function getArchivedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from(TABLE)
    .select("*")
    .eq("is_active", false)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Supabase getArchivedProducts:", error.message);
    return [];
  }
  return (data ?? []).map(rowToProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) {
    return sampleProducts.find((p) => p.id === id);
  }
  const sb = getSupabaseAdmin();
  const { data } = await sb.from(TABLE).select("*").eq("id", id).single();
  return data ? rowToProduct(data) : undefined;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getAllProducts();
  const featured = all.filter((p) => p.featured);
  return featured.length > 0 ? featured : all.slice(0, 4);
}

// ── Ghi (chỉ admin) ────────────────────────────────────────────

export async function createProduct(input: ProductInput): Promise<Product> {
  const sb = getSupabaseAdmin();
  let { data, error } = await sb
    .from(TABLE)
    .insert(inputToRow(input))
    .select("*")
    .single();
  if (error && isMissingExtraColumn(error.message)) {
    ({ data, error } = await sb
      .from(TABLE)
      .insert(inputToRow(input, false))
      .select("*")
      .single());
  }
  if (error) throw new Error(error.message);
  return rowToProduct(data);
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<Product> {
  const sb = getSupabaseAdmin();
  let { data, error } = await sb
    .from(TABLE)
    .update(inputToRow(input))
    .eq("id", id)
    .select("*")
    .single();
  if (error && isMissingExtraColumn(error.message)) {
    ({ data, error } = await sb
      .from(TABLE)
      .update(inputToRow(input, false))
      .eq("id", id)
      .select("*")
      .single());
  }
  if (error) throw new Error(error.message);
  return rowToProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const sb = getSupabaseAdmin();
  const { error } = await sb.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Đếm số sản phẩm đang có (để giới hạn tối đa 21 ô)
export async function countProducts(): Promise<number> {
  if (!isSupabaseConfigured()) return sampleProducts.length;
  const sb = getSupabaseAdmin();
  const { count } = await sb
    .from(TABLE)
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);
  return count ?? 0;
}

// Ẩn/hiện cây trên web công khai (is_active). Hoàn tất đơn → ẩn (lưu trữ).
export async function setProductActive(
  id: string,
  active: boolean,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = getSupabaseAdmin();
  await sb.from(TABLE).update({ is_active: active }).eq("id", id);
}

// Đánh dấu đã bán / còn hàng (khi đặt hàng hoặc admin chỉnh)
export async function setProductSold(
  id: string,
  sold: boolean,
): Promise<void> {
  if (!isSupabaseConfigured()) return; // dữ liệu mẫu không ghi được
  const sb = getSupabaseAdmin();
  await sb.from(TABLE).update({ sold }).eq("id", id);
}
