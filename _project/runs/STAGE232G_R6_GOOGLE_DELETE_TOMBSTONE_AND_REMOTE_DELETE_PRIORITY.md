# STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE_PRIORITY

Data/czas: 2026-06-25 13:55 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
status: PRIORYTET_NAPRAWY / DO_WDROZENIA_NEXT / BLOCKS_R4_SMOKE_CLOSE
current deployed commit before R6: 33043397

## Decyzja Damiana

R4 smoke nie moze byc uznany za zamkniety, bo przed pelnym testem czasu pojawil sie nowy produkcyjny problem: usuniety wpis w kalendarzu wraca natychmiast.

Hipoteza Damiana: wpis moze wracac z Google Calendar, bo nadal istnieje po stronie Google. Audyt kodu potwierdza, ze jest to bardzo prawdopodobny mechanizm.

## Problem produkcyjny

Uzytkownik usuwa wpis z kalendarza CloseFlow. Wpis znika lokalnie, ale po odswiezeniu / natychmiastowym refreshu wraca.

## Fakty z audytu kodu

Sprawdzone pliki:

- `src/pages/Calendar.tsx`
- `src/lib/supabase-fallback.ts`
- `src/server/event-route-stage124f.ts`
- `src/server/task-route-stage124f.ts`
- `src/server/google-calendar-inbound.ts`
- `src/server/google-calendar-outbound.ts`
- `src/server/google-calendar-sync.ts`

Fakty:

1. `Calendar.tsx` delete handler po kliknieciu delete:
   - dla eventu wywoluje `deleteEventFromSupabase(sourceId)`,
   - dla taska wywoluje `deleteTaskFromSupabase(sourceId)`,
   - usuwa wpis z lokalnego state,
   - potem robi `refreshSupabaseBundle()`.
2. `deleteEventFromSupabase()` wywoluje tylko `/api/events?id=...` z `DELETE`. Nie usuwa Google eventu.
3. `deleteTaskFromSupabase()` robi soft delete lokalnego taska. Nie usuwa Google eventu.
4. `event-route-stage124f.ts` i `task-route-stage124f.ts` robia soft delete: `status='deleted'`, `show_in_calendar=false`, `show_in_tasks=false`.
5. `google-calendar-inbound.ts` przy aktywnym Google evencie szuka istniejacego work item po canonical key `workspace_id + source_provider + source_external_id` i jesli znajdzie istniejacy wiersz, robi `safePatchWorkItem(existingId, payload)`.
6. `basePayload()` w inbound ustawia dla aktywnego Google eventu `status='scheduled'`, `show_in_calendar=true`, `google_calendar_sync_status='synced'`.
7. W obecnym kodzie nie ma tombstone guardu: lokalnie usuniety rekord z `source_provider=google_calendar` i tym samym `source_external_id` moze zostac odtworzony przez inbound, jesli Google event nadal istnieje.

## Werdykt

```txt
CODE BUG / GOOGLE_DELETE_RESURRECTION
```

To nie jest R4 timezone bug. To osobny problem delete lifecycle przy Google Calendar.

## Produkcyjny kontrakt do wdrozenia

Usuniecie wpisu w CloseFlow musi miec jednoznaczna semantyke:

1. Dla wpisu czysto lokalnego:
   - soft delete lokalny wystarcza.

2. Dla wpisu polaczonego z Google Calendar:
   - usuniecie z CloseFlow nie moze zostac cofnięte przez inbound sync,
   - trzeba albo:
     A. usunac/pobrac remote Google event przez Calendar API i oznaczyc lokalny rekord jako deleted,
     albo
     B. zapisac lokalny tombstone `local_deleted_at/source_deleted_at/delete_source=closeflow` i inbound ma ignorowac/nie reaktywowac ten sam Google event.

Rekomendacja produkcyjna R6:

- R6A: tombstone-first, bezpieczne minimum: inbound nie reaktywuje lokalnie usunietego wpisu Google.
- R6B: remote delete/propagation: jesli user usuwa z CloseFlow wpis powiazany z Google, system usuwa tez event w Google albo pokazuje jasna opcje.

W pierwszym hotfixie priorytet: zatrzymac odtwarzanie wpisu.

## Zakres R6

1. `google-calendar-inbound.ts`:
   - wykryc, ze existing work item jest lokalnie usuniety: `status in deleted/archived/removed`, `show_in_calendar=false`, `source_deleted_at/local_deleted_at/deleted_at` itp.;
   - dla aktywnego Google eventu nie patchowac go z powrotem do `scheduled/show_in_calendar=true`;
   - zwrocic action `skipped_local_deleted` albo podobny licznik.

2. Delete routes/UI:
   - przy delete lokalnego Google-linked event/task zapisac tombstone pola, jezeli schema pozwala:
     - `status='deleted'`,
     - `show_in_calendar=false`,
     - `show_in_tasks=false`,
     - `source_deleted_at` albo `deleted_at` / `local_deleted_at`,
     - `google_calendar_sync_status='delete_pending'` albo `local_deleted` jeśli kolumny istnieją.
   - safe/variant path musi stripowac brakujace kolumny, jezeli schema starsza.

3. Optional R6B / po potwierdzeniu:
   - usuniecie remote Google eventu przez `deleteGoogleCalendarEvent()` w outbound albo osobny delete propagation job,
   - po sukcesie oznaczyc sync status jako deleted/synced.

4. Guard/test:
   - test, ze inbound nie reaktywuje `status=deleted + show_in_calendar=false` dla tego samego Google `source_external_id`;
   - test, ze aktywny nieusuniety Google event dalej aktualizuje istniejacy rekord;
   - test, ze usuniecie lokalne nie blokuje innych Google eventow.

## Manual smoke Damiana po R6

1. Utworz wpis w CloseFlow i zsynchronizuj do Google.
2. Usun wpis w CloseFlow.
3. Kliknij refresh / wejdz ponownie w Calendar.
4. Wpis nie moze wrocic.
5. Kliknij `Synchronizuj teraz`.
6. Wpis nadal nie moze wrocic.
7. Jezeli R6B obejmie remote delete: sprawdz, ze zniknal tez z Google Calendar.

## Czego nie ruszac w R6

- R4 timezone logic,
- Google OAuth verification R5,
- R3 onboarding UI,
- finance/billing/AI Drafts/Braki/Blokady,
- SQL/RLS bez osobnej decyzji.

## Status

```txt
STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE:
PRIORYTET_NAPRAWY / DO_WDROZENIA_NEXT / BLOCKS_R4_SMOKE_CLOSE
```

## Nastepny krok

Najpierw nie robic pelnego smoke R4 jako CLOSED. Zrobic R6 jako kolejny runtime hotfix: tombstone guard w inbound + delete lifecycle guard/test.

## R6A runtime implementation package - 2026-06-25 14:10 Europe/Warsaw

Status: APPLIED_LOCAL_PENDING_FULL_GATE_AND_OWNER_SMOKE.

Runtime scope:
- inbound Google Calendar sync detects local deleted/tombstoned Google-linked rows;
- active Google event no longer resurrects a local deleted work item;
- action returned: skipped_local_deleted;
- R6A does not yet remove remote Google event.

Required tests:
- node scripts/check-stage232g-r6-google-delete-tombstone-and-remote-delete.cjs
- node --test tests/stage232g-r6-google-delete-tombstone-and-remote-delete.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
