"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { CmsPage, CmsPageWrite } from "@/contracts/page";
import { parseApiData } from "@/lib/http";
import { queryKeys } from "@/lib/query-keys";
import { PATHS } from "@/routes/paths";

export function useCreatePage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: CmsPageWrite) => {
      const response = await fetch(PATHS.api.adminPages, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      return parseApiData<CmsPage>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pages });
      router.push(PATHS.adminPages);
      router.refresh();
    },
  });
}

export function useUpdatePage(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: CmsPageWrite) => {
      const response = await fetch(PATHS.api.adminPage(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      return parseApiData<CmsPage>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pages });
      router.push(PATHS.adminPages);
      router.refresh();
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(PATHS.api.adminPage(id), {
        method: "DELETE",
      });

      return parseApiData<{ id: string }>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.pages });
      router.push(PATHS.adminPages);
      router.refresh();
    },
  });
}
