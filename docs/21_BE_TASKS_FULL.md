# Backend Tasks - Full Version

**프로젝트:** Closet Canvas Backend  
**작성일:** 2025-12-07  
**버전:** 1.0  
**기반 문서:** [20_BE_REQUIREMENTS.md](./20_BE_REQUIREMENTS.md)

---

## 📋 목차

1. [개요](#개요)
2. [Functional Tasks](#functional-tasks)
3. [Non-Functional Tasks](#non-functional-tasks)
4. [실행 우선순위](#실행-우선순위)
5. [의존성 그래프](#의존성-그래프)

---

## 개요

백엔드 요구사항(REQ-FUNC-001 ~ 012, REQ-NF-001 ~ 006)을 실제 개발 가능한 Task 단위로 세분화한 문서입니다.

### 통계
- **Functional Tasks:** 35개
- **Non-Functional Tasks:** 8개
- **총 Tasks:** 43개
- **예상 총 시간:** 약 180-220시간 (4-5개월)

---

## Functional Tasks

### 🔐 회원/계정 관리 (REQ-FUNC-001, 002)

| Task ID | Related REQ | Title | 설명 | 난이도 | 선행 작업 |
|---------|-------------|-------|------|--------|----------|
| **FN-001-BE-001** | REQ-FUNC-001 | User Entity 및 Repository 생성 | User 엔티티, UserRepository 인터페이스, 기본 CRUD 메서드 작성 | Low | - |
| **FN-001-BE-002** | REQ-FUNC-001 | Spring Security 및 JWT 설정 | SecurityConfig, JwtTokenProvider, JwtAuthenticationFilter 구현 | High | FN-001-BE-001 |
| **FN-001-BE-003** | REQ-FUNC-001 | 회원가입 API 구현 | POST /api/v1/auth/signup, 이메일 중복 체크, 비밀번호 암호화(BCrypt) | Mid | FN-001-BE-002 |
| **FN-001-BE-004** | REQ-FUNC-001 | 로그인 API 구현 | POST /api/v1/auth/login, JWT Access/Refresh 토큰 발급 | Mid | FN-001-BE-003 |
| **FN-001-BE-005** | REQ-FUNC-001 | 토큰 갱신 및 로그아웃 API | POST /api/v1/auth/refresh, POST /api/v1/auth/logout, 토큰 블랙리스트 관리 | Mid | FN-001-BE-004 |
| **FN-001-BE-006** | REQ-FUNC-001 | Google OAuth2 소셜 로그인 | OAuth2 Client 설정, Google 로그인 연동, 계정 자동 생성 | High | FN-001-BE-004 |
| **FN-002-BE-001** | REQ-FUNC-002 | 프로필 조회/수정 API | GET/PUT /api/v1/users/{userId}, DTO 변환, 본인 확인 로직 | Low | FN-001-BE-001 |
| **FN-002-BE-002** | REQ-FUNC-002 | 프로필 이미지 업로드 | POST /api/v1/users/{userId}/profile-image, Multipart 처리, S3/Firebase Storage 연동 | Mid | FN-002-BE-001 |
| **FN-002-BE-003** | REQ-FUNC-002 | 회원 탈퇴 (Soft Delete) | DELETE /api/v1/users/{userId}, soft delete 구현, 연관 데이터 처리 | Mid | FN-002-BE-001 |

---

### 📦 위시리스트 관리 (REQ-FUNC-003, 004, 011)

| Task ID | Related REQ | Title | 설명 | 난이도 | 선행 작업 |
|---------|-------------|-------|------|--------|----------|
| **FN-003-BE-001** | REQ-FUNC-003, 004 | Wishlist & WishlistItem Entity 생성 | Wishlist, WishlistItem 엔티티, OneToMany 관계 설정, Repository 생성 | Low | FN-001-BE-001 |
| **FN-003-BE-002** | REQ-FUNC-004 | Wishlist CRUD API | POST/GET/PUT/DELETE /api/v1/wishlists, 사용자별 위시리스트 조회 | Mid | FN-003-BE-001 |
| **FN-003-BE-003** | REQ-FUNC-004 | WishlistItem CRUD API | POST/GET/PUT/DELETE /api/v1/wishlists/{id}/items, 페이지네이션 구현 | Mid | FN-003-BE-002 |
| **FN-003-BE-004** | REQ-FUNC-003 | URL 메타데이터 추출 서비스 | Jsoup으로 Open Graph 태그 파싱, 상품 정보 자동 추출 | High | - |
| **FN-003-BE-005** | REQ-FUNC-003 | 메타데이터 추출 API | POST /api/v1/wishlists/{id}/items/extract-metadata, 비동기 처리, 타임아웃 10초 | Mid | FN-003-BE-004 |
| **FN-003-BE-006** | REQ-FUNC-004 | 위시리스트 필터링 및 정렬 | QueryDSL로 동적 쿼리, 카테고리/가격대/브랜드 필터, 정렬(최신/가격) | Mid | FN-003-BE-003 |
| **FN-011-BE-001** | REQ-FUNC-011 | 위시리스트 공유 기능 | 공개/비공개 설정, UUID 공유 토큰 생성, GET /api/v1/wishlists/shared/{token} | Mid | FN-003-BE-002 |
| **FN-011-BE-002** | REQ-FUNC-011 | 위시리스트 좋아요 기능 | POST /api/v1/wishlists/{id}/like, 좋아요 수 집계, 중복 방지 | Low | FN-011-BE-001 |

---

### 👔 옷장 관리 (REQ-FUNC-005)

| Task ID | Related REQ | Title | 설명 | 난이도 | 선행 작업 |
|---------|-------------|-------|------|--------|----------|
| **FN-005-BE-001** | REQ-FUNC-005 | Closet & ClosetItem Entity 생성 | Closet, ClosetItem 엔티티, Repository, ItemCategory/Color Enum 정의 | Low | FN-001-BE-001 |
| **FN-005-BE-002** | REQ-FUNC-005 | Closet CRUD API | POST/GET/PUT/DELETE /api/v1/closets, 사용자별 옷장 관리 | Mid | FN-005-BE-001 |
| **FN-005-BE-003** | REQ-FUNC-005 | ClosetItem CRUD API | POST/GET/PUT/DELETE /api/v1/closets/{id}/items, 카테고리별 조회 | Mid | FN-005-BE-002 |
| **FN-005-BE-004** | REQ-FUNC-005 | 아이템 이미지 다중 업로드 | POST /api/v1/closets/{id}/items/{itemId}/images, 최대 5장, 이미지 리사이징 | Mid | FN-005-BE-003 |
| **FN-005-BE-005** | REQ-FUNC-005 | 착용 기록 관리 | WearingHistory 엔티티, POST /api/v1/closets/items/{id}/wear, 착용 횟수 집계 | Low | FN-005-BE-003 |

---

### 🎨 스타일 프로필 (REQ-FUNC-006)

| Task ID | Related REQ | Title | 설명 | 난이도 | 선행 작업 |
|---------|-------------|-------|------|--------|----------|
| **FN-006-BE-001** | REQ-FUNC-006 | StyleProfile Entity 생성 | StyleProfile 엔티티, @ElementCollection으로 styles/colors/inspirations 저장 | Low | FN-001-BE-001 |
| **FN-006-BE-002** | REQ-FUNC-006 | 스타일 프로필 저장/조회 API | POST/GET /api/v1/users/{userId}/style-profiles, 버전 관리, isActive 플래그 | Mid | FN-006-BE-001 |
| **FN-006-BE-003** | REQ-FUNC-006 | 프로필 히스토리 조회 | GET /api/v1/users/{userId}/style-profiles?page=0, 과거 프로필 조회 | Low | FN-006-BE-002 |

---

### 🤖 AI 통합 (REQ-FUNC-007, 008, 009)

| Task ID | Related REQ | Title | 설명 | 난이도 | 선행 작업 |
|---------|-------------|-------|------|--------|----------|
| **FN-007-BE-001** | REQ-FUNC-007 | Gemini API Client 구성 | WebClient로 Gemini API 호출 클래스, 환경 변수로 API 키 관리 | Mid | - |
| **FN-007-BE-002** | REQ-FUNC-007 | 스타일 분석 서비스 | POST /api/v1/ai/analyze-style, 프롬프트 템플릿, 비동기 처리(@Async) | High | FN-007-BE-001, FN-006-BE-001 |
| **FN-007-BE-003** | REQ-FUNC-007 | AI 응답 캐싱 | Redis로 분석 결과 캐싱(TTL 24시간), 캐시 키 생성 로직 | Mid | FN-007-BE-002 |
| **FN-008-BE-001** | REQ-FUNC-008 | 코디 추천 Entity 생성 | OutfitRecommendation 엔티티, JSON 컬럼으로 아이템 조합 저장 | Low | FN-003-BE-001 |
| **FN-008-BE-002** | REQ-FUNC-008 | 위시리스트 기반 코디 생성 API | POST /api/v1/recommendations/outfits, Gemini로 코디 조합 생성 | High | FN-008-BE-001, FN-007-BE-001 |
| **FN-008-BE-003** | REQ-FUNC-008 | 코디 저장 및 좋아요 | GET/POST /api/v1/recommendations/outfits, 좋아요 기능, 히스토리 | Mid | FN-008-BE-002 |
| **FN-009-BE-001** | REQ-FUNC-009 | 유사 아이템 검색 서비스 | POST /api/v1/items/search/similar, Gemini API로 텍스트 기반 검색 | High | FN-007-BE-001 |
| **FN-009-BE-002** | REQ-FUNC-009 | 검색 결과 필터링 | 가격대/색상/카테고리 필터링, 정렬, 페이지네이션 | Mid | FN-009-BE-001 |

---

### 🎯 추천 시스템 (REQ-FUNC-010)

| Task ID | Related REQ | Title | 설명 | 난이도 | 선행 작업 |
|---------|-------------|-------|------|--------|----------|
| **FN-010-BE-001** | REQ-FUNC-010 | 추천 알고리즘 기반 설계 | 스타일 매칭(40%), 가격대(20%), 트렌드(20%), 협업 필터링(20%) 점수 계산 로직 | High | FN-006-BE-002 |
| **FN-010-BE-002** | REQ-FUNC-010 | 개인화 추천 피드 API | GET /api/v1/recommendations/feed, 사용자별 추천 아이템 생성 | High | FN-010-BE-001 |
| **FN-010-BE-003** | REQ-FUNC-010 | 트렌드 아이템 집계 | GET /api/v1/recommendations/trending, 좋아요/조회수 기반 인기 아이템 | Mid | FN-003-BE-003 |
| **FN-010-BE-004** | REQ-FUNC-010 | 협업 필터링 구현 | 유사 사용자 찾기, 그들의 위시리스트에서 추천 | High | FN-010-BE-002 |

---

### 📢 알림 시스템 (REQ-FUNC-012)

| Task ID | Related REQ | Title | 설명 | 난이도 | 선행 작업 |
|---------|-------------|-------|------|--------|----------|
| **FN-012-BE-001** | REQ-FUNC-012 | Notification Entity 생성 | Notification 엔티티, NotificationType Enum, Repository | Low | FN-001-BE-001 |
| **FN-012-BE-002** | REQ-FUNC-012 | 가격 변동 추적 배치 | @Scheduled 배치 작업, 가격 크롤링, PriceHistory 저장 | High | FN-003-BE-003 |
| **FN-012-BE-003** | REQ-FUNC-012 | 알림 발송 서비스 | 이메일 알림(JavaMailSender), 푸시 알림(FCM) 템플릿 기반 발송 | Mid | FN-012-BE-001 |
| **FN-012-BE-004** | REQ-FUNC-012 | 알림 조회 및 설정 API | GET /api/v1/notifications, POST /api/v1/notifications/settings | Low | FN-012-BE-001 |

---

## Functional Tasks - 전체 표 (35개)

| Task ID | Related REQ | Title | 난이도 | 예상 시간 |
|---------|-------------|-------|--------|----------|
| **FN-001-BE-001** | REQ-FUNC-001 | User Entity 및 Repository 생성 | Low | 2h |
| **FN-001-BE-002** | REQ-FUNC-001 | Spring Security 및 JWT 설정 | High | 6h |
| **FN-001-BE-003** | REQ-FUNC-001 | 회원가입 API 구현 | Mid | 4h |
| **FN-001-BE-004** | REQ-FUNC-001 | 로그인 API 구현 | Mid | 4h |
| **FN-001-BE-005** | REQ-FUNC-001 | 토큰 갱신 및 로그아웃 API | Mid | 3h |
| **FN-001-BE-006** | REQ-FUNC-001 | Google OAuth2 소셜 로그인 | High | 6h |
| **FN-002-BE-001** | REQ-FUNC-002 | 프로필 조회/수정 API | Low | 3h |
| **FN-002-BE-002** | REQ-FUNC-002 | 프로필 이미지 업로드 | Mid | 4h |
| **FN-002-BE-003** | REQ-FUNC-002 | 회원 탈퇴 (Soft Delete) | Mid | 3h |
| **FN-003-BE-001** | REQ-FUNC-003, 004 | Wishlist & WishlistItem Entity 생성 | Low | 3h |
| **FN-003-BE-002** | REQ-FUNC-004 | Wishlist CRUD API | Mid | 4h |
| **FN-003-BE-003** | REQ-FUNC-004 | WishlistItem CRUD API | Mid | 5h |
| **FN-003-BE-004** | REQ-FUNC-003 | URL 메타데이터 추출 서비스 | High | 8h |
| **FN-003-BE-005** | REQ-FUNC-003 | 메타데이터 추출 API | Mid | 4h |
| **FN-003-BE-006** | REQ-FUNC-004 | 위시리스트 필터링 및 정렬 | Mid | 5h |
| **FN-005-BE-001** | REQ-FUNC-005 | Closet & ClosetItem Entity 생성 | Low | 3h |
| **FN-005-BE-002** | REQ-FUNC-005 | Closet CRUD API | Mid | 4h |
| **FN-005-BE-003** | REQ-FUNC-005 | ClosetItem CRUD API | Mid | 5h |
| **FN-005-BE-004** | REQ-FUNC-005 | 아이템 이미지 다중 업로드 | Mid | 5h |
| **FN-005-BE-005** | REQ-FUNC-005 | 착용 기록 관리 | Low | 3h |
| **FN-006-BE-001** | REQ-FUNC-006 | StyleProfile Entity 생성 | Low | 2h |
| **FN-006-BE-002** | REQ-FUNC-006 | 스타일 프로필 저장/조회 API | Mid | 4h |
| **FN-006-BE-003** | REQ-FUNC-006 | 프로필 히스토리 조회 | Low | 2h |
| **FN-007-BE-001** | REQ-FUNC-007 | Gemini API Client 구성 | Mid | 5h |
| **FN-007-BE-002** | REQ-FUNC-007 | 스타일 분석 서비스 | High | 8h |
| **FN-007-BE-003** | REQ-FUNC-007 | AI 응답 캐싱 | Mid | 4h |
| **FN-008-BE-001** | REQ-FUNC-008 | 코디 추천 Entity 생성 | Low | 2h |
| **FN-008-BE-002** | REQ-FUNC-008 | 위시리스트 기반 코디 생성 API | High | 8h |
| **FN-008-BE-003** | REQ-FUNC-008 | 코디 저장 및 좋아요 | Mid | 4h |
| **FN-009-BE-001** | REQ-FUNC-009 | 유사 아이템 검색 서비스 | High | 6h |
| **FN-009-BE-002** | REQ-FUNC-009 | 검색 결과 필터링 | Mid | 4h |
| **FN-010-BE-001** | REQ-FUNC-010 | 추천 알고리즘 기반 설계 | High | 8h |
| **FN-010-BE-002** | REQ-FUNC-010 | 개인화 추천 피드 API | High | 8h |
| **FN-010-BE-003** | REQ-FUNC-010 | 트렌드 아이템 집계 | Mid | 4h |
| **FN-010-BE-004** | REQ-FUNC-010 | 협업 필터링 구현 | High | 8h |
| **FN-011-BE-001** | REQ-FUNC-011 | 위시리스트 공유 기능 | Mid | 4h |
| **FN-011-BE-002** | REQ-FUNC-011 | 위시리스트 좋아요 기능 | Low | 2h |
| **FN-012-BE-001** | REQ-FUNC-012 | Notification Entity 생성 | Low | 2h |
| **FN-012-BE-002** | REQ-FUNC-012 | 가격 변동 추적 배치 | High | 8h |
| **FN-012-BE-003** | REQ-FUNC-012 | 알림 발송 서비스 | Mid | 6h |
| **FN-012-BE-004** | REQ-FUNC-012 | 알림 조회 및 설정 API | Low | 3h |

**Functional Tasks 소계:** 35개, 약 163시간

---

## Non-Functional Tasks

### ⚙️ 인프라 및 품질 (REQ-NF-001 ~ 006)

| Task ID | Related REQ | Title | 설명 | 난이도 | 선행 작업 |
|---------|-------------|-------|------|--------|----------|
| **NF-001-BE-001** | REQ-NF-001 | DB 인덱싱 전략 수립 및 적용 | 주요 쿼리 분석, 인덱스 생성(user_id, email, category), 실행 계획 검증 | Mid | FN-001-BE-001, FN-003-BE-001 |
| **NF-001-BE-002** | REQ-NF-001 | Redis 캐싱 설정 | Redis 연동, @Cacheable 설정, 캐시 전략(스타일 분석, 메타데이터) | Mid | - |
| **NF-001-BE-003** | REQ-NF-001 | API 성능 테스트 및 최적화 | JMeter/Gatling으로 부하 테스트, N+1 쿼리 해결, Batch Fetch | High | 모든 API 구현 후 |
| **NF-002-BE-001** | REQ-NF-002 | DB 커넥션 풀 설정 | HikariCP 설정, 적정 풀 크기 산정, 모니터링 | Low | - |
| **NF-002-BE-002** | REQ-NF-002 | Stateless 아키텍처 검증 | 세션 사용 제거, JWT만 사용, 수평 확장 가능 확인 | Mid | FN-001-BE-002 |
| **NF-003-BE-001** | REQ-NF-003 | API Rate Limiting 구현 | Bucket4j 또는 Spring Cloud Gateway로 Rate Limiting, IP/사용자별 제한 | Mid | FN-001-BE-004 |
| **NF-003-BE-002** | REQ-NF-003 | 보안 감사 및 취약점 점검 | OWASP Top 10 점검, SQL Injection 테스트, XSS 방어 확인 | High | 모든 API 구현 후 |
| **NF-004-BE-001** | REQ-NF-004 | 트랜잭션 격리 수준 설정 | @Transactional 설정, 낙관적 락(@Version) 적용, 데드락 방지 | Mid | 주요 API 구현 후 |
| **NF-005-BE-001** | REQ-NF-005 | 로깅 및 모니터링 설정 | Logback JSON 로그, Sentry 연동, Actuator 설정, Prometheus | Mid | - |
| **NF-005-BE-002** | REQ-NF-005 | Health Check 및 메트릭 | /actuator/health, custom health indicator, 주요 메트릭 정의 | Low | NF-005-BE-001 |
| **NF-006-BE-001** | REQ-NF-006 | JUnit 테스트 환경 설정 | JUnit 5, Mockito, Testcontainers(MySQL), @SpringBootTest 설정 | Mid | - |
| **NF-006-BE-002** | REQ-NF-006 | 단위 테스트 작성 | Service 계층 단위 테스트, 목표 커버리지 70% | High | 주요 서비스 구현 후 |
| **NF-006-BE-003** | REQ-NF-006 | 통합 테스트 작성 | Controller 통합 테스트, MockMvc, 주요 플로우 E2E | High | 주요 API 구현 후 |
| **NF-006-BE-004** | REQ-NF-006 | API 문서 자동 생성 | SpringDoc OpenAPI 3 설정, Swagger UI, @Operation 어노테이션 | Low | - |

**Non-Functional Tasks 소계:** 14개, 약 50시간

---

## 실행 우선순위

### 🚀 Phase 1: 기반 구축 (Week 1-2, 25시간)

**목표:** 프로젝트 세팅, 인증, 기본 CRUD

| 순서 | Task ID | Title | 시간 | 누적 |
|------|---------|-------|------|------|
| 1 | **NF-006-BE-001** | JUnit 테스트 환경 설정 | 3h | 3h |
| 2 | **NF-005-BE-001** | 로깅 및 모니터링 설정 | 3h | 6h |
| 3 | **FN-001-BE-001** | User Entity 및 Repository 생성 | 2h | 8h |
| 4 | **FN-001-BE-002** | Spring Security 및 JWT 설정 | 6h | 14h |
| 5 | **FN-001-BE-003** | 회원가입 API 구현 | 4h | 18h |
| 6 | **FN-001-BE-004** | 로그인 API 구현 | 4h | 22h |
| 7 | **FN-001-BE-005** | 토큰 갱신 및 로그아웃 API | 3h | 25h |

---

### 🎯 Phase 2: 핵심 도메인 (Week 3-4, 35시간)

**목표:** 위시리스트, 옷장, 스타일 프로필

| 순서 | Task ID | Title | 시간 | 누적 |
|------|---------|-------|------|------|
| 8 | **FN-003-BE-001** | Wishlist & WishlistItem Entity | 3h | 28h |
| 9 | **FN-003-BE-002** | Wishlist CRUD API | 4h | 32h |
| 10 | **FN-003-BE-003** | WishlistItem CRUD API | 5h | 37h |
| 11 | **FN-003-BE-006** | 위시리스트 필터링 및 정렬 | 5h | 42h |
| 12 | **FN-006-BE-001** | StyleProfile Entity 생성 | 2h | 44h |
| 13 | **FN-006-BE-002** | 스타일 프로필 저장/조회 API | 4h | 48h |
| 14 | **FN-005-BE-001** | Closet & ClosetItem Entity | 3h | 51h |
| 15 | **FN-005-BE-002** | Closet CRUD API | 4h | 55h |
| 16 | **FN-005-BE-003** | ClosetItem CRUD API | 5h | 60h |

---

### 🤖 Phase 3: AI 통합 (Week 5-6, 40시간)

**목표:** Gemini API, 메타데이터 추출, 스타일 분석

| 순서 | Task ID | Title | 시간 | 누적 |
|------|---------|-------|------|------|
| 17 | **NF-001-BE-002** | Redis 캐싱 설정 | 3h | 63h |
| 18 | **FN-007-BE-001** | Gemini API Client 구성 | 5h | 68h |
| 19 | **FN-007-BE-002** | 스타일 분석 서비스 | 8h | 76h |
| 20 | **FN-007-BE-003** | AI 응답 캐싱 | 4h | 80h |
| 21 | **FN-003-BE-004** | URL 메타데이터 추출 서비스 | 8h | 88h |
| 22 | **FN-003-BE-005** | 메타데이터 추출 API | 4h | 92h |
| 23 | **FN-008-BE-001** | 코디 추천 Entity 생성 | 2h | 94h |
| 24 | **FN-008-BE-002** | 위시리스트 기반 코디 생성 API | 8h | 102h |
| 25 | **FN-009-BE-001** | 유사 아이템 검색 서비스 | 6h | 108h |

---

### 🎨 Phase 4: 고급 기능 (Week 7-8, 35시간)

**목표:** 추천 시스템, 알림, 공유

| 순서 | Task ID | Title | 시간 | 누적 |
|------|---------|-------|------|------|
| 26 | **FN-010-BE-001** | 추천 알고리즘 기반 설계 | 8h | 116h |
| 27 | **FN-010-BE-002** | 개인화 추천 피드 API | 8h | 124h |
| 28 | **FN-010-BE-003** | 트렌드 아이템 집계 | 4h | 128h |
| 29 | **FN-011-BE-001** | 위시리스트 공유 기능 | 4h | 132h |
| 30 | **FN-011-BE-002** | 위시리스트 좋아요 기능 | 2h | 134h |
| 31 | **FN-012-BE-001** | Notification Entity 생성 | 2h | 136h |
| 32 | **FN-012-BE-002** | 가격 변동 추적 배치 | 8h | 144h |
| 33 | **FN-012-BE-003** | 알림 발송 서비스 | 6h | 150h |
| 34 | **FN-001-BE-006** | Google OAuth2 소셜 로그인 | 6h | 156h |
| 35 | **FN-010-BE-004** | 협업 필터링 구현 | 8h | 164h |

---

### 🔬 Phase 5: 품질 & 최적화 (Week 9-10, 30시간)

**목표:** 테스트, 성능, 보안

| 순서 | Task ID | Title | 시간 | 누적 |
|------|---------|-------|------|------|
| 36 | **NF-006-BE-002** | 단위 테스트 작성 (70% 목표) | 12h | 176h |
| 37 | **NF-006-BE-003** | 통합 테스트 작성 | 8h | 184h |
| 38 | **NF-001-BE-001** | DB 인덱싱 전략 적용 | 4h | 188h |
| 39 | **NF-001-BE-003** | API 성능 테스트 및 최적화 | 6h | 194h |
| 40 | **NF-003-BE-001** | API Rate Limiting 구현 | 3h | 197h |
| 41 | **NF-003-BE-002** | 보안 감사 및 취약점 점검 | 6h | 203h |
| 42 | **NF-004-BE-001** | 트랜잭션 격리 수준 설정 | 3h | 206h |
| 43 | **NF-006-BE-004** | API 문서 자동 생성 | 2h | 208h |

**Total:** 43개 Tasks, 약 208시간 (약 5-6개월)

---

## 의존성 그래프

### 🔗 주요 의존 관계

```
기반 작업 (병렬 가능)
├── FN-001-BE-001 (User Entity) ⭐ 시작점
├── NF-006-BE-001 (테스트 설정)
├── NF-005-BE-001 (로깅)
└── FN-007-BE-001 (Gemini Client)

↓

인증 플로우 (순차)
FN-001-BE-002 (Security) 
  → FN-001-BE-003 (회원가입)
  → FN-001-BE-004 (로그인)
  → FN-001-BE-005 (토큰)

↓

도메인 구현 (병렬 가능)
├── FN-003-BE-001 (Wishlist) → FN-003-BE-002 → FN-003-BE-003
├── FN-005-BE-001 (Closet) → FN-005-BE-002 → FN-005-BE-003
└── FN-006-BE-001 (StyleProfile) → FN-006-BE-002

↓

AI 기능 (순차)
FN-007-BE-002 (스타일 분석)
  → FN-008-BE-002 (코디 추천)
  → FN-009-BE-001 (유사 검색)
  → FN-010-BE-002 (추천 피드)

↓

고급 기능 (병렬 가능)
├── FN-011-BE-001 (공유)
├── FN-012-BE-002 (가격 추적)
└── FN-010-BE-004 (협업 필터링)

↓

품질 향상 (마지막)
├── NF-006-BE-002 (단위 테스트)
├── NF-006-BE-003 (통합 테스트)
└── NF-001-BE-003 (성능 최적화)
```

---

## 난이도별 분류

### 🟢 Low (13개, 31시간)
- Entity 생성, 간단한 CRUD, 조회 API 등
- 초보자도 가능

### 🟡 Mid (20개, 89시간)
- API 구현, 필터링, 이미지 업로드 등
- 경험 필요

### 🔴 High (10개, 88시간)
- Security, AI 통합, 추천 알고리즘, 성능 최적화 등
- 시니어 수준

---

## 카테고리별 통계

| 카테고리 | Tasks | 시간 | 비율 |
|----------|-------|------|------|
| 인증/회원 | 9개 | 35h | 17% |
| 위시리스트 | 8개 | 38h | 18% |
| 옷장 | 5개 | 20h | 10% |
| 스타일 프로필 | 3개 | 8h | 4% |
| AI 통합 | 9개 | 49h | 24% |
| 추천 시스템 | 6개 | 32h | 15% |
| 알림 | 4개 | 19h | 9% |
| 인프라/품질 | 14개 | 50h | 24% |
| **합계** | **43개** | **208h** | **100%** |

---

## 주간 목표 (8시간/일, 5일/주 기준)

| 주차 | Phase | Tasks | 목표 시간 | 누적 |
|------|-------|-------|----------|------|
| Week 1 | Phase 1 (1/2) | Task 1-4 | 17h | 17h |
| Week 2 | Phase 1 (2/2) | Task 5-7 | 11h | 28h |
| Week 3 | Phase 2 (1/2) | Task 8-11 | 17h | 45h |
| Week 4 | Phase 2 (2/2) | Task 12-16 | 22h | 67h |
| Week 5 | Phase 3 (1/2) | Task 17-20 | 20h | 87h |
| Week 6 | Phase 3 (2/2) | Task 21-25 | 30h | 117h |
| Week 7 | Phase 4 (1/2) | Task 26-30 | 26h | 143h |
| Week 8 | Phase 4 (2/2) | Task 31-35 | 20h | 163h |
| Week 9 | Phase 5 (1/2) | Task 36-39 | 30h | 193h |
| Week 10 | Phase 5 (2/2) | Task 40-43 | 14h | 207h |

**총 소요 예상:** 10주 (2.5개월)

---

## Task 상세 예시

### FN-001-BE-002: Spring Security 및 JWT 설정

**Related REQ:** REQ-FUNC-001

**설명:**
```
Spring Security 6.x 설정, JWT 토큰 생성/검증 로직 구현
- SecurityConfig: SecurityFilterChain 설정
- JwtTokenProvider: 토큰 생성/파싱/검증
- JwtAuthenticationFilter: 요청 인터셉트 및 인증
- 예외 처리: AuthenticationEntryPoint, AccessDeniedHandler
```

**구현 파일:**
```
src/main/java/com/example/wardrobe/
├── config/SecurityConfig.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   ├── CustomAuthenticationEntryPoint.java
│   └── CustomAccessDeniedHandler.java
└── dto/auth/
    ├── LoginRequest.java
    └── TokenResponse.java
```

**예상 난이도:** High (6시간)

**선행 작업:** FN-001-BE-001 (User Entity 필요)

**Acceptance Criteria:**
- [ ] JWT 토큰 생성 및 검증 동작
- [ ] /api/v1/auth/** 제외 모든 API 인증 필요
- [ ] 만료된 토큰 거부
- [ ] 테스트 코드 작성

---

### FN-003-BE-004: URL 메타데이터 추출 서비스

**Related REQ:** REQ-FUNC-003

**설명:**
```
Jsoup으로 HTML 파싱, Open Graph 메타 태그 추출
- 상품 URL 입력 → HTML 다운로드
- og:title, og:image, og:price 파싱
- 타임아웃 처리 (10초)
- 에러 처리 (404, 파싱 실패 등)
```

**구현 파일:**
```
src/main/java/com/example/wardrobe/
├── domain/wishlist/service/MetadataExtractorService.java
├── domain/wishlist/dto/MetadataDTO.java
└── config/JsoupConfig.java
```

**예상 난이도:** High (8시간)

**선행 작업:** 없음 (독립적)

**Acceptance Criteria:**
- [ ] 주요 쇼핑몰 URL 파싱 성공 (무신사, 29cm, 에이블리)
- [ ] 타임아웃 10초 설정
- [ ] 파싱 실패 시 기본값 반환
- [ ] 단위 테스트 작성

---

### FN-010-BE-001: 추천 알고리즘 기반 설계

**Related REQ:** REQ-FUNC-010

**설명:**
```
개인화 추천 점수 계산 로직 설계 및 구현
- 스타일 매칭 40%: 사용자 프로필 vs 아이템 스타일 유사도
- 가격대 20%: 사용자 평균 구매 가격 vs 아이템 가격
- 트렌드 20%: 조회수, 좋아요 수 기반
- 협업 필터링 20%: 유사 사용자의 선호도
```

**구현 파일:**
```
src/main/java/com/example/wardrobe/
├── domain/recommendation/service/RecommendationScoreCalculator.java
├── domain/recommendation/dto/ScoredItemDTO.java
└── domain/recommendation/algorithm/
    ├── StyleMatcher.java
    ├── PriceScorer.java
    ├── TrendScorer.java
    └── CollaborativeFilter.java
```

**예상 난이도:** High (8시간)

**선행 작업:** 
- FN-006-BE-002 (스타일 프로필)
- FN-003-BE-003 (위시리스트 아이템)

**Acceptance Criteria:**
- [ ] 점수 계산 로직 구현 (0~100)
- [ ] 가중치 적용 (40% + 20% + 20% + 20% = 100%)
- [ ] 정렬 및 상위 N개 선택
- [ ] 단위 테스트 (각 알고리즘)

---

## 기술 스택 세부 사항

### 필수 Dependencies

```gradle
// build.gradle (Kotlin DSL)
dependencies {
    // Spring Boot
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-cache")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    
    // Database
    runtimeOnly("com.mysql:mysql-connector-j")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-mysql")
    
    // Redis
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    
    // JWT
    implementation("io.jsonwebtoken:jjwt-api:0.12.3")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.3")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.3")
    
    // HTML Parsing
    implementation("org.jsoup:jsoup:1.17.2")
    
    // HTTP Client
    implementation("org.springframework.boot:spring-boot-starter-webflux") // WebClient
    
    // QueryDSL
    implementation("com.querydsl:querydsl-jpa:5.0.0:jakarta")
    annotationProcessor("com.querydsl:querydsl-apt:5.0.0:jakarta")
    
    // API Documentation
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.3.0")
    
    // Utilities
    implementation("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    
    // Test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.testcontainers:testcontainers:1.19.0")
    testImplementation("org.testcontainers:mysql:1.19.0")
    testImplementation("org.testcontainers:junit-jupiter:1.19.0")
}
```

---

## 다음 단계

### 수요일 세션에서 할 것

1. **프로젝트 초기 설정**
   - Spring Initializr로 프로젝트 생성
   - 폴더 구조 생성
   - application.yml 설정

2. **첫 Task 시작**
   - FN-001-BE-001 (User Entity 생성)
   - 가장 기본적이고 다른 모든 Task의 기반

3. **학습 포인트**
   - JPA Entity 작성 방법
   - Repository 인터페이스
   - 3-layer 구조 이해

---

**문서 버전:** 1.0  
**작성자:** Backend Team  
**최종 업데이트:** 2025-12-07  
**다음 업데이트:** 실제 구현 시작 후

