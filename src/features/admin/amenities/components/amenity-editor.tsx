"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  useCreateAmenity,
  useDeleteAmenity,
  useUpdateAmenity,
} from "@/features/admin/amenities/apis/use-amenity.mutate";
import { AmenityForm } from "@/features/admin/amenities/components/amenity-form";
import type { Amenity } from "@/features/admin/amenities/types";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function AmenityEditor({ amenity }: { amenity?: Amenity }) {
  const create = useCreateAmenity();
  const update = useUpdateAmenity(amenity?.id ?? "");
  const remove = useDeleteAmenity();
  const isPending = create.isPending || update.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href={PATHS.adminAmenities} />}
            className="w-fit px-0"
          >
            {messages.admin.back}
          </Button>
          <h1 className="font-heading text-3xl font-semibold">
            {amenity
              ? messages.admin.amenityEditTitle
              : messages.admin.amenityCreateTitle}
          </h1>
        </div>
        {amenity ? (
          <DeleteRecordButton
            isPending={remove.isPending}
            onConfirm={() => remove.mutateAsync(amenity.id)}
          />
        ) : null}
      </div>

      <AmenityForm
        amenity={amenity}
        isPending={isPending}
        onSubmit={(values) =>
          amenity ? update.mutateAsync(values) : create.mutateAsync(values)
        }
      />
    </div>
  );
}
