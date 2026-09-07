"use client";

import { useQuery } from "@tanstack/react-query";

import type { PropertyCard } from "@/contracts/property";
import { parseApiData } from "@/lib/http";
import { queryKeys } from "@/lib/query-keys";
import { PATHS } from "@/routes/paths";

export function useComparePropertiesQuery(ids: string[], enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.propertiesByIds(ids),
    queryFn: async () => {
      const search = new URLSearchParams({ ids: ids.join(",") });
      const response = await fetch(`${PATHS.api.propertiesByIds}?${search}`);
      return parseApiData<PropertyCard[]>(response);
    },
    enabled: enabled && ids.length > 0,
  });
}
