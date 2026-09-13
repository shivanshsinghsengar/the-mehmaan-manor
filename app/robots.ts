// robots.txt for The Mehmaan Manor.
// Served automatically at /robots.txt by Next.js.
// We allow everything except the admin panel.

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/"],
      },
    ],
    sitemap: "https://themehmaan.vercel.app/sitemap.xml",
  };
}
