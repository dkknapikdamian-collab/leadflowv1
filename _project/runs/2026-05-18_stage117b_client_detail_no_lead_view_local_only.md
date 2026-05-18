# Stage117B - ClientDetail no lead view local only

## Status
LOCAL ONLY / DO TESTOW.

## Problem
Damian zglosil, ze w kartotece klienta nie powinno byc widoku leadow.

## Decyzja
Klient ma byc ekranem klienta i spraw, a nie drugim ekranem leada.
Dane leadow moga zostac wczytane jako zrodlo pozyskania i kontekst techniczny, ale UI nie moze prowadzic uzytkownika do aktywnego cockpit leada z poziomu klienta.

## Zakres
- ClientDetail zostawia sprawy jako glowny widok pracy.
- Usuwa aktywne linki i akcje typu `Otworz lead` z ClientDetail.
- Usuwa liste leadow z zakladek klienta.
- Historia pozyskania zostaje jako sygnal read-only.
- Nie rusza modelu danych ani API-leadow, bo filtry klienta nadal sa potrzebne do historii i relacji.

## Pliki
- `src/pages/ClientDetail.tsx`
- `tests/client-relation-command-center.test.cjs`
- `tests/client-detail-final-operating-model.test.cjs`
- `tests/stage117b-client-detail-no-lead-view-contract.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `tools/patch-stage117b-client-detail-no-lead-view-local-only.cjs`

## Testy automatyczne w paczce
- `node --test tests/stage117b-client-detail-no-lead-view-contract.test.cjs`
- `node --test tests/client-relation-command-center.test.cjs`
- `node --test tests/client-detail-final-operating-model.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

## Tryb
Bez commita i bez pusha. Commit zbiorczy dopiero po przejsciu calej paczki i testach recznych.

## Test reczny
- Otworzyc klienta.
- Sprawdzic, czy zakladki klienta nie pokazuja listy leadow jako osobnego widoku.
- Sprawdzic, czy nie ma przycisku `Otworz lead`.
- Sprawdzic, czy sprawy klienta nadal sa widoczne i da sie wejsc w sprawe.
