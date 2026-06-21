# STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE

Date/time: 2026-06-21 00:00 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

TECH_APPLIED_PENDING_OWNER_SMOKE / DO_NOT_START_STAGE232K_BEFORE_SMOKE_AND_PUSH

Push script may be run only after Damian confirms manual smoke OK.

## MAPA R16 / R16Z PRZED ZMIANA

- R16O guard/test were historical and still required obsolete wide layout: xl:w-[1100px] and data-missing-item-title-block.
- R16Z_R4 is the accepted visual source truth for the current manager: 760px, flex row, no clipping, readable Blokuje chip, visible Uzupełnij and Usuń.
- ClientDetail renders the shared MissingItemsManagerDialog using open={clientMissingListOpenStage232I6}, scopeLabel="Klient" and stage232i2AllActiveMissingItems adapter.
- ClientDetail quick add is separate: Dodaj brak opens MissingItemQuickActionModal and keeps all-missing manager closed after save.
- LeadDetail renders the same MissingItemsManagerDialog using open={leadMissingManagerOpen}, scopeLabel="Lead" and leadMissingManagerItemsStage232I4R14.
- Old local client dialog class client-detail-missing-window-dialog-simple must remain absent.

## Guard consolidation decision

R16Z_R4 is the newer source of truth for final visual fit. R16O is not deleted, because it still protects important shared-manager wiring. Instead it is consolidated so it checks the final R16Z_R4 contract and no longer requires xl:w-[1100px].

## Technical changes

- Updated: scripts/check-stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.cjs
- Updated: tests/stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.test.cjs
- Added: scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs
- Added: tests/stage232i4-r16z-r5-missing-manager-close-guard-consolidation.test.cjs
- Added R16Z_R5 marker to MissingItemsManagerDialog only; no runtime logic change.
- Updated repo-local CODEX/context/stage/test/risk files.

## Manual smoke klient

1. Open ClientDetail.
2. Click Dodaj brak.
3. Add: test klient r16z.
4. After save, the all-missing manager does not open automatically.
5. Braki/Blokady tile shows active missing item.
6. Click Zobacz wszystkie braki.
7. Shared manager opens.
8. Row shows the title.
9. Row does not clip text/actions.
10. Blokuje is readable.
11. Toggle checkbox.
12. Main tile changes blocker state.
13. Click Uzupełnij.
14. Missing item leaves active list.
15. F5: resolved item does not return.
16. Add second missing item.
17. Click Usuń.
18. F5: deleted item does not return.

## Manual smoke lead

1. Open LeadDetail.
2. Click Zobacz wszystkie braki.
3. Shared manager opens.
4. Missing title is visible.
5. Blokuje is readable.
6. Uzupełnij works.
7. Usuń works.
8. F5 does not restore deleted/resolved missing item.

## Regression checks

- CaseDetail Braki/Blokady not touched.
- Owner Control runtime not touched.
- Activity timeline not touched.
- No SQL.
- No finance.
- No Google Calendar.
- No billing/trial.

## Commands

- node scripts/check-stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.cjs
- node --test tests/stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.test.cjs
- node scripts/check-stage232i4-r16z-r4-missing-manager-final-visual-fit-no-zip.cjs
- node --test tests/stage232i4-r16z-r4-missing-manager-final-visual-fit-no-zip.test.cjs
- node scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs
- node --test tests/stage232i4-r16z-r5-missing-manager-close-guard-consolidation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## Risk audit after implementation

- Main risk removed: a future developer could run old R16O and try to revert R16Z_R4 because of obsolete 1100px requirement.
- Remaining risk: owner manual smoke is still required. Do not mark product CLOSED if smoke is not performed.
- Remaining risk: untracked local backup folders may still make git status noisy; do not use git add .
- Remaining risk: Obsidian central files are not directly updated by this app package; use the obsidian_updates payload.

## Next

- If R16Z_R5 smoke OK and push PASS: STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH may be considered next.
- If Owner Control I3 smoke remains open: close I3 status-sync before business/product stage.
