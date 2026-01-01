# 테스트 및 머지 전 체크리스트

## ✅ 테스트 설정 완료 사항

### 1. H2 인메모리 DB 설정
- [x] `build.gradle`에 H2 의존성 추가
- [x] `src/test/resources/application.yml` 생성
- [x] H2 인메모리 DB 설정 완료
- [x] 운영 설정(`src/main/resources/application.yml`) 변경 없음

### 2. 테스트 파일
- [x] `WardrobeApplicationTests.java` 생성
- [x] `contextLoads()` 테스트 메서드 포함

## ⚠️ 테스트 실행 전 필요 사항

### Java 설치 필요
현재 Java가 설치되어 있지 않아 테스트를 실행할 수 없습니다.

**Java 17 설치 방법:**
```bash
# Homebrew 사용
brew install openjdk@17

# 환경변수 설정 (~/.zshrc 또는 ~/.bash_profile)
export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || echo "/opt/homebrew/opt/openjdk@17")
export PATH="$JAVA_HOME/bin:$PATH"

# 설정 적용
source ~/.zshrc  # 또는 source ~/.bash_profile

# 확인
java -version
```

## 🧪 테스트 실행

Java 설치 후:
```bash
cd backend
./gradlew test
```

**예상 결과:**
- `contextLoads()` 테스트 통과
- MySQL 연결 없이도 테스트 성공
- H2 인메모리 DB 사용

## 📋 머지 전 확인 사항

### 1. 코드 검증
- [ ] 모든 Java 파일 컴파일 성공
- [ ] 테스트 통과 확인
- [ ] 운영 설정(`application.yml`) 변경 없음 확인

### 2. Git 상태
- [ ] 변경된 파일 확인
- [ ] 불필요한 파일 제외 확인
- [ ] 커밋 메시지 작성

### 3. 변경된 파일 목록
```
backend/
├── build.gradle (수정: H2 의존성 추가)
├── src/test/resources/application.yml (신규: H2 테스트 설정)
└── src/test/java/com/example/wardrobe/WardrobeApplicationTests.java (신규: 테스트 클래스)
```

## 🚀 머지 절차

1. **Java 설치 및 테스트 실행**
   ```bash
   cd backend
   ./gradlew test
   ```

2. **변경사항 커밋**
   ```bash
   git add backend/
   git commit -m "test: H2 인메모리 DB 설정 및 테스트 환경 구성"
   ```

3. **브랜치 푸시 및 PR 생성**
   ```bash
   git push origin <branch-name>
   gh pr create --title "test: H2 인메모리 DB 설정" --body "테스트가 MySQL 없이도 실행되도록 H2 설정 추가"
   ```

## ⚠️ 잠재적 문제점 및 해결책

### 1. Java 미설치
- **문제**: 테스트 실행 불가
- **해결**: Java 17 설치 필요

### 2. 테스트 실패 가능성
- **Security 설정**: SecurityConfig가 테스트에 영향을 줄 수 있음
- **해결**: 테스트 실행 후 확인 필요

### 3. Git 충돌 가능성
- **문제**: 다른 브랜치와 충돌 가능
- **해결**: 최신 main 브랜치 pull 후 머지

## 📝 참고사항

- 운영 환경(`src/main/resources/application.yml`)은 MySQL 설정 유지
- 테스트 환경(`src/test/resources/application.yml`)은 H2 인메모리 DB 사용
- Spring Boot가 자동으로 테스트 리소스를 우선 사용

