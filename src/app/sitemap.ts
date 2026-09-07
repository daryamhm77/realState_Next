import type { MetadataRoute } from "next";

import { listPublishedPageSlugs, listPublishedPropertySlugs } from "@/connections";
import { isReservedPageSlug } from "@/lib/cms";
import { getSiteUrl } from "@/lib/site-url";
import { PATHS } from "@/routes/paths";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const publicPaths = [PATHS.home, PATHS.properties, PATHS.compare];

  const staticEntries = publicPaths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: path === PATHS.home ? ("daily" as const) : ("weekly" as const),
    priority: path === PATHS.home ? 1 : 0.7,
  }));

  try {
    const [properties, pages] = await Promise.all([
      listPublishedPropertySlugs(),
      listPublishedPageSlugs(),
    ]);

    const propertyEntries = properties.map((property) => ({
      url: new URL(PATHS.property(property.slug), siteUrl).toString(),
      lastModified: property.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const pageEntries = pages
      .filter((page) => !isReservedPageSlug(page.slug))
      .map((page) => ({
        url: new URL(PATHS.page(page.slug), siteUrl).toString(),
        lastModified: page.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));

    return [...staticEntries, ...propertyEntries, ...pageEntries];
  } catch {
    return staticEntries;
  }
}
