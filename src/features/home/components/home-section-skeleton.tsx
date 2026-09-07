import { Container } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeSectionSkeleton() {
  return (
    <section className="py-16">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </Container>
    </section>
  );
}
