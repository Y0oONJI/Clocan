# 백엔드-프론트엔드 연동 상태

> **작성일:** 2025-01-XX  
> **최종 업데이트:** 2025-01-XX  
> **프로젝트:** Clocan (Closet Canvas)

---

## 📋 목차

1. [개요](#개요)
2. [연동 상태 표](#연동-상태-표)
3. [요약](#요약)

---

## 개요

이 문서는 현재 프로젝트에서 프론트엔드와 백엔드 간의 API 연동 상태를 정확하게 분석하여 표로 정리합니다.

### 분석 기준

- **O**: 실제 코드에서 백엔드 API 호출 구현됨
- **X**: 구현되지 않음
- **Mock**: 모의(Mock) 데이터 또는 시뮬레이션으로 구현됨

---

## 연동 상태 표

| # | 프론트엔드 페이지명 및 설명 | 백엔드 API 엔드포인트 URL 및 용도 | 호출 조건 | 구현 여부 | API 요청 데이터 (Request Body) | API 응답 데이터 (Response Body) | 성공 시 동작/이동 페이지 | 실패 시 동작/이동 페이지 |
|---|---------------------------|--------------------------------|----------|----------|------------------------------|-------------------------------|----------------------|----------------------|
| 1 | **랜딩 페이지** (`/`)<br>메인 홈페이지, 서비스 소개 및 CTA | `GET /api/v1/feature1/ping`<br>Feature1 테스트 API (선택적 호출) | "API 테스트" 버튼 클릭 시 | ✅ **O** | 없음 (GET 요청) | ```json<br>{<br>  "ok": true,<br>  "message": "Pong from Feature1",<br>  "data": {<br>    "style": "casual",<br>    "items": []<br>  }<br>}``` | Alert로 메시지 표시<br>`alert(data.message)` | Alert로 에러 메시지 표시<br>`alert("API 호출 실패: ...")` |
| 2 | **랜딩 페이지** (`/`)<br>메인 홈페이지 | 없음<br>(페이지뷰만 추적) | 페이지 로드 시 | ✅ **O** | 없음 | 없음 | 페이지 표시 | - |
| 3 | **스타일 퀴즈 페이지** (`/style-quiz`)<br>5단계 스타일 선호도 퀴즈 | 없음<br>(프론트엔드에서만 처리) | 페이지 로드 시 | ✅ **O** | 없음 | 없음 | 퀴즈 UI 표시 | - |
| 4 | **스타일 퀴즈 완료** (`/style-quiz`)<br>퀴즈 완료 후 결과 페이지로 이동 | 없음<br>(URL 파라미터로 데이터 전달) | "Finish" 버튼 클릭 시 | ✅ **O** | 없음 (URL 파라미터 사용)<br>`?styles=...&colors=...&inspirations=...` | 없음 | `/style-quiz/result` 페이지로 이동<br>(URL 파라미터 포함) | - |
| 5 | **스타일 분석 결과 페이지** (`/style-quiz/result`)<br>AI 스타일 분석 결과 표시 | `GET /api/v1/health/ping`<br>서버 연결 상태 확인 (HealthCheck) | 페이지 로드 시<br>(useEffect) | ✅ **O** | 없음 (GET 요청) | `"pong"` (문자열) | "서버 연결됨" 메시지 표시 | "서버 연결 실패" 메시지 표시 |
| 6 | **스타일 분석 결과 페이지** (`/style-quiz/result`)<br>AI 스타일 분석 결과 표시 | 없음 (현재 Mock)<br>향후: `POST /api/v1/style-quiz/analyze` 또는<br>`POST /api/v1/recommend` | 페이지 로드 시<br>(useEffect) | ⚠️ **Mock** | 없음 (현재)<br>향후 예상:<br>```json<br>{<br>  "styles": ["modern", "minimalist"],<br>  "colors": ["neutrals", "pastels"],<br>  "inspirations": ["insp1", "insp2"]<br>}``` | Mock 데이터 (현재)<br>```json<br>{<br>  "result": "Based on your selections..."<br>}```<br>향후 예상:<br>```json<br>{<br>  "analysis": "...",<br>  "recommendations": [...]<br>}``` | 분석 결과 텍스트 표시<br>선택 항목 요약 표시 | 에러 메시지 표시<br>재시도 버튼 표시<br>퀴즈 다시 하기 버튼 표시 |
| 7 | **어드민 분석 대시보드** (`/admin/analytics`)<br>백엔드 로그 기반 통계 대시보드 | `GET /api/v1/admin/analytics/landing-page-views`<br>랜딩 페이지 접속 수 시간대별 집계 | 페이지 로드 시<br>(AnalyticsCard 컴포넌트) | ✅ **O** | 없음 (GET 요청) | ```json<br>[<br>  { "hour": 0, "count": 5 },<br>  { "hour": 1, "count": 3 },<br>  ...<br>  { "hour": 23, "count": 8 }<br>]``` | 표와 그래프로 데이터 표시 | 에러 메시지 표시<br>`<p>오류: {error}</p>` |
| 8 | **어드민 분석 대시보드** (`/admin/analytics`)<br>백엔드 로그 기반 통계 대시보드 | `GET /api/v1/admin/analytics/quiz-completions`<br>스타일 퀴즈 완료 수 시간대별 집계 | 페이지 로드 시<br>(AnalyticsCard 컴포넌트) | ✅ **O** | 없음 (GET 요청) | ```json<br>[<br>  { "hour": 0, "count": 2 },<br>  { "hour": 1, "count": 1 },<br>  ...<br>  { "hour": 23, "count": 5 }<br>]``` | 표와 그래프로 데이터 표시 | 에러 메시지 표시 |
| 9 | **어드민 분석 대시보드** (`/admin/analytics`)<br>백엔드 로그 기반 통계 대시보드 | `GET /api/v1/admin/analytics/analysis-completions`<br>AI 스타일 분석 완료 수 시간대별 집계 | 페이지 로드 시<br>(AnalyticsCard 컴포넌트) | ✅ **O** | 없음 (GET 요청) | ```json<br>[<br>  { "hour": 0, "count": 1 },<br>  { "hour": 1, "count": 0 },<br>  ...<br>  { "hour": 23, "count": 3 }<br>]``` | 표와 그래프로 데이터 표시 | 에러 메시지 표시 |
| 10 | **추천 페이지** (`/recommend`)<br>의류 추천 페이지 (현재 미구현) | 없음<br>향후: `POST /api/v1/recommend` | 페이지 로드 시 | ❌ **X** | 없음 | 없음 | - | - |

---

## 상세 분석

### 1. 랜딩 페이지 (`/`)

**파일**: `src/app/page.tsx`

#### API 호출: Feature1 Ping (선택적)

- **엔드포인트**: `GET /api/v1/feature1/ping`
- **호출 함수**: `pingFeature1()` (`src/api/feature1.ts`)
- **호출 조건**: "API 테스트" 버튼 클릭 시
- **구현 상태**: ✅ **O** (실제 구현됨)
- **요청**: GET 요청, 헤더만 포함 (`Content-Type: application/json`)
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
- **성공 시**: Alert로 메시지 표시
- **실패 시**: Alert로 에러 메시지 표시, 콘솔에 에러 로그

---

### 2. 스타일 퀴즈 페이지 (`/style-quiz`)

**파일**: `src/app/style-quiz/page.tsx`, `src/components/style-quiz.tsx`

#### API 호출: 없음

- **구현 상태**: ✅ **O** (프론트엔드에서만 처리)
- **데이터 흐름**: 
  - 사용자 선택 → 로컬 상태 저장 (`useQuizState` 훅)
  - 완료 시 URL 파라미터로 결과 페이지로 이동
- **성공 시**: `/style-quiz/result?styles=...&colors=...&inspirations=...`로 이동
- **실패 시**: 없음 (프론트엔드만 처리)

---

### 3. 스타일 분석 결과 페이지 (`/style-quiz/result`)

**파일**: `src/app/style-quiz/result/page.tsx`, `src/app/style-quiz/result/ResultClient.tsx`

#### API 호출 1: Health Check

- **엔드포인트**: `GET /api/v1/health/ping`
- **호출 함수**: `apiGet()` (`src/lib/api.ts`)
- **호출 조건**: 페이지 로드 시 (`useEffect` in `HealthCheck` 컴포넌트)
- **구현 상태**: ✅ **O** (실제 구현됨)
- **요청**: GET 요청, 헤더만 포함
- **응답**: `"pong"` (문자열)
- **성공 시**: "서버 연결됨" 메시지 표시
- **실패 시**: "서버 연결 실패" 메시지 표시

#### API 호출 2: AI 분석 (Mock)

- **엔드포인트**: 없음 (현재 Mock)
- **향후 예상**: `POST /api/v1/style-quiz/analyze` 또는 `POST /api/v1/recommend`
- **호출 조건**: 페이지 로드 시 (`useEffect`)
- **구현 상태**: ⚠️ **Mock** (시뮬레이션)
- **현재 구현**:
  ```typescript
  // AI 호출 시뮬레이션 (2초 딜레이)
  // TODO: 실제 API 호출로 교체 (BE-001 완료 후)
  await new Promise((resolve) => setTimeout(resolve, 2000));
  ```
- **요청 데이터**: 없음 (현재)
- **응답 데이터**: Mock 텍스트 결과
- **성공 시**: 분석 결과 텍스트 표시, 선택 항목 요약 표시
- **실패 시**: 
  - 에러 메시지 표시
  - 재시도 버튼 표시 (최대 3회)
  - "퀴즈 다시 하기" 버튼 표시
  - "홈으로 이동" 버튼 표시

---

### 4. 어드민 분석 대시보드 (`/admin/analytics`)

**파일**: `src/app/admin/analytics/page.tsx`, `src/components/admin/AnalyticsCard.tsx`

#### API 호출 1: 랜딩 페이지 접속 수

- **엔드포인트**: `GET /api/v1/admin/analytics/landing-page-views`
- **호출 함수**: `apiGet()` (`src/lib/api.ts`)
- **호출 조건**: 페이지 로드 시 (`useEffect`)
- **구현 상태**: ✅ **O** (실제 구현됨)
- **요청**: GET 요청, 헤더만 포함
- **응답**: 
  ```json
  [
    { "hour": 0, "count": 5 },
    { "hour": 1, "count": 3 },
    ...
    { "hour": 23, "count": 8 }
  ]
  ```
- **성공 시**: 표와 그래프로 시간대별 데이터 표시
- **실패 시**: 에러 메시지 표시

#### API 호출 2: 퀴즈 완료 수

- **엔드포인트**: `GET /api/v1/admin/analytics/quiz-completions`
- **구현 상태**: ✅ **O**
- **응답 형식**: 동일 (시간대별 집계)

#### API 호출 3: AI 분석 완료 수

- **엔드포인트**: `GET /api/v1/admin/analytics/analysis-completions`
- **구현 상태**: ✅ **O**
- **응답 형식**: 동일 (시간대별 집계)

---

## 백엔드 API 엔드포인트 현황

### 구현된 엔드포인트

| 엔드포인트 | 메서드 | 용도 | 인증 필요 | 상태 |
|-----------|--------|------|----------|------|
| `/api/v1/feature1/ping` | GET | Feature1 테스트 API | ❌ | ✅ 구현됨 |
| `/api/v1/health/ping` | GET | 헬스 체크 | ❌ | ✅ 구현됨 |
| `/api/v1/admin/analytics/landing-page-views` | GET | 랜딩 페이지 접속 수 집계 | ❌ | ✅ 구현됨 |
| `/api/v1/admin/analytics/quiz-completions` | GET | 퀴즈 완료 수 집계 | ❌ | ✅ 구현됨 |
| `/api/v1/admin/analytics/analysis-completions` | GET | AI 분석 완료 수 집계 | ❌ | ✅ 구현됨 |

### 계획된 엔드포인트 (아직 미구현)

| 엔드포인트 | 메서드 | 용도 | 상태 |
|-----------|--------|------|------|
| `/api/v1/style-quiz/analyze` | POST | 스타일 분석 요청 | ❌ 미구현 |
| `/api/v1/recommend` | POST | 의류 추천 | ❌ 미구현 |
| `/api/v1/auth/signup` | POST | 회원가입 | ❌ 미구현 |
| `/api/v1/auth/login` | POST | 로그인 | ❌ 미구현 |
| `/api/v1/users/{userId}` | GET/PUT | 사용자 프로필 | ❌ 미구현 |
| `/api/v1/wishlists` | GET/POST | 위시리스트 관리 | ❌ 미구현 |

---

## 요약

### 구현 현황

| 구분 | 개수 | 비율 |
|------|------|------|
| **실제 구현됨 (O)** | 6개 | 60.0% |
| **Mock 구현 (Mock)** | 1개 | 10.0% |
| **미구현 (X)** | 3개 | 30.0% |
| **전체** | 10개 | 100% |

### 주요 발견 사항

1. **어드민 대시보드**: 완전히 구현됨 (3개 API 엔드포인트)
2. **Feature1 Ping**: 테스트용 API 구현됨
3. **스타일 분석**: 현재 Mock으로 구현, 실제 API 연동 필요
4. **인증/사용자 관리**: 아직 미구현
5. **위시리스트/추천**: 아직 미구현

### 다음 단계

1. **우선순위 높음**: 스타일 분석 API 실제 연동 (`POST /api/v1/style-quiz/analyze`)
2. **우선순위 중간**: 인증 시스템 구현 (`/api/v1/auth/*`)
3. **우선순위 낮음**: 위시리스트 및 추천 기능

---

## 참고 문서

- [Backend Requirements](./20_BE_REQUIREMENTS.md) - 백엔드 요구사항
- [Admin Analytics Implementation Plan](./ADMIN_ANALYTICS_IMPLEMENTATION_PLAN.md) - 어드민 대시보드 구현 계획
- [Google Analytics Guide](./GOOGLE_ANALYTICS_GUIDE.md) - GA 통합 가이드

---

**Last Updated:** 2025-01-XX
