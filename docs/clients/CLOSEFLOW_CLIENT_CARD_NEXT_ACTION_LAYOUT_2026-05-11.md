# CLOSEFLOW CLIENT CARD NEXT ACTION LAYOUT 2026-05-11

## Cel

Na liście `/clients` najbliższa akcja klienta ma być czytelna i ma znajdować się nad przyciskami akcji, a nie być upchnięta obok nich.

## Zakres

Etap dotyczy tylko układu karty klienta na liście klientów. Nie zmienia źródeł danych, filtrów, wyszukiwarki ani logiki ładowania klientów.

## Docelowa kolejność karty

1. Imię lub nazwa klienta oraz status.
2. Telefon, e-mail albo firma.
3. Wartość relacji, liczba spraw i leady.
4. Najbliższa akcja jako osobny blok.
5. Akcje na dole.

## Copy

Blok akcji używa krótszej etykiety:

- Najbliższa akcja
- Brak zaplanowanej akcji

## Responsywność

Przyciski akcji są na dole karty i mogą przechodzić do kolejnej linii na małych szerokościach. Tekst najbliższej akcji ma prawo łamać się w wielu liniach i nie może nachodzić na przyciski.

## Nie zmieniać

- Nie zmieniać źródeł danych klientów.
- Nie zmieniać filtrów.
- Nie zmieniać wyszukiwarki.
- Nie przebudowywać stylu całej listy.

## Check

`npm run check:closeflow-client-card-next-action-layout`

Weryfikuje import CSS, osobny blok najbliższej akcji, właściwe etykiety i zawijanie przycisków.
