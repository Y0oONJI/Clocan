/**
 * Completion Step Component
 * 
 * @fileoverview 퀴즈 완료 화면
 * 
 * @component
 * @version 1.0.0
 * @since 2025-12-06
 */

import React from "react";
import { PartyPopper } from "lucide-react";

/**
 * CompletionStep Component
 * 
 * @returns {JSX.Element}
 * 
 * @description
 * 퀴즈 완료 후 축하 메시지를 표시합니다.
 */
export function CompletionStep() {
  return (
    <div className="flex flex-col items-center text-center">
      <PartyPopper className="w-16 h-16 text-primary mb-4" />
      <p className="text-muted-foreground mb-6">Your style profile is ready.</p>
    </div>
  );
}

