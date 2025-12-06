# 🎨 Closet Canvas

> Your digital wardrobe for endless style inspiration

디지털 옷장을 구축하고, AI 기반 스타일 제안을 받을 수 있는 패션 플랫폼입니다.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [사용자 워크플로우](#-사용자-워크플로우)
- [문서](#-문서)
- [코드 품질](#-코드-품질)
- [로드맵](#-로드맵)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

---

## 🎯 프로젝트 소개

**Closet Canvas**는 사용자의 스타일 선호도를 파악하고, AI를 활용하여 개인화된 패션 추천을 제공하는 웹 애플리케이션입니다.

### 🌟 핵심 가치

- **개인화**: 5단계 스타일 퀴즈를 통한 맞춤형 분석
- **직관성**: 이미지 중심의 쉽고 재미있는 인터페이스
- **AI 파워**: Google Gemini 2.5 Flash 기반 스타일 분석
- **접근성**: 모든 디바이스에서 최적화된 반응형 디자인

---

## ✨ 주요 기능

### 1. 🎨 스타일 퀴즈

- **5단계 온보딩 플로우**
  1. 환영 화면
  2. 스타일 선택 (Modern, Vintage, Bohemian, Streetwear, Classic, Minimalist)
  3. 색상 팔레트 선택 (Neutrals, Pastels, Brights, Monochrome, Earthy, Jewel Tones)
  4. 영감 이미지 선택 (9개 outfit 이미지)
  5. 완료 및 분석 결과

- **인터랙티브 UX**
  - 실시간 선택 피드백 (체크마크, 링 효과)
  - Progress bar로 진행 상황 표시
  - 이전 단계로 돌아가기 가능
  - 최소 1개 이상 선택 유효성 검사

### 2. 📊 AI 스타일 분석

- **개인화된 분석 리포트**
  - 선택한 스타일 요약
  - 색상 선호도 분석
  - 종합 스타일 프로필 생성

- **향후 확장 기능** (준비 완료)
  - 유사 의류 아이템 검색
  - 위시리스트 기반 아웃핏 제안

### 3. 🎭 랜딩 페이지

- 명확한 가치 제안
- 3가지 핵심 기능 소개
- CTA(Call-to-Action) 버튼
- 모던하고 세련된 디자인

---

## 🛠️ 기술 스택

### Frontend

- **Framework**: Next.js 15.0 (App Router)
- **Language**: TypeScript 5.0+
- **UI Library**: React 19.0
- **Styling**: Tailwind CSS 3.4
- **Component Library**: Radix UI + shadcn/ui
- **Icons**: Lucide React

### Backend & AI

- **AI Engine**: Google Gemini 2.5 Flash
- **AI Framework**: Genkit
- **Schema Validation**: Zod

### Development Tools

- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git

---

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.0 이상
- npm 9.0 이상
- Git

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/yourusername/closet-canvas.git
cd closet-canvas

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에서 필요한 값 설정 (Google AI API 키 등)

# 4. 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# Firebase 배포 (선택사항)
firebase deploy
```

---

## 📁 프로젝트 구조

```
closet-canvas/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   └── style-quiz/
│   │       ├── page.tsx         # Quiz page
│   │       └── result/
│   │           └── page.tsx     # Result page
│   │
│   ├── components/               # React Components
│   │   ├── style-quiz.tsx       # Main quiz component
│   │   └── ui/                  # shadcn/ui components (34개)
│   │
│   ├── data/                     # Static Data
│   │   └── quiz-data.ts         # Quiz options & types
│   │
│   ├── hooks/                    # Custom Hooks
│   │   ├── use-toast.ts         # Toast notification hook
│   │   └── use-mobile.tsx       # Mobile detection hook
│   │
│   ├── lib/                      # Utilities
│   │   ├── utils.ts             # cn() helper
│   │   ├── placeholder-images.ts
│   │   └── placeholder-images.json
│   │
│   └── ai/                       # AI Integration
│       ├── genkit.ts            # Genkit setup
│       ├── dev.ts               # Dev entry point
│       └── flows/
│           ├── find-similar-clothing-items.ts
│           └── outfit-suggestion-from-wishlist.ts
│
├── docs/                         # Documentation
│   ├── USER_WORKFLOW.md         # UX scenarios
│   ├── COMPONENT_ARCHITECTURE.md # Component structure
│   └── CODE_QUALITY.md          # Quality assessment
│
├── public/                       # Static assets
├── tailwind.config.ts           # Tailwind config
├── next.config.ts               # Next.js config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

### 주요 디렉토리 설명

- **`src/app/`**: Next.js 페이지 라우트 (3개 페이지)
- **`src/components/`**: 재사용 가능한 컴포넌트 (35개)
- **`src/data/`**: 퀴즈 데이터 중앙 관리 (리팩토링으로 분리)
- **`src/ai/`**: AI 통합 로직 (Gemini API)
- **`docs/`**: 프로젝트 문서 (워크플로우, 아키텍처, 품질 평가)

---

## 🎭 사용자 워크플로우

### 전체 여정

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  랜딩    │      │  퀴즈    │      │  스타일  │      │   결과   │
│  페이지  │ ───> │  시작    │ ───> │   선택   │ ───> │   분석   │
│    /     │      │/style-   │      │ 3단계    │      │ /result  │
│          │      │  quiz    │      │          │      │          │
└──────────┘      └──────────┘      └──────────┘      └──────────┘
```

### 예상 소요 시간

- 랜딩 페이지: 10-30초
- 퀴즈 완료: 2-4분
- 결과 확인: 40-90초

**전체 플로우:** 약 3-6분

자세한 내용은 [USER_WORKFLOW.md](docs/USER_WORKFLOW.md) 참조

---

## 📚 문서

### 개발 문서

- **[User Workflow](docs/USER_WORKFLOW.md)**: UX 핵심 시나리오 및 사용자 여정
- **[Component Architecture](docs/COMPONENT_ARCHITECTURE.md)**: 컴포넌트 구조 및 의존성 분석
- **[Code Quality](docs/CODE_QUALITY.md)**: 코드 품질 평가 및 개선 방향

### 코드 주석

주요 파일에 JSDoc 스타일의 상세한 docstring이 포함되어 있습니다:
- `src/components/style-quiz.tsx` - 메인 퀴즈 컴포넌트
- `src/data/quiz-data.ts` - 데이터 구조 및 타입
- `src/lib/utils.ts` - 유틸리티 함수

---

## 📊 코드 품질

### 종합 평가: **B등급 (3.4 / 5.0)**

| 항목 | 점수 | 등급 |
|------|------|------|
| 가독성 | 3.0 / 5.0 | ⭐⭐⭐☆☆ |
| 재사용성 | 4.0 / 5.0 | ⭐⭐⭐⭐☆ |
| 유지보수성 | 3.0 / 5.0 | ⭐⭐⭐☆☆ |
| 성능 | 3.5 / 5.0 | ⭐⭐⭐⭐☆ |
| 안정성 | 4.0 / 5.0 | ⭐⭐⭐⭐☆ |

### 주요 강점

- ✅ TypeScript 전면 사용 (100%)
- ✅ 일관된 디자인 시스템 (shadcn/ui)
- ✅ 데이터-UI 분리 (리팩토링 완료)
- ✅ 명확한 파일/폴더 구조

### 개선 영역

- ⚠️ StyleQuiz 컴포넌트 분해 필요 (229 lines)
- ⚠️ 테스트 코드 부재 (0% coverage)
- ⚠️ 미사용 컴포넌트 정리 (83%)

자세한 분석은 [CODE_QUALITY.md](docs/CODE_QUALITY.md) 참조

---

## 🗺️ 로드맵

### ✅ Phase 1: 프로토타이핑 (완료)

- [x] 랜딩 페이지 구현
- [x] 스타일 퀴즈 5단계 플로우
- [x] 결과 페이지 (시뮬레이션)
- [x] 데이터 중앙화 리팩토링
- [x] 문서화 (워크플로우, 아키텍처, 품질 평가)

### 🔄 Phase 2: 리팩토링 (현재)

- [ ] StyleQuiz 컴포넌트 분해
- [ ] 타입 시스템 강화
- [ ] 에러 처리 추가
- [ ] 미사용 코드 정리

### 🚀 Phase 3: AI 통합 (다음)

- [ ] Gemini API 실제 연동
- [ ] 스타일 분석 고도화
- [ ] 의류 추천 기능
- [ ] 위시리스트 관리

### 🎨 Phase 4: 기능 확장

- [ ] 결과 저장 (로컬 스토리지)
- [ ] 소셜 공유 기능
- [ ] 다국어 지원 (i18n)
- [ ] 개인화 대시보드

### 🔬 Phase 5: 품질 향상

- [ ] 테스트 코드 작성 (60% coverage 목표)
- [ ] 성능 최적화
- [ ] 접근성 개선 (WCAG 2.1 AA)
- [ ] PWA 지원

---

## 🤝 기여하기

### 기여 방법

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 코딩 컨벤션

- TypeScript 사용 필수
- ESLint + Prettier 규칙 준수
- Docstring 주석 작성
- 컴포넌트는 함수형으로 작성
- Tailwind CSS 사용 (inline styles 금지)

### 커밋 메시지 규칙

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 기타 변경사항
```

---

## 📄 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 팀

**Closet Canvas Development Team**

- Project Lead: [Your Name]
- UI/UX Design: [Designer Name]
- Backend/AI: [Developer Name]

---

## 🙏 감사의 말

- [Next.js](https://nextjs.org/) - React Framework
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Radix UI](https://www.radix-ui.com/) - Accessible Primitives
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Lucide](https://lucide.dev/) - Icons
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI Engine

---

## 📞 문의

프로젝트 관련 문의사항이 있으시면 아래로 연락 주세요:

- Email: contact@closetcanvas.com
- GitHub Issues: [이슈 트래커](https://github.com/yourusername/closet-canvas/issues)

---

<div align="center">

**Made with ❤️ by Closet Canvas Team**

[Website](https://closetcanvas.com) · [Documentation](docs/) · [Report Bug](issues/) · [Request Feature](issues/)

</div>
