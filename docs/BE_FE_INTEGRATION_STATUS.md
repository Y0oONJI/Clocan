# 백엔드-프론트엔드 연동 상태 리뷰

> 생성일: 2025-01-XX  
> 프로젝트: Clocan (Closet Canvas)

## 개요

이 문서는 백엔드(Spring Boot)와 프론트엔드(Next.js) 간의 API 연동 상태를 정확하게 분석하여 정리한 표입니다.

---

## 연동 상태 표

| 프론트엔드 페이지명 및 설명 | 백엔드 API 엔드포인트 URL 및 용도 | 호출 조건 | 실제 코드상 호출 구현 여부 | API 요청 데이터 요약 (Request Body) | API 응답 데이터 요약 (Response Body) | 성공 시 동작 또는 이동 페이지 | 실패 시 동작 또는 이동 페이지 |
|---|---|---|---|---|---|---|---|
| **메인 페이지** (`/`)<br/>서비스 소개 및 랜딩 페이지 | `GET /api/v1/feature1/ping`<br/>Feature1 연결 테스트용 핑 API | "API 테스트 (Feature1 Ping)" 버튼 클릭 시 | **O** (실제 구현됨)<br/>`src/app/page.tsx`의 `handlePingClick` 함수에서 `pingFeature1()` 호출 | 없음 (GET 요청) | `{ ok: boolean, message: string, data: { style: string, items: string[] } }`<br/>예: `{ ok: true, message: "추천 완료", data: { style: "캐주얼", items: ["아이템1", "아이템2", "아이템3"] } }` | Alert로 성공 메시지 표시<br/>`data.message` 또는 "추천 완료" 표시 | Alert로 에러 메시지 표시<br/>`alert("API 호출 실패: {error.message}")` |
| **Header 컴포넌트**<br/>전역 네비게이션 헤더 | `GET /api/v1/feature1/ping`<br/>Feature1 연결 테스트용 핑 API | "지금 추천받기" 버튼 클릭 시 | **O** (실제 구현됨)<br/>`src/components/Header.tsx`의 `handleRecommendClick` 함수에서 `pingFeature1()` 호출 | 없음 (GET 요청) | `{ ok: boolean, message: string, data: { style: string, items: string[] } }`<br/>예: `{ ok: true, message: "추천 완료", data: { style: "캐주얼", items: ["아이템1", "아이템2", "아이템3"] } }` | Toast 알림 표시<br/>성공 메시지와 스타일 정보, 아이템 개수 표시 | Toast 알림 표시 (destructive variant)<br/>에러 타입에 따른 사용자 친화적 메시지 표시 |
| **스타일 퀴즈 페이지** (`/style-quiz`)<br/>사용자 스타일 선호도 수집 퀴즈 | 없음<br/>백엔드 API 호출 없음 | - | **X** (API 호출 없음)<br/>로컬 상태만 사용 (`useQuizState` 훅) | - | - | 퀴즈 완료 후 `/style-quiz/result`로 이동<br/>URL 파라미터로 선택 항목 전달 (`styles`, `colors`, `inspirations`) | - |
| **퀴즈 결과 페이지** (`/style-quiz/result`)<br/>AI 스타일 분석 결과 표시 | 1. `GET /api/v1/health/ping`<br/>서버 연결 상태 확인<br><br>2. **Mock (실제 API 미구현)**<br/>스타일 분석 API (TODO: BE-001 완료 후 구현 예정) | 1. 페이지 로드 시 (`useEffect`)<br><br>2. 페이지 로드 시 (`useEffect` 내 `generateResult` 함수) | 1. **O** (실제 구현됨)<br/>`src/app/style-quiz/result/page.tsx`의 `HealthCheck` 컴포넌트에서 `apiGet("/health/ping")` 호출<br><br>2. **Mock** (Mock 구현)<br/>`src/app/style-quiz/result/ResultClient.tsx`의 `generateResult` 함수에서 2초 딜레이 시뮬레이션 (TODO 주석 있음) | 1. 없음 (GET 요청)<br><br>2. 없음 (현재 Mock) | 1. `"pong"` (문자열)<br><br>2. Mock 응답: 로컬에서 생성된 분석 텍스트 문자열 | 1. "서버 연결됨" 텍스트 표시<br><br>2. 분석 결과 텍스트 표시<br>선택한 스타일, 색상, 영감 기반 분석 결과 | 1. "서버 연결 실패" 텍스트 표시<br><br>2. 에러 타입별 메시지 표시:<br/>- 타임아웃: "분석 시간이 초과되었습니다"<br/>- 네트워크: "네트워크 연결을 확인해주세요"<br/>- API: "선택 데이터가 올바르지 않습니다"<br/>- 기타: "분석 중 오류가 발생했습니다"<br/>자동 재시도 (최대 3회, API 에러 제외)<br/>에러 발생 시 "퀴즈 다시 하기" 또는 "다시 시도" 버튼 표시 |
| **추천 페이지** (`/recommend`)<br/>스타일 추천 결과 페이지 | 없음<br/>백엔드 API 호출 없음 | - | **X** (페이지 비어있음)<br/>`src/app/recommend/page.tsx` 파일이 비어있음 | - | - | - | - |

---

## 백엔드 API 엔드포인트 (프론트엔드에서 미사용)

다음 백엔드 API들은 현재 프론트엔드에서 호출되지 않습니다:

| 백엔드 API 엔드포인트 | 용도 | Request Body | Response Body | 비고 |
|---|---|---|---|---|
| `POST /api/v1/auth/login` | 로그인 및 JWT 토큰 발급 | `{ email: string, password: string }` | `{ accessToken: string, tokenType: "Bearer" }` | 프론트엔드에서 호출 안 함 |
| `POST /api/v1/users/signup` | 회원가입 | `{ email: string, password: string, nickname?: string }` | `{ id: number, email: string, nickname: string, profileImageUrl: string, createdAt: string }` | 프론트엔드에서 호출 안 함 |
| `GET /api/v1/users/me` | 현재 로그인한 사용자 프로필 조회 | 없음 (인증 헤더 필요) | `{ id: number, email: string, nickname: string, profileImageUrl: string, createdAt: string }` | 프론트엔드에서 호출 안 함 |
| `GET /api/v1/users/{id}` | 특정 사용자 프로필 조회 | 없음 | `{ id: number, email: string, nickname: string, profileImageUrl: string, createdAt: string }` | 프론트엔드에서 호출 안 함 |
| `PUT /api/v1/users/{id}` | 사용자 프로필 수정 | `{ nickname?: string, profileImageUrl?: string }` | `{ id: number, email: string, nickname: string, profileImageUrl: string, createdAt: string }` | 프론트엔드에서 호출 안 함 |
| `POST /api/v1/recommend` | 스타일 추천 요청 | `{ preferences: string[] }` | `{ ok: boolean, style: string, message: string, items: string[] }` | 프론트엔드에서 호출 안 함 |

---

## 주요 발견 사항

### ✅ 구현 완료된 연동
1. **Feature1 Ping API**: 메인 페이지와 Header 컴포넌트에서 실제로 호출됨
2. **Health Check API**: 퀴즈 결과 페이지에서 서버 연결 확인용으로 호출됨

### ⚠️ Mock/미완성 연동
1. **스타일 분석 API**: 퀴즈 결과 페이지에서 Mock으로 구현되어 있음 (TODO: BE-001 완료 후 실제 API로 교체 예정)
   - 현재는 2초 딜레이 후 로컬에서 분석 텍스트 생성
   - 실제 백엔드 API (`POST /api/v1/recommend`)는 존재하지만 프론트엔드에서 호출하지 않음

### ❌ 미사용 백엔드 API
1. **인증 관련 API** (`/api/v1/auth/login`): 백엔드에 구현되어 있으나 프론트엔드에서 호출 안 함
2. **사용자 관련 API** (`/api/v1/users/*`): 백엔드에 구현되어 있으나 프론트엔드에서 호출 안 함
3. **추천 API** (`/api/v1/recommend`): 백엔드에 구현되어 있으나 프론트엔드에서 호출 안 함

### 📝 개선 제안
1. **스타일 분석 연동**: `ResultClient.tsx`의 Mock 로직을 실제 `POST /api/v1/recommend` API 호출로 교체 필요
2. **인증 기능 연동**: 로그인/회원가입 페이지가 없으므로, 필요 시 프론트엔드에 인증 페이지 추가 및 API 연동 필요
3. **추천 페이지 구현**: `/recommend` 페이지가 비어있으므로, 추천 결과 표시 페이지 구현 필요

---

## 참고 파일

### 프론트엔드
- `src/app/page.tsx` - 메인 페이지
- `src/components/Header.tsx` - Header 컴포넌트
- `src/app/style-quiz/page.tsx` - 스타일 퀴즈 페이지
- `src/app/style-quiz/result/page.tsx` - 퀴즈 결과 페이지 (Health Check)
- `src/app/style-quiz/result/ResultClient.tsx` - 퀴즈 결과 클라이언트 컴포넌트 (Mock 분석)
- `src/api/feature1.ts` - Feature1 API 클라이언트
- `src/lib/api.ts` - 공통 API 유틸리티

### 백엔드
- `backend/src/main/java/com/example/wardrobe/controller/Feature1Controller.java` - Feature1 컨트롤러
- `backend/src/main/java/com/example/wardrobe/health/HealthController.java` - Health Check 컨트롤러
- `backend/src/main/java/com/example/wardrobe/domain/auth/controller/AuthController.java` - 인증 컨트롤러
- `backend/src/main/java/com/example/wardrobe/domain/user/controller/UserController.java` - 사용자 컨트롤러
- `backend/src/main/java/com/example/wardrobe/domain/recommend/controller/RecommendController.java` - 추천 컨트롤러

---

## 업데이트 이력
- 2025-01-XX: 초기 작성
