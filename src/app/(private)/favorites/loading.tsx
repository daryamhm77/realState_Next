import { Container } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesLoading() {
  return (
    <Container className="flex flex-col gap-6 py-12">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-6 w-96 max-w-full" />
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </Container>
  );
}
