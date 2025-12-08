# CFG-002: CI/CD 파이프라인 구축

## 📌 Issue Title
`Set up GitHub Actions for CI/CD pipeline`

## 🎯 Goal
GitHub Actions를 사용하여 자동화된 CI/CD 파이프라인을 구축하고, 코드 품질을 자동으로 검증합니다.

## 📋 Background
현재 수동으로 테스트, 린트, 빌드를 실행하고 있으며, 자동화된 검증 프로세스가 없습니다. PR 및 배포 전에 자동으로 품질을 검증하는 파이프라인이 필요합니다.

## 📂 Modified Files (Expected)
- `.github/workflows/ci.yml` (신규 생성)
- `.github/workflows/deploy.yml` (신규 생성)
- `package.json` (scripts 추가)

## ✅ Acceptance Criteria

### Must Have
- [ ] CI 워크플로우 구현
  - PR 생성/업데이트 시 자동 실행
  - Lint 체크 (ESLint)
  - 타입 체크 (TypeScript)
  - 테스트 실행 (Jest)
  - 빌드 검증 (Next.js)
- [ ] 브랜치 보호 규칙 설정
  - main 브랜치 직접 push 금지
  - PR 필수
  - CI 통과 필수
- [ ] 상태 배지 README에 추가

### Nice to Have
- [ ] 자동 배포 (Firebase/Vercel)
- [ ] 의존성 업데이트 자동화 (Dependabot)
- [ ] 코드 커버리지 리포팅
- [ ] 성능 모니터링

## 💡 Implementation Details

### Step 1: CI 워크플로우 생성
```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript check
        run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          fail_ci_if_error: false

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
        env:
          NODE_ENV: production
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next/
```

### Step 2: Deploy 워크플로우 (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          NODE_ENV: production
          GOOGLE_GENAI_API_KEY: ${{ secrets.GOOGLE_GENAI_API_KEY }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: your-project-id
```

### Step 3: Dependabot 설정
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    reviewers:
      - "your-username"
    labels:
      - "dependencies"
      - "automated"
```

### Step 4: PR Template
```markdown
# .github/pull_request_template.md
## 📝 Description
<!-- Describe your changes -->

## 🔗 Related Issues
<!-- Link to related issues: Closes #123 -->

## ✅ Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Lint checks pass
- [ ] TypeScript checks pass
- [ ] Build succeeds

## 📸 Screenshots (if applicable)
<!-- Add screenshots here -->
```

### Step 5: README 배지 추가
```markdown
# README.md
[![CI](https://github.com/username/repo/workflows/CI/badge.svg)](https://github.com/username/repo/actions)
[![codecov](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)](https://codecov.io/gh/username/repo)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
```

### Step 6: package.json 스크립트
```json
{
  "scripts": {
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "build": "next build",
    "ci": "npm run lint && npm run typecheck && npm run test:ci && npm run build"
  }
}
```

## 🧪 Testing Checklist
- [ ] CI 워크플로우가 PR에서 실행됨
- [ ] Lint 실패 시 CI 실패
- [ ] TypeScript 에러 시 CI 실패
- [ ] 테스트 실패 시 CI 실패
- [ ] 빌드 실패 시 CI 실패
- [ ] 모두 통과 시 green 체크

## 📊 Impact
- **코드 품질**: ⬆️⬆️⬆️ 자동 검증
- **개발 속도**: ⬆️⬆️ 수동 검증 시간 절약
- **안정성**: ⬆️⬆️⬆️ 문제 조기 발견
- **협업**: ⬆️⬆️ 통일된 기준

## 🏷️ Labels
`ci-cd`, `automation`, `infrastructure`, `high-priority`

## 📅 Estimated Time
**2-3 hours**

## 🔗 Related Issues
- CFG-001 (테스트 설정 - 선행 필요)
- Related to Phase 5 in Roadmap

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** High  
**Depends On:** CFG-001

