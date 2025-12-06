/**
 * Utility Functions
 * 
 * @fileoverview 프로젝트 전반에서 사용되는 유틸리티 함수 모음
 * 
 * @module lib/utils
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 클래스명 조합 유틸리티 함수
 * 
 * @function cn
 * @param {...ClassValue[]} inputs - 조합할 클래스명들 (문자열, 객체, 배열 등)
 * @returns {string} 병합되고 최적화된 Tailwind CSS 클래스명 문자열
 * 
 * @description
 * clsx와 tailwind-merge를 조합하여 다음 기능을 제공합니다:
 * 1. clsx: 조건부 클래스명 조합 (객체, 배열 지원)
 * 2. tailwind-merge: Tailwind 클래스 충돌 해결 (나중 값이 우선)
 * 
 * @example
 * // 기본 사용
 * cn('px-4', 'py-2', 'bg-blue-500')
 * // => 'px-4 py-2 bg-blue-500'
 * 
 * @example
 * // 조건부 클래스
 * cn('base-class', {
 *   'active-class': isActive,
 *   'disabled-class': isDisabled
 * })
 * // => isActive가 true면 'base-class active-class'
 * 
 * @example
 * // Tailwind 충돌 해결
 * cn('px-4 py-2', 'px-6')  // 나중 px-6이 px-4를 덮어씀
 * // => 'py-2 px-6'
 * 
 * @example
 * // 컴포넌트에서 사용 (가장 일반적)
 * <div className={cn(
 *   'base-styles',
 *   variant === 'primary' && 'primary-styles',
 *   className  // 외부에서 전달받은 클래스
 * )} />
 * 
 * @usage
 * - Button, Card, Badge 등 거의 모든 UI 컴포넌트에서 사용
 * - props로 받은 className과 기본 스타일을 안전하게 병합
 * - 조건부 스타일링 시 깔끔한 코드 작성 가능
 * 
 * @performance
 * - 경량 라이브러리로 성능 영향 미미
 * - 반복 호출 시에도 안정적
 * 
 * @see {@link https://github.com/dcastil/tailwind-merge} tailwind-merge 문서
 * @see {@link https://github.com/lukeed/clsx} clsx 문서
 * 
 * @version 1.0.0
 * @since 프로젝트 초기부터 사용
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
