# Stage216M-R16-R1 - Client note modal source truth repair

## FAKTY
- R15-R5 naprawił techniczny zapis notatek klienta.
- UX nadal nie był zgodny z LeadDetail, bo klient miał inline composer.
- R16 nie wszedł przez brak anchora importu dialogu.

## DECYZJE DAMIANA
- Notatki klienta mają działać jak w leadzie.
- `Dodaj notatkę` i `Dyktuj notatkę` mają otwierać istniejący modal notatki, nie tworzyć pola pod danymi klienta.

## HIPOTEZY AI
- Najbezpieczniejszy fix: modal własny w `ClientDetail.tsx`, bez zależności od dodatkowego importu `Dialog`.

## ZAKRES
- `src/pages/ClientDetail.tsx`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/stage216m-r16-r1-client-note-modal-source-truth.css`
- `tests/stage216m-r16-r1-client-note-modal-source-truth-contract.test.cjs`

## TESTY
- guard R16-R1
- `git diff --check`
- `npm run build`

## NASTĘPNY KROK
Po deployu sprawdzić ręcznie dodawanie notatki tekstowej i głosowej w kliencie.
