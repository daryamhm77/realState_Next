import Link from "next/link";

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
import type { Amenity } from "@/contracts/amenity";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function AdminAmenitiesFeature({ amenities }: { amenities: Amenity[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold">
            {messages.admin.amenitiesTitle}
          </h1>
          <p className="text-muted-foreground">{messages.admin.amenitiesHint}</p>
        </div>
        <Button nativeButton={false} render={<Link href={PATHS.adminAmenityNew} />}>
          {messages.admin.create}
        </Button>
      </div>

      {amenities.length === 0 ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>{messages.admin.amenitiesEmpty}</EmptyTitle>
            <EmptyDescription>{messages.admin.amenitiesHint}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{messages.admin.nameLabel}</TableHead>
              <TableHead>{messages.admin.slugLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amenities.map((amenity) => (
              <TableRow key={amenity.id}>
                <TableCell>
                  <Link
                    href={PATHS.adminAmenity(amenity.id)}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {amenity.name}
                  </Link>
                </TableCell>
                <TableCell>{amenity.slug}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export { AmenityEditor } from "@/features/admin/amenities/components/amenity-editor";
