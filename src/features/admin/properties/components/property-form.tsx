"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Amenity } from "@/contracts/amenity";
import type { Category } from "@/contracts/category";
import type { PropertyDetail, PropertyWrite } from "@/contracts/property";
import {
  propertyFormSchema,
  type PropertyFormValues,
} from "@/features/admin/properties/schemas/property";
import { messages } from "@/messages";

type PropertyFormProps = {
  property?: PropertyDetail;
  categories: Category[];
  amenities: Amenity[];
  onSubmit: (values: PropertyWrite) => Promise<unknown>;
  isPending: boolean;
};

function optionalNumber(value: string) {
  if (value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function PropertyForm({
  property,
  categories,
  amenities,
  onSubmit,
  isPending,
}: PropertyFormProps) {
  const currentPrice = property?.currentPrice;
  const categoryItems = [
    { label: messages.admin.propertyCategoryLabel, value: null },
    ...categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: property?.title ?? "",
      slug: property?.slug ?? "",
      description: property?.description ?? "",
      address: property?.address ?? "",
      city: property?.city ?? "",
      dealType: property?.dealType ?? "SALE",
      useType: property?.useType ?? "RESIDENTIAL",
      beds: property?.beds ?? null,
      baths: property?.baths ?? null,
      sqft: property?.sqft ?? null,
      featured: property?.featured ?? false,
      published: property?.published ?? false,
      categoryId: property?.category.id ?? "",
      amenityIds: property?.amenities.map((amenity) => amenity.id) ?? [],
      amount: currentPrice?.amount ?? null,
      currency: currentPrice?.currency ?? "USD",
      period: currentPrice?.period ?? "TOTAL",
    },
  });

  async function submit(values: PropertyFormValues) {
    const payload: PropertyWrite = {
      title: values.title,
      slug: values.slug || undefined,
      description: values.description,
      address: values.address,
      city: values.city,
      dealType: values.dealType,
      useType: values.useType,
      beds: values.beds,
      baths: values.baths,
      sqft: values.sqft,
      featured: values.featured,
      published: values.published,
      categoryId: values.categoryId,
      amenityIds: values.amenityIds,
      currentPrice:
        values.amount != null
          ? {
              amount: values.amount,
              currency: values.currency,
              period: values.period,
            }
          : undefined,
    };

    try {
      await onSubmit(payload);
      toast.success(messages.admin.saved);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : messages.admin.genericError,
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex max-w-3xl flex-col gap-6">
      <FieldGroup>
        <Field data-invalid={!!errors.title || undefined}>
          <FieldLabel htmlFor="property-title">
            {messages.admin.propertyTitleLabel}
          </FieldLabel>
          <Input
            id="property-title"
            aria-invalid={!!errors.title || undefined}
            {...register("title")}
          />
          <FieldError errors={[errors.title]} />
        </Field>

        <Field data-invalid={!!errors.slug || undefined}>
          <FieldLabel htmlFor="property-slug">{messages.admin.slugLabel}</FieldLabel>
          <Input
            id="property-slug"
            aria-invalid={!!errors.slug || undefined}
            placeholder={messages.admin.slugHint}
            {...register("slug")}
          />
          <FieldError errors={[errors.slug]} />
        </Field>

        <Field data-invalid={!!errors.description || undefined}>
          <FieldLabel htmlFor="property-description">
            {messages.admin.descriptionLabel}
          </FieldLabel>
          <Textarea
            id="property-description"
            rows={6}
            aria-invalid={!!errors.description || undefined}
            {...register("description")}
          />
          <FieldError errors={[errors.description]} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={!!errors.address || undefined}>
            <FieldLabel htmlFor="property-address">
              {messages.admin.propertyAddressLabel}
            </FieldLabel>
            <Input
              id="property-address"
              aria-invalid={!!errors.address || undefined}
              {...register("address")}
            />
            <FieldError errors={[errors.address]} />
          </Field>
          <Field data-invalid={!!errors.city || undefined}>
            <FieldLabel htmlFor="property-city">
              {messages.admin.propertyCityLabel}
            </FieldLabel>
            <Input
              id="property-city"
              aria-invalid={!!errors.city || undefined}
              {...register("city")}
            />
            <FieldError errors={[errors.city]} />
          </Field>
        </div>

        <Controller
          control={control}
          name="dealType"
          render={({ field }) => (
            <Field>
              <FieldLabel>{messages.admin.propertyDealTypeLabel}</FieldLabel>
              <ToggleGroup
                value={[field.value]}
                onValueChange={(value) => {
                  const next = value[0];
                  if (next === "SALE" || next === "RENT") {
                    field.onChange(next);
                  }
                }}
              >
                <ToggleGroupItem value="SALE">{messages.admin.sale}</ToggleGroupItem>
                <ToggleGroupItem value="RENT">{messages.admin.rent}</ToggleGroupItem>
              </ToggleGroup>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="useType"
          render={({ field }) => (
            <Field>
              <FieldLabel>{messages.admin.propertyUseTypeLabel}</FieldLabel>
              <ToggleGroup
                value={[field.value]}
                onValueChange={(value) => {
                  const next = value[0];
                  if (next === "RESIDENTIAL" || next === "COMMERCIAL") {
                    field.onChange(next);
                  }
                }}
              >
                <ToggleGroupItem value="RESIDENTIAL">
                  {messages.admin.residential}
                </ToggleGroupItem>
                <ToggleGroupItem value="COMMERCIAL">
                  {messages.admin.commercial}
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>
          )}
        />

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Field data-invalid={!!errors.categoryId || undefined}>
              <FieldLabel>{messages.admin.propertyCategoryLabel}</FieldLabel>
              <Select
                items={categoryItems}
                value={field.value || null}
                onValueChange={(value) => field.onChange(value ?? "")}
              >
                <SelectTrigger className="w-full" aria-invalid={!!errors.categoryId || undefined}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categoryItems.map((item) => (
                      <SelectItem key={item.value ?? "empty"} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.categoryId]} />
            </Field>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="property-beds">
              {messages.admin.propertyBedsLabel}
            </FieldLabel>
            <Input
              id="property-beds"
              type="number"
              min={0}
              {...register("beds", { setValueAs: optionalNumber })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="property-baths">
              {messages.admin.propertyBathsLabel}
            </FieldLabel>
            <Input
              id="property-baths"
              type="number"
              min={0}
              {...register("baths", { setValueAs: optionalNumber })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="property-sqft">
              {messages.admin.propertySqftLabel}
            </FieldLabel>
            <Input
              id="property-sqft"
              type="number"
              min={0}
              {...register("sqft", { setValueAs: optionalNumber })}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="property-amount">
              {messages.admin.propertyPriceLabel}
            </FieldLabel>
            <Input
              id="property-amount"
              type="number"
              min={1}
              {...register("amount", { setValueAs: optionalNumber })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="property-currency">
              {messages.admin.propertyCurrencyLabel}
            </FieldLabel>
            <Input id="property-currency" maxLength={3} {...register("currency")} />
          </Field>
          <Controller
            control={control}
            name="period"
            render={({ field }) => (
              <Field>
                <FieldLabel>{messages.admin.propertyPeriodLabel}</FieldLabel>
                <ToggleGroup
                  value={[field.value]}
                  onValueChange={(value) => {
                    const next = value[0];
                    if (next === "TOTAL" || next === "MONTHLY") {
                      field.onChange(next);
                    }
                  }}
                >
                  <ToggleGroupItem value="TOTAL">
                    {messages.admin.periodTotal}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="MONTHLY">
                    {messages.admin.periodMonthly}
                  </ToggleGroupItem>
                </ToggleGroup>
              </Field>
            )}
          />
        </div>

        <Controller
          control={control}
          name="amenityIds"
          render={({ field }) => (
            <FieldSet>
              <FieldLegend>{messages.admin.propertyAmenitiesLabel}</FieldLegend>
              <div className="grid gap-3 sm:grid-cols-2">
                {amenities.map((amenity) => {
                  const checked = field.value.includes(amenity.id);

                  return (
                    <Field key={amenity.id} orientation="horizontal">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(next) => {
                          field.onChange(
                            next
                              ? [...field.value, amenity.id]
                              : field.value.filter((id) => id !== amenity.id),
                          );
                        }}
                      />
                      <FieldLabel>{amenity.name}</FieldLabel>
                    </Field>
                  );
                })}
              </div>
            </FieldSet>
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

        <Controller
          control={control}
          name="featured"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              <FieldLabel>{messages.admin.featuredLabel}</FieldLabel>
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
