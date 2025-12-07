/**
 * Environment Variables Management
 * 
 * @fileoverview 타입 안전한 환경 변수 관리 및 검증
 * 
 * @description
 * Zod 스키마를 사용하여 환경 변수를 검증하고,
 * 타입 안전하게 접근할 수 있도록 합니다.
 * 
 * @module lib/env
 * 
 * @example
 * // 환경 변수 사용
 * import { env } from '@/lib/env';
 * 
 * console.log(env.GOOGLE_GENAI_API_KEY); // 타입 안전!
 * 
 * @example
 * // 환경 체크
 * import { isDevelopment, isProduction } from '@/lib/env';
 * 
 * if (isDevelopment) {
 *   console.log('Dev mode');
 * }
 * 
 * @version 1.0.0
 * @since 2025-12-07
 */

import { z } from 'zod';

/**
 * 환경 변수 스키마
 * 
 * @description
 * 모든 환경 변수의 타입과 검증 규칙을 정의합니다.
 * 필수 변수는 .min(1)로 빈 문자열을 방지합니다.
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  
  // Google Gemini AI
  GOOGLE_GENAI_API_KEY: z
    .string()
    .min(1, '❌ GOOGLE_GENAI_API_KEY is required. Get your key from https://aistudio.google.com/app/apikey'),
  
  GOOGLE_GENAI_MODEL: z
    .string()
    .default('googleai/gemini-2.5-flash'),
  
  // Application
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .optional()
    .or(z.literal(''))
    .transform(val => val || undefined),
});

/**
 * 환경 변수 타입
 * 
 * @typedef {z.infer<typeof envSchema>} Env
 * 
 * @description
 * envSchema에서 자동으로 추론된 타입입니다.
 * IDE 자동완성과 타입 체크에 사용됩니다.
 */
export type Env = z.infer<typeof envSchema>;

/**
 * 환경 변수 검증 및 파싱
 * 
 * @returns {Env} 검증된 환경 변수 객체
 * @throws {Error} 필수 환경 변수가 없거나 유효하지 않은 경우
 * 
 * @description
 * process.env에서 값을 읽어와 Zod 스키마로 검증합니다.
 * 검증 실패 시 명확한 에러 메시지와 함께 프로세스를 종료합니다.
 * 
 * @private
 */
function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY,
    GOOGLE_GENAI_MODEL: process.env.GOOGLE_GENAI_MODEL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:\n');
    
    // 각 에러를 보기 좋게 출력
    const errors = parsed.error.flatten();
    Object.entries(errors.fieldErrors).forEach(([field, messages]) => {
      console.error(`  - ${field}:`);
      messages?.forEach(msg => console.error(`    ${msg}`));
    });
    
    console.error('\n💡 Tip: .env.example 파일을 참고하여 .env.local 파일을 생성하세요.\n');
    
    throw new Error('환경 변수 검증 실패. 위 메시지를 확인하세요.');
  }

  return parsed.data;
}

/**
 * 검증된 환경 변수
 * 
 * @constant
 * @type {Env}
 * 
 * @description
 * 애플리케이션 전역에서 사용할 수 있는 검증된 환경 변수입니다.
 * 타입이 보장되므로 IDE 자동완성이 지원됩니다.
 * 
 * @example
 * // AI 설정에서 사용
 * import { env } from '@/lib/env';
 * 
 * const ai = genkit({
 *   plugins: [googleAI({ apiKey: env.GOOGLE_GENAI_API_KEY })],
 *   model: env.GOOGLE_GENAI_MODEL,
 * });
 * 
 * @example
 * // API Route에서 사용
 * import { env } from '@/lib/env';
 * 
 * if (env.NODE_ENV === 'production') {
 *   // Production-only code
 * }
 */
export const env = validateEnv();

/**
 * 개발 환경 여부
 * 
 * @constant
 * @type {boolean}
 * 
 * @example
 * if (isDevelopment) {
 *   console.log('Debug info');
 * }
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * 프로덕션 환경 여부
 * 
 * @constant
 * @type {boolean}
 * 
 * @example
 * if (isProduction) {
 *   // Enable analytics
 * }
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * 테스트 환경 여부
 * 
 * @constant
 * @type {boolean}
 * 
 * @example
 * if (isTest) {
 *   // Use mock data
 * }
 */
export const isTest = env.NODE_ENV === 'test';

