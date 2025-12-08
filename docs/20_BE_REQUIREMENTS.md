# Backend Requirements Specification

**프로젝트:** Closet Canvas (옷장/위시리스트 기반 웹앱)  
**작성일:** 2025-12-07  
**버전:** 1.0  
**대상:** Spring Boot 3.x + Java 17 백엔드

---

## 📋 목차

1. [개요](#개요)
2. [기능 요구사항 (Functional Requirements)](#기능-요구사항-functional-requirements)
3. [비기능 요구사항 (Non-Functional Requirements)](#비기능-요구사항-non-functional-requirements)
4. [도메인 모델 개요](#도메인-모델-개요)
5. [API 엔드포인트 개요](#api-엔드포인트-개요)

---

## 개요

이 문서는 Closet Canvas 백엔드 시스템의 요구사항을 정의합니다. 백엔드는 Spring Boot 기반으로 구축되며, 프론트엔드(Next.js)와 RESTful API로 통신합니다.

### 핵심 도메인
- **User** (회원/계정)
- **Item** (옷/아이템)
- **Wishlist** (위시리스트)
- **StyleProfile** (스타일 프로필)
- **Recommendation** (추천)

---

## 기능 요구사항 (Functional Requirements)

### 📊 Functional Requirements 표

| ID | Title | Type | 간단 설명 |
|---|---|---|---|
| **REQ-FUNC-001** | 회원 가입 및 인증 | User Management | 이메일/비밀번호 기반 회원가입, JWT 토큰 발급, 소셜 로그인(Google) 지원 |
| **REQ-FUNC-002** | 회원 프로필 관리 | User Management | 사용자 닉네임, 프로필 이미지, 선호 스타일 정보 CRUD |
| **REQ-FUNC-003** | 위시리스트 아이템 등록 | Wishlist | URL 입력 시 메타데이터(상품명, 이미지, 가격, 브랜드) 자동 추출 및 저장 |
| **REQ-FUNC-004** | 위시리스트 조회 및 관리 | Wishlist | 사용자별 위시리스트 CRUD, 페이지네이션, 필터링(카테고리, 가격대, 브랜드) |
| **REQ-FUNC-005** | 옷장 아이템 관리 | Item Management | 보유 의류 아이템 등록/수정/삭제, 이미지 업로드, 카테고리/색상/사이즈 분류 |
| **REQ-FUNC-006** | 스타일 프로필 저장 | Style Profile | 퀴즈 결과(스타일, 색상, 영감) 서버 저장, 버전 관리, 히스토리 조회 |
| **REQ-FUNC-007** | AI 기반 스타일 분석 | AI Integration | Gemini API 호출하여 스타일 프로필 분석, 결과 캐싱, 비동기 처리 |
| **REQ-FUNC-008** | 위시리스트 기반 코디 추천 | Recommendation | 위시리스트 아이템 조합으로 코디 제안, AI 생성, 저장 및 좋아요 기능 |
| **REQ-FUNC-009** | 유사 아이템 검색 | Search | 특정 아이템의 유사 상품 검색, 색상/스타일/가격대 기반 필터링 |
| **REQ-FUNC-010** | 개인화 추천 피드 | Recommendation | 사용자 스타일 프로필 기반 아이템 추천, 협업 필터링, 트렌드 반영 |
| **REQ-FUNC-011** | 위시리스트 공유 | Social | 위시리스트 공개/비공개 설정, 공유 링크 생성, 다른 사용자 위시리스트 조회 |
| **REQ-FUNC-012** | 알림 및 가격 변동 추적 | Notification | 위시리스트 아이템 가격 변동 추적, 재입고 알림, 이메일/푸시 알림 |

---

## 비기능 요구사항 (Non-Functional Requirements)

### ⚙️ Non-Functional Requirements 표

| ID | Title | Type | 간단 설명 |
|---|---|---|---|
| **REQ-NF-001** | 성능 및 응답 시간 | Performance | API 응답 시간 < 500ms (P95), DB 쿼리 최적화, 인덱싱 전략, 캐싱(Redis) 적용 |
| **REQ-NF-002** | 확장성 및 부하 처리 | Scalability | 동시 사용자 1,000명 지원, 수평 확장 가능 설계, Stateless API, DB 커넥션 풀 관리 |
| **REQ-NF-003** | 보안 | Security | JWT 기반 인증, HTTPS 통신, SQL Injection 방지, XSS 방어, API Rate Limiting (사용자당 100req/min) |
| **REQ-NF-004** | 데이터 무결성 및 트랜잭션 | Reliability | ACID 트랜잭션 보장, 외래키 제약조건, 낙관적 락(Optimistic Lock) 적용, 데이터 백업 정책 |
| **REQ-NF-005** | 모니터링 및 로깅 | Observability | 구조화된 로그(JSON), 에러 추적(Sentry 연동), 메트릭 수집(Actuator), Health Check 엔드포인트 |
| **REQ-NF-006** | 테스트 커버리지 | Quality | 단위 테스트 70% 이상, 통합 테스트 주요 플로우, API 문서 자동 생성(SpringDoc OpenAPI) |

---

## 도메인 모델 개요

### 📦 주요 엔티티 및 관계

```
┌─────────────┐         ┌──────────────┐
│    User     │1      * │ StyleProfile │
│─────────────│◄────────│──────────────│
│ id (PK)     │         │ id (PK)      │
│ email       │         │ user_id (FK) │
│ password    │         │ styles       │
│ nickname    │         │ colors       │
│ created_at  │         │ inspirations │
└─────────────┘         │ created_at   │
       │                └──────────────┘
       │ 1
       │
       │ *
┌─────────────┐         ┌──────────────┐
│  Wishlist   │1      * │ WishlistItem │
│─────────────│◄────────│──────────────│
│ id (PK)     │         │ id (PK)      │
│ user_id(FK) │         │ wishlist_id  │
│ name        │         │ url          │
│ is_public   │         │ title        │
│ created_at  │         │ brand        │
└─────────────┘         │ price        │
       │                │ image_url    │
       │ 1              │ category     │
       │                │ size         │
       │ *              │ color        │
┌─────────────┐         │ added_at     │
│  Closet     │         └──────────────┘
│─────────────│
│ id (PK)     │         ┌──────────────┐
│ user_id(FK) │1      * │ ClosetItem   │
│ name        │◄────────│──────────────│
└─────────────┘         │ id (PK)      │
                        │ closet_id    │
                        │ name         │
                        │ category     │
       ┌────────────────│ color        │
       │                │ size         │
       │ *              │ brand        │
┌─────────────┐         │ purchase_date│
│Recommendation│         │ image_url    │
│─────────────│         └──────────────┘
│ id (PK)     │
│ user_id(FK) │
│ type        │ (outfit/item/style)
│ content     │ (JSON)
│ score       │
│ created_at  │
└─────────────┘
```

---

## 세부 요구사항 명세

### 1. 회원 가입 및 인증 (REQ-FUNC-001)

**기능 상세:**
- 이메일 중복 체크 API
- 비밀번호 암호화 (BCrypt)
- JWT Access Token (유효기간 1시간)
- JWT Refresh Token (유효기간 2주)
- 소셜 로그인 (Google OAuth2)

**API 엔드포인트:**
```
POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/google
```

**엔티티:**
```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String nickname;
    private String profileImageUrl;
    
    @Enumerated(EnumType.STRING)
    private AuthProvider provider; // LOCAL, GOOGLE
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

---

### 2. 회원 프로필 관리 (REQ-FUNC-002)

**기능 상세:**
- 프로필 조회 (본인/타인)
- 닉네임 변경 (중복 체크)
- 프로필 이미지 업로드 (S3/Firebase Storage)
- 회원 탈퇴 (soft delete)

**API 엔드포인트:**
```
GET    /api/v1/users/{userId}
PUT    /api/v1/users/{userId}
DELETE /api/v1/users/{userId}
POST   /api/v1/users/{userId}/profile-image
```

**DTO:**
```java
public record UserProfileResponse(
    Long id,
    String email,
    String nickname,
    String profileImageUrl,
    LocalDateTime createdAt
) {}

public record UpdateProfileRequest(
    String nickname,
    String profileImageUrl
) {}
```

---

### 3. 위시리스트 아이템 등록 (REQ-FUNC-003)

**기능 상세:**
- URL 파싱 및 메타데이터 추출
  - Open Graph 태그 파싱
  - 상품명, 이미지, 가격, 브랜드 자동 추출
- 수동 입력 지원 (메타데이터 없는 경우)
- 이미지 프록시/캐싱
- 중복 URL 체크

**API 엔드포인트:**
```
POST /api/v1/wishlists/{wishlistId}/items
POST /api/v1/wishlists/{wishlistId}/items/extract-metadata
```

**요청 예시:**
```json
{
  "url": "https://shop.example.com/product/12345",
  "title": "Classic White Sneakers",
  "brand": "Common Projects",
  "price": 450000,
  "currency": "KRW",
  "imageUrl": "https://...",
  "category": "shoes",
  "size": "270",
  "color": "white"
}
```

**서비스 로직:**
```java
@Service
public class WishlistItemService {
    public MetadataDTO extractMetadata(String url) {
        // Jsoup으로 HTML 파싱
        Document doc = Jsoup.connect(url).get();
        
        String title = doc.select("meta[property=og:title]").attr("content");
        String image = doc.select("meta[property=og:image]").attr("content");
        String price = doc.select("meta[property=og:price:amount]").attr("content");
        
        return new MetadataDTO(title, image, price, ...);
    }
}
```

---

### 4. 위시리스트 조회 및 관리 (REQ-FUNC-004)

**기능 상세:**
- 위시리스트 생성 (사용자당 여러 개 가능)
- 위시리스트별 아이템 CRUD
- 페이지네이션 (page, size, sort)
- 필터링
  - 카테고리 (shoes, tops, bottoms, outerwear, accessories)
  - 가격대 (min, max)
  - 브랜드
  - 색상
- 정렬 (최신순, 가격순, 이름순)

**API 엔드포인트:**
```
POST   /api/v1/wishlists
GET    /api/v1/wishlists
GET    /api/v1/wishlists/{id}
PUT    /api/v1/wishlists/{id}
DELETE /api/v1/wishlists/{id}
GET    /api/v1/wishlists/{id}/items?page=0&size=20&sort=addedAt,desc&category=shoes
PUT    /api/v1/wishlists/{wishlistId}/items/{itemId}
DELETE /api/v1/wishlists/{wishlistId}/items/{itemId}
```

**필터 예시:**
```
GET /api/v1/wishlists/123/items?category=shoes&minPrice=100000&maxPrice=500000&brand=Nike&sort=price,asc
```

**응답 예시:**
```json
{
  "content": [
    {
      "id": 1,
      "url": "https://...",
      "title": "Classic White Sneakers",
      "brand": "Common Projects",
      "price": 450000,
      "currency": "KRW",
      "imageUrl": "https://...",
      "category": "shoes",
      "addedAt": "2025-12-06T12:00:00Z"
    }
  ],
  "pageable": {
    "page": 0,
    "size": 20,
    "totalElements": 45,
    "totalPages": 3
  }
}
```

---

### 5. 옷장 아이템 관리 (REQ-FUNC-005)

**기능 상세:**
- 보유 의류 아이템 CRUD
- 이미지 다중 업로드 (최대 5장)
- 착용 기록 (Wearing History)
- 아이템 상태 (새것, 중고, 수선 필요)
- 구매 정보 (구매일, 구매처, 가격)

**API 엔드포인트:**
```
POST   /api/v1/closets/{closetId}/items
GET    /api/v1/closets/{closetId}/items
GET    /api/v1/closets/{closetId}/items/{itemId}
PUT    /api/v1/closets/{closetId}/items/{itemId}
DELETE /api/v1/closets/{closetId}/items/{itemId}
POST   /api/v1/closets/{closetId}/items/{itemId}/images
```

**엔티티:**
```java
@Entity
@Table(name = "closet_items")
public class ClosetItem {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "closet_id")
    private Closet closet;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    private ItemCategory category;
    
    @Enumerated(EnumType.STRING)
    private Color color;
    
    private String size;
    private String brand;
    
    @ElementCollection
    private List<String> imageUrls;
    
    private LocalDate purchaseDate;
    private BigDecimal purchasePrice;
    
    @Enumerated(EnumType.STRING)
    private ItemCondition condition; // NEW, USED, REPAIR_NEEDED
    
    private Integer wearCount; // 착용 횟수
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

---

### 6. 스타일 프로필 저장 (REQ-FUNC-006)

**기능 상세:**
- 퀴즈 결과를 서버에 저장
- 버전 관리 (사용자가 퀴즈를 여러 번 할 수 있음)
- 최신 프로필 조회
- 히스토리 조회 (과거 프로필)
- 프로필 비교 기능

**API 엔드포인트:**
```
POST /api/v1/users/{userId}/style-profiles
GET  /api/v1/users/{userId}/style-profiles/latest
GET  /api/v1/users/{userId}/style-profiles
GET  /api/v1/users/{userId}/style-profiles/{profileId}
```

**엔티티:**
```java
@Entity
@Table(name = "style_profiles")
public class StyleProfile {
    @Id @GeneratedValue
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @ElementCollection
    @CollectionTable(name = "style_profile_styles")
    private List<String> styles; // ["modern", "minimalist"]
    
    @ElementCollection
    @CollectionTable(name = "style_profile_colors")
    private List<String> colors; // ["neutrals", "pastels"]
    
    @ElementCollection
    @CollectionTable(name = "style_profile_inspirations")
    private List<String> inspirations; // ["inspiration-1", "inspiration-2"]
    
    @Column(columnDefinition = "TEXT")
    private String aiAnalysis; // AI 생성 분석 결과
    
    @Column(nullable = false)
    private Boolean isActive; // 최신 프로필 여부
    
    @CreatedDate
    private LocalDateTime createdAt;
}
```

---

### 7. AI 기반 스타일 분석 (REQ-FUNC-007)

**기능 상세:**
- Gemini API 비동기 호출
- 프롬프트 템플릿 관리
- 응답 캐싱 (동일한 선택 조합 = 캐시 사용)
- 타임아웃 처리 (10초)
- Rate Limiting (사용자당 10회/일)

**API 엔드포인트:**
```
POST /api/v1/ai/analyze-style
GET  /api/v1/ai/cache/{cacheKey}
```

**요청:**
```json
{
  "styles": ["modern", "minimalist"],
  "colors": ["neutrals"],
  "inspirations": ["inspiration-1", "inspiration-2", "inspiration-3"]
}
```

**응답:**
```json
{
  "analysis": "Based on your selections, you have...",
  "recommendations": [
    "Invest in high-quality basics",
    "Focus on neutral colors",
    "Consider timeless pieces"
  ],
  "styleProfile": {
    "primary": "Modern Minimalist",
    "secondary": "Contemporary",
    "mood": "Sophisticated & Clean"
  },
  "cached": false,
  "generatedAt": "2025-12-07T10:30:00Z"
}
```

**서비스 로직:**
```java
@Service
public class AIStyleAnalysisService {
    @Cacheable(value = "styleAnalysis", key = "#request.getCacheKey()")
    @Async
    public CompletableFuture<StyleAnalysisResponse> analyzeStyle(
        StyleAnalysisRequest request
    ) {
        // Gemini API 호출
        GeminiResponse response = geminiClient.analyze(request);
        return CompletableFuture.completedFuture(
            mapToResponse(response)
        );
    }
}
```

---

### 8. 위시리스트 기반 코디 추천 (REQ-FUNC-008)

**기능 상세:**
- 위시리스트 아이템 조합 분석
- AI가 3-5개 코디 제안 생성
- 코디별 아이템 매핑
- 코디 저장 및 좋아요 기능
- 코디 히스토리

**API 엔드포인트:**
```
POST /api/v1/recommendations/outfits
GET  /api/v1/recommendations/outfits?userId={userId}
POST /api/v1/recommendations/outfits/{outfitId}/like
```

**요청:**
```json
{
  "wishlistId": 123,
  "itemIds": [1, 2, 3, 5, 7]
}
```

**응답:**
```json
{
  "outfits": [
    {
      "id": 1,
      "title": "Casual Weekend Look",
      "items": [
        { "id": 1, "title": "White Sneakers", "role": "shoes" },
        { "id": 2, "title": "Denim Jacket", "role": "outerwear" },
        { "id": 3, "title": "Black Jeans", "role": "bottoms" }
      ],
      "occasion": "casual",
      "description": "Perfect for relaxed weekend outings...",
      "aiGenerated": true
    }
  ]
}
```

---

### 9. 유사 아이템 검색 (REQ-FUNC-009)

**기능 상세:**
- 텍스트 설명 기반 검색
- 이미지 유사도 검색 (향후)
- 색상, 스타일, 가격대 필터
- 외부 쇼핑몰 API 연동 (옵션)

**API 엔드포인트:**
```
POST /api/v1/items/search/similar
GET  /api/v1/items/search?q=white+sneakers&category=shoes&minPrice=100000
```

**요청:**
```json
{
  "description": "white leather sneakers minimalist design",
  "category": "shoes",
  "priceRange": {
    "min": 100000,
    "max": 500000
  },
  "colors": ["white", "cream"]
}
```

---

### 10. 개인화 추천 피드 (REQ-FUNC-010)

**기능 상세:**
- 사용자 스타일 프로필 기반 추천
- 협업 필터링 (유사 사용자 취향)
- 트렌드 반영 (인기 아이템)
- 추천 이유 설명
- 매일 업데이트

**API 엔드포인트:**
```
GET /api/v1/recommendations/feed?page=0&size=20
GET /api/v1/recommendations/trending
GET /api/v1/recommendations/for-you
```

**추천 알고리즘:**
```
최종 점수 = (스타일 매칭 40%) + (가격대 20%) + (트렌드 20%) + (협업 필터링 20%)
```

---

### 11. 위시리스트 공유 (REQ-FUNC-011)

**기능 상세:**
- 위시리스트 공개/비공개 설정
- 공유 링크 생성 (UUID)
- 타인 위시리스트 조회 (읽기 전용)
- 좋아요/팔로우 기능

**API 엔드포인트:**
```
POST /api/v1/wishlists/{id}/share
GET  /api/v1/wishlists/shared/{shareToken}
POST /api/v1/wishlists/{id}/like
GET  /api/v1/wishlists/public?sort=likes,desc
```

---

### 12. 알림 및 가격 변동 추적 (REQ-FUNC-012)

**기능 상세:**
- 위시리스트 아이템 가격 크롤링 (배치)
- 가격 변동 감지 및 알림
- 재입고 알림
- 이메일/푸시 알림
- 알림 설정 관리

**API 엔드포인트:**
```
GET  /api/v1/notifications
POST /api/v1/notifications/settings
GET  /api/v1/items/{itemId}/price-history
```

**배치 작업:**
```java
@Scheduled(cron = "0 0 2 * * *") // 매일 새벽 2시
public void trackPriceChanges() {
    List<WishlistItem> items = wishlistItemRepository.findAllActive();
    
    for (WishlistItem item : items) {
        BigDecimal currentPrice = fetchCurrentPrice(item.getUrl());
        
        if (currentPrice.compareTo(item.getPrice()) < 0) {
            // 가격 하락 → 알림 발송
            notificationService.sendPriceDropAlert(item, currentPrice);
        }
    }
}
```

---

## 비기능 요구사항 상세

### REQ-NF-001: 성능 및 응답 시간

**목표:**
- API 응답 시간: P50 < 200ms, P95 < 500ms, P99 < 1000ms
- DB 쿼리 최적화: N+1 문제 방지, JOIN 최소화
- 인덱싱 전략
  ```sql
  CREATE INDEX idx_user_email ON users(email);
  CREATE INDEX idx_wishlist_user ON wishlists(user_id);
  CREATE INDEX idx_wishlist_item_wishlist ON wishlist_items(wishlist_id);
  CREATE INDEX idx_wishlist_item_category ON wishlist_items(category);
  ```
- 캐싱 전략
  - Redis: 스타일 분석 결과 (TTL 24시간)
  - Redis: 추천 피드 (TTL 1시간)
  - Local Cache: 메타데이터 (TTL 1주일)

---

### REQ-NF-002: 확장성 및 부하 처리

**목표:**
- 동시 사용자: 1,000명 지원
- TPS (Transactions Per Second): 500 TPS
- Stateless API (세션 없음, JWT만 사용)
- DB 커넥션 풀
  ```yaml
  spring:
    datasource:
      hikari:
        maximum-pool-size: 20
        minimum-idle: 5
        connection-timeout: 30000
  ```
- 이미지는 CDN 사용 (S3 + CloudFront)
- Read Replica (읽기 전용 DB 분리)

---

### REQ-NF-003: 보안

**구현 사항:**
- JWT 기반 인증
  ```java
  @SecurityScheme(name = "bearer-token", type = SecuritySchemeType.HTTP, 
                  scheme = "bearer", bearerFormat = "JWT")
  ```
- HTTPS 통신 강제
- SQL Injection 방지 (PreparedStatement)
- XSS 방어 (입력 sanitization)
- CSRF 토큰 (Cookie 사용 시)
- API Rate Limiting
  ```java
  @RateLimiter(name = "default", fallbackMethod = "rateLimitFallback")
  public ResponseEntity<?> getRecommendations() { ... }
  ```
- 비밀번호 정책
  - 최소 8자
  - 영문/숫자/특수문자 조합
  - BCrypt 암호화 (strength 12)

---

### REQ-NF-004: 데이터 무결성 및 트랜잭션

**구현 사항:**
- ACID 트랜잭션
  ```java
  @Transactional(isolation = Isolation.READ_COMMITTED)
  ```
- 외래키 제약조건
  ```sql
  ALTER TABLE wishlist_items 
  ADD CONSTRAINT fk_wishlist 
  FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) 
  ON DELETE CASCADE;
  ```
- 낙관적 락
  ```java
  @Version
  private Long version;
  ```
- 데이터 검증
  ```java
  @NotNull
  @Size(min = 1, max = 200)
  @Pattern(regexp = "^https?://.*")
  private String url;
  ```

---

### REQ-NF-005: 모니터링 및 로깅

**구현 사항:**
- 구조화된 로그 (JSON)
  ```java
  @Slf4j
  log.info("User registered", 
    kv("userId", user.getId()),
    kv("email", user.getEmail()),
    kv("timestamp", Instant.now())
  );
  ```
- 에러 추적
  - Sentry 연동
  - 에러 알림 (Slack)
- 메트릭 수집
  ```yaml
  management:
    endpoints:
      web:
        exposure:
          include: health,metrics,prometheus
  ```
- Health Check
  ```
  GET /actuator/health
  GET /actuator/metrics
  GET /actuator/prometheus
  ```

---

### REQ-NF-006: 테스트 커버리지

**목표:**
- 단위 테스트: 70% 이상
  - Service 계층 100%
  - Repository 80%
- 통합 테스트: 주요 플로우
  - 회원가입 → 로그인 → 위시리스트 생성
  - 퀴즈 완료 → 스타일 분석 → 추천
- API 문서 자동 생성
  ```java
  @OpenAPIDefinition(
    info = @Info(
      title = "Closet Canvas API",
      version = "1.0",
      description = "옷장/위시리스트 기반 웹앱 API"
    )
  )
  ```

**테스트 예시:**
```java
@SpringBootTest
@AutoConfigureMockMvc
class WishlistControllerTest {
    @Test
    @WithMockUser(username = "test@example.com")
    void createWishlistItem_Success() {
        // given
        WishlistItemRequest request = new WishlistItemRequest(
            "https://example.com/product",
            "White Sneakers",
            "Nike",
            250000
        );
        
        // when
        ResultActions result = mockMvc.perform(
            post("/api/v1/wishlists/1/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        );
        
        // then
        result.andExpect(status().isCreated())
              .andExpect(jsonPath("$.id").exists())
              .andExpect(jsonPath("$.title").value("White Sneakers"));
    }
}
```

---

## API 엔드포인트 개요

### 📡 전체 API 목록

| 도메인 | 엔드포인트 수 | 주요 기능 |
|--------|--------------|-----------|
| Auth | 5 | 회원가입, 로그인, 토큰 갱신 |
| User | 4 | 프로필 CRUD |
| Wishlist | 8 | 위시리스트 및 아이템 CRUD |
| Closet | 7 | 옷장 및 아이템 CRUD |
| StyleProfile | 4 | 스타일 프로필 저장/조회 |
| AI | 2 | 스타일 분석, 캐시 조회 |
| Recommendation | 4 | 코디 추천, 피드, 트렌드 |
| Search | 2 | 유사 아이템 검색 |
| Notification | 3 | 알림 조회, 설정 |
| **Total** | **39** | |

---

## 구현 우선순위

### Phase 1: 기본 기능 (Week 1-2)
1. REQ-FUNC-001 - 회원 가입/인증 ⭐⭐⭐
2. REQ-FUNC-002 - 프로필 관리 ⭐⭐
3. REQ-FUNC-004 - 위시리스트 CRUD ⭐⭐⭐
4. REQ-NF-003 - 보안 (JWT) ⭐⭐⭐

### Phase 2: 핵심 기능 (Week 3-4)
5. REQ-FUNC-003 - 메타데이터 추출 ⭐⭐⭐
6. REQ-FUNC-006 - 스타일 프로필 저장 ⭐⭐
7. REQ-FUNC-007 - AI 스타일 분석 ⭐⭐⭐

### Phase 3: 고급 기능 (Week 5-6)
8. REQ-FUNC-005 - 옷장 관리 ⭐⭐
9. REQ-FUNC-008 - 코디 추천 ⭐⭐⭐
10. REQ-FUNC-009 - 유사 아이템 검색 ⭐⭐

### Phase 4: 확장 기능 (Week 7-8)
11. REQ-FUNC-010 - 추천 피드 ⭐
12. REQ-FUNC-011 - 공유 기능 ⭐
13. REQ-FUNC-012 - 알림/가격 추적 ⭐

---

**문서 버전:** 1.0  
**작성자:** Closet Canvas Backend Team  
**최종 업데이트:** 2025-12-07  
**다음 리뷰:** 2025-12-14

