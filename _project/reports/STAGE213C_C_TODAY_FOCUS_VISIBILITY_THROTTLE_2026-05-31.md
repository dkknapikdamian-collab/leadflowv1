---
typ: raport_stage
stage: Stage213C-C
status: repair2_prepared
project: CloseFlow / LeadFlow
data: 2026-05-31
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
---

# Stage213C-C - TodayStable focus/visibility throttle

## Cel

Ograniczyć koszt Supabase na ekranie `TodayStable` przez zatrzymanie pełnego odczytu danych przy każdym `focus` i `visibilitychange`.

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- poprzednie etapy: Stage213C-A NotificationsCenter, Stage213C-B Calendar retry policy

## Fakty z kodu

`TodayStable` ładuje pełny pakiet danych przez `loadStableTodayData()`:

- tasks,
- leads,
- events,
- cases,
- AI drafts.

Przed Stage213C-C focus/visibility refresh uruchamiał `refreshData({ manual: true })`, czyli pełny pakiet odczytów i spinner manualnego odświeżania po każdym powrocie do okna.

## Decyzja

Stage213C-C zmienia tylko background refresh:

- initial load zostaje wymuszony,
- ręczne `Odśwież dane` zostaje wymuszone,
- refresh po mutacjach zostaje wymuszony,
- operacje po delete/archive/done zostają wymuszone,
- focus/visibility refresh jest TTL-gated,
- TTL: 4 minuty,
- background refresh nie działa, gdy dokument nie jest widoczny,
- dodano dedupe in-flight, żeby kilka triggerów nie odpalało równoległych pełnych odczytów.

## Zakres plików

- `src/pages/TodayStable.tsx`
- `scripts/check-stage213c-c-today-focus-visibility-throttle.cjs`
- `_project/reports/STAGE213C_C_TODAY_FOCUS_VISIBILITY_THROTTLE_2026-05-31.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage213C-C TodayStable focus visibility throttle.md`

## Czego nie ruszano

- SQL
- RLS
- GRANT
- dane Supabase
- Calendar
- NotificationsCenter
- Google Calendar sync
- backupy

## Testy

```powershell
node scripts/check-stage213c-c-today-focus-visibility-throttle.cjs
npm run build
```

## Ryzyka

- Focus/visibility może nie pobrać natychmiast świeżych danych, jeśli ostatni odczyt był młodszy niż 4 minuty.
- To jest świadome ograniczenie kosztu. Mutacje i ręczny refresh nadal omijają TTL.

## Następny krok

Po apply i build PASS wykonać commit tylko 4 plików Stage213C-C. Potem ręczny test: `/`, przejście do innej zakładki, powrót przed i po 4 minutach, ręczny refresh, mutacja z innego ekranu.


## REPAIR2

Pierwsza paczka Stage213C-C miała błąd parsera PowerShell przez JSX z cudzysłowami w inline-stringu. REPAIR2 przenosi patchowanie do skryptu Node `tools/apply-stage213c-c-today-patch.cjs`, żeby uniknąć kruchych podmian w PowerShellu. Zakres funkcjonalny bez zmian.
