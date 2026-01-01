/**
 * Quiz Footer Component
 * 
 * @fileoverview 퀴즈 푸터 - 네비게이션 버튼
 * 
 * @component
 * @version 1.0.0
 * @since 2025-12-06
 */

import React from "react";
import { Button } from "@/components/ui/button";

/**
 * QuizFooter Props
 */
export interface QuizFooterProps {
  /** 현재 단계 */
  currentStep: number;
  /** 전체 단계 수 */
  totalSteps: number;
  /** 이전 버튼 클릭 핸들러 */
  onPrev: () => void;
}

/**
 * QuizFooter Component
 * 
 * @param {QuizFooterProps} props
 * @returns {JSX.Element}
 * 
 * @description
 * 퀴즈 하단에 Back 버튼과 진행 상황을 표시합니다.
 * 환영 화면(step 0)과 완료 화면(마지막 step)에서는 숨깁니다.
 */
export function QuizFooter({ currentStep, totalSteps, onPrev }: QuizFooterProps) {
  const showNavigation = currentStep > 0 && currentStep < totalSteps - 1;
  const actualSteps = totalSteps - 2; // 환영, 완료 화면 제외

  if (!showNavigation) {
    return null;
  }

  return (
    <footer className="p-4 flex justify-between items-center text-sm text-muted-foreground">
      <div>
        <Button variant="ghost" onClick={onPrev}>
          Back
        </Button>
      </div>
      <div>
        <span>
          Step {currentStep} of {actualSteps}
        </span>
      </div>
    </footer>
  );
}






