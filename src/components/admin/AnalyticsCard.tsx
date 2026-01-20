"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsTable } from "./AnalyticsTable";
import { AnalyticsChart } from "./AnalyticsChart";
import { apiGet } from "@/lib/api";

/**
 * 시간대별 분석 데이터 타입
 */
export interface HourlyAnalytics {
  hour: number;   // 0-23
  count: number; // 해당 시간대의 카운트
}

interface AnalyticsCardProps {
  title: string;
  description?: string;
  endpoint: string;
}

/**
 * 분석 카드 컴포넌트
 * 
 * API에서 데이터를 가져와서 표와 그래프로 표시합니다.
 */
export function AnalyticsCard({ title, description, endpoint }: AnalyticsCardProps) {
  const [data, setData] = useState<HourlyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiGet<HourlyAnalytics[]>(endpoint);
        setData(response);
      } catch (err) {
        console.error(`Failed to fetch analytics data from ${endpoint}:`, err);
        setError(err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <span className="ml-3 text-muted-foreground">데이터를 불러오는 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-destructive">오류: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 표 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">시간대별 데이터 표</h3>
          <AnalyticsTable data={data} />
        </div>
        
        {/* 그래프 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">시간대별 추이 그래프</h3>
          <AnalyticsChart data={data} title={title} />
        </div>
      </CardContent>
    </Card>
  );
}
