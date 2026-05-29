import { Suspense } from "react";
import SuccessPageContent from "./_inner";

export default function VocabularySuccessPage() {
  return (
    <Suspense>
      <SuccessPageContent />
    </Suspense>
  );
}
