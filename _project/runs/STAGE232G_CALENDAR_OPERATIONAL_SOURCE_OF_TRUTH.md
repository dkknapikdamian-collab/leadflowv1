# STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH - audit / run decision

Data: 2026-06-15 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: DOCS_PREPARED / DO_WDROZENIA
Tryb: audit-first / source-of-truth / no runtime changes in this package

## Scan proof

Przeczytane pliki repo:

- `src/App.tsx`
- `src/pages/Calendar.tsx`
- `src/lib/scheduling.ts`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`

Lokalnego Obsidiana nie aktualizowano bezpośrednio z tego pakietu. Payload do synchronizacji jest w `_project/obsidian_updates/`.

## Fakty z kodu

- `/calendar` routuje do `src/pages/Calendar.tsx`.
- `Calendar.tsx` ładuje events/tasks/leads/cases/clients.
- Dane kalendarza przychodzą przez `fetchCalendarBundleFromSupabase()` oraz `fetchClientsFromSupabase()`.
- `combineScheduleEntries()` scala events/tasks/leads oraz operator-today catch-up entries.
- Month view pokazuje preview `dayEntries.slice(0, compact ? 3 : 4)` oraz `+ X więcej`.
- Selected-day panel pokazuje pełne `selectedDayEntries`.
- Week view ma `rollingWeekStart = new Date()`, co może blokować realne przewijanie tygodnia przez prev/next.
- `handleShiftEntry()` i `handleShiftEntryHours()` obsługują event/task/lead.
- `handleDeleteEntry()` blokuje unsupported kind i nie pokazuje fałszywego sukcesu.
- `handleCompleteEntry()` aktualizuje event/task, ale nie ma unsupported-kind gate dla lead; lead może dostać toast sukcesu bez realnej zmiany.
- Completed visibility działa przez statusy done/completed/complete/finished/closed/zrobione/wykonane/archived oraz flagi done/completedAt.
- DEV local seed istnieje i działa tylko przy `import.meta.env.DEV`.

## Decyzja produktu

Kalendarz ma być źródłem prawdy czasu operatora. Najważniejsze R1:

- naprawić anchor tygodnia,
- zablokować fałszywy sukces `Zrobione` dla lead/unknown,
- utrzymać month preview vs selected-day full list,
- utrzymać unsupported delete gate,
- guardować relacje i kolorystykę.

## Wdrożenie R1

Patrz etap `STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH` w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.

## Ryzyka

- Week nav może obecnie wyglądać jak działa, ale dane mogą zostawać na bieżącym tygodniu.
- `Zrobione` na lead może kłamać.
- DOM-normalizatory miesiąca są kruche i powinny być docelowo zastąpione renderowaniem w JSX.
- Client-only relation może nie być zapisywana przy create task/event.
- `getEntryTone()` jest lokalnym mapowaniem klas, nie pełnym centralnym VST tone map.

## Guardy do dodania

- `scripts/check-stage232g-calendar-operational-source-truth.cjs`
- `tests/stage232g-calendar-operational-source-truth.test.cjs`

## Test ręczny

Zobacz sekcję etapu w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.
