"use client";

/**
 * Style Quiz Component (Refactored)
 * 
 * @fileoverview 사용자 스타일 선호도를 파악하는 대화형 온보딩 퀴즈 컴포넌트
 * 
 * @description
 * 5단계 온보딩 플로우를 제공하여 사용자의 스타일 선호도를 수집합니다.
 * 리팩토링으로 컴포넌트를 작은 단위로 분해하고, 상태 관리를 훅으로 분리했습니다.
 * 
 * @component
 * @version 2.0.0
 * @since 2025-12-06 - 리팩토링 완료
 */

import React, { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuizState } from "@/hooks/useQuizState";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuizFooter } from "@/components/quiz/QuizFooter";
import { WelcomeStep } from "@/components/quiz/steps/WelcomeStep";
import { StyleSelectionStep } from "@/components/quiz/steps/StyleSelectionStep";
import { ColorSelectionStep } from "@/components/quiz/steps/ColorSelectionStep";
import { InspirationSelectionStep } from "@/components/quiz/steps/InspirationSelectionStep";
import { CompletionStep } from "@/components/quiz/steps/CompletionStep";
import { trackPageView, quizTracking } from "@/lib/analytics";
import { QUIZ_STYLES, QUIZ_COLORS } from "@/data/quiz-data";
import type { QuizStepConfig } from "@/types/quiz";

/**
 * 퀴즈 스텝 설정
 * 
 * @constant
 * @type {QuizStepConfig[]}
 */
const QUIZ_STEPS: QuizStepConfig[] = [
  {
    id: "welcome",
      title: "Find Your Personal Style",
      description: "Complete this quick quiz to help us understand your unique taste.",
    isSelectionRequired: false,
      buttonText: "Let's start!",
    },
    {
    id: "style-selection",
      title: "Which styles are you drawn to?",
      description: "Select one or more styles that best represent you.",
    component: StyleSelectionStep,
    isSelectionRequired: true,
      buttonText: "Next",
    category: "styles",
    },
    {
    id: "color-selection",
      title: "What colors do you prefer?",
      description: "Choose the palettes that catch your eye.",
    component: ColorSelectionStep,
    isSelectionRequired: true,
      buttonText: "Next",
    category: "colors",
    },
    {
    id: "inspiration-selection",
      title: "Get Inspired",
      description: "Select the outfits that you would wear.",
    component: InspirationSelectionStep,
    isSelectionRequired: true,
      buttonText: "Finish",
    category: "inspirations",
    },
     {
    id: "completion",
      title: "You're All Set!",
      description: "We've personalized your experience. Get ready to build your dream closet.",
    isSelectionRequired: false,
      buttonText: "Explore Your Closet Canvas",
  },
];

/**
 * StyleQuiz Component
 * 
 * @returns {JSX.Element}
 * 
 * @description
 * 퀴즈 상태 관리는 useQuizState 훅이 담당하고,
 * 각 스텝은 독립된 컴포넌트로 렌더링됩니다.
 */
export function StyleQuiz() {
  const router = useRouter();
  const pathname = usePathname();
  const startTimeRef = useRef<number>(Date.now());
  const {
    step,
    selections,
    toggleSelection,
    nextStep,
    prevStep,
    isNextDisabled,
    isLastStep,
  } = useQuizState();

  const currentStepConfig = QUIZ_STEPS[step];

  // 페이지뷰 추적
  useEffect(() => {
    trackPageView(pathname, '스타일 퀴즈');
    startTimeRef.current = Date.now();
  }, [pathname]);

  // 퀴즈 이탈 추적 (페이지를 떠날 때)
  useEffect(() => {
    return () => {
      // 컴포넌트가 언마운트될 때 (페이지를 떠날 때)
      if (step > 0 && step < 4) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        quizTracking.trackAbandon(step, timeSpent);
      }
    };
  }, [step]);

  /**
   * 다음 단계 또는 완료 처리
   */
  const handleNext = () => {
    if (isLastStep) {
      // 퀴즈 완료 추적
      const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      quizTracking.trackComplete({
        styles: selections.styles,
        colors: selections.colors,
        inspirations: selections.inspirations,
        durationSeconds,
      });

      // 결과 페이지로 이동
      const params = new URLSearchParams({
        styles: selections.styles.join(","),
        colors: selections.colors.join(","),
        inspirations: selections.inspirations.join(","),
      });
      router.push(`/style-quiz/result?${params.toString()}`);
    } else {
      // 퀴즈 시작 추적 (Step 0에서 시작 버튼 클릭)
      if (step === 0) {
        quizTracking.trackStart();
      }

      // 스텝 진행 추적
      const selectedCount = step === 1 ? selections.styles.length :
                           step === 2 ? selections.colors.length :
                           step === 3 ? selections.inspirations.length : 0;
      
      quizTracking.trackStepNext(
        step + 1,
        currentStepConfig.id,
        selectedCount
      );

      nextStep();
    }
  };

  /**
   * 이전 단계로 이동
   */
  const handlePrev = () => {
    if (step > 0) {
      quizTracking.trackStepBack(step, step - 1);
      prevStep();
    }
  };

  /**
   * 선택 항목 토글 (추적 포함)
   */
  const handleToggle = (category: 'styles' | 'colors' | 'inspirations', id: string) => {
    const isSelected = selections[category].includes(id);
    const action = isSelected ? 'deselect' : 'select';
    
    // 선택 추적
    if (category === 'styles') {
      const style = QUIZ_STYLES.find(s => s.id === id);
      if (style) {
        quizTracking.trackStyleSelection(
          id,
          style.name,
          action,
          isSelected ? selections.styles.length - 1 : selections.styles.length + 1
        );
      }
    } else if (category === 'colors') {
      const color = QUIZ_COLORS.find(c => c.id === id);
      if (color) {
        quizTracking.trackColorSelection(
          id,
          color.name,
          action,
          isSelected ? selections.colors.length - 1 : selections.colors.length + 1
        );
      }
    } else if (category === 'inspirations') {
      quizTracking.trackInspirationSelection(
        id,
        action,
        isSelected ? selections.inspirations.length - 1 : selections.inspirations.length + 1
      );
    }

    toggleSelection(category, id);
  };

  /**
   * 현재 스텝 컴포넌트 렌더링
   */
  const renderStepContent = () => {
    const StepComponent = currentStepConfig.component;

    // 환영 화면
    if (step === 0) {
      return <WelcomeStep />;
    }

    // 완료 화면
    if (step === 4) {
      return <CompletionStep />;
    }

    // 선택 단계 (1, 2, 3)
    if (StepComponent && currentStepConfig.category) {
      const category = currentStepConfig.category;
      return (
        <StepComponent
          selectedItems={selections[category]}
          onToggle={(id: string) => handleToggle(category, id)}
        />
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <QuizHeader currentStep={step} totalSteps={QUIZ_STEPS.length} />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex flex-col items-center text-center">
          {/* Title & Description */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary mb-2">
              {currentStepConfig.title}
            </h1>
            <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto">
              {currentStepConfig.description}
            </p>
          </div>
          
          {/* Step Content */}
          <div className="w-full mb-8">{renderStepContent()}</div>

          {/* Next Button */}
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base font-bold"
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            {currentStepConfig.buttonText}
            {!isLastStep && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <QuizFooter
        currentStep={step}
        totalSteps={QUIZ_STEPS.length}
        onPrev={handlePrev}
      />
    </div>
  );
}
