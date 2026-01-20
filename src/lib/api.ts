/**
 * API 설정
 * 
 * 백엔드 서버 주소와 기본 경로를 설정합니다.
 * 
 * 환경 변수가 없으면:
 * - 로컬 개발 환경(localhost)에서는 http://localhost:8080 사용
 * - 프로덕션 환경에서는 Cloud Type 배포 URL 사용
 */

import { apiTracking } from './analytics';

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

export const API_BASE_URL = getApiBaseUrl();

export const API_BASE_PATH = "/api/v1";

/**
 * 전체 API URL 생성
 * 
 * @param endpoint - API 엔드포인트 (예: "/feature1/ping")
 * @returns 전체 URL (예: "https://.../api/v1/feature1/ping")
 * 
 * @example
 * ```ts
 * const url = getApiUrl("/feature1/ping");
 * // "https://port-0-clocan.../api/v1/feature1/ping"
 * ```
 */
export function getApiUrl(endpoint: string): string {
  // endpoint가 이미 /로 시작하지 않으면 추가
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${API_BASE_PATH}${path}`;
}

/**
 * 간단한 API 호출 함수 (GET)
 * 
 * @param endpoint - API 엔드포인트
 * @returns JSON 응답 데이터
 * 
 * @example
 * ```ts
 * const data = await apiGet("/feature1/ping");
 * console.log(data);
 * ```
 */
export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const url = getApiUrl(endpoint);
  const startedAt = performance.now();

  // API 호출 시작 추적
  apiTracking.trackStart(endpoint, 'GET');

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const duration = Math.round(performance.now() - startedAt);

    if (!res.ok) {
      // API 에러 추적
      apiTracking.trackError(endpoint, 'GET', res.status, 'http', duration);
      throw new Error(`API 호출 실패: ${res.status} ${res.statusText}`);
    }

    // API 성공 추적
    apiTracking.trackSuccess(endpoint, 'GET', res.status, duration);

    return res.json();
  } catch (error) {
    const duration = Math.round(performance.now() - startedAt);
    
    // 네트워크 에러 추적
    if (error instanceof Error && error.message.includes('fetch')) {
      apiTracking.trackError(endpoint, 'GET', undefined, 'network', duration);
    } else {
      apiTracking.trackError(endpoint, 'GET', undefined, 'unknown', duration);
    }

    throw error;
  }
}

/**
 * 간단한 API 호출 함수 (POST)
 * 
 * @param endpoint - API 엔드포인트
 * @param data - 전송할 데이터
 * @returns JSON 응답 데이터
 * 
 * @example
 * ```ts
 * const data = await apiPost("/auth/login", { email, password });
 * ```
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  data?: unknown
): Promise<T> {
  const url = getApiUrl(endpoint);
  const startedAt = performance.now();

  // API 호출 시작 추적
  apiTracking.trackStart(endpoint, 'POST');

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const duration = Math.round(performance.now() - startedAt);

    if (!res.ok) {
      // API 에러 추적
      apiTracking.trackError(endpoint, 'POST', res.status, 'http', duration);
      throw new Error(`API 호출 실패: ${res.status} ${res.statusText}`);
    }

    // API 성공 추적
    apiTracking.trackSuccess(endpoint, 'POST', res.status, duration);

    return res.json();
  } catch (error) {
    const duration = Math.round(performance.now() - startedAt);
    
    // 네트워크 에러 추적
    if (error instanceof Error && error.message.includes('fetch')) {
      apiTracking.trackError(endpoint, 'POST', undefined, 'network', duration);
    } else {
      apiTracking.trackError(endpoint, 'POST', undefined, 'unknown', duration);
    }

    throw error;
  }
}