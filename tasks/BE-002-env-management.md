# BE-002: 환경 변수 관리 구조화

## 📌 Issue Title
`Implement structured environment variable management`

## 🎯 Goal
환경 변수를 체계적으로 관리하고, 타입 안정성을 확보하며, .env.example 파일로 문서화합니다.

## 📋 Background
현재 환경 변수가 산발적으로 사용되고 있으며, 타입 체크나 검증이 없습니다. Google AI API 키 등 중요한 값들을 안전하게 관리할 필요가 있습니다.

## 📂 Modified Files (Expected)
- `.env.example` (신규 생성)
- `src/lib/env.ts` (신규 생성 - 환경 변수 검증)
- `src/ai/genkit.ts` (env 사용)
- `.gitignore` (확인)

## ✅ Acceptance Criteria

### Must Have
- [ ] .env.example 파일 생성
  - 모든 필요한 환경 변수 나열
  - 각 변수에 대한 설명 주석
  - 예시 값 제공
- [ ] 환경 변수 검증 유틸리티
  - 필수 변수 체크
  - 타입 검증
  - 런타임 에러 방지
- [ ] 타입 안전한 환경 변수 접근
  - env.ts에서 export
  - TypeScript 자동완성 지원
- [ ] .gitignore에 .env 파일들 확인
  - .env.local
  - .env.*.local

### Nice to Have
- [ ] 환경별 설정 분리
  - .env.development
  - .env.production
  - .env.test
- [ ] Zod 스키마로 검증
- [ ] 환경 변수 문서 자동 생성

## 💡 Implementation Details

### Step 1: .env.example 생성
```bash
# .env.example

# ==============================================================================
# Application Configuration
# ==============================================================================

# Node Environment (development | production | test)
NODE_ENV=development

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ==============================================================================
# Google Gemini AI Configuration
# ==============================================================================

# Google Generative AI API Key
# Get your key from: https://aistudio.google.com/app/apikey
# Required for: Style analysis, outfit suggestions, clothing search
GOOGLE_GENAI_API_KEY=your_api_key_here

# Gemini Model (default: gemini-2.5-flash)
GOOGLE_GENAI_MODEL=googleai/gemini-2.5-flash

# ==============================================================================
# Firebase Configuration (if using Firebase hosting)
# ==============================================================================

# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
# NEXT_PUBLIC_FIREBASE_APP_ID=

# ==============================================================================
# Optional: Analytics & Monitoring
# ==============================================================================

# NEXT_PUBLIC_GA_MEASUREMENT_ID=
# SENTRY_DSN=

# ==============================================================================
# Development Tools
# ==============================================================================

# Enable debug logging
# DEBUG=false
```

### Step 2: 환경 변수 검증 유틸리티
```typescript
// src/lib/env.ts
/**
 * Environment Variables Management
 * 
 * @fileoverview 환경 변수 검증 및 타입 안전한 접근 제공
 */

import { z } from 'zod';

/**
 * 환경 변수 스키마
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Google AI
  GOOGLE_GENAI_API_KEY: z.string().min(1, 'Google AI API key is required'),
  GOOGLE_GENAI_MODEL: z.string().default('googleai/gemini-2.5-flash'),
  
  // Application
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

/**
 * 환경 변수 타입
 */
export type Env = z.infer<typeof envSchema>;

/**
 * 환경 변수 검증 및 파싱
 * 
 * @returns {Env} 검증된 환경 변수 객체
 * @throws {Error} 필수 환경 변수가 없거나 유효하지 않은 경우
 */
function validateEnv(): Env {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY,
    GOOGLE_GENAI_MODEL: process.env.GOOGLE_GENAI_MODEL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten());
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

/**
 * 검증된 환경 변수
 * 
 * @constant
 * @example
 * import { env } from '@/lib/env';
 * 
 * console.log(env.GOOGLE_GENAI_API_KEY); // 타입 안전!
 */
export const env = validateEnv();

/**
 * 환경별 유틸리티
 */
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
```

### Step 3: AI 설정에서 사용
```typescript
// src/ai/genkit.ts
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { env } from '@/lib/env';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: env.GOOGLE_GENAI_API_KEY,
    })
  ],
  model: env.GOOGLE_GENAI_MODEL,
});
```

### Step 4: .gitignore 확인
```bash
# .gitignore

# Environment variables
.env
.env.local
.env.*.local
.env.development.local
.env.test.local
.env.production.local

# But keep example
!.env.example
```

## 🧪 Testing Checklist
- [ ] 필수 환경 변수 없이 실행 시 명확한 에러
- [ ] 잘못된 형식의 환경 변수 입력 시 에러
- [ ] TypeScript에서 env 객체 자동완성 확인
- [ ] 프로덕션 빌드 시 환경 변수 정상 작동
- [ ] .env.example의 모든 변수가 실제 사용됨

## 📊 Impact
- **보안**: ⬆️⬆️⬆️ API 키 안전 관리
- **타입 안정성**: ⬆️⬆️ 환경 변수 타입 체크
- **개발자 경험**: ⬆️⬆️ 자동완성 및 명확한 에러
- **문서화**: ⬆️⬆️ .env.example로 필요한 값 명시

## 🏷️ Labels
`backend`, `configuration`, `security`, `high-priority`

## 📅 Estimated Time
**1-2 hours**

## 🔗 Related Issues
- BE-001 (Gemini API 연동에서 사용)

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** High


