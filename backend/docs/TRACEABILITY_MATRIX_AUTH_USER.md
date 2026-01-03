# Traceability Matrix - 인증/회원 기능

**작성일:** 2026-01-03  
**기반 문서:** [20_BE_REQUIREMENTS.md](../docs/20_BE_REQUIREMENTS.md)  
**구현 범위:** 현재 구현된 인증/회원(User, Auth) 기능

---

## 📋 구현된 기능 요약

### 인증 (Auth) 기능
- ✅ 회원가입 API (POST /api/v1/users/signup)
- ✅ 로그인 API (POST /api/v1/auth/login)
- ✅ JWT 토큰 발급 및 검증
- ✅ JWT 인증 필터 (JwtAuthenticationFilter)

### 회원 (User) 기능
- ✅ 현재 사용자 프로필 조회 (GET /api/v1/users/me)
- ✅ 프로필 조회 (GET /api/v1/users/{id})
- ✅ 프로필 수정 (PUT /api/v1/users/{id})

---

## 🔗 Requirement ID ↔ Test Case ID 매핑

### REQ-FUNC-001: 회원 가입 및 인증

| Requirement ID | Test Case ID | 테스트 케이스 설명 | 구현 상태 | 테스트 파일 |
|----------------|--------------|-------------------|----------|------------|
| REQ-FUNC-001 | **TC-AUTH-001** | 회원가입 성공 - 유효한 이메일, 비밀번호, 닉네임 | ✅ 구현 완료 | `AuthSignupTest.회원가입_성공()` |
| REQ-FUNC-001 | **TC-AUTH-002** | 회원가입 실패 - 중복 이메일 | ✅ 구현 완료 | `AuthSignupTest.회원가입_실패_중복이메일()` |
| REQ-FUNC-001 | **TC-AUTH-003** | 회원가입 실패 - 잘못된 이메일 형식 | ✅ 구현 완료 | `AuthSignupTest.회원가입_실패_잘못된이메일형식()` |
| REQ-FUNC-001 | **TC-AUTH-004** | 회원가입 실패 - 비밀번호 8자 미만 | ✅ 구현 완료 | `AuthSignupTest.회원가입_실패_비밀번호8자미만()` |
| REQ-FUNC-001 | **TC-AUTH-005** | 회원가입 실패 - 비밀번호 100자 초과 | ⏳ 미구현 | - |
| REQ-FUNC-001 | **TC-AUTH-006** | 회원가입 실패 - 필수 필드 누락 (이메일) | ✅ 구현 완료 | `AuthSignupTest.회원가입_실패_이메일누락()` |
| REQ-FUNC-001 | **TC-AUTH-007** | 회원가입 실패 - 필수 필드 누락 (비밀번호) | ✅ 구현 완료 | `AuthSignupTest.회원가입_실패_비밀번호누락()` |
| REQ-FUNC-001 | **TC-AUTH-008** | 로그인 성공 - 유효한 이메일과 비밀번호 | ✅ 구현 완료 | `AuthLoginTest.로그인_성공()` |
| REQ-FUNC-001 | **TC-AUTH-009** | 로그인 실패 - 존재하지 않는 이메일 | ⏳ 미구현 | - |
| REQ-FUNC-001 | **TC-AUTH-010** | 로그인 실패 - 잘못된 비밀번호 | ⏳ 미구현 | - |
| REQ-FUNC-001 | **TC-AUTH-011** | 로그인 실패 - 필수 필드 누락 (이메일) | ⏳ 미구현 | - |
| REQ-FUNC-001 | **TC-AUTH-012** | 로그인 실패 - 필수 필드 누락 (비밀번호) | ⏳ 미구현 | - |
| REQ-FUNC-001 | **TC-AUTH-013** | JWT 토큰 발급 확인 - 로그인 성공 시 accessToken 반환 | ✅ 구현 완료 | `AuthLoginTest.로그인_성공()` |
| REQ-FUNC-001 | **TC-AUTH-014** | JWT 토큰 검증 - 유효한 토큰으로 인증 성공 | ✅ 구현 완료 | `JwtSecurityTest.유효한토큰으로_보호API_접근하면_성공()` |
| REQ-FUNC-001 | **TC-AUTH-015** | JWT 토큰 검증 - 만료된 토큰으로 인증 실패 | ⏳ 미구현 | - |
| REQ-FUNC-001 | **TC-AUTH-016** | JWT 토큰 검증 - 잘못된 형식의 토큰으로 인증 실패 | ✅ 구현 완료 | `JwtSecurityTest.잘못된형식의토큰으로_보호API_접근하면_401()` |
| REQ-FUNC-001 | **TC-AUTH-017** | JWT 토큰 검증 - 토큰 없이 인증 필요 API 호출 시 401 에러 | ✅ 구현 완료 | `JwtSecurityTest.토큰없이_보호API_접근하면_401()`, `JwtSecurityTest.Bearer없이_토큰만_보내면_401()` |
| REQ-FUNC-001 | **TC-AUTH-018** | 비밀번호 암호화 확인 - 회원가입 시 BCrypt로 암호화 저장 | ⏳ 미구현 | - |

---

### REQ-FUNC-002: 회원 프로필 관리

| Requirement ID | Test Case ID | 테스트 케이스 설명 |
|----------------|--------------|-------------------|
| REQ-FUNC-002 | **TC-USER-001** | 현재 사용자 프로필 조회 성공 (GET /api/v1/users/me) |
| REQ-FUNC-002 | **TC-USER-002** | 현재 사용자 프로필 조회 실패 - 인증 토큰 없음 (401) |
| REQ-FUNC-002 | **TC-USER-003** | 현재 사용자 프로필 조회 실패 - 유효하지 않은 토큰 (401) |
| REQ-FUNC-002 | **TC-USER-004** | 프로필 조회 성공 - ID로 조회 (GET /api/v1/users/{id}) |
| REQ-FUNC-002 | **TC-USER-005** | 프로필 조회 실패 - 존재하지 않는 사용자 ID (404) |
| REQ-FUNC-002 | **TC-USER-006** | 프로필 조회 실패 - 인증 토큰 없음 (401) |
| REQ-FUNC-002 | **TC-USER-007** | 프로필 수정 성공 - 닉네임 변경 (PUT /api/v1/users/{id}) |
| REQ-FUNC-002 | **TC-USER-008** | 프로필 수정 성공 - 프로필 이미지 URL 변경 |
| REQ-FUNC-002 | **TC-USER-009** | 프로필 수정 실패 - 존재하지 않는 사용자 ID (404) |
| REQ-FUNC-002 | **TC-USER-010** | 프로필 수정 실패 - 인증 토큰 없음 (401) |
| REQ-FUNC-002 | **TC-USER-011** | 프로필 수정 실패 - 닉네임 50자 초과 |
| REQ-FUNC-002 | **TC-USER-012** | 프로필 수정 실패 - 다른 사용자 프로필 수정 시도 (403) |

---

## 📊 요약 통계

| Requirement ID | 구현 범위 | Test Case 수 | 구현 완료 | 구현률 |
|----------------|-----------|--------------|----------|--------|
| **REQ-FUNC-001** | 회원가입, 로그인, JWT 토큰 발급/검증 | 18개 | 11개 | 61% |
| **REQ-FUNC-002** | 프로필 조회(/me, /{id}), 프로필 수정 | 12개 | 0개 | 0% |
| **합계** | - | **30개** | **11개** | **37%** |

### 구현 완료된 테스트 케이스 (11개)

#### 회원가입 테스트 (6개)
- ✅ TC-AUTH-001: 회원가입 성공
- ✅ TC-AUTH-002: 회원가입 실패 - 중복 이메일
- ✅ TC-AUTH-003: 회원가입 실패 - 잘못된 이메일 형식
- ✅ TC-AUTH-004: 회원가입 실패 - 비밀번호 8자 미만
- ✅ TC-AUTH-006: 회원가입 실패 - 이메일 누락
- ✅ TC-AUTH-007: 회원가입 실패 - 비밀번호 누락

#### 로그인 테스트 (2개)
- ✅ TC-AUTH-008: 로그인 성공
- ✅ TC-AUTH-013: JWT 토큰 발급 확인

#### JWT Security 테스트 (3개)
- ✅ TC-AUTH-014: 유효한 토큰으로 인증 성공
- ✅ TC-AUTH-016: 잘못된 형식의 토큰으로 인증 실패
- ✅ TC-AUTH-017: 토큰 없이 인증 필요 API 호출 시 401 에러 (2개 테스트)

---

## 📝 테스트 파일 위치

### 구현된 테스트 파일

| 테스트 파일 | 경로 | 검증하는 Test Case |
|------------|------|-------------------|
| `AuthSignupTest.java` | `src/test/java/com/example/wardrobe/AuthSignupTest.java` | TC-AUTH-001, 002, 003, 004, 006, 007 |
| `AuthLoginTest.java` | `src/test/java/com/example/wardrobe/AuthLoginTest.java` | TC-AUTH-008, 013 |
| `JwtSecurityTest.java` | `src/test/java/com/example/wardrobe/JwtSecurityTest.java` | TC-AUTH-014, 016, 017 |

### 테스트 실행 방법

```bash
# 전체 테스트 실행
./gradlew test

# 특정 테스트 클래스만 실행
./gradlew test --tests AuthSignupTest
./gradlew test --tests AuthLoginTest
./gradlew test --tests JwtSecurityTest

# 인증 관련 모든 테스트 실행
./gradlew test --tests "*Auth*"

# 테스트 리포트 보기
open build/reports/tests/test/index.html
```

## 📝 참고사항

### 구현되지 않은 테스트 케이스

#### REQ-FUNC-001 (7개 미구현)
- ⏳ TC-AUTH-005: 회원가입 실패 - 비밀번호 100자 초과
- ⏳ TC-AUTH-009: 로그인 실패 - 존재하지 않는 이메일
- ⏳ TC-AUTH-010: 로그인 실패 - 잘못된 비밀번호
- ⏳ TC-AUTH-011: 로그인 실패 - 필수 필드 누락 (이메일)
- ⏳ TC-AUTH-012: 로그인 실패 - 필수 필드 누락 (비밀번호)
- ⏳ TC-AUTH-015: JWT 토큰 검증 - 만료된 토큰으로 인증 실패
- ⏳ TC-AUTH-018: 비밀번호 암호화 확인 - 회원가입 시 BCrypt로 암호화 저장

#### REQ-FUNC-001 (미구현 기능)
- ❌ 토큰 갱신 (TC-AUTH-019 ~ TC-AUTH-021)
- ❌ 로그아웃 (TC-AUTH-022 ~ TC-AUTH-023)
- ❌ Google OAuth2 소셜 로그인 (TC-AUTH-024 ~ TC-AUTH-026)

#### REQ-FUNC-002 (전체 미구현)
- ❌ 프로필 조회 테스트 (TC-USER-001 ~ TC-USER-006)
- ❌ 프로필 수정 테스트 (TC-USER-007 ~ TC-USER-012)
- ❌ 프로필 이미지 업로드 (TC-USER-013 ~ TC-USER-015)
- ❌ 회원 탈퇴 (TC-USER-016 ~ TC-USER-018)

### 테스트 케이스 ID 명명 규칙
- **TC-AUTH-XXX**: 인증(Authentication) 관련 테스트
- **TC-USER-XXX**: 사용자(User) 관련 테스트
- 순차 번호 부여 (001, 002, 003...)

### 테스트 구현 현황

**구현 완료:** 2026-01-03  
**테스트 커버리지:** REQ-FUNC-001 기준 61% (11/18)  
**전체 커버리지:** 37% (11/30)

---

**문서 버전:** 2.0  
**최종 업데이트:** 2026-01-03  
**구현 완료일:** 2026-01-03

