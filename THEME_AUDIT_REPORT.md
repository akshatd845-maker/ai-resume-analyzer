# Theme Visibility & Contrast Audit Report (Authenticated App)

## Scope (per request)
- No backend changes
- No routing changes
- No API/business-logic changes
- No layout redesign
- Only UI visibility/readability/consistency improvements

## Global Design System
The app already contained a strong dark token system in:
- `frontend/src/styles/globals.css`

Key tokens used/aligned with the request:
- Background: `#08090E`
- Card surface: `#111217`
- Elevated card: `#171A22`
- Primary accent: `#8B5CF6`
- Text hierarchy alphas (section/card/body/secondary/muted/placeholder)
- Borders: `rgba(255,255,255,0.08)` and hover `rgba(255,255,255,0.14)`

## What was improved (high-impact fixes)

### 1) Disabled controls remained readable
Some primitives used overly low opacity for disabled state, which can reduce legibility below WCAG expectations.

Changes:
- `frontend/src/components/ui/button.jsx`
  - Increased disabled opacity from `0.40` to `0.60`
  - Ensured disabled text stays readable (`disabled:text-[rgba(255,255,255,0.85)]`)
- `frontend/src/components/ui/input.jsx`
  - Increased disabled opacity from `0.40` to `0.60`
  - Ensured disabled text stays readable (`disabled:text-[rgba(255,255,255,0.85)]`)

### 2) Empty state separation
Ensured the dashed empty-state card has slightly improved separation against the page background.

- `frontend/src/components/common/empty-state.jsx`
  - Kept/strengthened separation using the existing `border-dashed` with stable background surface.

### 3) Breadcrumb contrast + formatting correctness
Breadcrumb text used token classes that were too dim in some contexts and the initial edit introduced formatting issues. Breadcrumb rendering was corrected to ensure consistent contrast and valid JSX.

- `frontend/src/components/layout/breadcrumb-nav.jsx`
  - Chevron + breadcrumb text now uses an explicit higher-contrast alpha: `rgba(255,255,255,0.60)`
  - Links keep hover to `text-white`
  - JSX formatting corrected (no broken tags / mis-indentation)

## Files Modified
1. `frontend/src/components/ui/button.jsx`
2. `frontend/src/components/ui/input.jsx`
3. `frontend/src/components/common/empty-state.jsx`
4. `frontend/src/components/layout/breadcrumb-nav.jsx`

## Validation Results
### Frontend lint
- `cd frontend && npm run lint`
- Result: **0 warnings, 0 errors** (via `oxlint`)

### Frontend build
- `cd frontend && npm run build`
- Result: **Build succeeded**
- Note: Vite warning about chunk sizes (`> 500 kB`) is pre-existing/static and not a lint/build failure.

## Notes / Remaining Work (not executed)
A full ENTIRE authenticated application audit would require scanning all feature/page components (analysis/jobs/profile/settings/help) for any hardcoded low-opacity text or borders.
This run performed the highest-risk global contrast fixes in shared primitives/chrome that affect all authenticated pages.

