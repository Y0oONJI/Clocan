# FE-002: Error Boundary 구현

## 📌 Issue Title
`Add React Error Boundary for robust error handling`

## 🎯 Goal
애플리케이션 전역에서 발생하는 런타임 에러를 포착하고, 사용자에게 친화적인 폴백 UI를 제공합니다.

## 📋 Background
현재 프로젝트에는 에러 바운더리가 구현되어 있지 않아, 컴포넌트에서 에러 발생 시 전체 앱이 크래시됩니다. 특히 StyleQuiz와 Result 페이지에서 에러 처리가 필요합니다.

## 📂 Modified Files (Expected)
- `src/components/ErrorBoundary.tsx` (신규 생성)
- `src/app/layout.tsx` (ErrorBoundary 래핑)
- `src/app/style-quiz/page.tsx` (StyleQuiz 래핑)
- `src/app/style-quiz/result/page.tsx` (Result 래핑)

## ✅ Acceptance Criteria

### Must Have
- [ ] ErrorBoundary 클래스 컴포넌트 구현
  - 에러 상태 관리 (hasError, error)
  - componentDidCatch 구현
  - static getDerivedStateFromError 구현
- [ ] 폴백 UI 디자인
  - 에러 메시지 표시
  - "홈으로 돌아가기" 버튼
  - "다시 시도" 버튼
- [ ] 주요 페이지에 ErrorBoundary 적용
  - Root Layout
  - StyleQuiz 페이지
  - Result 페이지
- [ ] 에러 로깅 (console.error)

### Nice to Have
- [ ] 에러 타입별 커스텀 메시지
- [ ] 에러 리포팅 서비스 연동 준비 (Sentry 등)
- [ ] 에러 발생 페이지 경로 표시
- [ ] 개발 환경에서 상세 에러 스택 표시

## 💡 Implementation Details

### ErrorBoundary 컴포넌트 예시
```typescript
// src/components/ErrorBoundary.tsx
import React, { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // TODO: Send to error reporting service
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
              <p className="text-muted-foreground mb-6">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={this.handleReset}>
                  Try Again
                </Button>
                <Button onClick={() => (window.location.href = '/')}>
                  Go Home
                </Button>
              </div>
            </Card>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### 적용 예시
```typescript
// src/app/layout.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

## 🧪 Testing Checklist
- [ ] 고의로 에러를 발생시켜 ErrorBoundary 동작 확인
- [ ] "Try Again" 버튼 클릭 시 재렌더링 확인
- [ ] "Go Home" 버튼 클릭 시 홈으로 이동 확인
- [ ] 에러 메시지가 적절히 표시되는지 확인
- [ ] 개발 환경과 프로덕션 환경 동작 차이 확인

## 📊 Impact
- **사용자 경험**: ⬆️⬆️ 에러 발생 시에도 앱이 완전히 크래시되지 않음
- **안정성**: ⬆️⬆️⬆️ 부분적 에러가 전체 앱에 영향 없음
- **디버깅**: ⬆️ 에러 추적 및 로깅 개선

## 🏷️ Labels
`enhancement`, `refactor`, `frontend`, `error-handling`, `high-priority`

## 📅 Estimated Time
**2-3 hours**

## 🔗 Related Issues
- FE-003 (Result 페이지 에러 처리)
- Related to #1 (Refactoring Plan)

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** High


