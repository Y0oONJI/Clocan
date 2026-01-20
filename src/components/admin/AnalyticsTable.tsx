"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HourlyAnalytics } from "./AnalyticsCard";

interface AnalyticsTableProps {
  data: HourlyAnalytics[];
}

/**
 * 분석 데이터 표 컴포넌트
 * 
 * 시간대별 데이터를 표로 표시합니다.
 */
export function AnalyticsTable({ data }: AnalyticsTableProps) {
  // 시간대 포맷팅 (예: "00시", "15시")
  const formatHour = (hour: number): string => {
    return `${hour.toString().padStart(2, "0")}시`;
  };

  // 시간대 라벨 (예: "00:00 - 00:59")
  const formatHourRange = (hour: number): string => {
    const start = hour.toString().padStart(2, "0");
    const end = ((hour + 1) % 24).toString().padStart(2, "0");
    return `${start}:00 - ${end}:59`;
  };

  // 총합 계산
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">시간대</TableHead>
            <TableHead className="w-[150px]">시간 범위</TableHead>
            <TableHead className="text-right">접속 수</TableHead>
            <TableHead className="w-[200px]">비율</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0.0";
            return (
              <TableRow key={item.hour}>
                <TableCell className="font-medium">{formatHour(item.hour)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatHourRange(item.hour)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {item.count.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {/* 총합 행 */}
          <TableRow className="bg-muted/50 font-bold">
            <TableCell colSpan={2} className="font-bold">
              총합
            </TableCell>
            <TableCell className="text-right font-bold">
              {total.toLocaleString()}
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">100.0%</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
