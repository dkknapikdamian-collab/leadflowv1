# Stage 31 v5 — Dziś: widoczne cyfry w kafelkach

## Cel

Poprawka po screenie, gdzie górne kafelki w `Dziś` nadal miały prawie niewidoczne liczby.

## Co zmieniono

- Helper łapie prawdziwy wrapper kafelka, nie tylko wewnętrzny element.
- Duże liczby dostają klasę runtime `today-stage31-shortcut-number`.
- W CSS wymuszono:
  - `opacity: 1 !important`,
  - ciemny kolor,
  - `-webkit-text-fill-color`.
- Zachowano poprzednie działanie:
  - klik kafelka rozwija właściwą sekcję,
  - sekcja idzie na górę,
  - pozostałe sekcje zwijają się.

## Bez pusha

Ten etap jest lokalny. Skrypt nie robi commita ani pusha.
