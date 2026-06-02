# CloseFlow Stage216M-R10-R4 - Client center tabs and intro lock

## FAKTY
- Stage216M-R10 przestawil srodek klienta na kierunek: kafelki -> aktywne sprawy -> notatki.
- Damian wskazal, ze pasek `Sprawy / Podsumowanie / Historia` spadl za nisko.
- Damian zaakceptowal uklad, w ktorym sprawy i notatki sa wspolnym obszarem, a historia osobno.

## DECYZJE DAMIANA
- Pasek zakladek ma byc pod kafelkami.
- Notatki i sprawy moga byc razem w glownym obszarze.
- Historia ma pozostac osobno.
- Usunac tekst pod historia aktywnosci leada.

## ZAKRES
- CSS order w ClientDetail.
- Defensywne ukrycie starego opisu historii leada.
- TSX cleanup w LeadDetail po klasie `lead-detail-left-card-intro`.

## TESTY
- R10-R4 guard.
- `git diff --check`.
- `npm run build`.

## NASTĘPNY KROK
Stage216M-R11: prawa szyna klienta, hard render `Finanse klienta`.
