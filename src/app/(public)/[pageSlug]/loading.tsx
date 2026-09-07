import { Container } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function CmsPageLoading() {
  return (
    <Container className="flex max-w-3xl flex-col gap-6 py-12">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </Container>
  );
}
