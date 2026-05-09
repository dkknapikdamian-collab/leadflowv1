# CloseFlow raw test debt backlog — 2026-05-09

Status: **do zrobienia jako osobny etap, nie jako repair VS-7**  
Zakres: `npm run test:raw`  
Aktualny wynik z diagnostyki: **49 failing test files**  
Powód wpisu: po VS-7 `build`, targetowane testy i `verify:closeflow:quiet` są traktowane jako właściwa bramka finalizacji etapu, ale pełny `test:raw` ujawnił osobny dług testowy.

## Decyzja

Nie mieszamy czyszczenia pełnego `test:raw` z etapem VS-7 / semantic metric tones.

`test:raw` odpala wszystkie historyczne testy z repo. Część z nich sprawdza stare markery, stare nazwy komponentów, stare klasy CSS albo wcześniejsze kontrakty UI, które zostały już zastąpione nowszym systemem.

To trzeba naprawić, ale jako osobny etap:

**VS-8 / RAW TEST DEBT CLEANUP**

## Kryterium dla VS-7

VS-7 można finalizować po zielonych:

- `npm run build`
- `npm run verify:closeflow:quiet`
- `npm run check:vs7-semantic-metric-tones`
- `npm run check:unified-top-metric-tiles`
- targetowane testy repairów VS-7

Pełny `npm run test:raw` zostaje osobnym backlogiem.

## Co trzeba zrobić w VS-8

1. Odpalić świeży digest `test:raw`.
2. Dla każdego faila ustalić kategorię:
   - **A: realny błąd aplikacji** — naprawić kod.
   - **B: stary test po migracji UI/architektury** — zaktualizować test do obecnego źródła prawdy.
   - **C: test historyczny / guard martwego etapu** — przenieść do archiwum albo usunąć z raw, jeżeli nie chroni aktualnego produktu.
   - **D: test powinien wejść do release gate** — dodać do `verify:closeflow:quiet`, jeśli chroni krytyczny flow.
3. Nie poprawiać testów przez dokładanie martwych klas, komentarzy albo fałszywych markerów do kodu produkcyjnego.
4. Jeżeli test sprawdza realną funkcję użytkownika, naprawiać produkt, nie test.
5. Po sprzątaniu docelowy stan:
   - `npm run build` — green,
   - `npm run verify:closeflow:quiet` — green,
   - `npm run test:raw` — green albo jawnie ograniczony do aktualnych testów.

## Lista failing test files z diagnostyki 2026-05-09

1. `tests/ai-draft-approval-stage03.test.cjs`
2. `tests/ai-draft-real-transfer-stage12.test.cjs`
3. `tests/ai-draft-relation-picker-stage24.test.cjs`
4. `tests/ai-drafts-confirm-records.test.cjs`
5. `tests/ai-drafts-supabase-sync-stage13.test.cjs`
6. `tests/ai-drafts-visual-rebuild.test.cjs`
7. `tests/ai-operator-quality-cost-guard-stage06.test.cjs`
8. `tests/ai-operator-snapshot-stage02.test.cjs`
9. `tests/case-detail-visual-rebuild.test.cjs`
10. `tests/client-detail-edit-save-and-multi-contact-stage25.test.cjs`
11. `tests/client-detail-visual-rebuild.test.cjs`
12. `tests/daily-digest-ai-drafts-stage05.test.cjs`
13. `tests/event-form-visual-rebuild.test.cjs`
14. `tests/hotfix-ai-drafts-right-rail-dark-wrapper-stage28.test.cjs`
15. `tests/hotfix-ai-drafts-right-rail-stage28.test.cjs`
16. `tests/hotfix-lead-client-right-rail-dark-wrappers.test.cjs`
17. `tests/hotfix-task-stat-tiles-clean.test.cjs`
18. `tests/lead-detail-visual-rebuild.test.cjs`
19. `tests/leads-trash-copy-cleanup-stage14.test.cjs`
20. `tests/metric-tile-icons-next-to-value.test.cjs`
21. `tests/mojibake-test-marker-fix-stage23.test.cjs`
22. `tests/phase0-api-client-workspace-headers.test.cjs`
23. `tests/phase0-require-auth-context-alias.test.cjs`
24. `tests/profile-settings-row-id-fallback.test.cjs`
25. `tests/pwa-safe-cache.test.cjs`
26. `tests/stage10-vercel-hobby-assistant-route-collapse.test.cjs`
27. `tests/stage27-quick-lead-capture.test.cjs`
28. `tests/stage28-daily-digest-email.test.cjs`
29. `tests/stage30-pwa-install-foundation.test.cjs`
30. `tests/stage5-ai-read-query-hardening-v1.test.cjs`
31. `tests/stage53-client-operational-recent-moves.test.cjs`
32. `tests/stage57-case-create-action-hub.test.cjs`
33. `tests/stage59-case-note-follow-up-prompt.test.cjs`
34. `tests/stage60-case-action-copy-note-dedupe.test.cjs`
35. `tests/stage61-case-note-action-button-swap.test.cjs`
36. `tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs`
37. `tests/stage7a_tasks_blue_outline_fix.test.cjs`
38. `tests/stage7b-stage7-payload-copy-repair.test.cjs`
39. `tests/stage7b_stat_shortcut_no_blue_outline.test.cjs`
40. `tests/stage86-billing-google-e2e-readiness.test.cjs`
41. `tests/stage86-context-action-explicit-triggers.test.cjs`
42. `tests/stage86k-billing-workspace-resolution.test.cjs`
43. `tests/stage86m-billing-google-regression-suite.test.cjs`
44. `tests/stage88-lead-admin-feedback-hotfix.test.cjs`
45. `tests/stage89-shared-context-dialogs-detail-pages.test.cjs`
46. `tests/stage90-finance-unified-model-ui.test.cjs`
47. `tests/stage92-work-items-date-contract.test.cjs`
48. `tests/support-visual-rebuild.test.cjs`
49. `tests/today-sections.test.cjs`


## Grupy robocze

### AI / AI drafts / operator

- `tests/ai-draft-approval-stage03.test.cjs`
- `tests/ai-draft-real-transfer-stage12.test.cjs`
- `tests/ai-draft-relation-picker-stage24.test.cjs`
- `tests/ai-drafts-confirm-records.test.cjs`
- `tests/ai-drafts-supabase-sync-stage13.test.cjs`
- `tests/ai-drafts-visual-rebuild.test.cjs`
- `tests/ai-operator-quality-cost-guard-stage06.test.cjs`
- `tests/ai-operator-snapshot-stage02.test.cjs`
- `tests/daily-digest-ai-drafts-stage05.test.cjs`
- `tests/stage5-ai-read-query-hardening-v1.test.cjs`
- `tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs`
- `tests/stage7b-stage7-payload-copy-repair.test.cjs`

### Visual / UI rebuild / metric tiles

- `tests/case-detail-visual-rebuild.test.cjs`
- `tests/client-detail-visual-rebuild.test.cjs`
- `tests/event-form-visual-rebuild.test.cjs`
- `tests/lead-detail-visual-rebuild.test.cjs`
- `tests/hotfix-ai-drafts-right-rail-dark-wrapper-stage28.test.cjs`
- `tests/hotfix-ai-drafts-right-rail-stage28.test.cjs`
- `tests/hotfix-lead-client-right-rail-dark-wrappers.test.cjs`
- `tests/hotfix-task-stat-tiles-clean.test.cjs`
- `tests/metric-tile-icons-next-to-value.test.cjs`
- `tests/stage7a_tasks_blue_outline_fix.test.cjs`
- `tests/stage7b_stat_shortcut_no_blue_outline.test.cjs`
- `tests/support-visual-rebuild.test.cjs`
- `tests/today-sections.test.cjs`

### Client / case operational flow

- `tests/client-detail-edit-save-and-multi-contact-stage25.test.cjs`
- `tests/stage53-client-operational-recent-moves.test.cjs`
- `tests/stage57-case-create-action-hub.test.cjs`
- `tests/stage59-case-note-follow-up-prompt.test.cjs`
- `tests/stage60-case-action-copy-note-dedupe.test.cjs`
- `tests/stage61-case-note-action-button-swap.test.cjs`

### Billing / Google / plan / workspace

- `tests/stage86-billing-google-e2e-readiness.test.cjs`
- `tests/stage86k-billing-workspace-resolution.test.cjs`
- `tests/stage86m-billing-google-regression-suite.test.cjs`
- `tests/phase0-api-client-workspace-headers.test.cjs`
- `tests/phase0-require-auth-context-alias.test.cjs`

### PWA / digest / support / profile / misc

- `tests/pwa-safe-cache.test.cjs`
- `tests/stage30-pwa-install-foundation.test.cjs`
- `tests/stage28-daily-digest-email.test.cjs`
- `tests/profile-settings-row-id-fallback.test.cjs`
- `tests/mojibake-test-marker-fix-stage23.test.cjs`
- `tests/leads-trash-copy-cleanup-stage14.test.cjs`
- `tests/stage27-quick-lead-capture.test.cjs`
- `tests/stage10-vercel-hobby-assistant-route-collapse.test.cjs`
- `tests/stage86-context-action-explicit-triggers.test.cjs`
- `tests/stage88-lead-admin-feedback-hotfix.test.cjs`
- `tests/stage89-shared-context-dialogs-detail-pages.test.cjs`
- `tests/stage90-finance-unified-model-ui.test.cjs`
- `tests/stage92-work-items-date-contract.test.cjs`

## Następny etap wykonawczy

Nazwa robocza:

`VS-8_RAW_TEST_DEBT_CLEANUP_2026-05-09`

Format etapu:

- Cel
- Pliki do sprawdzenia
- Zmień
- Nie zmieniaj
- Po wdrożeniu sprawdź
- Kryterium zakończenia

## Minimalne kryterium zakończenia VS-8

- Każdy z 49 testów ma decyzję: naprawiony, zaktualizowany, przeniesiony lub usunięty z uzasadnieniem.
- `npm run test:raw` nie pokazuje przypadkowych historycznych faili.
- `verify:closeflow:quiet` nadal przechodzi.
- Nie dodano martwych markerów tylko po to, żeby uciszyć testy.
