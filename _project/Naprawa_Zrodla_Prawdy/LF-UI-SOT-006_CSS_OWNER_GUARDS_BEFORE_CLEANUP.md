# LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP

Date: 2026-06-28 19:20 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status

APPLIED_PARTIAL / GUARD_AND_TEST_ADDED / PACKAGE_SCRIPT_PENDING / LOCAL_VERIFY_PENDING / NO_UI_CSS_CLEANUP

## Cel

Zamienic audyt SOT-005 w techniczne guardy przed cleanupem CSS.

To nie jest etap czyszczenia CSS. To jest etap blokad ochronnych przed nastepnymi zmianami.

## Czego nie dotknieto

- UI runtime: NOT_TOUCHED
- CSS contents: NOT_TOUCHED
- CSS import order: NOT_TOUCHED
- Layout visual behavior: NOT_TOUCHED
- SQL/API/Supabase/Firebase: NOT_TOUCHED
- APP_STYLES_IMPORT_MAX: NOT_TOUCHED
- hotfix/stage CSS: NOT_DELETED

## Pliki dodane

- scripts/check-lf-ui-sot-006-css-owner-guards-before-cleanup.cjs
- tests/lf-ui-sot-006-css-owner-guards-before-cleanup.test.cjs
- _project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP.md
- _project/runs/LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP.md
- _project/obsidian_updates/2026-06-28_LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP.md

## Wymagany lokalny follow-up

package.json musi dostac wpis w scripts:

guard:ui:css-owner-before-cleanup = node scripts/check-lf-ui-sot-006-css-owner-guards-before-cleanup.cjs

Nie nadpisano package.json przez connector, bo pelny plik byl zwracany w odpowiedzi obcietej i nadpisanie byloby ryzykowne.

## Guardy dodane w SOT-006

Guard sprawdza:

1. Route owner dictionary dla routes z src/lib/routes.ts.
2. App.tsx CSS baseline: aktywne importy CSS = 45.
3. Disabled legacy CSS import baseline = 1.
4. APP_STYLES_IMPORT_MAX = 45 w scripts/check-ui-patch-layers.cjs.
5. CSS owner dictionary dla 45 globalnych CSS importow.
6. Brak aktywnego statusu dla hotfix/stage/fix CSS bez merge/delete guard.
7. Search cleanup blocked until owner confirmed.
8. Modal owner guard.
9. Right rail owner guard.
10. Density/runtime guard z runtime scroll/scale w Layout.tsx.
11. DEV preview routes jako DEV_PREVIEW_NOT_PRODUCTION_SOT.

## Route owner dictionary summary

Guard obejmuje routes z SOT-005 plus /dashboard jako legacy route z src/lib/routes.ts.

/dashboard nie jest produkcyjnym source-of-truth.

## CSS owner dictionary summary

Guard obejmuje wszystkie 45 aktywnych globalnych importow z src/App.tsx.

Statusy ownerow:

- ACTIVE_OWNER
- TOKEN_OWNER
- HOTFIX_TO_MERGE_LATER
- DELETE_AFTER_GUARD
- DO_NOT_TOUCH_YET
- DO_POTWIERDZENIA

Search layers maja status DO_POTWIERDZENIA i sa blokowane przed cleanupem.

## Ryzyka

Najwieksze ryzyka:

- modal stack
- search layers
- right rail
- Layout density/runtime scroll/scale
- CaseDetail finance modal
- cards/list density split
- DEV preview jako falszywe zrodlo prawdy

## Decyzja

SOT-006 nie jest cleanupem. Nie usuwac ani nie scalac CSS po tym commicie automatycznie.

Nastepny mozliwy etap dopiero po package script i lokalnych testach:

- LF-UI-SOT-007_FIRST_SAFE_CSS_MERGE_CANDIDATE
- albo osobne owner closeout dla search/modal/right rail/density runtime
