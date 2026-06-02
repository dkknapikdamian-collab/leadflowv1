# CloseFlow / LeadFlow - Stage216M-R15-R3

## FAKTY
- Poprzednie R15/R15-R1/R15-R2 nie domknęły funkcjonalnej zmiany notatek klienta.
- Problem: dyktowanie klienta zapisywało tekst w danych klienta (`form.notes`), a centralna sekcja notatek nie miała normalnego dodania tekstowej notatki.

## DECYZJE DAMIANA
- Notatki klienta mają być w centrum pracy.
- Nie ma być duplikatu pola notatki w edycji danych klienta.
- Dyktowanie ma zapisywać do notatki, nie pod kartą danych.

## ZAKRES ETAPU
- `ClientDetail.tsx`:
  - dodano composer notatki,
  - dodano `Dodaj notatkę`,
  - przepięto dyktowanie do composera,
  - usunięto pole `Notatka` z edycji danych klienta,
  - zapis aktywności jako `client_note_added`.
- CSS source truth dla composera notatek.
- Guard regresyjny.

## TESTY
- Guard R15-R3.
- `git diff --check`.
- `npm run build`.
- Test ręczny: notatka tekstowa i głosowa w centrum klienta.

## NASTĘPNY KROK
Po deployu sprawdzić UI notatek klienta i dopiero potem wracać do drobnego polerowania układu ClientDetail.
