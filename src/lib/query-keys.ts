import type { PropertySearchParams } from "@/contracts/property";

export const queryKeys = {
  categories: ["categories"] as const,
  amenities: ["amenities"] as const,
  properties: (params?: PropertySearchParams) =>
    ["properties", params] as const,
  propertiesByIds: (ids: string[]) => ["properties", "by-ids", ids] as const,
  adminProperties: ["admin-properties"] as const,
  pages: ["pages"] as const,
  favorites: ["favorites"] as const,
};
