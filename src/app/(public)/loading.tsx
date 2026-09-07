import { HomeSectionSkeleton } from "@/features/home/components/home-section-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <>
      <Skeleton className="h-96 w-full rounded-none" />
      <HomeSectionSkeleton />
    </>
  );
}
