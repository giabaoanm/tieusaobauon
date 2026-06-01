import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/admin-auth";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  PRODUCT_BUCKET,
} from "@/lib/supabase";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: NextRequest) {
  if (!(await isLoggedIn())) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Chưa kết nối Supabase (xem HUONG-DAN-SUPABASE.md)." },
      { status: 503 },
    );
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Thiếu tệp ảnh." }, { status: 400 });
  }

  // Kiểm tra loại & dung lượng
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "Chỉ chấp nhận ảnh JPG, PNG, WEBP, AVIF." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Ảnh quá lớn (tối đa 5MB). Vui lòng giảm dung lượng." },
      { status: 400 },
    );
  }

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const sb = getSupabaseAdmin();
  const { error } = await sb.storage
    .from(PRODUCT_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) {
    return NextResponse.json(
      { error: `Tải ảnh thất bại: ${error.message}` },
      { status: 500 },
    );
  }

  const { data } = sb.storage.from(PRODUCT_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
