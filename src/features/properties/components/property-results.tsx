import { HouseIcon } from "lucide-react";

import { CatalogPropertyCard } from "@/features/properties/components/catalog-property-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { PropertySearchResult } from "@/contracts/property";
import { messages } from "@/messages";

export function PropertyResults({
  initialData,
}: {
  initialData: PropertySearchResult;
}) {
  if (initialData.items.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HouseIcon />
          </EmptyMedia>
          <EmptyTitle>{messages.properties.emptyTitle}</EmptyTitle>
          <EmptyDescription>{messages.properties.emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        {initialData.total} {messages.properties.results}
      </p>
      <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {initialData.items.map((property) => (
          <CatalogPropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
