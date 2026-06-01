# CloseFlow - Stage216M-R3-R1 header actions repair

## FAKTY
Stage216M-R3 uszkodził JSX ClientDetail i build nie przeszedł. R3-R1 naprawia etap przez cofnięcie uszkodzonych plików R3 i bezpieczne ponowne zastosowanie zmian headera.

## DECYZJE DAMIANA
- Usunąć Edytuj z headera LeadDetail i ClientDetail.
- W obu headerach ma być Zapytaj AI.
- W ClientDetail zostaje Otwórz główną sprawę.
- Dane klienta nie są widoczne w headerze, bo są niżej jak w leadzie.

## TESTY
- Guard Stage216M-R3-R1
- git diff --check
- npm run build

## NASTĘPNY KROK
Po pozytywnym buildzie selektywny commit i push na dev-rollout-freeze.
