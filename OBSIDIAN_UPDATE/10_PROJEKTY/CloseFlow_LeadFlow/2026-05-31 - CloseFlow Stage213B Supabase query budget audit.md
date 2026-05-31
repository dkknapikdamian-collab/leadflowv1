---
typ: obsidian_update
stage: Stage213B
status: prepared
project: CloseFlow / LeadFlow
data: 2026-05-31
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
---

# 2026-05-31 - CloseFlow Stage213B Supabase query budget audit

## FAKTY

- Stage213A jest zamknięty: RLS/GRANT/Data API nie są tematem tego etapu.
- Stage213B wykonano jako audyt kosztu zapytań, bez SQL i bez zmian w Supabase.
- Przygotowano raport: `_project/reports/STAGE213B_SUPABASE_QUERY_BUDGET_AUDIT_2026-05-31.md`.
- Przygotowano guard: `scripts/check-stage213b-supabase-query-budget-audit.cjs`.
- Aktywny route `/` i `/today` prowadzi przez `TodayStable`, nie przez legacy `Today.tsx`.
- Główna ścieżka danych idzie przez `src/lib/supabase-fallback.ts` -> `/api/...` / `/api/system?...` -> `src/server/_supabase.ts` -> Supabase REST Data API.

## DECYZJE DAMIANA

- Nie pushować automatycznie.
- Nie dotykać RLS/GRANT/SQL po Stage213A.
- Najpierw scan i mapa kosztów, potem mały bezpieczny fix.
- Przy SQL zawsze rozdzielać PowerShell do schowka i czysty SQL do Supabase SQL Editor.

## HIPOTEZY AI

- Największy koszt robią pełne bundle odczyty, nie pojedyncze zapisy.
- `fetchTasksFromSupabase()` i `fetchEventsFromSupabase()` mają ukryty mnożnik przez parent index `clients?includeArchived=1` oraz `cases?includeArchived=1`.
- 30-sekundowy GET cache w `callApi` pomaga, ale nie wystarczy przy intervalach, focus refresh i wielu różnych endpointach.

## MAPA RYZYK

1. `src/pages/Calendar.tsx`  
   Największy mnożnik: initial bundle, trzy retry, live mutation refresh i opcjonalny refresh po Google inbound sync.

2. `src/pages/NotificationsCenter.tsx`  
   Jawny `setInterval(..., 60_000)` odpala pełny `fetchCalendarBundleFromSupabase()`.

3. `src/pages/TodayStable.tsx`  
   Aktywny ekran startowy ładuje tasks/leads/events/cases/drafts oraz odświeża po focus/visibility i mutacjach.

4. `src/lib/supabase-fallback.ts`  
   Ukryty mnożnik: task/event fetch dociąga archiwalne indeksy klientów i spraw.

5. `src/pages/Leads.tsx`, `src/pages/Clients.tsx`, `src/pages/Cases.tsx`  
   Listy pobierają dużo pełnych kolekcji do liczników, next action i wartości.

6. `src/pages/LeadDetail.tsx`, `src/pages/CaseDetail.tsx`  
   Widoki szczegółów pobierają całe taski/eventy i filtrują po stronie klienta.

## TESTY

Do wykonania lokalnie po wklejeniu paczki:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
node scripts/check-stage213b-supabase-query-budget-audit.cjs
npm run build
```

## RYZYKA

- Nie usuwać brutalnie retry w kalendarzu, bo było dodane jako stabilizacja hard refresh.
- Nie usuwać cache/dedupe w `callApi`.
- Nie ruszać SQL/RLS/GRANT w Stage213B/Stage213C bez osobnej decyzji.
- Nie optymalizować całego API naraz, bo łatwo uszkodzić dane w widokach.

## NASTĘPNY KROK

Stage213C - Supabase Query Budget Fix 1:

1. Ograniczyć polling w `NotificationsCenter.tsx`.
2. Uspokoić retry policy w `Calendar.tsx`.
3. Dodać throttle/TTL dla focus/visibility refresh w `TodayStable.tsx`.

Dopiero po tym Stage213D: lokalny licznik requestów / dev budget HUD.
