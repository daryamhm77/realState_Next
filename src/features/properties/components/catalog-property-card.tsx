import { PropertyCard } from "@/components/shared";
import type { PropertyCard as PropertyCardData } from "@/contracts/property";
import { CompareToggle } from "@/features/compare/components/compare-toggle";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";

export function CatalogPropertyCard({
  property,
}: {
  property: PropertyCardData;
}) {
  return (
    <div className="h-full min-w-0">
      <PropertyCard
        property={property}
        actions={
          <>
            <FavoriteButton propertyId={property.id} />
            <CompareToggle propertyId={property.id} />
          </>
        }
      />
    </div>
  );
}
