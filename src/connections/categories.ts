import "server-only";

import { unstable_cache } from "next/cache";

import { mapCategory } from "@/connections/mappers";
import {
  CATALOG_REVALIDATE_SECONDS,
  CATALOG_TAGS,
} from "@/lib/catalog-cache";
import { db } from "@/lib/db";

async function loadCategories() {
  const rows = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return rows.map(mapCategory);
}

export const listPublishedCategories = unstable_cache(
  loadCategories,
  ["categories"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.categories],
  },
);

export async function listAdminCategories() {
  return loadCategories();
}

export async function getAdminCategory(id: string) {
  const row = await db.category.findUnique({ where: { id } });
  return row ? mapCategory(row) : null;
}

export async function createCategory(input: {
  name: string;
  slug: string;
  description?: string;
}) {
  const row = await db.category.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description || null,
    },
  });

  return mapCategory(row);
}

export async function updateCategory(
  id: string,
  input: { name: string; slug: string; description?: string },
) {
  const row = await db.category.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description || null,
    },
  });

  return mapCategory(row);
}

export async function deleteCategory(id: string) {
  await db.category.delete({ where: { id } });
}

export async function categorySlugTaken(slug: string, excludeId?: string) {
  const row = await db.category.findUnique({
    where: { slug },
    select: { id: true },
  });

  return Boolean(row && row.id !== excludeId);
}
