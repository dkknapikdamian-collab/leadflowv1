# STAGE220A26B - Finance regression contract guard - 2026-06-03

## Cel

Dodać twardy guard po A25/A26, żeby nie wrócił błąd:
- klient ma wartość,
- sprawa nie ma wartości,
- wpłata zapisuje się, ale nie aktualizuje finansów sprawy/klienta,
- modal finansów wraca do starego ciemnego stylu,
- stare guardy A13/A14 wymuszają legacy source.

## Guard sprawdza

- klient tworzy sprawę z contractValue/expectedRevenue/remainingAmount,
- API spraw obsługuje aliasy caseValue/totalValue,
- CaseDetail używa effectiveCasePaymentsStage220A25,
- CaseDetail używa caseFinanceSourceStage220A26,
- modale finansowe mają cf-vst-dialog/cf-vst-input,
- A13/A14 akceptują A26 source,
- A25/A26 guardy są zgodne z nowym źródłem.

## Nie wdrażano

- cofania wpłat,
- korekt finansowych,
- SQL,
- RLS,
- API zmian biznesowych.

## Następny etap

Stage220A27: korekty finansowe / cofanie pomyłek przez storno albo wpis korygujący z historią, bez cichego kasowania.
