# Stage92 — Calendar selected day readable actions — local ZIP run

Date: 2026-05-16
Mode: local ZIP, no commit, no push
Branch: dev-rollout-freeze

## FAKTY Z KODU / PLIKÓW

- Patched: `src/pages/Calendar.tsx`
- Patched: `src/styles/closeflow-calendar-selected-day-new-tile-v9.css`
- Added: `tests/stage92-calendar-selected-day-readable-actions.test.cjs`
- Updated: `scripts/closeflow-release-check-quiet.cjs`
- Updated: `_project/06_GUARDS_AND_TESTS.md`
- Updated: `_project/07_NEXT_STEPS.md`
- Updated: `_project/08_CHANGELOG_AI.md`
- Updated: `_project/12_IMPLEMENTATION_LEDGER.md`
- Updated: `_project/14_TEST_HISTORY.md`

## DECYZJE DAMIANA

- Robimy tylko lokalne paczki ZIP.
- Nie robimy commit/push teraz.
- Zbiorczy push dopiero po serii paczek.
- Calendar selected day ma pokazywać pełny typ, tytuł, powiązanie i czytelne akcje.

## HIPOTEZY / PROPOZYCJE AI

- Biała belka była skutkiem rozdzielenia treści i akcji / starych warstw CSS; Stage92 zamyka wpis w jednym shellu i blokuje osobny pasek.

## DO POTWIERDZENIA

- Test ręczny Damiana na `/calendar` po zastosowaniu paczki.

## TESTY AUTOMATYCZNE

- `node --test tests/stage92-calendar-selected-day-readable-actions.test.cjs`
- Pełna bramka opcjonalna: `node scripts/closeflow-release-check-quiet.cjs`

## GUARDY

- Stage92 guard wymusza pełne etykiety, `data-cf-entry-title`, pełne akcje, brak aktywnego legacy renderu i brak pustego paska.

## TESTY RĘCZNE

- Status: TEST RĘCZNY DO WYKONANIA.

## POTWIERDZENIA DAMIANA

- Brak jeszcze potwierdzenia testu ręcznego po wdrożeniu tej paczki.

## BRAKI I RYZYKA

- Nie wykonano pełnego quiet gate domyślnie, żeby nie blokować pracy nad kolejnymi paczkami. Można odpalić skrypt z `-RunQuietGate`.
- Lokalny stan repo może zawierać inne zmiany, które pojawią się w `git status --short`.

## WPŁYW NA OBSIDIANA

- Obsidian dashboard and run note updated.

## WPŁYW NA KIERUNEK ROZWOJU

- Utrzymujemy jedną prawdę renderowania selected-day V9 zamiast kolejnych lokalnych wariantów.

## NASTĘPNY KROK

- Damian wykonuje test ręczny `/calendar` i wrzuca wynik. Potem kolejna paczka lokalna, nadal bez push.

## GIT / ZIP STATUS

- Commit: SKIP zgodnie z trybem lokalnych paczek.
- Push: SKIP zgodnie z trybem lokalnych paczek.
- Backup: `_project/backups/stage92-calendar-selected-day-readable-actions-2026-05-16`

## DOWÓD SKANU

Metoda skanu: Node.js fs.readdirSync recursive, z pominięciem .git/node_modules/dist/build/.next/.turbo/.vercel.

Foldery znalezione:
- src/pages
- src/styles
- tests
- scripts
- _project
- _project/runs

Foldery brakujące:
- brak

Liczba przeskanowanych plików repo: 3463
Liczba przeskanowanych plików _project: 90
Liczba przeskanowanych notatek Obsidiana CloseFlow: 54

Przykładowe ścieżki repo:
- .agents/skills/closeflow-ui-designer/SKILL.md
- .agents/skills/closeflow-ui-designer/references/action-icon-style-map.seed.md
- .agents/skills/closeflow-ui-designer/references/action-placement-contract.md
- .agents/skills/closeflow-ui-designer/references/component-map.md
- .agents/skills/closeflow-ui-designer/references/current-repo-premap-2026-05-08.md
- .agents/skills/closeflow-ui-designer/references/design-source-of-truth.seed.md
- .agents/skills/closeflow-ui-designer/references/entity-detail-action-map.seed.md
- .agents/skills/closeflow-ui-designer/references/global-style-token-contract.md
- .agents/skills/closeflow-ui-designer/references/icon-contract.md
- .agents/skills/closeflow-ui-designer/references/no-go-patterns.md
- .agents/skills/closeflow-ui-designer/references/refactor-priority-map.md
- .agents/skills/closeflow-ui-designer/references/style-contract.md
- .agents/skills/closeflow-ui-designer/references/ui-audit-checklist.md
- .closeflow-diagnostics/fb5-bulk-diagnostic-repair-2026-05-10T19-05-46-214Z/FB-5-bulk-UI-contract.log
- .closeflow-diagnostics/fb5-bulk-diagnostic-repair-2026-05-10T19-05-46-214Z/FB-5-heavy-UI-aggregate-guard.log
- .closeflow-diagnostics/fb5-bulk-diagnostic-repair-2026-05-10T19-05-46-214Z/FB-5-toast-danger-source-contract.log
- .closeflow-diagnostics/fin8-heavy-qa-repair3-logs/API_command_check_closeflow-api-runtime-data-contract-server-safe.log
- .closeflow-diagnostics/fin8-heavy-qa-repair3-logs/API_command_check_closeflow-api0-vercel-hobby-functions.log
- .closeflow-diagnostics/fin8-heavy-qa-repair3-logs/Build_vite_build.log
- .closeflow-diagnostics/fin8-heavy-qa-repair3-logs/FIN-5_command_check_closeflow-case-settlement-panel.log
- .closeflow-diagnostics/fin8-heavy-qa-repair3-logs/FIN-6_command_check_closeflow-fin6-payments-list-types.log
- .closeflow-diagnostics/fin8-heavy-qa-repair3-logs/FIN-7_command_check_closeflow-fin7-client-finance-summary.log
- .closeflow-diagnostics/fin8-heavy-qa-repair3-logs/FIN-8_command_check_closeflow-fin8-finance-visual-integration.log
- .closeflow-diagnostics/fin8-heavy-qa-repair3-logs/TypeScript_tsc_no_emit.log
- .closeflow-diagnostics/fin8-heavy-qa-repair3-logs/git-status-short.log
- .closeflow-diagnostics/fin8-heavy-qa-repair3-logs/import_command_check_closeflow-fin5-import-boundaries-final.log
- .closeflow-recovery-backups/asset-cache-stale-chunks-2026-05-11T19-54-14-383Z/package.json
- .closeflow-recovery-backups/asset-cache-stale-chunks-2026-05-11T19-54-14-383Z/public/service-worker.js
- .closeflow-recovery-backups/asset-cache-stale-chunks-2026-05-11T19-54-14-383Z/src/components/ErrorBoundary.tsx
- .closeflow-recovery-backups/asset-cache-stale-chunks-2026-05-11T19-54-14-383Z/src/main.tsx
- .closeflow-recovery-backups/asset-cache-stale-chunks-2026-05-11T19-54-14-383Z/vercel.json
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/package.json
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/scripts/closeflow-release-check-quiet.cjs
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/components/entity-actions.tsx
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/CaseDetail.tsx
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/pages/Cases.tsx
- .closeflow-recovery-backups/case-delete-trash-actions-20260511-171211/src/styles/closeflow-action-tokens.css
- .closeflow-recovery-backups/case-detail-loading-reference-20260511163706/scripts/closeflow-release-check-quiet.cjs
- .closeflow-recovery-backups/case-detail-loading-reference-20260511163706/src/pages/CaseDetail.tsx
- .closeflow-recovery-backups/case-detail-loading-scope-20260511164228/scripts/closeflow-release-check-quiet.cjs
- .closeflow-recovery-backups/case-detail-loading-scope-20260511164228/src/pages/CaseDetail.tsx
- .closeflow-recovery-backups/case-detail-no-partial-loading-20260511-163016/CaseDetail.tsx
- .closeflow-recovery-backups/case-detail-no-partial-loading-20260511-163016/package.json
- .closeflow-recovery-backups/case-detail-no-partial-loading-20260511-163016/visual-stage13-case-detail-vnext.css
- .closeflow-recovery-backups/case-detail-no-partial-loading-check-accept-inline-20260511-164548/docs/ui/CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_CHECK_FIX_2026-05-11.md
- .closeflow-recovery-backups/case-detail-no-partial-loading-check-accept-inline-20260511-164548/scripts/check-closeflow-case-detail-no-partial-loading.cjs
- .closeflow-recovery-backups/case-detail-no-partial-loading-check-block-scan-v2-20260511-165235/scripts/check-closeflow-case-detail-no-partial-loading.cjs
- .closeflow-recovery-backups/case-detail-no-partial-loading-check-block-scan-v2-20260511-165243/docs/ui/CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_CHECK_BLOCK_SCAN_FIX_V2_2026-05-11.md
- .closeflow-recovery-backups/case-detail-no-partial-loading-check-block-scan-v2-20260511-165243/scripts/check-closeflow-case-detail-no-partial-loading.cjs
- .closeflow-recovery-backups/case-detail-no-partial-loading-check-final-20260511-165512/scripts/check-closeflow-case-detail-no-partial-loading.cjs

Przykładowe ścieżki _project:
- _project/00_PROJECT_MEMORY_PROTOCOL.md
- _project/00_PROJECT_STATUS.md
- _project/01_PROJECT_GOAL.md
- _project/02_WORK_RULES.md
- _project/03_CURRENT_STAGE.md
- _project/04_DECISIONS.md
- _project/05_MANUAL_TESTS.md
- _project/06_GUARDS_AND_TESTS.md
- _project/07_NEXT_STEPS.md
- _project/08_CHANGELOG_AI.md
- _project/09_CONTEXT_FOR_OBSIDIAN.md
- _project/10_PROJECT_TIMELINE.md
- _project/11_USER_CONFIRMED_TESTS.md
- _project/12_IMPLEMENTATION_LEDGER.md
- _project/13_TEST_HISTORY.md
- _project/14_AI_REPORTS_INDEX.md
- _project/14_TEST_HISTORY.md
- _project/15_ACTIVE_SOURCE_MAP.md
- _project/15_RELEASE_READINESS.md
- _project/16_OBSIDIAN_SYNC_LOG.md
- _project/STAGE_TEMPLATE_MINIMAL.md
- _project/backups/project-memory-v2-20260515_193437/AGENTS.md
- _project/backups/project-memory-v2-20260515_193437/_project/00_PROJECT_STATUS.md
- _project/backups/project-memory-v2-20260515_193437/_project/01_PROJECT_GOAL.md
- _project/backups/project-memory-v2-20260515_193437/_project/02_WORK_RULES.md
- _project/backups/project-memory-v2-20260515_193437/_project/03_CURRENT_STAGE.md
- _project/backups/project-memory-v2-20260515_193437/_project/04_DECISIONS.md
- _project/backups/project-memory-v2-20260515_193437/_project/05_MANUAL_TESTS.md
- _project/backups/project-memory-v2-20260515_193437/_project/06_GUARDS_AND_TESTS.md
- _project/backups/project-memory-v2-20260515_193437/_project/07_NEXT_STEPS.md

Przykładowe notatki Obsidiana CloseFlow:
- 10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md
- 10_PROJEKTY/CloseFlow_Lead_App/01_STATUS - CloseFlow Lead App.md
- 10_PROJEKTY/CloseFlow_Lead_App/02_DECYZJE - CloseFlow Lead App.md
- 10_PROJEKTY/CloseFlow_Lead_App/03_TESTY_RECZNE - CloseFlow Lead App.md
- 10_PROJEKTY/CloseFlow_Lead_App/04_RYZYKA - CloseFlow Lead App.md
- 10_PROJEKTY/CloseFlow_Lead_App/05_POTWIERDZENIA_DAMIANA - CloseFlow Lead App.md
- 10_PROJEKTY/CloseFlow_Lead_App/06_HISTORIA - CloseFlow Lead App.md
- 10_PROJEKTY/CloseFlow_Lead_App/07_NASTEPNY_KROK - CloseFlow Lead App.md
- 10_PROJEKTY/CloseFlow_Lead_App/CloseFlow lead app - indeks projektu.md
- 10_PROJEKTY/CloseFlow_Lead_App/CloseFlow lead app - raport AI 2026-05-15_20-20-53.md
- 10_PROJEKTY/CloseFlow_Lead_App/CloseFlow lead app - raport AI 2026-05-15_20-25-11.md
- 10_PROJEKTY/CloseFlow_Lead_App/CloseFlow lead app - raport AI 2026-05-15_21-59-45.md
- 10_PROJEKTY/CloseFlow_Lead_App/CloseFlow lead app - raport backupu starych notatek.md
- 10_PROJEKTY/CloseFlow_Lead_App/CloseFlow lead app - status projektu.md
- 10_PROJEKTY/CloseFlow_Lead_App/CloseFlow lead app - zasady pracy.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/01_KIERUNEK I ZAKRES - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/02_STAN OBECNY - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/03_DECYZJE - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/04_ETAPY I WDROZENIA - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/05_TESTY RECZNE - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/06_GUARDY I TESTY AUTOMATYCZNE - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/07_POTWIERDZENIA DAMIANA - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/08_HISTORIA I ZMIANY KIERUNKU - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/09_NASTEPNY KROK - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/10_ZASADY PROJEKTU - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-20260515_193437/10_PROJEKTY/CloseFlow_Lead_App/_RAPORTY_AI/2026-05-15 1940 - raport AI - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-fix3-20260515_193808/10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-fix3-20260515_193808/10_PROJEKTY/CloseFlow_Lead_App/01_KIERUNEK I ZAKRES - CloseFlow lead app.md
- 10_PROJEKTY/CloseFlow_Lead_App/_BACKUPS/project-memory-v2-fix3-20260515_193808/10_PROJEKTY/CloseFlow_Lead_App/02_STAN OBECNY - CloseFlow lead app.md

Mapa źródeł prawdy:
- Repo aplikacji: kod, testy, guardy, `_project/`, raporty techniczne.
- Obsidian: dashboard wysokiego poziomu, decyzje, historia operacyjna, testy ręczne.
- Czat: decyzja bieżąca Damiana o trybie lokalnych paczek bez push.
