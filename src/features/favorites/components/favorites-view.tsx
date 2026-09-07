"use client";

import { HeartIcon } from "lucide-react";
import Link from "next/link";

import { CatalogPropertyCard } from "@/features/properties/components/catalog-property-card";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { FavoriteList } from "@/contracts/favorite";
import { useFavoritesQuery } from "@/features/favorites/apis/use-favorites.query";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function FavoritesView({ initialData }: { initialData: FavoriteList }) {
  const { data } = useFavoritesQuery(initialData);
  const items = data?.items ?? initialData.items;

  if (items.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HeartIcon />
          </EmptyMedia>
          <EmptyTitle>{messages.favorites.emptyTitle}</EmptyTitle>
          <EmptyDescription>{messages.favorites.emptyDescription}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href={PATHS.properties} />}>
            {messages.favorites.emptyBrowse}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((property) => (
        <CatalogPropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
