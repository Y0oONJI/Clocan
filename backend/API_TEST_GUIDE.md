# API 테스트 가이드 - 회원가입 및 로그인 (JWT 토큰 확인)

이 가이드는 가상의 사용자를 가입시키고 로그인하여 JWT 토큰을 확인하는 방법을 안내합니다.

## 📋 사전 준비

1. **서버 실행 확인**
   ```bash
   ./gradlew bootRun
   ```
   서버가 정상적으로 시작되면 `Started WardrobeApplication` 메시지가 표시됩니다.

2. **서버 주소**
   - 기본 URL: `http://localhost:8080`
   - API 베이스 경로: `/api/v1`

---

## 🚀 단계별 테스트 가이드

### 1단계: 회원가입 (Signup)

**엔드포인트:** `POST /api/v1/users/signup`

**요청 예시 (curl):**
```bash
curl -X POST http://localhost:8080/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nickname": "테스트유저"
  }'
```

**요청 예시 (다른 사용자):**
```bash
curl -X POST http://localhost:8080/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "mypassword123",
    "nickname": "홍길동"
  }'
```

**성공 응답 예시:**
```json
{
  "id": 1,
  "email": "test@example.com",
  "nickname": "테스트유저",
  "profileImageUrl": null,
  "createdAt": "2026-01-03T12:00:00"
}
```

**주의사항:**
- 이메일은 유효한 형식이어야 합니다 (`@` 포함)
- 비밀번호는 **8자 이상 100자 이하**여야 합니다
- 닉네임은 선택사항입니다 (최대 50자)

---

### 2단계: 로그인 (Login) - JWT 토큰 발급

**엔드포인트:** `POST /api/v1/auth/login`

**요청 예시 (curl):**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**성공 응답 예시:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzA0MjY4MDAwLCJleHAiOjE3MDQyNjk4MDB9.xxxxx",
  "tokenType": "Bearer"
}
```

**응답에서 확인할 것:**
- `accessToken`: JWT 토큰 (이것이 인증에 사용됩니다)
- `tokenType`: "Bearer" (토큰 타입)

---

### 3단계: JWT 토큰 확인 및 검증

#### 방법 1: JWT 토큰 디코딩 (온라인 도구 사용)

1. 로그인 응답에서 받은 `accessToken` 값을 복사합니다
2. 다음 사이트 중 하나를 방문하여 토큰을 디코딩합니다:
   - https://jwt.io
   - https://jwt-decoder.com

3. 토큰을 붙여넣으면 다음과 같은 정보를 확인할 수 있습니다:
   ```json
   {
     "sub": "1",           // 사용자 ID
     "email": "test@example.com",  // 이메일
     "iat": 1704268000,    // 발급 시간 (Unix timestamp)
     "exp": 1704269800     // 만료 시간 (Unix timestamp)
   }
   ```

#### 방법 2: JWT 토큰으로 인증이 필요한 API 호출

**예시: 프로필 조회 API**

```bash
# 1단계에서 받은 사용자 ID를 사용 (예: id=1)
curl -X GET http://localhost:8080/api/v1/users/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

**성공 응답:**
```json
{
  "id": 1,
  "email": "test@example.com",
  "nickname": "테스트유저",
  "profileImageUrl": null,
  "createdAt": "2026-01-03T12:00:00"
}
```

**토큰 없이 호출 시 (실패 예시):**
```bash
curl -X GET http://localhost:8080/api/v1/users/1
```

**응답:**
```json
{
  "error": "Unauthorized",
  "message": "인증이 필요합니다."
}
```

---

## 🔧 추가 테스트 시나리오

### 시나리오 1: 잘못된 비밀번호로 로그인 시도
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }'
```
**예상 응답:** 401 Unauthorized 또는 에러 메시지

### 시나리오 2: 존재하지 않는 이메일로 로그인 시도
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "password123"
  }'
```
**예상 응답:** 401 Unauthorized 또는 에러 메시지

### 시나리오 3: 중복 이메일로 회원가입 시도
```bash
curl -X POST http://localhost:8080/api/v1/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nickname": "또다른유저"
  }'
```
**예상 응답:** 400 Bad Request 또는 중복 이메일 에러

---

## 📝 Postman 사용 가이드 (선택사항)

### Postman Collection 설정

1. **회원가입 요청**
   - Method: `POST`
   - URL: `http://localhost:8080/api/v1/users/signup`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "password123",
       "nickname": "테스트유저"
     }
     ```

2. **로그인 요청**
   - Method: `POST`
   - URL: `http://localhost:8080/api/v1/auth/login`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "password123"
     }
     ```

3. **인증이 필요한 API 호출**
   - Method: `GET`
   - URL: `http://localhost:8080/api/v1/users/1`
   - Headers:
     - `Authorization: Bearer {accessToken}`
     - (로그인 응답에서 받은 accessToken을 여기에 붙여넣기)

---

## 🎯 체크리스트

테스트를 완료했는지 확인하세요:

- [ ] 서버가 정상적으로 실행됨 (`./gradlew bootRun`)
- [ ] 회원가입 API 호출 성공 (201 Created)
- [ ] 로그인 API 호출 성공 (200 OK)
- [ ] JWT 토큰(`accessToken`)을 응답에서 확인
- [ ] JWT 토큰을 jwt.io에서 디코딩하여 내용 확인
- [ ] JWT 토큰을 사용하여 인증이 필요한 API 호출 성공
- [ ] 토큰 없이 인증이 필요한 API 호출 시 401 에러 확인

---

## 💡 팁

1. **토큰 만료 시간 확인**
   - 기본 설정: 30분 (1800초)
   - `application.yml`의 `jwt.expiration` 값 확인

2. **여러 사용자 테스트**
   - 다른 이메일로 여러 계정을 만들어서 테스트해보세요

3. **토큰 저장**
   - 테스트 시 받은 토큰을 변수에 저장해두면 편리합니다:
     ```bash
     TOKEN="your_access_token_here"
     curl -X GET http://localhost:8080/api/v1/users/1 \
       -H "Authorization: Bearer $TOKEN"
     ```

---

## 🐛 문제 해결

### 서버가 시작되지 않는 경우
- Java 17이 설치되어 있고 환경변수가 설정되어 있는지 확인
- 포트 8080이 이미 사용 중인지 확인: `lsof -i :8080`

### 401 Unauthorized 에러
- 토큰이 만료되었을 수 있습니다 (30분 후)
- 토큰 형식이 올바른지 확인: `Bearer {token}` 형식
- 로그인을 다시 해서 새로운 토큰을 받으세요

### 400 Bad Request 에러
- 요청 본문의 JSON 형식이 올바른지 확인
- 이메일 형식이 올바른지 확인
- 비밀번호가 8자 이상인지 확인

---

**행운을 빕니다! 🚀**


