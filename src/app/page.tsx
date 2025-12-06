import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Palette, Heart, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12 space-y-6">
            {/* Logo/Brand */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-headline text-primary">
              Closet Canvas
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-foreground/80 max-w-2xl mx-auto">
              Your digital wardrobe for endless style inspiration
            </p>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Discover your unique style, curate your perfect wardrobe, and get personalized outfit suggestions powered by AI.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Palette className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Find Your Style</h3>
                <p className="text-sm text-muted-foreground">
                  Take our quick quiz to discover your personal style preferences
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Curate Your Closet</h3>
                <p className="text-sm text-muted-foreground">
                  Build your digital wardrobe with items you love
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Get Inspired</h3>
                <p className="text-sm text-muted-foreground">
                  Receive AI-powered outfit suggestions tailored to you
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link href="/style-quiz">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-12 py-7 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Style Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground border-t">
        <p>© 2025 Closet Canvas. Discover your style, express yourself.</p>
      </footer>
    </div>
  );
}
