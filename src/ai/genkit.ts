/**
 * Genkit AI Instance
 * 
 * @fileoverview Google Gemini AI 설정
 * 
 * @description
 * Genkit을 사용하여 Google Gemini 2.5 Flash 모델을 설정합니다.
 * 환경 변수에서 API 키와 모델을 불러옵니다.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {env} from '@/lib/env';

/**
 * AI 인스턴스
 * 
 * @constant
 * @description
 * 모든 AI flows에서 사용하는 Genkit 인스턴스입니다.
 * 환경 변수로부터 API 키와 모델을 가져옵니다.
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: env.GOOGLE_GENAI_MODEL,
});
