# Stage228R14 / C5 - Missing items no-SQL decision and final local gate

- date: 2026-06-08 21:05 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- mode: LOCAL_ONLY_UNTIL_MANUAL_C5_PASS

## Cel

Domknac Stage227C5 z planu: po wdrozeniu C1-C4 nie robimy SQL, dopoki realne uzycie brakow nie pokaze potrzeby raportowania, filtrowania albo jednego twardego modelu danych.

## Decyzja

Brak zostaje w wersji C5 bez SQL:
- Lead: task/activity missing_item + missing_item_resolved.
- Client: task/activity missing_item + missing_item_resolved.
- Case: istniejace case_items status missing/accepted.

## Zakaz w tym etapie

- nie tworzyc tabeli missing_items,
- nie tworzyc tabeli blockers,
- nie dodawac migracji SQL,
- nie przebudowywac RLS,
- nie ruszac finansow ani layoutu.

## Guard

Dodano:
- scripts/check-stage228r14-c5-missing-items-no-sql-decision.cjs
- package.json script: check:stage228r14-c5-missing-items-no-sql-decision
- prebuild includes R14 C5 guard.

Guard sprawdza:
- R11/R12/R13 kontrakty,
- brak zaleznosci od missing_items/blockers w hostach,
- brak migracji create table missing_items/blockers,
- wpis decyzji C5,
- plan testow manualnych,
- next step: batch push dopiero po manual PASS.

## Testy automatyczne

- node scripts/check-stage228r11-shared-missing-item-flow.cjs
- node scripts/check-stage228r12-context-action-blocker-host.cjs
- node scripts/check-stage228r13-missing-item-status-resolve.cjs
- node scripts/check-stage228r14-c5-missing-items-no-sql-decision.cjs
- npm run build
- git diff --check

## Test manualny przed finalnym pushem

1. LeadDetail -> Brak -> save -> refresh -> visible -> Rozwiąż brak -> refresh -> hidden from open blockers.
2. ClientDetail -> Brak -> save -> refresh -> visible -> Rozwiąż -> refresh -> hidden from open blockers.
3. CaseDetail -> Brak -> save -> refresh -> visible -> accepted/resolved -> refresh -> hidden from active blockers.
4. Regression: Notatka / Zadanie / Wydarzenie / Brak still open through ContextActionDialogs.
5. Regression: CaseQuickActions quick action card still has Brak and does not reintroduce local AddCaseMissingItemDialog.

## Audyt ryzyk po etapie

- Plus: brak nowej migracji SQL ogranicza ryzyko RLS i danych.
- Minus: lead/client i case nadal maja dwa rozne persistence targety.
- Mitigacja: guard R14 zapisuje te roznice jako swiadomy kontrakt.
- Drozej pozniej: wspolne raportowanie "wszystkie braki w workspace" bedzie wymagalo tabeli missing_items.
- Nie pchac do GitHuba przed manualnym PASS C5.
