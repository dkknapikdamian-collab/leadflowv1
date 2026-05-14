# Stage71 - ręczny check /leads right rail alignment

## Cel

Karta **Najcenniejsze leady** na /leads ma startować równo z paskiem wyszukiwania/listy, bez pustego uskoku nad prawą kolumną.

## Co zostało dopięte

- src/styles/closeflow-leads-right-rail-layout-lock.css
- import w src/main.tsx po closeflow-right-rail-source-truth.css
- guard scripts/check-stage71-leads-right-rail-layout-lock.cjs
- test tests/stage71-leads-right-rail-layout-lock.test.cjs

## Sprawdź ręcznie

1. Otwórz /leads na desktopie około 2048x972.
2. Sprawdź przy 100% zoomu:
   - prawa karta startuje równo z paskiem wyszukiwania/listy,
   - nie ma pustego uskoku nad kartą,
   - karta jest jasna i czytelna.
3. Sprawdź przy około 80% zoomu:
   - nie robi się schodek,
   - prawa kolumna nie ucieka niżej.
4. Sprawdź mobile:
   - rail przechodzi pod listę,
   - nie rozwala szerokości,
   - nie powstaje poziomy scroll.

## Czego ta poprawka nie zmienia

- danych w leadach,
- filtrów,
- listy leadów,
- miesięcznego kalendarza,
- zawartości karty **Najcenniejsze leady**.
