import { BathIcon, BedDoubleIcon, MaximizeIcon } from "lucide-react";

import { Container } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import type { PropertyDetail } from "@/contracts/property";
import { CompareToggle } from "@/features/compare/components/compare-toggle";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { PropertyGallery } from "@/features/properties/components/property-gallery";
import { formatPrice } from "@/lib/format-price";
import { getSiteUrl } from "@/lib/site-url";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

function dealBadge(property: PropertyDetail) {
  if (property.useType === "COMMERCIAL") {
    return messages.properties.commercialBadge;
  }

  return property.dealType === "RENT"
    ? messages.properties.rentBadge
    : messages.properties.saleBadge;
}

export function PropertyDetailFeature({ property }: { property: PropertyDetail }) {
  const url = new URL(PATHS.property(property.slug), getSiteUrl()).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url,
    image: property.images.map((image) => image.url),
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
    },
    ...(property.currentPrice
      ? {
          offers: {
            "@type": "Offer",
            price: property.currentPrice.amount,
            priceCurrency: property.currentPrice.currency,
          },
        }
      : {}),
  };

  return (
    <article className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <PropertyGallery title={property.title} images={property.images} />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge>{dealBadge(property)}</Badge>
              <Badge variant="secondary">{property.category.name}</Badge>
              {property.featured ? (
                <Badge variant="outline">{messages.properties.featuredBadge}</Badge>
              ) : null}
            </div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                {property.title}
              </h1>
              <div className="flex gap-1">
                <FavoriteButton propertyId={property.id} />
                <CompareToggle propertyId={property.id} />
              </div>
            </div>
            <p className="text-muted-foreground">
              {property.address}, {property.city}
            </p>
            <p className="font-heading text-2xl font-semibold">
              {formatPrice(property.currentPrice)}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-muted-foreground">
            {property.beds != null ? (
              <span className="inline-flex items-center gap-1">
                <BedDoubleIcon />
                {property.beds} {messages.properties.bedsLabel}
              </span>
            ) : null}
            {property.baths != null ? (
              <span className="inline-flex items-center gap-1">
                <BathIcon />
                {property.baths} {messages.properties.bathsLabel}
              </span>
            ) : null}
            {property.sqft != null ? (
              <span className="inline-flex items-center gap-1">
                <MaximizeIcon />
                {property.sqft.toLocaleString("en-US")} {messages.properties.sqftLabel}
              </span>
            ) : null}
          </div>

          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-xl font-semibold">
              {messages.properties.detailsTitle}
            </h2>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {property.description}
            </p>
          </section>

          {property.amenities.length > 0 ? (
            <section className="flex flex-col gap-3">
              <h2 className="font-heading text-xl font-semibold">
                {messages.properties.amenitiesTitle}
              </h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <li key={amenity.id} className="text-muted-foreground">
                    {amenity.name}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
