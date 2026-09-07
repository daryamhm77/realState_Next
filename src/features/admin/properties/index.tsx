import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/format-price";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";
import type { AdminPropertyListItem } from "@/features/admin/properties/list-types";

export function AdminPropertiesFeature({
  properties,
}: {
  properties: AdminPropertyListItem[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold">
            {messages.admin.propertiesTitle}
          </h1>
          <p className="text-muted-foreground">{messages.admin.propertiesHint}</p>
        </div>
        <Button nativeButton={false} render={<Link href={PATHS.adminPropertyNew} />}>
          {messages.admin.create}
        </Button>
      </div>

      {properties.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>{messages.admin.propertiesEmpty}</EmptyTitle>
            <EmptyDescription>{messages.admin.propertiesHint}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{messages.admin.propertyTitleLabel}</TableHead>
              <TableHead>{messages.admin.propertyCityLabel}</TableHead>
              <TableHead>{messages.admin.propertyPriceLabel}</TableHead>
              <TableHead>{messages.admin.publishedLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell>
                  <Link
                    href={PATHS.adminProperty(property.id)}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {property.title}
                  </Link>
                </TableCell>
                <TableCell>{property.city}</TableCell>
                <TableCell>{formatPrice(property.currentPrice)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={property.published ? "default" : "secondary"}>
                      {property.published
                        ? messages.admin.statusPublished
                        : messages.admin.statusDraft}
                    </Badge>
                    {property.featured ? (
                      <Badge variant="outline">{messages.admin.statusFeatured}</Badge>
                    ) : null}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export { PropertyEditor } from "@/features/admin/properties/components/property-editor";
