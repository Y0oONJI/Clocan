# CFG-003: Pre-commit Hooks 설정

## 📌 Issue Title
`Set up Husky and lint-staged for pre-commit quality checks`

## 🎯 Goal
커밋 전에 자동으로 코드 품질을 검증하여, 문제가 있는 코드가 저장소에 추가되는 것을 방지합니다.

## 📋 Background
현재 수동으로 lint, typecheck를 실행해야 하며, 잊어버리면 문제있는 코드가 커밋될 수 있습니다. pre-commit hooks로 자동화가 필요합니다.

## 📂 Modified Files (Expected)
- `.husky/pre-commit` (신규 생성)
- `.husky/commit-msg` (신규 생성)
- `.lintstagedrc.js` (신규 생성)
- `package.json` (scripts, devDependencies 추가)

## ✅ Acceptance Criteria

### Must Have
- [ ] Husky 설치 및 설정
  - pre-commit hook
  - commit-msg hook (optional)
- [ ] lint-staged 설정
  - 변경된 파일만 lint
  - 자동 포맷팅 (Prettier)
  - TypeScript 체크
- [ ] Commitlint 설정 (optional)
  - Conventional Commits 규칙
  - 커밋 메시지 검증
- [ ] 팀원 온보딩 문서
  - hooks 설치 방법
  - 우회 방법 (긴급 시)

### Nice to Have
- [ ] 커밋 메시지 템플릿
- [ ] 자동 코드 포맷팅 (Prettier)
- [ ] 이미지 최적화 자동 실행
- [ ] 번들 크기 체크

## 💡 Implementation Details

### Step 1: Dependencies 설치
```bash
npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional
```

### Step 2: Husky 초기화
```bash
npx husky install
npm pkg set scripts.prepare="husky install"
```

### Step 3: Pre-commit Hook 생성
```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### Step 4: lint-staged 설정
```javascript
// .lintstagedrc.js
module.exports = {
  // TypeScript/JavaScript 파일
  '*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  
  // TypeScript 타입 체크 (전체)
  '*.{ts,tsx}': () => 'tsc --noEmit',
  
  // JSON, Markdown 파일
  '*.{json,md}': [
    'prettier --write',
  ],
  
  // CSS 파일
  '*.css': [
    'prettier --write',
  ],
};
```

### Step 5: Commitlint 설정
```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 새로운 기능
        'fix',      // 버그 수정
        'docs',     // 문서 수정
        'style',    // 코드 포맷팅
        'refactor', // 리팩토링
        'test',     // 테스트 추가
        'chore',    // 기타 변경
        'perf',     // 성능 개선
        'ci',       // CI 설정
      ],
    ],
    'subject-case': [0], // 제목 케이스 제한 없음
  },
};
```

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit ${1}
```

### Step 6: package.json 스크립트
```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,md}\"",
    "typecheck": "tsc --noEmit"
  }
}
```

### Step 7: Prettier 설정
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

```
# .prettierignore
node_modules
.next
out
build
coverage
*.log
.env*
!.env.example
```

### Step 8: README에 안내 추가
```markdown
## 개발 시작하기

### 1. 저장소 클론
\`\`\`bash
git clone https://github.com/username/closet-canvas.git
cd closet-canvas
\`\`\`

### 2. 의존성 설치 및 Git Hooks 설정
\`\`\`bash
npm install  # husky hooks 자동 설치됨
\`\`\`

### 3. 환경 변수 설정
\`\`\`bash
cp .env.example .env.local
# .env.local 파일을 열어서 실제 값 입력
\`\`\`

### Pre-commit Hooks
커밋 전에 자동으로 다음이 실행됩니다:
- ESLint (자동 수정)
- Prettier (자동 포맷팅)
- TypeScript 타입 체크

긴급 상황에서 우회하려면:
\`\`\`bash
git commit --no-verify -m "urgent fix"
\`\`\`
(권장하지 않음!)
```

## 🧪 Testing Checklist
- [ ] 코드 수정 후 커밋 시 자동으로 lint 실행됨
- [ ] Lint 에러가 있으면 커밋 실패
- [ ] TypeScript 에러가 있으면 커밋 실패
- [ ] 잘못된 커밋 메시지 형식 시 실패 (commitlint)
- [ ] `--no-verify` 플래그로 우회 가능

## 📊 Impact
- **코드 품질**: ⬆️⬆️⬆️ 자동 검증으로 일관성 유지
- **개발자 경험**: ⬆️⬆️ 수동 체크 불필요
- **협업**: ⬆️⬆️ 팀원 간 코드 스타일 통일
- **버그 감소**: ⬆️⬆️ 문제 조기 발견

## 🏷️ Labels
`tooling`, `automation`, `dx`, `infrastructure`, `medium-priority`

## 📅 Estimated Time
**1-2 hours**

## 🔗 Related Issues
- CFG-002 (CI/CD 파이프라인과 함께 사용)

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** Medium


