"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { amenityFormSchema } from "@/features/admin/amenities/schemas/amenity";
import type { Amenity, AmenityWrite } from "@/features/admin/amenities/types";
import { messages } from "@/messages";

type AmenityFormProps = {
  amenity?: Amenity;
  onSubmit: (values: AmenityWrite) => Promise<unknown>;
  isPending: boolean;
};

export function AmenityForm({ amenity, onSubmit, isPending }: AmenityFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AmenityWrite>({
    resolver: zodResolver(amenityFormSchema),
    defaultValues: {
      name: amenity?.name ?? "",
      slug: amenity?.slug ?? "",
    },
  });

  async function submit(values: AmenityWrite) {
    try {
      await onSubmit({
        ...values,
        slug: values.slug || undefined,
      });
      toast.success(messages.admin.saved);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : messages.admin.genericError,
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex max-w-xl flex-col gap-5">
      <FieldGroup>
        <Field data-invalid={!!errors.name || undefined}>
          <FieldLabel htmlFor="amenity-name">{messages.admin.nameLabel}</FieldLabel>
          <Input
            id="amenity-name"
            aria-invalid={!!errors.name || undefined}
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.slug || undefined}>
          <FieldLabel htmlFor="amenity-slug">{messages.admin.slugLabel}</FieldLabel>
          <Input
            id="amenity-slug"
            aria-invalid={!!errors.slug || undefined}
            placeholder={messages.admin.slugHint}
            {...register("slug")}
          />
          <FieldError errors={[errors.slug]} />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        {messages.admin.save}
      </Button>
    </form>
  );
}
