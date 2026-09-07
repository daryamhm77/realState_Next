import "server-only";

import { unstable_cache } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";

import {
  mapPropertyCard,
  mapPropertyDetail,
  mapPropertyImage,
  propertyCardInclude,
  propertyDetailInclude,
} from "@/connections/mappers";
import type { PropertyIntent, PropertySearchParams } from "@/contracts/property";
import {
  CATALOG_REVALIDATE_SECONDS,
  CATALOG_TAGS,
} from "@/lib/catalog-cache";
import { db } from "@/lib/db";

function intentWhere(
  intent?: PropertyIntent,
): Prisma.PropertyWhereInput {
  if (intent === "buy") {
    return { dealType: "SALE", useType: "RESIDENTIAL" };
  }

  if (intent === "rent") {
    return { dealType: "RENT", useType: "RESIDENTIAL" };
  }

  if (intent === "commercial") {
    return { useType: "COMMERCIAL" };
  }

  return {};
}

function searchWhere(params: PropertySearchParams): Prisma.PropertyWhereInput {
  const priceFilter =
    params.minPrice != null || params.maxPrice != null
      ? {
          prices: {
            some: {
              isCurrent: true,
              amount: {
                ...(params.minPrice != null ? { gte: params.minPrice } : {}),
                ...(params.maxPrice != null ? { lte: params.maxPrice } : {}),
              },
            },
          },
        }
      : {};

  return {
    published: true,
    ...intentWhere(params.intent),
    ...(params.category ? { category: { slug: params.category } } : {}),
    ...(params.beds != null ? { beds: { gte: params.beds } } : {}),
    ...(params.baths != null ? { baths: { gte: params.baths } } : {}),
    ...priceFilter,
    ...(params.q
      ? {
          OR: [
            { title: { contains: params.q, mode: "insensitive" } },
            { city: { contains: params.q, mode: "insensitive" } },
            { address: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

async function loadFeaturedProperties() {
  const rows = await db.property.findMany({
    where: { published: true, featured: true },
    include: propertyCardInclude,
    orderBy: { updatedAt: "desc" },
    take: 6,
  });

  return rows.map(mapPropertyCard);
}

async function loadPublishedProperty(slug: string) {
  const row = await db.property.findFirst({
    where: { slug, published: true },
    include: propertyDetailInclude,
  });

  return row ? mapPropertyDetail(row) : null;
}

async function loadPublishedSlugs() {
  const rows = await db.property.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  return rows;
}

export const listFeaturedProperties = unstable_cache(
  loadFeaturedProperties,
  ["featured-properties"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.properties],
  },
);

export const getPublishedProperty = unstable_cache(
  loadPublishedProperty,
  ["published-property"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.properties],
  },
);

export const listPublishedPropertySlugs = unstable_cache(
  loadPublishedSlugs,
  ["published-property-slugs"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.properties],
  },
);

export const listPublishedCatalog = unstable_cache(
  async () =>
    searchPublishedProperties({
      page: 1,
      pageSize: 12,
    }),
  ["published-catalog"],
  {
    revalidate: CATALOG_REVALIDATE_SECONDS,
    tags: [CATALOG_TAGS.properties],
  },
);

export async function listPublishedPropertiesByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }

  const rows = await db.property.findMany({
    where: { id: { in: ids }, published: true },
    include: propertyCardInclude,
  });

  const byId = new Map(rows.map((row) => [row.id, mapPropertyCard(row)]));

  return ids.flatMap((id) => {
    const property = byId.get(id);
    return property ? [property] : [];
  });
}

export async function searchPublishedProperties(params: PropertySearchParams) {
  const where = searchWhere(params);
  const skip = (params.page - 1) * params.pageSize;

  const [rows, total] = await Promise.all([
    db.property.findMany({
      where,
      include: propertyCardInclude,
      orderBy: { updatedAt: "desc" },
      skip,
      take: params.pageSize,
    }),
    db.property.count({ where }),
  ]);

  return {
    items: rows.map(mapPropertyCard),
    total,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export async function listAdminProperties() {
  const rows = await db.property.findMany({
    include: propertyCardInclude,
    orderBy: { updatedAt: "desc" },
  });

  return rows.map((row) => ({
    ...mapPropertyCard(row),
    published: row.published,
  }));
}

export async function getAdminProperty(id: string) {
  const row = await db.property.findUnique({
    where: { id },
    include: propertyDetailInclude,
  });

  return row ? mapPropertyDetail(row) : null;
}

export async function propertySlugTaken(slug: string, excludeId?: string) {
  const row = await db.property.findUnique({
    where: { slug },
    select: { id: true },
  });

  return Boolean(row && row.id !== excludeId);
}

type PropertyWriteInput = {
  title: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  dealType: Prisma.PropertyCreateInput["dealType"];
  useType: Prisma.PropertyCreateInput["useType"];
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  featured: boolean;
  published: boolean;
  categoryId: string;
  amenityIds: string[];
  currentPrice?: {
    amount: number;
    currency: string;
    period: Prisma.PropertyPriceCreateInput["period"];
  };
};

export async function createProperty(input: PropertyWriteInput) {
  const row = await db.property.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      address: input.address,
      city: input.city,
      dealType: input.dealType,
      useType: input.useType,
      beds: input.beds,
      baths: input.baths,
      sqft: input.sqft,
      featured: input.featured,
      published: input.published,
      category: { connect: { id: input.categoryId } },
      amenities: {
        connect: input.amenityIds.map((id) => ({ id })),
      },
      prices: input.currentPrice
        ? {
            create: {
              amount: input.currentPrice.amount,
              currency: input.currentPrice.currency,
              period: input.currentPrice.period,
              effectiveFrom: new Date(),
              isCurrent: true,
            },
          }
        : undefined,
    },
    include: propertyDetailInclude,
  });

  return mapPropertyDetail(row);
}

export async function updateProperty(id: string, input: PropertyWriteInput) {
  const row = await db.$transaction(async (tx) => {
    if (input.currentPrice) {
      await tx.propertyPrice.updateMany({
        where: { propertyId: id, isCurrent: true },
        data: { isCurrent: false },
      });
    }

    return tx.property.update({
      where: { id },
      data: {
        title: input.title,
        slug: input.slug,
        description: input.description,
        address: input.address,
        city: input.city,
        dealType: input.dealType,
        useType: input.useType,
        beds: input.beds,
        baths: input.baths,
        sqft: input.sqft,
        featured: input.featured,
        published: input.published,
        category: { connect: { id: input.categoryId } },
        amenities: {
          set: input.amenityIds.map((amenityId) => ({ id: amenityId })),
        },
        prices: input.currentPrice
          ? {
              create: {
                amount: input.currentPrice.amount,
                currency: input.currentPrice.currency,
                period: input.currentPrice.period,
                effectiveFrom: new Date(),
                isCurrent: true,
              },
            }
          : undefined,
      },
      include: propertyDetailInclude,
    });
  });

  return mapPropertyDetail(row);
}

export async function deleteProperty(id: string) {
  await db.property.delete({ where: { id } });
}

export async function addPropertyImage(input: {
  propertyId: string;
  url: string;
  alt: string;
  isCover: boolean;
}) {
  if (input.isCover) {
    await db.propertyImage.updateMany({
      where: { propertyId: input.propertyId },
      data: { isCover: false },
    });
  }

  const last = await db.propertyImage.findFirst({
    where: { propertyId: input.propertyId },
    orderBy: { sort: "desc" },
    select: { sort: true },
  });

  const row = await db.propertyImage.create({
    data: {
      propertyId: input.propertyId,
      url: input.url,
      alt: input.alt,
      isCover: input.isCover,
      sort: (last?.sort ?? -1) + 1,
    },
  });

  return mapPropertyImage(row);
}

export async function deletePropertyImage(propertyId: string, imageId: string) {
  const image = await db.propertyImage.findFirst({
    where: { id: imageId, propertyId },
  });

  if (!image) {
    return null;
  }

  await db.propertyImage.delete({ where: { id: imageId } });
  return image;
}

export async function setPropertyCover(propertyId: string, imageId: string) {
  await db.$transaction([
    db.propertyImage.updateMany({
      where: { propertyId },
      data: { isCover: false },
    }),
    db.propertyImage.update({
      where: { id: imageId },
      data: { isCover: true },
    }),
  ]);
}
