"use client";

import { AnalyticsCard } from "@/components/admin/AnalyticsCard";

/**
 * 어드민 분석 대시보드 페이지
 * 
 * 백엔드 로그를 기반으로 한 통계 데이터를 표와 그래프로 표시합니다.
 * 
 * 경로: /admin/analytics
 */
export default function AdminAnalyticsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">어드민 분석 대시보드</h1>
        <p className="text-muted-foreground">
          백엔드 로그를 기반으로 한 시간대별 통계 데이터입니다.
        </p>
      </div>
      
      {/* 랜딩 페이지 접속 수 */}
      <AnalyticsCard
        title="랜딩 페이지 접속 수"
        description="시간대별 랜딩 페이지 접속 수 추이"
        endpoint="/api/v1/admin/analytics/landing-page-views"
      />
      
      {/* 스타일 퀴즈 완료 수 */}
      <AnalyticsCard
        title="스타일 퀴즈 완료 수"
        description="시간대별 스타일 퀴즈 완료 수 추이"
        endpoint="/api/v1/admin/analytics/quiz-completions"
      />
      
      {/* AI 분석 완료 수 */}
      <AnalyticsCard
        title="AI 스타일 분석 완료 수"
        description="시간대별 AI 스타일 분석 완료 수 추이"
        endpoint="/api/v1/admin/analytics/analysis-completions"
      />
    </div>
  );
}
