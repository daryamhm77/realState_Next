"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { PropertyImage } from "@/contracts/property";
import {
  useDeletePropertyImage,
  useSetPropertyCover,
  useUploadPropertyImage,
} from "@/features/admin/properties/apis/use-property.mutate";
import { messages } from "@/messages";

export function PropertyMediaManager({
  propertyId,
  images,
}: {
  propertyId: string;
  images: PropertyImage[];
}) {
  const upload = useUploadPropertyImage(propertyId);
  const remove = useDeletePropertyImage(propertyId);
  const setCover = useSetPropertyCover(propertyId);
  const [alt, setAlt] = useState("");

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      toast.error(messages.admin.genericError);
      return;
    }

    formData.set("alt", alt);
    formData.set("isCover", images.length === 0 ? "true" : "false");

    try {
      await upload.mutateAsync(formData);
      setAlt("");
      form.reset();
      toast.success(messages.admin.saved);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : messages.admin.genericError,
      );
    }
  }

  return (
    <section className="flex max-w-3xl flex-col gap-4">
      <h2 className="font-heading text-xl font-semibold">
        {messages.admin.propertyMediaLabel}
      </h2>

      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="property-photo">{messages.admin.propertyUpload}</FieldLabel>
            <Input id="property-photo" name="file" type="file" accept="image/jpeg,image/png,image/webp" />
          </Field>
          <Field>
            <FieldLabel htmlFor="property-photo-alt">
              {messages.admin.propertyAltLabel}
            </FieldLabel>
            <Input
              id="property-photo-alt"
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
            />
          </Field>
        </FieldGroup>
        <Button type="submit" disabled={upload.isPending} className="w-fit">
          {upload.isPending ? <Spinner data-icon="inline-start" /> : null}
          {messages.admin.propertyUpload}
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image) => (
          <div key={image.id} className="flex flex-col gap-3 rounded-xl ring-1 ring-foreground/10">
            <div className="relative aspect-4/3 overflow-hidden rounded-t-xl bg-muted">
              <Image
                src={image.url}
                alt={image.alt || image.url}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 320px"
              />
            </div>
            <div className="flex flex-wrap gap-2 px-3 pb-3">
              {image.isCover ? (
                <span className="text-sm text-muted-foreground">
                  {messages.admin.propertyCoverLabel}
                </span>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={setCover.isPending}
                  onClick={() => setCover.mutate(image.id)}
                >
                  {messages.admin.propertyCoverLabel}
                </Button>
              )}
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={remove.isPending}
                onClick={() => remove.mutate(image.id)}
              >
                {messages.admin.delete}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
