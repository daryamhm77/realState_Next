import { z } from "zod";

import { idSchema, slugSchema } from "@/contracts/common";

export const pageNavPlacementSchema = z.enum(["NONE", "HEADER", "FOOTER"]);

export const cmsPageSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  slug: slugSchema,
  body: z.string(),
  navPlacement: pageNavPlacementSchema,
  published: z.boolean(),
});

export const cmsPageListSchema = z.array(cmsPageSchema);

export const cmsPageSlugSchema = z.object({
  slug: slugSchema,
  updatedAt: z.date(),
});

export const cmsPageWriteSchema = z.object({
  title: z.string().trim().min(1).max(120),
  slug: z.union([slugSchema, z.literal("")]).optional(),
  body: z.string().trim().min(1).max(20_000),
  navPlacement: pageNavPlacementSchema,
  published: z.boolean(),
});

export type PageNavPlacement = z.infer<typeof pageNavPlacementSchema>;
export type CmsPage = z.infer<typeof cmsPageSchema>;
export type CmsPageSlug = z.infer<typeof cmsPageSlugSchema>;
export type CmsPageWrite = z.infer<typeof cmsPageWriteSchema>;
