# Google Analytics 구현 완료 요약

> 작성일: 2025-01-XX  
> 구현 상태: ✅ 완료

---

## 구현 완료 사항

### Phase 1: 기본 설정 ✅

1. **라이브러리 설치**
   - `@next/third-parties` 설치 완료

2. **환경 변수 설정**
   - `.env.local.example` 파일 생성 (참고용)
   - 실제 `.env.local` 파일은 프로젝트 루트에 생성 필요:
     ```bash
     NEXT_PUBLIC_GA_MEASUREMENT_ID=G-5WXL2SQQYQ
     NEXT_PUBLIC_GA_ENABLED=true
     ```

3. **analytics.ts 유틸리티 생성**
   - `src/lib/analytics.ts` 파일 생성
   - 페이지뷰 추적 함수
   - 커스텀 이벤트 추적 함수
   - 사용자 속성 설정 함수
   - 예외 추적 함수
   - 퀴즈 추적 헬퍼 함수
   - API 추적 헬퍼 함수

4. **layout.tsx에 GA 스크립트 추가**
   - `GoogleAnalytics` 컴포넌트 추가
   - 환경 변수 기반 조건부 로드

5. **모든 페이지에 페이지뷰 추적 추가**
   - 랜딩 페이지 (`/`)
   - 퀴즈 페이지 (`/style-quiz`)
   - 결과 페이지 (`/style-quiz/result`)

---

### Phase 2: 핵심 이벤트 추적 ✅

1. **랜딩 페이지 CTA 클릭 추적**
   - Hero 섹션의 "취향 입력하고 바로 추천받기" 버튼
   - 헤더의 "지금 추천받기" 버튼
   - API 테스트 버튼

2. **퀴즈 시작/완료 추적**
   - 퀴즈 시작 이벤트 (`quiz_start`)
   - 퀴즈 완료 이벤트 (`quiz_complete`)
   - 완료 시 소요 시간, 선택 항목 추적

3. **퀴즈 스텝 진행 추적**
   - 스텝 진행 이벤트 (`quiz_step_next`)
   - 스텝 뒤로가기 이벤트 (`quiz_step_back`)
   - 각 스텝별 선택 항목 수 추적

4. **결과 페이지 로드 추적**
   - 결과 페이지뷰 추적
   - 결과 생성 성공/실패 추적
   - 결과 생성 소요 시간 추적

---

### Phase 3: 상세 이벤트 추적 ✅

1. **스타일/색상/영감 선택 추적**
   - 스타일 선택 이벤트 (`style_selected`)
   - 색상 선택 이벤트 (`color_selected`)
   - 영감 선택 이벤트 (`inspiration_selected`)
   - 선택/해제 액션 추적
   - 총 선택 항목 수 추적

2. **퀴즈 이탈 추적**
   - 퀴즈 중간 이탈 이벤트 (`quiz_abandon`)
   - 이탈 시점 스텝 추적
   - 이탈 전 소요 시간 추적

3. **API 호출 성공/실패 추적**
   - API 호출 시작 이벤트 (`api_request_start`)
   - API 호출 성공 이벤트 (`api_request_success`)
   - API 호출 실패 이벤트 (`api_request_error`)
   - 응답 시간 추적
   - 에러 타입 추적

4. **에러 추적**
   - 예외 추적 (`exception`)
   - 결과 생성 실패 추적 (`result_error`)
   - 재시도 추적 (`result_retry`)

---

## 구현된 파일 목록

### 새로 생성된 파일
- `src/lib/analytics.ts` - GA 추적 유틸리티
- `.env.local.example` - 환경 변수 예시 파일
- `docs/GA_IMPLEMENTATION_SUMMARY.md` - 구현 요약 문서

### 수정된 파일
- `src/app/layout.tsx` - GA 스크립트 추가
- `src/app/page.tsx` - 페이지뷰 및 CTA 클릭 추적 추가
- `src/components/Header.tsx` - 헤더 CTA 클릭 추적 추가
- `src/components/style-quiz.tsx` - 퀴즈 전체 추적 추가
- `src/app/style-quiz/result/ResultClient.tsx` - 결과 페이지 추적 추가
- `src/lib/api.ts` - API 호출 추적 추가

---

## 추적되는 이벤트 목록

### 페이지뷰
- `page_view` - 모든 페이지

### 랜딩 페이지
- `cta_click` - CTA 버튼 클릭
- `header_cta_click` - 헤더 CTA 클릭
- `api_test_click` - API 테스트 버튼 클릭

### 퀴즈
- `quiz_start` - 퀴즈 시작
- `quiz_step_next` - 스텝 진행
- `quiz_step_back` - 스텝 뒤로가기
- `style_selected` - 스타일 선택
- `color_selected` - 색상 선택
- `inspiration_selected` - 영감 선택
- `quiz_complete` - 퀴즈 완료
- `quiz_abandon` - 퀴즈 이탈
- `quiz_restart` - 퀴즈 재시작

### 결과 페이지
- `result_view` - 결과 페이지 로드
- `result_generated` - 결과 생성 성공
- `result_error` - 결과 생성 실패
- `result_retry` - 결과 재시도
- `navigate_home` - 홈으로 이동

### API 호출
- `api_request_start` - API 호출 시작
- `api_request_success` - API 호출 성공
- `api_request_error` - API 호출 실패

### 에러
- `exception` - 예외 발생

---

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Google Analytics 설정
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-5WXL2SQQYQ
NEXT_PUBLIC_GA_ENABLED=true
```

**주의사항:**
- 개발 환경(localhost)에서는 자동으로 비활성화됩니다
- 프로덕션 환경에서만 추적이 활성화됩니다
- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다

---

## 테스트 방법

### 1. 환경 변수 설정 확인

```bash
# .env.local 파일이 있는지 확인
ls -la .env.local

# 파일 내용 확인
cat .env.local
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 브라우저에서 테스트

1. 프로덕션 환경에서 접속 (localhost가 아닌 실제 도메인)
2. Google Analytics 대시보드 접속
3. 실시간(Realtime) 보고서 확인
4. 각 페이지를 방문하고 이벤트가 기록되는지 확인

### 4. 확인할 이벤트

1. **랜딩 페이지 방문**
   - 페이지뷰: `/`
   - CTA 클릭: `cta_click`

2. **퀴즈 진행**
   - 퀴즈 시작: `quiz_start`
   - 스타일 선택: `style_selected`
   - 색상 선택: `color_selected`
   - 영감 선택: `inspiration_selected`
   - 퀴즈 완료: `quiz_complete`

3. **결과 페이지**
   - 결과 페이지뷰: `/style-quiz/result`
   - 결과 생성: `result_generated`

---

## 다음 단계

1. **프로덕션 배포 후 테스트**
   - 실제 프로덕션 환경에서 GA 추적 확인
   - Google Analytics 대시보드에서 이벤트 확인

2. **커스텀 대시보드 설정** (Phase 4)
   - Google Analytics에서 커스텀 대시보드 생성
   - 전환 목표 설정
   - 사용자 세그먼트 생성

3. **데이터 분석**
   - 전환율 분석
   - 퀴즈 완료율 분석
   - 스타일 선호도 트렌드 분석

---

## 참고 문서

- [구글 애널리틱스 가이드](./GOOGLE_ANALYTICS_GUIDE.md) - 전체 가이드 문서
- [Google Analytics 공식 문서](https://developers.google.com/analytics)

---

## 문제 해결

### GA 추적이 작동하지 않는 경우

1. **환경 변수 확인**
   ```bash
   # .env.local 파일이 있는지 확인
   ls -la .env.local
   
   # 환경 변수가 제대로 로드되었는지 확인
   # 브라우저 콘솔에서 확인:
   console.log(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
   ```

2. **개발 환경 확인**
   - localhost에서는 자동으로 비활성화됩니다
   - 프로덕션 환경에서만 테스트하세요

3. **브라우저 콘솔 확인**
   - 개발 환경에서는 이벤트가 콘솔에 출력됩니다
   - `[GA Event (Dev)]` 로그 확인

4. **GA 대시보드 확인**
   - Google Analytics 대시보드에서 실시간 보고서 확인
   - 이벤트가 기록되는 데 몇 분 정도 걸릴 수 있습니다

---

## 완료 체크리스트

- [x] 라이브러리 설치
- [x] 환경 변수 설정
- [x] analytics.ts 유틸리티 생성
- [x] layout.tsx에 GA 스크립트 추가
- [x] 모든 페이지에 페이지뷰 추적 추가
- [x] 랜딩 페이지 CTA 클릭 추적
- [x] 퀴즈 시작/완료 추적
- [x] 퀴즈 스텝 진행 추적
- [x] 결과 페이지 로드 추적
- [x] 스타일/색상/영감 선택 추적
- [x] 퀴즈 이탈 추적
- [x] API 호출 성공/실패 추적
- [x] 에러 추적
- [ ] 프로덕션 환경에서 실제 테스트 (사용자 확인 필요)
