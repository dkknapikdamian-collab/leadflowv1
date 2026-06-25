# STAGE232G_R7_CALENDAR_ACTION_SOURCE_IDENTITY_DEDUPE_AUDIT

Data/czas: 2026-06-25 16:30 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
status: PRIORYTET_NAPRAWY / BLOCKER_PRODUKCYJNY / DO_WDROZENIA_NEXT
current deployed commit before R7: daa09109

## Decyzja Damiana

Nie robic kolejnych zgadywanych hotfixow. Kalendarz ma powazny problem stanu: raz wpis sie kasuje, raz nie, akcje `Zrobione`, `Przywroc`, `Usun` moga dzialac na rozne fizyczne rekordy widoczne jako ten sam wpis. Trzeba zmapowac i naprawic source-of-truth oraz action state machine.

## Dane z produkcyjnego loggera

Test z tytulem `R7-ACTION-AUDIT-TEST` pokazal kilka niezaleznych rekordow o tym samym tytule:

1. Stary task lokalny:
   - id: `77b94433-fd4c-455b-a8e6-a7d83ad90dc5`
   - record_type: `task`
   - status: `todo`
   - show_in_calendar: `false`

2. Google/import event:
   - id: `6cf9f8cb-1b1e-4e99-8a2c-01f9d713123e`
   - record_type: `event`
   - type: `external_google_event`, potem `event`
   - status: `scheduled/done/scheduled`
   - show_in_calendar: `true`

3. Nowy task lokalny:
   - id: `c26ca5af-49cf-4dcf-98df-425cd9bc841b`
   - record_type: `task`
   - status: `todo/done/todo`
   - show_in_calendar zmienia sie po operacjach
   - po sync ma `google_calendar_event_id`, ale `source_provider` i `source_external_id` pozostaja `null`.

## Fakty techniczne z logu

- Klik `Synchronizuj teraz` wywolal `/api/google-calendar?route=sync-outbound` i zwrocil `created=0`, `updated=1`, `skipped=7`, `personalScopeSkipped=7`.
- Klik `Zrobione` najpierw poszedl na task `c26ca5af...` przez `/api/system?apiRoute=tasks`.
- Drugi klik `Zrobione` poszedl na event `6cf9f8cb...` przez `/api/events`.
- Klik `Przywroc` najpierw poszedl na event `6cf9f8cb...`, potem na task `c26ca5af...`.
- Completed retention zapisywal task i event pod osobnymi kluczami localStorage.
- W logu widac akcje PATCH/GET/POST, nie widac pelnej wiarygodnej sekwencji DELETE dla testu R7.

## Fakty techniczne z kodu

`google-calendar-inbound.ts` szuka istniejacego rekordu najpierw po canonical key:

```txt
workspace_id + source_provider=google_calendar + source_external_id=google event id
```

Potem szuka po `google_calendar_event_id`, ale w scoped query z `source_user_id=eq.userId`.

Jesli outbound-stamped lokalny task ma `google_calendar_event_id`, ale nie ma `source_provider/source_external_id/source_user_id`, inbound moze go nie znalezc i stworzyc osobny `external_google_event`.

## Werdykt

```txt
CODE BUG / CALENDAR_ACTION_SOURCE_IDENTITY_SPLIT_BRAIN
```

Problem nie jest tylko w delete. Kalendarz ma split brain: jeden logiczny wpis moze istniec jako local task + imported Google event + stary hidden task. UI pokazuje podobne/identyczne tytuly, a przyciski ida w rozne rekordy.

## Zakres R7A - naprawa produkcyjna source identity

1. Outbound sync:
   - po utworzeniu/aktualizacji Google eventu dla lokalnego task/eventu zapisac canonical Google identity na lokalnym rekordzie:
     - `google_calendar_event_id`,
     - `source_provider='google_calendar'`,
     - `source_external_id=<google event id>`,
     - `source_user_id=<user id>`,
     - `google_calendar_user_id=<user id>`,
     - `owner_user_id`/`created_by_user_id`, jesli schema pozwala.
   - safePatch musi usuwac brakujace kolumny, jesli schema starsza.

2. Inbound sync:
   - findExistingWorkItem musi znalezc lokalny rekord po `workspace_id + google_calendar_event_id`, nawet jesli `source_user_id` jest null;
   - dopiero jesli nie ma takiego rekordu, moze utworzyc `external_google_event`;
   - jesli znajdzie lokalny task/event bez canonical source fields, ma je uzupelnic, nie tworzyc duplikatu.

3. Bundle/display:
   - nie pokazywac dwoch fizycznych rekordow jako jednego logicznego wpisu Google-linked;
   - jesli istnieje local task z `google_calendar_event_id` i imported event z tym samym Google id, preferowac lokalny source-of-truth lub zmerge'owac.

4. Action state machine:
   - `Zrobione`, `Przywroc`, `Usun`, `+1H`, `+1D`, `+1W`, `Edytuj` musza miec ten sam source identity i stabilny `sourceId`;
   - guard musi wykryc, gdy jeden visible title/source jest powielony jako task+event.

5. Delete lifecycle:
   - po R7A dopiero domknac R6B/R7B: delete remote Google albo tombstone po canonical Google id.

## Testy/guardy R7A

- guard: `scripts/check-stage232g-r7-calendar-action-source-identity-dedupe.cjs`
- test: `tests/stage232g-r7-calendar-action-source-identity-dedupe.test.cjs`

Przypadki:

1. Local task po outbound sync dostaje `source_provider/source_external_id/source_user_id`.
2. Inbound z tym samym Google event id aktualizuje lokalny task, nie tworzy external eventu.
3. Inbound umie znalezc local row po `google_calendar_event_id` bez `source_user_id`.
4. Bundle nie pokazuje local task + imported event jako dwoch osobnych wpisow.
5. `Zrobione`/`Przywroc` nie przerzuca sie losowo miedzy taskiem i eventem.
6. Delete local Google-linked row tworzy tombstone po Google id.

## Czego nie ruszac

- R4 timezone logic poza testem regresji,
- R5 Google OAuth verification,
- Owner Control,
- LeadDetail/ClientDetail/CaseDetail,
- finance/billing/AI Drafts,
- SQL/RLS bez osobnej decyzji.

## Status

```txt
STAGE232G_R7_CALENDAR_ACTION_SOURCE_IDENTITY_DEDUPE_AUDIT:
PRIORYTET_NAPRAWY / BLOCKER_PRODUKCYJNY / DO_WDROZENIA_NEXT
```

## Nastepny krok

Przygotowac ZIP R7A. Najpierw naprawa source identity i de-dupe, potem dopiero test delete/smoke. Nie robic juz recznych testow na produkcji, dopoki R7A nie wejdzie.
