/**
 * Style Selection Step Component
 * 
 * @fileoverview 스타일 선택 단계 컴포넌트
 * 
 * @description
 * 퀴즈의 Step 1 - 사용자가 선호하는 스타일을 선택하는 단계입니다.
 * 6가지 스타일 옵션(Modern, Vintage, Bohemian, Streetwear, Classic, Minimalist)을 제공합니다.
 * 
 * @component
 * @version 1.0.0
 * @since 2025-12-06
 */

import React from "react";
import { StyleCard } from "../shared/StyleCard";
import { QUIZ_STYLES } from "@/data/quiz-data";
import type { QuizStepProps } from "@/types/quiz";

/**
 * StyleSelectionStep Component
 * 
 * @param {QuizStepProps} props - 퀴즈 스텝 공통 props
 * @returns {JSX.Element} 스타일 선택 UI
 * 
 * @description
 * 6개의 스타일 카드를 그리드로 표시하고, 다중 선택을 지원합니다.
 * 
 * @example
 * <StyleSelectionStep
 *   selectedItems={['modern', 'minimalist']}
 *   onToggle={(id) => handleToggle(id)}
 * />
 */
export function StyleSelectionStep({
  selectedItems,
  onToggle,
}: QuizStepProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {QUIZ_STYLES.map((style) => (
        <StyleCard
          key={style.id}
          style={style}
          isSelected={selectedItems.includes(style.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}






