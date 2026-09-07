import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";
import { PATHS } from "@/routes/paths";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", PATHS.admin, `${PATHS.admin}/`, PATHS.favorites],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
