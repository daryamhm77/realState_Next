import type { PropertyCard } from "@/contracts/property";

export type AdminPropertyListItem = PropertyCard & {
  published: boolean;
};
