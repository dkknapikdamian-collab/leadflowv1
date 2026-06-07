# 2026-06-07 - Stage227G1 Today Reschedule Actions run report

## Status
LOCAL_ONLY_READY po apply, guardach, testach i buildzie.

## FAKTY
- TodayStable dostaje +1D/+3D/+1W na kartach WorkItemCard.
- Zapis idzie przez istniejące updateTaskInSupabase / updateEventInSupabase.
- Karty używają Calendar visual source klas: cf-vst-button cf-selected-day-v9-action.
- Teksty "Powód: zaplanowane..." w Najbliższe 7 dni są usuwane.

## DECYZJE
- Bez SQL.
- Bez nowej tabeli.
- Bez nowej integracji Google Calendar w tym etapie.
- Google Calendar zależy od istniejącego mechanizmu synchronizacji po updateEventInSupabase, jeśli taki jest skonfigurowany.

## TESTY
- check:stage227g1-today-reschedule-actions
- test:stage227g1-today-reschedule-actions
- check:stage227f6-lead-strip-cadence-funnel-width
- check:stage227c3b-client-case-missing-item-runtime-wiring
- build
- git diff --check

## AUDYT RYZYK
- Jeśli Google outbound sync nie jest skonfigurowany, etap zaktualizuje Supabase i kalendarz aplikacji, ale nie zagwarantuje zapisu do Google Calendar.
- Przesunięcie Today musi być ręcznie sprawdzone na task/event i po odświeżeniu.
- WorkItemCard jest source of truth także dla innych widoków Today, więc zmiana propsów musi przejść build.

## NASTĘPNY KROK
Manualny runtime check. Po PASS selektywny commit/push.
