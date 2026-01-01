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
├── domain/
│   └── user/
│       └── entity/
│           ├── BaseTimeEntity.java
│           ├── AuthProvider.java
│           └── User.java
└── WardrobeApplication.java
```

## 주요 기능

### User Entity

- 이메일/비밀번호 기반 로컬 회원가입
- Google OAuth2 소셜 로그인 지원
- 프로필 관리 (닉네임, 프로필 이미지)

## 개발 가이드

자세한 개발 가이드는 `rules/backend-rule.mdc`를 참고하세요.

