# 구글 애널리틱스 통합 가이드

> 생성일: 2025-01-XX  
> 프로젝트: Clocan (Closet Canvas)  
> 목적: 사용자 행동 분석 및 서비스 개선을 위한 데이터 수집 전략

---

## 📋 목차

1. [개요](#개요)
2. [프로젝트 분석](#프로젝트-분석)
3. [핵심 추적 지점 (Key Tracking Points)](#핵심-추적-지점-key-tracking-points)
4. [구현 가이드](#구현-가이드)
5. [분석 인사이트 전략](#분석-인사이트-전략)
6. [단계별 구현 계획](#단계별-구현-계획)

---

## 개요

### 왜 구글 애널리틱스를 도입해야 하나요?

**Clocan**은 사용자의 스타일 선호도를 파악하고 AI 기반 추천을 제공하는 서비스입니다. 구글 애널리틱스를 통해 다음을 파악할 수 있습니다:

1. **사용자 여정 분석**: 랜딩 → 퀴즈 → 결과까지의 전환율
2. **퀴즈 완료율**: 어느 단계에서 이탈하는지
3. **스타일 선호도 트렌드**: 어떤 스타일/색상이 인기인지
4. **기능 사용 패턴**: 어떤 기능이 가장 많이 사용되는지
5. **성능 최적화**: 어느 페이지가 느린지, 에러가 발생하는지

---

## 프로젝트 분석

### 서비스 특성

**Clocan**은 다음과 같은 특성을 가진 서비스입니다:

- **온보딩 중심**: 스타일 퀴즈가 핵심 기능
- **단계별 플로우**: 5단계 퀴즈를 통한 점진적 정보 수집
- **결과 기반**: 퀴즈 완료 후 개인화된 분석 제공
- **향후 확장**: 위시리스트, 옷장 관리, 추천 기능 예정

### 주요 사용자 플로우

```
랜딩 페이지 (/)
  ↓ [CTA 클릭]
스타일 퀴즈 시작 (/style-quiz)
  ↓ [5단계 진행]
  - Welcome Step
  - Style Selection Step
  - Color Selection Step
  - Inspiration Selection Step
  - Completion Step
  ↓ [완료]
결과 페이지 (/style-quiz/result)
```

### 현재 구현된 페이지

1. **랜딩 페이지** (`/`)
   - Hero 섹션
   - 서비스 소개
   - CTA 버튼: "취향 입력하고 바로 추천받기"
   - API 테스트 버튼 (개발용)

2. **스타일 퀴즈 페이지** (`/style-quiz`)
   - 5단계 온보딩 플로우
   - 각 단계별 선택 항목

3. **결과 페이지** (`/style-quiz/result`)
   - AI 분석 결과 표시
   - 선택 항목 요약
   - 재시도/홈으로 돌아가기 버튼

---

## 핵심 추적 지점 (Key Tracking Points)

### 1. 페이지뷰 (Page Views)

#### 필수 추적 페이지

| 페이지 경로 | 이벤트명 | 설명 | 우선순위 |
|------------|---------|------|---------|
| `/` | `page_view` | 랜딩 페이지 방문 | ⭐⭐⭐ |
| `/style-quiz` | `page_view` | 퀴즈 시작 페이지 | ⭐⭐⭐ |
| `/style-quiz/result` | `page_view` | 결과 페이지 | ⭐⭐⭐ |
| `/recommend` | `page_view` | 추천 페이지 (향후) | ⭐⭐ |

#### 추적 시점
- Next.js의 `useEffect` 또는 `usePathname` 훅 사용
- 페이지 로드 완료 시점

---

### 2. 이벤트 추적 (Event Tracking)

#### A. 랜딩 페이지 이벤트

| 이벤트 카테고리 | 이벤트명 | 트리거 | 데이터 수집 |
|---------------|---------|--------|------------|
| **CTA 클릭** | `cta_click` | "취향 입력하고 바로 추천받기" 버튼 클릭 | `{ button_text: "취향 입력하고 바로 추천받기", location: "hero" }` |
| **API 테스트** | `api_test_click` | "API 테스트" 버튼 클릭 (개발용) | `{ button_text: "API 테스트" }` |
| **헤더 CTA** | `header_cta_click` | 헤더의 "지금 추천받기" 버튼 클릭 | `{ button_text: "지금 추천받기" }` |
| **섹션 스크롤** | `section_view` | 각 섹션이 뷰포트에 진입 | `{ section_id: "how-it-works" }` |

#### B. 스타일 퀴즈 이벤트

| 이벤트 카테고리 | 이벤트명 | 트리거 | 데이터 수집 |
|---------------|---------|--------|------------|
| **퀴즈 시작** | `quiz_start` | Welcome Step에서 "Let's start!" 클릭 | `{ step: 0, step_name: "welcome" }` |
| **스텝 진행** | `quiz_step_next` | 각 스텝에서 "Next" 버튼 클릭 | `{ step: 1-3, step_name: "style-selection" | "color-selection" | "inspiration-selection", selected_count: number }` |
| **스텝 뒤로가기** | `quiz_step_back` | 이전 스텝으로 돌아가기 | `{ from_step: number, to_step: number }` |
| **스타일 선택** | `style_selected` | 스타일 카드 선택/해제 | `{ style_id: string, style_name: string, action: "select" | "deselect", total_selected: number }` |
| **색상 선택** | `color_selected` | 색상 팔레트 선택/해제 | `{ color_id: string, color_name: string, action: "select" | "deselect", total_selected: number }` |
| **영감 선택** | `inspiration_selected` | 영감 이미지 선택/해제 | `{ inspiration_id: string, action: "select" | "deselect", total_selected: number }` |
| **퀴즈 완료** | `quiz_complete` | 마지막 스텝에서 "Finish" 클릭 | `{ total_steps: 5, styles_selected: string[], colors_selected: string[], inspirations_selected: string[], duration_seconds: number }` |
| **퀴즈 이탈** | `quiz_abandon` | 퀴즈 중간에 페이지를 떠남 | `{ abandoned_at_step: number, time_spent_seconds: number }` |

#### C. 결과 페이지 이벤트

| 이벤트 카테고리 | 이벤트명 | 트리거 | 데이터 수집 |
|---------------|---------|--------|------------|
| **결과 로드** | `result_view` | 결과 페이지 로드 완료 | `{ styles: string[], colors: string[], inspirations_count: number }` |
| **결과 생성 성공** | `result_generated` | AI 분석 결과 생성 완료 | `{ duration_ms: number, has_error: false }` |
| **결과 생성 실패** | `result_error` | AI 분석 실패 | `{ error_type: "timeout" | "network" | "api" | "unknown", retry_count: number }` |
| **재시도** | `result_retry` | "다시 시도" 버튼 클릭 | `{ retry_count: number }` |
| **퀴즈 재시작** | `quiz_restart` | "퀴즈 다시 하기" 버튼 클릭 | `{ from: "result_page" }` |
| **홈으로 이동** | `navigate_home` | "Back to Home" 버튼 클릭 | `{ from: "result_page" }` |

#### D. API 호출 이벤트

| 이벤트 카테고리 | 이벤트명 | 트리거 | 데이터 수집 |
|---------------|---------|--------|------------|
| **API 호출 시작** | `api_request_start` | API 호출 시작 | `{ endpoint: string, method: "GET" | "POST" }` |
| **API 호출 성공** | `api_request_success` | API 호출 성공 | `{ endpoint: string, status: number, duration_ms: number }` |
| **API 호출 실패** | `api_request_error` | API 호출 실패 | `{ endpoint: string, status: number, error_message: string }` |

---

### 3. 커스텀 이벤트 (Custom Events)

#### 사용자 속성 (User Properties)

| 속성명 | 설명 | 예시 값 |
|--------|------|---------|
| `user_type` | 사용자 유형 | `"new"` (첫 방문), `"returning"` (재방문) |
| `quiz_completed` | 퀴즈 완료 여부 | `true` / `false` |
| `preferred_style` | 선호 스타일 | `"modern"`, `"vintage"`, `"minimalist"` 등 |
| `preferred_colors` | 선호 색상 | `"neutrals"`, `"pastels"`, `"brights"` 등 |

#### 이벤트 파라미터 (Event Parameters)

| 파라미터명 | 설명 | 예시 |
|-----------|------|------|
| `step_number` | 퀴즈 단계 번호 | `1`, `2`, `3`, `4`, `5` |
| `step_name` | 퀴즈 단계 이름 | `"style-selection"`, `"color-selection"` |
| `selected_items` | 선택된 항목 수 | `3` (스타일 3개 선택) |
| `duration_seconds` | 소요 시간 (초) | `120` (2분) |
| `error_type` | 에러 타입 | `"timeout"`, `"network"`, `"api"` |

---

## 구현 가이드

### 1. 구글 애널리틱스 설정

#### Step 1: Google Analytics 계정 생성

1. [Google Analytics](https://analytics.google.com/) 접속
2. 계정 및 속성 생성
3. **측정 ID** 복사 (예: `G-XXXXXXXXXX`)

#### Step 2: Next.js에 Google Analytics 추가

```bash
# Google Analytics 라이브러리 설치
npm install @next/third-parties
```

#### Step 3: 환경 변수 설정

`.env.local` 파일에 추가:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

### 2. 추적 유틸리티 생성

#### 파일: `src/lib/analytics.ts`

```typescript
/**
 * Google Analytics 추적 유틸리티
 * 
 * @fileoverview 구글 애널리틱스 이벤트 추적을 위한 유틸리티 함수
 * 
 * @description
 * - 페이지뷰 추적
 * - 커스텀 이벤트 추적
 * - 사용자 속성 설정
 * - 에러 추적
 */

// Google Analytics 타입 정의
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Google Analytics 초기화 여부 확인
 */
function isGAEnabled(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.gtag === 'function' &&
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID !== undefined
  );
}

/**
 * 페이지뷰 추적
 * 
 * @param path - 페이지 경로
 * @param title - 페이지 제목 (선택)
 * 
 * @example
 * ```typescript
 * trackPageView('/style-quiz', '스타일 퀴즈');
 * ```
 */
export function trackPageView(path: string, title?: string): void {
  if (!isGAEnabled()) {
    return;
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!;

  window.gtag?.('config', measurementId, {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * 커스텀 이벤트 추적
 * 
 * @param eventName - 이벤트 이름
 * @param eventParams - 이벤트 파라미터
 * 
 * @example
 * ```typescript
 * trackEvent('quiz_start', {
 *   step: 0,
 *   step_name: 'welcome'
 * });
 * ```
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
): void {
  if (!isGAEnabled()) {
    return;
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!;

  window.gtag?.('event', eventName, {
    ...eventParams,
    send_to: measurementId,
  });
}

/**
 * 사용자 속성 설정
 * 
 * @param userProperties - 사용자 속성
 * 
 * @example
 * ```typescript
 * setUserProperties({
 *   user_type: 'returning',
 *   quiz_completed: true
 * });
 * ```
 */
export function setUserProperties(
  userProperties: Record<string, unknown>
): void {
  if (!isGAEnabled()) {
    return;
  }

  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!;

  window.gtag?.('set', 'user_properties', {
    ...userProperties,
    send_to: measurementId,
  });
}

/**
 * 예외/에러 추적
 * 
 * @param error - 에러 객체 또는 메시지
 * @param fatal - 치명적 에러 여부
 * 
 * @example
 * ```typescript
 * trackException(new Error('API 호출 실패'), false);
 * ```
 */
export function trackException(
  error: Error | string,
  fatal = false
): void {
  if (!isGAEnabled()) {
    return;
  }

  const errorMessage = error instanceof Error ? error.message : error;

  trackEvent('exception', {
    description: errorMessage,
    fatal,
  });
}

/**
 * 퀴즈 단계별 추적 헬퍼
 */
export const quizTracking = {
  /**
   * 퀴즈 시작 추적
   */
  trackStart: () => {
    trackEvent('quiz_start', {
      step: 0,
      step_name: 'welcome',
    });
  },

  /**
   * 퀴즈 스텝 진행 추적
   */
  trackStepNext: (
    step: number,
    stepName: string,
    selectedCount: number
  ) => {
    trackEvent('quiz_step_next', {
      step,
      step_name: stepName,
      selected_count: selectedCount,
    });
  },

  /**
   * 스타일 선택 추적
   */
  trackStyleSelection: (
    styleId: string,
    styleName: string,
    action: 'select' | 'deselect',
    totalSelected: number
  ) => {
    trackEvent('style_selected', {
      style_id: styleId,
      style_name: styleName,
      action,
      total_selected: totalSelected,
    });
  },

  /**
   * 색상 선택 추적
   */
  trackColorSelection: (
    colorId: string,
    colorName: string,
    action: 'select' | 'deselect',
    totalSelected: number
  ) => {
    trackEvent('color_selected', {
      color_id: colorId,
      color_name: colorName,
      action,
      total_selected: totalSelected,
    });
  },

  /**
   * 영감 선택 추적
   */
  trackInspirationSelection: (
    inspirationId: string,
    action: 'select' | 'deselect',
    totalSelected: number
  ) => {
    trackEvent('inspiration_selected', {
      inspiration_id: inspirationId,
      action,
      total_selected: totalSelected,
    });
  },

  /**
   * 퀴즈 완료 추적
   */
  trackComplete: (data: {
    styles: string[];
    colors: string[];
    inspirations: string[];
    durationSeconds: number;
  }) => {
    trackEvent('quiz_complete', {
      total_steps: 5,
      styles_selected: data.styles,
      colors_selected: data.colors,
      inspirations_selected: data.inspirations,
      duration_seconds: data.durationSeconds,
    });

    // 사용자 속성 업데이트
    setUserProperties({
      quiz_completed: true,
      preferred_style: data.styles[0] || 'unknown',
      preferred_colors: data.colors[0] || 'unknown',
    });
  },

  /**
   * 퀴즈 이탈 추적
   */
  trackAbandon: (abandonedAtStep: number, timeSpentSeconds: number) => {
    trackEvent('quiz_abandon', {
      abandoned_at_step: abandonedAtStep,
      time_spent_seconds: timeSpentSeconds,
    });
  },
};
```

---

### 3. Next.js 레이아웃에 GA 스크립트 추가

#### 파일: `src/app/layout.tsx` 수정

```typescript
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="ko">
      <body>
        {children}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
```

---

### 4. 페이지별 추적 구현

#### A. 랜딩 페이지 (`src/app/page.tsx`)

```typescript
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackEvent } from '@/lib/analytics';

export default function Home() {
  const pathname = usePathname();

  useEffect(() => {
    // 페이지뷰 추적
    trackPageView(pathname, '랜딩 페이지');
  }, [pathname]);

  const handleCtaClick = () => {
    // CTA 클릭 추적
    trackEvent('cta_click', {
      button_text: '취향 입력하고 바로 추천받기',
      location: 'hero',
    });
  };

  const handleApiTestClick = async () => {
    // API 테스트 클릭 추적
    trackEvent('api_test_click', {
      button_text: 'API 테스트',
    });
    
    // API 호출 로직...
  };

  return (
    // ... 컴포넌트 코드
  );
}
```

#### B. 스타일 퀴즈 페이지 (`src/components/style-quiz.tsx`)

```typescript
import { useEffect, useRef } from 'react';
import { quizTracking } from '@/lib/analytics';

export function StyleQuiz() {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // 퀴즈 시작 시간 기록
    startTimeRef.current = Date.now();
  }, []);

  const handleNext = () => {
    if (isLastStep) {
      // 퀴즈 완료 추적
      const durationSeconds = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      
      quizTracking.trackComplete({
        styles: selections.styles,
        colors: selections.colors,
        inspirations: selections.inspirations,
        durationSeconds,
      });

      router.push(`/style-quiz/result?${params.toString()}`);
    } else {
      // 스텝 진행 추적
      quizTracking.trackStepNext(
        step,
        currentStepConfig.id,
        getSelectedCount(step)
      );
      
      nextStep();
    }
  };

  const handleStyleToggle = (styleId: string) => {
    const isSelected = selections.styles.includes(styleId);
    const action = isSelected ? 'deselect' : 'select';
    
    // 스타일 선택 추적
    quizTracking.trackStyleSelection(
      styleId,
      getStyleName(styleId),
      action,
      selections.styles.length
    );
    
    toggleSelection('styles', styleId);
  };

  // ... 나머지 코드
}
```

#### C. 결과 페이지 (`src/app/style-quiz/result/ResultClient.tsx`)

```typescript
import { useEffect } from 'react';
import { trackPageView, trackEvent, trackException } from '@/lib/analytics';

export default function ResultClient() {
  useEffect(() => {
    // 결과 페이지뷰 추적
    trackPageView('/style-quiz/result', '스타일 분석 결과');
  }, []);

  const generateResult = async () => {
    const startedAt = performance.now();
    
    try {
      // API 호출...
      
      const duration = performance.now() - startedAt;
      
      // 결과 생성 성공 추적
      trackEvent('result_generated', {
        duration_ms: Math.round(duration),
        has_error: false,
      });
      
      setResult(analysisResult);
    } catch (err) {
      // 결과 생성 실패 추적
      trackEvent('result_error', {
        error_type: getErrorType(err),
        retry_count: retryCount,
      });
      
      trackException(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const handleRetry = () => {
    trackEvent('result_retry', {
      retry_count: retryCount + 1,
    });
    
    generateResult();
  };

  // ... 나머지 코드
}
```

---

## 분석 인사이트 전략

### 1. 핵심 지표 (Key Metrics)

#### A. 전환율 지표

| 지표명 | 계산식 | 목표값 | 의미 |
|--------|--------|--------|------|
| **랜딩 → 퀴즈 시작 전환율** | (퀴즈 시작 수 / 랜딩 페이지 방문 수) × 100 | > 30% | CTA 효과성 |
| **퀴즈 완료율** | (퀴즈 완료 수 / 퀴즈 시작 수) × 100 | > 60% | 퀴즈 UX 품질 |
| **전체 전환율** | (결과 페이지 방문 수 / 랜딩 페이지 방문 수) × 100 | > 20% | 전체 플로우 성공률 |

#### B. 이탈률 지표

| 지표명 | 계산식 | 의미 |
|--------|--------|------|
| **퀴즈 이탈률** | (이탈 수 / 퀴즈 시작 수) × 100 | 어느 단계에서 이탈하는지 |
| **평균 완료 시간** | 퀴즈 완료까지 소요 시간 평균 | 사용자 경험 품질 |

#### C. 참여도 지표

| 지표명 | 계산식 | 의미 |
|--------|--------|------|
| **평균 선택 항목 수** | (스타일 + 색상 + 영감 선택 수) / 완료 수 | 사용자 참여도 |
| **스텝별 체류 시간** | 각 스텝에서 소요된 시간 | 어느 스텝이 어려운지 |

### 2. 트렌드 분석

#### A. 스타일 선호도 트렌드

**분석 방법:**
- `style_selected` 이벤트의 `style_name` 파라미터 집계
- 시간대별, 요일별 트렌드 분석

**인사이트:**
- 가장 인기 있는 스타일: `modern`, `minimalist`, `vintage` 등
- 계절별 선호도 변화
- 연령대별 선호도 차이 (향후 사용자 정보 수집 시)

#### B. 색상 선호도 트렌드

**분석 방법:**
- `color_selected` 이벤트의 `color_name` 파라미터 집계

**인사이트:**
- 가장 인기 있는 색상 팔레트
- 스타일-색상 조합 패턴

### 3. 에러 모니터링

#### A. API 에러 추적

**분석 방법:**
- `api_request_error` 이벤트 집계
- `result_error` 이벤트 분석

**인사이트:**
- 가장 많이 발생하는 에러 타입
- 에러 발생 빈도가 높은 엔드포인트
- 재시도 성공률

### 4. 사용자 세그먼트 분석

#### A. 사용자 유형별 분석

| 세그먼트 | 기준 | 분석 포인트 |
|---------|------|------------|
| **신규 사용자** | `user_type: "new"` | 첫 방문 시 행동 패턴 |
| **재방문 사용자** | `user_type: "returning"` | 재방문 이유 및 행동 변화 |
| **퀴즈 완료자** | `quiz_completed: true` | 완료 후 행동 패턴 |
| **이탈 사용자** | 퀴즈 중 이탈 | 이탈 원인 분석 |

---

## 단계별 구현 계획

### Phase 1: 기본 설정 (1일)

**목표:** 구글 애널리틱스 기본 설정 및 페이지뷰 추적

- [ ] Google Analytics 계정 생성 및 측정 ID 발급
- [ ] `@next/third-parties` 라이브러리 설치
- [ ] `src/lib/analytics.ts` 유틸리티 생성
- [ ] `src/app/layout.tsx`에 GA 스크립트 추가
- [ ] 모든 페이지에 페이지뷰 추적 추가

**예상 시간:** 2-3시간

---

### Phase 2: 핵심 이벤트 추적 (2일)

**목표:** 가장 중요한 사용자 행동 추적

- [ ] 랜딩 페이지 CTA 클릭 추적
- [ ] 퀴즈 시작/완료 추적
- [ ] 퀴즈 스텝 진행 추적
- [ ] 결과 페이지 로드 추적

**예상 시간:** 4-6시간

---

### Phase 3: 상세 이벤트 추적 (3일)

**목표:** 세부적인 사용자 행동 추적

- [ ] 스타일/색상/영감 선택 추적
- [ ] 퀴즈 이탈 추적
- [ ] API 호출 성공/실패 추적
- [ ] 에러 추적

**예상 시간:** 6-8시간

---

### Phase 4: 고급 분석 설정 (2일)

**목표:** 커스텀 대시보드 및 목표 설정

- [ ] Google Analytics 대시보드 설정
- [ ] 전환 목표 설정
- [ ] 사용자 세그먼트 생성
- [ ] 커스텀 리포트 생성

**예상 시간:** 4-6시간

---

## 추천 대시보드 구성

### 대시보드 1: 전환율 모니터링

**지표:**
- 랜딩 → 퀴즈 시작 전환율
- 퀴즈 완료율
- 전체 전환율

**차트:**
- 시간대별 전환율 추이
- 요일별 전환율 비교

---

### 대시보드 2: 퀴즈 분석

**지표:**
- 스텝별 이탈률
- 평균 완료 시간
- 스텝별 체류 시간

**차트:**
- 퀴즈 플로우 시각화 (Sankey 차트)
- 스텝별 체류 시간 히트맵

---

### 대시보드 3: 트렌드 분석

**지표:**
- 인기 스타일 TOP 10
- 인기 색상 팔레트 TOP 10
- 스타일-색상 조합 패턴

**차트:**
- 스타일 선호도 파이 차트
- 시간대별 트렌드 라인 차트

---

## 주의사항

### 1. 개인정보 보호

- **민감한 정보 수집 금지**: 이메일, 전화번호 등 개인 식별 정보 수집하지 않기
- **GDPR 준수**: EU 사용자 대상 서비스 시 쿠키 동의 필요
- **쿠키 정책**: 쿠키 사용에 대한 명확한 안내 제공

### 2. 성능 영향

- **비동기 로딩**: GA 스크립트는 비동기로 로드하여 페이지 성능에 영향 최소화
- **샘플링**: 트래픽이 많을 경우 샘플링 설정 고려

### 3. 데이터 품질

- **이벤트명 일관성**: 이벤트명을 일관되게 사용
- **파라미터 표준화**: 파라미터 이름과 타입을 표준화
- **테스트**: 개발 환경에서 충분히 테스트 후 배포

---

## 프로젝트별 핵심 분석 지표

### Clocan 서비스 특성에 맞는 분석 포인트

#### 1. 퀴즈 완료율 분석

**왜 중요한가?**
- Clocan의 핵심 가치는 퀴즈 완료 후 개인화된 분석 제공
- 퀴즈 완료율이 낮으면 서비스 가치 전달 실패

**분석 방법:**
```
퀴즈 완료율 = (quiz_complete 이벤트 수 / quiz_start 이벤트 수) × 100
```

**개선 액션:**
- 완료율이 50% 미만이면 퀴즈 단계 수 줄이기 검토
- 특정 스텝에서 이탈률이 높으면 해당 스텝 UX 개선

#### 2. 스타일 선호도 트렌드

**왜 중요한가?**
- 사용자 선호도를 파악하여 향후 추천 알고리즘 개선
- 트렌드 데이터로 마케팅 전략 수립

**분석 방법:**
- `style_selected` 이벤트의 `style_name` 집계
- 시간대별, 요일별 트렌드 분석
- 스타일 조합 패턴 분석 (예: Modern + Neutrals 조합)

**인사이트 활용:**
- 인기 스타일을 랜딩 페이지에 강조 표시
- 계절별 트렌드 반영 (예: 봄에는 Pastels 인기)

#### 3. 사용자 여정 분석

**왜 중요한가?**
- 어느 지점에서 사용자가 이탈하는지 파악
- 최적의 사용자 경로 설계

**핵심 여정:**
```
랜딩 페이지 방문
  ↓ (전환율 측정)
퀴즈 시작
  ↓ (이탈률 측정)
스타일 선택 (Step 1)
  ↓ (이탈률 측정)
색상 선택 (Step 2)
  ↓ (이탈률 측정)
영감 선택 (Step 3)
  ↓ (이탈률 측정)
퀴즈 완료
  ↓ (전환율 측정)
결과 페이지 방문
  ↓ (전환율 측정)
결과 확인 완료
```

**개선 포인트:**
- 각 단계별 이탈률이 20% 이상이면 해당 단계 UX 개선 필요
- 평균 완료 시간이 5분 이상이면 퀴즈 단순화 검토

#### 4. 에러 모니터링

**왜 중요한가?**
- 사용자 경험 저하 방지
- 기술적 문제 조기 발견

**추적 지표:**
- API 에러 발생 빈도
- 결과 생성 실패율
- 재시도 성공률

**알림 설정:**
- 에러 발생률이 5% 이상이면 알림
- 특정 엔드포인트 에러율이 높으면 우선 수정

---

## 백엔드 API 추적 전략

### API 호출 추적

백엔드 API 호출도 추적하여 전체 시스템 성능을 모니터링할 수 있습니다.

#### 추적할 API 엔드포인트

| API 엔드포인트 | 이벤트명 | 파라미터 |
|---------------|---------|---------|
| `GET /api/v1/feature1/ping` | `api_feature1_ping` | `{ success: boolean, duration_ms: number }` |
| `GET /api/v1/health/ping` | `api_health_check` | `{ success: boolean }` |
| `POST /api/v1/recommend` | `api_recommend_request` | `{ preferences_count: number, success: boolean, duration_ms: number }` |
| `POST /api/v1/auth/login` | `api_login` | `{ success: boolean, duration_ms: number }` |
| `POST /api/v1/users/signup` | `api_signup` | `{ success: boolean, duration_ms: number }` |

#### 구현 예시

```typescript
// src/lib/api.ts에 추가
import { trackEvent } from '@/lib/analytics';

export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const url = getApiUrl(endpoint);
  const startedAt = performance.now();
  
  // API 호출 시작 추적
  trackEvent('api_request_start', {
    endpoint,
    method: 'GET',
  });

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': requestId,
      },
    });

    const duration = Math.round(performance.now() - startedAt);

    if (!res.ok) {
      // API 에러 추적
      trackEvent('api_request_error', {
        endpoint,
        method: 'GET',
        status: res.status,
        duration_ms: duration,
      });
      
      throw new Error(`API 호출 실패: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // API 성공 추적
    trackEvent('api_request_success', {
      endpoint,
      method: 'GET',
      status: res.status,
      duration_ms: duration,
    });

    return data as T;
  } catch (error) {
    const duration = Math.round(performance.now() - startedAt);
    
    // 네트워크 에러 추적
    trackEvent('api_request_error', {
      endpoint,
      method: 'GET',
      error_type: 'network',
      duration_ms: duration,
    });

    throw error;
  }
}
```

---

## 실전 분석 시나리오

### 시나리오 1: 퀴즈 완료율 개선

**문제:** 퀴즈 완료율이 40%로 낮음

**분석:**
1. GA에서 `quiz_abandon` 이벤트 분석
2. 어느 스텝에서 가장 많이 이탈하는지 확인
3. 해당 스텝의 평균 체류 시간 확인

**가설:**
- Step 2 (색상 선택)에서 이탈률이 30%로 가장 높음
- 평균 체류 시간이 2분으로 다른 스텝보다 길음

**개선 방안:**
- 색상 팔레트를 더 직관적으로 표시
- 선택 가이드 텍스트 추가
- 색상 선택을 선택 사항으로 변경 (최소 1개만 필수)

**검증:**
- 개선 후 퀴즈 완료율이 40% → 60%로 증가하는지 확인

---

### 시나리오 2: 스타일 트렌드 분석

**목표:** 사용자 선호 스타일 파악

**분석:**
1. `style_selected` 이벤트 집계
2. 시간대별, 요일별 트렌드 분석
3. 스타일 조합 패턴 분석

**인사이트:**
- Modern 스타일이 35%로 가장 인기
- 주말에는 Bohemian 스타일 선호도 증가
- Modern + Neutrals 조합이 가장 많음

**활용:**
- 랜딩 페이지에 Modern 스타일 강조
- 주말 마케팅 시 Bohemian 스타일 활용
- 추천 알고리즘에 조합 패턴 반영

---

### 시나리오 3: 성능 최적화

**목표:** 느린 페이지/API 식별

**분석:**
1. 페이지 로드 시간 추적
2. API 응답 시간 추적
3. 에러 발생 빈도 분석

**인사이트:**
- 결과 페이지 평균 로드 시간이 3초로 느림
- `/api/v1/recommend` API 평균 응답 시간이 2.5초
- 타임아웃 에러 발생률이 5%

**개선:**
- 결과 페이지 코드 스플리팅
- API 응답 시간 최적화 (캐싱, 병렬 처리)
- 타임아웃 시간 조정 또는 재시도 로직 개선

---

## 다음 단계

1. **A/B 테스트**: CTA 버튼 텍스트, 색상 등 A/B 테스트
2. **사용자 피드백 연동**: GA 데이터와 사용자 피드백 조합 분석
3. **예측 분석**: 머신러닝을 활용한 사용자 행동 예측
4. **실시간 모니터링**: 실시간 대시보드 구축
5. **백엔드 로그 연동**: 백엔드 로그와 프론트엔드 GA 데이터 연동

---

## 참고 자료

- [Google Analytics 공식 문서](https://developers.google.com/analytics)
- [Next.js Third-Party Integration](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries)
- [GA4 이벤트 추적 가이드](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 커스텀 이벤트 가이드](https://support.google.com/analytics/answer/9267735)

---

## 업데이트 이력

- 2025-01-XX: 초기 작성
  - 프로젝트 분석 완료
  - 핵심 추적 지점 정의
  - 구현 가이드 작성
  - 실전 분석 시나리오 추가
