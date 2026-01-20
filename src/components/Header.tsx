"use client";

import { useState } from "react";  
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { pingFeature1, PingResponse } from "@/api/feature1";
import { useToast } from "@/hooks/use-toast";
import { trackEvent, apiTracking } from "@/lib/analytics";

export function Header() {
  const navLinks = [
    { label: "서비스 소개", href: "#service" },
    { label: "추천 방식", href: "#how-it-works" },
    { label: "후기", href: "#reviews" },
    { label: "요금제", href: "#pricing" },
  ];

  const [result, setResult] = useState<PingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRecommendClick = async () => {
    // 헤더 CTA 클릭 추적
    trackEvent('header_cta_click', {
      button_text: '지금 추천받기',
      location: 'header',
    });

    setLoading(true);
    setErrorMsg(null);
    const startedAt = performance.now();

    try {
      apiTracking.trackStart('/api/v1/feature1/ping', 'GET');
      const data = await pingFeature1();
      const duration = Math.round(performance.now() - startedAt);
      
      apiTracking.trackSuccess('/api/v1/feature1/ping', 'GET', 200, duration);
      setResult(data);
      
      // 성공 토스트 표시 - UX 친화적인 메시지
      const message = data?.message || "추천이 완료되었습니다!";
      const style = data?.data?.style;
      const itemsCount = Array.isArray(data?.data?.items) ? data.data.items.length : 0;
      
      let description = "";
      if (style) {
        description = `스타일: ${style}`;
      }
      if (itemsCount > 0) {
        description += description ? ` • ${itemsCount}개의 아이템 추천` : `${itemsCount}개의 아이템 추천`;
      }
      
      toast({
        title: "✨ " + message,
        description: description || "추천 결과를 확인해보세요.",
        variant: "default",
      });
    } catch (e: any) {
      const duration = Math.round(performance.now() - startedAt);
      const errorMessage = e?.message ?? "추천 요청 중 오류가 발생했습니다";
      
      apiTracking.trackError('/api/v1/feature1/ping', 'GET', undefined, 'network', duration);
      
      setErrorMsg(errorMessage);
      setResult(null);
      
      // 에러 토스트 표시 - UX 친화적인 메시지
      let userFriendlyMessage = "추천 요청 중 문제가 발생했습니다";
      
      if (errorMessage.includes("Network") || errorMessage.includes("fetch")) {
        userFriendlyMessage = "네트워크 연결을 확인해주세요";
      } else if (errorMessage.includes("timeout") || errorMessage.includes("시간")) {
        userFriendlyMessage = "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요";
      } else if (errorMessage.includes("404") || errorMessage.includes("Not Found")) {
        userFriendlyMessage = "서비스를 찾을 수 없습니다";
      } else if (errorMessage.includes("500") || errorMessage.includes("Internal")) {
        userFriendlyMessage = "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요";
      }
      
      toast({
        title: "😔 " + userFriendlyMessage,
        description: "문제가 계속되면 고객센터로 문의해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl sm:text-2xl font-bold font-headline text-primary hover:text-primary/80 transition-colors">
              Closet Canvas
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button - Right */}
          <div className="flex-shrink-0">
            <Button
              size="sm"
              onClick={handleRecommendClick}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 sm:px-6 py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "로딩 중..." : "지금 추천받기"}
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

