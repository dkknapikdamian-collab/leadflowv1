# STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT_PRIORITY

Data/czas: 2026-06-25 13:29 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
status: PRIORYTET_NAPRAWY / DO_WDROZENIA_NEXT
current deployed commit: 452dd1f0

## Decyzja Damiana

Dzialamy produkcyjnie. Problem przesuniecia godziny Google Calendar ma byc zapisany jako osobny etap naprawczy i wdrozony z guardami/testami, bez zgadywania i bez mieszania z OAuth verification.

## Problem produkcyjny

Damian dodal wpis na godzine 13:19 w CloseFlow, a po synchronizacji w Google Calendar wpis pokazal sie jako 15:19.

Objaw wskazuje na przesuniecie +2h, czyli dokladnie roznice Europe/Warsaw CEST wzgledem UTC.

## Audyt kodu / fakty

Sprawdzone pliki:

- `src/server/google-calendar-outbound.ts`
- `src/server/google-calendar-sync.ts`
- `src/lib/calendar-timezone-contract.ts`
- `src/server/task-route-stage124f.ts`
- `src/server/event-route-stage124f.ts`
- `src/pages/Calendar.tsx`
- `src/components/EventCreateDialog.tsx`
- `src/lib/supabase-fallback.ts`

Fakty:

1. Centralny kontrakt czasu istnieje w `src/lib/calendar-timezone-contract.ts`:
   - `CLOSEFLOW_DEFAULT_TIMEZONE = Europe/Warsaw`,
   - cel kontraktu: UI `datetime-local` Europe/Warsaw -> UTC w bazie -> Google `dateTime + timeZone` bez przesuniecia.
2. `task-route-stage124f.ts` i `event-route-stage124f.ts` importuja `normalizeCloseFlowDateTimeToUtcIso()` i przy POST/PATCH konwertuja input z UI do UTC.
3. `google-calendar-sync.ts` buduje Google time fields przez `utcIsoToGoogleDateTimeInDefaultZone(startIso, CLOSEFLOW_DEFAULT_TIMEZONE)`.
4. `google-calendar-outbound.ts` ma lokalny helper `asIsoDate(value)` oparty o `new Date(raw).toISOString()`.
5. Jezeli Supabase/REST zwroci timestamp bez offsetu, np. `2026-06-25T13:19:00`, Node/Vercel moze potraktowac to jako UTC, czyli 13:19Z. Potem konwersja do `Europe/Warsaw` da 15:19. To pasuje do objawu 13:19 -> 15:19.

## Werdykt

```txt
CODE BUG / OUTBOUND_TIMEZONE_PARSE_BUG
```

Nie jest to problem Google Calendar jako takiego. Google dostaje juz przesuniety czas z backendu.

## Zakres wdrozenia R4

1. `src/server/google-calendar-outbound.ts`:
   - usunac/naprawic lokalne `asIsoDate()` oparte tylko na `new Date(raw).toISOString()`;
   - uzyc centralnego `normalizeCloseFlowDateTimeToUtcIso()` dla no-offset datetime;
   - raw datetime bez offsetu traktowac jako Europe/Warsaw, nie jako UTC;
   - timestamp z `Z` albo `+02:00` nie moze byc podwojnie przesuwany.

2. Test/guard:
   - dodac guard `scripts/check-stage232g-r4-google-calendar-outbound-timezone-no-shift.cjs`;
   - dodac test `tests/stage232g-r4-google-calendar-outbound-timezone-no-shift.test.cjs`;
   - test ma sprawdzic, ze:
     - `2026-06-25T13:19:00` trafia do Google jako `13:19 Europe/Warsaw`, nie `15:19`,
     - `2026-06-25T11:19:00.000Z` trafia do Google jako `13:19 Europe/Warsaw`,
     - offsetowe `2026-06-25T13:19:00+02:00` nie jest podwojnie przesuniete.

3. Wymagane gate:
   - `node scripts/check-stage232g-r4-google-calendar-outbound-timezone-no-shift.cjs`,
   - `node --test tests/stage232g-r4-google-calendar-outbound-timezone-no-shift.test.cjs`,
   - `node scripts/check-cf-runtime-00-source-truth.cjs`,
   - `npm run build`,
   - `npm run verify:closeflow:quiet`,
   - `git diff --check`.

## Manual smoke Damiana

Po deploy success:

1. Konto z polaczonym Google Calendar.
2. Dodaj event/task w CloseFlow na godzine `13:19`.
3. Kliknij `Synchronizuj teraz`.
4. W Google Calendar ma byc `13:19`, nie `15:19`.
5. Edytuj ten sam wpis w CloseFlow na `14:05`.
6. Sync ma zaktualizowac ten sam event w Google, bez duplikatu.
7. W Google ma byc `14:05`.
8. Drugi sync nie tworzy duplikatu.

## Czego nie ruszac

- R3 onboarding UI,
- OAuth token storage,
- user-scoped connection,
- Google consent / verification config,
- SQL/RLS bez osobnej decyzji,
- Owner Control,
- finance/billing/AI Drafts/Braki/Blokady.

## Ryzyka

- Jezeli zmiana bedzie w zlym miejscu, mozna naprawic Google outbound, ale popsuc lokalny widok CloseFlow.
- Jezeli zrobimy prosta korekte `-2h`, popsujemy zime i wpisy z jawnym offsetem.
- Naprawa musi uzyc kontraktu strefy, nie stalej roznicy godzin.

## Status

```txt
STAGE232G_R4:
PRIORYTET_NAPRAWY / DO_WDROZENIA_NEXT / CODE_STAGE
```

## Nastepny krok

Przygotowac ZIP runtime R4 i przeprowadzic standard: apply -> guard/test -> build -> verify -> diff-check -> selective commit/push -> Vercel success -> smoke.
