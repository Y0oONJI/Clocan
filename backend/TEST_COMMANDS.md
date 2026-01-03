# 테스트 실행 명령어 가이드

## 🧪 테스트 실행 방법

### 전체 테스트 실행
```bash
cd /Users/myun/Desktop/Prj_WorkSpace/studio/backend
./gradlew test
```

### 특정 테스트 클래스만 실행

#### 회원가입 테스트만 실행
```bash
./gradlew test --tests AuthSignupTest
```

#### 로그인 테스트만 실행
```bash
./gradlew test --tests AuthLoginTest
```

#### 인증 관련 모든 테스트 실행
```bash
./gradlew test --tests "*Auth*"
```

### 특정 테스트 메서드만 실행

#### 회원가입 성공 테스트만 실행
```bash
./gradlew test --tests "AuthSignupTest.회원가입_성공"
```

#### 로그인 성공 테스트만 실행
```bash
./gradlew test --tests "AuthLoginTest.로그인_성공"
```

### 테스트 결과 확인

#### 테스트 리포트 보기
```bash
# HTML 리포트 열기 (macOS)
open build/reports/tests/test/index.html

# 또는 브라우저에서 직접 열기
# build/reports/tests/test/index.html
```

#### 테스트 결과 요약만 보기
```bash
./gradlew test --info | grep -E "(PASSED|FAILED|SUCCESS|FAILURE)"
```

## 📋 테스트 파일 위치

- 회원가입 테스트: `src/test/java/com/example/wardrobe/AuthSignupTest.java`
- 로그인 테스트: `src/test/java/com/example/wardrobe/AuthLoginTest.java`

## 🔍 디버깅 팁

### 실패한 테스트만 다시 실행
```bash
./gradlew test --rerun-tasks
```

### 테스트 실행 시 상세 로그 보기
```bash
./gradlew test --info
```

### 테스트 실행 시 디버그 모드
```bash
./gradlew test --debug
```

## ⚠️ 주의사항

- 테스트는 H2 인메모리 데이터베이스를 사용합니다
- 각 테스트는 독립적으로 실행되지만, 같은 테스트 클래스 내에서는 데이터가 공유될 수 있습니다
- 테스트 간 격리를 위해 `@Transactional` 또는 `@DirtiesContext`를 사용할 수 있습니다

