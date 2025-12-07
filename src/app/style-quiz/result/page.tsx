"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Home, RefreshCw } from "lucide-react";
import { QUIZ_STYLES, QUIZ_COLORS } from "@/data/quiz-data";

export default function StyleQuizResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // URL 파라미터에서 사용자 선택 항목 가져오기
  const selectedStyles = searchParams.get("styles")?.split(",") || [];
  const selectedColors = searchParams.get("colors")?.split(",") || [];
  const selectedInspirations = searchParams.get("inspirations")?.split(",") || [];

  // AI 분석 결과 생성 (시뮬레이션)
  useEffect(() => {
    const generateResult = async () => {
      setLoading(true);
      
      // AI 호출 시뮬레이션 (2초 딜레이)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 스타일 이름 가져오기
      const styleNames = selectedStyles
        .map(id => QUIZ_STYLES.find(s => s.id === id)?.name)
        .filter(Boolean)
        .join(", ");
      
      const colorNames = selectedColors
        .map(id => QUIZ_COLORS.find(c => c.id === id)?.name)
        .filter(Boolean)
        .join(", ");

      const analysisResult = `Based on your selections, you have a unique blend of ${styleNames} style${selectedStyles.length > 1 ? 's' : ''}. 

Your preference for ${colorNames} color palette${selectedColors.length > 1 ? 's' : ''} suggests you appreciate ${selectedColors.includes('neutrals') ? 'timeless elegance' : selectedColors.includes('brights') ? 'bold statements' : 'sophisticated harmony'}.

With ${selectedInspirations.length} inspiration${selectedInspirations.length > 1 ? 's' : ''} selected, you're ready to build a wardrobe that truly reflects your personality. Your style is versatile, allowing you to express yourself in various settings while maintaining your unique aesthetic.`;

      setResult(analysisResult);
      setLoading(false);
    };

    if (selectedStyles.length > 0) {
      generateResult();
    }
  }, [selectedStyles, selectedColors, selectedInspirations]);

  // 선택 항목이 없으면 퀴즈로 리다이렉트
  if (selectedStyles.length === 0 && selectedColors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-muted-foreground">No quiz results found. Please take the quiz first.</p>
            <Button onClick={() => router.push("/style-quiz")}>
              Take the Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary">
              Your Style Profile
            </h1>
            <p className="text-lg text-muted-foreground">
              Here's what we discovered about your unique style
            </p>
          </div>

          {/* Selection Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Style Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {selectedStyles.map(id => {
                  const style = QUIZ_STYLES.find(s => s.id === id);
                  return style ? (
                    <Badge key={id} variant="secondary">
                      {style.name}
                    </Badge>
                  ) : null;
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Color Palettes
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {selectedColors.map(id => {
                  const color = QUIZ_COLORS.find(c => c.id === id);
                  return color ? (
                    <Badge key={id} variant="secondary">
                      {color.name}
                    </Badge>
                  ) : null;
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Inspirations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">
                  {selectedInspirations.length} {selectedInspirations.length === 1 ? 'item' : 'items'} selected
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* AI Analysis Result */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI Style Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">Analyzing your style preferences...</p>
                </div>
              ) : result ? (
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-line leading-relaxed">
                    {result}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">Unable to generate analysis.</p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/style-quiz")}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retake Quiz
            </Button>
            <Button
              size="lg"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}





