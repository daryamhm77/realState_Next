"use client";

import { useQuery } from "@tanstack/react-query";

import type {
  PropertySearchParams,
  PropertySearchResult,
} from "@/contracts/property";
import { parseApiData } from "@/lib/http";
import { queryKeys } from "@/lib/query-keys";
import { PATHS, propertiesPath } from "@/routes/paths";

export function useSearchPropertiesQuery(
  params: PropertySearchParams,
  initialData: PropertySearchResult,
) {
  return useQuery({
    queryKey: queryKeys.properties(params),
    queryFn: async () => {
      const path = propertiesPath(params);
      const query = path.includes("?") ? path.slice(path.indexOf("?")) : "";
      const response = await fetch(`${PATHS.api.properties}${query}`);
      return parseApiData<PropertySearchResult>(response);
    },
    initialData,
    staleTime: 30_000,
  });
}
