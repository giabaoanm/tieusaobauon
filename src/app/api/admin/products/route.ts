import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  ProductInput,
  createProduct,
  updateProduct,
  deleteProduct,
  countProducts,
  setProductActive,
  getProductById,
} from "@/lib/products-db";
import {
  PRODUCT_TYPE_LABELS,
  TONE_LABELS,
  ProductType,
  Tone,
  MAX_PRODUCTS,
} from "@/lib/types";

export const runtime = "nodejs";

// Tạo slug thân thiện từ tên tiếng Việt
function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function str(v: unknown, max = 1000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

// Đọc & kiểm tra dữ liệu sản phẩm từ body
function parseInput(data: Record<string, unknown>): ProductInput | string {
  const name = str(data.name, 200);
  if (!name) return "Vui lòng nhập tên sản phẩm.";

  const type = data.type as ProductType;
  if (!(type in PRODUCT_TYPE_LABELS)) return "Loại sản phẩm không hợp lệ.";

  const tone = data.tone as Tone;
  if (!(tone in TONE_LABELS)) return "Tone không hợp lệ.";

  const imageMain = str(data.imageMain, 600);
  if (!imageMain) return "Vui lòng tải ảnh chính (ảnh 1).";

  let slug = slugify(str(data.slug, 200) || name);
  if (!slug) slug = "sp";
  // Thêm hậu tố ngắn để tránh trùng slug
  slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

  return {
    slug,
    name,
    type,
    tone,
    toneLabel: str(data.toneLabel, 60) || undefined,
    lengthCm: num(data.lengthCm),
    diameterMm: num(data.diameterMm),
    weightGrams: num(data.weightGrams),
    loai: str(data.loai, 100),
    productCode: str(data.productCode, 60),
    rating: Math.min(num(data.rating), 10),
    price: num(data.price),
    sold: !!data.sold,
    imageMain,
    imageDetail: str(data.imageDetail, 600),
    videoUrl: str(data.videoUrl, 600),
    description: str(data.description, 3000),
    featured: !!data.featured,
  };
}

async function guard(): Promise<NextResponse | null> {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Chưa kết nối Supabase. Xem hướng dẫn trong HUONG-DAN-SUPABASE.md để cấu hình.",
      },
      { status: 503 },
    );
  }
  return null;
}

// Tạo sản phẩm
export async function POST(req: NextRequest) {
  const blocked = await guard();
  if (blocked) return blocked;

  // Giới hạn tối đa 21 ô sản phẩm
  if ((await countProducts()) >= MAX_PRODUCTS) {
    return NextResponse.json(
      {
        error: `Đã đủ ${MAX_PRODUCTS} ô sản phẩm. Hãy xóa hoặc thay nội dung ô có sẵn.`,
      },
      { status: 400 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const input = parseInput(body);
  if (typeof input === "string")
    return NextResponse.json({ error: input }, { status: 400 });

  try {
    const product = await createProduct(input);
    return NextResponse.json({ product });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "Lỗi tạo sản phẩm." },
      { status: 500 },
    );
  }
}

// Cập nhật sản phẩm (id trong body)
export async function PATCH(req: NextRequest) {
  const blocked = await guard();
  if (blocked) return blocked;

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = str(body.id, 100);
  if (!id) return NextResponse.json({ error: "Thiếu id." }, { status: 400 });

  // Thao tác nhanh: ẩn/hiện cây (khôi phục cây lưu trữ) — không cần nhập lại
  if (typeof body.setActive === "boolean") {
    await setProductActive(id, body.setActive);
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Không tìm thấy cây." }, { status: 404 });
    }
    return NextResponse.json({ product });
  }

  const input = parseInput(body);
  if (typeof input === "string")
    return NextResponse.json({ error: input }, { status: 400 });

  try {
    const product = await updateProduct(id, input);
    return NextResponse.json({ product });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "Lỗi cập nhật." },
      { status: 500 },
    );
  }
}

// Xóa sản phẩm (id trong body)
export async function DELETE(req: NextRequest) {
  const blocked = await guard();
  if (blocked) return blocked;

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = str(body.id, 100);
  if (!id) return NextResponse.json({ error: "Thiếu id." }, { status: 400 });

  try {
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message || "Lỗi xóa." },
      { status: 500 },
    );
  }
}
