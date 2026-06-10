# STAGE231B0-R15-R2 — ClientDetail shared canvas width trial

Status: LOCAL_TRIAL_ONLY / NO_GUARD_YET / NO_PUSH

## Fix after failed R15
R15 failed because the patcher used Python-style `.strip()` in JavaScript. R15-R2 uses JS `.trim()`.

## Finding from audit
R14 marker was attached to nested `ClientMultiContactField`, not the actual route wrapper. The loaded ClientDetail route root is `main.client-detail-vnext-page`, followed by `.client-detail-header` and `.client-detail-shell`.

## Shared source of truth
R15-R2 creates/uses a shared page canvas contract:
- `cf-page-canvas`
- `cf-page-canvas--full`
- `data-cf-page-canvas="full"`
- CSS variables in `closeflow-unified-page-canvas-stage211c.css`

## Trial scope
- No guard.
- No commit.
- No push.
- User must visually confirm width first.

## Manual checks
1. ClientDetail starts at the same left content edge as Clients/Today.
2. ClientDetail stretches to the right available edge.
3. Scroll does not shift horizontal spacing.
4. Right blank gap from previous screenshot is gone.

## Finalize for push
- Existing build passed in local apply.
- Added final R15-R2 guard and node test.
- Removed obsolete R14 guard/test/run/Obsidian update because R14 targeted the wrong DOM node.
- Push is allowed only after guard/test/build pass.
