# 🔧 Refactoring Plan - Issue #1

**브랜치:** `feature/issue-1-refactoring`  
**목표:** 코드 품질 향상 (B등급 3.4/5.0 → A등급 4.5+/5.0)  
**예상 소요 시간:** 1-2주

---

## 📋 작업 목록

### 🥇 Phase 1: 컴포넌트 구조 개선 (High Priority)

#### ✅ Task 1: StyleQuiz 컴포넌트 분해
**현재 문제:**
- 229줄의 비대한 단일 컴포넌트
- 여러 책임 혼재
- 테스트 및 유지보수 어려움

**리팩토링 계획:**
```
src/components/quiz/
├── StyleQuiz.tsx              (메인 오케스트레이터, ~80줄)
├── QuizHeader.tsx             (Progress + Title, ~30줄)
├── QuizFooter.tsx             (Navigation, ~40줄)
├── steps/
│   ├── WelcomeStep.tsx        (~30줄)
│   ├── StyleSelectionStep.tsx (~60줄)
│   ├── ColorSelectionStep.tsx (~50줄)
│   ├── InspirationSelectionStep.tsx (~60줄)
│   └── CompletionStep.tsx     (~30줄)
└── shared/
    ├── SelectionCard.tsx      (~40줄)
    └── ColorPaletteCard.tsx   (~30줄)
```

**예상 효과:**
- ✅ 각 파일 80줄 이하로 축소
- ✅ 가독성 향상 (3.0 → 5.0)
- ✅ 재사용성 증가
- ✅ 테스트 작성 용이

---

#### ✅ Task 2: SelectionCard 공통 컴포넌트 추출
**현재 문제:**
- 선택 카드 렌더링 로직이 3번 반복됨
- 중복 코드 (DRY 원칙 위반)

**새 컴포넌트:**
```typescript
// src/components/quiz/shared/SelectionCard.tsx
interface SelectionCardProps {
  id: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function SelectionCard({ ... }) {
  return (
    <Card
      onClick={() => onToggle(id)}
      className={cn(
        'cursor-pointer transition-all',
        isSelected && 'ring-2 ring-primary'
      )}
    >
      {children}
      {isSelected && <CheckIcon />}
    </Card>
  );
}
```

---

#### ✅ Task 3: QuizStep 개별 컴포넌트로 분리
**각 스텝을 독립 컴포넌트로:**
```typescript
// StyleSelectionStep.tsx
export function StyleSelectionStep({ 
  selectedItems, 
  onToggle 
}: QuizStepProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {QUIZ_STYLES.map(style => (
        <StyleCard 
          key={style.id}
          style={style}
          isSelected={selectedItems.includes(style.id)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
```

---

#### ✅ Task 4: useQuizState 커스텀 훅 생성
**상태 관리 로직 분리:**
```typescript
// src/hooks/useQuizState.ts
export function useQuizState() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    styles: [],
    colors: [],
    inspirations: [],
  });

  const toggleSelection = (category: string, id: string) => {
    setSelections(prev => ({
      ...prev,
      [category]: prev[category].includes(id)
        ? prev[category].filter(i => i !== id)
        : [...prev[category], id]
    }));
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return {
    step,
    selections,
    toggleSelection,
    nextStep,
    prevStep,
  };
}
```

---

### 🥈 Phase 2: 타입 시스템 강화 (Medium Priority)

#### ✅ Task 5: 타입 정의 강화
**새 타입 파일 생성:**
```typescript
// src/types/quiz.ts
export interface QuizState {
  currentStep: number;
  selections: {
    styles: string[];
    colors: string[];
    inspirations: string[];
  };
}

export interface QuizStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<QuizStepProps>;
  isSelectionRequired: boolean;
  validationFn?: (selections: string[]) => boolean;
}

export interface QuizStepProps {
  selectedItems: string[];
  onToggle: (id: string) => void;
}

export type QuizCategory = 'styles' | 'colors' | 'inspirations';
```

---

### 🥉 Phase 3: 에러 처리 및 안정성 (Medium Priority)

#### ✅ Task 6: 에러 바운더리 추가
```typescript
// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<Props, State> {
  // 에러 발생 시 fallback UI 표시
}
```

**적용 위치:**
- StyleQuiz 컴포넌트 래핑
- Result 페이지 래핑

---

#### ✅ Task 7: Result 페이지 에러 처리
**현재:**
```typescript
const generateResult = async () => {
  setLoading(true);
  // No error handling
  setResult(analysisResult);
  setLoading(false);
};
```

**개선:**
```typescript
const generateResult = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const result = await analyzeStyle(selections);
    setResult(result);
  } catch (err) {
    setError('분석 중 오류가 발생했습니다.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

---

### 🧹 Phase 4: 코드 정리 (Low Priority)

#### ✅ Task 8: 미사용 UI 컴포넌트 정리
**현재:**
- 34개 컴포넌트 중 28개 미사용 (82%)

**전략:**
```bash
# 1. archive 브랜치 생성
git checkout -b archive/unused-components

# 2. 미사용 컴포넌트 이동
mkdir -p archive/components/ui
mv src/components/ui/unused-*.tsx archive/components/ui/

# 3. main 브랜치로 돌아와서 삭제
git checkout main
git rm src/components/ui/unused-*.tsx
```

**보관할 컴포넌트:**
- accordion, alert, avatar, calendar, carousel, chart
- checkbox, collapsible, dialog, dropdown-menu, form
- input, label, menubar, popover, radio-group
- scroll-area, select, separator, sheet, sidebar
- skeleton, slider, switch, table, tabs, textarea, tooltip

---

#### ✅ Task 9: 퀴즈 설정 상수 추출
```typescript
// src/config/quiz-config.ts
export const QUIZ_CONFIG = {
  TOTAL_STEPS: 5,
  SELECTION_STEPS: 3,
  MIN_SELECTIONS: 1,
  LOADING_DELAY_MS: 2000,
  MOBILE_BREAKPOINT: 768,
} as const;

export const STEP_IDS = {
  WELCOME: 'welcome',
  STYLE: 'style-selection',
  COLOR: 'color-selection',
  INSPIRATION: 'inspiration-selection',
  COMPLETION: 'completion',
} as const;
```

---

### 📊 Phase 5: 품질 검증 (Final)

#### ✅ Task 10: 코드 품질 재평가
**체크리스트:**
- [ ] 각 파일 100줄 이하
- [ ] 중복 코드 제거
- [ ] 타입 정의 100%
- [ ] 에러 처리 추가
- [ ] Lint 에러 0개
- [ ] 문서 업데이트

**목표 점수:**
| 항목 | 현재 | 목표 | 개선 |
|------|------|------|------|
| 가독성 | 3.0 | 5.0 | +2.0 |
| 재사용성 | 4.0 | 4.5 | +0.5 |
| 유지보수성 | 3.0 | 4.5 | +1.5 |
| 성능 | 3.5 | 4.0 | +0.5 |
| 안정성 | 4.0 | 5.0 | +1.0 |
| **총점** | **3.4** | **4.6** | **+1.2** |

---

## 📅 작업 일정

### Week 1
- Day 1-2: Task 1, 2 (컴포넌트 분해)
- Day 3-4: Task 3, 4 (스텝 분리 + 훅)
- Day 5: Task 5 (타입 강화)

### Week 2
- Day 1-2: Task 6, 7 (에러 처리)
- Day 3: Task 8 (미사용 코드 정리)
- Day 4: Task 9 (설정 상수)
- Day 5: Task 10 (재평가 + 문서)

---

## ✅ 완료 기준

각 태스크는 다음 조건을 만족해야 완료:

1. **코드 작성**
   - [ ] 기능 구현 완료
   - [ ] Lint 에러 0개
   - [ ] TypeScript 에러 0개

2. **문서화**
   - [ ] Docstring 주석 추가
   - [ ] 사용 예제 포함

3. **테스트**
   - [ ] 브라우저에서 동작 확인
   - [ ] 엣지 케이스 테스트

4. **커밋**
   - [ ] 의미 있는 커밋 메시지
   - [ ] 관련 파일만 포함

---

## 🚀 시작 방법

```bash
# 1. 브랜치 확인
git branch  # feature/issue-1-refactoring 인지 확인

# 2. 첫 번째 태스크 시작
# Task 1: StyleQuiz 컴포넌트 분해

# 3. 작업 후 커밋
git add .
git commit -m "refactor: StyleQuiz 컴포넌트를 작은 단위로 분해

- QuizHeader, QuizFooter 분리
- SelectionCard 공통 컴포넌트 추출
- 각 파일 80줄 이하로 축소

Related to #1"

# 4. 원격 브랜치로 푸시
git push origin feature/issue-1-refactoring
```

---

## 📝 참고 문서

- [CODE_QUALITY.md](./CODE_QUALITY.md) - 현재 품질 평가
- [COMPONENT_ARCHITECTURE.md](./COMPONENT_ARCHITECTURE.md) - 구조 분석
- [React Best Practices](https://react.dev/learn)

---

**작성자:** Closet Canvas Team  
**작성일:** 2025-12-06  
**업데이트:** 2025-12-06

