import { z } from "zod";

import { idSchema } from "@/contracts/common";
import { propertyCardSchema } from "@/contracts/property";

export const favoriteSchema = z.object({
  id: idSchema,
  userId: idSchema,
  propertyId: idSchema,
});

export const favoriteToggleSchema = z.object({
  propertyId: idSchema,
});

export const favoriteToggleResultSchema = z.object({
  favorited: z.boolean(),
  propertyId: idSchema,
});

export const favoriteListSchema = z.object({
  ids: z.array(idSchema),
  items: z.array(propertyCardSchema),
});

export type Favorite = z.infer<typeof favoriteSchema>;
export type FavoriteToggle = z.infer<typeof favoriteToggleSchema>;
export type FavoriteToggleResult = z.infer<typeof favoriteToggleResultSchema>;
export type FavoriteList = z.infer<typeof favoriteListSchema>;
