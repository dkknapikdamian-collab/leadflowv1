# STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH R4 - idempotent repair

Data: 2026-06-15 21:30 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA

## Scan proof
- Repo: dkknapikdamian-collab/leadflowv1
- Branch: dev-rollout-freeze
- Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- Obsidian local direct write: unavailable in chat; payload prepared.

## FAKTY
- R1 failed to patch TodayStable and left guard/test artifacts.
- R2 applied code patch but guard was too narrow and rejected the real lazyPage(() => import('./pages/TodayStable'), 'TodayStable') route.
- R3 still used a brittle needle/line-ending marker and failed before guard repair.
- R4 is idempotent and handles clean repo, R2 dirty state, R3 failed state and CRLF/LF differences.

## ZMIANY
- TodayStable: Wymaga ruchu, actionRequiredRows, helper non-calendar, upcomingRowsAll/upcomingRowsPreview, dynamic task label.
- scripts/check-stage232b-today-owner-control-tiles.cjs: class guard for route and TodayStable contract.
- tests/stage232b-today-owner-control-tiles.test.cjs: node tests for route, label, counts and preview disclosure.

## TESTY AUTOMATYCZNE
- node scripts/check-stage232b-today-owner-control-tiles.cjs
- node --test tests/stage232b-today-owner-control-tiles.test.cjs
- npm run build
- git diff --check

## VERIFY CLOSEFLOW QUIET
- npm run verify:closeflow:quiet is non-blocking only for the known unrelated CaseDetail loading reference guard.

## AUDYT PO ETAPIE
- Ryzyko: liczba Wymaga ruchu może nadal być duża, ale nazwa już nie obiecuje tylko dzisiejszych terminów.
- Ryzyko: ownerControlBaseline.items nadal jest szerokim backlogiem; to jest świadomy kontrakt produktu.
- Ryzyko: jeśli TodayStable layout ma niestandardowe wcięcia, visual check Damiana jest wymagany.
- Nie ruszano: SQL, Google Calendar, LeadDetail, CaseDetail, płatności, global layout.

## TEST RĘCZNY
Do wykonania przez Damiana w /today przed PRODUCT_PASS.
