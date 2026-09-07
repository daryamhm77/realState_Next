import { BathIcon, BedDoubleIcon, MaximizeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PropertyCard as PropertyCardData } from "@/contracts/property";
import { formatPrice } from "@/lib/format-price";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

function dealBadge(property: PropertyCardData) {
  if (property.useType === "COMMERCIAL") {
    return messages.properties.commercialBadge;
  }

  return property.dealType === "RENT"
    ? messages.properties.rentBadge
    : messages.properties.saleBadge;
}

function Spec({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BedDoubleIcon;
  value: string | number | null;
  label: string;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <Icon className="size-4 shrink-0" />
      <span className="truncate">
        {value != null && value !== "" ? (
          <>
            {value} {label}
          </>
        ) : (
          "—"
        )}
      </span>
    </span>
  );
}

export function PropertyCard({
  property,
  actions,
}: {
  property: PropertyCardData;
  actions?: ReactNode;
}) {
  return (
    <Card className="relative h-full gap-0 overflow-hidden py-0">
      {actions ? (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
          {actions}
        </div>
      ) : null}
      <Link href={PATHS.property(property.slug)} className="flex h-full min-h-0 flex-col">
        <div className="relative aspect-4/3 shrink-0 bg-muted">
          {property.coverImage ? (
            <Image
              src={property.coverImage.url}
              alt={property.coverImage.alt || property.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : null}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            <Badge>{dealBadge(property)}</Badge>
            {property.featured ? (
              <Badge variant="secondary">{messages.properties.featuredBadge}</Badge>
            ) : null}
          </div>
        </div>
        <CardHeader className="min-h-24 pt-4">
          <CardTitle className="line-clamp-2 min-h-12">{property.title}</CardTitle>
          <CardDescription className="line-clamp-2 min-h-10">
            {property.address}, {property.city}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <p className="font-heading text-lg font-semibold">
            {formatPrice(property.currentPrice)}
          </p>
        </CardContent>
        <CardFooter>
          <div className="grid w-full grid-cols-3 gap-2 text-muted-foreground">
            <Spec
              icon={BedDoubleIcon}
              value={property.beds}
              label={messages.properties.bedsLabel}
            />
            <Spec
              icon={BathIcon}
              value={property.baths}
              label={messages.properties.bathsLabel}
            />
            <Spec
              icon={MaximizeIcon}
              value={
                property.sqft != null
                  ? property.sqft.toLocaleString("en-US")
                  : null
              }
              label={messages.properties.sqftLabel}
            />
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
