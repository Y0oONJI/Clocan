# FE-004: 미사용 UI 컴포넌트 정리

## 📌 Issue Title
`Clean up unused shadcn/ui components (28 files)`

## 🎯 Goal
사용되지 않는 28개의 UI 컴포넌트를 archive 브랜치로 이동하여 코드베이스를 정리하고, 번들 크기를 최적화합니다.

## 📋 Background
현재 `src/components/ui/` 폴더에 34개의 컴포넌트가 있지만, 실제로 사용되는 것은 6개뿐입니다 (17.6% 사용률). 나머지 28개(82.4%)는 향후 사용을 위해 준비되어 있으나, 현재는 코드베이스를 복잡하게 만들고 있습니다.

## 📂 Modified Files (Expected)

### 사용 중인 컴포넌트 (유지)
- `src/components/ui/button.tsx` ✅
- `src/components/ui/card.tsx` ✅
- `src/components/ui/progress.tsx` ✅
- `src/components/ui/toast.tsx` ✅
- `src/components/ui/toaster.tsx` ✅
- `src/components/ui/badge.tsx` ✅ (result page)

### 미사용 컴포넌트 (이동 대상 - 28개)
- accordion, alert-dialog, alert, avatar, calendar
- carousel, chart, checkbox, collapsible, dialog
- dropdown-menu, form, input, label, menubar
- popover, radio-group, scroll-area, select, separator
- sheet, sidebar, skeleton, slider, switch
- table, tabs, textarea, tooltip

## ✅ Acceptance Criteria

### Must Have
- [ ] archive/unused-components 브랜치 생성
- [ ] 미사용 컴포넌트 28개를 archive/ 폴더로 이동
- [ ] 사용 중인 컴포넌트 6개는 그대로 유지
- [ ] README에 미사용 컴포넌트 목록 문서화
- [ ] Import 에러가 없는지 확인

### Nice to Have
- [ ] archive/README.md에 복원 방법 안내
- [ ] 각 컴포넌트의 사용 가능 여부 체크리스트
- [ ] 번들 크기 변화 측정
- [ ] 컴포넌트 사용 현황 자동 체크 스크립트

## 💡 Implementation Details

### Step 1: Archive 브랜치 생성
```bash
# archive 브랜치 생성
git checkout -b archive/unused-ui-components

# archive 폴더 구조 생성
mkdir -p archive/components/ui
```

### Step 2: 미사용 컴포넌트 이동
```bash
# 미사용 컴포넌트 목록 생성
UNUSED_COMPONENTS=(
  "accordion"
  "alert-dialog"
  "alert"
  "avatar"
  "calendar"
  "carousel"
  "chart"
  "checkbox"
  "collapsible"
  "dialog"
  "dropdown-menu"
  "form"
  "input"
  "label"
  "menubar"
  "popover"
  "radio-group"
  "scroll-area"
  "select"
  "separator"
  "sheet"
  "sidebar"
  "skeleton"
  "slider"
  "switch"
  "table"
  "tabs"
  "textarea"
  "tooltip"
)

# 컴포넌트 이동
for comp in "${UNUSED_COMPONENTS[@]}"; do
  mv "src/components/ui/${comp}.tsx" "archive/components/ui/"
done
```

### Step 3: README 작성
```markdown
# archive/README.md

## Unused UI Components

이 폴더는 현재 사용되지 않는 shadcn/ui 컴포넌트들을 보관합니다.

### 복원 방법

필요한 컴포넌트가 있다면 다음과 같이 복원할 수 있습니다:

\`\`\`bash
# 예: button 컴포넌트 복원
cp archive/components/ui/button.tsx src/components/ui/
\`\`\`

### 보관된 컴포넌트 목록

- [ ] accordion - Collapsible content sections
- [ ] alert-dialog - Modal dialogs for important messages
- [ ] alert - Alert notifications
...
```

### Step 4: 사용 현황 체크 스크립트 (Optional)
```javascript
// scripts/check-component-usage.js
const fs = require('fs');
const path = require('path');

const components = fs.readdirSync('src/components/ui');
const srcFiles = getAllFiles('src', ['.tsx', '.ts']);

components.forEach(comp => {
  const compName = comp.replace('.tsx', '');
  const imports = srcFiles.filter(file => {
    const content = fs.readFileSync(file, 'utf8');
    return content.includes(`from '@/components/ui/${compName}'`);
  });
  
  console.log(`${compName}: ${imports.length} usages`);
});
```

## 🧪 Testing Checklist
- [ ] 프로젝트 빌드 성공 (`npm run build`)
- [ ] TypeScript 타입 체크 통과 (`npm run typecheck`)
- [ ] Lint 에러 없음 (`npm run lint`)
- [ ] 모든 페이지가 정상 작동
- [ ] Import 에러가 없는지 확인

## 📊 Impact
- **번들 크기**: ⬇️ 예상 10-15% 감소
- **코드베이스 복잡도**: ⬇️⬇️ 파일 수 28개 감소
- **개발자 경험**: ⬆️ 파일 탐색 시 혼란 감소
- **유지보수성**: ⬆️ 관리할 파일 수 감소

## 🏷️ Labels
`cleanup`, `refactor`, `frontend`, `optimization`, `medium-priority`

## 📅 Estimated Time
**1-2 hours**

## 🔗 Related Issues
- Related to #1 (Refactoring Plan - Task 8)

---

**Created:** 2025-12-07  
**Status:** Ready for Development  
**Priority:** Medium

