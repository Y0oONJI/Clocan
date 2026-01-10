# Wardrobe Backend

Closet Canvas 백엔드 애플리케이션

## 기술 스택

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL
- Lombok
- Gradle

## 실행 방법

### 1. 데이터베이스 설정

MySQL 데이터베이스를 생성하고 `application.yml`에 연결 정보를 설정하세요.

```sql
CREATE DATABASE wardrobe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 환경 변수 설정

`application.yml` 파일에서 데이터베이스 연결 정보를 수정하세요.

### 3. 애플리케이션 실행

```bash
./gradlew bootRun
```

또는

```bash
./gradlew build
java -jar build/libs/wardrobe-backend-0.0.1-SNAPSHOT.jar
```

## 프로젝트 구조

```
src/main/java/com/example/wardrobe/
├── WardrobeApplication.java          # 🚀 Spring Boot 메인 클래스 (루트 패키지 필수)
│
├── domain/                           # 📦 도메인별 비즈니스 로직
│   ├── auth/                         # 인증 도메인
│   │   ├── controller/
│   │   ├── service/
│   │   ├── dto/
│   │   └── exception/
│   ├── user/                         # 사용자 도메인
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   └── exception/
│   └── recommend/                    # 추천 도메인
│       ├── controller/
│       ├── service/
│       └── dto/
│
├── common/                            # 🔧 공통 기능
│   └── exception/                    # 전역 예외 처리
│       ├── ErrorResponse.java
│       └── GlobalExceptionHandler.java
│
├── config/                            # ⚙️ 설정 클래스
│   └── SecurityConfig.java           # Spring Security 설정
│
└── security/                         # 🔐 보안 관련
    ├── JwtTokenProvider.java
    ├── JwtAuthenticationFilter.java
    ├── CustomUserDetailsService.java
    ├── CustomAuthenticationEntryPoint.java
    └── CustomAccessDeniedHandler.java
```

### 구조 설명

- **WardrobeApplication.java**: Spring Boot 메인 클래스는 반드시 루트 패키지(`com.example.wardrobe`)에 있어야 합니다. 이 클래스를 기준으로 하위 패키지가 자동 스캔됩니다.

- **domain/**: 도메인별로 패키지를 분리합니다. 각 도메인은 `controller`, `service`, `repository`, `entity`, `dto`, `exception`을 포함할 수 있습니다.

- **common/**: 여러 도메인에서 공통으로 사용하는 기능을 담습니다.

- **config/**: Spring 설정 클래스들을 모아둡니다.

- **security/**: 보안 관련 유틸리티와 필터를 담습니다.

## 주요 기능

### User Entity

- 이메일/비밀번호 기반 로컬 회원가입
- Google OAuth2 소셜 로그인 지원
- 프로필 관리 (닉네임, 프로필 이미지)

## 개발 가이드

자세한 개발 가이드는 `rules/backend-rule.mdc`를 참고하세요.

