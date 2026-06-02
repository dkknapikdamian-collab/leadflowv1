# STAGE216M-R16 Client note modal source truth

## Cel
Ujednolicić notatki klienta z zachowaniem zachowania jak w LeadDetail: przyciski `Dodaj notatkę` i `Dyktuj notatkę` otwierają jedno okno notatki, a tekst nie trafia do panelu danych klienta.

## Fakty
- R15-R5 dodał zapis notatek klienta jako aktywność `client_note_added`.
- Po testach UI nadal trzeba ujednolicić sposób dodawania notatek z LeadDetail.

## Zakres
- ClientDetail.tsx
- page-adapters import CSS
- CSS adapter R16
- guard R16

## Decyzje
- Notatka klienta nie jest polem danych klienta.
- Notatka klienta jest aktywnością/notatką operacyjną.
- Dodawanie i dyktowanie klienta ma iść przez modal, nie inline composer i nie panel danych.

## Testy automatyczne
- `node tests/stage216m-r16-client-note-modal-source-truth-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Test ręczny
- Klient -> Notatki -> Dodaj notatkę otwiera modal.
- Klient -> Notatki -> Dyktuj notatkę otwiera ten sam modal.
- Dyktowanie wpisuje w pole modala.
- `Edytuj dane` nie pokazuje pola `Notatka`.
