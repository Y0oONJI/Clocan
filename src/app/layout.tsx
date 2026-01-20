import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
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
  // Google Analytics 측정 ID (프로덕션 환경에서만 활성화)
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const isGAEnabled = process.env.NEXT_PUBLIC_GA_ENABLED !== 'false';

  return (
    <html lang="en" className="light">
      <body className={`${notoSansKR.variable} font-sans antialiased`}>
        <ErrorBoundary>
        {children}
        </ErrorBoundary>
        <Toaster />
        {/* Google Analytics 스크립트 (프로덕션 환경에서만 로드) */}
        {gaMeasurementId && isGAEnabled && (
          <GoogleAnalytics gaId={gaMeasurementId} />
        )}
      </body>
    </html>
  );
}
