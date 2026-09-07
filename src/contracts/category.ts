import { z } from "zod";

import { idSchema, slugSchema } from "@/contracts/common";

export const categorySchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  slug: slugSchema,
  description: z.string().optional(),
});

export const categoryListSchema = z.array(categorySchema);

export const categoryWriteSchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: slugSchema.optional(),
  description: z.string().trim().max(240).optional(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryWrite = z.infer<typeof categoryWriteSchema>;
