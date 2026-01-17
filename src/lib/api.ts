/**
 * API 설정
 * 
 * 백엔드 서버 주소와 기본 경로를 설정합니다.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://port-0-clocan-mkhvtt3s93200f2b.sel3.cloudtype.app";

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
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API 호출 실패: ${res.status} ${res.statusText}`);
  }

  return res.json();
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
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API 호출 실패: ${res.status} ${res.statusText}`);
  }

  return res.json();
}