# Stage117B v2 - ClientDetail no lead view local-only

## Status
LOCAL-ONLY / DO TESTU.

## Przyczyna v2
Pierwsza paczka Stage117B nie wykonała patcha, bo patcher miał błąd składni w Node przez osadzony wzorzec ścieżki w template literal. V2 nadpisuje patcher wersją bez ryzykownych template literal strings i dopiero potem uruchamia testy.

## Problem funkcjonalny
W kartotece klienta nie powinien istnieć aktywny widok leadów ani przyciski prowadzące do kokpitu leada. Lead może zostać w danych jako historia pozyskania, ale praca operacyjna klienta ma iść przez sprawy.

## Decyzja
- Nie usuwać API fetchu leadów całkowicie, bo lead jest źródłem pozyskania i częścią historii relacji.
- Usunąć aktywne elementy UI typu `Otwórz lead`, przejścia do `/leads/...`, fallback najbliższej akcji do leada oraz listę leadów w zakładce klienta.
- Zostawić sprawy jako główny widok pracy klienta.
- Zaktualizować stare kontrakty, które wymagały dwukierunkowego linkowania klient-lead.

## Pliki
- `src/pages/ClientDetail.tsx`
- `tests/client-relation-command-center.test.cjs`
- `tests/client-detail-final-operating-model.test.cjs`
- `tests/stage117b-client-detail-no-lead-view-contract.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `tools/patch-stage117b-v2-client-detail-no-lead-view-local-only.cjs`

## Testy automatyczne w paczce
- `node --test tests/stage117b-client-detail-no-lead-view-contract.test.cjs`
- `node --test tests/client-relation-command-center.test.cjs`
- `node --test tests/client-detail-final-operating-model.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

## Tryb
Bez commita i bez pusha.

## Test ręczny Damiana
- Otworzyć kartotekę klienta.
- Sprawdzić, czy nie ma widoku leadów ani przycisków otwierających leada.
- Sprawdzić, czy sprawy klienta nadal są dostępne i są głównym miejscem pracy.
- Sprawdzić, czy historia pozyskania jest tylko informacją, nie osobnym kokpitem leada.
