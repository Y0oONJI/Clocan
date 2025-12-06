/**
 * Color Selection Step Component
 * 
 * @fileoverview 색상 팔레트 선택 단계 컴포넌트
 * 
 * @description
 * 퀴즈의 Step 2 - 사용자가 선호하는 색상 팔레트를 선택하는 단계입니다.
 * 6가지 팔레트(Neutrals, Pastels, Brights, Monochrome, Earthy, Jewel Tones)를 제공합니다.
 * 
 * @component
 * @version 1.0.0
 * @since 2025-12-06
 */

import React from "react";
import { ColorPaletteCard } from "../shared/ColorPaletteCard";
import { QUIZ_COLORS } from "@/data/quiz-data";
import type { QuizStepProps } from "@/types/quiz";

/**
 * ColorSelectionStep Component
 * 
 * @param {QuizStepProps} props - 퀴즈 스텝 공통 props
 * @returns {JSX.Element} 색상 팔레트 선택 UI
 * 
 * @description
 * 6개의 색상 팔레트 카드를 그리드로 표시하고, 다중 선택을 지원합니다.
 * 각 팔레트는 4개의 조화로운 색상으로 구성되어 있습니다.
 * 
 * @example
 * <ColorSelectionStep
 *   selectedItems={['neutrals', 'pastels']}
 *   onToggle={(id) => handleToggle(id)}
 * />
 */
export function ColorSelectionStep({
  selectedItems,
  onToggle,
}: QuizStepProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {QUIZ_COLORS.map((color) => (
        <ColorPaletteCard
          key={color.id}
          palette={color}
          isSelected={selectedItems.includes(color.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

