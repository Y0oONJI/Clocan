/**
 * Quiz Type Definitions
 * 
 * @fileoverview 퀴즈 관련 TypeScript 타입 정의
 * 
 * @description
 * 스타일 퀴즈에서 사용되는 모든 타입과 인터페이스를 정의합니다.
 * 타입 안정성을 강화하고 IDE 자동완성을 향상시킵니다.
 * 
 * @module types/quiz
 * @version 1.0.0
 * @since 2025-12-06
 */

/**
 * 퀴즈 카테고리 타입
 * 
 * @typedef {'styles' | 'colors' | 'inspirations'} QuizCategory
 * 
 * @description
 * 퀴즈에서 선택 가능한 3가지 카테고리를 정의합니다.
 */
export type QuizCategory = 'styles' | 'colors' | 'inspirations';

/**
 * 퀴즈 상태 인터페이스
 * 
 * @interface QuizState
 * @property {number} currentStep - 현재 단계 (0-4)
 * @property {QuizSelections} selections - 사용자 선택 항목
 * 
 * @description
 * 퀴즈의 전체 상태를 나타냅니다.
 */
export interface QuizState {
  currentStep: number;
  selections: QuizSelections;
}

/**
 * 퀴즈 선택 항목 인터페이스
 * 
 * @interface QuizSelections
 * @property {string[]} styles - 선택된 스타일 ID 배열
 * @property {string[]} colors - 선택된 색상 팔레트 ID 배열
 * @property {string[]} inspirations - 선택된 영감 이미지 ID 배열
 * 
 * @example
 * const selections: QuizSelections = {
 *   styles: ['modern', 'minimalist'],
 *   colors: ['neutrals'],
 *   inspirations: ['inspiration-1', 'inspiration-2']
 * };
 */
export interface QuizSelections {
  styles: string[];
  colors: string[];
  inspirations: string[];
}

/**
 * 퀴즈 스텝 Props 인터페이스
 * 
 * @interface QuizStepProps
 * @property {string[]} selectedItems - 현재 선택된 항목 ID 배열
 * @property {(id: string) => void} onToggle - 선택 토글 핸들러
 * 
 * @description
 * 각 퀴즈 스텝 컴포넌트가 받는 공통 props입니다.
 * 
 * @example
 * function MyQuizStep({ selectedItems, onToggle }: QuizStepProps) {
 *   return (
 *     <div>
 *       {items.map(item => (
 *         <Card
 *           key={item.id}
 *           onClick={() => onToggle(item.id)}
 *           selected={selectedItems.includes(item.id)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 */
export interface QuizStepProps {
  selectedItems: string[];
  onToggle: (id: string) => void;
}

/**
 * 퀴즈 스텝 설정 인터페이스
 * 
 * @interface QuizStepConfig
 * @property {string} id - 스텝 고유 식별자
 * @property {string} title - 스텝 제목
 * @property {string} description - 스텝 설명
 * @property {React.ComponentType<QuizStepProps>} [component] - 스텝 컴포넌트 (선택 단계에만 필요)
 * @property {boolean} isSelectionRequired - 선택 필수 여부
 * @property {string} buttonText - 버튼 텍스트
 * @property {QuizCategory} [category] - 선택 카테고리 (선택 단계에만 필요)
 * 
 * @description
 * 각 퀴즈 스텝의 설정을 정의합니다.
 * 
 * @example
 * const stepConfig: QuizStepConfig = {
 *   id: 'style-selection',
 *   title: 'Which styles are you drawn to?',
 *   description: 'Select one or more styles',
 *   component: StyleSelectionStep,
 *   isSelectionRequired: true,
 *   buttonText: 'Next',
 *   category: 'styles'
 * };
 */
export interface QuizStepConfig {
  id: string;
  title: string;
  description: string;
  component?: React.ComponentType<QuizStepProps>;
  isSelectionRequired: boolean;
  buttonText: string;
  category?: QuizCategory;
}

