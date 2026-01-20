# API 로깅 가이드

> 생성일: 2025-01-XX  
> 프로젝트: Clocan (Closet Canvas) Backend

## 개요

백엔드에서 모든 HTTP 요청과 응답을 자동으로 로깅하는 시스템입니다. API 호출 추적, 디버깅, 모니터링을 위해 사용됩니다.

---

## 아키텍처

### 구성 요소

1. **LoggingFilter** (`com.example.wardrobe.common.logging.LoggingFilter`)
   - 모든 HTTP 요청/응답을 가로채는 필터
   - `OncePerRequestFilter`를 상속하여 요청당 한 번만 실행
   - `ContentCachingRequestWrapper`와 `ContentCachingResponseWrapper`를 사용하여 Body 보존

2. **ApiLogger** (`com.example.wardrobe.common.logging.ApiLogger`)
   - 로그 포맷을 일관되게 관리하는 유틸리티 클래스
   - 요청/응답/에러 로깅 메서드 제공
   - 별도 로거(LoggerFactory)를 사용하여 API 전용 로그 파일에 저장

3. **logback-spring.xml**
   - Logback 설정 파일
   - API 로그를 `logs/api-requests.log` 파일에 별도 저장
   - 일반 애플리케이션 로그와 분리

---

## 주요 기능

### 1. 요청/응답 Body 로깅

- **주의사항**: `HttpServletRequest`의 Body는 한 번 읽으면 사라지므로, `ContentCachingRequestWrapper`를 사용하여 내용을 보존합니다.
- 요청 본문과 응답 본문을 모두 로그 파일에 기록합니다.

### 2. 요청 추적

- 각 요청에 고유한 `requestId`를 부여하여 요청-응답을 추적할 수 있습니다.
- `requestId`는 UUID 형식입니다.

### 3. 처리 시간 측정

- 요청 시작 시간과 응답 시간을 계산하여 소요 시간(Duration)을 로깅합니다.
- 밀리초 단위로 기록됩니다.

### 4. 민감 정보 보호

- `Authorization` 헤더는 자동으로 `[REDACTED]`로 마스킹됩니다.

---

## 설정

### application.yml

```yaml
# API 로깅 설정
api:
  logging:
    enabled: ${API_LOGGING_ENABLED:true}  # API 로깅 활성화 여부 (기본값: true)
    log-request-body: ${API_LOGGING_REQUEST_BODY:true}  # 요청 본문 로깅 여부 (기본값: true)
    log-response-body: ${API_LOGGING_RESPONSE_BODY:true}  # 응답 본문 로깅 여부 (기본값: true)
```

### 환경 변수

- `API_LOGGING_ENABLED`: API 로깅 활성화 여부 (true/false)
- `API_LOGGING_REQUEST_BODY`: 요청 본문 로깅 여부 (true/false)
- `API_LOGGING_RESPONSE_BODY`: 응답 본문 로깅 여부 (true/false)

---

## 로그 파일 위치

### API 로그 파일

- **경로**: `logs/api-requests.log`
- **롤링**: 일별 + 크기 기반 (100MB 단위)
- **보관 기간**: 30일
- **최대 용량**: 3GB

### 일반 애플리케이션 로그 파일

- **경로**: `logs/application.log`
- **롤링**: 일별 + 크기 기반 (100MB 단위)
- **보관 기간**: 30일
- **최대 용량**: 3GB

---

## 로그 포맷

### 요청 로그 예시

```json
{
  "type": "API_REQUEST",
  "requestId": "abc12345-6789-0123-4567-890123456789",
  "timestamp": "2025-01-XX 12:34:56.789",
  "method": "GET",
  "url": "/api/v1/feature1/ping",
  "queryString": null,
  "headers": {
    "content-type": "application/json",
    "authorization": "[REDACTED]"
  },
  "body": {
    "key": "value"
  }
}
```

### 응답 로그 예시

```json
{
  "type": "API_RESPONSE",
  "requestId": "abc12345-6789-0123-4567-890123456789",
  "timestamp": "2025-01-XX 12:34:56.890",
  "method": "GET",
  "url": "/api/v1/feature1/ping",
  "status": 200,
  "duration": "150ms",
  "headers": {
    "content-type": "application/json;charset=UTF-8"
  },
  "body": {
    "ok": true,
    "message": "추천 완료"
  }
}
```

### 에러 로그 예시

```json
{
  "type": "API_ERROR",
  "requestId": "abc12345-6789-0123-4567-890123456789",
  "timestamp": "2025-01-XX 12:34:56.999",
  "method": "GET",
  "url": "/api/v1/feature1/ping",
  "duration": "5000ms",
  "error": {
    "name": "NullPointerException",
    "message": "Cannot invoke method on null",
    "stackTrace": [
      "com.example.wardrobe.service.SomeService.method(SomeService.java:123)",
      "..."
    ]
  }
}
```

---

## 필터링 제외 경로

다음 경로는 로깅에서 제외됩니다:

- `/h2-console/*` - H2 데이터베이스 콘솔
- `/swagger-ui/*` - Swagger UI
- `/v3/api-docs/*` - OpenAPI 문서
- `/actuator/*` - Spring Boot Actuator

---

## 코드 구조

### LoggingFilter

```java
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
        // 요청 ID 생성
        String requestId = UUID.randomUUID().toString();
        long startTime = System.currentTimeMillis();
        
        // Body 보존을 위한 래퍼 사용
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
            apiLogger.logResponse(requestWrapper, responseWrapper, requestId, duration);
            
        } catch (Exception e) {
            // 에러 로깅
            long duration = System.currentTimeMillis() - startTime;
            apiLogger.logError(requestWrapper, e, requestId, duration);
            throw e;
        } finally {
            // 응답 본문을 클라이언트로 전송
            responseWrapper.copyBodyToResponse();
        }
    }
}
```

### ApiLogger

```java
@Component
public class ApiLogger {
    
    // API 전용 로거 (별도 파일에 저장)
    private static final Logger apiLogger = 
        LoggerFactory.getLogger(ApiLogger.class);
    
    public void logRequest(HttpServletRequest request, String requestId) {
        // 요청 정보 로깅
    }
    
    public void logResponse(
        HttpServletRequest request, 
        HttpServletResponse response, 
        String requestId, 
        long duration
    ) {
        // 응답 정보 로깅
    }
    
    public void logError(
        HttpServletRequest request, 
        Exception error, 
        String requestId, 
        long duration
    ) {
        // 에러 정보 로깅
    }
}
```

---

## 사용 예시

### 로그 확인

```bash
# API 로그 파일 확인
tail -f logs/api-requests.log

# 특정 요청 ID로 검색
grep "abc12345" logs/api-requests.log

# 에러만 확인
grep "API_ERROR" logs/api-requests.log
```

### 로깅 비활성화

```bash
# 환경 변수로 비활성화
export API_LOGGING_ENABLED=false

# 또는 application.yml에서 설정
api:
  logging:
    enabled: false
```

---

## 주의사항

1. **Body 크기 제한**: 매우 큰 요청/응답 본문은 로그 파일 크기를 증가시킬 수 있습니다. 필요시 `log-request-body` 또는 `log-response-body`를 `false`로 설정하세요.

2. **성능 영향**: 로깅은 약간의 성능 오버헤드를 발생시킬 수 있습니다. 프로덕션 환경에서는 필요에 따라 비활성화하거나 본문 로깅을 제한하세요.

3. **민감 정보**: 로그 파일에 민감한 정보(비밀번호, 토큰 등)가 포함되지 않도록 주의하세요. 현재는 `Authorization` 헤더만 자동 마스킹됩니다.

4. **디스크 공간**: 로그 파일이 계속 증가하므로 정기적으로 모니터링하고, 필요시 오래된 로그를 삭제하세요.

---

## 참고 파일

- `backend/src/main/java/com/example/wardrobe/common/logging/LoggingFilter.java` - 로깅 필터
- `backend/src/main/java/com/example/wardrobe/common/logging/ApiLogger.java` - API 로거 유틸리티
- `backend/src/main/resources/logback-spring.xml` - Logback 설정 파일
- `backend/src/main/resources/application.yml` - 애플리케이션 설정 파일

---

## 업데이트 이력

- 2025-01-XX: 초기 작성
  - LoggingFilter 구현
  - ApiLogger 구현
  - logback-spring.xml 설정 추가
  - API 로그를 별도 파일에 저장하도록 구성
