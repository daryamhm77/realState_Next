import { z } from "zod";

import { categorySchema } from "@/contracts/category";
import { amenitySchema } from "@/contracts/amenity";
import {
  currencyCodeSchema,
  idSchema,
  paginationSchema,
  slugSchema,
} from "@/contracts/common";

export const dealTypeSchema = z.enum(["SALE", "RENT"]);
export const useTypeSchema = z.enum(["RESIDENTIAL", "COMMERCIAL"]);
export const pricePeriodSchema = z.enum(["TOTAL", "MONTHLY"]);
export const propertyIntentSchema = z.enum(["buy", "rent", "commercial"]);

export const propertyPriceSchema = z.object({
  id: idSchema,
  amount: z.number(),
  currency: currencyCodeSchema,
  period: pricePeriodSchema,
  effectiveFrom: z.coerce.date(),
  isCurrent: z.boolean(),
});

export const propertyImageSchema = z.object({
  id: idSchema,
  url: z.string().min(1),
  alt: z.string(),
  sort: z.number().int(),
  isCover: z.boolean(),
});

export const propertyCurrentPriceSchema = propertyPriceSchema.pick({
  amount: true,
  currency: true,
  period: true,
});

export const propertyCardSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  slug: slugSchema,
  address: z.string(),
  city: z.string(),
  dealType: dealTypeSchema,
  useType: useTypeSchema,
  beds: z.number().int().nullable(),
  baths: z.number().int().nullable(),
  sqft: z.number().int().nullable(),
  featured: z.boolean(),
  category: categorySchema.pick({ id: true, name: true, slug: true }),
  coverImage: propertyImageSchema.pick({ url: true, alt: true }).nullable(),
  currentPrice: propertyCurrentPriceSchema.nullable(),
});

export const propertyDetailSchema = propertyCardSchema.extend({
  description: z.string(),
  published: z.boolean(),
  amenities: z.array(amenitySchema),
  images: z.array(propertyImageSchema),
  prices: z.array(propertyPriceSchema),
});

export const propertySearchParamsSchema = paginationSchema.extend({
  q: z.string().optional(),
  intent: propertyIntentSchema.optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  beds: z.coerce.number().int().optional(),
  baths: z.coerce.number().int().optional(),
});

export const propertyCardListSchema = z.array(propertyCardSchema);

export const propertySearchResultSchema = z.object({
  items: propertyCardListSchema,
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
});

export const propertyPriceInputSchema = z.object({
  amount: z.coerce.number().int().positive(),
  currency: currencyCodeSchema.default("USD"),
  period: pricePeriodSchema,
});

export const propertyWriteSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: slugSchema.optional(),
  description: z.string(),
  address: z.string().trim().min(1),
  city: z.string().trim().min(1),
  dealType: dealTypeSchema,
  useType: useTypeSchema,
  beds: z.number().int().min(0).nullable(),
  baths: z.number().int().min(0).nullable(),
  sqft: z.number().int().min(0).nullable(),
  featured: z.boolean(),
  published: z.boolean(),
  categoryId: idSchema,
  amenityIds: z.array(idSchema),
  currentPrice: propertyPriceInputSchema.optional(),
});

export const propertyImageWriteSchema = z.object({
  propertyId: idSchema,
  alt: z.string().max(160).default(""),
  isCover: z.boolean().default(false),
});

export type DealType = z.infer<typeof dealTypeSchema>;
export type UseType = z.infer<typeof useTypeSchema>;
export type PricePeriod = z.infer<typeof pricePeriodSchema>;
export type PropertyIntent = z.infer<typeof propertyIntentSchema>;
export type PropertyPrice = z.infer<typeof propertyPriceSchema>;
export type PropertyImage = z.infer<typeof propertyImageSchema>;
export type PropertyCard = z.infer<typeof propertyCardSchema>;
export type PropertyDetail = z.infer<typeof propertyDetailSchema>;
export type PropertySearchParams = z.infer<typeof propertySearchParamsSchema>;
export type PropertySearchResult = z.infer<typeof propertySearchResultSchema>;
export type PropertyWrite = z.infer<typeof propertyWriteSchema>;
export type PropertyPriceInput = z.infer<typeof propertyPriceInputSchema>;
export type PropertyImageWrite = z.infer<typeof propertyImageWriteSchema>;
