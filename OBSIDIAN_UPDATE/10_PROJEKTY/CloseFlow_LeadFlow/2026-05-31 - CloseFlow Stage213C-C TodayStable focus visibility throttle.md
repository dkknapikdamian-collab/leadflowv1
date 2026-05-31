# 2026-05-31 - CloseFlow Stage213C-C TodayStable focus visibility throttle

## FAKTY

- Projekt: CloseFlow / LeadFlow.
- Branch: `dev-rollout-freeze`.
- Etap: Stage213C-C.
- Poprzednie etapy query budget: Stage213C-A `NotificationsCenter`, Stage213C-B `Calendar`.
- `TodayStable` wykonuje pełny odczyt tasks/leads/events/cases/drafts.

## DECYZJE DAMIANA

- Kontynuujemy optymalizację Supabase Query Budget po Stage213B.
- Nie ruszamy SQL, RLS, GRANT ani danych Supabase.
- Etapy mają być małe i celowane.

## HIPOTEZY AI

- Największy sensowny zysk po NotificationsCenter i Calendar daje ograniczenie focus/visibility refresh na ekranie startowym.
- Ręczny refresh i refresh po mutacjach muszą zostać wymuszone, bo użytkownik oczekuje świeżego stanu po akcji.

## ZAKRES

- Dodano TTL 4 minuty dla background focus/visibility refresh.
- Dodano in-flight dedupe.
- Initial load, manual refresh, mutation refresh i operation refresh omijają TTL.
- Dodano guard Stage213C-C.

## TESTY

```powershell
node scripts/check-stage213c-c-today-focus-visibility-throttle.cjs
npm run build
```

## CZEGO NIE RUSZANO

- SQL
- RLS
- GRANT
- Google Calendar sync
- Calendar
- NotificationsCenter
- backupy
- dane Supabase

## NASTĘPNY KROK

Po pushu wykonać ręczny smoke test ekranu `/`:

1. Wejść na dashboard.
2. Sprawdzić initial load.
3. Kliknąć `Odśwież dane`.
4. Przejść do innej karty i wrócić przed upływem 4 minut.
5. Wrócić po upływie 4 minut.
6. Wykonać mutację zadania/leada i sprawdzić, czy dashboard odświeża stan.


## REPAIR2

- Powód: pierwsza paczka miała błąd parsera PowerShell na JSX/cudzysłowach.
- Zmiana naprawcza: patchowanie `TodayStable.tsx` przeniesiono do bezpiecznego skryptu Node.
- Zakres funkcjonalny bez zmian: focus/visibility dostaje TTL 4 min, initial/manual/mutation/operation pozostają wymuszone.
