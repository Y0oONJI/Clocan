import { Suspense } from "react";
import ResultClient from "./ResultClient";

export default function StyleQuizResultPage() {
  
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground mt-4">Loading results...</p>
      </div>
    }>
      <ResultClient />
    </Suspense>
  );
}






