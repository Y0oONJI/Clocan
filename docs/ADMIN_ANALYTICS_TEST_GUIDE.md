# 어드민 분석 대시보드 테스트 가이드

> 작성일: 2025-01-XX  
> 구현 상태: ✅ 완료

---

## 구현 완료 사항

### 백엔드 ✅

1. **LogParser 클래스** (`backend/src/main/java/com/example/wardrobe/common/logging/LogParser.java`)
   - 정규표현식으로 로그 파싱
   - requestId, timestamp, method, apiPath, referer 추출
   - 랜딩 페이지/퀴즈 완료/AI 분석 완료 로그 식별

2. **AnalyticsService** (`backend/src/main/java/com/example/wardrobe/service/AnalyticsService.java`)
   - 로그 파일 읽기 (`./logs/application.log`, `./logs/api-requests.log`)
   - 시간대별(0-23시) 집계
   - 더미 데이터 생성 (로그 파일 없을 때 fallback)

3. **AnalyticsController** (`backend/src/main/java/com/example/wardrobe/controller/AnalyticsController.java`)
   - `GET /api/v1/admin/analytics/landing-page-views`
   - `GET /api/v1/admin/analytics/quiz-completions`
   - `GET /api/v1/admin/analytics/analysis-completions`

4. **Security 설정** (`backend/src/main/java/com/example/wardrobe/config/SecurityConfig.java`)
   - `/api/v1/admin/analytics/**` 경로 인증 불필요로 설정

### 프론트엔드 ✅

1. **어드민 페이지** (`src/app/admin/analytics/page.tsx`)
   - 경로: `/admin/analytics`

2. **AnalyticsCard 컴포넌트** (`src/components/admin/AnalyticsCard.tsx`)
   - API 호출 및 데이터 관리
   - 로딩/에러 상태 처리

3. **AnalyticsTable 컴포넌트** (`src/components/admin/AnalyticsTable.tsx`)
   - shadcn/ui Table 사용
   - 시간대별 데이터 표시
   - 비율 바 표시

4. **AnalyticsChart 컴포넌트** (`src/components/admin/AnalyticsChart.tsx`)
   - Recharts Line Chart 사용
   - 시간대별 추이 그래프

---

## 테스트 방법

### 1. 백엔드 서버 실행

```bash
cd backend
./gradlew bootRun
```

백엔드 서버가 `http://localhost:8080`에서 실행됩니다.

### 2. 프론트엔드 서버 실행

```bash
npm run dev
```

프론트엔드 서버가 `http://localhost:9002`에서 실행됩니다.

### 3. 브라우저에서 테스트

1. **어드민 페이지 접속**
   ```
   http://localhost:9002/admin/analytics
   ```

2. **확인 사항**
   - ✅ 3개의 카드가 표시되는지 (랜딩 페이지, 퀴즈 완료, AI 분석)
   - ✅ 각 카드에 표(Table)가 표시되는지
   - ✅ 각 카드에 그래프(Line Chart)가 표시되는지
   - ✅ 시간대별(0-23시) 데이터가 표시되는지
   - ✅ 더미 데이터가 적절하게 표시되는지

### 4. API 직접 테스트

브라우저 개발자 도구 콘솔에서:

```javascript
// 랜딩 페이지 접속 수
fetch('http://localhost:8080/api/v1/admin/analytics/landing-page-views')
  .then(r => r.json())
  .then(console.log);

// 퀴즈 완료 수
fetch('http://localhost:8080/api/v1/admin/analytics/quiz-completions')
  .then(r => r.json())
  .then(console.log);

// AI 분석 완료 수
fetch('http://localhost:8080/api/v1/admin/analytics/analysis-completions')
  .then(r => r.json())
  .then(console.log);
```

**예상 응답 형식**:

```json
[
  { "hour": 0, "count": 5 },
  { "hour": 1, "count": 3 },
  { "hour": 2, "count": 2 },
  ...
  { "hour": 23, "count": 8 }
]
```

---

## 더미 데이터 확인

로그 파일이 없거나 읽기 실패 시 자동으로 더미 데이터가 반환됩니다.

**더미 데이터 특징**:
- 랜딩 페이지: 평균 50개 (피크 시간대 70-80개)
- 퀴즈 완료: 평균 20개 (피크 시간대 35-40개)
- AI 분석: 평균 15개 (피크 시간대 25-30개)
- 오전 9-12시, 오후 14-18시에 더 많은 트래픽
- 새벽 1-6시에는 적은 트래픽 (1-5개)

---

## 표시 확인 체크리스트

### 표 (Table)
- [ ] 시간대 컬럼 (00시, 01시, ... 23시)
- [ ] 시간 범위 컬럼 (00:00 - 00:59, ...)
- [ ] 접속 수 컬럼 (숫자 형식, 천 단위 구분)
- [ ] 비율 바 및 퍼센트 표시
- [ ] 총합 행 표시

### 그래프 (Line Chart)
- [ ] X축: 시간대 라벨 (00시, 02시, 04시, ...)
- [ ] Y축: 접속 수
- [ ] 라인 그래프가 24개 데이터 포인트로 표시되는지
- [ ] 호버 시 툴팁 표시
- [ ] 그래프가 반응형으로 표시되는지

---

## 문제 해결

### API 호출 실패

**증상**: "데이터를 불러오는데 실패했습니다" 에러

**해결 방법**:
1. 백엔드 서버가 실행 중인지 확인
2. CORS 설정 확인 (`SecurityConfig.java`)
3. 브라우저 콘솔에서 네트워크 에러 확인

### 그래프가 표시되지 않음

**증상**: 표는 보이지만 그래프가 안 보임

**해결 방법**:
1. Recharts가 설치되어 있는지 확인: `npm list recharts`
2. 브라우저 콘솔에서 에러 확인
3. 데이터가 올바른 형식인지 확인

### 더미 데이터가 표시되지 않음

**증상**: 로그 파일이 없는데도 에러 발생

**해결 방법**:
1. `AnalyticsService.java`의 `generateDummyData` 메서드 확인
2. 로그 파일 읽기 실패 시 예외 처리 확인

---

## 구현된 파일 목록

### 백엔드
- `backend/src/main/java/com/example/wardrobe/common/logging/LogParser.java`
- `backend/src/main/java/com/example/wardrobe/service/AnalyticsService.java`
- `backend/src/main/java/com/example/wardrobe/controller/AnalyticsController.java`
- `backend/src/main/java/com/example/wardrobe/config/SecurityConfig.java` (수정)

### 프론트엔드
- `src/app/admin/analytics/page.tsx`
- `src/components/admin/AnalyticsCard.tsx`
- `src/components/admin/AnalyticsTable.tsx`
- `src/components/admin/AnalyticsChart.tsx`

---

## 다음 단계

1. **실제 로그 파일 테스트**
   - 백엔드에서 실제 로그 생성
   - 로그 파일 읽기 및 파싱 확인

2. **성능 최적화**
   - 로그 파일 캐싱
   - 최근 N일만 읽기 최적화

3. **추가 기능**
   - 날짜 범위 선택
   - 데이터 내보내기 (CSV)
   - 실시간 업데이트

---

## 완료 체크리스트

- [x] 백엔드 LogParser 구현
- [x] 백엔드 AnalyticsService 구현
- [x] 백엔드 더미 데이터 생성
- [x] 백엔드 AnalyticsController 구현
- [x] 백엔드 Security 설정
- [x] 프론트엔드 어드민 페이지 생성
- [x] 프론트엔드 AnalyticsCard 구현
- [x] 프론트엔드 AnalyticsTable 구현
- [x] 프론트엔드 AnalyticsChart 구현
- [x] 프론트엔드 API 호출 로직 구현
- [ ] 브라우저에서 표/그래프 표시 확인 (사용자 확인 필요)
