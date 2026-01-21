# UX 핵심 시나리오

> **작성일:** 2025-01-XX  
> **최종 업데이트:** 2025-01-XX  
> **프로젝트:** Clocan (Closet Canvas)

---

## 📋 목차

1. [개요](#개요)
2. [시나리오 1: 데모 체험 (비회원)](#시나리오-1-데모-체험-비회원)
3. [시나리오 2: API 테스트](#시나리오-2-api-테스트)
4. [시나리오 3: 어드민 대시보드 접근](#시나리오-3-어드민-대시보드-접근)
5. [시나리오 4: 회원가입 후 데모 체험](#시나리오-4-회원가입-후-데모-체험-향후-구현)
6. [시나리오 5: 로그인 후 데모 체험](#시나리오-5-로그인-후-데모-체험-향후-구현)

---

## 개요

이 문서는 랜딩 페이지에서 시작하는 핵심 사용자 시나리오 5가지를 정리합니다. 각 시나리오는 사용자가 체류하는 페이지를 기준으로 UX 흐름도를 표로 작성하며, 각 단계에서 일어나는 프론트엔드와 백엔드의 상호작용을 상세히 설명합니다.

### 시나리오 현황

| 시나리오 | 상태 | 설명 |
|---------|------|------|
| 시나리오 1: 데모 체험 (비회원) | ✅ 구현됨 | 랜딩 → 퀴즈 → 결과 |
| 시나리오 2: API 테스트 | ✅ 구현됨 | 랜딩 → API 테스트 (현재 페이지 유지) |
| 시나리오 3: 어드민 대시보드 접근 | ✅ 구현됨 | 랜딩 → 어드민 대시보드 |
| 시나리오 4: 회원가입 후 데모 체험 | ⚠️ 향후 구현 | 랜딩 → 회원가입 → 퀴즈 → 결과 |
| 시나리오 5: 로그인 후 데모 체험 | ⚠️ 향후 구현 | 랜딩 → 로그인 → 퀴즈 → 결과 |

---

## 시나리오 1: 데모 체험 (비회원)

### 시나리오 개요

비회원 사용자가 랜딩 페이지에서 CTA 버튼을 클릭하여 스타일 퀴즈를 시작하고, 결과를 확인하는 전체 플로우입니다.

### UX 흐름도

| 단계 | 랜딩 페이지 (`/`) | 스타일 퀴즈 페이지 (`/style-quiz`) | 스타일 분석 결과 페이지 (`/style-quiz/result`) |
|------|------------------|--------------------------------|--------------------------------------------|
| **1. 진입** | • 페이지 로드<br>• Google Analytics 페이지뷰 추적<br>`trackPageView('/')`<br>• 헤더 네비게이션 표시 | • 페이지 로드<br>• Google Analytics 페이지뷰 추적<br>`trackPageView('/style-quiz')`<br>• 퀴즈 시작 이벤트 추적<br>`quizTracking.trackStart()`<br>• 5단계 퀴즈 UI 표시 | • 페이지 로드<br>• URL 파라미터 파싱<br>`?styles=...&colors=...&inspirations=...`<br>• Google Analytics 페이지뷰 추적<br>`trackPageView('/style-quiz/result')`<br>• 결과 페이지 로드 이벤트 추적<br>`trackEvent('result_view')` |
| **2. 상호작용** | • CTA 버튼 클릭<br>• Google Analytics 이벤트 추적<br>`trackEvent('cta_click')`<br>• `/style-quiz`로 이동 | • 스타일 선택 (Step 1)<br>• 색상 선택 (Step 2)<br>• 영감 이미지 선택 (Step 3)<br>• 각 선택 시 Google Analytics 추적<br>`quizTracking.trackStyleSelection()`<br>`quizTracking.trackColorSelection()`<br>`quizTracking.trackInspirationSelection()`<br>• 진행 상황 Progress Bar 업데이트 | • Health Check API 호출<br>`GET /api/v1/health/ping`<br>• AI 분석 시뮬레이션 (Mock)<br>• 로딩 상태 표시 |
| **3. 완료** | - | • "Finish" 버튼 클릭<br>• 선택 데이터 검증<br>• Google Analytics 퀴즈 완료 추적<br>`quizTracking.trackComplete()`<br>• 사용자 속성 업데이트<br>`setUserProperties()`<br>• `/style-quiz/result`로 이동 (URL 파라미터 포함) | • 분석 결과 표시<br>• Google Analytics 결과 생성 추적<br>`trackEvent('result_generated')`<br>• "퀴즈 다시 하기" 버튼<br>• "홈으로 이동" 버튼 |

### 상세 설명

#### 1. 랜딩 페이지 (`/`)

**프론트엔드 동작**:
- **페이지 로드**: Next.js App Router를 통한 서버 사이드 렌더링
- **Google Analytics 추적**: `trackPageView('/')` 호출로 페이지뷰 기록
- **CTA 버튼**: "취향 입력하고 바로 추천받기" 버튼 클릭 시 `/style-quiz`로 이동
- **이벤트 추적**: CTA 클릭 시 `trackEvent('cta_click')` 호출

**백엔드 동작**:
- 없음 (정적 페이지)

**로그 출력**:
```
[2025-01-20T15:30:45.123Z][FE][INFO][Analytics] PAGE_VIEW {
  path: "/",
  title: "랜딩 페이지"
}

gtag('event', 'cta_click', {
  button_text: '취향 입력하고 바로 추천받기',
  location: 'hero'
});
```

#### 2. 스타일 퀴즈 페이지 (`/style-quiz`)

**프론트엔드 동작**:
- **5단계 퀴즈 플로우**:
  1. 환영 화면 (Step 0)
  2. 스타일 선택 (Step 1) - Modern, Vintage, Bohemian, Streetwear, Classic, Minimalist
  3. 색상 팔레트 선택 (Step 2) - Neutrals, Pastels, Brights, Monochrome, Earthy, Jewel Tones
  4. 영감 이미지 선택 (Step 3) - 9개 outfit 이미지
  5. 완료 화면 (Step 4)
- **상태 관리**: `useQuizState` 훅으로 로컬 상태 관리
- **이벤트 추적**: 각 단계별 선택 시 Google Analytics 이벤트 추적
- **진행 상황**: Progress Bar로 현재 단계 표시
- **네비게이션**: 이전 단계로 돌아가기 가능

**백엔드 동작**:
- 없음 (프론트엔드에서만 처리)

**로그 출력**:
```
[2025-01-20T15:30:45.123Z][FE][INFO][Analytics] PAGE_VIEW {
  path: "/style-quiz",
  title: "스타일 퀴즈"
}

gtag('event', 'quiz_start', {
  step: 0,
  step_name: 'welcome'
});

gtag('event', 'style_selected', {
  style_id: "modern",
  style_name: "Modern",
  action: "select",
  total_selected: 2
});

gtag('event', 'quiz_complete', {
  total_steps: 5,
  styles_selected: ["modern", "minimalist"],
  colors_selected: ["neutrals", "pastels"],
  inspirations_selected: ["insp1", "insp2", "insp3"],
  duration_seconds: 180
});
```

#### 3. 스타일 분석 결과 페이지 (`/style-quiz/result`)

**프론트엔드 동작**:
- **URL 파라미터 파싱**: `useSearchParams()`로 선택 데이터 추출
- **Health Check**: `GET /api/v1/health/ping` 호출로 서버 연결 상태 확인
- **AI 분석 시뮬레이션**: 2초 딜레이 후 Mock 결과 생성 (향후 실제 API 호출로 교체 예정)
- **결과 표시**: 분석 결과 텍스트 및 선택 항목 요약 표시
- **에러 처리**: 타임아웃(10초), 재시도(최대 3회), 에러 메시지 표시

**백엔드 동작**:
- **Health Check API**: `GET /api/v1/health/ping` → `"pong"` 응답
- **AI 분석 API**: 현재 미구현 (향후 `POST /api/v1/style-quiz/analyze` 예정)

**로그 출력**:
```
// Health Check 성공
[2025-01-20T15:35:12.456Z][FE][INFO][API] REQUEST_START {
  endpoint: "/health/ping",
  method: "GET"
}

gtag('event', 'api_request_success', {
  endpoint: '/health/ping',
  method: 'GET',
  status: 200,
  duration_ms: 123
});

// 결과 생성
gtag('event', 'result_generated', {
  styles: ["modern", "minimalist"],
  colors: ["neutrals", "pastels"],
  inspirations_count: 3
});
```

---

## 시나리오 2: API 테스트

### 시나리오 개요

개발자나 테스터가 랜딩 페이지 하단의 "API 테스트" 버튼을 클릭하여 백엔드 API 연결 상태를 확인하는 시나리오입니다.

### UX 흐름도

| 단계 | 랜딩 페이지 (`/`) |
|------|------------------|
| **1. 진입** | • 페이지 로드<br>• Google Analytics 페이지뷰 추적<br>`trackPageView('/')`<br>• API 테스트 버튼 표시 (하단 섹션) |
| **2. 상호작용** | • "API 테스트 (Feature1 Ping)" 버튼 클릭<br>• Google Analytics 이벤트 추적<br>`trackEvent('api_test_click')`<br>• 로딩 상태 표시<br>• API 호출 시작 추적<br>`apiTracking.trackStart()` |
| **3. 완료** | • 성공: Alert로 메시지 표시<br>`alert(data.message)`<br>• 성공 이벤트 추적<br>`apiTracking.trackSuccess()`<br>• 실패: Alert로 에러 메시지 표시<br>`alert("API 호출 실패: ...")`<br>• 실패 이벤트 추적<br>`apiTracking.trackError()` |

### 상세 설명

#### 랜딩 페이지 (`/`) - API 테스트

**프론트엔드 동작**:
- **버튼 위치**: 페이지 하단 개발자 섹션
- **API 호출**: `pingFeature1()` 함수 호출
- **로딩 상태**: 버튼 비활성화 및 "API 호출 중..." 텍스트 표시
- **성공 처리**: Alert로 응답 메시지 표시
- **실패 처리**: Alert로 에러 메시지 표시, 콘솔에 에러 로그 출력

**백엔드 동작**:
- **API 엔드포인트**: `GET /api/v1/feature1/ping`
- **응답**: 
  ```json
  {
    "ok": true,
    "message": "Pong from Feature1",
    "data": {
      "style": "casual",
      "items": []
    }
  }
  ```

**로그 출력**:
```
// 성공 시
[2025-01-20T15:30:45.123Z][FE][INFO][API] REQUEST_START {
  endpoint: "/api/v1/feature1/ping",
  method: "GET"
}

gtag('event', 'api_request_success', {
  endpoint: '/api/v1/feature1/ping',
  method: 'GET',
  status: 200,
  duration_ms: 245
});

// 실패 시
gtag('event', 'api_request_error', {
  endpoint: '/api/v1/feature1/ping',
  method: 'GET',
  status: 0,
  error_type: 'network',
  duration_ms: 5000
});
```

---

## 시나리오 3: 어드민 대시보드 접근

### 시나리오 개요

관리자가 랜딩 페이지에서 어드민 분석 대시보드로 직접 이동하여 통계 데이터를 확인하는 시나리오입니다.

### UX 흐름도

| 단계 | 랜딩 페이지 (`/`) | 어드민 분석 대시보드 (`/admin/analytics`) |
|------|------------------|----------------------------------------|
| **1. 진입** | • 페이지 로드<br>• Google Analytics 페이지뷰 추적<br>`trackPageView('/')` | • 페이지 로드<br>• Google Analytics 페이지뷰 추적<br>`trackPageView('/admin/analytics')`<br>• 3개 AnalyticsCard 컴포넌트 렌더링 |
| **2. 상호작용** | • URL 직접 입력 또는 링크 클릭<br>• `/admin/analytics`로 이동 | • 각 AnalyticsCard에서 API 호출<br>• 로딩 상태 표시<br>• 데이터 페칭 시작 |
| **3. 완료** | - | • 성공: 표와 그래프로 데이터 표시<br>• 실패: 에러 메시지 표시<br>• Fallback: 더미 데이터 표시 (로그 파일 없을 때) |

### 상세 설명

#### 1. 랜딩 페이지 (`/`)

**프론트엔드 동작**:
- **접근 방법**: URL 직접 입력 (`/admin/analytics`) 또는 네비게이션 링크
- **인증**: 현재 인증 불필요 (공개 API)

**백엔드 동작**:
- 없음

#### 2. 어드민 분석 대시보드 (`/admin/analytics`)

**프론트엔드 동작**:
- **3개 AnalyticsCard 컴포넌트**:
  1. 랜딩 페이지 접속 수 (`/api/v1/admin/analytics/landing-page-views`)
  2. 스타일 퀴즈 완료 수 (`/api/v1/admin/analytics/quiz-completions`)
  3. AI 스타일 분석 완료 수 (`/api/v1/admin/analytics/analysis-completions`)
- **데이터 표시**: 각 카드마다 표(AnalyticsTable)와 그래프(AnalyticsChart) 표시
- **로딩 상태**: 스피너 및 "데이터를 불러오는 중..." 메시지
- **에러 처리**: 에러 메시지 표시 및 더미 데이터 Fallback

**백엔드 동작**:
- **로그 파일 읽기**: `./logs/application.log`, `./logs/api-requests.log`
- **로그 파싱**: `LogParser.parse()`로 로그 한 줄 파싱
- **시간대별 집계**: `AnalyticsService.aggregateByHour()`로 0-23시 집계
- **더미 데이터 생성**: 로그 파일 없을 때 `generateDummyData()` 호출
- **응답 형식**:
  ```json
  [
    { "hour": 0, "count": 5 },
    { "hour": 1, "count": 3 },
    ...
    { "hour": 23, "count": 8 }
  ]
  ```

**로그 출력**:
```
// 프론트엔드
[2025-01-20T15:40:12.345Z][FE][INFO][Analytics] PAGE_VIEW {
  path: "/admin/analytics",
  title: "어드민 분석 대시보드"
}

gtag('event', 'api_request_start', {
  endpoint: '/api/v1/admin/analytics/landing-page-views',
  method: 'GET'
});

// 백엔드
2025-01-20 15:40:12.456 INFO  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.service.AnalyticsService : Read 1250 lines from ./logs/application.log
2025-01-20 15:40:12.567 INFO  [01AN4Z07BY79K4] --- [http-nio-8080-exec-2] c.e.w.controller.AnalyticsController : Response: 200 OK | Duration: 222ms
```

---

## 시나리오 4: 회원가입 후 데모 체험 (향후 구현)

### 시나리오 개요

신규 사용자가 랜딩 페이지에서 회원가입을 완료한 후 스타일 퀴즈를 시작하는 시나리오입니다. 현재는 미구현 상태이며 향후 구현 예정입니다.

### UX 흐름도

| 단계 | 랜딩 페이지 (`/`) | 회원가입 페이지 (`/signup`) | 스타일 퀴즈 페이지 (`/style-quiz`) | 스타일 분석 결과 페이지 (`/style-quiz/result`) |
|------|------------------|---------------------------|--------------------------------|--------------------------------------------|
| **1. 진입** | • 페이지 로드<br>• Google Analytics 페이지뷰 추적 | • 페이지 로드<br>• 회원가입 폼 표시 | • 페이지 로드<br>• 퀴즈 시작 이벤트 추적 | • 페이지 로드<br>• 결과 페이지 로드 이벤트 추적 |
| **2. 상호작용** | • "회원가입" 버튼 클릭<br>• `/signup`로 이동 | • 이메일, 비밀번호 입력<br>• 회원가입 API 호출<br>`POST /api/v1/users/signup`<br>• 성공 시 JWT 토큰 저장 | • 스타일 퀴즈 진행<br>• 선택 데이터 저장 (향후: 서버 저장) | • AI 분석 API 호출<br>`POST /api/v1/style-quiz/analyze`<br>• 결과 표시 |
| **3. 완료** | - | • 성공: `/style-quiz`로 이동<br>• 실패: 에러 메시지 표시 | • 퀴즈 완료<br>• `/style-quiz/result`로 이동 | • 분석 결과 표시<br>• 결과 저장 (향후: 서버 저장) |

### 상세 설명

#### 1. 랜딩 페이지 (`/`)

**프론트엔드 동작**:
- **회원가입 버튼**: 헤더 또는 CTA 영역에 "회원가입" 버튼 표시
- **이벤트 추적**: 회원가입 버튼 클릭 시 `trackEvent('signup_click')` 호출

**백엔드 동작**:
- 없음

#### 2. 회원가입 페이지 (`/signup`) - 향후 구현

**프론트엔드 동작**:
- **회원가입 폼**: 이메일, 비밀번호 입력 필드
- **API 호출**: `POST /api/v1/users/signup` 호출
- **성공 처리**: JWT 토큰 로컬 스토리지 저장, `/style-quiz`로 이동
- **실패 처리**: 에러 메시지 표시

**백엔드 동작**:
- **API 엔드포인트**: `POST /api/v1/users/signup`
- **요청 데이터**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답 데이터**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer"
  }
  ```

#### 3. 스타일 퀴즈 페이지 (`/style-quiz`)

**프론트엔드 동작**:
- 시나리오 1과 동일하지만, 향후 선택 데이터를 서버에 저장할 예정

**백엔드 동작**:
- 향후: 선택 데이터를 사용자 계정에 저장하는 API 구현 예정

#### 4. 스타일 분석 결과 페이지 (`/style-quiz/result`)

**프론트엔드 동작**:
- 시나리오 1과 동일하지만, 향후 실제 AI 분석 API 호출 예정

**백엔드 동작**:
- **API 엔드포인트**: `POST /api/v1/style-quiz/analyze` (향후 구현)
- **요청 데이터**:
  ```json
  {
    "styles": ["modern", "minimalist"],
    "colors": ["neutrals", "pastels"],
    "inspirations": ["insp1", "insp2", "insp3"]
  }
  ```
- **응답 데이터**:
  ```json
  {
    "analysis": "Based on your selections...",
    "recommendations": [...]
  }
  ```

---

## 시나리오 5: 로그인 후 데모 체험 (향후 구현)

### 시나리오 개요

기존 사용자가 랜딩 페이지에서 로그인한 후 스타일 퀴즈를 시작하는 시나리오입니다. 현재는 미구현 상태이며 향후 구현 예정입니다.

### UX 흐름도

| 단계 | 랜딩 페이지 (`/`) | 로그인 페이지 (`/login`) | 스타일 퀴즈 페이지 (`/style-quiz`) | 스타일 분석 결과 페이지 (`/style-quiz/result`) |
|------|------------------|------------------------|--------------------------------|--------------------------------------------|
| **1. 진입** | • 페이지 로드<br>• Google Analytics 페이지뷰 추적 | • 페이지 로드<br>• 로그인 폼 표시 | • 페이지 로드<br>• 퀴즈 시작 이벤트 추적 | • 페이지 로드<br>• 결과 페이지 로드 이벤트 추적 |
| **2. 상호작용** | • "로그인" 버튼 클릭<br>• `/login`로 이동 | • 이메일, 비밀번호 입력<br>• 로그인 API 호출<br>`POST /api/v1/auth/login`<br>• 성공 시 JWT 토큰 저장 | • 스타일 퀴즈 진행<br>• 선택 데이터 저장 (향후: 서버 저장) | • AI 분석 API 호출<br>`POST /api/v1/style-quiz/analyze`<br>• 결과 표시 |
| **3. 완료** | - | • 성공: `/style-quiz`로 이동<br>• 실패: 에러 메시지 표시 | • 퀴즈 완료<br>• `/style-quiz/result`로 이동 | • 분석 결과 표시<br>• 결과 저장 (향후: 서버 저장) |

### 상세 설명

#### 1. 랜딩 페이지 (`/`)

**프론트엔드 동작**:
- **로그인 버튼**: 헤더에 "로그인" 버튼 표시
- **이벤트 추적**: 로그인 버튼 클릭 시 `trackEvent('login_click')` 호출

**백엔드 동작**:
- 없음

#### 2. 로그인 페이지 (`/login`) - 향후 구현

**프론트엔드 동작**:
- **로그인 폼**: 이메일, 비밀번호 입력 필드
- **API 호출**: `POST /api/v1/auth/login` 호출
- **성공 처리**: JWT 토큰 로컬 스토리지 저장, `/style-quiz`로 이동
- **실패 처리**: 에러 메시지 표시 (401 Unauthorized)

**백엔드 동작**:
- **API 엔드포인트**: `POST /api/v1/auth/login`
- **요청 데이터**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **응답 데이터**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer"
  }
  ```
- **인증**: JWT 토큰 검증 후 사용자 정보 반환

#### 3. 스타일 퀴즈 페이지 (`/style-quiz`)

**프론트엔드 동작**:
- 시나리오 1과 동일하지만, 향후 선택 데이터를 서버에 저장할 예정

**백엔드 동작**:
- 향후: 선택 데이터를 사용자 계정에 저장하는 API 구현 예정

#### 4. 스타일 분석 결과 페이지 (`/style-quiz/result`)

**프론트엔드 동작**:
- 시나리오 1과 동일하지만, 향후 실제 AI 분석 API 호출 예정

**백엔드 동작**:
- 시나리오 4와 동일

---

## 참고 문서

- [백엔드-프론트엔드 연동 상태](BE_FE_INTEGRATION_STATUS.md) - API 연동 상태 상세
- [로깅 구조 및 데이터 예시](LOGGING_STRUCTURE_EXAMPLES.md) - 로깅 시스템 구조
- [Google Analytics 가이드](GOOGLE_ANALYTICS_GUIDE.md) - GA 통합 가이드

---

**Last Updated:** 2025-01-XX
