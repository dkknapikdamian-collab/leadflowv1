# STAGE232G_R7A_CALENDAR_DONE_RESTORE_VISIBILITY_FLAGS_PRIORITY

Data/czas: 2026-06-25 14:35 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
status: PRIORYTET_NAPRAWY / DO_WDROZENIA_NEXT / BLOCKS_CALENDAR_ACTION_SMOKE
current deployed commit before R7A: daa09109

## Decyzja Damiana

Nie robimy dalszej recznej diagnostyki przez DevTools. Kalendarz wymaga mapowania i testow akcji. Pierwszy potwierdzony problem z kodu: `Zrobione` / `Przywroc` moze chowac wpis, bo status jest przywracany, ale flagi widocznosci `show_in_calendar/show_in_tasks` nie sa przywracane deterministycznie.

## Objaw

Damian kliknal `Zrobione`, potem `Przywroc`, a wpis zniknal. Wczesniej wpisy po czasie wracaly lub znikaly losowo.

## Dodatkowy sygnal

W konsoli pojawil sie `QuotaExceededError` na `localStorage.setItem`. To oznacza, ze mechanizmy oparte o localStorage nie moga byc traktowane jako pewna prawda stanu. Kalendarz ma mechanizm completed-retention w localStorage, wiec trzeba uniezaleznic podstawowe akcje od localStorage.

## Fakty z audytu

1. Calendar ma akcje: Edytuj, +1H, +1D, +1W, Zrobione/Przywroc, Usun.
2. `handleCompleteEntry()` dla eventow ustawia status `completed/scheduled`, ale nie ustawia jawnie `showInCalendar` przy restore.
3. `handleCompleteEntry()` dla taskow ustawia status `done/todo`, ale nie ustawia jawnie `showInCalendar/showInTasks` przy restore.
4. `event-route-stage124f.ts` i `task-route-stage124f.ts` potrafia ustawic `show_in_calendar=false` dla statusow completed/done.
5. Jezeli rekord byl ukryty przez `show_in_calendar=false`, samo przywrocenie statusu na `scheduled/todo` nie wystarczy, bo flaga moze zostac false.
6. Completed retention w Calendar opiera sie o localStorage i moze zachowywac sie niestabilnie przy zapelnionym storage.

## Werdykt

```txt
CODE BUG / CALENDAR_DONE_RESTORE_VISIBILITY_FLAGS
```

## Zakres R7A

1. `src/pages/Calendar.tsx`:
   - przy restore eventu wyslac `showInCalendar: true`,
   - przy restore taska wyslac `showInCalendar: true` i `showInTasks: true`,
   - nie polegac na localStorage retention jako jedynym mechanizmie widocznosci.

2. `src/server/event-route-stage124f.ts`:
   - status `completed/done` nie powinien automatycznie chowac eventu z Calendar, bo produktowy kontrakt mowi, ze zrobione wpisy maja byc widoczne jako wyszarzone/przekreslone.

3. `src/server/task-route-stage124f.ts`:
   - status `done/completed` nie powinien automatycznie chowac taska z Calendar.

4. Guard/test:
   - done/completed nie sa w hidden calendar statuses,
   - restore event/task przywraca show flags,
   - usuwanie dalej chowa rekordy deleted/archived/removed,
   - nie ruszac R6 inbound tombstone.

## Manual smoke po R7A

1. Utworz jeden wpis testowy.
2. Kliknij `Zrobione`.
3. Wpis ma zostac widoczny jako zrobiony/przekreslony, nie zniknac.
4. Kliknij `Przywroc`.
5. Wpis ma zostac widoczny jako aktywny.
6. Kliknij `Usun`.
7. Wpis ma zniknac i nie wrocic po 90 sekundach ani po syncu.

## Czego nie ruszac

- R4 timezone,
- R5 OAuth verification,
- R6 inbound tombstone,
- SQL/RLS,
- finance/billing/AI Drafts/Braki/Blokady.

## Status

```txt
STAGE232G_R7A_CALENDAR_DONE_RESTORE_VISIBILITY_FLAGS:
PRIORYTET_NAPRAWY / DO_WDROZENIA_NEXT
```
