
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, ArrowRight, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

const styles = [
  "Casual",
  "Chic",
  "Street",
  "Vintage",
  "Bohemian",
  "Minimalist",
  "Sporty",
  "Preppy",
];

const colors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-400",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
  "bg-pink-400",
  "bg-black",
  "bg-white",
  "bg-gray-400",
  "bg-stone-500",
];

const TotalSteps = 4;

export function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [favoriteBrands, setFavoriteBrands] = useState("");

  const toggleSelection = (
    item: string,
    selection: string[],
    setSelection: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selection.includes(item)) {
      setSelection(selection.filter((i) => i !== item));
    } else {
      setSelection([...selection, item]);
    }
  };
  
  const welcomeImage = PlaceHolderImages.find((img) => img.id === "onboarding-welcome");

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="p-6">
          <Progress value={(step / TotalSteps) * 100} className="w-full h-2 mb-4" />
          {step === 1 && (
            <div>
              <CardTitle className="text-3xl font-headline text-primary">Welcome to Closet Canvas!</CardTitle>
              <CardDescription className="mt-2">Let's discover your personal style. This will help us recommend the perfect items for you.</CardDescription>
            </div>
          )}
          {step === 2 && (
            <div>
              <CardTitle className="font-headline text-primary">Which styles resonate with you?</CardTitle>
              <CardDescription>Select all that apply. This helps us understand your vibe.</CardDescription>
            </div>
          )}
          {step === 3 && (
            <div>
              <CardTitle className="font-headline text-primary">What are your favorite colors?</CardTitle>
              <CardDescription>Choose the colors you love to wear.</CardDescription>
            </div>
          )}
          {step === 4 && (
             <div>
              <CardTitle className="font-headline text-primary">Any favorite brands?</CardTitle>
              <CardDescription>List some brands you love. (Optional)</CardDescription>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {step === 1 && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
             {welcomeImage && (
                <Image
                  src={welcomeImage.imageUrl}
                  alt={welcomeImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={welcomeImage.imageHint}
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {styles.map((style) => (
                <Button
                  key={style}
                  variant={selectedStyles.includes(style) ? "default" : "outline"}
                  className="py-6 rounded-lg text-sm"
                  onClick={() => toggleSelection(style, selectedStyles, setSelectedStyles)}
                >
                  {style}
                  {selectedStyles.includes(style) && <Check className="w-4 h-4 ml-2" />}
                </Button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleSelection(color, selectedColors, setSelectedColors)}
                  className={cn(
                    "w-12 h-12 rounded-full border-2 transition-all",
                    color,
                    selectedColors.includes(color) ? "border-primary ring-2 ring-primary ring-offset-2" : "border-transparent"
                  )}
                  aria-label={`Select color ${color}`}
                >
                {selectedColors.includes(color) && <Check className="w-6 h-6 mx-auto text-white mix-blend-difference" />}
                </button>
              ))}
            </div>
          )}
          
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <Input
                placeholder="e.g., Nike, Zara, Gucci"
                value={favoriteBrands}
                onChange={(e) => setFavoriteBrands(e.target.value)}
              />
               <Button
                size="lg"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full"
                onClick={() => alert("Onboarding complete!")}
              >
                Complete Setup
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
            ) : <div></div>}
            {step < TotalSteps && (
              <Button onClick={() => setStep(step + 1)}>
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
