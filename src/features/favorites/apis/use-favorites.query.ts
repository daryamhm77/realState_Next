"use client";

import { useQuery } from "@tanstack/react-query";

import type { FavoriteList } from "@/contracts/favorite";
import { parseApiData } from "@/lib/http";
import { queryKeys } from "@/lib/query-keys";
import { useSessionUser } from "@/providers/session-provider";
import { PATHS } from "@/routes/paths";

export function useFavoritesQuery(initialData?: FavoriteList) {
  const { user, isPending } = useSessionUser();

  return useQuery({
    queryKey: queryKeys.favorites,
    queryFn: async () => {
      const response = await fetch(PATHS.api.favorites);
      return parseApiData<FavoriteList>(response);
    },
    enabled: Boolean(initialData) || (!isPending && Boolean(user)),
    initialData,
  });
}
