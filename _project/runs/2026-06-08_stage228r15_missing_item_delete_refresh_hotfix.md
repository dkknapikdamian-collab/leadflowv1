# Stage228R15 - Missing item delete and no-refresh hotfix

- date: 2026-06-08 21:45 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Problem od Damiana

1. Dodanego braku nie da sie skasowac:
   - UI pokazuje: Błąd usuwania zadania
   - Supabase zwraca 400 / 23502
   - leads.next_action_title nie moze byc null.
2. Nowo dodane rzeczy z okienek sa widoczne dopiero po odswiezeniu aplikacji.

## Przyczyna techniczna

- LeadDetail dla braku uzywal ogolnego usuwania zadania przez DELETE.
- Produkcyjny trigger / synchronizacja next action probuje zapisac leads.next_action_title = null po usunieciu work item.
- ContextActionDialogs emituje closeflow:context-action-saved, ale LeadDetail i ClientDetail nie odswiezaly sie po tym evencie. CaseDetail juz mial listener.

## Zmiana

- LeadDetail:
  - Brak ma osobne akcje: Rozwiąż brak i Usuń brak.
  - Usuń brak robi soft-delete przez updateTaskInSupabase status=deleted zamiast DELETE /api/tasks.
  - status deleted traktowany jest jak zamkniety.
  - LeadDetail nasluchuje closeflow:context-action-saved i robi loadLead().
- ClientDetail:
  - Brak ma dodatkowy przycisk Usuń.
  - Usuń robi soft-delete status=deleted.
  - ClientDetail nasluchuje closeflow:context-action-saved i robi reload().
- CaseDetail:
  - bez zmian runtime; guard potwierdza istniejacy listener context-action-saved.
- Guard:
  - scripts/check-stage228r15-missing-item-delete-refresh.cjs

## SQL

Brak SQL. Nie dotykamy Supabase schema/RLS/GRANT.

## Testy automatyczne

- node scripts/check-stage228r11-shared-missing-item-flow.cjs
- node scripts/check-stage228r12-context-action-blocker-host.cjs
- node scripts/check-stage228r13-missing-item-status-resolve.cjs
- node scripts/check-stage228r14-c5-missing-items-no-sql-decision.cjs
- node scripts/check-stage228r15-missing-item-delete-refresh.cjs
- npm run build
- git diff --check

## Test po deployu

1. Lead -> Brak -> zapisz -> ma pojawic sie bez refresh.
2. Lead -> Usuń brak -> nie ma bledu next_action_title -> brak znika.
3. Client -> Brak -> zapisz -> ma pojawic sie bez refresh.
4. Client -> Usuń -> brak znika.
5. Sprawa -> Brak -> zapisz -> nadal odswieza sie przez istniejacy listener.
6. Regresja: Notatka/Zadanie/Wydarzenie/Brak dalej otwieraja modale.
