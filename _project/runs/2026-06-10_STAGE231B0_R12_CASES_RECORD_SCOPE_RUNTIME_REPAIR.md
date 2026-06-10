# STAGE231B0-R12-R7 — Final Cases runtime contract rescue

Status: LOCAL_ONLY_PREPARED

## Problem
Po R11 /cases nadal miał runtime błędy na wolnych zmiennych. Poprzednie częściowe R12 poprawki łamały naprzemiennie kontrakty R8/R9/R11/R12.

## Kontrakt końcowy
- activeCases: useMemo + filter((record) => !isClosedCaseStatus(record.status))
- closedCases: useMemo + filter((record) => isClosedCaseStatus(record.status))
- record.status występuje tylko w tych dwóch filtrach
- closedRecordStage231B0R8 nie występuje
- record?.status nie występuje
- helper bannera zawiera SPRAWA ZAMKNIĘTA

## Testy
- R12-R7 guard/test
- R12 guard/test
- R11 guard/test
- R9/R8/Stage231B0 regression
- delete-flow
- build
- git diff --check
