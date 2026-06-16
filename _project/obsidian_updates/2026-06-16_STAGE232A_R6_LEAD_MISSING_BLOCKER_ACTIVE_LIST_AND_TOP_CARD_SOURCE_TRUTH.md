# STAGE232A_R6_LEAD_MISSING_BLOCKER_ACTIVE_LIST_AND_TOP_CARD_SOURCE_TRUTH

- data i godzina: 2026-06-16 04:08 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: PASS_LOCAL_DO_SPRAWDZENIA
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Cel
Domkniecie STAGE232A: aktywne Braki i Blokady w LeadDetail maja miec jedno zrodlo prawdy.

## Zakres
- Aktywne Braki: linkedTasks/workItems.
- Blokady: subset po explicit blocksProgress/status block.
- Historia: tylko dziennik, nie aktywne zrodlo prawdy.
- Top card Blokada: nie zgaduje po tytule.

## Testy
- guard R6
- node test R6
- build
- verify:closeflow:quiet
- manual hard refresh smoke

## Ryzyka
- metadata persistence po hard refresh;
- no-flicker vs backend truth;
- duplikacja UI;
- przypadkowy powrot title inference.


## 2026-06-16 04:20 Europe/Warsaw - STAGE232A_R6_R3_CF_RUNTIME_SCOPE_GUARD_COMPAT

Status: PASS_LOCAL_DO_SPRAWDZENIA

Korekta:
- R6-R2 przeszedl patch, guard R6, test R6 i build.
- verify:closeflow:quiet zatrzymal sie na CF-RUNTIME-00 source truth guard, bo stary guard blokowal pliki R6 jako out-of-scope.
- R6-R3 rozszerza allowlist CF-RUNTIME scope guarda o jawne pliki R6.
- To nie zmienia logiki LeadDetail/ContextActionDialogs; to kompatybilnosc guardow po zamknietym CF-RUNTIME-00.

Testy:
- node scripts/check-stage232a-r6-lead-missing-active-source.cjs
- node --test tests/stage232a-r6-lead-missing-active-source.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
- git diff --check
