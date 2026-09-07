import "server-only";

import { propertyCardInclude, mapPropertyCard } from "@/connections/mappers";
import type { FavoriteList, FavoriteToggleResult } from "@/contracts/favorite";
import { db } from "@/lib/db";

export async function listFavoriteProperties(
  userId: string,
): Promise<FavoriteList> {
  const rows = await db.favorite.findMany({
    where: {
      userId,
      property: { published: true },
    },
    include: {
      property: { include: propertyCardInclude },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    ids: rows.map((row) => row.propertyId),
    items: rows.map((row) => mapPropertyCard(row.property)),
  };
}

export async function toggleFavorite(
  userId: string,
  propertyId: string,
): Promise<FavoriteToggleResult | { error: "not_found" }> {
  const property = await db.property.findFirst({
    where: { id: propertyId, published: true },
    select: { id: true },
  });

  if (!property) {
    return { error: "not_found" };
  }

  const existing = await db.favorite.findUnique({
    where: {
      userId_propertyId: { userId, propertyId },
    },
    select: { id: true },
  });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
    return { favorited: false, propertyId };
  }

  await db.favorite.create({
    data: { userId, propertyId },
  });

  return { favorited: true, propertyId };
}
