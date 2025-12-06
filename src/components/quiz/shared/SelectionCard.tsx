/**
 * Selection Card Component
 * 
 * @fileoverview 퀴즈에서 사용되는 선택 가능한 카드 컴포넌트
 * 
 * @description
 * 스타일, 색상, 영감 이미지 선택 단계에서 공통으로 사용되는 카드 컴포넌트입니다.
 * 선택 상태를 시각적으로 표시하고, 클릭 시 토글 기능을 제공합니다.
 * 
 * @component
 * @example
 * // 기본 사용
 * <SelectionCard
 *   id="modern"
 *   isSelected={selectedItems.includes('modern')}
 *   onToggle={(id) => handleToggle(id)}
 * >
 *   <div>Modern Style</div>
 * </SelectionCard>
 * 
 * @version 1.0.0
 * @since 2025-12-06 - 리팩토링으로 공통 컴포넌트 추출
 */

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SelectionCard Props
 * 
 * @interface SelectionCardProps
 * @property {string} id - 카드의 고유 식별자
 * @property {boolean} isSelected - 선택 상태
 * @property {(id: string) => void} onToggle - 선택 토글 핸들러
 * @property {React.ReactNode} children - 카드 내부 컨텐츠
 * @property {string} [className] - 추가 CSS 클래스
 * @property {boolean} [showCheckmark=true] - 체크마크 표시 여부
 */
export interface SelectionCardProps {
  id: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  className?: string;
  showCheckmark?: boolean;
}

/**
 * SelectionCard Component
 * 
 * @param {SelectionCardProps} props - 컴포넌트 props
 * @returns {JSX.Element} 선택 가능한 카드 UI
 * 
 * @description
 * 클릭 시 선택/해제가 토글되며, 선택된 상태일 때:
 * - ring-2 ring-primary 스타일 적용
 * - 우측 상단에 체크마크 아이콘 표시
 * 
 * @example
 * // 이미지가 포함된 스타일 카드
 * <SelectionCard
 *   id="modern"
 *   isSelected={true}
 *   onToggle={handleToggle}
 *   className="overflow-hidden"
 * >
 *   <Image src="/modern.jpg" alt="Modern" />
 *   <h3>Modern Style</h3>
 * </SelectionCard>
 */
export function SelectionCard({
  id,
  isSelected,
  onToggle,
  children,
  className,
  showCheckmark = true,
}: SelectionCardProps) {
  return (
    <Card
      onClick={() => onToggle(id)}
      className={cn(
        "cursor-pointer transition-all duration-200 relative",
        isSelected && "ring-2 ring-primary ring-offset-2",
        className
      )}
    >
      {children}
      {isSelected && showCheckmark && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 z-10">
          <Check className="w-4 h-4" />
        </div>
      )}
    </Card>
  );
}

