/**
 * Feature1 API Client
 * 
 * @fileoverview Feature1 관련 API 호출 함수들
 * 
 * @module api/feature1
 */

import { logger } from "@/lib/logger";
import { logApiRequest, logApiResponse, logApiError } from "@/lib/api-logger";
import { ulid } from "ulid";

// Next.js 환경 변수 타입 확장
declare const process: {
  env: {
    NEXT_PUBLIC_API_BASE_URL?: string;
    [key: string]: string | undefined;
  };
};

/**
 * API 응답 타입
 */
export interface PingResponse {
  ok: boolean;
  message?: string;
  data?: {
    style?: string;
    items?: unknown[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * API 에러 타입
 */
export class Feature1ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'Feature1ApiError';
  }
}

/**
 * API Base URL
 * 
 * @description
 * Next.js 환경 변수에서 API Base URL을 가져옵니다.
 * 클라이언트 사이드에서 접근 가능하도록 NEXT_PUBLIC_ 접두사가 필요합니다.
 * 환경 변수가 없으면:
 * - 로컬 개발 환경(localhost)에서는 http://localhost:8080 사용
 * - 프로덕션 환경에서는 Cloud Type 배포 URL 사용
 */
function getApiBaseUrl(): string {
  // 환경 변수가 설정되어 있으면 우선 사용
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // 브라우저 환경에서 로컬호스트인지 확인
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:8080';
  }
  
  // 프로덕션 환경 (Vercel 등)
  return "https://port-0-clocan-mkhvtt3s93200f2b.sel3.cloudtype.app";
}

const API_BASE = getApiBaseUrl();

/**
 * Feature1 Ping API 호출
 * 
 * @returns {Promise<PingResponse>} API 응답 데이터
 * @throws {Feature1ApiError} API 호출 실패 시
 * 
 * @example
 * ```typescript
 * try {
 *   const response = await pingFeature1();
 *   console.log('Success:', response);
 * } catch (error) {
 *   if (error instanceof Feature1ApiError) {
 *     console.error('API Error:', error.status, error.message);
 *   }
 * }
 * ```
 */
export async function pingFeature1(): Promise<PingResponse> {
  const scope = "Feature1";
  // ULID는 시간 정보를 포함하므로 정렬에 유리함
  const requestId = ulid();
  const startedAt = performance.now();
  const url = `${API_BASE}/api/v1/feature1/ping`;
  const timestamp = new Date().toISOString();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-ID': requestId, // 요청 추적을 위한 ULID 헤더 추가
  };

  // 기존 로거 (Feature1 전용)
  logger.info(scope, "REQUEST_START", { requestId, url });

  // API 로거 (공통)
  logApiRequest({
    url,
    method: 'GET',
    headers,
    timestamp,
    requestId,
  });

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      // Next.js에서 fetch 캐싱 제어 (필요시)
      // cache: 'no-store',
    });

    const duration = Math.round(performance.now() - startedAt);
    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // HTTP 에러 상태 체크
    if (!res.ok) {
      let errorData: unknown;
      try {
        errorData = await res.json();
      } catch {
        errorData = await res.text();
      }

      // 기존 로거 (Feature1 전용)
      logger.error(scope, "REQUEST_FAIL", { 
        requestId, 
        status: res.status, 
        statusText: res.statusText,
        tookMs: duration,
        errorData 
      });

      // API 로거 (공통)
      logApiResponse({
        url,
        method: 'GET',
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: errorData,
        timestamp: new Date().toISOString(),
        requestId,
        duration,
      });

      throw new Feature1ApiError(
        `API request failed: ${res.status} ${res.statusText}`,
        res.status,
        errorData
      );
    }

    const data = await res.json() as PingResponse;

    // 기존 로거 (Feature1 전용)
    logger.info(scope, "REQUEST_SUCCESS", { requestId, tookMs: duration });

    // API 로거 (공통)
    logApiResponse({
      url,
      method: 'GET',
      status: res.status,
      statusText: res.statusText,
      headers: responseHeaders,
      body: data,
      timestamp: new Date().toISOString(),
      requestId,
      duration,
    });

    return data;
  } catch (error) {
    const duration = Math.round(performance.now() - startedAt);

    // 네트워크 에러 또는 기타 에러 처리
    if (error instanceof Feature1ApiError) {
      // 기존 로거 (Feature1 전용)
      logger.error(scope, "REQUEST_ERROR", { 
        requestId, 
        tookMs: duration, 
        message: error.message,
        status: error.status,
        response: error.response
      });

      // API 로거 (공통)
      logApiError({
        url,
        method: 'GET',
        error,
        timestamp: new Date().toISOString(),
        requestId,
        duration,
      });

      throw error;
    }

    // 네트워크 에러 등 기타 에러
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // 기존 로거 (Feature1 전용)
    logger.error(scope, "REQUEST_ERROR", { 
      requestId, 
      tookMs: duration, 
      message: errorMessage,
      error: error
    });

    // API 로거 (공통)
    logApiError({
      url,
      method: 'GET',
      error,
      timestamp: new Date().toISOString(),
      requestId,
      duration,
    });

    throw new Feature1ApiError(
      `Network error: ${errorMessage}`,
      undefined,
      error
    );
  }
}

