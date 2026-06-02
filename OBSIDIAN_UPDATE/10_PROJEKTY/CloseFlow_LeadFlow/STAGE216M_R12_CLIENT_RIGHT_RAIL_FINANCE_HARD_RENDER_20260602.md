# CloseFlow / LeadFlow - Stage216M-R12 Client right rail finance hard render

## FAKTY
- Etap dotyczy `ClientDetail`.
- R11 przeszedł build i push, ale UI nadal nie pokazywał stabilnie karty `Finanse klienta` w prawej szynie.
- W kodzie karta finansów istniała, ale potrzebny był marker strukturalny i mocniejszy kontrakt CSS.

## DECYZJE DAMIANA
- Usunąć copy: `Robocze notatki klienta są w centrum pracy...`.
- Usunąć copy: `5 najbliższych zadań i wydarzeń z datą powiązanych z tym klientem.`.
- Finanse klienta mają być widoczne po prawej stronie.

## HIPOTEZY AI
- Problem po R11 był już nie tyle w danych, ile w strukturze/stylach prawej szyny i słabym kontrakcie widoczności.
- Jeśli R12 nie domknie sprawy, trzeba przejść z CSS do refaktoru TSX prawej szyny.

## TESTY
- Guard R12.
- `git diff --check`.
- `npm run build`.

## RYZYKA
- Jeśli starsze style lub runtime nadal nadpisują układ, CSS może nie wystarczyć.
- Następny krok może wymagać wspólnego komponentu `ClientRightRail`.

## NASTĘPNY KROK
Apply/push R12 i screenshot prawej szyny klienta.
