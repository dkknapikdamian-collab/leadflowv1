# STAGE54 - Client cases compact fit - 2026-05-04

## Cel
Sprawy w zakładce klienta mają mieścić się w kafelkach bez rozpychania układu i bez marketingowego opisu klienta.

## Zmieniono
- Usunięto tekst: Klient jest rekordem zbiorczym. Po wejściu w obsługę pracuj na konkretnej sprawie.
- Dodano kompaktowe style dla wierszy spraw w ClientDetail.
- Zmniejszono font tytułu, meta, statusów i akcji w kafelku sprawy.
- Długie tytuły i opisy są ograniczone do dwóch linii.

## Nie zmieniono
- API.
- Supabase.
- Modelu danych.
- Logiki lead -> klient -> sprawa.

## Weryfikacja
- npm.cmd run check:stage54-client-cases-compact-fit
- npm.cmd run check:stage53-client-operational-recent-moves
- npm.cmd run verify:ui-contrast
- npm.cmd run build

## Smoke test
1. Wejdź w Klienci -> konkretny klient -> Sprawy.
2. Sprawdź, czy kafelek sprawy mieści tekst bez rozpychania layoutu.
3. Sprawdź, czy usunięty opis nie pojawia się pod nazwą klienta ani w zakładce spraw.
