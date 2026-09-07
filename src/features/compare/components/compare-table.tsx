"use client";

import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PropertyCard } from "@/contracts/property";
import { formatPrice } from "@/lib/format-price";
import { useCompareStore } from "@/lib/compare-store";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

function dealLabel(property: PropertyCard) {
  if (property.useType === "COMMERCIAL") {
    return messages.properties.commercialBadge;
  }

  return property.dealType === "RENT"
    ? messages.properties.rentBadge
    : messages.properties.saleBadge;
}

function dash(value: string | number | null) {
  if (value == null || value === "") {
    return "—";
  }

  return value;
}

export function CompareTable({ properties }: { properties: PropertyCard[] }) {
  const remove = useCompareStore((state) => state.remove);
  const clear = useCompareStore((state) => state.clear);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={() => clear()}>
          {messages.compare.clear}
        </Button>
      </div>

      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-auto w-36 align-bottom">
              {messages.compare.feature}
            </TableHead>
            {properties.map((property) => (
              <TableHead key={property.id} className="h-auto align-bottom">
                <div className="flex min-w-48 flex-col gap-3">
                  <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-muted">
                    {property.coverImage ? (
                      <Image
                        src={property.coverImage.url}
                        alt={property.coverImage.alt || property.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    ) : null}
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 size-8 rounded-full bg-background/95 p-0 text-foreground shadow-sm ring-1 ring-foreground/10 [&_svg]:size-3.5"
                      aria-label={messages.compare.removeLabel}
                      onClick={() => remove(property.id)}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                  <Link
                    href={PATHS.property(property.slug)}
                    className="line-clamp-2 min-h-12 font-medium whitespace-normal underline-offset-4 hover:underline"
                  >
                    {property.title}
                  </Link>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">{messages.compare.price}</TableCell>
            {properties.map((property) => (
              <TableCell key={`${property.id}-price`}>
                {formatPrice(property.currentPrice)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{messages.compare.type}</TableCell>
            {properties.map((property) => (
              <TableCell key={`${property.id}-type`}>{dealLabel(property)}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{messages.compare.category}</TableCell>
            {properties.map((property) => (
              <TableCell key={`${property.id}-category`}>
                {property.category.name}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{messages.compare.city}</TableCell>
            {properties.map((property) => (
              <TableCell key={`${property.id}-city`}>{property.city}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{messages.compare.address}</TableCell>
            {properties.map((property) => (
              <TableCell key={`${property.id}-address`} className="whitespace-normal">
                {property.address}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{messages.compare.beds}</TableCell>
            {properties.map((property) => (
              <TableCell key={`${property.id}-beds`}>{dash(property.beds)}</TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{messages.compare.baths}</TableCell>
            {properties.map((property) => (
              <TableCell key={`${property.id}-baths`}>
                {dash(property.baths)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">{messages.compare.sqft}</TableCell>
            {properties.map((property) => (
              <TableCell key={`${property.id}-sqft`}>
                {property.sqft != null
                  ? property.sqft.toLocaleString("en-US")
                  : "—"}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
