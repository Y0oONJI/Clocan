/**
 * Quiz State Management Hook
 * 
 * @fileoverview 퀴즈 상태 관리를 위한 커스텀 훅
 * 
 * @description
 * 퀴즈의 모든 상태와 상태 변경 로직을 캡슐화합니다.
 * - 현재 단계 관리
 * - 선택 항목 관리
 * - 네비게이션 로직
 * - 유효성 검사
 * 
 * @hook
 * @example
 * function QuizComponent() {
 *   const {
 *     step,
 *     selections,
 *     toggleSelection,
 *     nextStep,
 *     prevStep,
 *     isNextDisabled
 *   } = useQuizState();
 * }
 * 
 * @version 1.0.0
 * @since 2025-12-06
 */

import { useState, useCallback, useMemo } from "react";
import type { QuizCategory, QuizSelections } from "@/types/quiz";

/**
 * useQuizState 훅 반환 타입
 * 
 * @interface UseQuizStateReturn
 */
export interface UseQuizStateReturn {
  /** 현재 단계 (0-4) */
  step: number;
  
  /** 사용자 선택 항목 */
  selections: QuizSelections;
  
  /** 선택 항목 토글 함수 */
  toggleSelection: (category: QuizCategory, id: string) => void;
  
  /** 다음 단계로 이동 */
  nextStep: () => void;
  
  /** 이전 단계로 이동 */
  prevStep: () => void;
  
  /** 다음 버튼 비활성화 여부 */
  isNextDisabled: boolean;
  
  /** 마지막 단계 여부 */
  isLastStep: boolean;
  
  /** 첫 단계 여부 */
  isFirstStep: boolean;
}

/**
 * Quiz State Hook
 * 
 * @returns {UseQuizStateReturn} 퀴즈 상태 및 액션
 * 
 * @description
 * 퀴즈의 모든 상태 관리를 담당하는 커스텀 훅입니다.
 * 
 * @example
 * const { step, selections, toggleSelection, nextStep } = useQuizState();
 * 
 * // 스타일 선택
 * toggleSelection('styles', 'modern');
 * 
 * // 다음 단계
 * if (!isNextDisabled) {
 *   nextStep();
 * }
 */
export function useQuizState(): UseQuizStateReturn {
  // 현재 단계 상태
  const [step, setStep] = useState(0);
  
  // 선택 항목 상태
  const [selections, setSelections] = useState<QuizSelections>({
    styles: [],
    colors: [],
    inspirations: [],
  });

  /**
   * 선택 항목 토글 함수
   * 
   * @param {QuizCategory} category - 선택 카테고리 ('styles' | 'colors' | 'inspirations')
   * @param {string} id - 토글할 항목 ID
   * 
   * @description
   * 이미 선택된 항목이면 제거하고, 없으면 추가합니다.
   */
  const toggleSelection = useCallback((category: QuizCategory, id: string) => {
    setSelections((prev) => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter((item) => item !== id)
        : [...prev[category], id],
    }));
  }, []);

  /**
   * 다음 단계로 이동
   */
  const nextStep = useCallback(() => {
    setStep((s) => s + 1);
  }, []);

  /**
   * 이전 단계로 이동
   */
  const prevStep = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);

  /**
   * 단계별 선택 항목 매핑
   * 
   * @description
   * 각 단계에 해당하는 선택 카테고리를 반환합니다.
   * Step 0: 환영 화면 (선택 없음)
   * Step 1: styles
   * Step 2: colors
   * Step 3: inspirations
   * Step 4: 완료 화면 (선택 없음)
   */
  const getCurrentSelection = useCallback((): string[] => {
    switch (step) {
      case 1:
        return selections.styles;
      case 2:
        return selections.colors;
      case 3:
        return selections.inspirations;
      default:
        return [];
    }
  }, [step, selections]);

  /**
   * 다음 버튼 비활성화 여부
   * 
   * @description
   * 선택이 필수인 단계(1, 2, 3)에서 아무것도 선택하지 않았으면 비활성화
   */
  const isNextDisabled = useMemo(() => {
    // 선택 단계 (1, 2, 3)
    if (step >= 1 && step <= 3) {
      const currentSelection = getCurrentSelection();
      return currentSelection.length === 0;
    }
    return false;
  }, [step, getCurrentSelection]);

  /**
   * 마지막 단계 여부 (Step 4)
   */
  const isLastStep = useMemo(() => step === 4, [step]);

  /**
   * 첫 단계 여부 (Step 0)
   */
  const isFirstStep = useMemo(() => step === 0, [step]);

  return {
    step,
    selections,
    toggleSelection,
    nextStep,
    prevStep,
    isNextDisabled,
    isLastStep,
    isFirstStep,
  };
}

