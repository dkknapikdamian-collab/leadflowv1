# FAZA 4 - Etap 4.4C - mutation bus coverage smoke v3

**Data:** 2026-05-04  
**Branch:** `dev-rollout-freeze`  
**Poprzedni etap:** FAZA 4 - Etap 4.4B import hotfix v10  
**Zakres:** dopięcie pokrycia mutation bus po realnym stanie repo.

## Co naprawia v3

V2 zatrzymało się na `src/pages/Tasks.tsx`, bo plik miał jeszcze import `subscribeCloseflowDataMutations` w innym imporcie niż oczekiwany.

V3 robi import cleanup brutalniej i bezpieczniej:

1. usuwa `subscribeCloseflowDataMutations` z każdego importu nazwanego, niezależnie od źródła,
2. usuwa puste importy po usunięciu tej nazwy,
3. dodaje dokładnie jeden import:

```text
import { subscribeCloseflowDataMutations } from '../lib/supabase-fallback';
```

4. sprawdza `Tasks`, `Calendar`, `TodayStable`.

## Cel

Po dodaniu albo zmianie zadania/wydarzenia aplikacja nie może wymagać pełnego odświeżenia strony.

## Zakres sprawdzany

Mutation bus:

- `CLOSEFLOW_DATA_MUTATED_EVENT`
- `emitCloseflowDataMutation`
- `subscribeCloseflowDataMutations`
- `window.dispatchEvent(new CustomEvent(...))`
- `apiGetCache.clear()`

Ekrany:

- `src/pages/Tasks.tsx`
- `src/pages/Calendar.tsx`
- `src/pages/TodayStable.tsx`

Każdy ekran musi:

- importować `subscribeCloseflowDataMutations` dokładnie raz z `../lib/supabase-fallback`,
- subskrybować mutation bus,
- wywoływać swój kontrolowany refresh,
- nie używać `window.location.reload()`.

## Manual evidence required

```text
manual_live_refresh_evidence_required
```

Test ręczny po deployu:

1. Otwórz `Dziś`.
2. W drugiej karcie dodaj task.
3. Sprawdź, czy `Dziś` odświeża się bez F5.
4. Otwórz `Kalendarz`.
5. Dodaj wydarzenie.
6. Sprawdź, czy `Kalendarz` odświeża się bez F5.

## Kryterium zakończenia

```text
npm.cmd run check:faza4-etap44c-mutation-bus-coverage-smoke
npm.cmd run build
```

## Następny etap

```text
FAZA 5 - Etap 5.1 - AI read vs draft intent
```
