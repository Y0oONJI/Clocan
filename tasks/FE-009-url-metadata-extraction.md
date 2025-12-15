# FE-009: URL 메타데이터 추출

## 📌 Issue Title
`Extract product metadata from URL (Open Graph)`

## 🎯 Goal
사용자가 입력한 상품 URL에서 Open Graph 메타데이터를 자동으로 추출하여, 상품명, 이미지, 브랜드, 가격 정보를 위시리스트 카드에 자동으로 채웁니다.

## 📋 Background
현재 URL 입력 시 더미 데이터만 생성됩니다. 실제 쇼핑몰 URL에서 메타데이터를 추출하면 사용자가 수동 입력할 필요가 없어 UX가 크게 개선됩니다.

## 📂 Modified Files (Expected)
- `src/app/api/extract-metadata/route.ts` (신규 생성)
- `src/lib/metadata-extractor.ts` (신규 생성)
- `src/components/wishlist/AddWishForm.tsx` (API 호출 추가)
- `src/hooks/useWishlist.ts` (메타데이터 통합)

## ✅ Acceptance Criteria

### Must Have
- [ ] Open Graph 메타데이터 추출
  - og:title → 상품명
  - og:image → 이미지 URL
  - og:description → 설명
- [ ] 가격 정보 파싱 (가능한 경우)
  - og:price:amount
  - 또는 HTML 파싱
- [ ] API Route 구현
  - POST /api/extract-metadata
  - CORS 처리
  - 에러 처리
- [ ] 로딩 상태 UI
  - "메타데이터 추출 중..." 표시
  - 스피너 애니메이션

### Nice to Have
- [ ] 여러 쇼핑몰 지원
  - 29cm, 무신사, 에이블리 등
  - 사이트별 커스텀 파서
- [ ] 이미지 프록시 (CORS 우회)
- [ ] 메타데이터 캐싱
- [ ] 실패 시 수동 입력 폼

## 💡 Implementation Details

### Step 1: Metadata Extractor 유틸리티
```typescript
// src/lib/metadata-extractor.ts
import { JSDOM } from 'jsdom';

export interface ExtractedMetadata {
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  brand?: string;
}

export async function extractMetadata(url: string): Promise<ExtractedMetadata> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ClosetCanvas/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Open Graph 메타 태그 추출
    const getMetaContent = (property: string): string | undefined => {
      const meta = document.querySelector(
        `meta[property="${property}"], meta[name="${property}"]`
      );
      return meta?.getAttribute('content') || undefined;
    };

    return {
      title: getMetaContent('og:title') || getMetaContent('twitter:title'),
      description: getMetaContent('og:description') || getMetaContent('twitter:description'),
      imageUrl: getMetaContent('og:image') || getMetaContent('twitter:image'),
      price: parseFloat(getMetaContent('og:price:amount') || '0') || undefined,
      currency: getMetaContent('og:price:currency') || 'KRW',
      brand: getMetaContent('og:brand') || getMetaContent('product:brand'),
    };
  } catch (error) {
    console.error('Metadata extraction failed:', error);
    throw error;
  }
}
```

### Step 2: API Route
```typescript
// src/app/api/extract-metadata/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { extractMetadata } from '@/lib/metadata-extractor';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const metadata = await extractMetadata(url);

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Metadata extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract metadata' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const maxDuration = 10;
```

### Step 3: AddWishForm 업데이트
```typescript
// src/components/wishlist/AddWishForm.tsx
const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // 메타데이터 추출
    const response = await fetch('/api/extract-metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract metadata');
    }

    const metadata = await response.json();
    onAdd(url, metadata);
    setUrl('');
  } catch (err) {
    setError('메타데이터 추출에 실패했습니다. 수동으로 입력해주세요.');
  } finally {
    setLoading(false);
  }
};

return (
  <form onSubmit={handleSubmit}>
    <Input ... disabled={loading} />
    <Button type="submit" disabled={loading}>
      {loading ? '추출 중...' : 'Add Wish'}
    </Button>
  </form>
);
```

## 🧪 Testing Checklist
- [ ] 29cm 상품 URL 테스트
- [ ] 무신사 상품 URL 테스트
- [ ] 에이블리 상품 URL 테스트
- [ ] 해외 쇼핑몰 URL 테스트
- [ ] 잘못된 URL 입력 시 에러 처리
- [ ] 타임아웃 처리 (10초)
- [ ] CORS 에러 처리
- [ ] 이미지가 없는 경우 fallback

## 📊 Impact
- **UX**: ⬆️⬆️⬆️ 자동 입력으로 편의성 대폭 향상
- **정확성**: ⬆️⬆️ 메타데이터로 정확한 정보
- **차별화**: ⬆️⬆️ 핵심 기능 완성

## 🏷️ Labels
`feature`, `backend`, `frontend`, `metadata`, `high-priority`

## 📅 Estimated Time
**6-8 hours**

## 🔗 Related Issues
- FE-008 (Wishlist Feature - 선행 필요)
- 의존성: jsdom 또는 cheerio 설치 필요

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** High  
**Depends On:** FE-008


