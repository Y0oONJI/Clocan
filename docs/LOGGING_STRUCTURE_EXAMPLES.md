# 로깅 구조 및 데이터 예시

> **작성일:** 2025-01-XX  
> **최종 업데이트:** 2025-01-XX  
> **프로젝트:** Clocan (Closet Canvas)

---

## 📋 목차

1. [개요](#개요)
2. [프론트엔드-백엔드 연동 상태 표](#프론트엔드-백엔드-연동-상태-표)
3. [프론트엔드 로깅 구조](#프론트엔드-로깅-구조)
4. [백엔드 로깅 구조](#백엔드-로깅-구조)
5. [실제 로그 출력 예시](#실제-로그-출력-예시)
6. [데이터 구조 상세](#데이터-구조-상세)
7. [로그 파일 관리](#로그-파일-관리)
8. [로그 분석 및 활용](#로그-분석-및-활용)

---

## 개요

이 문서는 Clocan 프로젝트의 프론트엔드와 백엔드 로깅 시스템의 구조, 데이터 형식, 그리고 실제 사용 예시를 정리합니다.

### 로깅 시스템 구성

- **프론트엔드**: 브라우저 콘솔 로깅 (`src/lib/logger.ts`)
- **백엔드**: 파일 로깅 (Spring Boot 기본 Logback)
- **Google Analytics**: 이벤트 추적 (`src/lib/analytics.ts`)
- **로그 분석**: 백엔드 로그 파싱 및 집계 (`LogParser.java`, `AnalyticsService.java`)

---

## 프론트엔드-백엔드 연동 상태 표

이 표는 현재 프로젝트에서 프론트엔드와 백엔드 간의 API 연동 상태를 정리하며, 각 API 호출의 성공/실패 시 동작을 포함합니다.

### 분석 기준

- **O**: 실제 코드에서 백엔드 API 호출 구현됨
- **X**: 구현되지 않음
- **Mock**: 모의(Mock) 데이터 또는 시뮬레이션으로 구현됨

| # | 프론트엔드 페이지명 및 설명 | 백엔드 API 엔드포인트 URL 및 용도 | 호출 조건 | 구현 여부 | API 요청 데이터 (Request Body) | API 응답 데이터 (Response Body) | 성공 시 동작/이동 페이지 | 실패 시 동작/이동 페이지 |
|---|---------------------------|--------------------------------|----------|----------|------------------------------|-------------------------------|----------------------|----------------------|
| 1 | **랜딩 페이지** (`/`)<br>메인 홈페이지, 서비스 소개 및 CTA | `GET /api/v1/feature1/ping`<br>Feature1 테스트 API (선택적 호출) | "API 테스트" 버튼 클릭 시 | ✅ **O** | 없음 (GET 요청) | ```json<br>{<br>  "ok": true,<br>  "message": "Pong from Feature1",<br>  "data": {<br>    "style": "casual",<br>    "items": []<br>  }<br>}``` | Alert로 메시지 표시<br>`alert(data.message)`<br>Google Analytics 성공 이벤트 추적<br>`apiTracking.trackSuccess()` | Alert로 에러 메시지 표시<br>`alert("API 호출 실패: ...")`<br>콘솔에 에러 로그 출력<br>Google Analytics 에러 이벤트 추적<br>`apiTracking.trackError()` |
| 2 | **랜딩 페이지** (`/`)<br>메인 홈페이지 | 없음<br>(페이지뷰만 추적) | 페이지 로드 시 | ✅ **O** | 없음 | 없음 | 페이지 표시<br>Google Analytics 페이지뷰 추적<br>`trackPageView('/')` | - |
| 3 | **스타일 퀴즈 페이지** (`/style-quiz`)<br>5단계 스타일 선호도 퀴즈 | 없음<br>(프론트엔드에서만 처리) | 페이지 로드 시 | ✅ **O** | 없음 | 없음 | 퀴즈 UI 표시<br>Google Analytics 페이지뷰 추적<br>`trackPageView('/style-quiz')`<br>퀴즈 시작 이벤트 추적<br>`quizTracking.trackStart()` | - |
| 4 | **스타일 퀴즈 완료** (`/style-quiz`)<br>퀴즈 완료 후 결과 페이지로 이동 | 없음<br>(URL 파라미터로 데이터 전달) | "Finish" 버튼 클릭 시 | ✅ **O** | 없음 (URL 파라미터 사용)<br>`?styles=...&colors=...&inspirations=...` | 없음 | `/style-quiz/result` 페이지로 이동<br>(URL 파라미터 포함)<br>Google Analytics 퀴즈 완료 이벤트 추적<br>`quizTracking.trackComplete()` | 유효성 검사 실패 시<br>에러 메시지 표시<br>이전 단계로 이동 불가 |
| 5 | **스타일 분석 결과 페이지** (`/style-quiz/result`)<br>AI 스타일 분석 결과 표시 | `GET /api/v1/health/ping`<br>서버 연결 상태 확인 (HealthCheck) | 페이지 로드 시<br>(useEffect) | ✅ **O** | 없음 (GET 요청) | `"pong"` (문자열) | "서버 연결됨" 메시지 표시<br>Google Analytics 성공 이벤트 추적 | "서버 연결 실패" 메시지 표시<br>Google Analytics 에러 이벤트 추적<br>콘솔에 에러 로그 출력 |
| 6 | **스타일 분석 결과 페이지** (`/style-quiz/result`)<br>AI 스타일 분석 결과 표시 | 없음 (현재 Mock)<br>향후: `POST /api/v1/style-quiz/analyze` 또는<br>`POST /api/v1/recommend` | 페이지 로드 시<br>(useEffect) | ⚠️ **Mock** | 없음 (현재)<br>향후 예상:<br>```json<br>{<br>  "styles": ["modern", "minimalist"],<br>  "colors": ["neutrals", "pastels"],<br>  "inspirations": ["insp1", "insp2"]<br>}``` | Mock 데이터 (현재)<br>```json<br>{<br>  "result": "Based on your selections..."<br>}```<br>향후 예상:<br>```json<br>{<br>  "analysis": "...",<br>  "recommendations": [...]<br>}``` | 분석 결과 텍스트 표시<br>선택 항목 요약 표시<br>Google Analytics 결과 생성 이벤트 추적<br>`trackEvent('result_generated')` | 에러 메시지 표시<br>재시도 버튼 표시 (최대 3회)<br>퀴즈 다시 하기 버튼 표시<br>홈으로 이동 버튼 표시<br>Google Analytics 예외 추적<br>`trackException(error)` |
| 7 | **어드민 분석 대시보드** (`/admin/analytics`)<br>백엔드 로그 기반 통계 대시보드 | `GET /api/v1/admin/analytics/landing-page-views`<br>랜딩 페이지 접속 수 시간대별 집계 | 페이지 로드 시<br>(AnalyticsCard 컴포넌트) | ✅ **O** | 없음 (GET 요청) | ```json<br>[<br>  { "hour": 0, "count": 5 },<br>  { "hour": 1, "count": 3 },<br>  ...<br>  { "hour": 23, "count": 8 }<br>]``` | 표와 그래프로 데이터 표시<br>로딩 상태 해제<br>Google Analytics 성공 이벤트 추적 | 에러 메시지 표시<br>`<p>오류: {error}</p>`<br>로딩 상태 해제<br>더미 데이터 표시 (fallback)<br>Google Analytics 에러 이벤트 추적 |
| 8 | **어드민 분석 대시보드** (`/admin/analytics`)<br>백엔드 로그 기반 통계 대시보드 | `GET /api/v1/admin/analytics/quiz-completions`<br>스타일 퀴즈 완료 수 시간대별 집계 | 페이지 로드 시<br>(AnalyticsCard 컴포넌트) | ✅ **O** | 없음 (GET 요청) | ```json<br>[<br>  { "hour": 0, "count": 2 },<br>  { "hour": 1, "count": 1 },<br>  ...<br>  { "hour": 23, "count": 5 }<br>]``` | 표와 그래프로 데이터 표시<br>로딩 상태 해제<br>Google Analytics 성공 이벤트 추적 | 에러 메시지 표시<br>로딩 상태 해제<br>더미 데이터 표시 (fallback)<br>Google Analytics 에러 이벤트 추적 |
| 9 | **어드민 분석 대시보드** (`/admin/analytics`)<br>백엔드 로그 기반 통계 대시보드 | `GET /api/v1/admin/analytics/analysis-completions`<br>AI 스타일 분석 완료 수 시간대별 집계 | 페이지 로드 시<br>(AnalyticsCard 컴포넌트) | ✅ **O** | 없음 (GET 요청) | ```json<br>[<br>  { "hour": 0, "count": 1 },<br>  { "hour": 1, "count": 0 },<br>  ...<br>  { "hour": 23, "count": 3 }<br>]``` | 표와 그래프로 데이터 표시<br>로딩 상태 해제<br>Google Analytics 성공 이벤트 추적 | 에러 메시지 표시<br>로딩 상태 해제<br>더미 데이터 표시 (fallback)<br>Google Analytics 에러 이벤트 추적 |
| 10 | **추천 페이지** (`/recommend`)<br>의류 추천 페이지 (현재 미구현) | 없음<br>향후: `POST /api/v1/recommend` | 페이지 로드 시 | ❌ **X** | 없음 | 없음 | - | - |

### 연동 상태 상세 설명

#### 1. 랜딩 페이지 (`/`) - Feature1 Ping API

**파일**: `src/app/page.tsx`, `src/api/feature1.ts`

**성공 시 동작**:
- `alert()`로 응답 메시지 표시 (`data.message`)
- Google Analytics 성공 이벤트 추적 (`apiTracking.trackSuccess()`)
- 콘솔에 성공 로그 출력

**실패 시 동작**:
- `alert()`로 에러 메시지 표시 (`"API 호출 실패: ..."`)
- 콘솔에 에러 로그 출력 (`console.error`)
- Google Analytics 에러 이벤트 추적 (`apiTracking.trackError()`)
- 에러 타입: `network` (네트워크 에러인 경우)

**로그 예시**:
```typescript
// 성공 시
apiTracking.trackSuccess('/api/v1/feature1/ping', 'GET', 200, 245);

// 실패 시
apiTracking.trackError('/api/v1/feature1/ping', 'GET', undefined, 'network', 5000);
console.error("[FE] error:", error);
```

#### 2. 랜딩 페이지 (`/`) - 페이지뷰 추적

**파일**: `src/app/page.tsx`

**성공 시 동작**:
- 페이지 정상 표시
- Google Analytics 페이지뷰 추적 (`trackPageView('/')`)

**실패 시 동작**:
- 없음 (페이지뷰는 항상 성공)

#### 3. 스타일 퀴즈 페이지 (`/style-quiz`)

**파일**: `src/app/style-quiz/page.tsx`, `src/components/style-quiz.tsx`

**성공 시 동작**:
- 퀴즈 UI 표시
- Google Analytics 페이지뷰 추적 (`trackPageView('/style-quiz')`)
- 퀴즈 시작 이벤트 추적 (`quizTracking.trackStart()`)

**실패 시 동작**:
- 없음 (프론트엔드만 처리)

#### 4. 스타일 퀴즈 완료

**파일**: `src/components/style-quiz.tsx`

**성공 시 동작**:
- `/style-quiz/result` 페이지로 이동 (URL 파라미터 포함)
- Google Analytics 퀴즈 완료 이벤트 추적 (`quizTracking.trackComplete()`)
- 사용자 속성 업데이트 (`setUserProperties()`)

**실패 시 동작**:
- 유효성 검사 실패 시 에러 메시지 표시
- 이전 단계로 이동 불가

#### 5. 스타일 분석 결과 페이지 - Health Check

**파일**: `src/app/style-quiz/result/page.tsx`

**성공 시 동작**:
- "서버 연결됨" 메시지 표시
- Google Analytics 성공 이벤트 추적

**실패 시 동작**:
- "서버 연결 실패" 메시지 표시
- Google Analytics 에러 이벤트 추적
- 콘솔에 에러 로그 출력

#### 6. 스타일 분석 결과 페이지 - AI 분석 (Mock)

**파일**: `src/app/style-quiz/result/ResultClient.tsx`

**성공 시 동작**:
- 분석 결과 텍스트 표시
- 선택 항목 요약 표시
- Google Analytics 결과 생성 이벤트 추적 (`trackEvent('result_generated')`)

**실패 시 동작**:
- 에러 메시지 표시 (`<AlertCircle>` 아이콘과 함께)
- 재시도 버튼 표시 (최대 3회 재시도)
- "퀴즈 다시 하기" 버튼 표시 (`/style-quiz`로 이동)
- "홈으로 이동" 버튼 표시 (`/`로 이동)
- Google Analytics 예외 추적 (`trackException(error)`)

**에러 처리 로직**:
```typescript
// 타임아웃: 10초
// 최대 재시도: 3회
// 에러 타입: 'network' | 'timeout' | 'api' | 'unknown'
```

#### 7-9. 어드민 분석 대시보드

**파일**: `src/app/admin/analytics/page.tsx`, `src/components/admin/AnalyticsCard.tsx`

**성공 시 동작**:
- 표와 그래프로 시간대별 데이터 표시
- 로딩 상태 해제 (`setLoading(false)`)
- Google Analytics 성공 이벤트 추적

**실패 시 동작**:
- 에러 메시지 표시 (`<p>오류: {error}</p>`)
- 로딩 상태 해제
- 더미 데이터 표시 (fallback - `AnalyticsService.generateDummyData()`)
- Google Analytics 에러 이벤트 추적

**Fallback 동작**:
- 로그 파일이 없거나 읽기 실패 시 더미 데이터 자동 생성
- 시간대별 트래픽 패턴 반영 (오전/오후 피크 시간대)

---

## 프론트엔드 로깅 구조

### 파일 구조

```
src/
├── lib/
│   ├── logger.ts          # 기본 로깅 유틸리티
│   ├── api.ts             # API 호출 (Google Analytics 연동)
│   └── analytics.ts       # Google Analytics 추적
└── app/
    └── ...                # 페이지 컴포넌트들
```

### logger.ts 구조

**파일 위치**: `src/lib/logger.ts`

```typescript
// src/lib/logger.ts

type Level = "info" | "error";

function time() {
  return new Date().toISOString();
}

/**
 * 에러 객체를 안전하게 직렬화
 */
function serializeError(error: any): any {
  if (!error) return error;
  
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  
  // 순환 참조 방지 처리
  const seen = new WeakSet();
  try {
    return JSON.parse(JSON.stringify(error, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    }, 2));
  } catch {
    return String(error);
  }
}

/**
 * 메타데이터를 안전하게 처리
 */
function safeSerializeMeta(meta?: any): any {
  if (meta === undefined || meta === null) {
    return undefined;
  }
  
  if (typeof meta === 'object' && Object.keys(meta).length === 0) {
    return undefined;
  }
  
  if (meta.error) {
    const { error, ...rest } = meta;
    return {
      ...rest,
      error: serializeError(error),
    };
  }
  
  return meta;
}

function print(level: Level, scope: string, event: string, meta?: any) {
  const prefix = `[${time()}][FE][${level.toUpperCase()}][${scope}] ${event}`;
  const safeMeta = safeSerializeMeta(meta);
  
  if (safeMeta !== undefined) {
    console[level === "info" ? "log" : "error"](prefix, safeMeta);
  } else {
    console[level === "info" ? "log" : "error"](prefix);
  }
}

export const logger = {
  info: (scope: string, event: string, meta?: any) => 
    print("info", scope, event, meta),
  error: (scope: string, event: string, meta?: any) => 
    print("error", scope, event, meta),
};
```

### 사용 예시

**파일 위치**: `src/lib/api.ts`

```typescript
// src/lib/api.ts

import { apiTracking } from './analytics';

export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const url = getApiUrl(endpoint);
  const startedAt = performance.now();

  // API 호출 시작 추적 (Google Analytics)
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
```

### Google Analytics 추적

**파일 위치**: `src/lib/analytics.ts`

```typescript
// src/lib/analytics.ts

/**
 * API 호출 추적 헬퍼
 */
export const apiTracking = {
  trackStart: (endpoint: string, method: string) => {
    trackEvent('api_request_start', { endpoint, method });
  },
  
  trackSuccess: (endpoint: string, method: string, status: number, durationMs: number) => {
    trackEvent('api_request_success', {
      endpoint,
      method,
      status,
      duration_ms: durationMs,
    });
  },
  
  trackError: (endpoint: string, method: string, status: number | undefined, errorType: string, durationMs: number) => {
    trackEvent('api_request_error', {
      endpoint,
      method,
      status: status || 0,
      error_type: errorType,
      duration_ms: durationMs,
    });
  },
};
```

---

## 백엔드 로깅 구조

### 파일 구조

```
backend/src/main/java/com/example/wardrobe/
├── common/
│   └── logging/
│       └── LogParser.java          # 로그 파싱 유틸리티
└── service/
    └── AnalyticsService.java       # 로그 분석 서비스
```

### LogParser.java 구조

**파일 위치**: `backend/src/main/java/com/example/wardrobe/common/logging/LogParser.java`

```java
package com.example.wardrobe.common.logging;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 로그 파서 클래스
 * 
 * 정규표현식을 사용하여 로그 한 줄을 파싱하여 구조화된 데이터를 추출합니다.
 */
public class LogParser {
    
    /**
     * 백엔드 로그 패턴
     * 
     * 예시: "2025-01-20 15:30:45.123 INFO  [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.controller.Feature1Controller : GET /api/v1/feature1/ping | RequestId: 01AN4Z07BY79K3"
     * 
     * 참고: 실제 로그는 Spring Boot 기본 Logback 로거를 사용하며, 컨트롤러나 서비스 클래스에서 직접 로깅합니다.
     */
    private static final Pattern BACKEND_LOG_PATTERN = Pattern.compile(
        "^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}) " +  // Group 1: timestamp
        "(INFO|DEBUG|ERROR|WARN) " +                                 // Group 2: level
        "\\[([A-Z0-9]{26})\\] " +                                    // Group 3: requestId (ULID 26자)
        ".*?API Request: (GET|POST|PUT|DELETE|PATCH) " +            // Group 4: method
        "([^|\\s]+)" +                                                // Group 5: apiPath
        ".*?RequestId: ([A-Z0-9]{26})"                                // Group 6: requestId 확인
    );
    
    /**
     * 프론트엔드 로그 패턴 (백엔드로 전송된 경우)
     */
    private static final Pattern FRONTEND_LOG_PATTERN = Pattern.compile(
        "\\[([^]]+)\\]" +                                             // Group 1: timestamp
        "\\[FE\\]" +
        "\\[([^]]+)\\]" +                                             // Group 2: level
        "\\[([^]]+)\\]" +                                             // Group 3: scope
        " ([A-Z_]+)" +                                                // Group 4: event
        ".*?\"requestId\"[:\"\\s]+([A-Za-z0-9-]+)" +                 // Group 5: requestId
        ".*?\"url\"[:\"\\s]+([^\\s}]+)"                              // Group 6: url
    );
    
    /**
     * 파싱된 로그 데이터를 담는 클래스
     */
    public static class ParsedLog {
        private String requestId;
        private LocalDateTime timestamp;
        private String method;
        private String apiPath;
        private String referer;
        private String logType; // "backend" | "frontend"
        private String event;   // "page_view", "quiz_complete", "result_generated" 등
        
        // Getters and Setters...
    }
    
    /**
     * 로그 한 줄을 파싱
     */
    public static ParsedLog parse(String logLine) {
        // 백엔드 로그 패턴 매칭 시도
        Matcher backendMatcher = BACKEND_LOG_PATTERN.matcher(logLine);
        if (backendMatcher.matches()) {
            return parseBackendLog(backendMatcher, logLine);
        }
        
        // 프론트엔드 로그 패턴 매칭 시도
        Matcher frontendMatcher = FRONTEND_LOG_PATTERN.matcher(logLine);
        if (frontendMatcher.find()) {
            return parseFrontendLog(frontendMatcher, logLine);
        }
        
        return null; // 파싱 실패
    }
    
    /**
     * 랜딩 페이지 접속 로그인지 확인
     */
    public static boolean isLandingPageAccess(ParsedLog log) {
        // 프론트엔드 로그: page_view 이벤트이고 경로가 "/"
        if ("frontend".equals(log.getLogType()) && "page_view".equals(log.getEvent())) {
            return "/".equals(log.getApiPath()) || "/".equals(log.getReferer());
        }
        
        // 백엔드 로그: API 경로가 "/" 또는 랜딩 페이지 관련
        if ("backend".equals(log.getLogType())) {
            return "/".equals(log.getApiPath()) || log.getApiPath().contains("landing");
        }
        
        return false;
    }
    
    /**
     * 퀴즈 완료 로그인지 확인
     */
    public static boolean isQuizComplete(ParsedLog log) {
        // 프론트엔드 로그: quiz_complete 이벤트
        if ("frontend".equals(log.getLogType()) && "quiz_complete".equals(log.getEvent())) {
            return true;
        }
        
        // 백엔드 로그: API 경로에 quiz/complete 포함
        if ("backend".equals(log.getLogType())) {
            return log.getApiPath().contains("quiz") && 
                   (log.getApiPath().contains("complete") || log.getApiPath().contains("result"));
        }
        
        return false;
    }
    
    /**
     * AI 분석 완료 로그인지 확인
     */
    public static boolean isAnalysisComplete(ParsedLog log) {
        // 프론트엔드 로그: result_generated 이벤트
        if ("frontend".equals(log.getLogType()) && "result_generated".equals(log.getEvent())) {
            return true;
        }
        
        // 백엔드 로그: API 경로에 result/analysis 포함
        if ("backend".equals(log.getLogType())) {
            return log.getApiPath().contains("result") || log.getApiPath().contains("analysis");
        }
        
        return false;
    }
}
```

### AnalyticsService.java 구조

**파일 위치**: `backend/src/main/java/com/example/wardrobe/service/AnalyticsService.java`

```java
package com.example.wardrobe.service;

import com.example.wardrobe.common.logging.LogParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * 분석 서비스
 * 
 * 로그 파일을 읽어서 시간대별 집계를 수행합니다.
 * 로그 파일이 없거나 읽기 실패 시 더미 데이터를 반환합니다.
 */
@Service
@Slf4j
public class AnalyticsService {
    
    @Value("${analytics.log.path:./logs/application.log}")
    private String logFilePath;
    
    @Value("${analytics.log.api.path:./logs/api-requests.log}")
    private String apiLogFilePath;
    
    /**
     * 랜딩 페이지 접속 수 시간대별 집계
     */
    public List<HourlyAnalytics> getLandingPageViews() {
        try {
            List<String> logLines = readLogFiles();
            if (logLines.isEmpty()) {
                log.warn("No log files found, returning dummy data for landing page views");
                return generateDummyData("landing");
            }
            
            List<LogParser.ParsedLog> parsedLogs = logLines.stream()
                .map(LogParser::parse)
                .filter(Objects::nonNull)
                .filter(LogParser::isLandingPageAccess)
                .collect(Collectors.toList());
            
            return aggregateByHour(parsedLogs);
        } catch (Exception e) {
            log.error("Failed to get landing page views: {}", e.getMessage(), e);
            return generateDummyData("landing");
        }
    }
    
    /**
     * 스타일 퀴즈 완료 수 시간대별 집계
     */
    public List<HourlyAnalytics> getQuizCompletions() {
        // 동일한 패턴으로 구현...
    }
    
    /**
     * AI 분석 완료 수 시간대별 집계
     */
    public List<HourlyAnalytics> getAnalysisCompletions() {
        // 동일한 패턴으로 구현...
    }
    
    /**
     * 로그 파일 읽기
     */
    private List<String> readLogFiles() {
        List<String> allLines = new ArrayList<>();
        
        // application.log 읽기 시도
        try {
            Path logPath = Paths.get(logFilePath);
            if (Files.exists(logPath)) {
                List<String> lines = Files.readAllLines(logPath);
                allLines.addAll(lines);
            }
        } catch (IOException e) {
            log.warn("Failed to read log file {}: {}", logFilePath, e.getMessage());
        }
        
        // api-requests.log 읽기 시도
        try {
            Path apiLogPath = Paths.get(apiLogFilePath);
            if (Files.exists(apiLogPath)) {
                List<String> lines = Files.readAllLines(apiLogPath);
                allLines.addAll(lines);
            }
        } catch (IOException e) {
            log.warn("Failed to read API log file {}: {}", apiLogFilePath, e.getMessage());
        }
        
        return allLines;
    }
    
    /**
     * 시간대별로 집계
     */
    private List<HourlyAnalytics> aggregateByHour(List<LogParser.ParsedLog> parsedLogs) {
        // 시간대별 카운트 맵 초기화 (0-23시)
        Map<Integer, Long> hourCountMap = new HashMap<>();
        for (int hour = 0; hour < 24; hour++) {
            hourCountMap.put(hour, 0L);
        }
        
        // 로그를 시간대별로 집계
        for (LogParser.ParsedLog log : parsedLogs) {
            if (log.getTimestamp() != null) {
                int hour = log.getTimestamp().getHour();
                hourCountMap.put(hour, hourCountMap.get(hour) + 1);
            }
        }
        
        // 시간대별 데이터 리스트 생성 (0시부터 23시까지 순서대로)
        return IntStream.range(0, 24)
            .mapToObj(hour -> new HourlyAnalytics(hour, hourCountMap.get(hour)))
            .collect(Collectors.toList());
    }
    
    /**
     * 더미 데이터 생성
     */
    private List<HourlyAnalytics> generateDummyData(String type) {
        // 타입별 기본 카운트 범위 설정
        // 오전 시간대(9-12시)와 오후 시간대(14-18시)에 더 많은 트래픽
        // 새벽 시간대(1-6시)에는 적은 트래픽
        // ...
    }
}
```

---

## 실제 로그 출력 예시

### 프론트엔드 로그 (브라우저 콘솔)

#### 1. API 호출 성공 로그

```javascript
// 콘솔 출력 (성공)
[2025-01-20T15:30:45.123Z][FE][INFO][Feature1] REQUEST_START {
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  url: "https://api.example.com/api/v1/feature1/ping"
}

// Google Analytics 이벤트 (성공)
gtag('event', 'api_request_success', {
  endpoint: '/api/v1/feature1/ping',
  method: 'GET',
  status: 200,
  duration_ms: 245
});

// 콘솔 출력 (성공 완료)
[2025-01-20T15:30:45.368Z][FE][INFO][Feature1] REQUEST_SUCCESS {
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  tookMs: 245
}
```

#### 2. API 호출 실패 로그 (HTTP 에러)

```javascript
// 콘솔 출력 (HTTP 에러)
[2025-01-20T15:30:45.123Z][FE][INFO][Feature1] REQUEST_START {
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  url: "https://api.example.com/api/v1/feature1/ping"
}

// Google Analytics 이벤트 (HTTP 에러)
gtag('event', 'api_request_error', {
  endpoint: '/api/v1/feature1/ping',
  method: 'GET',
  status: 500,
  error_type: 'http',
  duration_ms: 123
});

// 콘솔 출력 (HTTP 에러)
[2025-01-20T15:30:45.246Z][FE][ERROR][Feature1] REQUEST_ERROR {
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  error: {
    name: "Error",
    message: "API 호출 실패: 500 Internal Server Error",
    stack: "Error: API 호출 실패: 500 Internal Server Error\n    at ..."
  },
  tookMs: 123
}
```

#### 3. API 호출 실패 로그 (네트워크 에러)

```javascript
// 콘솔 출력 (네트워크 에러)
[2025-01-20T15:30:45.123Z][FE][INFO][Feature1] REQUEST_START {
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  url: "https://api.example.com/api/v1/feature1/ping"
}

// Google Analytics 이벤트 (네트워크 에러)
gtag('event', 'api_request_error', {
  endpoint: '/api/v1/feature1/ping',
  method: 'GET',
  status: 0,
  error_type: 'network',
  duration_ms: 5000
});

// 콘솔 출력 (네트워크 에러)
[2025-01-20T15:30:50.123Z][FE][ERROR][Feature1] REQUEST_ERROR {
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  error: {
    name: "TypeError",
    message: "Failed to fetch",
    stack: "TypeError: Failed to fetch\n    at ..."
  },
  tookMs: 5000
}

// Google Analytics 예외 추적
gtag('event', 'exception', {
  description: 'Failed to fetch',
  fatal: false
});
```

#### 4. 퀴즈 완료 로그

```javascript
// 콘솔 출력 (퀴즈 완료)
[2025-01-20T15:35:12.456Z][FE][INFO][Quiz] QUIZ_COMPLETE {
  styles: ["modern", "minimalist"],
  colors: ["neutrals", "pastels"],
  inspirations_count: 3,
  duration_seconds: 180
}

// Google Analytics 이벤트 (퀴즈 완료)
gtag('event', 'quiz_complete', {
  total_steps: 5,
  styles_selected: ["modern", "minimalist"],
  colors_selected: ["neutrals", "pastels"],
  inspirations_selected: ["insp1", "insp2", "insp3"],
  duration_seconds: 180
});

// 사용자 속성 업데이트
gtag('set', 'user_properties', {
  quiz_completed: true,
  preferred_style: "modern",
  preferred_colors: "neutrals"
});
```

#### 5. AI 분석 결과 생성 로그

```javascript
// 콘솔 출력 (결과 생성 성공)
[2025-01-20T15:36:45.789Z][FE][INFO][Result] RESULT_GENERATED {
  styles: ["modern", "minimalist"],
  colors: ["neutrals", "pastels"],
  result_length: 250
}

// Google Analytics 이벤트 (결과 생성)
gtag('event', 'result_generated', {
  styles: ["modern", "minimalist"],
  colors: ["neutrals", "pastels"],
  inspirations_count: 3
});
```

#### 6. AI 분석 실패 로그 (타임아웃)

```javascript
// 콘솔 출력 (타임아웃 에러)
[2025-01-20T15:36:45.789Z][FE][ERROR][Result] ANALYSIS_ERROR {
  error: {
    name: "Error",
    message: "Timeout",
    type: "timeout"
  },
  retry_count: 2,
  max_retries: 3
}

// Google Analytics 예외 추적
gtag('event', 'exception', {
  description: 'Timeout',
  fatal: false
});
```

### 백엔드 로그 (로그 파일)

#### 1. API 호출 성공 로그 (application.log)

```
2025-01-20 15:30:45.123 INFO  [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.controller.Feature1Controller : GET /api/v1/feature1/ping
2025-01-20 15:30:45.234 INFO  [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.controller.Feature1Controller : Response: 200 OK | Duration: 111ms
```

#### 2. API 호출 실패 로그 (HTTP 500 에러)

```
2025-01-20 15:30:45.123 INFO  [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.controller.Feature1Controller : GET /api/v1/feature1/ping
2025-01-20 15:30:45.456 ERROR [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.controller.Feature1Controller : Exception occurred
java.lang.NullPointerException: null
    at com.example.wardrobe.controller.Feature1Controller.ping(Feature1Controller.java:25)
    at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    ...
2025-01-20 15:30:45.500 ERROR [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.controller.Feature1Controller : Response: 500 Internal Server Error | Duration: 377ms
```

#### 3. 어드민 분석 API 성공 로그

```
2025-01-20 15:40:12.345 INFO  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.controller.AnalyticsController : GET /api/v1/admin/analytics/landing-page-views
2025-01-20 15:40:12.456 INFO  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.service.AnalyticsService : Read 1250 lines from ./logs/application.log
2025-01-20 15:40:12.567 INFO  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.controller.AnalyticsController : Response: 200 OK | Duration: 222ms
```

#### 4. 어드민 분석 API 실패 로그 (로그 파일 없음)

```
2025-01-20 15:40:12.345 INFO  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.controller.AnalyticsController : GET /api/v1/admin/analytics/landing-page-views
2025-01-20 15:40:12.400 WARN  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.service.AnalyticsService : No log files found, returning dummy data for landing page views
2025-01-20 15:40:12.456 INFO  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.controller.AnalyticsController : Response: 200 OK | Duration: 111ms (dummy data)
```

#### 5. 어드민 분석 API 실패 로그 (파일 읽기 실패)

```
2025-01-20 15:40:12.345 INFO  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.controller.AnalyticsController : GET /api/v1/admin/analytics/landing-page-views
2025-01-20 15:40:12.400 WARN  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.service.AnalyticsService : Failed to read log file ./logs/application.log: Permission denied
2025-01-20 15:40:12.456 ERROR [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.service.AnalyticsService : Failed to get landing page views: java.nio.file.AccessDeniedException
2025-01-20 15:40:12.500 WARN  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.service.AnalyticsService : Returning dummy data due to error
2025-01-20 15:40:12.567 INFO  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.controller.AnalyticsController : Response: 200 OK | Duration: 222ms (dummy data fallback)
```

---

## 데이터 구조 상세

### 프론트엔드 로그 데이터 구조

#### 기본 로그 형식

```typescript
{
  timestamp: "2025-01-20T15:30:45.123Z",  // ISO 8601 형식
  level: "INFO" | "ERROR",
  scope: "Feature1",                       // 로그 범위 (컴포넌트/모듈명)
  event: "REQUEST_START" | "REQUEST_SUCCESS" | "REQUEST_ERROR",
  meta?: {
    requestId?: string,
    url?: string,
    tookMs?: number,
    error?: Error,
    // 기타 메타데이터
  }
}
```

#### Google Analytics 이벤트 구조

```typescript
// API 호출 시작
{
  event: "api_request_start",
  endpoint: "/feature1/ping",
  method: "GET"
}

// API 호출 성공
{
  event: "api_request_success",
  endpoint: "/feature1/ping",
  method: "GET",
  status: 200,
  duration_ms: 245
}

// API 호출 실패 (HTTP 에러)
{
  event: "api_request_error",
  endpoint: "/feature1/ping",
  method: "GET",
  status: 500,
  error_type: "http",
  duration_ms: 123
}

// API 호출 실패 (네트워크 에러)
{
  event: "api_request_error",
  endpoint: "/feature1/ping",
  method: "GET",
  status: 0,
  error_type: "network",
  duration_ms: 5000
}

// 예외 추적
{
  event: "exception",
  description: "Failed to fetch",
  fatal: false
}
```

#### 성공 응답 데이터 구조

```typescript
// Feature1 Ping API 성공 응답
{
  ok: true,
  message: "Pong from Feature1",
  data: {
    style: "casual",
    items: []
  }
}

// Health Check API 성공 응답
"pong"  // 문자열

// 어드민 분석 API 성공 응답
[
  { hour: 0, count: 5 },
  { hour: 1, count: 3 },
  ...
  { hour: 23, count: 8 }
]
```

#### 실패 응답 데이터 구조

```typescript
// HTTP 에러 응답 (500)
{
  // 백엔드에서 에러 응답을 반환하는 경우
  error: {
    message: "Internal Server Error",
    code: "INTERNAL_ERROR",
    timestamp: "2025-01-20T15:30:45.456Z"
  }
}

// 네트워크 에러 (응답 없음)
// fetch()가 실패하여 응답을 받지 못함
// Error 객체로 처리:
{
  name: "TypeError",
  message: "Failed to fetch",
  stack: "..."
}

// 타임아웃 에러
{
  name: "Error",
  message: "Timeout",
  type: "timeout"
}
```

### 백엔드 로그 데이터 구조

#### ParsedLog 구조

```java
public static class ParsedLog {
    private String requestId;        // ULID 또는 UUID
    private LocalDateTime timestamp; // 로그 타임스탬프
    private String method;          // HTTP 메서드 (GET, POST, etc.)
    private String apiPath;         // API 경로 (/api/v1/...)
    private String referer;         // 참조 페이지 (프론트엔드 로그의 경우)
    private String logType;         // "backend" | "frontend"
    private String event;           // "page_view", "quiz_complete", "result_generated" 등
}
```

#### 시간대별 집계 데이터 구조

```java
public static class HourlyAnalytics {
    private int hour;      // 0-23
    private long count;   // 해당 시간대의 카운트
}
```

**API 응답 형식**:

```json
[
  { "hour": 0, "count": 5 },
  { "hour": 1, "count": 3 },
  ...
  { "hour": 23, "count": 8 }
]
```

---

## 로그 파일 관리

### 백엔드 로그 파일 구조

```
logs/
├── application.log                    # 현재 활성 로그 파일
├── application.2025-01-20.log        # 날짜별 분리된 로그 파일 (예상)
├── application.2025-01-19.log
├── api-requests.log                   # API 전용 로그 파일 (예상)
└── api-requests.2025-01-20.log         # API 로그 날짜별 분리 (예상)
```

### 로그 파일 경로 설정

**백엔드 설정** (`application.yml`):

```yaml
analytics:
  log:
    path: ./logs/application.log          # 기본 로그 파일 경로
    api:
      path: ./logs/api-requests.log       # API 전용 로그 파일 경로
```

### 로그 파일 관리 정책 (권장)

- **RollingFileAppender**: 사용 권장
- **TimeBasedRollingPolicy**: 매일 자정에 파일 분리
- **MaxHistory**: 30일 (30일 지난 파일 자동 삭제)
- **TotalSizeCap**: 1GB (전체 로그 폴더 크기 제한)

> **참고**: 현재 프로젝트에서는 기본 Logback 설정을 사용하고 있으며, 위 정책은 향후 적용 예정입니다.

---

## 로그 분석 및 활용

### 1. 랜딩 페이지 접속 수 분석

**백엔드 API**: `GET /api/v1/admin/analytics/landing-page-views`

**응답 예시**:

```json
[
  { "hour": 0, "count": 5 },
  { "hour": 1, "count": 3 },
  { "hour": 2, "count": 2 },
  ...
  { "hour": 23, "count": 8 }
]
```

**로그 파싱 로직**:

```java
// LogParser.isLandingPageAccess() 사용
List<LogParser.ParsedLog> parsedLogs = logLines.stream()
    .map(LogParser::parse)
    .filter(Objects::nonNull)
    .filter(LogParser::isLandingPageAccess)
    .collect(Collectors.toList());
```

### 2. 스타일 퀴즈 완료 수 분석

**백엔드 API**: `GET /api/v1/admin/analytics/quiz-completions`

**로그 파싱 로직**:

```java
// LogParser.isQuizComplete() 사용
List<LogParser.ParsedLog> parsedLogs = logLines.stream()
    .map(LogParser::parse)
    .filter(Objects::nonNull)
    .filter(LogParser::isQuizComplete)
    .collect(Collectors.toList());
```

### 3. AI 분석 완료 수 분석

**백엔드 API**: `GET /api/v1/admin/analytics/analysis-completions`

**로그 파싱 로직**:

```java
// LogParser.isAnalysisComplete() 사용
List<LogParser.ParsedLog> parsedLogs = logLines.stream()
    .map(LogParser::parse)
    .filter(Objects::nonNull)
    .filter(LogParser::isAnalysisComplete)
    .collect(Collectors.toList());
```

### 4. 더미 데이터 생성 (Fallback)

로그 파일이 없거나 읽기 실패 시, 타입별 더미 데이터를 생성합니다:

- **랜딩 페이지**: 기본 카운트 50, 분산 30
- **퀴즈 완료**: 기본 카운트 20, 분산 15
- **AI 분석**: 기본 카운트 15, 분산 10

**시간대별 트래픽 패턴**:

- **오전 피크** (9-12시): 기본 카운트 + 분산 * 2 + 20
- **오후 피크** (14-18시): 기본 카운트 + 분산 * 2 + 25
- **저녁 시간** (19-22시): 기본 카운트 + 분산 + 10
- **새벽 시간** (1-6시): 랜덤 1-5
- **일반 시간**: 기본 카운트 + 분산

---

## 요약

### 프론트엔드 로깅

- **파일**: `src/lib/logger.ts`
- **형식**: 구조화된 JSON 로그
- **출력**: 브라우저 콘솔
- **추가 기능**: Google Analytics 이벤트 추적 (`src/lib/analytics.ts`)

### 백엔드 로깅

- **파일**: Spring Boot 기본 Logback 설정 사용
- **형식**: 표준 Logback 로그 형식
- **출력**: 파일 (`./logs/application.log`, `./logs/api-requests.log`)
- **로그 파싱**: `LogParser.java` (정규표현식 기반)
- **로그 분석**: `AnalyticsService.java` (시간대별 집계)

### 공통 특징

- **구조화된 로그**: 파싱 및 분석 용이
- **시간대별 집계**: 0-23시 단위로 데이터 집계
- **더미 데이터 Fallback**: 로그 파일 없을 때 대체 데이터 제공
- **에러 추적**: 상세한 에러 정보 및 스택 트레이스

---

## 참고 문서

- [백엔드-프론트엔드 연동 상태](BE_FE_INTEGRATION_STATUS.md) - 상세한 API 연동 상태 및 구현 현황
- [어드민 분석 대시보드 구현 계획](ADMIN_ANALYTICS_IMPLEMENTATION_PLAN.md) - 어드민 대시보드 구현 계획 및 로그 파싱 상세
- [Google Analytics 가이드](GOOGLE_ANALYTICS_GUIDE.md) - Google Analytics 통합 가이드 및 이벤트 추적 방법

---

## 요약

### 연동 상태 현황

| 구분 | 개수 | 비율 |
|------|------|------|
| **실제 구현됨 (O)** | 6개 | 60.0% |
| **Mock 구현 (Mock)** | 1개 | 10.0% |
| **미구현 (X)** | 3개 | 30.0% |
| **전체** | 10개 | 100% |

### 성공/실패 처리 특징

1. **일관된 에러 처리**: 모든 API 호출에서 동일한 에러 처리 패턴 사용
2. **Google Analytics 통합**: 성공/실패 모든 이벤트 추적
3. **Fallback 메커니즘**: 어드민 분석 API는 로그 파일 없을 때 더미 데이터 제공
4. **재시도 로직**: AI 분석 API는 최대 3회 재시도 지원
5. **사용자 피드백**: 모든 에러 상황에서 명확한 사용자 피드백 제공
