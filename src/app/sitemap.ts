import { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products-db";

const SITE = "https://tieutrucviet.com.vn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/san-pham",
    "/cam-nang",
    "/gioi-thieu",
    "/chinh-sach",
    "/lien-he",
    "/tra-cuu-don-hang",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    productEntries = products.map((p) => ({
      url: `${SITE}/san-pham/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    /* nếu DB lỗi, vẫn trả sitemap tĩnh */
  }

  return [...staticEntries, ...productEntries];
}
