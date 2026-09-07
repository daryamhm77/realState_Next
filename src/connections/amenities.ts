import "server-only";

import { unstable_cache } from "next/cache";

import { mapAmenity } from "@/connections/mappers";
import {
  CATALOG_REVALIDATE_SECONDS,
  CATALOG_TAGS,
} from "@/lib/catalog-cache";
import { db } from "@/lib/db";

async function loadAmenities() {
  const rows = await db.amenity.findMany({
    orderBy: { name: "asc" },
  });

  return rows.map(mapAmenity);
}

export const listPublishedAmenities = unstable_cache(
  loadAmenities,
  ["amenities"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.amenities],
  },
);

export async function listAdminAmenities() {
  return loadAmenities();
}

export async function getAdminAmenity(id: string) {
  const row = await db.amenity.findUnique({ where: { id } });
  return row ? mapAmenity(row) : null;
}

export async function createAmenity(input: { name: string; slug: string }) {
  const row = await db.amenity.create({
    data: { name: input.name, slug: input.slug },
  });

  return mapAmenity(row);
}

export async function updateAmenity(
  id: string,
  input: { name: string; slug: string },
) {
  const row = await db.amenity.update({
    where: { id },
    data: { name: input.name, slug: input.slug },
  });

  return mapAmenity(row);
}

export async function deleteAmenity(id: string) {
  await db.amenity.delete({ where: { id } });
}

export async function amenitySlugTaken(slug: string, excludeId?: string) {
  const row = await db.amenity.findUnique({
    where: { slug },
    select: { id: true },
  });

  return Boolean(row && row.id !== excludeId);
}
