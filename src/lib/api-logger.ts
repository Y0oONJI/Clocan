/**
 * API 로거 유틸리티
 * 
 * @fileoverview 프론트엔드에서 백엔드 API 호출 시 요청/응답을 로깅하는 유틸리티
 * 
 * @description
 * - 요청 로거: API 호출 전 요청 정보를 로깅
 * - 응답 로거: API 호출 후 응답 정보를 로깅
 * - 환경 변수로 온오프 제어 가능
 * - console.group을 사용하여 보기 좋게 그룹화
 * 
 * @module lib/api-logger
 */

// 그룹 상태 관리 (requestId -> 그룹 시작 여부)
const activeGroups = new Map<string, boolean>();

/**
 * API 로깅 활성화 여부
 * 
 * @description
 * NEXT_PUBLIC_API_LOGGING 환경 변수로 제어 가능
 * - "true" 또는 "1": 활성화
 * - 그 외: 비활성화
 * 
 * 기본값: 개발 환경에서는 활성화, 프로덕션에서는 비활성화
 */
const isApiLoggingEnabled = (): boolean => {
  // 환경 변수로 명시적으로 제어 가능
  const envValue = process.env.NEXT_PUBLIC_API_LOGGING;
  if (envValue === "true" || envValue === "1") {
    return true;
  }
  if (envValue === "false" || envValue === "0") {
    return false;
  }
  
  // 환경 변수가 없으면 개발 환경에서만 활성화
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }
  
  return process.env.NODE_ENV === 'development';
};

const API_LOGGING_ENABLED = isApiLoggingEnabled();

/**
 * API 요청 정보 타입
 */
export interface ApiRequestLog {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: unknown;
  timestamp: string;
  requestId?: string;
}

/**
 * API 응답 정보 타입
 */
export interface ApiResponseLog {
  url: string;
  method: string;
  status: number;
  statusText: string;
  headers?: Record<string, string>;
  body?: unknown;
  timestamp: string;
  requestId?: string;
  duration?: number; // milliseconds
}

/**
 * API 에러 정보 타입
 */
export interface ApiErrorLog {
  url: string;
  method: string;
  error: unknown;
  timestamp: string;
  requestId?: string;
  duration?: number; // milliseconds
}

/**
 * 요청 본문을 안전하게 직렬화
 */
function serializeBody(body: unknown): unknown {
  if (body === null || body === undefined) {
    return undefined;
  }
  
  // 문자열인 경우 JSON 파싱 시도
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
  
  // 이미 객체인 경우 그대로 반환
  return body;
}

/**
 * 프론트엔드 API 요청 로거
 * 
 * @param log - 요청 로그 정보
 * 
 * @example
 * ```typescript
 * logApiRequest({
 *   url: '/api/v1/feature1/ping',
 *   method: 'GET',
 *   headers: { 'Content-Type': 'application/json' },
 *   requestId: 'abc-123'
 * });
 * ```
 */
export function logApiRequest(log: ApiRequestLog): void {
  if (!API_LOGGING_ENABLED) {
    return;
  }

  const { url, method, headers, body, timestamp, requestId } = log;
  
  // 그룹 제목 생성
  const groupTitle = `🌐 ${method} ${url}${requestId ? ` [${requestId.substring(0, 8)}]` : ''}`;
  
  // 그룹 시작
  console.group(groupTitle);
  
  // 기본 정보
  console.log('📤 Request', {
    method,
    url,
    timestamp,
  });

  // 헤더 정보
  if (headers && Object.keys(headers).length > 0) {
    // 민감한 정보 제거 (예: Authorization 헤더)
    const safeHeaders: Record<string, string> = { ...headers };
    if (safeHeaders.Authorization) {
      safeHeaders.Authorization = '[REDACTED]';
    }
    console.log('📋 Headers', safeHeaders);
  }

  // 요청 본문
  if (body !== undefined) {
    const serializedBody = serializeBody(body);
    console.log('📦 Request Body', serializedBody);
  }

  // 그룹 상태 저장 (응답에서 닫기 위해)
  if (requestId) {
    activeGroups.set(requestId, true);
  }
}

/**
 * 프론트엔드 API 응답 로거
 * 
 * @param log - 응답 로그 정보
 * 
 * @example
 * ```typescript
 * logApiResponse({
 *   url: '/api/v1/feature1/ping',
 *   method: 'GET',
 *   status: 200,
 *   statusText: 'OK',
 *   body: { ok: true, message: 'Success' },
 *   requestId: 'abc-123',
 *   duration: 150
 * });
 * ```
 */
export function logApiResponse(log: ApiResponseLog): void {
  if (!API_LOGGING_ENABLED) {
    return;
  }

  const { url, method, status, statusText, headers, body, timestamp, requestId, duration } = log;
  
  // 상태에 따른 이모지 및 색상
  const isError = status >= 400;
  const statusEmoji = isError ? '❌' : '✅';
  const statusColor = isError ? 'color: #ef4444' : 'color: #10b981';
  
  // 응답 정보 출력
  console.log(
    `%c${statusEmoji} Response [${status} ${statusText}]${duration !== undefined ? ` ⏱️ ${duration}ms` : ''}`,
    statusColor,
    {
      status,
      statusText,
      timestamp,
      duration: duration !== undefined ? `${duration}ms` : undefined,
    }
  );

  // 응답 헤더
  if (headers && Object.keys(headers).length > 0) {
    console.log('📋 Response Headers', headers);
  }

  // 응답 본문
  if (body !== undefined) {
    console.log('📦 Response Body', body);
  }

  // 그룹 종료
  if (requestId && activeGroups.has(requestId)) {
    console.groupEnd();
    activeGroups.delete(requestId);
  } else {
    // requestId가 없거나 그룹이 시작되지 않은 경우에도 그룹 종료 시도
    console.groupEnd();
  }
}

/**
 * 프론트엔드 API 에러 로거
 * 
 * @param log - 에러 로그 정보
 * 
 * @example
 * ```typescript
 * logApiError({
 *   url: '/api/v1/feature1/ping',
 *   method: 'GET',
 *   error: new Error('Network error'),
 *   requestId: 'abc-123',
 *   duration: 5000
 * });
 * ```
 */
export function logApiError(log: ApiErrorLog): void {
  if (!API_LOGGING_ENABLED) {
    return;
  }

  const { url, method, error, timestamp, requestId, duration } = log;
  
  // 에러 정보 출력
  console.error(
    `%c❌ Error${duration !== undefined ? ` ⏱️ ${duration}ms` : ''}`,
    'color: #ef4444; font-weight: bold',
    {
      method,
      url,
      timestamp,
      duration: duration !== undefined ? `${duration}ms` : undefined,
    }
  );

  // 에러 상세 정보
  if (error instanceof Error) {
    console.error('💥 Error Details', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.error('💥 Error Details', error);
  }

  // 그룹 종료
  if (requestId && activeGroups.has(requestId)) {
    console.groupEnd();
    activeGroups.delete(requestId);
  } else {
    // requestId가 없거나 그룹이 시작되지 않은 경우에도 그룹 종료 시도
    console.groupEnd();
  }
}
