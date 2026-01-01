# FE-006: 접근성 개선 (WCAG 2.1 AA)

## 📌 Issue Title
`Improve accessibility compliance (WCAG 2.1 AA)`

## 🎯 Goal
웹 접근성 표준(WCAG 2.1 AA)을 준수하여 모든 사용자가 애플리케이션을 사용할 수 있도록 개선합니다.

## 📋 Background
현재 프로젝트는 기본적인 접근성만 제공하고 있습니다. Radix UI를 사용하여 일부 접근성은 확보되었으나, ARIA labels, 키보드 네비게이션, 스크린 리더 최적화 등이 부족합니다.

## 📂 Modified Files (Expected)
- `src/components/quiz/shared/SelectionCard.tsx` (ARIA 추가)
- `src/components/quiz/shared/StyleCard.tsx` (alt text 개선)
- `src/components/quiz/shared/ColorPaletteCard.tsx` (색상 정보)
- `src/components/style-quiz.tsx` (키보드 네비게이션)
- `src/app/layout.tsx` (lang, skip link)
- `tailwind.config.ts` (focus-visible 스타일)

## ✅ Acceptance Criteria

### Must Have
- [ ] ARIA Labels 추가
  - 모든 인터랙티브 요소에 aria-label
  - 선택 상태 aria-checked 또는 aria-selected
  - 진행도 바에 aria-valuenow
- [ ] 키보드 네비게이션
  - Tab으로 모든 요소 접근 가능
  - Enter/Space로 선택 가능
  - Esc로 모달 닫기
- [ ] 시맨틱 HTML
  - button 요소 사용 (div onClick 금지)
  - heading 계층 구조 (h1 > h2 > h3)
  - nav, main, article 태그 사용
- [ ] 색상 대비 비율
  - 텍스트-배경 4.5:1 이상
  - 큰 텍스트 3:1 이상
- [ ] 포커스 표시
  - focus-visible 스타일
  - outline 제거 금지

### Nice to Have
- [ ] Skip to content 링크
- [ ] 다크 모드 지원 (고대비 모드)
- [ ] 축소/확대 200% 지원
- [ ] 스크린 리더 전용 텍스트
- [ ] Live regions (동적 콘텐츠)

## 💡 Implementation Details

### Step 1: SelectionCard ARIA 개선
```typescript
// src/components/quiz/shared/SelectionCard.tsx
export function SelectionCard({
  id,
  isSelected,
  onToggle,
  children,
  ariaLabel, // 새로 추가
}: SelectionCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={ariaLabel || id}
      aria-pressed={isSelected}
      onClick={() => onToggle(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(id);
        }
      }}
      className={cn(
        'cursor-pointer transition-all duration-200 relative',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isSelected && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      {children}
      {isSelected && showCheckmark && (
        <div 
          className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 z-10"
          aria-hidden="true"
        >
          <Check className="w-4 h-4" />
        </div>
      )}
      <span className="sr-only">
        {isSelected ? 'Selected' : 'Not selected'}
      </span>
    </Card>
  );
}
```

### Step 2: Progress Bar ARIA
```typescript
// src/components/quiz/QuizHeader.tsx
export function QuizHeader({ currentStep, totalSteps }: QuizHeaderProps) {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return (
    <header className="p-4">
      <Progress 
        value={progress} 
        className="w-full h-2"
        aria-label={`Quiz progress: Step ${currentStep + 1} of ${totalSteps}`}
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </header>
  );
}
```

### Step 3: Skip to Content
```typescript
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
        >
          Skip to main content
        </a>
        
        <main id="main-content">
          {children}
        </main>
        
        <Toaster />
      </body>
    </html>
  );
}
```

### Step 4: 스크린 리더 전용 스타일
```css
/* globals.css */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only:focus,
.sr-only:active {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Step 5: 색상 대비 검증
```typescript
// 대비 비율 체크 도구 사용
// https://webaim.org/resources/contrastchecker/

// 또는 자동화
npm install --save-dev axe-core @axe-core/react

// src/app/layout.tsx (개발 환경만)
if (process.env.NODE_ENV === 'development') {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

## 🧪 Testing Checklist

### 자동 테스트
- [ ] axe-core로 자동 접근성 스캔
- [ ] Lighthouse 접근성 점수 > 90
- [ ] WAVE 브라우저 확장 프로그램으로 검증

### 수동 테스트
- [ ] 키보드만으로 전체 플로우 완료
  - Tab으로 네비게이션
  - Enter/Space로 선택
  - Esc로 취소
- [ ] 스크린 리더 테스트 (VoiceOver/NVDA)
  - 모든 요소가 읽히는지
  - 선택 상태가 알려지는지
  - 진행도가 알려지는지
- [ ] 브라우저 확대/축소 200%
- [ ] 고대비 모드

## 📊 Impact
- **접근성**: ⬆️⬆️⬆️ WCAG 2.1 AA 준수
- **사용자 범위**: ⬆️⬆️ 장애인 사용자 포함
- **SEO**: ⬆️ 시맨틱 HTML 개선
- **법적 준수**: ⬆️⬆️ 접근성 법규 대응

## 🏷️ Labels
`accessibility`, `a11y`, `frontend`, `ux`, `medium-priority`

## 📅 Estimated Time
**4-5 hours**

## 🔗 Related Issues
- Related to Phase 5 in Roadmap (Quality Enhancement)

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** Medium


