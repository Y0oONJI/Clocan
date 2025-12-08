/**
 * Error Boundary Component
 * 
 * @fileoverview React 에러 바운더리 컴포넌트
 * 
 * @description
 * 컴포넌트 트리에서 발생하는 JavaScript 에러를 포착하고,
 * 사용자 친화적인 폴백 UI를 표시합니다.
 * 
 * @component
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * @example
 * // 커스텀 폴백 UI
 * <ErrorBoundary fallback={<CustomErrorUI />}>
 *   <YourComponent />
 * </ErrorBoundary>
 * 
 * @version 1.0.0
 * @since 2025-12-07
 */

'use client';

import React, { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary Props
 */
interface ErrorBoundaryProps {
  /** 감싸질 자식 컴포넌트 */
  children: ReactNode;
  /** 커스텀 폴백 UI (선택사항) */
  fallback?: ReactNode;
  /** 에러 발생 시 호출될 콜백 (선택사항) */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * ErrorBoundary State
 */
interface ErrorBoundaryState {
  /** 에러 발생 여부 */
  hasError: boolean;
  /** 에러 객체 */
  error?: Error;
}

/**
 * ErrorBoundary Component
 * 
 * @class
 * @extends {React.Component<ErrorBoundaryProps, ErrorBoundaryState>}
 * 
 * @description
 * React 클래스 컴포넌트로 구현된 에러 바운더리입니다.
 * 하위 컴포넌트에서 발생한 에러를 포착하여 전체 앱 크래시를 방지합니다.
 * 
 * @note
 * 다음 에러는 포착하지 못합니다:
 * - 이벤트 핸들러 내부 에러 (try-catch 사용)
 * - 비동기 코드 에러 (Promise rejection 등)
 * - 서버 사이드 렌더링 에러
 * - ErrorBoundary 자체의 에러
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * 에러 발생 시 state 업데이트
   * 
   * @static
   * @param {Error} error - 발생한 에러
   * @returns {ErrorBoundaryState} 새로운 state
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * 에러 로깅 및 리포팅
   * 
   * @param {Error} error - 발생한 에러
   * @param {ErrorInfo} errorInfo - 에러 정보 (컴포넌트 스택)
   * 
   * @description
   * 에러를 콘솔에 로깅하고, 선택적으로 에러 리포팅 서비스에 전송합니다.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // 커스텀 에러 핸들러 호출 (있는 경우)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // TODO: Sentry 등 에러 리포팅 서비스에 전송
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  /**
   * 에러 상태 초기화
   * 
   * @description
   * 에러 상태를 초기화하여 컴포넌트를 다시 렌더링합니다.
   */
  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  /**
   * 홈으로 이동
   */
  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 폴백 UI가 제공된 경우
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4 mx-auto">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* 에러 메시지 */}
              <div className="text-center">
                <p className="text-muted-foreground">
                  {this.state.error?.message || 
                    'An unexpected error occurred. Please try again.'}
                </p>
              </div>

              {/* 개발 환경에서만 에러 스택 표시 */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-xs text-muted-foreground bg-muted p-4 rounded-md">
                  <summary className="cursor-pointer font-semibold mb-2">
                    Error Details (Dev Only)
                  </summary>
                  <pre className="whitespace-pre-wrap break-all">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              {/* 액션 버튼 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={this.handleReset}
                  className="flex-1 gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>
                
                <Button
                  size="lg"
                  onClick={this.handleGoHome}
                  className="flex-1 gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </div>

              {/* 도움말 */}
              <p className="text-xs text-center text-muted-foreground">
                If this problem persists, please contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

