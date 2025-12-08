# FE-007: 성능 최적화

## 📌 Issue Title
`Optimize performance with lazy loading and memoization`

## 🎯 Goal
이미지 lazy loading, 컴포넌트 메모이제이션, 코드 스플리팅을 통해 초기 로딩 속도와 런타임 성능을 개선합니다.

## 📋 Background
현재 모든 이미지가 즉시 로드되고, 컴포넌트 최적화가 되어 있지 않아 불필요한 리렌더링이 발생할 수 있습니다. Lighthouse 점수를 90+ 이상으로 개선할 필요가 있습니다.

## 📂 Modified Files (Expected)
- `src/components/quiz/shared/StyleCard.tsx` (Image 최적화)
- `src/components/quiz/steps/InspirationSelectionStep.tsx` (lazy loading)
- `src/components/quiz/shared/SelectionCard.tsx` (React.memo)
- `src/components/quiz/shared/ColorPaletteCard.tsx` (React.memo)
- `next.config.ts` (이미지 최적화 설정)

## ✅ Acceptance Criteria

### Must Have
- [ ] 이미지 최적화
  - priority prop (above-fold 이미지)
  - placeholder="blur" (로딩 중 블러 효과)
  - sizes 속성 (반응형 이미지)
- [ ] React.memo 적용
  - SelectionCard, StyleCard, ColorPaletteCard
  - 불필요한 리렌더링 방지
- [ ] useCallback/useMemo 최적화
  - 이벤트 핸들러 메모이제이션
  - 비용이 큰 계산 캐싱
- [ ] 코드 스플리팅
  - Dynamic import for heavy components
  - Route-based splitting

### Nice to Have
- [ ] Intersection Observer로 lazy loading
- [ ] Virtual scrolling (긴 리스트)
- [ ] Web Workers (heavy computation)
- [ ] Service Worker (PWA)

## 💡 Implementation Details

### Step 1: Image 최적화
```typescript
// src/components/quiz/shared/StyleCard.tsx
export function StyleCard({ style, isSelected, onToggle }: StyleCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === style.imageId);

  return (
    <SelectionCard ...>
      <CardContent className="p-0 aspect-w-1 aspect-h-1 relative">
        {image && (
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={false} // lazy load
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // tiny placeholder
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {/* ... */}
      </CardContent>
    </SelectionCard>
  );
}
```

### Step 2: React.memo 적용
```typescript
// src/components/quiz/shared/SelectionCard.tsx
import React, { memo } from 'react';

export const SelectionCard = memo(function SelectionCard({
  id,
  isSelected,
  onToggle,
  children,
}: SelectionCardProps) {
  // ... 컴포넌트 로직
}, (prevProps, nextProps) => {
  // Custom comparison
  return (
    prevProps.id === nextProps.id &&
    prevProps.isSelected === nextProps.isSelected
  );
});
```

### Step 3: useCallback 최적화
```typescript
// src/hooks/useQuizState.ts
const toggleSelection = useCallback((category: QuizCategory, id: string) => {
  setSelections((prev) => ({
    ...prev,
    [category]: prev[category].includes(id)
      ? prev[category].filter((item) => item !== id)
      : [...prev[category], id],
  }));
}, []); // 빈 의존성 배열
```

### Step 4: Dynamic Import
```typescript
// src/app/style-quiz/result/page.tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <Skeleton className="w-full h-64" />,
  ssr: false,
});

export default function ResultPage() {
  return (
    <div>
      {/* ... */}
      {showChart && <HeavyChart data={data} />}
    </div>
  );
}
```

### Step 5: Intersection Observer Lazy Load
```typescript
// src/hooks/useIntersectionObserver.ts
export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);

  return isIntersecting;
}

// 사용
const imageRef = useRef<HTMLDivElement>(null);
const isVisible = useIntersectionObserver(imageRef, { threshold: 0.1 });

{isVisible && <Image ... />}
```

### Step 6: next.config 이미지 최적화
```typescript
// next.config.ts
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compress: true,
  poweredByHeader: false,
};
```

## 🧪 Testing Checklist

### Performance
- [ ] Lighthouse 성능 점수 > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1

### 최적화 확인
- [ ] React DevTools Profiler로 리렌더링 확인
- [ ] Network 탭에서 이미지 lazy loading 확인
- [ ] Bundle analyzer로 번들 크기 확인
- [ ] Chrome DevTools Performance 탭

### 사용자 경험
- [ ] 느린 3G 네트워크에서 테스트
- [ ] CPU throttling (4x slowdown)에서 테스트
- [ ] 모바일 기기 실제 테스트

## 📊 Impact
- **로딩 속도**: ⬆️⬆️⬆️ 초기 로딩 30-50% 개선 예상
- **사용자 경험**: ⬆️⬆️ 부드러운 인터랙션
- **SEO**: ⬆️⬆️ Core Web Vitals 개선
- **서버 비용**: ⬇️ 최적화된 이미지 전송

## 🏷️ Labels
`performance`, `optimization`, `frontend`, `medium-priority`

## 📅 Estimated Time
**3-4 hours**

## 🔗 Related Issues
- Related to Phase 5 in Roadmap (Quality Enhancement)

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** Medium

