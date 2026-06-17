# AGENTS.md - CloseFlow / LeadFlow

Status: ACTIVE
Read policy: MUST_READ_REPO_START
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
canonical_name: CloseFlow / LeadFlow
project_id: closeflow_lead_app

## Cel

Ten plik jest minimalnym startem repo dla AI.

Repo aplikacji jest dla kodu, konfiguracji, testow technicznych, guardow technicznych, migracji wykonywalnych i minimalnych instrukcji startowych.

Pelna dokumentacja projektu, etapy, decyzje, roadmapa, ryzyka, bugi, testy operacyjne, SQL ledger, ZIP/push ledger i historia pracy sa w Obsidianie.

## Minimalny start

Nie czytaj calego repo, calego _project, wszystkich run reportow ani obsidian_updates na starcie.

Czytaj tylko:

1. ten plik,
2. _project/00_AI_START_SPIS_TRESCI.md,
3. projektowy spis tresci w Obsidianie: 10_PROJEKTY/CloseFlow_Lead_App/00_AI_START_SPIS_TRESCI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md, jesli masz dostep,
4. konkretne pliki wskazane przez spis tresci dla typu zadania.

Stary _project/CODEX_CONTEXT_INDEX.md, jesli istnieje, jest tylko legacy bridge. Nie traktuj go jako glownego startu.

## Routing pracy

- STATUS / PLAN -> Obsidian 00, 01 i 04.
- BUGFIX -> konkretny plik bledu, bezposrednie zaleznosci i powiazany guard/test.
- UI / TODAY / LEADS / CLIENTS / CASES / CASEDETAIL -> aktywne decyzje UI z Obsidian 04, mapa plikow 07, guard UI 09 i ryzyka 11.
- SUPABASE / SQL / MIGRACJE / RLS -> Obsidian 13, repo _project/13_SQL_LEDGER_I_MIGRACJE.md i konkretne migracje/funkcje.
- DELIVERY / ZIP / PUSH -> Obsidian 10, testy 09, ryzyka 11 i globalny WORKFLOW_GUARDS.
- DOCS / OBSIDIAN -> aktualizuj Obsidian zgodnie ze spisem 00-13; nie tworz luznych dokumentow w repo aplikacji.
- CLEANUP / ARCHIWUM -> tylko gdy zadanie tego wymaga; wtedy czytaj Obsidian 12 i wskazane pliki.

## Granice CloseFlow

CloseFlow / LeadFlow nie jest kopia CRM. To owner control system dla leadow, klientow, spraw, zadan, kalendarza, follow-upow i finansow.

AI nie moze przepisywac zaakceptowanych wizualnie baseline'ow bez jawnego etapu.

Dla CaseDetail baseline R4 jest zamrozony jako kierunek, dopoki Damian go nie zmieni.

Nie zmieniaj SQL, kosztow, Google Calendar, LeadListCard, ClientDetail ani finansow bez zakresu etapu.

## Git / testy

Jeden commit = jeden projekt albo jeden globalny etap systemowy.

Nie uzywaj zbiorczego dodawania wszystkich zmian ani force push.

Przed commitem wykonaj scope guard, guardy/testy zgodne z zakresem i diff check. Jesli sa zmiany spoza zakresu albo czerwony guard, zrob STOP.

## Scan report

Przed planem, kodem albo audytem wypisz: Project, Read mode, Files read, Files intentionally not read, Current stage, Active decisions, Open risks, Tests/guards relevant, Next step.
