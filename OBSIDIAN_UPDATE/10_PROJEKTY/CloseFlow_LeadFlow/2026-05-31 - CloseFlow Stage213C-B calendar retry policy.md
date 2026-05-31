# 2026-05-31 - CloseFlow Stage213C-B calendar retry policy

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- stage: Stage213C-B
- report: `_project/reports/STAGE213C_B_CALENDAR_RETRY_POLICY_2026-05-31.md`

## FAKTY

- Stage213B wskazał `Calendar.tsx` jako największy mnożnik requestów Supabase.
- Stary mechanizm wykonywał initial load oraz retry po 250, 900 i 1800 ms.
- Stage213C-B nie rusza SQL, RLS, GRANT, danych Supabase, Google Calendar sync ani TodayStable.

## DECYZJA DAMIANA / OPERATORA

Wdrożyć mały patch: jeden warunkowy retry tylko wtedy, gdy initial bundle jest pusty albo zakończył się błędem.

## HIPOTEZA AI

Jeden retry po 900 ms wystarczy do ochrony przed typowym hard refresh race, a jednocześnie usuwa najbardziej kosztową serię trzech bezwarunkowych odczytów.

## TESTY

- `node scripts/check-stage213c-b-calendar-retry-policy.cjs`
- `npm run build`

## RYZYKA

- Jeżeli workspace/auth race trwa dłużej niż 900 ms, użytkownik może czasem zobaczyć pusty kalendarz. Wtedy Stage213C-B wymaga korekty do dwóch retry albo runtime request counter.

## NASTĘPNY KROK

Po lokalnym PASS: commit tylko 4 plików Stage213C-B. Potem obserwować hard refresh `/calendar` i zdecydować między Stage213C-C TodayStable throttle a Stage213D runtime request counter.

## REPAIR1

Pierwszy APPLY przerwał się na anchorze constants. REPAIR1 nie zmienia decyzji etapu: nadal ograniczamy tylko retry policy w `Calendar.tsx`, bez SQL/RLS/GRANT, bez Google sync i bez TodayStable. Zmieniono tylko sposób aplikowania patcha na bardziej odporny na istniejący format pliku.
