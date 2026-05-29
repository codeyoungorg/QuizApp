import { Skeleton } from "@/components/ui/skeleton";

export default function QuizSkeleton() {
  return (
    <section className="w-full max-w-[810px] mx-auto px-4 sm:px-6 py-5">
      {/* Header: badge + counter on left, quit button on right */}
      <div className="flex flex-col gap-3 mb-6 sm:mb-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      </div>

      {/* Question card */}
      <div className="p-2 rounded-xl">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-6" />

        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 rounded-[12px]" />
          <Skeleton className="h-12 rounded-[12px]" />
          <Skeleton className="h-12 rounded-[12px]" />
          <Skeleton className="h-12 rounded-[12px]" />
        </div>

        <div className="border-t border-[#E6E6E6] my-6" />

        <Skeleton className="h-12 w-full sm:max-w-[260px] sm:mx-auto rounded-[16px]" />
      </div>
    </section>
  );
}
