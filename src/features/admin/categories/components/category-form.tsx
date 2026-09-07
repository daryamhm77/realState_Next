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
import { Textarea } from "@/components/ui/textarea";
import { categoryFormSchema } from "@/features/admin/categories/schemas/category";
import type { Category, CategoryWrite } from "@/features/admin/categories/types";
import { messages } from "@/messages";

type CategoryFormProps = {
  category?: Category;
  onSubmit: (values: CategoryWrite) => Promise<unknown>;
  isPending: boolean;
};

export function CategoryForm({
  category,
  onSubmit,
  isPending,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryWrite>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
    },
  });

  async function submit(values: CategoryWrite) {
    try {
      await onSubmit({
        ...values,
        slug: values.slug || undefined,
        description: values.description || undefined,
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
          <FieldLabel htmlFor="category-name">{messages.admin.nameLabel}</FieldLabel>
          <Input
            id="category-name"
            aria-invalid={!!errors.name || undefined}
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.slug || undefined}>
          <FieldLabel htmlFor="category-slug">{messages.admin.slugLabel}</FieldLabel>
          <Input
            id="category-slug"
            aria-invalid={!!errors.slug || undefined}
            placeholder={messages.admin.slugHint}
            {...register("slug")}
          />
          <FieldError errors={[errors.slug]} />
        </Field>

        <Field data-invalid={!!errors.description || undefined}>
          <FieldLabel htmlFor="category-description">
            {messages.admin.descriptionLabel}
          </FieldLabel>
          <Textarea
            id="category-description"
            aria-invalid={!!errors.description || undefined}
            {...register("description")}
          />
          <FieldError errors={[errors.description]} />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        {messages.admin.save}
      </Button>
    </form>
  );
}
