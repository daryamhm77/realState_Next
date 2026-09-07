"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { Amenity, AmenityWrite } from "@/contracts/amenity";
import { parseApiData } from "@/lib/http";
import { queryKeys } from "@/lib/query-keys";
import { PATHS } from "@/routes/paths";

export function useCreateAmenity() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: AmenityWrite) => {
      const response = await fetch(PATHS.api.adminAmenities, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      return parseApiData<Amenity>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.amenities });
      router.push(PATHS.adminAmenities);
      router.refresh();
    },
  });
}

export function useUpdateAmenity(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: AmenityWrite) => {
      const response = await fetch(PATHS.api.adminAmenity(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      return parseApiData<Amenity>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.amenities });
      router.push(PATHS.adminAmenities);
      router.refresh();
    },
  });
}

export function useDeleteAmenity() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(PATHS.api.adminAmenity(id), {
        method: "DELETE",
      });

      return parseApiData<{ id: string }>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.amenities });
      router.push(PATHS.adminAmenities);
      router.refresh();
    },
  });
}
