import { Skeleton } from "@/components/ui/skeleton";

function StatsRowSkeleton() {
  return (
    <div className="px-4 md:px-0 flex flex-col md:flex-row gap-3 md:gap-4">
      <Skeleton className="flex-1 h-[140px] rounded-[24px]" />
      <Skeleton className="flex-1 h-[88px] md:h-[140px] rounded-2xl" />
      <Skeleton className="flex-1 h-[88px] md:h-[140px] rounded-2xl" />
    </div>
  );
}

function LevelsGridSkeleton() {
  return (
    <div className="px-4 md:px-0 mt-8">
      <Skeleton className="h-6 w-28 mb-3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Skeleton className="h-[180px] rounded-2xl" />
        <Skeleton className="h-[180px] rounded-2xl" />
        <Skeleton className="h-[180px] rounded-2xl" />
      </div>
    </div>
  );
}

export default function LandingSkeleton() {
  return (
    <>
      <StatsRowSkeleton />
      <LevelsGridSkeleton />
    </>
  );
}
