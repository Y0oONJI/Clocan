# FE-010: 퀴즈 결과 기반 위시리스트 추천

## 📌 Issue Title
`Connect quiz results with wishlist recommendations`

## 🎯 Goal
스타일 퀴즈 결과를 활용하여 위시리스트에서 사용자의 스타일에 맞는 아이템을 추천하고, AI로 코디 제안을 제공합니다.

## 📋 Background
현재 스타일 퀴즈와 위시리스트가 분리되어 있습니다. 퀴즈 결과를 활용하면 개인화된 추천과 스타일 매칭이 가능해집니다.

## 📂 Modified Files (Expected)
- `src/app/wishlist/page.tsx` (추천 섹션 추가)
- `src/components/wishlist/RecommendedItems.tsx` (신규 생성)
- `src/components/wishlist/OutfitSuggestion.tsx` (신규 생성)
- `src/ai/flows/wishlist-recommendations.ts` (신규 생성)
- `src/hooks/useStyleProfile.ts` (신규 생성)

## ✅ Acceptance Criteria

### Must Have
- [ ] 스타일 프로필 불러오기
  - 로컬 스토리지에서 퀴즈 결과 조회
  - 없으면 "퀴즈 먼저 하기" 안내
- [ ] 위시리스트 필터링
  - 선택한 스타일과 매칭되는 아이템 강조
  - 선택한 색상과 매칭되는 아이템 표시
- [ ] AI 코디 제안
  - 위시리스트 아이템 조합
  - 스타일 프로필 기반 제안
- [ ] 추천 UI
  - "Recommended for You" 섹션
  - 매칭도 표시 (%)

### Nice to Have
- [ ] 실시간 매칭 점수 계산
- [ ] 부족한 아이템 제안
- [ ] 시즌별 추천
- [ ] 예산 기반 필터링

## 💡 Implementation Details

### Step 1: useStyleProfile 훅
```typescript
// src/hooks/useStyleProfile.ts
import { loadQuizResult } from '@/lib/storage';
import type { QuizSelections } from '@/types/quiz';

export interface StyleProfile {
  styles: string[];
  colors: string[];
  inspirations: string[];
  hasProfile: boolean;
}

export function useStyleProfile(): StyleProfile {
  const [profile, setProfile] = useState<StyleProfile>({
    styles: [],
    colors: [],
    inspirations: [],
    hasProfile: false,
  });

  useEffect(() => {
    const result = loadQuizResult();
    if (result) {
      setProfile({
        ...result.selections,
        hasProfile: true,
      });
    }
  }, []);

  return profile;
}
```

### Step 2: AI 추천 Flow
```typescript
// src/ai/flows/wishlist-recommendations.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WishlistRecommendationInputSchema = z.object({
  wishlistItems: z.array(z.object({
    title: z.string(),
    category: z.string().optional(),
    color: z.string().optional(),
  })),
  styleProfile: z.object({
    styles: z.array(z.string()),
    colors: z.array(z.string()),
  }),
});

const WishlistRecommendationOutputSchema = z.object({
  outfitSuggestions: z.array(z.object({
    title: z.string(),
    items: z.array(z.string()),
    occasion: z.string(),
    description: z.string(),
  })),
  missingItems: z.array(z.object({
    category: z.string(),
    reason: z.string(),
  })),
});

const recommendationPrompt = ai.definePrompt({
  name: 'wishlistRecommendationPrompt',
  input: { schema: WishlistRecommendationInputSchema },
  output: { schema: WishlistRecommendationOutputSchema },
  prompt: `As a fashion stylist, analyze the user's wishlist and style profile.

User's Style Profile:
- Preferred Styles: {{#each styleProfile.styles}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
- Preferred Colors: {{#each styleProfile.colors}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}

Wishlist Items:
{{#each wishlistItems}}
- {{title}}{{#if category}} ({{category}}){{/if}}
{{/each}}

Provide:
1. 3-5 outfit suggestions combining wishlist items
2. Missing essential items to complete the wardrobe
`,
});

export async function generateWishlistRecommendations(input: any) {
  const flow = ai.defineFlow(
    {
      name: 'wishlistRecommendationFlow',
      inputSchema: WishlistRecommendationInputSchema,
      outputSchema: WishlistRecommendationOutputSchema,
    },
    async (input) => {
      const { output } = await recommendationPrompt(input);
      return output!;
    }
  );
  
  return flow(input);
}
```

### Step 3: RecommendedItems 컴포넌트
```typescript
// src/components/wishlist/RecommendedItems.tsx
'use client';

import { useEffect, useState } from 'react';
import { useStyleProfile } from '@/hooks/useStyleProfile';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import type { WishItem } from '@/types/wishlist';

interface RecommendedItemsProps {
  items: WishItem[];
}

export function RecommendedItems({ items }: RecommendedItemsProps) {
  const profile = useStyleProfile();
  const [matchedItems, setMatchedItems] = useState<WishItem[]>([]);

  useEffect(() => {
    if (!profile.hasProfile) return;

    // 스타일 프로필과 매칭되는 아이템 필터링
    const matched = items.filter(item => {
      const styleMatch = profile.styles.some(style => 
        item.title.toLowerCase().includes(style) ||
        item.category?.toLowerCase().includes(style)
      );
      
      const colorMatch = profile.colors.some(color =>
        item.color?.toLowerCase().includes(color)
      );

      return styleMatch || colorMatch;
    });

    setMatchedItems(matched);
  }, [items, profile]);

  if (!profile.hasProfile) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground mb-4">
          스타일 퀴즈를 완료하시면 맞춤 추천을 받으실 수 있어요!
        </p>
        <Button onClick={() => router.push('/style-quiz')}>
          퀴즈 하러 가기
        </Button>
      </Card>
    );
  }

  if (matchedItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold">Recommended for You</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        당신의 {profile.styles.join(', ')} 스타일에 어울리는 아이템들이에요
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchedItems.map((item) => (
          <div key={item.id} className="relative">
            <WishlistCard item={item} onRemove={onRemove} />
            <Badge className="absolute top-2 left-2 z-10">
              <Sparkles className="w-3 h-3 mr-1" />
              Match
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Step 4: Wishlist 페이지에 통합
```typescript
// src/app/wishlist/page.tsx
export default function WishlistPage() {
  const { items, addItem, removeItem } = useWishlist();
  const profile = useStyleProfile();

  return (
    <div>
      {/* ... AddWishForm ... */}

      {/* Recommended Items */}
      {profile.hasProfile && (
        <RecommendedItems items={items} onRemove={removeItem} />
      )}

      {/* All Items */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Items</h2>
        <Badge variant="secondary">{items.length} items</Badge>
      </div>
      
      {/* ... WishlistCard grid ... */}
    </div>
  );
}
```

## 🧪 Testing Checklist
- [ ] 퀴즈 완료 후 위시리스트에서 추천 표시 확인
- [ ] 스타일 매칭 알고리즘 동작 확인
- [ ] 퀴즈 결과 없을 때 "퀴즈 하러 가기" 표시
- [ ] 매칭 아이템이 없을 때 UI 처리
- [ ] 로컬 스토리지 데이터 연동 확인

## 📊 Impact
- **개인화**: ⬆️⬆️⬆️ 퀴즈 결과 활용
- **사용자 가치**: ⬆️⬆️⬆️ 맞춤 추천
- **재방문율**: ⬆️⬆️ 개인화된 경험으로 retention 증가

## 🏷️ Labels
`feature`, `ai`, `frontend`, `recommendation`, `high-priority`

## 📅 Estimated Time
**5-7 hours**

## 🔗 Related Issues
- FE-008 (Wishlist Feature)
- FE-005 (Local Storage)
- BE-001 (Gemini API)
- Related to Phase 3, 4 in Roadmap

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** High  
**Depends On:** FE-008, FE-005

