/**
 * Error Boundary Test Component
 * 
 * @fileoverview ErrorBoundary 테스트용 컴포넌트
 * 
 * @description
 * 개발 환경에서 ErrorBoundary의 동작을 테스트하기 위한 컴포넌트입니다.
 * "Trigger Error" 버튼을 클릭하면 의도적으로 에러를 발생시킵니다.
 * 
 * @component
 * @example
 * // 개발 환경에서만 사용
 * import { ErrorBoundaryTest } from '@/components/ErrorBoundaryTest';
 * 
 * <ErrorBoundary>
 *   <ErrorBoundaryTest />
 * </ErrorBoundary>
 * 
 * @version 1.0.0
 * @since 2025-12-07
 * @note 프로덕션 빌드에서는 제거하거나 숨겨야 합니다
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug } from 'lucide-react';

/**
 * ErrorBoundaryTest Component
 * 
 * @returns {JSX.Element}
 * 
 * @description
 * 버튼 클릭 시 에러를 발생시켜 ErrorBoundary를 테스트합니다.
 */
export function ErrorBoundaryTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error from ErrorBoundaryTest component');
  }

  // 개발 환경에서만 표시
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="border-2 border-dashed border-orange-500 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Bug className="w-5 h-5" />
          ErrorBoundary Test (Dev Only)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          이 버튼을 클릭하면 의도적으로 에러가 발생하여 ErrorBoundary를 테스트할 수 있습니다.
        </p>
        
        <Button
          variant="destructive"
          onClick={() => setShouldThrow(true)}
        >
          <Bug className="w-4 h-4 mr-2" />
          Trigger Error
        </Button>
      </CardContent>
    </Card>
  );
}

