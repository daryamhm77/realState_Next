import { Container } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompareLoading() {
  return (
    <Container className="flex flex-col gap-6 py-12">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-96 max-w-full" />
      <Skeleton className="h-80 w-full" />
    </Container>
  );
}
