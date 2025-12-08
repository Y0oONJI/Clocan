/**
 * Inspiration Selection Step Component
 * 
 * @fileoverview 영감 이미지 선택 단계 컴포넌트
 * 
 * @description
 * 퀴즈의 Step 3 - 사용자가 마음에 드는 outfit 이미지를 선택하는 단계입니다.
 * 9개의 영감 이미지를 제공합니다.
 * 
 * @component
 * @version 1.0.0
 * @since 2025-12-06
 */

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { QUIZ_INSPIRATION_IMAGES } from "@/data/quiz-data";
import type { QuizStepProps } from "@/types/quiz";

/**
 * InspirationSelectionStep Component
 * 
 * @param {QuizStepProps} props - 퀴즈 스텝 공통 props
 * @returns {JSX.Element} 영감 이미지 선택 UI
 * 
 * @description
 * 9개의 outfit 이미지를 그리드로 표시하고, 다중 선택을 지원합니다.
 * 선택 시 이미지 위에 반투명 오버레이와 체크마크가 표시됩니다.
 * 
 * @example
 * <InspirationSelectionStep
 *   selectedItems={['inspiration-1', 'inspiration-3']}
 *   onToggle={(id) => handleToggle(id)}
 * />
 */
export function InspirationSelectionStep({
  selectedItems,
  onToggle,
}: QuizStepProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
      {QUIZ_INSPIRATION_IMAGES.map((id) => {
        const image = PlaceHolderImages.find((img) => img.id === id);
        const isSelected = selectedItems.includes(id);

        return (
          <div
            key={id}
            onClick={() => onToggle(id)}
            className={cn(
              "relative cursor-pointer group rounded-lg overflow-hidden",
              isSelected && "ring-2 ring-primary ring-offset-2"
            )}
          >
            {/* 이미지 */}
            <div className="aspect-w-3 aspect-h-4 relative">
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

            {/* 선택 오버레이 */}
            {isSelected && (
              <>
                <div className="absolute inset-0 bg-primary/40" />
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5 z-10">
                  <Check className="w-5 h-5" />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}





