"use client";

import { Suspense, useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import ResultClient from "./ResultClient";

function HealthCheck() {
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    apiGet("/health/ping")
      .then(() => setStatus("서버 연결됨"))
      .catch(() => setStatus("서버 연결 실패"));
  }, []);

  return status ? <p>{status}</p> : null;
}

export default function StyleQuizResultPage() {
  return (
    <>
      <HealthCheck />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground mt-4">Loading results...</p>
        </div>
      }>
        <ResultClient />
      </Suspense>
    </>
  );
}
