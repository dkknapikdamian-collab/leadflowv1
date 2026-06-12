# AGENTS.md - CloseFlow Lead App

## SCAN-FIRST
Before changing this project read: AGENTS.md, _project/, README files, package.json, scripts/, tests/, docs/, recent run reports and the Obsidian section 10_PROJEKTY/CloseFlow_Lead_App.

## Information baskets
- FAKT - confirmed by code, files, tests, docs, repo or command output.
- DECYZJA - confirmed written decision by Damian or accepted project rule.
- HIPOTEZA / PROPOZYCJA - unconfirmed idea.
- DO POTWIERDZENIA - missing or uncertain information.

## Boundaries
For project-memory stages do not change UI, routing, product logic or app architecture.

## After each meaningful stage
Update _project/runs, 08_CHANGELOG_AI, 07_NEXT_STEPS and relevant memory files.<!-- CLOSEFLOW_PROJECT_MEMORY_RULES_V8_START -->
# CloseFlow / LeadFlow - stale zasady pamieci projektu

Ten blok zostal dopisany automatycznie przez paczke V8. Nie zastapil istniejacych zasad.

## Obowiazek scan-first
Przed kazda zmiana AI developer / Codex ma przeczytac repo, AGENTS.md, _project, README, package.json, scripts, tests, docs oraz sekcje Obsidiana projektu.

## Cztery koszyki informacji
Kazdy raport ma rozdzielac:
- FAKT z kodu, plikow, testow, dokumentow albo repo,
- DECYZJA z pisemnych ustalen Damiana,
- HIPOTEZA / PROPOZYCJA jako niepotwierdzony pomysl,
- DO POTWIERDZENIA gdy brakuje dowodu.

Nie wolno zapisywac hipotez jako faktow.

## Aktualizacja pamieci po kazdym etapie
Po kazdej sensownej zmianie aktualizuj:
- _project/00_PROJECT_STATUS.md,
- _project/03_CURRENT_STAGE.md,
- _project/04_DECISIONS.md, jesli zmieniono kierunek,
- _project/05_MANUAL_TESTS.md,
- _project/06_GUARDS_AND_TESTS.md,
- _project/07_NEXT_STEPS.md,
- _project/08_CHANGELOG_AI.md,
- _project/10_PROJECT_TIMELINE.md,
- _project/12_IMPLEMENTATION_LEDGER.md,
- _project/13_TEST_HISTORY.md,
- _project/runs/ z raportem wykonania.

## Nazwy Obsidiana
Nie tworz aktywnych plikow typu INDEX.md, STATUS.md, ledger.md, README.md bez kontekstu CloseFlow_LeadFlow.
Aktywne pliki w sekcji Obsidiana musza miec czytelna nazwe, np. CloseFlow_LeadFlow__STATUS_PROJEKTU.md.

## Git / ZIP
Pracuj na branchu dev-rollout-freeze. Nie tworz nowych branchy.
Jesli Damian chce ZIP, pliki Obsidiana i pamiec projektu musza wejsc do ZIP-a.
Jesli chce push, pushuj dopiero po przejsciu guardow albo po jawnym raporcie SKIP z powodem.
<!-- CLOSEFLOW_PROJECT_MEMORY_RULES_V8_END -->

<!-- CLOSEFLOW_PROJECT_MEMORY_RULES_V9_START -->
# CloseFlow / LeadFlow - stale zasady pamieci projektu

Ten blok zostal dopisany automatycznie przez paczke V9. Nie zastapil istniejacych zasad.

## Obowiazek scan-first
Przed kazda zmiana AI developer / Codex ma przeczytac repo, AGENTS.md, _project, README, package.json, scripts, tests, docs oraz sekcje Obsidiana projektu.

## Cztery koszyki informacji
Kazdy raport ma rozdzielac:
- FAKT z kodu, plikow, testow, dokumentow albo repo,
- DECYZJA z pisemnych ustalen Damiana,
- HIPOTEZA / PROPOZYCJA jako niepotwierdzony pomysl,
- DO POTWIERDZENIA gdy brakuje dowodu.

Nie wolno zapisywac hipotez jako faktow.

## Aktualizacja pamieci po kazdym etapie
Po kazdej sensownej zmianie aktualizuj:
- _project/00_PROJECT_STATUS.md,
- _project/03_CURRENT_STAGE.md,
- _project/04_DECISIONS.md, jesli zmieniono kierunek,
- _project/05_MANUAL_TESTS.md,
- _project/06_GUARDS_AND_TESTS.md,
- _project/07_NEXT_STEPS.md,
- _project/08_CHANGELOG_AI.md,
- _project/10_PROJECT_TIMELINE.md,
- _project/12_IMPLEMENTATION_LEDGER.md,
- _project/13_TEST_HISTORY.md,
- _project/runs/ z raportem wykonania.

## Nazwy Obsidiana
Nie tworz aktywnych plikow typu INDEX.md, STATUS.md, ledger.md, README.md bez kontekstu CloseFlow_LeadFlow.
Aktywne pliki w sekcji Obsidiana musza miec czytelna nazwe, np. CloseFlow_LeadFlow__STATUS_PROJEKTU.md.

## Git / ZIP
Pracuj na branchu dev-rollout-freeze. Nie tworz nowych branchy.
Jesli Damian chce ZIP, pliki Obsidiana i pamiec projektu musza wejsc do ZIP-a.
Jesli chce push, pushuj dopiero po przejsciu guardow albo po jawnym raporcie SKIP z powodem.
<!-- CLOSEFLOW_PROJECT_MEMORY_RULES_V9_END -->

<!-- DAMIAN_MINIMAL_PROJECT_MEMORY_PROTOCOL_START -->
# Damian minimal project memory protocol - CloseFlow / LeadFlow

Ten blok wskazuje na krotki protokol pamieci projektu. Nie usuwa ani nie zastepuje starszych blokow V8/V9.

## Aktywne pliki protokolu
- `_project/00_PROJECT_MEMORY_PROTOCOL.md`
- `_project/STAGE_TEMPLATE_MINIMAL.md`
- `_project/runs/`
- Obsidian: `10_PROJEKTY/CloseFlow_Lead_App/`

## Zasada zamkniecia etapu
Etap jest niewazny, jesli nie ma dowodu skanu repo, `_project/`, Obsidiana, wpisu testow/guardow, statusu testu recznego oraz aktualizacji Obsidiana albo jawnego SKIP z powodem.

## Granica tego etapu
Zmiany organizacyjne moga dotykac tylko `AGENTS.md`, `_project/` i dashboardu Obsidiana. Nie zmieniac runtime UI, routingu, logiki produktu, styli ani architektury aplikacji bez osobnego etapu.
<!-- DAMIAN_MINIMAL_PROJECT_MEMORY_PROTOCOL_END -->

<!-- CLOSEFLOW_STAGE_AUDIT_PROTOCOL_2026_06_12_START -->
# CloseFlow / LeadFlow - obowiązkowy audyt przed i po etapie

Aktywny plik szczegółowy: `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`.

## Decyzja Damiana
Od 2026-06-12 każdy etap musi mieć audyt przed wdrożeniem i audyt po wdrożeniu.

Audyt ma szukać realnych problemów: złych podpięć, niedopiętych funkcji, niedokończonych przepięć, sprzeczności z kierunkiem aplikacji, ryzyk regresji, drugich źródeł prawdy, brakujących guardów/testów i rzeczy, które mogą wrócić po refetchu albo odświeżeniu.

Nie wolno doszukiwać się problemów na siłę, robić chaotycznego refactoru ani ruszać obcych modułów bez związku z etapem.

## Wymagane przed etapem
- przeczytać `AGENTS.md`, `_project/00_PROJECT_MEMORY_PROTOCOL.md`, `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`, `_project/STAGE_TEMPLATE_MINIMAL.md` i właściwy plik etapu,
- sprawdzić, czy etap nie jest już wdrożony częściowo,
- wypisać ekran/trasę, gdzie Damian zobaczy efekt,
- wypisać podobne miejsca do sprawdzenia,
- zaplanować guard/test albo jawnie zapisać brak guardu z powodem.

## Wymagane po etapie
- sprawdzić, czy poprawiono przyczynę, nie tylko objaw,
- sprawdzić powiązane miejsca i ryzyka regresji,
- uruchomić właściwe guardy/testy,
- podać manualny test dla Damiana,
- zaktualizować `_project` i payload Obsidiana,
- zapisać `AUDYT PO ETAPIE` w run report.

Etap bez sekcji `AUDYT PRZED ETAPEM` i `AUDYT PO ETAPIE` jest niezamknięty.
<!-- CLOSEFLOW_STAGE_AUDIT_PROTOCOL_2026_06_12_END -->
