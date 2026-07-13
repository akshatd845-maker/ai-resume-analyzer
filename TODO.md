# TODO

## Theme Visibility & Contrast Audit (Authenticated App)

### Planned scope
- Do NOT change routing, backend, APIs, business logic.
- Only adjust shared dark UI design system + visibility/contrast.

### Steps tracking
- [x] Read global tokens + shared primitives (globals.css, Button/Card/Input/Badge/Progress/Skeleton/EmptyState/StatCard)
- [x] Read authenticated chrome (AppLayout, Sidebar, TopNav, UserMenu, BreadcrumbNav)
- [x] Apply contrast fixes for disabled UI states
  - [x] Update `frontend/src/components/ui/button.jsx` disabled styling
  - [x] Update `frontend/src/components/ui/input.jsx` disabled styling
- [x] Improve empty state border separation
  - [x] Update `frontend/src/components/common/empty-state.jsx` border color/contrast
- [x] Fix BreadcrumbNav text classes (ensure correct JSX formatting + contrast)

- [ ] Run validation
  - [ ] `npm run lint`
  - [ ] `npm run build`
- [ ] Compile final report: modified files + visibility improvements + validation results

