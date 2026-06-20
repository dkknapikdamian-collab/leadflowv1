# STAGE232I4_R16O_CLIENT_SHARED_MISSING_MANAGER_NO_MARKER_ANCHOR_FINAL

Date/time: 2026-06-20 01:20 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Why R16O exists

R16C-R16N failed because helper packages relied on brittle anchors, stale assumptions, wrapper bugs, or ZIP naming mistakes. R16O removes the fragile R14/R6 marker dependency and patches the active client missing dialog by actual structure.

## Scope

- Restore only target source files from HEAD before patching:
  - src/pages/ClientDetail.tsx
  - src/components/detail/MissingItemsManagerDialog.tsx
- Remove failed local R16C-R16N source-of-truth artifacts.
- Replace active local ClientDetail missing dialog with shared MissingItemsManagerDialog.
- Keep quick add path separate.
- Add inline manager item adapter from stage232i2AllActiveMissingItems.
- Add robust title fallbacks from item/raw/payload fields.
- Add targeted R16 tile marker without depending on R14/R6 marker anchor.
- Make shared manager wide/readable.

## Not touched

- SQL / RLS
- Owner Control I3
- Finance / commission logic
- Google Calendar
- Billing / trial
- CaseDetail runtime

## Required checks

```powershell
node scripts/check-stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.cjs
node --test tests/stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## Manual smoke

Client:
1. Open ClientDetail.
2. Click Dodaj brak.
3. Add `test klient r16o`.
4. Manager must not open automatically.
5. Click Zobacz wszystkie braki.
6. Shared wide manager opens.
7. Row title is visible.
8. Checkbox, Uzupełnione, Usuń are visible.
9. Resolve item and refresh.
10. Resolved item does not return.

Lead:
1. Open LeadDetail with missing item.
2. Zobacz wszystkie braki opens the same shared manager.

## Risk audit

If missing item disappears or returns incorrectly after F5, next bug class is fetch/persist/normalize, not modal UI.
