---
name: closeflow-ui-designer
description: Use for CloseFlow UI/UX audits and refactors, especially shared visual styles, metric tiles, entity detail action placement, icons, destructive/delete actions, duplicated UI cleanup, responsive polish, and design-system consistency. Do not use for backend logic, auth, billing, Supabase, RLS, AI safety, database schema, or product workflow changes unless explicitly requested.
---

# CloseFlow UI Designer Skill

## Mission

Improve CloseFlow UI consistency without breaking product logic, persistence, routes, tests, billing truth, AI safety, or existing business workflows.

This skill is for UI structure, layout, shared component reuse, visual consistency, duplicated UI cleanup, responsive behavior, Polish copy clarity, icon/action consistency, and design-system alignment.

## Non-negotiable rules

1. Do not change business logic unless the task explicitly requires it.
2. Do not change database schema, Supabase contracts, auth, billing, RLS, AI safety, plan gates, or API behavior.
3. Do not remove existing functionality.
4. Do not fix one screen by copying markup from another screen.
5. Do not create local one-off CSS when a shared component, shared variant, CSS token, or global action contract can solve it.
6. Same function means same logical placement. Example: `Dodaj notatkę` must live in the same logical region for ClientDetail, LeadDetail, and CaseDetail.
7. Same visual meaning means one source of truth. Example: delete/trash/destructive style must be controlled from one contract, not local `text-red-*` classes scattered across pages.
8. Every recurring UI rule should get a cheap static guard/check where possible.
9. Always run the UI map and style map before refactoring visual consistency.
10. Build must pass after changes.

## Required first steps before any UI refactor

Run:

```bash
npm run audit:closeflow-ui-map
npm run audit:closeflow-style-map
npm run check:closeflow-ui-skill-pack
npm run check:closeflow-ui-premap-contract
```

Read:

- `docs/ui/CLOSEFLOW_UI_PREMAP_2026-05-08.md`
- `docs/ui/CLOSEFLOW_UI_MAP.generated.md`
- `docs/ui/CLOSEFLOW_STYLE_MAP.generated.md`
- `.agents/skills/closeflow-ui-designer/references/current-repo-premap-2026-05-08.md`
- `.agents/skills/closeflow-ui-designer/references/global-style-token-contract.md`
- `.agents/skills/closeflow-ui-designer/references/action-icon-style-map.seed.md`
- `.agents/skills/closeflow-ui-designer/references/entity-detail-action-map.seed.md`

## Source-of-truth priority

Use this order:

1. Shared component / shared helper / shared action primitive.
2. Shared CSS tokens and global style contract.
3. Page composition using shared primitives.
4. Page-specific CSS only when unavoidable and documented.

## Known current source-of-truth candidates

- Metric tiles: `src/components/StatShortcutCard.tsx`.
- Metric tile style: `src/styles/closeflow-metric-tiles.css`.
- Base button variants: `src/components/ui/button.tsx`.
- Confirm destructive semantics: `src/components/confirm-dialog.tsx`.

## Preferred next refactor order

1. Global delete/destructive/trash contract.
2. Metric tile contract hardening.
3. Entity detail action placement contract.
4. Shared action cluster / icon button primitives.
5. Modal and form footer action consistency.
6. Mobile layout parity.

## Acceptance criteria

A UI consistency task is complete only when:

- the correct shared source of truth is used or created,
- duplicated local UI is removed only when it is truly redundant,
- no new local visual system is introduced,
- no product logic is changed accidentally,
- the change includes or updates a guard when it creates a reusable UI rule,
- the relevant checks and build pass,
- the response names the single place where future style changes should be made.
