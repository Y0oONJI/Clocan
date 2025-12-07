# FE-008: 위시리스트 기능 구현

## 📌 Issue Title
`Implement Wishlist feature with URL input and card display`

## 🎯 Goal
사용자가 URL을 입력하여 위시 아이템을 추가하고, 카드 형태로 관리할 수 있는 위시리스트 페이지를 구현합니다.

## 📋 Background
프로젝트의 핵심 기능인 "Oho Wardrobe" 위시리스트가 아직 구현되지 않았습니다. 사용자는 온라인 쇼핑몰 URL을 입력하여 상품을 위시리스트에 추가할 수 있어야 합니다.

## 📂 Modified Files (Expected)
- `src/app/wishlist/page.tsx` (신규 생성)
- `src/components/wishlist/WishlistCard.tsx` (신규 생성)
- `src/components/wishlist/AddWishForm.tsx` (신규 생성)
- `src/hooks/useWishlist.ts` (신규 생성)
- `src/types/wishlist.ts` (신규 생성)
- `src/data/dummy-wishlist.ts` (신규 생성 - 초기 더미 데이터)

## ✅ Acceptance Criteria

### Must Have (Phase 1 - UI Only)
- [ ] 위시리스트 페이지 레이아웃
  - 상단: 타이틀 + URL 입력 필드 + "Add Wish" 버튼
  - 하단: 위시리스트 카드 그리드
- [ ] AddWishForm 컴포넌트
  - URL 입력 필드
  - 유효성 검사 (URL 형식)
  - Submit 핸들러
- [ ] WishlistCard 컴포넌트
  - 이미지 (placeholder)
  - 상품명
  - 브랜드
  - 가격
  - 삭제 버튼
- [ ] Dummy 데이터로 초기 카드 표시
  - 5-10개 샘플 아이템
- [ ] useWishlist 상태 관리
  - 추가/삭제 로직
  - 로컬 상태 관리

### Nice to Have (Phase 2 - 향후)
- [ ] URL 메타데이터 추출 (Open Graph)
- [ ] 이미지 업로드 기능
- [ ] 카테고리 필터링
- [ ] 정렬 기능 (가격, 날짜)
- [ ] 위시리스트 공유

## 💡 Implementation Details

### Step 1: 타입 정의
```typescript
// src/types/wishlist.ts
export interface WishItem {
  id: string;
  url: string;
  title: string;
  brand?: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  description?: string;
  addedAt: number;
  category?: string;
  size?: string;
  color?: string;
}

export interface WishlistState {
  items: WishItem[];
}
```

### Step 2: Dummy 데이터
```typescript
// src/data/dummy-wishlist.ts
import type { WishItem } from '@/types/wishlist';

export const DUMMY_WISHLIST: WishItem[] = [
  {
    id: '1',
    url: 'https://example.com/product/1',
    title: 'Classic White Sneakers',
    brand: 'Common Projects',
    price: 450000,
    currency: 'KRW',
    imageUrl: '/placeholder-sneakers.jpg',
    description: 'Minimalist leather sneakers',
    addedAt: Date.now() - 86400000, // 1 day ago
    category: 'shoes',
    size: '270',
    color: 'white',
  },
  {
    id: '2',
    url: 'https://example.com/product/2',
    title: 'Oversized Denim Jacket',
    brand: 'Levi\'s',
    price: 120000,
    currency: 'KRW',
    imageUrl: '/placeholder-jacket.jpg',
    addedAt: Date.now() - 172800000, // 2 days ago
    category: 'outerwear',
  },
  // ... 8 more items
];
```

### Step 3: useWishlist 훅
```typescript
// src/hooks/useWishlist.ts
import { useState } from 'react';
import type { WishItem } from '@/types/wishlist';
import { DUMMY_WISHLIST } from '@/data/dummy-wishlist';

export function useWishlist() {
  const [items, setItems] = useState<WishItem[]>(DUMMY_WISHLIST);

  const addItem = (url: string) => {
    const newItem: WishItem = {
      id: Date.now().toString(),
      url,
      title: 'New Item', // 향후 메타데이터 추출로 대체
      addedAt: Date.now(),
    };
    setItems(prev => [newItem, ...prev]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return {
    items,
    addItem,
    removeItem,
  };
}
```

### Step 4: WishlistCard 컴포넌트
```typescript
// src/components/wishlist/WishlistCard.tsx
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import type { WishItem } from '@/types/wishlist';

interface WishlistCardProps {
  item: WishItem;
  onRemove: (id: string) => void;
}

export function WishlistCard({ item, onRemove }: WishlistCardProps) {
  const formatPrice = (price?: number, currency = 'KRW') => {
    if (!price) return null;
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* 이미지 */}
      <div className="relative aspect-square">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
      </div>

      {/* 정보 */}
      <CardContent className="p-4 space-y-2">
        {item.brand && (
          <Badge variant="secondary">{item.brand}</Badge>
        )}
        
        <h3 className="font-semibold text-lg line-clamp-2">
          {item.title}
        </h3>
        
        {item.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {item.price && (
            <span className="text-lg font-bold text-primary">
              {formatPrice(item.price, item.currency)}
            </span>
          )}
          
          {item.size && (
            <Badge variant="outline">Size {item.size}</Badge>
          )}
        </div>
      </CardContent>

      {/* 액션 */}
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => window.open(item.url, '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### Step 5: AddWishForm 컴포넌트
```typescript
// src/components/wishlist/AddWishForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface AddWishFormProps {
  onAdd: (url: string) => void;
}

export function AddWishForm({ onAdd }: AddWishFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('URL을 입력해주세요.');
      return;
    }

    if (!validateUrl(url)) {
      setError('올바른 URL 형식이 아닙니다.');
      return;
    }

    onAdd(url);
    setUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="url"
        placeholder="상품 URL을 입력하세요 (예: https://...)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1"
        aria-label="상품 URL"
      />
      
      <Button type="submit">
        <Plus className="w-4 h-4 mr-2" />
        Add Wish
      </Button>
      
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </form>
  );
}
```

### Step 6: Wishlist 페이지
```typescript
// src/app/wishlist/page.tsx
'use client';

import { useWishlist } from '@/hooks/useWishlist';
import { AddWishForm } from '@/components/wishlist/AddWishForm';
import { WishlistCard } from '@/components/wishlist/WishlistCard';

export default function WishlistPage() {
  const { items, addItem, removeItem } = useWishlist();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-headline text-primary mb-4">
            My Wishlist
          </h1>
          
          <AddWishForm onAdd={addItem} />
        </div>

        {/* Wishlist Grid */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              위시리스트가 비어있습니다. URL을 추가해보세요!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

## 🧪 Testing Checklist
- [ ] URL 입력 시 새 카드 추가됨
- [ ] 삭제 버튼 클릭 시 카드 제거됨
- [ ] 잘못된 URL 입력 시 에러 메시지
- [ ] 빈 입력 시 에러 메시지
- [ ] 반응형 그리드 레이아웃 동작
- [ ] 카드 호버 효과
- [ ] 외부 링크 새 탭에서 열림

## 📊 Impact
- **기능**: ⬆️⬆️⬆️ 핵심 기능 추가
- **사용자 가치**: ⬆️⬆️⬆️ 실제 사용 가능한 서비스
- **차별화**: ⬆️⬆️ 스타일 퀴즈 + 위시리스트 연계

## 🏷️ Labels
`feature`, `frontend`, `wishlist`, `high-priority`

## 📅 Estimated Time
**4-6 hours**

## 🔗 Related Issues
- FE-009 (URL 메타데이터 추출 - 다음 단계)
- BE-003 (백엔드 연동 - 향후)
- Related to Phase 3, 4 in Roadmap

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** High

