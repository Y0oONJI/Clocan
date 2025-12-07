# BE-001: Gemini API 실제 연동

## 📌 Issue Title
`Integrate Gemini API for real-time style analysis`

## 🎯 Goal
Result 페이지에서 시뮬레이션 대신 실제 Gemini 2.5 Flash API를 호출하여 사용자 스타일을 분석합니다.

## 📋 Background
현재 AI flows(`find-similar-clothing-items`, `outfit-suggestion-from-wishlist`)가 정의되어 있지만, 실제 UI에서 사용되지 않고 있습니다. Result 페이지는 2초 딜레이 후 하드코딩된 텍스트를 반환합니다.

## 📂 Modified Files (Expected)
- `src/ai/flows/style-analysis.ts` (신규 생성)
- `src/app/style-quiz/result/page.tsx` (API 호출 추가)
- `src/app/api/analyze-style/route.ts` (신규 API 라우트)
- `.env.local` (API 키 추가)
- `.env.example` (예제 파일)

## ✅ Acceptance Criteria

### Must Have
- [ ] 새로운 `style-analysis` Genkit flow 생성
  - Input: styles[], colors[], inspirations[]
  - Output: 개인화된 스타일 분석 텍스트
- [ ] Next.js API Route 생성 (`/api/analyze-style`)
  - POST 요청 처리
  - Genkit flow 호출
  - 에러 처리
- [ ] Result 페이지에서 실제 API 호출
  - 시뮬레이션 코드 제거
  - fetch로 API 호출
- [ ] 환경 변수 설정
  - GOOGLE_GENAI_API_KEY

### Nice to Have
- [ ] 스트리밍 응답 지원
- [ ] 응답 캐싱 (동일한 선택 조합)
- [ ] Rate limiting
- [ ] Analytics 로깅

## 💡 Implementation Details

### Step 1: Style Analysis Flow 생성
```typescript
// src/ai/flows/style-analysis.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StyleAnalysisInputSchema = z.object({
  styles: z.array(z.string()).describe('Selected style preferences'),
  colors: z.array(z.string()).describe('Selected color palettes'),
  inspirations: z.array(z.string()).describe('Selected inspiration images'),
});

const StyleAnalysisOutputSchema = z.object({
  analysis: z.string().describe('Personalized style analysis'),
  recommendations: z.array(z.string()).describe('Style recommendations'),
  styleProfile: z.object({
    primary: z.string(),
    secondary: z.string(),
    mood: z.string(),
  }),
});

export type StyleAnalysisInput = z.infer<typeof StyleAnalysisInputSchema>;
export type StyleAnalysisOutput = z.infer<typeof StyleAnalysisOutputSchema>;

const styleAnalysisPrompt = ai.definePrompt({
  name: 'styleAnalysisPrompt',
  input: { schema: StyleAnalysisInputSchema },
  output: { schema: StyleAnalysisOutputSchema },
  prompt: `You are a professional fashion stylist analyzing a user's style preferences.

Based on the following selections:
- Styles: {{#each styles}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
- Colors: {{#each colors}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
- Inspirations: {{inspirations.length}} outfit images selected

Provide:
1. A detailed, personalized style analysis (3-4 paragraphs)
2. 3-5 specific style recommendations
3. A style profile with primary style, secondary style, and overall mood

Be encouraging and specific. Mention how their color choices complement their style preferences.`,
});

const styleAnalysisFlow = ai.defineFlow(
  {
    name: 'styleAnalysisFlow',
    inputSchema: StyleAnalysisInputSchema,
    outputSchema: StyleAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await styleAnalysisPrompt(input);
    return output!;
  }
);

export async function analyzeStyle(input: StyleAnalysisInput): Promise<StyleAnalysisOutput> {
  return styleAnalysisFlow(input);
}
```

### Step 2: API Route 생성
```typescript
// src/app/api/analyze-style/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { analyzeStyle } from '@/ai/flows/style-analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { styles, colors, inspirations } = body;

    // 입력 검증
    if (!styles || !colors || !inspirations) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Gemini API 호출
    const result = await analyzeStyle({
      styles,
      colors,
      inspirations,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Style analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Rate limiting을 위한 config (optional)
export const runtime = 'edge';
export const maxDuration = 30; // 30초 타임아웃
```

### Step 3: Result 페이지 수정
```typescript
// src/app/style-quiz/result/page.tsx
const generateResult = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await fetch('/api/analyze-style', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        styles: selectedStyles,
        colors: selectedColors,
        inspirations: selectedInspirations,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    setResult(data.analysis);
  } catch (err) {
    setError('분석 중 오류가 발생했습니다.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};
```

### Step 4: 환경 변수 설정
```bash
# .env.local (create this file, don't commit)
GOOGLE_GENAI_API_KEY=your_api_key_here
```

```bash
# .env.example (commit this)
# Google Gemini API Key
# Get your key from: https://aistudio.google.com/app/apikey
GOOGLE_GENAI_API_KEY=
```

### Step 5: dev.ts에 flow 등록
```typescript
// src/ai/dev.ts
import { config } from 'dotenv';
config();

import '@/ai/flows/style-analysis.ts'; // 추가
import '@/ai/flows/outfit-suggestion-from-wishlist.ts';
import '@/ai/flows/find-similar-clothing-items.ts';
```

## 🧪 Testing Checklist
- [ ] Genkit Dev UI에서 flow 테스트 (`npm run genkit:dev`)
- [ ] API Route 동작 확인 (Postman/curl)
- [ ] Result 페이지에서 실제 분석 확인
- [ ] 에러 케이스 테스트
  - API 키 없음
  - 잘못된 입력
  - 네트워크 에러
- [ ] 응답 시간 측정 (< 10초)

## 📊 Impact
- **기능**: ⬆️⬆️⬆️ 시뮬레이션 → 실제 AI 분석
- **사용자 가치**: ⬆️⬆️⬆️ 진짜 개인화된 추천
- **차별화**: ⬆️⬆️⬆️ AI 파워 활용

## 🏷️ Labels
`enhancement`, `backend`, `ai`, `integration`, `high-priority`

## 📅 Estimated Time
**4-6 hours**

## 🔗 Related Issues
- FE-003 (Result 에러 처리)
- Related to Phase 3 in Roadmap

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** High

