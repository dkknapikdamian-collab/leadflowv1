# CloseFlow / LeadFlow - Stage219-R7 CaseDetail real refresh + flat cards

## FAKTY
Stage219-R6 nie wdrożył zmian źródłowych, ponieważ apply zatrzymał się na brakującym anchorze. Stage219-R7 ma naprawić realny przepływ: zapis notatki/zadania/wydarzenia → event zapisania → odświeżenie CaseDetail.

## DECYZJE DAMIANA
- Nie pchać bezpośrednio z czatu.
- Dostarczać ZIP + komendy.
- Widok sprawy ma być profesjonalny, czytelny i bardziej płaski.
- Cienkie opisy w kolorowych kaflach usunąć.
- Nazwa sprawy/klienta w górnej karcie ma być w jednym wierszu.

## ZAKRES
- `ContextActionDialogs.tsx`
- `CaseDetail.tsx`
- `closeflow-detail-view-source-truth-stage219.css`
- guard Stage219-R7
- raport `_project`

## TESTY
- guard Stage219-R7
- build
- git diff check

## NASTĘPNY KROK
Po pushu sprawdzić Vercel i dodać wydarzenie w sprawie. Sprawdzić, czy pojawia się w kaflu oraz w sekcji ostatnich działań.
