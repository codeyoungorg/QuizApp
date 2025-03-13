"use client";
import { Skeleton } from "@/components/ui/skeleton";
import LanguageImage from "@/public/images/icons/language-card.svg";
import Image from "next/image";

export default function LanguageCardSkeleton() {
  return (
    <div className="bg-[#F5F9FF] shadow-[0px_0px_8px_0px_#0053F429] p-8 rounded-xl max-w-xl w-full mx-auto my-10 flex items-center gap-8">
      <div className="shrink-0">
        <Image
          src={LanguageImage}
          alt="Language Image"
          className="md:w-[100px] md:h-[100px] w-[80px] h-[80px]"
        />
      </div>
      <div className="space-y-4 w-full">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-[18px] w-full rounded-sm" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
