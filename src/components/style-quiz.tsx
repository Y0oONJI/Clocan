"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, ArrowRight, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const styles = [
  { id: "modern", name: "Modern", imageId: "style-modern" },
  { id: "vintage", name: "Vintage", imageId: "style-vintage" },
  { id: "bohemian", name: "Bohemian", imageId: "style-bohemian" },
  { id: "streetwear", name: "Streetwear", imageId: "style-streetwear" },
  { id: "classic", name: "Classic", imageId: "style-classic" },
  { id: "minimalist", name: "Minimalist", imageId: "style-minimalist" },
];

const colors = [
  { id: "neutrals", name: "Neutrals", palette: ["#EAE0D5", "#C6AC8F", "#594A47", "#0A0908"] },
  { id: "pastels", name: "Pastels", palette: ["#F7CAC9", "#92A8D1", "#B5EAD7", "#E2F0CB"] },
  { id: "brights", name: "Brights", palette: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1"] },
  { id: "monochrome", name: "Monochrome", palette: ["#000000", "#555555", "#AAAAAA", "#FFFFFF"] },
  { id: "earthy", name: "Earthy", palette: ["#A87B5F", "#5D4C46", "#3E362E", "#C3BBA4"] },
  { id: "jewel", name: "Jewel Tones", palette: ["#003153", "#702963", "#990F02", "#0F5257"] },
];

const inspirationImages = [
  "inspiration-1", "inspiration-2", "inspiration-3",
  "inspiration-4", "inspiration-5", "inspiration-6",
  "inspiration-7", "inspiration-8", "inspiration-9",
];

export function StyleQuiz() {
  const [step, setStep] = useState(0);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedInspirations, setSelectedInspirations] = useState<string[]>([]);

  const toggleSelection = (
    selection: string[],
    setSelection: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    setSelection((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const steps = [
    {
      title: "Find Your Personal Style",
      description: "Complete this quick quiz to help us understand your unique taste.",
      content: <></>,
      buttonText: "Let's start!",
      isSelectionRequired: false,
    },
    {
      title: "Which styles are you drawn to?",
      description: "Select one or more styles that best represent you.",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {styles.map((style) => {
            const image = PlaceHolderImages.find((img) => img.id === style.imageId);
            return (
            <Card
              key={style.id}
              onClick={() => toggleSelection(selectedStyles, setSelectedStyles, style.id)}
              className={cn(
                "cursor-pointer transition-all duration-200 overflow-hidden relative group",
                selectedStyles.includes(style.id) && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <CardContent className="p-0 aspect-w-1 aspect-h-1">
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={image.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                  <h3 className="font-headline text-lg font-bold text-white">{style.name}</h3>
                </div>
                {selectedStyles.includes(style.id) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </CardContent>
            </Card>
          )})}
        </div>
      ),
      buttonText: "Next",
      isSelectionRequired: true,
      selection: selectedStyles,
    },
    {
      title: "What colors do you prefer?",
      description: "Choose the palettes that catch your eye.",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {colors.map((color) => (
            <Card
              key={color.id}
              onClick={() => toggleSelection(selectedColors, setSelectedColors, color.id)}
              className={cn(
                "cursor-pointer transition-all duration-200",
                selectedColors.includes(color.id) && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <CardContent className="p-3 relative">
                <div className="flex h-16 w-full rounded-md overflow-hidden mb-2">
                    {color.palette.map((hex, i) => (
                        <div key={i} style={{ backgroundColor: hex }} className="h-full w-1/4" />
                    ))}
                </div>
                <h3 className="font-semibold text-center text-sm">{color.name}</h3>
                {selectedColors.includes(color.id) && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ),
      buttonText: "Next",
      isSelectionRequired: true,
      selection: selectedColors,
    },
    {
      title: "Get Inspired",
      description: "Select the outfits that you would wear.",
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
          {inspirationImages.map((id) => {
            const image = PlaceHolderImages.find((img) => img.id === id);
            return (
            <div
              key={id}
              onClick={() => toggleSelection(selectedInspirations, setSelectedInspirations, id)}
              className={cn(
                "relative cursor-pointer group rounded-lg overflow-hidden",
                selectedInspirations.includes(id) && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <div className="aspect-w-3 aspect-h-4">
                {image && (
                   <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={image.imageHint}
                  />
                )}
              </div>
              {selectedInspirations.includes(id) && (
                <>
                  <div className="absolute inset-0 bg-primary/40" />
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1.5">
                    <Check className="w-5 h-5" />
                  </div>
                </>
              )}
            </div>
          )})}
        </div>
      ),
      buttonText: "Finish",
      isSelectionRequired: true,
      selection: selectedInspirations,
    },
     {
      title: "You're All Set!",
      description: "We've personalized your experience. Get ready to build your dream closet.",
      content: (
        <div className="flex flex-col items-center text-center">
            <PartyPopper className="w-16 h-16 text-primary mb-4" />
            <p className="text-muted-foreground mb-6">Your style profile is ready.</p>
        </div>
      ),
      buttonText: "Explore Your Closet Canvas",
      isSelectionRequired: false,
    },
  ];

  const currentStep = steps[step];
  const progress = (step / (steps.length - 1)) * 100;
  
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Handle completion - e.g., navigate to the main app
      console.log("Onboarding complete!", { selectedStyles, selectedColors, selectedInspirations });
    }
  };

  const isNextDisabled = useMemo(() => {
    if (!currentStep.isSelectionRequired) return false;
    return currentStep.selection ? currentStep.selection.length === 0 : true;
  }, [step, selectedStyles, selectedColors, selectedInspirations]);


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="p-4">
        <Progress value={progress} className="w-full h-2" />
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl flex flex-col items-center text-center">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary mb-2">
              {currentStep.title}
            </h1>
            <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto">
              {currentStep.description}
            </p>
          </div>
          
          <div className="w-full mb-8">
            {currentStep.content}
          </div>

          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-base font-bold"
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            {currentStep.buttonText}
            {step < steps.length - 1 && <ArrowRight className="ml-2 w-5 h-5" />}
          </Button>
        </div>
      </main>
      <footer className="p-4 flex justify-between items-center text-sm text-muted-foreground">
        <div>
          {step > 0 && step < steps.length - 1 && (
             <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
          )}
        </div>
         <div>
          {step > 0 && step < steps.length - 1 && (
            <span>Step {step} of {steps.length - 2}</span>
          )}
        </div>
      </footer>
    </div>
  );
}
