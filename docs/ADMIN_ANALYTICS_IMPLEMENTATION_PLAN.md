# 어드민 분석 대시보드 구현 계획

> 작성일: 2025-01-XX  
> 프로젝트: Clocan (Closet Canvas)  
> 목적: 백엔드 로그 기반 어드민 분석 대시보드 구현

---

## 📋 목차

1. [개요](#개요)
2. [요구사항](#요구사항)
3. [기술 스택](#기술-스택)
4. [아키텍처 설계](#아키텍처-설계)
5. [백엔드 구현 계획](#백엔드-구현-계획)
6. [프론트엔드 구현 계획](#프론트엔드-구현-계획)
7. [데이터 구조](#데이터-구조)
8. [구현 단계](#구현-단계)

---

## 개요

백엔드 서버의 로그 파일을 기반으로 어드민 페이지에 다음 통계를 제공합니다:

1. **랜딩 페이지 접속 수 주별 추이** (표 + 그래프)
2. **스타일 퀴즈 완료 수 주별 추이** (표 + 그래프)
3. **AI 스타일 분석 완료 수 주별 추이** (표 + 그래프)

### 특징

- **인증 없음**: 공개된 API로 접근 가능
- **실시간 집계**: API 호출 시 로그 파일을 읽어서 집계
- **로그 파싱**: 정규표현식을 사용한 LogParser 클래스
- **주별 단위**: 주(Week) 단위로 데이터 집계

---

## 요구사항

### 기능 요구사항

| ID | 기능 | 설명 |
|----|------|------|
| **REQ-ADMIN-001** | 랜딩 페이지 접속 수 조회 | 주별 랜딩 페이지 접속 수 집계 |
| **REQ-ADMIN-002** | 스타일 퀴즈 완료 수 조회 | 주별 스타일 퀴즈 완료 수 집계 |
| **REQ-ADMIN-003** | AI 분석 완료 수 조회 | 주별 AI 스타일 분석 완료 수 집계 |
| **REQ-ADMIN-004** | 로그 파싱 | 정규표현식으로 로그 한 줄 파싱 |
| **REQ-ADMIN-005** | 어드민 페이지 UI | 표와 그래프로 데이터 시각화 |

### 비기능 요구사항

| ID | 요구사항 | 설명 |
|----|---------|------|
| **REQ-ADMIN-NF-001** | 인증 불필요 | 공개 API로 접근 가능 |
| **REQ-ADMIN-NF-002** | 성능 | 로그 파일 읽기 최적화 (최근 N일만 읽기) |
| **REQ-ADMIN-NF-003** | 에러 처리 | 로그 파일이 없거나 읽을 수 없을 때 처리 |

---

## 기술 스택

### 백엔드

- **Spring Boot 3.2.0**
- **Java 17**
- **정규표현식**: `java.util.regex.Pattern`
- **파일 I/O**: `java.nio.file.Files`

### 프론트엔드

- **Next.js 15.0**
- **React 19.0**
- **TypeScript**
- **Recharts** (이미 설치됨) - 차트 라이브러리
- **shadcn/ui** - UI 컴포넌트

---

## 아키텍처 설계

### 전체 흐름

```
┌─────────────────┐
│  어드민 페이지   │
│  /admin/analytics│
└────────┬────────┘
         │ HTTP GET
         ▼
┌─────────────────┐
│  Analytics API   │
│  /api/v1/admin/ │
│  analytics/*    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  LogParser       │
│  (정규표현식)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  LogFileReader  │
│  (로그 파일 읽기)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  logs/          │
│  application.log│
│  api-requests.log│
└─────────────────┘
```

### 데이터 흐름

1. **프론트엔드**: 어드민 페이지에서 API 호출
2. **백엔드**: 로그 파일 읽기
3. **백엔드**: LogParser로 각 줄 파싱
4. **백엔드**: 주별로 집계
5. **백엔드**: JSON 응답 반환
6. **프론트엔드**: 표와 그래프로 표시

---

## 백엔드 구현 계획

### 1. LogParser 클래스

**위치**: `backend/src/main/java/com/example/wardrobe/common/logging/LogParser.java`

**역할**: 로그 한 줄을 파싱하여 구조화된 데이터 추출

**파싱할 정보**:
- `requestId`: ULID 또는 UUID
- `timestamp`: 로그 타임스탬프
- `method`: HTTP 메서드 (GET, POST 등)
- `apiPath`: API 경로 (예: `/api/v1/feature1/ping`)
- `referer`: Referer 헤더 (프론트엔드 페이지 정보)

**로그 형식 예시**:

```
백엔드 로그 (application.log):
2025-01-20 15:30:45.123 INFO  [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.common.logging.ApiLogger : API Request: GET /api/v1/feature1/ping | RequestId: 01AN4Z07BY79K3

프론트엔드 로그 (브라우저 콘솔 → 백엔드로 전송 시):
[2025-01-20T15:30:45.123Z][FE][INFO][Feature1] REQUEST_START { requestId: "550e8400-...", url: "https://..." }
```

**정규표현식 패턴**:

```java
// 백엔드 로그 패턴
private static final Pattern BACKEND_LOG_PATTERN = Pattern.compile(
    "^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}) " +  // timestamp
    "(INFO|DEBUG|ERROR|WARN) " +                                 // level
    "\\[([A-Z0-9]+)\\] " +                                       // requestId (ULID)
    ".*?API Request: (GET|POST|PUT|DELETE) " +                  // method
    "([^|]+)" +                                                   // apiPath
    ".*?RequestId: ([A-Z0-9]+)"                                   // requestId 확인
);

// 프론트엔드 로그 패턴 (백엔드로 전송된 경우)
private static final Pattern FRONTEND_LOG_PATTERN = Pattern.compile(
    "\\[([^]]+)\\]" +                                            // timestamp
    "\\[FE\\]" +
    "\\[([^]]+)\\]" +                                             // level
    "\\[([^]]+)\\]" +                                             // scope
    " ([A-Z_]+)" +                                                // event
    ".*?requestId[:\"\\s]+([A-Za-z0-9-]+)" +                     // requestId
    ".*?url[:\"\\s]+([^\\s}]+)"                                  // url
);
```

**클래스 구조**:

```java
public class LogParser {
    
    public static class ParsedLog {
        private String requestId;
        private LocalDateTime timestamp;
        private String method;
        private String apiPath;
        private String referer;
        private String logType; // "backend" | "frontend"
        
        // getters, setters, constructor
    }
    
    /**
     * 로그 한 줄을 파싱
     * 
     * @param logLine 로그 한 줄
     * @return ParsedLog 객체 (파싱 실패 시 null)
     */
    public static ParsedLog parse(String logLine) {
        // 백엔드 로그 패턴 매칭 시도
        Matcher backendMatcher = BACKEND_LOG_PATTERN.matcher(logLine);
        if (backendMatcher.matches()) {
            return parseBackendLog(backendMatcher);
        }
        
        // 프론트엔드 로그 패턴 매칭 시도
        Matcher frontendMatcher = FRONTEND_LOG_PATTERN.matcher(logLine);
        if (frontendMatcher.matches()) {
            return parseFrontendLog(frontendMatcher);
        }
        
        return null; // 파싱 실패
    }
    
    private static ParsedLog parseBackendLog(Matcher matcher) {
        // 그룹 추출 및 ParsedLog 객체 생성
    }
    
    private static ParsedLog parseFrontendLog(Matcher matcher) {
        // 그룹 추출 및 ParsedLog 객체 생성
        // URL에서 API 경로 추출
    }
}
```

---

### 2. AnalyticsService 클래스

**위치**: `backend/src/main/java/com/example/wardrobe/service/AnalyticsService.java`

**역할**: 로그 파일 읽기 및 집계 로직

**주요 메서드**:

```java
@Service
public class AnalyticsService {
    
    /**
     * 랜딩 페이지 접속 수 주별 집계
     * 
     * @param weeks 조회할 주 수 (기본값: 12주)
     * @return 주별 접속 수 리스트
     */
    public List<WeeklyAnalytics> getLandingPageViews(int weeks) {
        // 로그 파일 읽기
        // LogParser로 파싱
        // 랜딩 페이지 관련 로그 필터링 (referer가 "/" 또는 page_view 이벤트)
        // 주별로 집계
    }
    
    /**
     * 스타일 퀴즈 완료 수 주별 집계
     * 
     * @param weeks 조회할 주 수
     * @return 주별 완료 수 리스트
     */
    public List<WeeklyAnalytics> getQuizCompletions(int weeks) {
        // 로그 파일 읽기
        // LogParser로 파싱
        // quiz_complete 이벤트 필터링
        // 주별로 집계
    }
    
    /**
     * AI 분석 완료 수 주별 집계
     * 
     * @param weeks 조회할 주 수
     * @return 주별 완료 수 리스트
     */
    public List<WeeklyAnalytics> getAnalysisCompletions(int weeks) {
        // 로그 파일 읽기
        // LogParser로 파싱
        // result_generated 이벤트 필터링
        // 주별로 집계
    }
    
    /**
     * 로그 파일 읽기 (최근 N일만)
     * 
     * @param days 최근 며칠치 로그 읽기
     * @return 로그 라인 리스트
     */
    private List<String> readLogFiles(int days) {
        // logs/application.log 읽기
        // logs/api-requests.log 읽기
        // 최근 N일치만 필터링
    }
}
```

---

### 3. AnalyticsController 클래스

**위치**: `backend/src/main/java/com/example/wardrobe/controller/AnalyticsController.java`

**역할**: REST API 엔드포인트 제공

**엔드포인트**:

```java
@RestController
@RequestMapping("/api/v1/admin/analytics")
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    /**
     * 랜딩 페이지 접속 수 조회
     * GET /api/v1/admin/analytics/landing-page-views
     * 
     * @param weeks 조회할 주 수 (기본값: 12)
     * @return 주별 접속 수 데이터
     */
    @GetMapping("/landing-page-views")
    public ResponseEntity<List<WeeklyAnalyticsResponse>> getLandingPageViews(
        @RequestParam(defaultValue = "12") int weeks
    ) {
        // 인증 불필요 (공개 API)
        List<WeeklyAnalytics> data = analyticsService.getLandingPageViews(weeks);
        return ResponseEntity.ok(toResponse(data));
    }
    
    /**
     * 스타일 퀴즈 완료 수 조회
     * GET /api/v1/admin/analytics/quiz-completions
     */
    @GetMapping("/quiz-completions")
    public ResponseEntity<List<WeeklyAnalyticsResponse>> getQuizCompletions(
        @RequestParam(defaultValue = "12") int weeks
    ) {
        List<WeeklyAnalytics> data = analyticsService.getQuizCompletions(weeks);
        return ResponseEntity.ok(toResponse(data));
    }
    
    /**
     * AI 분석 완료 수 조회
     * GET /api/v1/admin/analytics/analysis-completions
     */
    @GetMapping("/analysis-completions")
    public ResponseEntity<List<WeeklyAnalyticsResponse>> getAnalysisCompletions(
        @RequestParam(defaultValue = "12") int weeks
    ) {
        List<WeeklyAnalytics> data = analyticsService.getAnalysisCompletions(weeks);
        return ResponseEntity.ok(toResponse(data));
    }
}
```

**Security 설정**: 인증 불필요하도록 설정

```java
// SecurityConfig.java에 추가
.requestMatchers("/api/v1/admin/analytics/**").permitAll()
```

---

### 4. DTO 클래스

**WeeklyAnalyticsResponse**:

```java
public class WeeklyAnalyticsResponse {
    private String week;        // "2025-W03" 형식
    private LocalDate startDate; // 주 시작일
    private LocalDate endDate;   // 주 종료일
    private Long count;          // 해당 주의 카운트
    
    // getters, setters, constructor
}
```

---

## 프론트엔드 구현 계획

### 1. 어드민 페이지

**위치**: `src/app/admin/analytics/page.tsx`

**구조**:

```typescript
export default function AdminAnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">어드민 분석 대시보드</h1>
      
      {/* 랜딩 페이지 접속 수 */}
      <AnalyticsCard
        title="랜딩 페이지 접속 수"
        endpoint="/api/v1/admin/analytics/landing-page-views"
      />
      
      {/* 스타일 퀴즈 완료 수 */}
      <AnalyticsCard
        title="스타일 퀴즈 완료 수"
        endpoint="/api/v1/admin/analytics/quiz-completions"
      />
      
      {/* AI 분석 완료 수 */}
      <AnalyticsCard
        title="AI 스타일 분석 완료 수"
        endpoint="/api/v1/admin/analytics/analysis-completions"
      />
    </div>
  );
}
```

---

### 2. AnalyticsCard 컴포넌트

**위치**: `src/components/admin/AnalyticsCard.tsx`

**기능**:
- API 호출하여 데이터 가져오기
- 표(Table)로 데이터 표시
- 그래프(Line Chart)로 시각화

**구조**:

```typescript
interface AnalyticsCardProps {
  title: string;
  endpoint: string;
}

export function AnalyticsCard({ title, endpoint }: AnalyticsCardProps) {
  const [data, setData] = useState<WeeklyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchAnalytics(endpoint).then(setData).finally(() => setLoading(false));
  }, [endpoint]);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 표 */}
        <AnalyticsTable data={data} />
        
        {/* 그래프 */}
        <AnalyticsChart data={data} />
      </CardContent>
    </Card>
  );
}
```

---

### 3. AnalyticsTable 컴포넌트

**위치**: `src/components/admin/AnalyticsTable.tsx`

**기능**: 주별 데이터를 표로 표시

**컬럼**:
- 주 (Week)
- 시작일
- 종료일
- 카운트

---

### 4. AnalyticsChart 컴포넌트

**위치**: `src/components/admin/AnalyticsChart.tsx`

**기능**: Recharts를 사용한 라인 차트

**차트 타입**: Line Chart

**X축**: 주 (Week)
**Y축**: 카운트 (Count)

---

## 데이터 구조

### API 응답 형식

```json
[
  {
    "week": "2025-W03",
    "startDate": "2025-01-13",
    "endDate": "2025-01-19",
    "count": 125
  },
  {
    "week": "2025-W04",
    "startDate": "2025-01-20",
    "endDate": "2025-01-26",
    "count": 158
  }
]
```

### TypeScript 타입

```typescript
interface WeeklyAnalytics {
  week: string;        // "2025-W03"
  startDate: string;   // "2025-01-13"
  endDate: string;     // "2025-01-19"
  count: number;       // 125
}
```

---

## 구현 단계

### Phase 1: 백엔드 로그 파싱 (2일)

**목표**: LogParser 클래스 구현

- [ ] LogParser 클래스 생성
- [ ] 정규표현식 패턴 정의
- [ ] 백엔드 로그 파싱 로직 구현
- [ ] 프론트엔드 로그 파싱 로직 구현
- [ ] 단위 테스트 작성

**예상 시간**: 4-6시간

---

### Phase 2: 백엔드 집계 서비스 (2일)

**목표**: AnalyticsService 구현

- [ ] AnalyticsService 클래스 생성
- [ ] 로그 파일 읽기 로직 구현
- [ ] 랜딩 페이지 접속 수 집계 로직
- [ ] 스타일 퀴즈 완료 수 집계 로직
- [ ] AI 분석 완료 수 집계 로직
- [ ] 주별 집계 로직 구현

**예상 시간**: 6-8시간

---

### Phase 3: 백엔드 API 엔드포인트 (1일)

**목표**: REST API 구현

- [ ] AnalyticsController 생성
- [ ] 3개 엔드포인트 구현
- [ ] DTO 클래스 생성
- [ ] Security 설정 (인증 불필요)
- [ ] API 테스트

**예상 시간**: 2-3시간

---

### Phase 4: 프론트엔드 컴포넌트 (2일)

**목표**: 어드민 페이지 UI 구현

- [ ] 어드민 페이지 생성 (`/admin/analytics`)
- [ ] AnalyticsCard 컴포넌트 구현
- [ ] AnalyticsTable 컴포넌트 구현
- [ ] AnalyticsChart 컴포넌트 구현 (Recharts)
- [ ] API 호출 로직 구현
- [ ] 로딩/에러 상태 처리

**예상 시간**: 6-8시간

---

### Phase 5: 통합 테스트 (1일)

**목표**: 전체 플로우 테스트

- [ ] 백엔드 로그 생성 테스트
- [ ] API 엔드포인트 테스트
- [ ] 프론트엔드 UI 테스트
- [ ] 전체 통합 테스트

**예상 시간**: 2-3시간

---

## 로그 파싱 상세 설계

### 백엔드 로그 형식

```
2025-01-20 15:30:45.123 INFO  [01AN4Z07BY79K3] --- [http-nio-8080-exec-1] c.e.w.common.logging.ApiLogger : API Request: GET /api/v1/feature1/ping | RequestId: 01AN4Z07BY79K3
```

**정규표현식**:

```java
private static final Pattern BACKEND_LOG_PATTERN = Pattern.compile(
    "^(\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}\\.\\d{3}) " +  // Group 1: timestamp
    "(INFO|DEBUG|ERROR|WARN) " +                                 // Group 2: level
    "\\[([A-Z0-9]{26})\\] " +                                    // Group 3: requestId (ULID 26자)
    ".*?API Request: (GET|POST|PUT|DELETE|PATCH) " +            // Group 4: method
    "([^|\\s]+)" +                                                // Group 5: apiPath
    ".*?RequestId: ([A-Z0-9]{26})"                                // Group 6: requestId 확인
);
```

**파싱 결과**:

```java
ParsedLog {
  requestId: "01AN4Z07BY79K3",
  timestamp: LocalDateTime.of(2025, 1, 20, 15, 30, 45, 123000000),
  method: "GET",
  apiPath: "/api/v1/feature1/ping",
  referer: null, // 백엔드 로그에는 없음
  logType: "backend"
}
```

---

### 프론트엔드 로그 형식 (백엔드로 전송 시)

프론트엔드 로그를 백엔드로 전송하는 경우를 대비한 패턴:

```
[2025-01-20T15:30:45.123Z][FE][INFO][Feature1] REQUEST_START { "requestId": "550e8400-e29b-41d4-a716-446655440000", "url": "https://api.example.com/api/v1/feature1/ping" }
```

**정규표현식**:

```java
private static final Pattern FRONTEND_LOG_PATTERN = Pattern.compile(
    "\\[([^]]+)\\]" +                                             // Group 1: timestamp
    "\\[FE\\]" +
    "\\[([^]]+)\\]" +                                             // Group 2: level
    "\\[([^]]+)\\]" +                                             // Group 3: scope
    " ([A-Z_]+)" +                                                // Group 4: event
    ".*?\"requestId\"[:\"\\s]+([A-Za-z0-9-]+)" +                 // Group 5: requestId
    ".*?\"url\"[:\"\\s]+([^\\s}]+)"                              // Group 6: url
);
```

---

### 랜딩 페이지 접속 수 집계 로직

**필터링 조건**:
1. 프론트엔드 로그: `event = "page_view"` AND `apiPath = "/"` 또는 `referer = "/"`
2. 백엔드 로그: `apiPath = "/"` (또는 랜딩 페이지 관련 API)

**집계 방법**:
- 주(Week) 단위로 그룹화
- ISO 8601 주 형식 사용: `2025-W03`

---

### 스타일 퀴즈 완료 수 집계 로직

**필터링 조건**:
1. 프론트엔드 로그: `event = "quiz_complete"`
2. 백엔드 로그: `apiPath = "/api/v1/style-quiz/complete"` (또는 관련 API)

---

### AI 분석 완료 수 집계 로직

**필터링 조건**:
1. 프론트엔드 로그: `event = "result_generated"` AND `has_error = false`
2. 백엔드 로그: `apiPath = "/api/v1/style-quiz/result"` (또는 관련 API)

---

## 성능 최적화

### 로그 파일 읽기 최적화

1. **최근 N일만 읽기**: 기본값 90일 (약 12주)
2. **역순 읽기**: 최신 로그부터 읽기 (필요한 기간만 읽으면 중단)
3. **캐싱**: 같은 요청에 대해 짧은 시간(5분) 캐시

```java
@Cacheable(value = "analytics", key = "#endpoint + '_' + #weeks")
public List<WeeklyAnalytics> getAnalytics(String endpoint, int weeks) {
    // 집계 로직
}
```

---

## 에러 처리

### 로그 파일이 없는 경우

```java
if (!logFile.exists()) {
    log.warn("Log file not found: {}", logFile.getPath());
    return Collections.emptyList();
}
```

### 로그 파일 읽기 실패

```java
try {
    return Files.readAllLines(logFile.toPath());
} catch (IOException e) {
    log.error("Failed to read log file: {}", e.getMessage());
    throw new AnalyticsException("Failed to read log file", e);
}
```

### 파싱 실패

```java
ParsedLog parsed = LogParser.parse(logLine);
if (parsed == null) {
    // 파싱 실패한 로그는 무시하고 계속 진행
    continue;
}
```

---

## 보안 고려사항

### 인증 없이 접근 가능

- **위험도**: 낮음 (통계 데이터만 제공)
- **대응**: 민감한 정보(사용자 ID, 개인정보 등)는 로그에 포함하지 않음

### 향후 개선

- IP 화이트리스트
- API 키 기반 인증
- Rate Limiting

---

## 테스트 계획

### 단위 테스트

1. **LogParser 테스트**
   - 백엔드 로그 파싱 테스트
   - 프론트엔드 로그 파싱 테스트
   - 잘못된 형식 로그 처리 테스트

2. **AnalyticsService 테스트**
   - 로그 파일 읽기 테스트
   - 집계 로직 테스트
   - 주별 그룹화 테스트

### 통합 테스트

1. **API 엔드포인트 테스트**
   - 각 엔드포인트 응답 테스트
   - 에러 케이스 테스트

2. **전체 플로우 테스트**
   - 로그 생성 → 파싱 → 집계 → API 응답 → 프론트엔드 표시

---

## 참고 자료

- [Logback 공식 문서](https://logback.qos.ch/)
- [Java 정규표현식 가이드](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html)
- [Recharts 공식 문서](https://recharts.org/)
- [ISO 8601 주 형식](https://en.wikipedia.org/wiki/ISO_8601#Week_dates)

---

## 업데이트 이력

- 2025-01-XX: 초기 작성
  - 요구사항 분석 완료
  - 아키텍처 설계 완료
  - 구현 계획 수립 완료
