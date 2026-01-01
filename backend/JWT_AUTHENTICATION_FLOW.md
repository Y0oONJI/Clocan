# JWT 인증 흐름 완성 가이드

## 📋 구현 완료 사항

### C-1: 로그인 엔드포인트 + Access Token 발급 ✅
- **엔드포인트**: `POST /api/v1/auth/login`
- **요청**: `LoginRequest` (email, password)
- **응답**: `TokenResponse` (accessToken, tokenType)
- **동작**: 이메일/비밀번호 검증 후 JWT 토큰 발급

### C-2: JwtAuthenticationFilter로 Bearer 토큰 검증 ✅
- **위치**: `com.example.wardrobe.security.JwtAuthenticationFilter`
- **동작**:
  1. 요청 헤더에서 `Authorization: Bearer <token>` 추출
  2. 토큰 유효성 검증 (`JwtTokenProvider.validateToken`)
  3. 토큰에서 이메일 추출
  4. `UserDetailsService`로 사용자 정보 로드
  5. `SecurityContext`에 인증 정보 설정

### C-3: SecurityConfig 인가 정책 설정 ✅
- **인증 불필요**: `/api/v1/auth/**`, `/api/v1/users/signup`
- **인증 필요**: 그 외 모든 API
- **JWT 필터**: `UsernamePasswordAuthenticationFilter` 앞에 추가

### C-4: 401/403 예외 처리 ✅
- **AuthenticationEntryPoint**: 인증 실패 시 401 응답
- **AccessDeniedHandler**: 인가 실패 시 403 응답
- **테스트 설정**: `TestSecurityConfig`로 테스트 환경에서 Security 비활성화

## 🔄 핵심 동작 흐름

### 1. 로그인 흐름
```
클라이언트 → POST /api/v1/auth/login
         → AuthController.login()
         → AuthService.login()
         → 이메일/비밀번호 검증
         → JwtTokenProvider.generateToken()
         → TokenResponse 반환
```

### 2. 인증된 API 호출 흐름
```
클라이언트 → GET /api/v1/users/{id} (Authorization: Bearer <token>)
         → JwtAuthenticationFilter.doFilterInternal()
         → 토큰 추출 및 검증
         → UserDetailsService.loadUserByUsername()
         → SecurityContext에 인증 정보 설정
         → UserController.getUserProfile()
         → 응답 반환
```

### 3. 인증 실패 흐름
```
클라이언트 → GET /api/v1/users/{id} (토큰 없음 또는 유효하지 않음)
         → JwtAuthenticationFilter (토큰 검증 실패)
         → SecurityContext에 인증 정보 없음
         → CustomAuthenticationEntryPoint.commence()
         → 401 Unauthorized 응답
```

## 📁 변경/추가 파일 목록

### 신규 생성 파일
1. `backend/src/main/java/com/example/wardrobe/security/JwtAuthenticationFilter.java`
2. `backend/src/test/java/com/example/wardrobe/domain/auth/controller/AuthControllerTest.java`
3. `backend/JWT_AUTHENTICATION_FLOW.md` (이 문서)

### 수정된 파일
1. `backend/src/main/java/com/example/wardrobe/config/SecurityConfig.java`
   - JwtAuthenticationFilter 추가
   - 인가 정책: `/api/v1/auth/**` permitAll

### 기존 파일 (이미 구현됨)
1. `backend/src/main/java/com/example/wardrobe/security/JwtTokenProvider.java`
2. `backend/src/main/java/com/example/wardrobe/security/CustomAuthenticationEntryPoint.java`
3. `backend/src/main/java/com/example/wardrobe/security/CustomAccessDeniedHandler.java`
4. `backend/src/main/java/com/example/wardrobe/domain/auth/controller/AuthController.java`
5. `backend/src/main/java/com/example/wardrobe/domain/auth/service/AuthService.java`
6. `backend/src/test/java/com/example/wardrobe/config/TestSecurityConfig.java`

## 🧪 테스트 결과

```bash
./gradlew test
BUILD SUCCESSFUL in 3s
```

## 🚀 동작 확인 예시 (curl)

### 1. 회원가입 (인증 불필요)
```bash
curl -X POST http://localhost:8080/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nickname": "테스트유저"
  }'
```

**예상 응답 (201 Created):**
```json
{
  "id": 1,
  "email": "test@example.com",
  "nickname": "테스트유저",
  "profileImageUrl": null,
  "createdAt": "2026-01-02T03:40:00"
}
```

### 2. 로그인 (인증 불필요)
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**예상 응답 (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzA0MTY4MDAwLCJleHAiOjE3MDQxNjk4MDB9...",
  "tokenType": "Bearer"
}
```

### 3. 토큰 저장 (변수에 저장)
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.accessToken')

echo "Token: $TOKEN"
```

### 4. 보호된 API 호출 (인증 필요) - 성공
```bash
curl -X GET http://localhost:8080/api/v1/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

**예상 응답 (200 OK):**
```json
{
  "id": 1,
  "email": "test@example.com",
  "nickname": "테스트유저",
  "profileImageUrl": null,
  "createdAt": "2026-01-02T03:40:00"
}
```

### 5. 보호된 API 호출 (토큰 없음) - 실패
```bash
curl -X GET http://localhost:8080/api/v1/users/1
```

**예상 응답 (401 Unauthorized):**
```json
{
  "timestamp": "2026-01-02T03:40:00",
  "status": 401,
  "message": "인증이 필요합니다. 로그인 후 다시 시도해주세요.",
  "path": "/api/v1/users/1"
}
```

### 6. 보호된 API 호출 (유효하지 않은 토큰) - 실패
```bash
curl -X GET http://localhost:8080/api/v1/users/1 \
  -H "Authorization: Bearer invalid-token"
```

**예상 응답 (401 Unauthorized):**
```json
{
  "timestamp": "2026-01-02T03:40:00",
  "status": 401,
  "message": "인증이 필요합니다. 로그인 후 다시 시도해주세요.",
  "path": "/api/v1/users/1"
}
```

### 7. 프로필 수정 (인증 필요)
```bash
curl -X PUT http://localhost:8080/api/v1/users/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "수정된닉네임",
    "profileImageUrl": "https://example.com/image.jpg"
  }'
```

**예상 응답 (200 OK):**
```json
{
  "id": 1,
  "email": "test@example.com",
  "nickname": "수정된닉네임",
  "profileImageUrl": "https://example.com/image.jpg",
  "createdAt": "2026-01-02T03:40:00"
}
```

## 📊 전체 인증 흐름 다이어그램

```
┌─────────┐
│ Client  │
└────┬────┘
     │ 1. POST /api/v1/auth/login
     │    {email, password}
     ▼
┌─────────────────┐
│ AuthController  │
└────┬────────────┘
     │ 2. AuthService.login()
     ▼
┌─────────────────┐
│  AuthService    │
│  - 이메일/비밀번호 검증 │
│  - JWT 토큰 생성    │
└────┬────────────┘
     │ 3. TokenResponse 반환
     ▼
┌─────────┐
│ Client  │ (토큰 저장)
└────┬────┘
     │ 4. GET /api/v1/users/{id}
     │    Authorization: Bearer <token>
     ▼
┌──────────────────────┐
│ JwtAuthenticationFilter│
│  - 토큰 추출 및 검증    │
│  - SecurityContext 설정│
└────┬─────────────────┘
     │ 5. 인증 정보 포함
     ▼
┌─────────────────┐
│ UserController  │
│  - 인증된 사용자 정보  │
└────┬────────────┘
     │ 6. 응답 반환
     ▼
┌─────────┐
│ Client  │
└─────────┘
```

## ⚙️ 설정 파일

### application.yml
```yaml
jwt:
  secret: ${JWT_SECRET:defaultSecretKeyForDevelopmentOnlyChangeInProduction}
  expiration: 1800 # 30분 (초 단위)
```

### 환경변수 설정 (선택사항)
```bash
export JWT_SECRET=your-secret-key-here-minimum-256-bits
```

## 🔒 보안 고려사항

1. **JWT Secret**: 운영 환경에서는 반드시 환경변수로 설정
2. **HTTPS**: 프로덕션에서는 HTTPS 사용 필수
3. **토큰 만료**: 현재 30분, 필요시 조정 가능
4. **Refresh Token**: 추후 구현 권장 (현재는 Access Token만)

## ✅ 테스트 확인

```bash
cd backend
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$JAVA_HOME/bin:$PATH"
./gradlew test
```

**결과**: `BUILD SUCCESSFUL` ✅

