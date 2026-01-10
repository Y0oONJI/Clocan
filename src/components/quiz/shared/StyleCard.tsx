/**
 * Style Card Component
 * 
 * @fileoverview 스타일 선택 카드 컴포넌트
 * 
 * @description
 * 이미지와 텍스트를 포함한 스타일 선택 카드입니다.
 * SelectionCard를 기반으로 이미지 오버레이 UI를 제공합니다.
 * 
 * @component
 * @version 1.0.0
 * @since 2025-12-06
 */

import React from "react";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { SelectionCard } from "./SelectionCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import type { StyleOption } from "@/data/quiz-data";

/**
 * StyleCard Props
 * 
 * @interface StyleCardProps
 * @property {StyleOption} style - 스타일 옵션 데이터
 * @property {boolean} isSelected - 선택 상태
 * @property {(id: string) => void} onToggle - 선택 토글 핸들러
 */
export interface StyleCardProps {
  style: StyleOption;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

/**
 * StyleCard Component
 * 
 * @param {StyleCardProps} props - 컴포넌트 props
 * @returns {JSX.Element} 스타일 카드 UI
 * 
 * @description
 * 배경 이미지 위에 스타일 이름을 표시하는 카드입니다.
 * 호버 시 이미지 확대 효과와 오버레이 변화를 제공합니다.
 * 
 * @example
 * <StyleCard
 *   style={{
 *     id: 'modern',
 *     name: 'Modern',
 *     imageId: 'style-modern'
 *   }}
 *   isSelected={true}
 *   onToggle={handleToggle}
 * />
 */
export function StyleCard({
  style,
  isSelected,
  onToggle,
}: StyleCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === style.imageId);

  return (
    <SelectionCard
      id={style.id}
      isSelected={isSelected}
      onToggle={onToggle}
      className="overflow-hidden relative group"
    >
      <CardContent className="p-0 relative aspect-square min-h-[200px]">
        {/* 배경 이미지 */}
        {image ? (
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={image.imageHint}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
        
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
        
        {/* 스타일 이름 */}
        <div className="absolute inset-0 flex items-center justify-center p-2 text-center z-10">
          <h3 className="font-headline text-lg font-bold text-white drop-shadow-lg">
            {style.name}
          </h3>
        </div>
      </CardContent>
    </SelectionCard>
  );
}






