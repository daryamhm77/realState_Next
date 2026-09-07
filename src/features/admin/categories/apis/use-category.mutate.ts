"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { Category, CategoryWrite } from "@/contracts/category";
import { parseApiData } from "@/lib/http";
import { queryKeys } from "@/lib/query-keys";
import { PATHS } from "@/routes/paths";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: CategoryWrite) => {
      const response = await fetch(PATHS.api.adminCategories, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      return parseApiData<Category>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      router.push(PATHS.adminCategories);
      router.refresh();
    },
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: CategoryWrite) => {
      const response = await fetch(PATHS.api.adminCategory(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      return parseApiData<Category>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      router.push(PATHS.adminCategories);
      router.refresh();
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(PATHS.api.adminCategory(id), {
        method: "DELETE",
      });

      return parseApiData<{ id: string }>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      router.push(PATHS.adminCategories);
      router.refresh();
    },
  });
}
