# STAGE220A27B R2 - Payment history modal light polish - 2026-06-04

## Cel

Naprawić UX po A27B:
- modal Historia wpłat i korekt dziedziczył stary ciemny styl,
- tekst był czarny na ciemnym tle,
- opis był za długi i nieczytelny,
- dane wpłaty były rozbite na osobne pionowe linie.

## Zmiana

- wymuszono jasny VST surface dla modala historii wpłat,
- tytuły, opis, kontekst sprawy, wpisy i metadane mają jawne kolory VST,
- opis modala jest jednym krótkim wierszem oddzielonym kropkami środkowymi,
- Data/Wartość/Status są pokazane jako chipy w jednym wierszu,
- przycisk Koryguj w modalu ma primary VST.

## Nie ruszano

- SQL
- RLS
- API
- model refund
- logika liczenia finansów

## Test ręczny

1. Otwórz sprawę z wpłatą.
2. Kliknij Koryguj wpłatę.
3. Modal ma być jasny.
4. Tekst Data/Wartość/Status ma być widoczny.
5. Opis pod tytułem ma być krótki, w jednej linii lub naturalnie zawinięty na małym ekranie.
6. Kliknięcie Koryguj ma otworzyć modal korekty.
