import { NextRequest, NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/admin-auth";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  PRODUCT_BUCKET,
} from "@/lib/supabase";

export const runtime = "nodejs";

// Tạo "link ký sẵn" để trình duyệt tải ảnh TRỰC TIẾP lên Supabase Storage.
// Nhờ vậy file không đi qua máy chủ Vercel (vốn giới hạn ~4.5MB), cho phép
// tải ảnh tới 10MB (giới hạn thực tế đặt ở bucket Supabase).

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

  let body: { contentType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const contentType = (body.contentType || "").toLowerCase();
  if (!ALLOWED.includes(contentType)) {
    return NextResponse.json(
      { error: "Chỉ chấp nhận ảnh JPG, PNG, WEBP, AVIF." },
      { status: 400 },
    );
  }

  const ext = contentType.split("/")[1].replace("jpeg", "jpg");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const sb = getSupabaseAdmin();
  const { data, error } = await sb.storage
    .from(PRODUCT_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return NextResponse.json(
      { error: `Không tạo được link tải lên: ${error?.message || ""}` },
      { status: 500 },
    );
  }

  const { data: pub } = sb.storage.from(PRODUCT_BUCKET).getPublicUrl(path);

  return NextResponse.json({
    uploadUrl: data.signedUrl, // URL đầy đủ để PUT thẳng file lên
    publicUrl: pub.publicUrl, // URL công khai để hiển thị sau khi tải xong
  });
}
