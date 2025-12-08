# CFG-001: 테스트 환경 설정

## 📌 Issue Title
`Set up Jest and React Testing Library for unit testing`

## 🎯 Goal
Jest와 React Testing Library를 설정하여 컴포넌트 및 훅의 단위 테스트를 작성할 수 있는 환경을 구축합니다.

## 📋 Background
현재 프로젝트에는 테스트 코드가 전혀 없습니다 (0% coverage). 리팩토링한 컴포넌트들의 동작을 검증하고, 회귀 버그를 방지하기 위해 테스트 환경이 필요합니다.

## 📂 Modified Files (Expected)
- `jest.config.js` (신규 생성)
- `jest.setup.js` (신규 생성)
- `package.json` (devDependencies 추가)
- `tsconfig.json` (jest 타입 추가)
- `__tests__/` (신규 폴더)
- `__tests__/setup/` (테스트 유틸리티)

## ✅ Acceptance Criteria

### Must Have
- [ ] Jest 설치 및 설정
  - Next.js 환경 호환
  - TypeScript 지원
  - ES6 모듈 지원
- [ ] React Testing Library 설정
  - @testing-library/react
  - @testing-library/jest-dom
  - @testing-library/user-event
- [ ] 테스트 실행 스크립트 추가
  - `npm test` - 모든 테스트 실행
  - `npm test:watch` - watch 모드
  - `npm test:coverage` - 커버리지 리포트
- [ ] 예제 테스트 작성
  - SelectionCard 컴포넌트 테스트
  - useQuizState 훅 테스트
- [ ] CI/CD에서 자동 실행 가능

### Nice to Have
- [ ] MSW (Mock Service Worker) 설정
- [ ] Snapshot 테스팅
- [ ] E2E 테스트 설정 (Playwright/Cypress)
- [ ] Visual regression 테스트

## 💡 Implementation Details

### Step 1: Dependencies 설치
```bash
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @types/jest \
  jest-environment-jsdom \
  ts-jest
```

### Step 2: Jest 설정
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/app/**', // App Router 파일 제외
  ],
  coverageThresholds: {
    global: {
      branches: 50,
      functions: 50,
      lines: 60,
      statements: 60,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '';
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />;
  },
}));
```

### Step 3: package.json 스크립트 추가
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Step 4: 예제 테스트 작성

```typescript
// __tests__/components/quiz/shared/SelectionCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SelectionCard } from '@/components/quiz/shared/SelectionCard';

describe('SelectionCard', () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  it('renders children correctly', () => {
    render(
      <SelectionCard id="test" isSelected={false} onToggle={mockOnToggle}>
        <div>Test Content</div>
      </SelectionCard>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('shows checkmark when selected', () => {
    render(
      <SelectionCard id="test" isSelected={true} onToggle={mockOnToggle}>
        <div>Test</div>
      </SelectionCard>
    );

    const checkmark = screen.getByRole('img', { hidden: true });
    expect(checkmark).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    render(
      <SelectionCard id="test-id" isSelected={false} onToggle={mockOnToggle}>
        <div>Test</div>
      </SelectionCard>
    );

    const card = screen.getByText('Test').closest('div[role="button"]');
    fireEvent.click(card);

    expect(mockOnToggle).toHaveBeenCalledWith('test-id');
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('applies ring styles when selected', () => {
    const { container } = render(
      <SelectionCard id="test" isSelected={true} onToggle={mockOnToggle}>
        <div>Test</div>
      </SelectionCard>
    );

    const card = container.firstChild;
    expect(card).toHaveClass('ring-2', 'ring-primary');
  });
});
```

```typescript
// __tests__/hooks/useQuizState.test.ts
import { renderHook, act } from '@testing-library/react';
import { useQuizState } from '@/hooks/useQuizState';

describe('useQuizState', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useQuizState());

    expect(result.current.step).toBe(0);
    expect(result.current.selections).toEqual({
      styles: [],
      colors: [],
      inspirations: [],
    });
  });

  it('toggles selection correctly', () => {
    const { result } = renderHook(() => useQuizState());

    act(() => {
      result.current.toggleSelection('styles', 'modern');
    });

    expect(result.current.selections.styles).toContain('modern');

    act(() => {
      result.current.toggleSelection('styles', 'modern');
    });

    expect(result.current.selections.styles).not.toContain('modern');
  });

  it('moves to next step', () => {
    const { result } = renderHook(() => useQuizState());

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.step).toBe(1);
  });

  it('disables next button when selection required but empty', () => {
    const { result } = renderHook(() => useQuizState());

    // Step 1 (style selection)
    act(() => {
      result.current.nextStep();
    });

    expect(result.current.isNextDisabled).toBe(true);

    act(() => {
      result.current.toggleSelection('styles', 'modern');
    });

    expect(result.current.isNextDisabled).toBe(false);
  });
});
```

## 🧪 Testing Checklist
- [ ] `npm test` 실행 성공
- [ ] 모든 예제 테스트 통과
- [ ] Coverage 리포트 생성 확인
- [ ] Watch 모드 동작 확인
- [ ] CI/CD에서 테스트 실행 확인

## 📊 Impact
- **코드 품질**: ⬆️⬆️⬆️ 테스트 커버리지 0% → 60% 목표
- **신뢰성**: ⬆️⬆️ 회귀 버그 방지
- **개발 속도**: ⬆️ 자동화된 검증

## 🏷️ Labels
`testing`, `setup`, `infrastructure`, `high-priority`

## 📅 Estimated Time
**3-4 hours**

## 🔗 Related Issues
- Related to Phase 5 in Roadmap (Quality Enhancement)

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** High

