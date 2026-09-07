"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { PropertyDetail, PropertyImage, PropertyWrite } from "@/contracts/property";
import { parseApiData } from "@/lib/http";
import { queryKeys } from "@/lib/query-keys";
import { PATHS } from "@/routes/paths";

export function useCreateProperty() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: PropertyWrite) => {
      const response = await fetch(PATHS.api.adminProperties, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      return parseApiData<PropertyDetail>(response);
    },
    onSuccess: async (property) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.properties() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminProperties });
      router.push(PATHS.adminProperty(property.id));
      router.refresh();
    },
  });
}

export function useUpdateProperty(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (input: PropertyWrite) => {
      const response = await fetch(PATHS.api.adminProperty(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      return parseApiData<PropertyDetail>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.properties() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminProperties });
      router.refresh();
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(PATHS.api.adminProperty(id), {
        method: "DELETE",
      });

      return parseApiData<{ id: string }>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.properties() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.adminProperties });
      router.push(PATHS.adminProperties);
      router.refresh();
    },
  });
}

export function useUploadPropertyImage(propertyId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(PATHS.api.adminPropertyImages(propertyId), {
        method: "POST",
        body: formData,
      });

      return parseApiData<PropertyImage>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.properties() });
      router.refresh();
    },
  });
}

export function useDeletePropertyImage(propertyId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const response = await fetch(
        PATHS.api.adminPropertyImage(propertyId, imageId),
        { method: "DELETE" },
      );

      return parseApiData<{ id: string }>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.properties() });
      router.refresh();
    },
  });
}

export function useSetPropertyCover(propertyId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const response = await fetch(
        PATHS.api.adminPropertyImage(propertyId, imageId),
        { method: "PATCH" },
      );

      return parseApiData<{ id: string; isCover: boolean }>(response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.properties() });
      router.refresh();
    },
  });
}
