# Java 환경변수 설정 가이드

## 문제 해결 완료 ✅

Java 17이 설치되어 있지만 환경변수가 설정되지 않아 인식되지 않았습니다.

## 영구적으로 환경변수 설정하기

### ~/.zshrc 파일에 추가 (zsh 사용 시)

```bash
# Java 17 설정
export JAVA_HOME=/opt/homebrew/opt/openjdk@17
export PATH="$JAVA_HOME/bin:$PATH"
```

### 설정 적용

```bash
source ~/.zshrc
```

### 확인

```bash
java -version
# 출력: openjdk version "17.0.17" ...
```

## 테스트 실행

```bash
cd backend
./gradlew test
```

## 참고

- 현재 세션에서만 사용하려면: `export JAVA_HOME=/opt/homebrew/opt/openjdk@17`
- 영구적으로 사용하려면: 위의 ~/.zshrc 설정 추가

