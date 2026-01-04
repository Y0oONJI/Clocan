import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clocan",
  description: "Your digital wardrobe for endless style inspiration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <ErrorBoundary>
        {children}
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
