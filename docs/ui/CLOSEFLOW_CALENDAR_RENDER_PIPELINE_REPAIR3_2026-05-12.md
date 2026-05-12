# CloseFlow — Calendar Render Pipeline Repair3

## Diagnoza

Problem nie jest już pojedynczym kolorem. Kalendarz ma kilka aktywnych warstw z poprzednich prób:

- tooltip/color enhancer,
- month chip overlap,
- no-overlap repair,
- structural fix,
- plain text rows V4,
- selected-day V5/V6,
- kolejne repair CSS.

Część z nich nie tylko styluje CSS, ale też modyfikuje DOM po renderze. To właśnie rozwala treść:
- w tygodniu zostają małe kolorowe badge bez tekstu,
- w miesiącu tekst istnieje, ale jest ukryty przez kolor/tło,
- w „Wybrany dzień” zostaje samo `Zad`, bo runtime normalizer dotknął prawdziwych kart.

## Naprawa

Repair3:
- zostawia bazową skórkę kalendarza,
- usuwa stare eksperymentalne CSS importy,
- usuwa runtime efekty, które robiły `replaceChildren`,
- dodaje jedno końcowe źródło prawdy CSS dla kalendarza:
  - miesiąc: jasne chipy/kafelki + czarny tekst,
  - tydzień/lista/wybrany dzień: realne karty + widoczny tekst.

## Nie rusza

- API,
- Supabase,
- danych,
- tworzenia/edycji/usuwania,
- sidebaru,
- routingu.
