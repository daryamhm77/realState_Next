import { Skeleton } from "@/components/ui/skeleton";

export default function PrivateLoading() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
