"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { HourlyAnalytics } from "./AnalyticsCard";

interface AnalyticsChartProps {
  data: HourlyAnalytics[];
  title: string;
}

/**
 * 분석 데이터 차트 컴포넌트
 * 
 * Recharts를 사용하여 시간대별 데이터를 라인 차트로 표시합니다.
 */
export function AnalyticsChart({ data, title }: AnalyticsChartProps) {
  // 차트용 데이터 포맷팅 (시간대 라벨 추가)
  const chartData = data.map((item) => ({
    hour: item.hour,
    hourLabel: `${item.hour.toString().padStart(2, "0")}시`,
    count: item.count,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hourLabel"
            tick={{ fontSize: 12 }}
            interval={2} // 2시간마다 표시
          />
          <YAxis
            tick={{ fontSize: 12 }}
            label={{ value: "접속 수", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number) => [value.toLocaleString(), "접속 수"]}
            labelFormatter={(label) => `시간대: ${label}`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name={title}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
