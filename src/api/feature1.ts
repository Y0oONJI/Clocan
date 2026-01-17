/**
 * Feature1 API Client
 * 
 * @fileoverview Feature1 관련 API 호출 함수들
 * 
 * @module api/feature1
 */

import { logger } from "@/lib/logger";

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
 * 환경 변수가 없으면 Cloud Type 배포 URL을 기본값으로 사용합니다.
 */
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://port-0-clocan-mkhvtt3s93200f2b.sel3.cloudtype.app";

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
  const requestId = crypto.randomUUID();
  const startedAt = performance.now();
  const url = `${API_BASE}/api/v1/feature1/ping`;

  logger.info(scope, "REQUEST_START", { requestId, url });

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Next.js에서 fetch 캐싱 제어 (필요시)
      // cache: 'no-store',
    });

    const tookMs = Math.round(performance.now() - startedAt);

    // HTTP 에러 상태 체크
    if (!res.ok) {
      let errorData: unknown;
      try {
        errorData = await res.json();
      } catch {
        errorData = await res.text();
      }

      logger.error(scope, "REQUEST_FAIL", { 
        requestId, 
        status: res.status, 
        statusText: res.statusText,
        tookMs,
        errorData 
      });

      throw new Feature1ApiError(
        `API request failed: ${res.status} ${res.statusText}`,
        res.status,
        errorData
      );
    }

    const data = await res.json() as PingResponse;

    logger.info(scope, "REQUEST_SUCCESS", { requestId, tookMs });

    return data;
  } catch (error) {
    const tookMs = Math.round(performance.now() - startedAt);

    // 네트워크 에러 또는 기타 에러 처리
    if (error instanceof Feature1ApiError) {
      logger.error(scope, "REQUEST_ERROR", { 
        requestId, 
        tookMs, 
        message: error.message,
        status: error.status,
        response: error.response
      });
      throw error;
    }

    // 네트워크 에러 등 기타 에러
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(scope, "REQUEST_ERROR", { 
      requestId, 
      tookMs, 
      message: errorMessage,
      error: error
    });

    throw new Feature1ApiError(
      `Network error: ${errorMessage}`,
      undefined,
      error
    );
  }
}

