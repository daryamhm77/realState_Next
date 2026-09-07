"use client";

import { Columns2Icon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useComparePropertiesQuery } from "@/features/compare/apis/use-compare-properties.query";
import { CompareTable } from "@/features/compare/components/compare-table";
import { useCompareStore } from "@/lib/compare-store";
import { messages } from "@/messages";
import { PATHS } from "@/routes/paths";

export function CompareIsland() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const ids = useCompareStore((state) => state.ids);
  const remove = useCompareStore((state) => state.remove);
  const { data, isLoading } = useComparePropertiesQuery(ids, hasHydrated);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated || isLoading || !data) {
      return;
    }

    const found = new Set(data.map((property) => property.id));

    for (const id of ids) {
      if (!found.has(id)) {
        remove(id);
      }
    }
  }, [data, hasHydrated, ids, isLoading, remove]);

  if (hasHydrated && ids.length > 0 && isLoading && !data) {
    return <Skeleton className="h-80 w-full" />;
  }

  if (!hasHydrated || ids.length === 0 || !data || data.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Columns2Icon />
          </EmptyMedia>
          <EmptyTitle>{messages.compare.emptyTitle}</EmptyTitle>
          <EmptyDescription>{messages.compare.emptyDescription}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href={PATHS.properties} />}>
            {messages.compare.emptyBrowse}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return <CompareTable properties={data} />;
}
