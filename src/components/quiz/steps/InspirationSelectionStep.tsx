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

        if (!image) {
          console.warn(`Image not found for id: ${id}`);
        }

        return (
          <div
            key={id}
            onClick={() => onToggle(id)}
            className={cn(
              "relative cursor-pointer group rounded-lg overflow-hidden",
              "aspect-[3/4] min-h-[250px] w-full",
              isSelected && "ring-2 ring-primary ring-offset-2"
            )}
          >
            {/* 이미지 */}
            {image ? (
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={image.imageHint}
                unoptimized
                priority={false}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            )}

            {/* 기본 오버레이 */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors pointer-events-none" />

            {/* 선택 오버레이 */}
            {isSelected && (
              <>
                <div className="absolute inset-0 bg-primary/40 pointer-events-none" />
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5">
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






