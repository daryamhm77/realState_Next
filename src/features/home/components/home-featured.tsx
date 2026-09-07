import { ArrowRightIcon, HouseIcon } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout";
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
import { listFeaturedProperties } from "@/connections";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export async function HomeFeatured() {
  const properties = await listFeaturedProperties().catch(() => []);

  return (
    <section className="py-16 sm:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-heading text-3xl font-semibold tracking-tight">
              {messages.home.featuredTitle}
            </h2>
            <Link
              href={PATHS.properties}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium tracking-wide uppercase underline-offset-4 hover:underline"
            >
              {messages.home.featuredViewAll}
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <p className="text-muted-foreground">{messages.home.featuredSubtitle}</p>
        </div>

        {properties.length === 0 ? (
          <Empty className="border bg-background">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HouseIcon />
              </EmptyMedia>
              <EmptyTitle>{messages.home.featuredEmptyTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.home.featuredEmptyDescription}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button nativeButton={false} render={<Link href={PATHS.properties} />}>
                {messages.home.featuredBrowse}
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <CatalogPropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
