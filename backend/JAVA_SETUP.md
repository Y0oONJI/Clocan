# Java 설치 및 설정 가이드

## 문제 상황
현재 시스템에서 Java가 인식되지 않아 `./gradlew test` 실행이 불가능합니다.

## 해결 방법

### 1. Java 17 설치 (macOS)

#### 방법 A: Homebrew 사용 (권장)
```bash
# Homebrew 설치 (없는 경우)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Java 17 설치
brew install openjdk@17
```

#### 방법 B: 직접 다운로드
- [Eclipse Temurin (Adoptium) JDK 17](https://adoptium.net/temurin/releases/?version=17) - 무료, 오픈소스
- [Oracle JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) - 상업적 사용 시 라이선스 확인 필요

### 2. 환경변수 설정

#### ~/.zshrc 파일에 추가 (zsh 사용 시)
```bash
# Java 17 설정
export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || echo "/opt/homebrew/opt/openjdk@17")
export PATH="$JAVA_HOME/bin:$PATH"
```

#### ~/.bash_profile 파일에 추가 (bash 사용 시)
```bash
# Java 17 설정
export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || echo "/opt/homebrew/opt/openjdk@17")
export PATH="$JAVA_HOME/bin:$PATH"
```

#### 설정 적용
```bash
source ~/.zshrc  # 또는 source ~/.bash_profile
```

### 3. 설치 확인

```bash
# Java 버전 확인
java -version
# 출력 예시: openjdk version "17.0.x" ...

# JAVA_HOME 확인
echo $JAVA_HOME
# 출력 예시: /opt/homebrew/opt/openjdk@17 또는 /Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
```

### 4. 테스트 실행

```bash
cd backend
./gradlew test
```

## 문제 해결 체크리스트

- [ ] Java 17 설치 완료
- [ ] JAVA_HOME 환경변수 설정
- [ ] PATH에 Java bin 디렉토리 추가
- [ ] `java -version` 명령어로 확인
- [ ] `./gradlew --version` 명령어로 Gradle 확인
- [ ] `./gradlew test` 실행 성공

## 추가 참고사항

- 프로젝트는 Java 17이 필요합니다 (`build.gradle`에서 `sourceCompatibility = '17'` 설정)
- 테스트 파일이 없어도 빌드는 성공하지만, 테스트는 실행되지 않습니다
- 현재 `src/test/java/com/example/wardrobe/WardrobeApplicationTests.java` 파일이 생성되어 있습니다

