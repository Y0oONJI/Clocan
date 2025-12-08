/**
 * Quiz Header Component
 * 
 * @fileoverview 퀴즈 헤더 - 진행도 표시
 * 
 * @component
 * @version 1.0.0
 * @since 2025-12-06
 */

import React from "react";
import { Progress } from "@/components/ui/progress";

/**
 * QuizHeader Props
 */
export interface QuizHeaderProps {
  /** 현재 단계 (0-4) */
  currentStep: number;
  /** 전체 단계 수 */
  totalSteps: number;
}

/**
 * QuizHeader Component
 * 
 * @param {QuizHeaderProps} props
 * @returns {JSX.Element}
 * 
 * @description
 * 퀴즈 상단에 진행도 바를 표시합니다.
 */
export function QuizHeader({ currentStep, totalSteps }: QuizHeaderProps) {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <header className="p-4">
      <Progress value={progress} className="w-full h-2" />
    </header>
  );
}





