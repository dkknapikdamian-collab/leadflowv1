# STAGE232I4_R13G_CLIENT_DETAIL_MISSING_INLINE_TO_SHARED_VISUAL_SOURCE

Date: 2026-06-19 17:05 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Status

ZIP_READY / NOT_APPLIED_YET

## Problem

R12 added a shared modal shell, but live DOM proved that ClientDetail still renders an inline `Braki / Blokady` modal through the older R13F/simple layer:

- `client-detail-missing-window-dialog-simple`
- `client-detail-missing-window-list-simple`
- `client-detail-missing-window-row-simple`
- `data-stage232i4-r13f-simple-*`

That layer lays the row out as a flat grid: title + blocker checkbox + done + delete in one row. This is why the live modal kept looking cramped despite R12 being deployed.

## Scope

- Refactor ClientDetail inline missing list modal row to a title-first card contract.
- Remove the R13F/simple row/list/dialog runtime classes from ClientDetail.
- Replace the R13F/simple CSS block with R13G card layout CSS.
- Add guard/test against the old flat row returning.

## Not touched

- Backend
- SQL / migrations / RLS
- api/work-items.ts
- R8/R9 source truth
- Google Calendar
- Billing/trial

## Required checks

```powershell
node scripts/check-stage232i4-r13g-client-detail-missing-inline-to-shared-visual-source.cjs
node --test tests/stage232i4-r13g-client-detail-missing-inline-to-shared-visual-source.test.cjs
node scripts/check-stage232i4-r12-shared-modal-visual-source-truth.cjs
node --test tests/stage232i4-r12-shared-modal-visual-source-truth.test.cjs
node scripts/check-stage232i4-r14-client-lead-missing-tile-modal-parity.cjs
node --test tests/stage232i4-r14-client-lead-missing-tile-modal-parity.test.cjs
node scripts/check-stage232i4-r14-r6-runtime-smoke-fix.cjs
node scripts/check-stage232i4-r9-work-items-status-domain-safe.cjs
node --test tests/stage232i4-r9-work-items-status-domain-safe.test.cjs
node scripts/check-stage232i4-r8-work-items-api-missing-source-truth.cjs
node --test tests/stage232i4-r8-work-items-api-missing-source-truth.test.cjs
npm run build
git diff --check
```

## Manual smoke after push

- ClientDetail -> Braki / Blokady
- Missing item row must show title first.
- Blocker checkbox must be below the title.
- Uzupełnione / Usuń must be in a separate actions row.
- Add 2-3 items, verify separate cards.
- Resolve/delete must still act on the source item.
