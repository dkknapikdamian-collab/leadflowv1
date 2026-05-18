# 2026-05-18 - Stage119 V3 release gate guard false positive repair

## Scan-first confirmation

- Repo: `dkknapikdamian-collab/leadflowv1`
- Branch: `dev-rollout-freeze`
- Obsidian vault: `C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT`
- Read/required sources: `AGENTS.md`, `_project/00_PROJECT_MEMORY_PROTOCOL.md`, `_project/07_NEXT_STEPS.md`, CloseFlow Obsidian dashboard, `scripts/closeflow-release-check-quiet.cjs`, `tests/stage98-polish-mojibake-calendar-guard.test.cjs`, `tests/stage119-calendar-release-gate-trust.test.cjs`, `package.json`.

## FAKTY Z KODU / PLIKOW

- Stage119 V2 failed inside its own guard after Stage98 passed.
- Failure reason: global raw count of `tests/stage98-polish-mojibake-calendar-guard.test.cjs` returned 3 instead of 2.
- Stage119 V3 repairs the guard to check preflight block and `requiredTests` separately.
- Stage119 V3 also normalizes `scripts/closeflow-release-check-quiet.cjs` to one Stage119 preflight before production build.

## DECYZJE DAMIANA

- Work stays on `dev-rollout-freeze`.
- ZIP plus one PowerShell command is the expected delivery mode.
- Obsidian must be updated.

## HIPOTEZY / PROPOZYCJE AI

- This was a guard false-positive, not a product-runtime calendar bug.

## DO POTWIERDZENIA

- Manual `/calendar` QA after green gate remains required.

## TESTY AUTOMATYCZNE

- `node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs`
- `node --test tests/stage119-calendar-release-gate-trust.test.cjs`
- `npm run verify:closeflow:quiet` unless explicitly skipped.

## TESTY RECZNE

- TEST RECZNY DO WYKONANIA: `/calendar` hard refresh, week, month, selected day, create/edit modals, +1H, +1D, +1W, Zrobione, Usun.

## BRAKI I RYZYKA

- Stage119 V3 does not claim runtime calendar UI is fixed.
- If quiet gate fails after V3, handle the reported failure as the next concrete blocker.

## WPLYW NA OBSIDIANA

- Adds Stage119 V3 note to `10_PROJEKTY/CloseFlow_Lead_App/`.
- Appends Stage119 V3 block to CloseFlow dashboard if absent.

## GIT / ZIP STATUS

- ZIP repair package. With `-DoPush`, app repo and Obsidian repo are selectively committed and pushed after tests.