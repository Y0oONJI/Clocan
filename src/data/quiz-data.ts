/**
 * Quiz Data Configuration
 * 
 * @fileoverview 스타일 퀴즈에 사용되는 모든 정적 데이터를 중앙 관리합니다.
 * 
 * @description
 * 이 파일은 스타일 선호도 퀴즈의 모든 선택지 데이터와 관련 타입을 정의합니다.
 * 데이터-UI 분리 원칙에 따라 하드코딩된 데이터를 별도 파일로 추출하여 관리합니다.
 * 
 * @module data/quiz-data
 * 
 * @example
 * // 스타일 데이터 사용
 * import { QUIZ_STYLES, StyleOption } from '@/data/quiz-data';
 * 
 * QUIZ_STYLES.map(style => (
 *   <Card key={style.id}>{style.name}</Card>
 * ));
 * 
 * @example
 * // 색상 팔레트 사용
 * import { QUIZ_COLORS } from '@/data/quiz-data';
 * 
 * const selectedColor = QUIZ_COLORS.find(c => c.id === 'neutrals');
 * selectedColor.palette.forEach(hex => console.log(hex));
 * 
 * @see {@link StyleQuiz} 주요 사용처
 * @see {@link StyleQuizResultPage} 결과 페이지에서도 사용
 * 
 * @version 1.0.0
 * @since 2025-12-06 - 리팩토링으로 별도 파일로 분리
 */

/**
 * 스타일 옵션 타입
 * 
 * @typedef {Object} StyleOption
 * @property {string} id - 스타일 고유 식별자 (예: 'modern', 'vintage')
 * @property {string} name - 사용자에게 표시되는 스타일 이름
 * @property {string} imageId - 해당 스타일의 이미지 ID (PlaceHolderImages에서 참조)
 * 
 * @example
 * const modernStyle: StyleOption = {
 *   id: 'modern',
 *   name: 'Modern',
 *   imageId: 'style-modern'
 * };
 */
export type StyleOption = {
  id: string;
  name: string;
  imageId: string;
};

/**
 * 색상 팔레트 타입
 * 
 * @typedef {Object} ColorPalette
 * @property {string} id - 팔레트 고유 식별자 (예: 'neutrals', 'pastels')
 * @property {string} name - 사용자에게 표시되는 팔레트 이름
 * @property {[string, string, string, string]} palette - 정확히 4개의 HEX 색상 코드
 * 
 * @example
 * const neutralPalette: ColorPalette = {
 *   id: 'neutrals',
 *   name: 'Neutrals',
 *   palette: ['#EAE0D5', '#C6AC8F', '#594A47', '#0A0908']
 * };
 * 
 * @note 팔레트는 Tuple 타입으로 정확히 4개의 색상만 허용합니다.
 */
export type ColorPalette = {
  id: string;
  name: string;
  palette: [string, string, string, string];
};

/**
 * 퀴즈 스타일 선택지
 * 
 * @constant
 * @type {StyleOption[]}
 * 
 * @description
 * 사용자가 선택할 수 있는 6가지 스타일 옵션입니다.
 * 각 스타일은 고유 ID, 표시 이름, 이미지 ID를 포함합니다.
 * 
 * @usage
 * - StyleQuiz의 Step 1에서 사용
 * - ResultPage에서 선택된 스타일 이름 조회 시 사용
 * 
 * @example
 * // 특정 스타일 찾기
 * const modernStyle = QUIZ_STYLES.find(s => s.id === 'modern');
 * console.log(modernStyle.name); // 'Modern'
 * 
 * @example
 * // 모든 스타일 렌더링
 * QUIZ_STYLES.map(style => (
 *   <StyleCard key={style.id} {...style} />
 * ));
 */
export const QUIZ_STYLES: StyleOption[] = [
  { id: "modern", name: "Modern", imageId: "style-modern" },
  { id: "vintage", name: "Vintage", imageId: "style-vintage" },
  { id: "bohemian", name: "Bohemian", imageId: "style-bohemian" },
  { id: "streetwear", name: "Streetwear", imageId: "style-streetwear" },
  { id: "classic", name: "Classic", imageId: "style-classic" },
  { id: "minimalist", name: "Minimalist", imageId: "style-minimalist" },
];

/**
 * 퀴즈 색상 팔레트 선택지
 * 
 * @constant
 * @type {ColorPalette[]}
 * 
 * @description
 * 사용자가 선택할 수 있는 6가지 색상 팔레트입니다.
 * 각 팔레트는 4개의 조화로운 색상으로 구성되어 있습니다.
 * 
 * @usage
 * - StyleQuiz의 Step 2에서 사용
 * - ResultPage에서 선택된 팔레트 이름 조회 시 사용
 * - UI에서 palette 배열을 순회하며 색상 프리뷰 렌더링
 * 
 * @example
 * // 팔레트 조회
 * const neutrals = QUIZ_COLORS.find(c => c.id === 'neutrals');
 * 
 * @example
 * // 색상 렌더링
 * color.palette.map((hex, i) => (
 *   <div key={i} style={{ backgroundColor: hex }} />
 * ));
 */
export const QUIZ_COLORS: ColorPalette[] = [
  { id: "neutrals", name: "Neutrals", palette: ["#EAE0D5", "#C6AC8F", "#594A47", "#0A0908"] },
  { id: "pastels", name: "Pastels", palette: ["#F7CAC9", "#92A8D1", "#B5EAD7", "#E2F0CB"] },
  { id: "brights", name: "Brights", palette: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1"] },
  { id: "monochrome", name: "Monochrome", palette: ["#000000", "#555555", "#AAAAAA", "#FFFFFF"] },
  { id: "earthy", name: "Earthy", palette: ["#A87B5F", "#5D4C46", "#3E362E", "#C3BBA4"] },
  { id: "jewel", name: "Jewel Tones", palette: ["#003153", "#702963", "#990F02", "#0F5257"] },
];

/**
 * 퀴즈 영감 이미지 ID 목록
 * 
 * @constant
 * @type {string[]}
 * 
 * @description
 * 사용자가 선택할 수 있는 9개의 영감 이미지 ID입니다.
 * 실제 이미지 데이터는 PlaceHolderImages에서 이 ID로 조회됩니다.
 * 
 * @usage
 * - StyleQuiz의 Step 3에서 사용
 * - PlaceHolderImages.find(img => img.id === inspirationId) 패턴으로 사용
 * 
 * @example
 * // 이미지 렌더링
 * QUIZ_INSPIRATION_IMAGES.map(id => {
 *   const image = PlaceHolderImages.find(img => img.id === id);
 *   return <Image key={id} src={image.imageUrl} />;
 * });
 * 
 * @note
 * 이미지 ID는 placeholder-images.json에 정의된 ID와 일치해야 합니다.
 * 
 * @see {@link PlaceHolderImages} 실제 이미지 데이터
 */
export const QUIZ_INSPIRATION_IMAGES: string[] = [
  "inspiration-1",
  "inspiration-2",
  "inspiration-3",
  "inspiration-4",
  "inspiration-5",
  "inspiration-6",
  "inspiration-7",
  "inspiration-8",
  "inspiration-9",
];

