"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { pageFormSchema } from "@/features/admin/pages/schemas/page";
import type { CmsPage, CmsPageWrite } from "@/features/admin/pages/types";
import { messages } from "@/messages";

type PageFormProps = {
  page?: CmsPage;
  onSubmit: (values: CmsPageWrite) => Promise<unknown>;
  isPending: boolean;
};

const navItems = [
  { label: messages.admin.navNone, value: "NONE" },
  { label: messages.admin.navHeader, value: "HEADER" },
  { label: messages.admin.navFooter, value: "FOOTER" },
] as const;

export function PageForm({ page, onSubmit, isPending }: PageFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CmsPageWrite>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: page?.title ?? "",
      slug: page?.slug ?? "",
      body: page?.body ?? "",
      navPlacement: page?.navPlacement ?? "NONE",
      published: page?.published ?? true,
    },
  });

  async function submit(values: CmsPageWrite) {
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
        <Field data-invalid={!!errors.title || undefined}>
          <FieldLabel htmlFor="page-title">{messages.admin.pageTitleLabel}</FieldLabel>
          <Input
            id="page-title"
            aria-invalid={!!errors.title || undefined}
            {...register("title")}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field data-invalid={!!errors.slug || undefined}>
          <FieldLabel htmlFor="page-slug">{messages.admin.slugLabel}</FieldLabel>
          <Input
            id="page-slug"
            aria-invalid={!!errors.slug || undefined}
            placeholder={messages.admin.slugHint}
            {...register("slug")}
          />
          <FieldError errors={[errors.slug]} />
        </Field>

        <Field data-invalid={!!errors.body || undefined}>
          <FieldLabel htmlFor="page-body">{messages.admin.pageBodyLabel}</FieldLabel>
          <Textarea
            id="page-body"
            aria-invalid={!!errors.body || undefined}
            rows={10}
            {...register("body")}
          />
          <FieldError errors={[errors.body]} />
        </Field>

        <Controller
          control={control}
          name="navPlacement"
          render={({ field }) => (
            <Field>
              <FieldLabel>{messages.admin.pageNavLabel}</FieldLabel>
              <Select
                items={[...navItems]}
                value={field.value}
                onValueChange={(value) => {
                  if (value === "NONE" || value === "HEADER" || value === "FOOTER") {
                    field.onChange(value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {navItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="published"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              <FieldLabel>{messages.admin.publishedLabel}</FieldLabel>
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? <Spinner data-icon="inline-start" /> : null}
        {messages.admin.save}
      </Button>
    </form>
  );
}
