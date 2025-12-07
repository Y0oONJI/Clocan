/**
 * Color Palette Card Component
 * 
 * @fileoverview 색상 팔레트 선택 카드 컴포넌트
 * 
 * @description
 * 4개의 색상으로 구성된 팔레트를 표시하고 선택할 수 있는 카드입니다.
 * SelectionCard를 기반으로 색상 팔레트 전용 UI를 제공합니다.
 * 
 * @component
 * @version 1.0.0
 * @since 2025-12-06
 */

import React from "react";
import { CardContent } from "@/components/ui/card";
import { SelectionCard } from "./SelectionCard";
import type { ColorPalette } from "@/data/quiz-data";

/**
 * ColorPaletteCard Props
 * 
 * @interface ColorPaletteCardProps
 * @property {ColorPalette} palette - 색상 팔레트 데이터
 * @property {boolean} isSelected - 선택 상태
 * @property {(id: string) => void} onToggle - 선택 토글 핸들러
 */
export interface ColorPaletteCardProps {
  palette: ColorPalette;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

/**
 * ColorPaletteCard Component
 * 
 * @param {ColorPaletteCardProps} props - 컴포넌트 props
 * @returns {JSX.Element} 색상 팔레트 카드 UI
 * 
 * @description
 * 4개의 색상을 가로로 나열하여 표시하고, 하단에 팔레트 이름을 표시합니다.
 * 
 * @example
 * <ColorPaletteCard
 *   palette={{
 *     id: 'neutrals',
 *     name: 'Neutrals',
 *     palette: ['#EAE0D5', '#C6AC8F', '#594A47', '#0A0908']
 *   }}
 *   isSelected={true}
 *   onToggle={handleToggle}
 * />
 */
export function ColorPaletteCard({
  palette,
  isSelected,
  onToggle,
}: ColorPaletteCardProps) {
  return (
    <SelectionCard
      id={palette.id}
      isSelected={isSelected}
      onToggle={onToggle}
    >
      <CardContent className="p-3 relative">
        {/* 색상 팔레트 프리뷰 */}
        <div className="flex h-16 w-full rounded-md overflow-hidden mb-2">
          {palette.palette.map((hex, i) => (
            <div
              key={i}
              style={{ backgroundColor: hex }}
              className="h-full w-1/4"
              aria-label={`Color ${i + 1}: ${hex}`}
            />
          ))}
        </div>
        
        {/* 팔레트 이름 */}
        <h3 className="font-semibold text-center text-sm">
          {palette.name}
        </h3>
      </CardContent>
    </SelectionCard>
  );
}





