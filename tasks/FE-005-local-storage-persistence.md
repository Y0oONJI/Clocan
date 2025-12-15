# FE-005: 로컬 스토리지 상태 저장

## 📌 Issue Title
`Implement localStorage persistence for quiz state and results`

## 🎯 Goal
퀴즈 진행 상태와 분석 결과를 브라우저 로컬 스토리지에 저장하여, 페이지 새로고침이나 재방문 시에도 데이터를 유지합니다.

## 📋 Background
현재 퀴즈 진행 중 페이지를 새로고침하면 모든 선택 항목이 사라지고, 결과 페이지도 URL 파라미터에만 의존합니다. 사용자 경험 향상을 위해 데이터 영속성이 필요합니다.

## 📂 Modified Files (Expected)
- `src/hooks/useQuizState.ts` (localStorage 연동)
- `src/lib/storage.ts` (신규 생성 - storage 유틸리티)
- `src/app/style-quiz/result/page.tsx` (결과 저장/불러오기)
- `src/types/quiz.ts` (저장 타입 추가)

## ✅ Acceptance Criteria

### Must Have
- [ ] 퀴즈 상태 자동 저장
  - step 변경 시 자동 저장
  - selections 변경 시 자동 저장
- [ ] 퀴즈 상태 복원
  - 페이지 로드 시 저장된 상태 불러오기
  - 없으면 초기값 사용
- [ ] 결과 저장
  - 분석 결과를 로컬에 저장
  - 타임스탬프 포함
- [ ] 데이터 초기화 기능
  - "새로 시작하기" 버튼
  - 저장된 데이터 삭제

### Nice to Have
- [ ] 저장 크기 제한 체크 (5MB)
- [ ] 데이터 만료 처리 (7일 후 자동 삭제)
- [ ] 여러 퀴즈 결과 히스토리 저장
- [ ] Export/Import 기능 (JSON)

## 💡 Implementation Details

### Step 1: Storage 유틸리티 생성
```typescript
// src/lib/storage.ts
/**
 * Local Storage 유틸리티
 */

const STORAGE_KEYS = {
  QUIZ_STATE: 'closet-canvas-quiz-state',
  QUIZ_RESULT: 'closet-canvas-quiz-result',
} as const;

export interface StoredQuizState {
  step: number;
  selections: {
    styles: string[];
    colors: string[];
    inspirations: string[];
  };
  timestamp: number;
}

export interface StoredQuizResult {
  analysis: string;
  selections: {
    styles: string[];
    colors: string[];
    inspirations: string[];
  };
  timestamp: number;
}

/**
 * 퀴즈 상태 저장
 */
export function saveQuizState(state: Omit<StoredQuizState, 'timestamp'>) {
  try {
    const data: StoredQuizState = {
      ...state,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.QUIZ_STATE, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save quiz state:', error);
  }
}

/**
 * 퀴즈 상태 불러오기
 */
export function loadQuizState(): StoredQuizState | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_STATE);
    if (!data) return null;

    const parsed: StoredQuizState = JSON.parse(data);
    
    // 7일 이상 지난 데이터는 삭제
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - parsed.timestamp > SEVEN_DAYS) {
      clearQuizState();
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load quiz state:', error);
    return null;
  }
}

/**
 * 퀴즈 상태 삭제
 */
export function clearQuizState() {
  localStorage.removeItem(STORAGE_KEYS.QUIZ_STATE);
}

/**
 * 퀴즈 결과 저장
 */
export function saveQuizResult(result: Omit<StoredQuizResult, 'timestamp'>) {
  try {
    const data: StoredQuizResult = {
      ...result,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULT, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save quiz result:', error);
  }
}

/**
 * 퀴즈 결과 불러오기
 */
export function loadQuizResult(): StoredQuizResult | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULT);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load quiz result:', error);
    return null;
  }
}
```

### Step 2: useQuizState 훅에 통합
```typescript
// src/hooks/useQuizState.ts
import { saveQuizState, loadQuizState, clearQuizState } from '@/lib/storage';

export function useQuizState() {
  // 초기값을 로컬 스토리지에서 불러오기
  const [step, setStep] = useState(() => {
    const saved = loadQuizState();
    return saved?.step ?? 0;
  });

  const [selections, setSelections] = useState<QuizSelections>(() => {
    const saved = loadQuizState();
    return saved?.selections ?? {
      styles: [],
      colors: [],
      inspirations: [],
    };
  });

  // 상태 변경 시 자동 저장
  useEffect(() => {
    saveQuizState({ step, selections });
  }, [step, selections]);

  // 초기화 함수
  const resetQuiz = useCallback(() => {
    setStep(0);
    setSelections({ styles: [], colors: [], inspirations: [] });
    clearQuizState();
  }, []);

  return {
    step,
    selections,
    toggleSelection,
    nextStep,
    prevStep,
    resetQuiz, // 새로 추가
    isNextDisabled,
    isLastStep,
    isFirstStep,
  };
}
```

### Step 3: "새로 시작하기" 버튼 추가
```typescript
// src/components/style-quiz.tsx
import { AlertDialog } from '@/components/ui/alert-dialog';

// 컴포넌트 내부
const { resetQuiz } = useQuizState();

const handleReset = () => {
  if (confirm('진행 중인 퀴즈를 초기화하시겠습니까?')) {
    resetQuiz();
  }
};

// UI
{step > 0 && step < QUIZ_STEPS.length - 1 && (
  <Button variant="ghost" onClick={handleReset}>
    새로 시작
  </Button>
)}
```

## 🧪 Testing Checklist
- [ ] 퀴즈 진행 중 새로고침 시 상태 유지 확인
- [ ] 브라우저 탭 닫고 다시 열기
- [ ] "새로 시작하기" 버튼 동작 확인
- [ ] 로컬 스토리지 크기 확인 (< 5MB)
- [ ] 7일 후 자동 삭제 로직 확인
- [ ] 여러 브라우저/시크릿 모드에서 독립 동작 확인

## 📊 Impact
- **사용자 경험**: ⬆️⬆️⬆️ 진행 상태 유지
- **이탈률**: ⬇️⬇️ 새로고침 시에도 데이터 보존
- **편의성**: ⬆️⬆️ 언제든지 중단하고 돌아올 수 있음

## 🏷️ Labels
`enhancement`, `frontend`, `ux`, `medium-priority`

## 📅 Estimated Time
**2-3 hours**

## 🔗 Related Issues
- Related to Phase 4 in Roadmap (Feature Expansion)

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** Medium


