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
 * 
 * 개발 환경에서는 추적하지 않습니다 (NEXT_PUBLIC_GA_ENABLED=false 또는 localhost)
 * 
 * @module lib/analytics
 */

// Google Analytics 타입 정의
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Google Analytics 활성화 여부 확인
 * 
 * @description
 * - 환경 변수 NEXT_PUBLIC_GA_ENABLED가 false이면 비활성화
 * - localhost 또는 127.0.0.1에서는 비활성화 (개발 환경)
 * - 프로덕션 환경에서만 활성화
 */
function isGAEnabled(): boolean {
  // 환경 변수로 명시적으로 비활성화
  if (process.env.NEXT_PUBLIC_GA_ENABLED === 'false') {
    return false;
  }

  // 브라우저 환경에서 localhost인지 확인 (개발 환경 제외)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return false;
    }
  }

  // 측정 ID가 없으면 비활성화
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    return false;
  }

  // gtag 함수가 없으면 비활성화
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return false;
  }

  return true;
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
    // 개발 환경에서는 콘솔에만 출력 (디버깅용)
    if (process.env.NODE_ENV === 'development') {
      console.log('[GA Event (Dev)]', eventName, eventParams);
    }
    return;
  }

  window.gtag?.('event', eventName, {
    ...eventParams,
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

  window.gtag?.('set', 'user_properties', userProperties);
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
   * 퀴즈 스텝 뒤로가기 추적
   */
  trackStepBack: (fromStep: number, toStep: number) => {
    trackEvent('quiz_step_back', {
      from_step: fromStep,
      to_step: toStep,
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

/**
 * API 호출 추적 헬퍼
 */
export const apiTracking = {
  /**
   * API 호출 시작 추적
   */
  trackStart: (endpoint: string, method: string) => {
    trackEvent('api_request_start', {
      endpoint,
      method,
    });
  },

  /**
   * API 호출 성공 추적
   */
  trackSuccess: (
    endpoint: string,
    method: string,
    status: number,
    durationMs: number
  ) => {
    trackEvent('api_request_success', {
      endpoint,
      method,
      status,
      duration_ms: durationMs,
    });
  },

  /**
   * API 호출 실패 추적
   */
  trackError: (
    endpoint: string,
    method: string,
    status: number | undefined,
    errorType: string,
    durationMs: number
  ) => {
    trackEvent('api_request_error', {
      endpoint,
      method,
      status: status || 0,
      error_type: errorType,
      duration_ms: durationMs,
    });
  },
};
