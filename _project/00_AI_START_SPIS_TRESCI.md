# 00_AI_START_SPIS_TRESCI - CloseFlow / LeadFlow

Status: ACTIVE
Read policy: MUST_READ_PROJECT_START
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
Obsidian start: 10_PROJEKTY/CloseFlow_Lead_App/00_AI_START_SPIS_TRESCI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md
canonical_name: CloseFlow / LeadFlow
project_id: closeflow_lead_app

## Cel

To jest lekki mostek repo do Obsidiana.

Nie czytaj calego repo ani calego _project na starcie.

Dokumentacja projektu, etapy, decyzje, ryzyka, testy operacyjne, SQL ledger i historia sa w Obsidianie. Repo jest dla kodu, konfiguracji, testow technicznych, guardow technicznych i migracji wykonywalnych.

## Minimalny start

1. Przeczytaj AGENTS.md.
2. Przeczytaj ten plik.
3. Jesli masz dostep do Obsidiana, przeczytaj projektowy 00_AI_START_SPIS_TRESCI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md.
4. Wybierz typ zadania.
5. Otworz tylko pliki pasujace do typu zadania.

## Snapshot

- Produkt: owner control system dla leadow, klientow, spraw, zadan, kalendarza, follow-upow i finansow.
- Branch roboczy: dev-rollout-freeze.
- Lokalna sciezka Damiana: C:\Users\malim\Desktop\biznesy_ai\2.closeflow.
- Aktywny znany kierunek: STAGE231F_R3 owner control baseline / nastepne etapy maja wynikac z Obsidiana.
- Frozen UI baseline: CaseDetail R4 lean service workspace, dopoki Damian nie zmieni decyzji.

## Typy zadan i routing

STATUS / PLAN:
- czytaj Obsidian 00, 01 i 04.
- nie czytaj historii, archiwum ani starych stage payloadow.

BUGFIX:
- czytaj konkretny plik bledu, zaleznosci, powiazany guard i aktywne ryzyko modulu.
- nie czytaj calego repo.

UI / TODAY / LEADS / CLIENTS / CASES / CASEDETAIL:
- czytaj Obsidian 04, 07, 09 i 11 wedlug zakresu.
- sprawdz zaakceptowane baseline'y wizualne przed zmiana.
- nie ruszaj SQL bez powodu.

SUPABASE / SQL / RLS / MIGRACJE:
- czytaj Obsidian 13, ten repo bridge SQL i konkretne migracje/funkcje.
- SQL musi byc osobnym blokiem albo plikiem.

GOOGLE CALENDAR / AUTH / INTEGRACJE:
- czytaj Obsidian 05/06 jesli istnieja i powiazane pliki repo.
- nie rob realnych zmian integracji bez jawnego etapu.

DOCS / OBSIDIAN:
- aktualizuj wlasciwy plik Obsidiana 01-13.
- nie tworz luznych dokumentow w repo aplikacji.

DELIVERY / ZIP / PUSH:
- czytaj Obsidian 10, 09, 11 i globalny WORKFLOW_GUARDS.
- po PASS rob selektywny commit/push.

CLEANUP / ARCHIWUM:
- czytaj Obsidian 12 i wskazane pliki osierocone/deprecated.
- to jeden z niewielu trybow, gdzie wolno czytac szerzej.

## Repo-local pliki startowe

- AGENTS.md - minimalny start repo.
- _project/00_AI_START_SPIS_TRESCI.md - ten plik.
- _project/CODEX_CONTEXT_INDEX.md - legacy bridge dla starych workflowow.
- _project/13_SQL_LEDGER_I_MIGRACJE.md - repo-local bridge SQL/migracji.
- package.json - lista skryptow, testow i guardow.

## Nie czytac na starcie

- calego repo,
- calego _project,
- _project/runs,
- obsidian_updates,
- archiwum,
- stare ZIP-y,
- backupy,
- buildy,
- node_modules,
- dist,
- .next,
- stare zamkniete etapy,
- stare zamkniete testy,
- stare zamkniete ryzyka.

## Scan report

Przed planem albo kodem wypisz: Project, Read mode, Files read, Files intentionally not read, Current stage, Active decisions, Open risks, Tests/guards relevant, Next step.
