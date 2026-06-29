import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/dat-hang-thanh-cong"],
    },
    sitemap: "https://tieutrucviet.com.vn/sitemap.xml",
  };
}
