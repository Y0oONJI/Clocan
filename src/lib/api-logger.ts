/**
 * API 로거 유틸리티
 * 
 * @fileoverview 프론트엔드에서 백엔드 API 호출 시 요청/응답을 로깅하는 유틸리티
 * 
 * @description
 * - 요청 로거: API 호출 전 요청 정보를 로깅
 * - 응답 로거: API 호출 후 응답 정보를 로깅
 * - 환경 변수로 온오프 제어 가능
 * 
 * @module lib/api-logger
 */

import { logger } from "@/lib/logger";

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
  
  const logData: Record<string, unknown> = {
    type: 'API_REQUEST',
    method,
    url,
    timestamp,
  };

  if (requestId) {
    logData.requestId = requestId;
  }

  if (headers && Object.keys(headers).length > 0) {
    // 민감한 정보 제거 (예: Authorization 헤더)
    const safeHeaders: Record<string, string> = { ...headers };
    if (safeHeaders.Authorization) {
      safeHeaders.Authorization = '[REDACTED]';
    }
    logData.headers = safeHeaders;
  }

  if (body !== undefined) {
    logData.body = serializeBody(body);
  }

  logger.info('API', 'REQUEST', logData);
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
  
  const logData: Record<string, unknown> = {
    type: 'API_RESPONSE',
    method,
    url,
    status,
    statusText,
    timestamp,
  };

  if (requestId) {
    logData.requestId = requestId;
  }

  if (duration !== undefined) {
    logData.duration = `${duration}ms`;
  }

  if (headers && Object.keys(headers).length > 0) {
    logData.headers = headers;
  }

  if (body !== undefined) {
    logData.body = body;
  }

  // 에러 상태 코드인 경우 error 레벨로 로깅
  if (status >= 400) {
    logger.error('API', 'RESPONSE_ERROR', logData);
  } else {
    logger.info('API', 'RESPONSE', logData);
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
  
  const logData: Record<string, unknown> = {
    type: 'API_ERROR',
    method,
    url,
    timestamp,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
  };

  if (requestId) {
    logData.requestId = requestId;
  }

  if (duration !== undefined) {
    logData.duration = `${duration}ms`;
  }

  logger.error('API', 'ERROR', logData);
}
