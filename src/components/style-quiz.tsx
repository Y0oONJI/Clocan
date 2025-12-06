"use client";

/**
 * Style Quiz Component
 * 
 * @fileoverview 사용자 스타일 선호도를 파악하는 대화형 온보딩 퀴즈 컴포넌트
 * 
 * @description
 * 5단계 온보딩 플로우를 제공하여 사용자의 스타일 선호도를 수집합니다:
 * 1. 환영 화면
 * 2. 스타일 선택 (Modern, Vintage, etc.)
 * 3. 색상 팔레트 선택 (Neutrals, Pastels, etc.)
 * 4. 영감 이미지 선택
 * 5. 완료 화면
 * 
 * @component
 * @example
 * // 페이지에서 사용
 * import { StyleQuiz } from '@/components/style-quiz';
 * 
 * export default function QuizPage() {
 *   return <StyleQuiz />;
 * }
 * 
 * @features
 * - Progressive disclosure: 한 번에 하나의 질문만 표시
 * - Immediate feedback: 선택 시 즉각적인 시각적 피드백
 * - Validation: 필수 선택 항목 검증
 * - Navigation: 이전 단계로 돌아가기 가능
 * - Progress tracking: 진행도 표시 바
 * 
 * @state
 * - step: 현재 단계 (0-4)
 * - selectedStyles: 선택된 스타일 ID 배열
 * - selectedColors: 선택된 색상 팔레트 ID 배열
 * - selectedInspirations: 선택된 영감 이미지 ID 배열
 * 
 * @navigation
 * 완료 시 /style-quiz/result로 이동하며 URL 파라미터로 선택 항목 전달
 * 
 * @todo 향후 개선 사항
 * - [ ] 컴포넌트를 작은 단위로 분해 (SelectionCard, QuizStep 등)
 * - [ ] useQuizState 커스텀 훅으로 상태 관리 분리
 * - [ ] 로컬 스토리지에 진행 상황 저장
 * - [ ] 애니메이션 전환 효과 추가
 * 
 * @version 1.0.0
 * @since 2025-12-06
 * @author Closet Canvas Team
 */

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { QUIZ_STYLES, QUIZ_COLORS, QUIZ_INSPIRATION_IMAGES } from "@/data/quiz-data";

/**
 * StyleQuiz Main Component
 * 
 * @returns {JSX.Element} 스타일 퀴즈 UI
 * 
 * @example
 * <StyleQuiz />
 */
export function StyleQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedInspirations, setSelectedInspirations] = useState<string[]>([]);

  /**
   * 다중 선택 토글 핸들러
   * 
   * @function toggleSelection
   * @param {string[]} selection - 현재 선택된 항목 배열
   * @param {React.Dispatch<React.SetStateAction<string[]>>} setSelection - 상태 업데이트 함수
   * @param {string} item - 토글할 항목 ID
   * 
   * @description
   * 클릭한 항목이 이미 선택되어 있으면 제거하고, 없으면 추가합니다.
   * 다중 선택을 지원하며 선택 개수 제한은 없습니다.
   * 
   * @example
   * onClick={() => toggleSelection(selectedStyles, setSelectedStyles, 'modern')}
   */
  const toggleSelection = (
    selection: string[],
    setSelection: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    setSelection((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const steps = [
    {
      title: "Find Your Personal Style",
      description: "Complete this quick quiz to help us understand your unique taste.",
      content: <></>,
      buttonText: "Let's start!",
      isSelectionRequired: false,
    },
    {
      title: "Which styles are you drawn to?",
      description: "Select one or more styles that best represent you.",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {QUIZ_STYLES.map((style) => {
            const image = PlaceHolderImages.find((img) => img.id === style.imageId);
            return (
            <Card
              key={style.id}
              onClick={() => toggleSelection(selectedStyles, setSelectedStyles, style.id)}
              className={cn(
                "cursor-pointer transition-all duration-200 overflow-hidden relative group",
                selectedStyles.includes(style.id) && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <CardContent className="p-0 aspect-w-1 aspect-h-1">
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={image.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                  <h3 className="font-headline text-lg font-bold text-white">{style.name}</h3>
                </div>
                {selectedStyles.includes(style.id) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </CardContent>
            </Card>
          )})}
        </div>
      ),
      buttonText: "Next",
      isSelectionRequired: true,
      selection: selectedStyles,
    },
    {
      title: "What colors do you prefer?",
      description: "Choose the palettes that catch your eye.",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {QUIZ_COLORS.map((color) => (
            <Card
              key={color.id}
              onClick={() => toggleSelection(selectedColors, setSelectedColors, color.id)}
              className={cn(
                "cursor-pointer transition-all duration-200",
                selectedColors.includes(color.id) && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <CardContent className="p-3 relative">
                <div className="flex h-16 w-full rounded-md overflow-hidden mb-2">
                    {color.palette.map((hex, i) => (
                        <div key={i} style={{ backgroundColor: hex }} className="h-full w-1/4" />
                    ))}
                </div>
                <h3 className="font-semibold text-center text-sm">{color.name}</h3>
                {selectedColors.includes(color.id) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ),
      buttonText: "Next",
      isSelectionRequired: true,
      selection: selectedColors,
    },
    {
      title: "Get Inspired",
      description: "Select the outfits that you would wear.",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {QUIZ_INSPIRATION_IMAGES.map((id) => {
            const image = PlaceHolderImages.find((img) => img.id === id);
            return (
            <div
              key={id}
              onClick={() => toggleSelection(selectedInspirations, setSelectedInspirations, id)}
              className={cn(
                "relative cursor-pointer group rounded-lg overflow-hidden",
                selectedInspirations.includes(id) && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <div className="aspect-w-3 aspect-h-4">
                {image && (
                   <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={image.imageHint}
                  />
                )}
              </div>
              {selectedInspirations.includes(id) && (
                <>
                  <div className="absolute inset-0 bg-primary/40" />
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5">
                    <Check className="w-5 h-5" />
                  </div>
                </>
              )}
            </div>
          )})}
        </div>
      ),
      buttonText: "Finish",
      isSelectionRequired: true,
      selection: selectedInspirations,
    },
     {
      title: "You're All Set!",
      description: "We've personalized your experience. Get ready to build your dream closet.",
      content: (
        <div className="flex flex-col items-center text-center">
            <PartyPopper className="w-16 h-16 text-primary mb-4" />
            <p className="text-muted-foreground mb-6">Your style profile is ready.</p>
        </div>
      ),
      buttonText: "Explore Your Closet Canvas",
      isSelectionRequired: false,
    },
  ];

  const currentStep = steps[step];
  const progress = (step / (steps.length - 1)) * 100;
  
  /**
   * 다음 단계로 이동 핸들러
   * 
   * @function handleNext
   * 
   * @description
   * 현재 단계가 마지막이 아니면 다음 단계로 이동합니다.
   * 마지막 단계(완료 화면)에서는 결과 페이지로 리다이렉트하며,
   * URL 파라미터로 사용자의 모든 선택 항목을 전달합니다.
   * 
   * @navigation
   * 최종 목적지: /style-quiz/result?styles=...&colors=...&inspirations=...
   * 
   * @example
   * <Button onClick={handleNext}>Next</Button>
   */
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Navigate to result page with selections
      const params = new URLSearchParams({
        styles: selectedStyles.join(","),
        colors: selectedColors.join(","),
        inspirations: selectedInspirations.join(","),
      });
      router.push(`/style-quiz/result?${params.toString()}`);
    }
  };

  /**
   * 다음 버튼 활성화 여부 계산
   * 
   * @constant isNextDisabled
   * @type {boolean}
   * 
   * @description
   * 현재 단계에서 선택이 필수인 경우, 최소 1개 이상 선택되어야 버튼이 활성화됩니다.
   * 선택이 필수가 아닌 단계(환영, 완료 화면)에서는 항상 활성화됩니다.
   * 
   * @dependencies [step, selectedStyles, selectedColors, selectedInspirations]
   * @optimization useMemo를 사용하여 불필요한 재계산 방지
   * 
   * @returns {boolean} true면 버튼 비활성화, false면 활성화
   */
  const isNextDisabled = useMemo(() => {
    if (!currentStep.isSelectionRequired) return false;
    return currentStep.selection ? currentStep.selection.length === 0 : true;
  }, [step, selectedStyles, selectedColors, selectedInspirations]);


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="p-4">
        <Progress value={progress} className="w-full h-2" />
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex flex-col items-center text-center">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary mb-2">
              {currentStep.title}
            </h1>
            <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto">
              {currentStep.description}
            </p>
          </div>
          
          <div className="w-full mb-8">
            {currentStep.content}
          </div>

          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base font-bold"
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            {currentStep.buttonText}
            {step < steps.length - 1 && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </main>
      <footer className="p-4 flex justify-between items-center text-sm text-muted-foreground">
        <div>
          {step > 0 && step < steps.length - 1 && (
             <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
          )}
        </div>
         <div>
          {step > 0 && step < steps.length - 1 && (
            <span>Step {step} of {steps.length - 2}</span>
          )}
        </div>
      </footer>
    </div>
  );
}
