"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, ClipboardList, ScanLine, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { pingFeature1 } from "@/api/feature1";
import { API_BASE_URL } from "@/lib/api";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePingClick = async () => {
    setIsLoading(true);
    try {
      const data = await pingFeature1();
      alert(data.message || "추천 완료");
    } catch (error) {
      console.error("[FE] error:", error);
      alert(`API 호출 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Fixed Header Navigation */}
      <Header />
      
      {/* Spacer for fixed header */}
      <div className="h-16 sm:h-20" />
      {/* New Hero Section */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-headline text-foreground leading-tight">
            취향만 입력하면, 오늘 입을 옷이 완성됩니다
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-foreground/80 max-w-3xl mx-auto">
            AI가 당신의 옷장을 분석해 고민 없는 스타일을 추천합니다
          </p>
          
          {/* CTA Button */}
          <div className="pt-4">
            <Link href="/style-quiz">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 py-6 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                취향 입력하고 바로 추천받기
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How We Recommend Section */}
      <section id="how-it-works" className="w-full py-16 sm:py-24 px-4 sm:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline text-foreground mb-4">
              이렇게 추천해드려요
            </h2>
          </div>

          {/* Gallery Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <Card className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop"
                  alt="캐주얼 데일리 코디"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  캐주얼 데일리 코디
                </h3>
                <p className="text-sm text-muted-foreground">
                  일상에서 편하게 입을 수 있는 캐주얼한 스타일을 추천해드립니다
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop"
                  alt="오피스 비즈니스 코디"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  오피스 비즈니스 코디
                </h3>
                <p className="text-sm text-muted-foreground">
                  업무 환경에 적합한 세련되고 전문적인 스타일을 제안합니다
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <Image
                  src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=600&fit=crop"
                  alt="데이트 특별 코디"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  데이트 특별 코디
                </h3>
                <p className="text-sm text-muted-foreground">
                  특별한 날을 위한 우아하고 매력적인 스타일링을 제공합니다
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Recommendation Works Section */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-br from-background to-primary/5">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline text-foreground mb-4">
              이렇게 추천이 완성돼요
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                취향 입력
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xs">
                간단한 퀴즈를 통해 나의 스타일 취향을 입력합니다
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <ScanLine className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                옷장 분석
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xs">
                AI가 보유한 옷들을 분석해 최적의 조합을 찾습니다
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                오늘의 코디 추천
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xs">
                나만의 맞춤형 코디를 받아 바로 입어보세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="w-full py-16 sm:py-24 px-4 sm:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-headline text-foreground mb-4">
              고객들이 이렇게 말해요
            </h2>
          </div>

          {/* Carousel */}
          <div className="relative px-8 sm:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {/* Review 1 */}
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-2">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          김**님
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          직장인
                        </p>
                      </div>
                      <p className="text-sm text-foreground/80 flex-grow">
                        매일 아침 뭐 입을지 고민이 많았는데, 이제는 5분이면 코디가 완성돼요!
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                {/* Review 2 */}
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-2">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          이**님
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          대학생
                        </p>
                      </div>
                      <p className="text-sm text-foreground/80 flex-grow">
                        옷장에 있는 옷들만으로도 다양한 스타일을 연출할 수 있어서 정말 만족해요.
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                {/* Review 3 */}
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-2">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          박**님
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          프리랜서
                        </p>
                      </div>
                      <p className="text-sm text-foreground/80 flex-grow">
                        AI 추천이 정말 정확해요. 제 취향을 완벽하게 반영한 코디만 나와요!
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>

                {/* Review 4 */}
                <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-2">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          최**님
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          직장인
                        </p>
                      </div>
                      <p className="text-sm text-foreground/80 flex-grow">
                        비즈니스 캐주얼부터 데이트룩까지, 상황별로 추천해줘서 너무 편해요.
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </div>
      </section>

      {/* API Test Section (Development) */}
      <section className="w-full py-8 px-4 sm:px-8 bg-muted/30 border-t">
        <div className="max-w-7xl mx-auto text-center">
          <Button
            onClick={handlePingClick}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {isLoading ? "API 호출 중..." : "API 테스트 (Feature1 Ping)"}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            API Base: {API_BASE_URL}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow" />

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground border-t">
        <p>© 2025 Closet Canvas. Discover your style, express yourself.</p>
      </footer>
    </div>
  );
}
