# CloseFlow / LeadFlow — Stage216M-R8 Client left rail + historia aktywności

## FAKTY
- Stage216M-R7 został wdrożony i wypchnięty.
- Damian potwierdził, że karta danych jest prawie poprawna, ale wymaga przesunięcia lewej szyny klienta o jeden takt w górę.
- Kafelek pod kartą danych klienta ma mieć ten sam wzór co leadowa `Historia aktywności`: ikonka, nazwa, fioletowy kolor, własna historia klienta.

## DECYZJE DAMIANA
- Poprawić pozycję lewej szyny ClientDetail.
- Zmienić `Ostatnie ruchy` w kliencie na `Historia aktywności`.
- Użyć tego samego wizualnego źródła prawdy co w LeadDetail.

## HIPOTEZY AI
- Wystarczy mały TSX patch copy/ikonki oraz CSS source truth dla kart historii.
- Jeżeli CSS nie domknie układu, kolejnym krokiem powinien być wspólny komponent TSX lewego raila.

## TESTY
- Guard Stage216M-R8
- `git diff --check`
- `npm run build`

## CZEGO NIE RUSZANO
- Prawa szyna
- Supabase
- API
- płatności
- dane
- Stage216D dirty files

## NASTĘPNY KROK
Apply ZIP, selektywny commit/push, screenshot lewej szyny klienta i leada.
