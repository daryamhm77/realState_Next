import { Container } from "@/components/layout";
import type { Category } from "@/contracts/category";
import type {
  PropertySearchParams,
  PropertySearchResult,
} from "@/contracts/property";
import { PropertyFilters } from "@/features/properties/components/property-filters";
import { PropertyResults } from "@/features/properties/components/property-results";
import { messages } from "@/messages";

export function PropertiesFeature({
  categories,
  search,
  initialData,
}: {
  categories: Category[];
  search: PropertySearchParams;
  initialData: PropertySearchResult;
}) {
  return (
    <section className="py-12 sm:py-16">
      <Container className="flex flex-col gap-8">
        <div className="flex max-w-2xl flex-col gap-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {messages.properties.title}
          </h1>
          <p className="text-muted-foreground">{messages.properties.subtitle}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <PropertyFilters
            key={[
              search.q,
              search.intent,
              search.category,
              search.minPrice,
              search.maxPrice,
              search.beds,
              search.baths,
            ].join("|")}
            categories={categories}
            search={search}
          />
          <PropertyResults initialData={initialData} />
        </div>
      </Container>
    </section>
  );
}
