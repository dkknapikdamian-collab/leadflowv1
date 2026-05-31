---
typ: raport_stage
stage: Stage213C-B
status: prepared_patch
project: CloseFlow / LeadFlow
data: 2026-05-31
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
---

# Stage213C-B - Calendar retry policy

## Cel

Ograniczyć koszt Supabase w `src/pages/Calendar.tsx`, bez usuwania ochrony hard refresh i bez ruszania SQL, RLS, GRANT, Google Calendar sync albo TodayStable.

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- poprzedni etap: Stage213C-A zakończony commitami `08bccbd6` i `859014be`

## Fakty ze skanu

- `Calendar.tsx` wykonuje `refreshSupabaseBundle()` jako bundle Supabase + `fetchClientsFromSupabase()`.
- Stary start kalendarza wykonywał initial load i trzy timed retry: `250`, `900`, `1800` ms.
- Google inbound sync jest osobnym background etapem i ma zostać zachowany.
- Live refresh po mutacjach `task/event/lead/case/client` ma zostać zachowany.

## Decyzja

Stage213C-B zmienia retry z trzech bezwarunkowych timerów na jeden warunkowy retry:

- initial load zostaje,
- retry jest planowany tylko gdy initial load zwróci pusty bundle albo błąd,
- limit retry: 1,
- delay retry: 900 ms,
- Google inbound sync zostaje bez zmian,
- live mutation refresh zostaje bez zmian.

## Dlaczego tak

**Teza:** Nie wolno brutalnie usunąć retry, bo wcześniejsze etapy naprawiały hard refresh i workspace readiness. Ale trzy bezwarunkowe retry po każdym wejściu w kalendarz to kosztowy generator zapytań Supabase.

**Poziom przekonania:** 8/10.

**Argument za:** zachowujemy ochronę przed pustym kalendarzem, ale nie odpalamy czterech bundle reads, gdy pierwszy odczyt już przyniósł dane.

**Argument przeciw:** jeżeli race pojawia się dopiero po 1800 ms, jeden retry może nie złapać części przypadków. To trzeba obserwować ręcznie.

**Co zmieniłoby decyzję:** runtime test pokaże, że po hard refresh kalendarz czasem zostaje pusty mimo istniejących danych.

**Najkrótszy test:** hard refresh `/calendar`; dane mają się pojawić, guard ma przejść, build ma przejść, a kod nie może zawierać `[250, 900, 1800].map(...)`.

## Testy

```powershell
node scripts/check-stage213c-b-calendar-retry-policy.cjs
npm run build
```

## Czego nie ruszano

- SQL
- RLS
- GRANT
- dane Supabase
- Google Calendar sync
- TodayStable
- NotificationsCenter
- backupy, `.bak`, `dist`

## Następny krok

Po PASS commitować tylko 4 pliki Stage213C-B. Następny etap po tym: Stage213C-C TodayStable focus/visibility throttle albo runtime request counter Stage213D, zależnie od zachowania kalendarza.

## REPAIR1 - robust patcher

Pierwsza paczka zatrzymała się na zbyt kruchym literalnym anchorze constants. REPAIR1 używa bezpieczniejszych anchorów ASCII i regexu dla całego efektu `STAGE114E_CALENDAR_HARD_REFRESH_READY_RETRY_CONTRACT`, bez zmiany zakresu etapu.
