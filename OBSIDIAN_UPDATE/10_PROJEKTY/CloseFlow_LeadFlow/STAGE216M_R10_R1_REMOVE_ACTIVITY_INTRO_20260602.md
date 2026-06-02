# CloseFlow / LeadFlow — Stage216M-R10-R1 remove activity intro

## FAKTY
- Stage216M-R10 został wdrożony i wypchnięty.
- Kolejna drobna korekta usuwa tekst pomocniczy z historii aktywności leada: `Ostatnie 5 zdarzeń powiązanych z tym leadem.`

## DECYZJE DAMIANA
- Kasujemy ten napis z widoku leada.

## ZAKRES
- `src/pages/LeadDetail.tsx`
- `tests/stage216m-r10-r1-remove-activity-intro-contract.test.cjs`

## TESTY
- guard R10-R1
- `git diff --check`
- `npm run build`

## NASTĘPNY KROK
Po tej drobnej korekcie wrócić do Stage216M-R11: prawa szyna ClientDetail hard render, szczególnie widoczność `Finanse klienta`.
