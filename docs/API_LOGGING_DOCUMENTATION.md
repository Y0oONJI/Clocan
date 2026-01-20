# API 로깅 시스템 문서화

> 생성일: 2025-01-XX  
> 프로젝트: Clocan (Closet Canvas)

## 개요

프론트엔드와 백엔드에서 모든 API 요청과 응답을 자동으로 로깅하는 시스템입니다. 디버깅, 모니터링, 추적을 위해 사용됩니다.

---

## 프론트엔드 API 로깅

### 파일 위치
- `src/lib/api-logger.ts` - API 로거 유틸리티

### 주요 기능

1. **요청 로깅** (`logApiRequest`)
   - API 호출 전 요청 정보를 로깅
   - URL, Method, Headers, Body 정보 포함

2. **응답 로깅** (`logApiResponse`)
   - API 호출 후 응답 정보를 로깅
   - Status Code, Headers, Body, Duration 포함

3. **에러 로깅** (`logApiError`)
   - API 호출 실패 시 에러 정보를 로깅
   - 에러 메시지, 스택 트레이스 포함

### 특징

- **console.group으로 그룹화**: 요청-응답을 하나의 그룹으로 묶어 가독성 향상
- **Duration 측정**: 요청 시작 시간과 응답 시간을 계산하여 소요 시간 표시
- **환경 변수 제어**: `NEXT_PUBLIC_API_LOGGING` 환경 변수로 온오프 제어
- **민감 정보 보호**: Authorization 헤더 자동 마스킹
- **시각적 구분**: 이모지와 색상으로 상태 구분

### 사용 예시

```typescript
import { logApiRequest, logApiResponse, logApiError } from '@/lib/api-logger';

// 요청 로깅
logApiRequest({
  url: '/api/v1/feature1/ping',
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  requestId: 'abc-123',
  timestamp: new Date().toISOString()
});

// 응답 로깅
logApiResponse({
  url: '/api/v1/feature1/ping',
  method: 'GET',
  status: 200,
  statusText: 'OK',
  body: { ok: true },
  requestId: 'abc-123',
  duration: 150,
  timestamp: new Date().toISOString()
});
```

### 환경 변수 설정

```bash
# .env.local
NEXT_PUBLIC_API_LOGGING=true   # 활성화
NEXT_PUBLIC_API_LOGGING=false  # 비활성화
```

### 콘솔 출력 예시

```
🌐 GET /api/v1/feature1/ping [abc12345]
  📤 Request { method: 'GET', url: '...', timestamp: '...' }
  📋 Headers { 'Content-Type': 'application/json' }
  ✅ Response [200 OK] ⏱️ 150ms
    { status: 200, statusText: 'OK', duration: '150ms' }
  📦 Response Body { ok: true, message: '추천 완료' }
```

---

## 백엔드 API 로깅

### 파일 위치
- `backend/src/main/java/com/example/wardrobe/common/logging/LoggingFilter.java` - 로깅 필터
- `backend/src/main/java/com/example/wardrobe/common/logging/ApiLogger.java` - API 로거 유틸리티
- `backend/src/main/resources/logback-spring.xml` - Logback 설정 파일

### 주요 기능

1. **LoggingFilter**
   - 모든 HTTP 요청/응답을 가로채는 필터
   - `ContentCachingRequestWrapper`와 `ContentCachingResponseWrapper`를 사용하여 Body 보존
   - 요청 ID 생성 및 처리 시간 측정

2. **ApiLogger**
   - 로그 포맷을 일관되게 관리하는 유틸리티 클래스
   - 별도 로거(LoggerFactory)를 사용하여 API 전용 로그 파일에 저장

3. **logback-spring.xml**
   - API 로그를 `logs/api-requests.log` 파일에 별도 저장
   - 일반 애플리케이션 로그와 분리

### 특징

- **Body 보존**: `ContentCachingRequestWrapper`를 사용하여 요청 Body를 보존
- **요청 추적**: 각 요청에 고유한 `requestId` 부여
- **처리 시간 측정**: 요청 시작 시간과 응답 시간을 계산하여 Duration 로깅
- **민감 정보 보호**: Authorization 헤더 자동 마스킹
- **별도 로그 파일**: API 로그를 `logs/api-requests.log`에 저장

### 설정

#### application.yml

```yaml
api:
  logging:
    enabled: ${API_LOGGING_ENABLED:true}
    log-request-body: ${API_LOGGING_REQUEST_BODY:true}
    log-response-body: ${API_LOGGING_RESPONSE_BODY:true}
```

#### 환경 변수

- `API_LOGGING_ENABLED`: API 로깅 활성화 여부
- `API_LOGGING_REQUEST_BODY`: 요청 본문 로깅 여부
- `API_LOGGING_RESPONSE_BODY`: 응답 본문 로깅 여부

### 로그 파일 위치

- **API 로그**: `logs/api-requests.log`
- **일반 로그**: `logs/application.log`

### 로그 포맷 예시

```json
{
  "type": "API_REQUEST",
  "requestId": "abc12345-6789-0123-4567-890123456789",
  "timestamp": "2025-01-XX 12:34:56.789",
  "method": "GET",
  "url": "/api/v1/feature1/ping",
  "headers": {
    "content-type": "application/json",
    "authorization": "[REDACTED]"
  },
  "body": {
    "key": "value"
  }
}
```

---

## 통합 사용 가이드

### 프론트엔드에서 API 호출 시

1. `src/lib/api.ts`의 `apiGet()`, `apiPost()` 함수가 자동으로 로깅
2. `src/api/feature1.ts`의 `pingFeature1()` 함수도 자동으로 로깅
3. 브라우저 개발자 도구 콘솔에서 확인 가능

### 백엔드에서 API 요청 처리 시

1. `LoggingFilter`가 모든 요청을 자동으로 가로채서 로깅
2. `logs/api-requests.log` 파일에 자동 저장
3. 요청 ID로 요청-응답 추적 가능

### 요청 추적 방법

1. 프론트엔드 콘솔에서 `requestId` 확인
2. 백엔드 로그 파일에서 같은 `requestId`로 검색
3. 요청-응답 전체 흐름 추적 가능

```bash
# 백엔드 로그에서 특정 요청 ID 검색
grep "abc12345" logs/api-requests.log
```

---

## 주의사항

### 프론트엔드

1. **프로덕션 환경**: 기본적으로 개발 환경에서만 활성화되지만, 명시적으로 비활성화 권장
2. **콘솔 로그**: 브라우저 개발자 도구에서만 확인 가능

### 백엔드

1. **Body 크기 제한**: 매우 큰 요청/응답 본문은 로그 파일 크기를 증가시킬 수 있음
2. **성능 영향**: 로깅은 약간의 성능 오버헤드를 발생시킬 수 있음
3. **디스크 공간**: 로그 파일이 계속 증가하므로 정기적으로 모니터링 필요
4. **민감 정보**: 로그 파일에 민감한 정보가 포함되지 않도록 주의

---

## 참고 문서

- [백엔드 API 로깅 가이드](./backend/docs/API_LOGGING_GUIDE.md) - 상세한 백엔드 로깅 설정 및 사용법
- [백엔드-프론트엔드 연동 상태](./BE_FE_INTEGRATION_STATUS.md) - API 연동 상태 문서

---

## 업데이트 이력

- 2025-01-XX: 초기 작성
  - 프론트엔드 API 로거 구현 및 문서화
  - 백엔드 LoggingFilter 구현 및 문서화
  - 통합 문서 작성
