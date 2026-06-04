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
