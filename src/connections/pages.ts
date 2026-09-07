import "server-only";

import { unstable_cache } from "next/cache";

import { mapPage } from "@/connections/mappers";
import {
  CATALOG_REVALIDATE_SECONDS,
  CATALOG_TAGS,
} from "@/lib/catalog-cache";
import { db } from "@/lib/db";

async function loadPublishedPages() {
  const rows = await db.page.findMany({
    where: { published: true },
    orderBy: { title: "asc" },
  });

  return rows.map(mapPage);
}

async function loadPublishedPage(slug: string) {
  const row = await db.page.findFirst({
    where: { slug, published: true },
  });

  return row ? mapPage(row) : null;
}

async function loadPublishedSlugs() {
  return db.page.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

export const listPublishedPages = unstable_cache(
  loadPublishedPages,
  ["published-pages"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.pages],
  },
);

export const getPublishedPage = unstable_cache(
  loadPublishedPage,
  ["published-page"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.pages],
  },
);

export const listPublishedPageSlugs = unstable_cache(
  loadPublishedSlugs,
  ["published-page-slugs"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.pages],
  },
);

export async function listAdminPages() {
  const rows = await db.page.findMany({
    orderBy: { title: "asc" },
  });

  return rows.map(mapPage);
}

export async function getAdminPage(id: string) {
  const row = await db.page.findUnique({ where: { id } });
  return row ? mapPage(row) : null;
}

export async function createPage(input: {
  title: string;
  slug: string;
  body: string;
  navPlacement: "NONE" | "HEADER" | "FOOTER";
  published: boolean;
}) {
  const row = await db.page.create({ data: input });
  return mapPage(row);
}

export async function updatePage(
  id: string,
  input: {
    title: string;
    slug: string;
    body: string;
    navPlacement: "NONE" | "HEADER" | "FOOTER";
    published: boolean;
  },
) {
  const row = await db.page.update({
    where: { id },
    data: input,
  });

  return mapPage(row);
}

export async function deletePage(id: string) {
  await db.page.delete({ where: { id } });
}

export async function pageSlugTaken(slug: string, excludeId?: string) {
  const row = await db.page.findUnique({
    where: { slug },
    select: { id: true },
  });

  return Boolean(row && row.id !== excludeId);
}
