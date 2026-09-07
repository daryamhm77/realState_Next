import { revalidatePath, revalidateTag } from "next/cache";

import { PATHS } from "@/routes/paths";

export const CATALOG_REVALIDATE_SECONDS = 60;

export const CATALOG_TAGS = {
  categories: "categories",
  amenities: "amenities",
  properties: "properties",
  pages: "pages",
} as const;

export function revalidateCatalog() {
  revalidateTag(CATALOG_TAGS.categories, "max");
  revalidateTag(CATALOG_TAGS.amenities, "max");
  revalidateTag(CATALOG_TAGS.properties, "max");
  revalidatePath(PATHS.home);
  revalidatePath(PATHS.properties);
}

export function revalidatePages(slug?: string) {
  revalidateTag(CATALOG_TAGS.pages, "max");
  revalidatePath(PATHS.home);
  if (slug) {
    revalidatePath(PATHS.page(slug));
  }
}
