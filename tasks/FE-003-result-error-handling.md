# FE-003: Result 페이지 에러 처리 구현

## 📌 Issue Title
`Implement error handling for StyleQuizResultPage`

## 🎯 Goal
Result 페이지에서 AI 분석 중 발생할 수 있는 에러를 적절히 처리하고, 사용자에게 명확한 피드백을 제공합니다.

## 📋 Background
현재 Result 페이지는 AI 분석 시뮬레이션만 수행하며, try-catch 블록이 없어 실제 API 연동 시 에러 처리가 불가능합니다.

## 📂 Modified Files (Expected)
- `src/app/style-quiz/result/page.tsx`
- `src/types/quiz.ts` (에러 타입 추가)

## ✅ Acceptance Criteria

### Must Have
- [ ] generateResult 함수에 try-catch 블록 추가
- [ ] 에러 상태 관리 (error state)
- [ ] 로딩 실패 시 폴백 UI 표시
  - 에러 메시지
  - "퀴즈 다시 하기" 버튼
  - "홈으로 돌아가기" 버튼
- [ ] 네트워크 에러 처리
- [ ] 타임아웃 처리 (10초)

### Nice to Have
- [ ] Retry 로직 (3회 재시도)
- [ ] 에러 타입별 커스텀 메시지
  - 네트워크 에러
  - API 응답 에러
  - 타임아웃
  - 파싱 에러
- [ ] 에러 분석 로깅

## 💡 Implementation Details

### 에러 상태 관리
```typescript
// src/app/style-quiz/result/page.tsx
const [result, setResult] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<{
  message: string;
  type: 'network' | 'api' | 'timeout' | 'unknown';
} | null>(null);
```

### generateResult 함수 개선
```typescript
const generateResult = async () => {
  setLoading(true);
  setError(null);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃
  
  try {
    // AI 호출 (향후 실제 API로 교체)
    const response = await fetch('/api/analyze-style', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ styles, colors, inspirations }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    setResult(data.analysis);
  } catch (err) {
    clearTimeout(timeoutId);
    
    if (err.name === 'AbortError') {
      setError({
        message: '분석 시간이 초과되었습니다. 다시 시도해주세요.',
        type: 'timeout',
      });
    } else if (err instanceof TypeError) {
      setError({
        message: '네트워크 연결을 확인해주세요.',
        type: 'network',
      });
    } else {
      setError({
        message: '분석 중 오류가 발생했습니다.',
        type: 'unknown',
      });
    }
    
    console.error('Style analysis error:', err);
  } finally {
    setLoading(false);
  }
};
```

### 에러 UI
```typescript
{error && (
  <Card className="border-2 border-destructive/50">
    <CardContent className="p-6 text-center">
      <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">분석 실패</h3>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => router.push('/style-quiz')}>
          퀴즈 다시 하기
        </Button>
        <Button onClick={generateResult}>
          다시 시도
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

### Retry 로직 (Optional)
```typescript
const MAX_RETRIES = 3;
let retryCount = 0;

const generateResultWithRetry = async () => {
  try {
    await generateResult();
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying... (${retryCount}/${MAX_RETRIES})`);
      setTimeout(generateResultWithRetry, 2000 * retryCount);
    } else {
      setError({
        message: '여러 번 시도했지만 분석에 실패했습니다.',
        type: 'unknown',
      });
    }
  }
};
```

## 🧪 Testing Checklist
- [ ] 정상 케이스: 분석 성공
- [ ] 네트워크 오프라인 시나리오
- [ ] API 500 에러 시나리오
- [ ] 타임아웃 시나리오
- [ ] "다시 시도" 버튼 동작 확인
- [ ] "퀴즈 다시 하기" 버튼 동작 확인
- [ ] 로딩 상태 표시 확인

## 📊 Impact
- **사용자 경험**: ⬆️⬆️⬆️ 에러 상황에서도 명확한 피드백
- **안정성**: ⬆️⬆️ API 연동 준비 완료
- **신뢰성**: ⬆️⬆️ 재시도 로직으로 일시적 에러 해결

## 🏷️ Labels
`enhancement`, `frontend`, `error-handling`, `high-priority`

## 📅 Estimated Time
**1-2 hours**

## 🔗 Related Issues
- FE-002 (Error Boundary)
- BE-001 (Gemini API 연동)
- Related to #1 (Refactoring Plan)

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** High

