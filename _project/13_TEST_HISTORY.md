# 13_TEST_HISTORY - CloseFlow / LeadFlow

## V6
PowerShell parser przerwal skrypt w okolicy raportu generycznych nazw.

## V7
PowerShell parser nadal padl na koncowce skryptu.

## V9
Skrypt uproszczony do kopii payload i uruchomienia guardow. Po uruchomieniu dopisz wynik guardow.

## 2026-05-29 - STAGE179 Settings readability tests

Do wykonania po apply:

- 
ode --test tests/stage179-settings-form-control-readability-contract.test.cjs
- 
pm run build
- RÄ™cznie /settings: czytelnoĹ›Ä‡ select/input/disabled/dropdown/focus w sekcji Google Calendar reminders.

## 2026-05-29 - STAGE179 Settings readability tests

Do wykonania po apply:

- 
ode --test tests/stage179-settings-form-control-readability-contract.test.cjs
- 
pm run build
- RÄ™cznie /settings: czytelnoĹ›Ä‡ select/input/disabled/dropdown/focus w sekcji Google Calendar reminders.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_TEST_HISTORY_START -->
## 2026-06-04 — Stage221 owner-control roadmap memory test

Planned local command after apply:
- `node scripts/check-stage221-owner-control-roadmap-memory.cjs`
- `git diff --check`

Runtime tests:
- SKIP — etap dokumentacyjny/roadmapowy, bez zmian UI/API/runtime.

Manual test:
- Przeczytać `_project/07_NEXT_STEPS.md`.
- Potwierdzić, że etapy A35 → A47 są ułożone logicznie i zawierają cel, zakres, czego nie ruszać oraz guard/test.
- Potwierdzić, że Obsidian update został skopiowany do vaulta albo zostaje w `_project/obsidian_updates/`.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_TEST_HISTORY_END -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymały się na kruchych anchorach w Clients.tsx.
- V3 używa elastycznych regexów i naprawia częściowy lokalny stan.
- Docelowy wzór: [Oferta wysłana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check
