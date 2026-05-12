# CLOSEFLOW_CASE_DETAIL_HISTORY_SORT_REPAIR_2026-05-12

## Cel

Naprawić runtime error na ekranie szczegółów sprawy:

`ReferenceError: sortCaseHistoryItemsStage14D is not defined`

## Przyczyna

W aktywnym `CaseDetail.tsx` istnieje ścieżka Stage14D dla historii sprawy i build produkcyjny odwołuje się do nazwanego sortera `sortCaseHistoryItemsStage14D`, ale sam helper nie był zdefiniowany w module. Build Vite przechodził, bo nie uruchamia pełnego typechecka, a błąd wychodził dopiero w przeglądarce po wejściu w szczegóły sprawy.

## Zakres

- `src/pages/CaseDetail.tsx`
- `scripts/check-closeflow-case-detail-history-sort-repair.cjs`
- `package.json`

## Decyzja

Dodajemy nazwany, czysty helper `sortCaseHistoryItemsStage14D` przed `buildCaseHistoryItemsStage14D` i przepinamy budowanie historii na ten helper. Nie ruszamy logiki zapisu, Supabase, płatności ani UI innych ekranów.

## Kryterium zakończenia

- `npm run check:closeflow-case-detail-history-sort-repair` przechodzi.
- `npm run build` przechodzi.
- Ekran `/cases/:id` nie wywala `ReferenceError: sortCaseHistoryItemsStage14D is not defined`.
