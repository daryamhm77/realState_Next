"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { FavoriteList, FavoriteToggleResult } from "@/contracts/favorite";
import { parseApiData } from "@/lib/http";
import { queryKeys } from "@/lib/query-keys";
import { PATHS } from "@/routes/paths";

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const response = await fetch(PATHS.api.favorites, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      return parseApiData<FavoriteToggleResult>(response);
    },
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites });
      const previous = queryClient.getQueryData<FavoriteList>(queryKeys.favorites);

      queryClient.setQueryData<FavoriteList>(queryKeys.favorites, (current) => {
        if (!current) {
          return { ids: [propertyId], items: [] };
        }

        const isFavorited = current.ids.includes(propertyId);

        return {
          ids: isFavorited
            ? current.ids.filter((id) => id !== propertyId)
            : [...current.ids, propertyId],
          items: isFavorited
            ? current.items.filter((item) => item.id !== propertyId)
            : current.items,
        };
      });

      return { previous };
    },
    onError: (_error, _propertyId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.favorites, context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.favorites });
      router.refresh();
    },
  });
}
