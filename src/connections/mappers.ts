import type { Amenity } from "@/contracts/amenity";
import type { Category } from "@/contracts/category";
import type { CmsPage } from "@/contracts/page";
import type {
  PropertyCard,
  PropertyDetail,
  PropertyImage,
  PropertyPrice,
} from "@/contracts/property";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type PageRow = {
  id: string;
  title: string;
  slug: string;
  body: string;
  navPlacement: CmsPage["navPlacement"];
  published: boolean;
};

type AmenityRow = {
  id: string;
  name: string;
  slug: string;
};

type ImageRow = {
  id: string;
  url: string;
  alt: string;
  sort: number;
  isCover: boolean;
};

type PriceRow = {
  id: string;
  amount: number;
  currency: string;
  period: PropertyPrice["period"];
  effectiveFrom: Date;
  isCurrent: boolean;
};

type PropertyCardRow = {
  id: string;
  title: string;
  slug: string;
  address: string;
  city: string;
  dealType: PropertyCard["dealType"];
  useType: PropertyCard["useType"];
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  featured: boolean;
  category: CategoryRow;
  images: ImageRow[];
  prices: PriceRow[];
};

type PropertyDetailRow = PropertyCardRow & {
  description: string;
  published: boolean;
  amenities: AmenityRow[];
};

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
  };
}

export function mapAmenity(row: AmenityRow): Amenity {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
  };
}

export function mapPage(row: PageRow): CmsPage {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    body: row.body,
    navPlacement: row.navPlacement,
    published: row.published,
  };
}

export function mapPropertyImage(row: ImageRow): PropertyImage {
  return {
    id: row.id,
    url: row.url,
    alt: row.alt,
    sort: row.sort,
    isCover: row.isCover,
  };
}

export function mapPropertyPrice(row: PriceRow): PropertyPrice {
  return {
    id: row.id,
    amount: row.amount,
    currency: row.currency,
    period: row.period,
    effectiveFrom: row.effectiveFrom,
    isCurrent: row.isCurrent,
  };
}

function mapCoverImage(images: ImageRow[]) {
  const cover = images.find((image) => image.isCover) ?? images[0] ?? null;

  if (!cover) {
    return null;
  }

  return { url: cover.url, alt: cover.alt };
}

function mapCurrentPrice(prices: PriceRow[]) {
  const current = prices.find((price) => price.isCurrent) ?? null;

  if (!current) {
    return null;
  }

  return {
    amount: current.amount,
    currency: current.currency,
    period: current.period,
  };
}

export function mapPropertyCard(row: PropertyCardRow): PropertyCard {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    address: row.address,
    city: row.city,
    dealType: row.dealType,
    useType: row.useType,
    beds: row.beds,
    baths: row.baths,
    sqft: row.sqft,
    featured: row.featured,
    category: {
      id: row.category.id,
      name: row.category.name,
      slug: row.category.slug,
    },
    coverImage: mapCoverImage(row.images),
    currentPrice: mapCurrentPrice(row.prices),
  };
}

export function mapPropertyDetail(row: PropertyDetailRow): PropertyDetail {
  return {
    ...mapPropertyCard(row),
    description: row.description,
    published: row.published,
    amenities: row.amenities.map(mapAmenity),
    images: [...row.images]
      .sort((a, b) => a.sort - b.sort)
      .map(mapPropertyImage),
    prices: row.prices.map(mapPropertyPrice),
  };
}

export const propertyCardInclude = {
  category: true,
  images: { orderBy: { sort: "asc" as const } },
  prices: { where: { isCurrent: true } },
};

export const propertyDetailInclude = {
  category: true,
  amenities: { orderBy: { name: "asc" as const } },
  images: { orderBy: { sort: "asc" as const } },
  prices: { orderBy: { effectiveFrom: "desc" as const } },
};
