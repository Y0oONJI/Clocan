"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
  const navLinks = [
    { label: "서비스 소개", href: "#service" },
    { label: "추천 방식", href: "#how-it-works" },
    { label: "후기", href: "#reviews" },
    { label: "요금제", href: "#pricing" },
  ];

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
            <Link href="/style-quiz">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 sm:px-6 py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
              >
                지금 추천받기
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

