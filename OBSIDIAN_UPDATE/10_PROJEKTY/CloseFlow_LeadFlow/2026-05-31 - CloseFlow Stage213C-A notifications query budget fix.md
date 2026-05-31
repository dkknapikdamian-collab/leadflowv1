---
typ: obsidian_update
stage: Stage213C-A
status: prepared_patch
project: CloseFlow / LeadFlow
data: 2026-05-31
---

# CloseFlow - Stage213C-A notifications query budget fix

## FAKTY

- Stage213B został zamknięty i wypchnięty w commit `38720f4c`.
- Stage213B wskazał `NotificationsCenter` jako szybki, bezpieczny punkt ograniczenia kosztu Supabase.
- `NotificationsCenter` miał pełny `fetchCalendarBundleFromSupabase()` wykonywany co 60 sekund.
- Stage213C-A ogranicza ten koszt bez dotykania SQL, RLS, GRANT, danych ani Google Calendar sync.

## DECYZJA DAMIANA / KIERUNEK

Robimy poprawki limitów Supabase etapami. Najpierw mały fix `NotificationsCenter`, potem osobno `Calendar`, potem osobno `TodayStable`.

## ZAKRES STAGE213C-A

- `src/pages/NotificationsCenter.tsx`
- `scripts/check-stage213c-a-notifications-query-budget.cjs`
- `_project/reports/STAGE213C_A_NOTIFICATIONS_QUERY_BUDGET_FIX_2026-05-31.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage213C-A notifications query budget fix.md`

## CO ZMIENIONO

- Pełny bundle Supabase nie jest już pobierany co 60 sekund.
- Zostaje odczyt na wejściu do widoku.
- Dodano ręczny przycisk odświeżenia.
- Dodano background refresh co 5 minut tylko przy widocznej zakładce.
- Dodano TTL 4 minuty i in-flight dedupe.
- Lokalny tick 60 sekund został tylko dla logów/snooze/permission, bez Supabase requestu.

## TESTY

Do wykonania lokalnie:

```powershell
node scripts/check-stage213c-a-notifications-query-budget.cjs
npm run build
```

## RYZYKA

- Dane powiadomień w tle mogą odświeżać się wolniej.
- Ręczny refresh ma być bezpiecznym zaworem dla użytkownika.
- Stage213D powinien dodać runtime request counter i zmierzyć realną różnicę.

## NASTĘPNY KROK

Po PASS i push Stage213C-A: Stage213C-B, ograniczenie retry w kalendarzu bez psucia hard refresh.

## REPAIR4 - korekta po pustym commicie kodu

FAKT: wcześniejszy commit `9d0a7c9a` dodał guard, raport i update Obsidiana, ale nie zawierał zmiany `src/pages/NotificationsCenter.tsx`, bo plik został cofnięty poleceniem `git checkout -- src/pages/NotificationsCenter.tsx` przed commitem.

DECYZJA: REPAIR4 nadpisuje pełny plik `NotificationsCenter.tsx` docelową wersją Stage213C-A i poprawia guard, żeby nie mylił lokalnego 60-sekundowego ticka logów z pollingiem pełnego Supabase bundle.

TESTY: wymagane `node scripts/check-stage213c-a-notifications-query-budget.cjs` oraz `npm run build`.

