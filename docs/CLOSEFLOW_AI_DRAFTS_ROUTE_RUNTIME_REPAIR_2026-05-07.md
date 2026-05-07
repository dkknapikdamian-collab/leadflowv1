# CloseFlow AI drafts route runtime repair - 2026-05-07

## Problem

Production route `/ai-drafts` failed with two runtime errors:

- `ReferenceError: MetricCard is not defined`,
- `AI_DRAFT_SUPABASE_REQUIRED_USE_ASYNC`.

## Cause

- `AiDrafts.tsx` still rendered legacy `MetricCard` JSX while the route imports and uses the shared `StatShortcutCard` component. Build did not catch this because the legacy symbol was emitted into the bundle and failed at runtime.
- `QuickAiCapture`, mounted from the global layout, used synchronous `saveAiLeadDraft()`. In production this helper deliberately throws and requires the async Supabase path.

## Fix

- Adds a compatibility alias: `const MetricCard = StatShortcutCard;`. This keeps the route stable without changing visual layout.
- Switches `QuickAiCapture` to `saveAiLeadDraftAsync()`, awaits Supabase save, and shows an explicit error if saving fails.
- Adds guard: `scripts/check-ai-drafts-route-runtime-repair.cjs`.

## Verification

```powershell
node scripts/check-ai-drafts-route-runtime-repair.cjs
npm run build
```
