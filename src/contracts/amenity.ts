import { z } from "zod";

import { idSchema, slugSchema } from "@/contracts/common";

export const amenitySchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  slug: slugSchema,
});

export const amenityListSchema = z.array(amenitySchema);

export const amenityWriteSchema = z.object({
  name: z.string().trim().min(1).max(80),
  slug: slugSchema.optional(),
});

export type Amenity = z.infer<typeof amenitySchema>;
export type AmenityWrite = z.infer<typeof amenityWriteSchema>;
