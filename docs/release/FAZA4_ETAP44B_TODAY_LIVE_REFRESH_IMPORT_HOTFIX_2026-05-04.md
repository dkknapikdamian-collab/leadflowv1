# FAZA 4 - Etap 4.4B import hotfix v10

**Data:** 2026-05-04  
**Branch:** `dev-rollout-freeze`  
**Zakres:** finalne czyszczenie importu mutation bus dla `TodayStable.tsx`.

## Problem

Po wcześniejszych próbach w pliku mogły zostać dwie kopie importu:

```text
import { subscribeCloseflowDataMutations } from '../lib/supabase-fallback';
```

To blokowało patch, mimo że kierunek naprawy był poprawny.

## Runtime error naprawiany przez ten etap

```text
TypeError: subscribeCloseflowDataMutations is not a function
APP_ROUTE_RENDER_FAILED
```

## Naprawa v10

V10 nie próbuje już delikatnie zgadywać struktury importów. Robi twarde czyszczenie:

1. usuwa `subscribeCloseflowDataMutations` z importu `react`,
2. usuwa wszystkie istniejące importy `subscribeCloseflowDataMutations` z `../lib/supabase-fallback`,
3. dodaje dokładnie jeden poprawny import z `../lib/supabase-fallback`,
4. sprawdza, że licznik poprawnego importu wynosi dokładnie `1`.

## Kryterium zakończenia

```text
npm.cmd run check:faza4-etap44b-today-live-refresh-import-hotfix
npm.cmd run build
```

## Następny etap

```text
FAZA 4 - Etap 4.4C - mutation bus coverage smoke / manual live refresh evidence
```
