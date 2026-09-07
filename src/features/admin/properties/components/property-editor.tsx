"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Amenity } from "@/contracts/amenity";
import type { Category } from "@/contracts/category";
import type { PropertyDetail } from "@/contracts/property";
import { DeleteRecordButton } from "@/features/admin/components/delete-record-button";
import {
  useCreateProperty,
  useDeleteProperty,
  useUpdateProperty,
} from "@/features/admin/properties/apis/use-property.mutate";
import { PropertyForm } from "@/features/admin/properties/components/property-form";
import { PropertyMediaManager } from "@/features/admin/properties/components/property-media-manager";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function PropertyEditor({
  property,
  categories,
  amenities,
}: {
  property?: PropertyDetail;
  categories: Category[];
  amenities: Amenity[];
}) {
  const create = useCreateProperty();
  const update = useUpdateProperty(property?.id ?? "");
  const remove = useDeleteProperty();
  const isPending = create.isPending || update.isPending;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href={PATHS.adminProperties} />}
            className="w-fit px-0"
          >
            {messages.admin.back}
          </Button>
          <h1 className="font-heading text-3xl font-semibold">
            {property
              ? messages.admin.propertyEditTitle
              : messages.admin.propertyCreateTitle}
          </h1>
        </div>
        {property ? (
          <DeleteRecordButton
            isPending={remove.isPending}
            onConfirm={() => remove.mutateAsync(property.id)}
          />
        ) : null}
      </div>

      <PropertyForm
        property={property}
        categories={categories}
        amenities={amenities}
        isPending={isPending}
        onSubmit={(values) =>
          property ? update.mutateAsync(values) : create.mutateAsync(values)
        }
      />

      {property ? (
        <PropertyMediaManager propertyId={property.id} images={property.images} />
      ) : null}
    </div>
  );
}
