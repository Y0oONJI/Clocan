# 로깅 구조 및 데이터 예시

> 작성일: 2025-01-XX  
> 프로젝트: Clocan (Closet Canvas)

---

## 📋 목차

1. [프론트엔드 로깅 구조](#프론트엔드-로깅-구조)
2. [백엔드 로깅 구조](#백엔드-로깅-구조)
3. [실제 로그 출력 예시](#실제-로그-출력-예시)
4. [데이터 구조 상세](#데이터-구조-상세)

---

## 프론트엔드 로깅 구조

### 파일 구조

```
src/
├── lib/
│   └── logger.ts          # 로깅 유틸리티 (핵심)
└── api/
    └── feature1.ts        # API 호출 예시 (logger 사용)
```

### logger.ts 구조

```typescript
// src/lib/logger.ts

/**
 * 로그 레벨 타입
 */
type Level = 'info' | 'warn' | 'error' | 'debug';

/**
 * 로거 인터페이스
 */
interface Logger {
  info(scope: string, event: string, meta?: any): void;
  warn(scope: string, event: string, meta?: any): void;
  error(scope: string, event: string, meta?: any): void;
  debug(scope: string, event: string, meta?: any): void;
}

/**
 * 환경 변수로 로깅 활성화 여부 제어
 */
const isLoggingEnabled = process.env.NEXT_PUBLIC_API_LOGGING === 'true';

/**
 * 로거 구현
 */
export const logger: Logger = {
  info: (scope, event, meta) => {
    if (isLoggingEnabled) {
      print('info', scope, event, meta);
    }
  },
  warn: (scope, event, meta) => {
    if (isLoggingEnabled) {
      print('warn', scope, event, meta);
    }
  },
  error: (scope, event, meta) => {
    if (isLoggingEnabled) {
      print('error', scope, event, meta);
    }
  },
  debug: (scope, event, meta) => {
    if (isLoggingEnabled) {
      print('debug', scope, event, meta);
    }
  },
};
```

### 사용 예시 (feature1.ts)

```typescript
// src/api/feature1.ts

import { logger } from '@/lib/logger';

export async function pingFeature1(): Promise<PingResponse> {
  const scope = "Feature1";
  const requestId = crypto.randomUUID();
  const startedAt = performance.now();
  const url = `${API_BASE}/api/v1/feature1/ping`;

  // 요청 시작 로깅
  logger.info(scope, "REQUEST_START", { 
    requestId, 
    url 
  });

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const tookMs = Math.round(performance.now() - startedAt);

    if (!res.ok) {
      // 에러 로깅
      logger.error(scope, "REQUEST_FAIL", { 
        requestId, 
        status: res.status, 
        statusText: res.statusText,
        tookMs,
        errorData: await res.json()
      });
      throw new Error('API 호출 실패');
    }

    const data = await res.json() as PingResponse;

    // 성공 로깅
    logger.info(scope, "REQUEST_SUCCESS", { 
      requestId, 
      tookMs 
    });

    return data;
  } catch (error) {
    const tookMs = Math.round(performance.now() - startedAt);
    
    // 예외 로깅
    logger.error(scope, "REQUEST_ERROR", { 
      requestId, 
      error: error instanceof Error ? error.message : String(error),
      tookMs 
    });
    
    throw error;
  }
}
```

---

## 백엔드 로깅 구조

### 파일 구조 (예상)

```
backend/src/main/java/com/example/wardrobe/
├── common/
│   └── logging/
│       ├── LoggingFilter.java      # HTTP 요청/응답 필터
│       └── ApiLogger.java          # API 로깅 유틸리티
└── resources/
    └── logback-spring.xml          # 로그 설정 파일
```

### LoggingFilter 구조 (예상)

```java
// backend/src/main/java/com/example/wardrobe/common/logging/LoggingFilter.java

@Component
@RequiredArgsConstructor
public class LoggingFilter extends OncePerRequestFilter {
    
    private final ApiLogger apiLogger;
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        // X-Request-ID 추출 또는 생성
        String requestId = request.getHeader("X-Request-ID");
        if (requestId == null || requestId.isEmpty()) {
            requestId = UlidCreator.getUlid().toString();
        }
        
        // MDC에 requestId 저장 (모든 로그에 자동 포함)
        MDC.put("requestId", requestId);
        
        // 응답 헤더에 추가
        response.setHeader("X-Request-ID", requestId);
        
        long startTime = System.currentTimeMillis();
        
        // 요청/응답 본문을 읽기 위해 래퍼 사용
        ContentCachingRequestWrapper requestWrapper = 
            new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = 
            new ContentCachingResponseWrapper(response);
        
        try {
            // 요청 로깅
            apiLogger.logRequest(requestWrapper, requestId);
            
            // 필터 체인 실행
            filterChain.doFilter(requestWrapper, responseWrapper);
            
            // 응답 로깅
            long duration = System.currentTimeMillis() - startTime;
            apiLogger.logResponse(
                requestWrapper, 
                responseWrapper, 
                requestId, 
                duration
            );
            
        } catch (Exception e) {
            // 에러 로깅
            long duration = System.currentTimeMillis() - startTime;
            apiLogger.logError(requestWrapper, e, requestId, duration);
            throw e;
        } finally {
            // 응답 본문을 클라이언트로 전송
            responseWrapper.copyBodyToResponse();
            
            // MDC 정리
            MDC.clear();
        }
    }
}
```

### ApiLogger 구조 (예상)

```java
// backend/src/main/java/com/example/wardrobe/common/logging/ApiLogger.java

@Component
@Slf4j
public class ApiLogger {
    
    public void logRequest(
        ContentCachingRequestWrapper request, 
        String requestId
    ) {
        try {
            String method = request.getMethod();
            String uri = request.getRequestURI();
            String queryString = request.getQueryString();
            String fullUrl = queryString != null 
                ? uri + "?" + queryString 
                : uri;
            
            // 헤더 정보
            Map<String, String> headers = extractHeaders(request);
            
            // 요청 본문
            String body = getRequestBody(request);
            
            log.info("API Request: {} {} | RequestId: {}", 
                method, fullUrl, requestId);
            log.debug("Request Headers: {} | RequestId: {}", 
                headers, requestId);
            log.debug("Request Body: {} | RequestId: {}", 
                body, requestId);
                
        } catch (Exception e) {
            log.error("Failed to log request: {}", e.getMessage());
        }
    }
    
    public void logResponse(
        ContentCachingRequestWrapper request,
        ContentCachingResponseWrapper response,
        String requestId,
        long duration
    ) {
        try {
            String method = request.getMethod();
            String uri = request.getRequestURI();
            int status = response.getStatus();
            
            // 응답 본문
            String body = getResponseBody(response);
            
            log.info("API Response: {} {} | Status: {} | Duration: {}ms | RequestId: {}", 
                method, uri, status, duration, requestId);
            log.debug("Response Body: {} | RequestId: {}", 
                body, requestId);
                
        } catch (Exception e) {
            log.error("Failed to log response: {}", e.getMessage());
        }
    }
    
    public void logError(
        ContentCachingRequestWrapper request,
        Exception exception,
        String requestId,
        long duration
    ) {
        try {
            String method = request.getMethod();
            String uri = request.getRequestURI();
            
            log.error("API Error: {} {} | Exception: {} | Duration: {}ms | RequestId: {}", 
                method, uri, exception.getClass().getSimpleName(), 
                duration, requestId, exception);
                
        } catch (Exception e) {
            log.error("Failed to log error: {}", e.getMessage());
        }
    }
    
    private String getRequestBody(ContentCachingRequestWrapper request) {
        byte[] content = request.getContentAsByteArray();
        if (content.length > 0) {
            return new String(content, StandardCharsets.UTF_8);
        }
        return "";
    }
    
    private String getResponseBody(ContentCachingResponseWrapper response) {
        byte[] content = response.getContentAsByteArray();
        if (content.length > 0) {
            return new String(content, StandardCharsets.UTF_8);
        }
        return "";
    }
    
    private Map<String, String> extractHeaders(HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.put(headerName, request.getHeader(headerName));
        }
        return headers;
    }
}
```

---

## 실제 로그 출력 예시

### 프론트엔드 로그 (브라우저 콘솔)

#### 1. 요청 시작 로그

```javascript
// 콘솔 출력
[Feature1] INFO: REQUEST_START {
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  url: "https://api.example.com/api/v1/feature1/ping"
}
```

#### 2. 요청 성공 로그

```javascript
// 콘솔 출력
[Feature1] INFO: REQUEST_SUCCESS {
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  tookMs: 245
}
```

#### 3. 요청 실패 로그

```javascript
// 콘솔 출력
[Feature1] ERROR: REQUEST_FAIL {
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  status: 500,
  statusText: "Internal Server Error",
  tookMs: 123,
  errorData: {
    message: "서버 내부 오류가 발생했습니다",
    code: "INTERNAL_ERROR"
  }
}
```

#### 4. 네트워크 에러 로그

```javascript
// 콘솔 출력
[Feature1] ERROR: REQUEST_ERROR {
  requestId: "550e8400-e29b-41d4-a716-446655440000",
  error: "Failed to fetch",
  tookMs: 5000
}
```

---

### 백엔드 로그 (로그 파일)

#### 1. 요청 로그 (application.log)

```
2025-01-20 15:30:45.123 INFO  [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.common.logging.ApiLogger : API Request: GET /api/v1/feature1/ping | RequestId: 01AN4Z07BY79K3
2025-01-20 15:30:45.124 DEBUG [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.common.logging.ApiLogger : Request Headers: {Content-Type=application/json, X-Request-ID=01AN4Z07BY79K3} | RequestId: 01AN4Z07BY79K3
2025-01-20 15:30:45.125 DEBUG [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.common.logging.ApiLogger : Request Body:  | RequestId: 01AN4Z07BY79K3
```

#### 2. 응답 로그 (application.log)

```
2025-01-20 15:30:45.234 INFO  [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.common.logging.ApiLogger : API Response: GET /api/v1/feature1/ping | Status: 200 | Duration: 111ms | RequestId: 01AN4Z07BY79K3
2025-01-20 15:30:45.235 DEBUG [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.common.logging.ApiLogger : Response Body: {"message":"Pong from Feature1","data":{"style":"casual","items":[]}} | RequestId: 01AN4Z07BY79K3
```

#### 3. 에러 로그 (application.log)

```
2025-01-20 15:30:45.456 ERROR [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.common.logging.ApiLogger : API Error: GET /api/v1/feature1/ping | Exception: NullPointerException | Duration: 50ms | RequestId: 01AN4Z07BY79K3
java.lang.NullPointerException: null
    at com.example.wardrobe.controller.Feature1Controller.ping(Feature1Controller.java:25)
    at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
    ...
```

#### 4. API 전용 로그 (api-requests.log)

```
2025-01-20 15:30:45.123 INFO  [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.common.logging.ApiLogger : API Request: GET /api/v1/feature1/ping | RequestId: 01AN4Z07BY79K3
2025-01-20 15:30:45.234 INFO  [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.common.logging.ApiLogger : API Response: GET /api/v1/feature1/ping | Status: 200 | Duration: 111ms | RequestId: 01AN4Z07BY79K3
```

---

## 데이터 구조 상세

### 프론트엔드 로그 데이터 구조

#### REQUEST_START 이벤트

```typescript
{
  scope: "Feature1",           // 로그 범위 (컴포넌트/모듈명)
  event: "REQUEST_START",      // 이벤트 타입
  meta: {
    requestId: "550e8400-e29b-41d4-a716-446655440000",  // UUID
    url: "https://api.example.com/api/v1/feature1/ping"  // 요청 URL
  }
}
```

#### REQUEST_SUCCESS 이벤트

```typescript
{
  scope: "Feature1",
  event: "REQUEST_SUCCESS",
  meta: {
    requestId: "550e8400-e29b-41d4-a716-446655440000",
    tookMs: 245  // 소요 시간 (밀리초)
  }
}
```

#### REQUEST_FAIL 이벤트

```typescript
{
  scope: "Feature1",
  event: "REQUEST_FAIL",
  meta: {
    requestId: "550e8400-e29b-41d4-a716-446655440000",
    status: 500,                    // HTTP 상태 코드
    statusText: "Internal Server Error",
    tookMs: 123,
    errorData: {                    // 에러 응답 본문
      message: "서버 내부 오류가 발생했습니다",
      code: "INTERNAL_ERROR"
    }
  }
}
```

#### REQUEST_ERROR 이벤트

```typescript
{
  scope: "Feature1",
  event: "REQUEST_ERROR",
  meta: {
    requestId: "550e8400-e29b-41d4-a716-446655440000",
    error: "Failed to fetch",  // 에러 메시지
    tookMs: 5000
  }
}
```

---

### 백엔드 로그 데이터 구조

#### 요청 로그 구조

```
로그 레벨: INFO
로그 메시지: "API Request: GET /api/v1/feature1/ping | RequestId: 01AN4Z07BY79K3"
MDC 컨텍스트: {
  requestId: "01AN4Z07BY79K3"  // ULID (시간 정렬 가능)
}
추가 정보 (DEBUG 레벨):
  - Request Headers: {Content-Type=application/json, X-Request-ID=01AN4Z07BY79K3}
  - Request Body: "" (GET 요청이므로 비어있음)
```

#### 응답 로그 구조

```
로그 레벨: INFO
로그 메시지: "API Response: GET /api/v1/feature1/ping | Status: 200 | Duration: 111ms | RequestId: 01AN4Z07BY79K3"
MDC 컨텍스트: {
  requestId: "01AN4Z07BY79K3"
}
추가 정보 (DEBUG 레벨):
  - Response Body: {"message":"Pong from Feature1","data":{"style":"casual","items":[]}}
```

#### 에러 로그 구조

```
로그 레벨: ERROR
로그 메시지: "API Error: GET /api/v1/feature1/ping | Exception: NullPointerException | Duration: 50ms | RequestId: 01AN4Z07BY79K3"
MDC 컨텍스트: {
  requestId: "01AN4Z07BY79K3"
}
스택 트레이스:
  java.lang.NullPointerException: null
    at com.example.wardrobe.controller.Feature1Controller.ping(Feature1Controller.java:25)
    ...
```

---

## 로그 파일 구조

### 백엔드 로그 파일

```
logs/
├── application.log                    # 현재 활성 로그 파일
├── application.2025-01-20.log        # 날짜별 분리된 로그 파일
├── application.2025-01-19.log
├── api-requests.log                   # API 전용 로그 파일
└── api-requests.2025-01-20.log        # API 로그 날짜별 분리
```

### 로그 파일 관리 정책

- **RollingFileAppender**: 사용
- **TimeBasedRollingPolicy**: 매일 자정에 파일 분리
- **MaxHistory**: 30일 (30일 지난 파일 자동 삭제)
- **TotalSizeCap**: 1GB (전체 로그 폴더 크기 제한)

---

## 로그 추적 흐름 예시

### 전체 플로우

```
1. 프론트엔드 요청 시작
   ↓
   [Feature1] INFO: REQUEST_START {
     requestId: "550e8400-e29b-41d4-a716-446655440000",
     url: "https://api.example.com/api/v1/feature1/ping"
   }
   
2. HTTP 요청 전송 (X-Request-ID 헤더 포함)
   ↓
   GET /api/v1/feature1/ping
   Headers: {
     "Content-Type": "application/json",
     "X-Request-ID": "550e8400-e29b-41d4-a716-446655440000"
   }
   
3. 백엔드 요청 수신
   ↓
   [01AN4Z07BY79K3] INFO: API Request: GET /api/v1/feature1/ping | RequestId: 01AN4Z07BY79K3
   
4. 백엔드 처리 완료
   ↓
   [01AN4Z07BY79K3] INFO: API Response: GET /api/v1/feature1/ping | Status: 200 | Duration: 111ms | RequestId: 01AN4Z07BY79K3
   
5. 프론트엔드 응답 수신
   ↓
   [Feature1] INFO: REQUEST_SUCCESS {
     requestId: "550e8400-e29b-41d4-a716-446655440000",
     tookMs: 245
   }
```

### RequestId 추적

- **프론트엔드**: UUID 사용 (`550e8400-e29b-41d4-a716-446655440000`)
- **백엔드**: ULID 사용 (`01AN4Z07BY79K3`) - 시간 정렬 가능
- **연결**: `X-Request-ID` 헤더를 통해 프론트엔드와 백엔드 로그 연결

---

## 환경 변수 설정

### 프론트엔드 (.env.local)

```bash
# API 로깅 활성화 (개발 환경)
NEXT_PUBLIC_API_LOGGING=true

# 프로덕션에서는 false 또는 설정하지 않음
```

### 백엔드 (application.yml)

```yaml
logging:
  level:
    com.example.wardrobe.common.logging: INFO  # API 로깅 레벨
    root: INFO
```

---

## 로그 분석 예시

### RequestId로 전체 플로우 추적

```bash
# 프론트엔드 로그에서 RequestId 찾기
grep "550e8400-e29b-41d4-a716-446655440000" browser-console.log

# 백엔드 로그에서 동일한 요청 찾기 (X-Request-ID 헤더로)
grep "01AN4Z07BY79K3" logs/api-requests.log

# 시간대별로 정렬하여 확인
grep "01AN4Z07BY79K3" logs/api-requests.log | sort
```

### 성능 분석

```bash
# 응답 시간이 500ms 이상인 요청 찾기
grep "Duration:" logs/api-requests.log | awk -F'Duration: ' '{print $2}' | awk '{if ($1 > 500) print}'

# 에러 발생한 요청 찾기
grep "API Error" logs/api-requests.log
```

---

## 요약

### 프론트엔드 로깅
- **파일**: `src/lib/logger.ts`
- **형식**: 구조화된 JSON 로그
- **출력**: 브라우저 콘솔
- **제어**: 환경 변수 `NEXT_PUBLIC_API_LOGGING`

### 백엔드 로깅
- **파일**: `LoggingFilter.java`, `ApiLogger.java`
- **형식**: Logback 구조화 로그
- **출력**: 파일 (`application.log`, `api-requests.log`)
- **추적**: MDC를 통한 RequestId 자동 포함

### 공통 특징
- **RequestId 추적**: 프론트엔드-백엔드 연결
- **성능 측정**: 요청/응답 소요 시간 기록
- **에러 추적**: 상세한 에러 정보 및 스택 트레이스
- **구조화된 로그**: 파싱 및 분석 용이
