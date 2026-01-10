# 📁 프로젝트 구조 가이드

## 왜 WardrobeApplication.java가 루트에 있나요?

Spring Boot 애플리케이션의 메인 클래스(`@SpringBootApplication`)는 **반드시 루트 패키지**에 있어야 합니다.

### 이유

1. **컴포넌트 스캔**: `@SpringBootApplication`이 붙은 클래스를 기준으로 하위 패키지를 자동으로 스캔합니다.
2. **패키지 구조 인식**: Spring이 `com.example.wardrobe` 패키지와 그 하위 패키지를 인식합니다.
3. **Spring Boot 표준**: 대부분의 Spring Boot 프로젝트가 이 구조를 따릅니다.

### 현재 구조 (올바른 구조 ✅)

```
com.example.wardrobe/
├── WardrobeApplication.java  ← 여기 있어야 함!
├── domain/
│   ├── auth/
│   ├── user/
│   └── recommend/
├── common/
├── config/
└── security/
```

### 잘못된 구조 예시 ❌

```
com.example.wardrobe/
├── application/
│   └── WardrobeApplication.java  ← 이렇게 하면 안 됨!
├── domain/
└── ...
```

이렇게 하면 Spring이 `com.example.wardrobe.application` 패키지만 스캔하고, `domain.*` 패키지를 찾지 못합니다.

## 패키지 구조 원칙

1. **루트 패키지**: 메인 클래스만 위치
2. **domain/**: 비즈니스 로직을 도메인별로 분리
3. **common/**: 공통 기능 (예외 처리, 유틸리티 등)
4. **config/**: Spring 설정 클래스
5. **security/**: 보안 관련 클래스

이 구조는 Spring Boot의 표준이자 베스트 프랙티스입니다! 🎯
