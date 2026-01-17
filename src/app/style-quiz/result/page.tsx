"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Home, RefreshCw, AlertCircle } from "lucide-react";
import { QUIZ_STYLES, QUIZ_COLORS } from "@/data/quiz-data";

/**
 * 에러 타입 정의
 */
type ErrorType = 'network' | 'timeout' | 'api' | 'unknown';

interface AnalysisError {
  message: string;
  type: ErrorType;
}

export default function StyleQuizResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AnalysisError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // URL 파라미터에서 사용자 선택 항목 가져오기
  const selectedStyles = searchParams.get("styles")?.split(",") || [];
  const selectedColors = searchParams.get("colors")?.split(",") || [];
  const selectedInspirations = searchParams.get("inspirations")?.split(",") || [];

  /**
   * AI 분석 결과 생성
   * 
   * @description
   * 타임아웃, 네트워크 에러 등을 처리하며 AI 분석을 수행합니다.
   * 실패 시 자동 재시도 로직이 포함되어 있습니다 (최대 3회).
   */
  const generateResult = async () => {
    const MAX_RETRIES = 3;
    const TIMEOUT_MS = 10000; // 10초
    
    setLoading(true);
    setError(null);

    try {
      // AbortController로 타임아웃 구현
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      // AI 호출 시뮬레이션 (2초 딜레이)
      // TODO: 실제 API 호출로 교체 (BE-001 완료 후)
      await new Promise((resolve, reject) => {
        const timer = setTimeout(resolve, 2000);
        
        controller.signal.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(new Error('Timeout'));
        });
      });

      clearTimeout(timeoutId);

      // 스타일 이름 가져오기
      const styleNames = selectedStyles
        .map(id => QUIZ_STYLES.find(s => s.id === id)?.name)
        .filter(Boolean)
        .join(", ");
      
      const colorNames = selectedColors
        .map(id => QUIZ_COLORS.find(c => c.id === id)?.name)
        .filter(Boolean)
        .join(", ");

      if (!styleNames || !colorNames) {
        throw new Error('Invalid selection data');
      }

      const analysisResult = `Based on your selections, you have a unique blend of ${styleNames} style${selectedStyles.length > 1 ? 's' : ''}. 

Your preference for ${colorNames} color palette${selectedColors.length > 1 ? 's' : ''} suggests you appreciate ${selectedColors.includes('neutrals') ? 'timeless elegance' : selectedColors.includes('brights') ? 'bold statements' : 'sophisticated harmony'}.

With ${selectedInspirations.length} inspiration${selectedInspirations.length > 1 ? 's' : ''} selected, you're ready to build a wardrobe that truly reflects your personality. Your style is versatile, allowing you to express yourself in various settings while maintaining your unique aesthetic.`;

      setResult(analysisResult);
      setRetryCount(0); // 성공 시 retry count 초기화
      
    } catch (err: any) {
      console.error('Style analysis error:', err);

      // 에러 타입 판별
      if (err.name === 'AbortError' || err.message === 'Timeout') {
        setError({
          message: '분석 시간이 초과되었습니다. 다시 시도해주세요.',
          type: 'timeout',
        });
      } else if (err instanceof TypeError && err.message.includes('fetch')) {
        setError({
          message: '네트워크 연결을 확인해주세요.',
          type: 'network',
        });
      } else if (err.message === 'Invalid selection data') {
        setError({
          message: '선택 데이터가 올바르지 않습니다. 퀴즈를 다시 시도해주세요.',
          type: 'api',
        });
      } else {
        setError({
          message: '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          type: 'unknown',
        });
      }

      // 자동 재시도 (최대 3회)
      if (retryCount < MAX_RETRIES && err.type !== 'api') {
        console.log(`Auto-retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          generateResult();
        }, 2000 * (retryCount + 1)); // 점진적 백오프
      }
      
    } finally {
      setLoading(false);
    }
  };

  // 초기 분석 실행
  useEffect(() => {
    if (selectedStyles.length > 0) {
      generateResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStyles, selectedColors, selectedInspirations]);

  // 선택 항목이 없으면 퀴즈로 리다이렉트
  if (selectedStyles.length === 0 && selectedColors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground mt-4">Loading results...</p>
      </div>
    }>
      <ResultClient />
    </Suspense>
  );
}

export default function StyleQuizResultPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground mt-4">Loading results...</p>
      </div>
    }>
      <StyleQuizResultContent />
    </Suspense>
  );
}


