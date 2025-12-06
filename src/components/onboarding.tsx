"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  ShoppingBag,
  Sparkles,
  Bell,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const onboardingSlides = [
  {
    image: PlaceHolderImages.find((img) => img.id === "onboarding-welcome"),
    icon: LayoutGrid,
    title: "Welcome to Closet Canvas",
    description:
      "Design your dream wardrobe and discover endless style inspiration. Your fashion journey starts here.",
  },
  {
    image: PlaceHolderImages.find((img) => img.id === "onboarding-wishlist"),
    icon: Heart,
    title: "Create Your Wishlists",
    description:
      "Organize your desires into beautiful wishlists. Curate collections for every occasion, season, or mood.",
  },
  {
    image: PlaceHolderImages.find((img) => img.id === "onboarding-save"),
    icon: ShoppingBag,
    title: "Save Items Instantly",
    description:
      "Found something you love? Save items from any online store with all the details—price, color, size, and more.",
  },
  {
    image: PlaceHolderImages.find((img) => img.id === "onboarding-ai"),
    icon: Sparkles,
    title: "AI-Powered Style Suggestions",
    description:
      "Let our AI stylist help you. Get personalized outfit suggestions and find alternatives based on your wishlist items.",
  },
  {
    image: PlaceHolderImages.find((img) => img.id === "onboarding-notify"),
    icon: Bell,
    title: "Never Miss a Deal",
    description:
      "Set your target price and get notified instantly when an item on your wishlist goes on sale. Shop smarter, not harder.",
  },
];

export function Onboarding() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const updateCarouselState = useCallback(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    updateCarouselState();
    api.on("select", updateCarouselState);
    api.on("reInit", updateCarouselState);
    return () => {
      api.off("select", updateCarouselState);
      api.off("reInit", updateCarouselState);
    };
  }, [api, updateCarouselState]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <Carousel
        setApi={setApi}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
      >
        <CarouselContent>
          {onboardingSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <Card className="overflow-hidden border-2 shadow-lg rounded-xl">
                <CardContent className="relative flex flex-col items-center justify-center p-6 text-center aspect-[4/3] sm:p-10 md:p-12">
                  {slide.image && (
                    <Image
                      src={slide.image.imageUrl}
                      alt={slide.image.description}
                      fill
                      className="object-cover opacity-10"
                      data-ai-hint={slide.image.imageHint}
                      priority={index === 0}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="mb-4 bg-primary/10 p-4 rounded-full">
                      <slide.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-headline text-primary mb-2">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-base text-foreground/80 max-w-md">
                      {slide.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
          <CarouselItem>
            <Card className="overflow-hidden border-2 shadow-lg rounded-xl">
              <CardContent className="flex flex-col items-center justify-center p-10 text-center aspect-[4/3] sm:p-14 md:p-16">
                <h2 className="text-3xl sm:text-4xl font-bold font-headline text-primary mb-4">
                  Let's Get Started
                </h2>
                <p className="text-base sm:text-lg text-foreground/80 mb-8">
                  Your style evolution awaits.
                </p>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 py-6 text-base font-bold"
                >
                  Start Your Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="hidden sm:inline-flex -left-12 text-primary" />
        <CarouselNext className="hidden sm:inline-flex -right-12 text-primary" />
      </Carousel>
      <div className="flex gap-2.5 mt-8">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === current ? "w-6 bg-primary" : "w-2 bg-primary/30"
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current}
          />
        ))}
      </div>
    </main>
  );
}
