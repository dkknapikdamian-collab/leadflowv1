---
typ: raport_stage
stage: Stage213C-A
status: prepared_patch
project: CloseFlow / LeadFlow
data: 2026-05-31
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
---

# Stage213C-A - Notifications query budget fix

## Cel

Ograniczyć koszt Supabase w `src/pages/NotificationsCenter.tsx`, bez ruszania SQL, RLS, GRANT, danych, Google Calendar sync, `Calendar.tsx` ani `TodayStable.tsx`.

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian folder: OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow
- poprzedni etap: Stage213B, commit 38720f4c

## Fakty

Stage213B wskazał `NotificationsCenter` jako jeden z najczystszych winowajców limitów, bo widok odpalał pełny `fetchCalendarBundleFromSupabase()` co 60 sekund przez `setInterval`.

## Co zmieniono

W `src/pages/NotificationsCenter.tsx`:

- pełny bundle Supabase nadal ładuje się na wejściu do widoku,
- dodano ręczny przycisk `Odśwież`,
- automatyczny background refresh działa co 5 minut, ale tylko przy widocznej zakładce,
- dodano TTL 4 minuty, aby focus/visibility nie robiły pełnego requestu co chwilę,
- dodano in-flight dedupe, aby nie odpalać równoległych bundle requestów,
- zostawiono lokalny tick co 60 sekund dla logów, snooze i permission, ale bez Supabase requestu,
- dodano marker `data-stage213c-a-notifications-query-budget`.

## Dlaczego tak

To jest pierwszy bezpieczny fix po audycie. Nie zmienia modelu danych i nie dotyka RLS/SQL, a usuwa kroplujący koszt: pełny odczyt calendar bundle co minutę.

## Ryzyka

- Powiadomienia mogą być odświeżane mniej agresywnie w tle.
- Jeśli użytkownik potrzebuje natychmiastowej świeżości, ma ręczny przycisk `Odśwież`.
- Runtime request counter w Stage213D powinien zmierzyć realny zysk.

## Testy

Wymagane lokalnie:

```powershell
node scripts/check-stage213c-a-notifications-query-budget.cjs
npm run build
```

## Czego nie ruszano

- SQL
- RLS
- GRANT
- dane Supabase
- Google Calendar sync
- Calendar retry policy
- TodayStable focus/visibility refresh
- backupy, `.bak`, `_project/backups`, `dist`

## Następny krok

Po PASS: commit/push tylko 4 plików Stage213C-A. Następny etap: Stage213C-B, ostrożne ograniczenie retry w `Calendar.tsx`.

## REPAIR4 - korekta po pustym commicie kodu

FAKT: wcześniejszy commit `9d0a7c9a` dodał guard, raport i update Obsidiana, ale nie zawierał zmiany `src/pages/NotificationsCenter.tsx`, bo plik został cofnięty poleceniem `git checkout -- src/pages/NotificationsCenter.tsx` przed commitem.

DECYZJA: REPAIR4 nadpisuje pełny plik `NotificationsCenter.tsx` docelową wersją Stage213C-A i poprawia guard, żeby nie mylił lokalnego 60-sekundowego ticka logów z pollingiem pełnego Supabase bundle.

TESTY: wymagane `node scripts/check-stage213c-a-notifications-query-budget.cjs` oraz `npm run build`.

