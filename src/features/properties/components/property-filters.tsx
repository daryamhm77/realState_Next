import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { Category } from "@/contracts/category";
import type { PropertySearchParams } from "@/contracts/property";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

type PropertyFiltersProps = {
  categories: Category[];
  search: PropertySearchParams;
};

const fieldClassName =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function PropertyFilters({ categories, search }: PropertyFiltersProps) {
  return (
    <form
      action={PATHS.properties}
      method="get"
      className="flex flex-col gap-4 rounded-xl bg-background p-4 ring-1 ring-foreground/10"
    >
      <p className="text-sm font-medium">{messages.properties.filtersLabel}</p>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="catalog-q">{messages.home.searchLabel}</FieldLabel>
          <input
            id="catalog-q"
            name="q"
            defaultValue={search.q ?? ""}
            placeholder={messages.home.searchPlaceholder}
            className={fieldClassName}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="catalog-intent">{messages.properties.allIntents}</FieldLabel>
          <select
            id="catalog-intent"
            name="intent"
            defaultValue={search.intent ?? ""}
            className={fieldClassName}
          >
            <option value="">{messages.home.intentAll}</option>
            <option value="buy">{messages.home.intentBuy}</option>
            <option value="rent">{messages.home.intentRent}</option>
            <option value="commercial">{messages.home.intentCommercial}</option>
          </select>
        </Field>

        <Field>
          <FieldLabel htmlFor="catalog-category">
            {messages.admin.propertyCategoryLabel}
          </FieldLabel>
          <select
            id="catalog-category"
            name="category"
            defaultValue={search.category ?? ""}
            className={fieldClassName}
          >
            <option value="">{messages.properties.allTypes}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="catalog-min">{messages.properties.minPrice}</FieldLabel>
            <input
              id="catalog-min"
              name="minPrice"
              type="number"
              min={0}
              defaultValue={search.minPrice != null ? String(search.minPrice) : ""}
              className={fieldClassName}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="catalog-max">{messages.properties.maxPrice}</FieldLabel>
            <input
              id="catalog-max"
              name="maxPrice"
              type="number"
              min={0}
              defaultValue={search.maxPrice != null ? String(search.maxPrice) : ""}
              className={fieldClassName}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="catalog-beds">{messages.properties.beds}</FieldLabel>
            <input
              id="catalog-beds"
              name="beds"
              type="number"
              min={0}
              defaultValue={search.beds != null ? String(search.beds) : ""}
              className={fieldClassName}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="catalog-baths">{messages.properties.baths}</FieldLabel>
            <input
              id="catalog-baths"
              name="baths"
              type="number"
              min={0}
              defaultValue={search.baths != null ? String(search.baths) : ""}
              className={fieldClassName}
            />
          </Field>
        </div>
      </FieldGroup>

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="inline-flex h-8 items-center justify-center rounded-lg bg-foreground px-2.5 text-sm font-medium text-background hover:bg-foreground/90"
        >
          {messages.properties.apply}
        </button>
        <a
          href={PATHS.properties}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-border px-2.5 text-sm font-medium hover:bg-muted"
        >
          {messages.properties.clear}
        </a>
      </div>
    </form>
  );
}
