# STAGE53 - Client operational recent moves - 2026-05-04

## Cel
Zastąpić marketingowy opis klienta konkretnym panelem operacyjnym.

## Zmieniono
- Usunięto tekst: Klient jako centrum relacji / ścieżka klienta / praca dzieje się w sprawie.
- Dodano panel Ostatnie ruchy na ekranie klienta.
- Panel pokazuje do 5 ostatnich aktywności powiązanych z klientem.
- Dodano link do pełnej aktywności.

## Nie zmieniono
- API.
- Supabase.
- Modelu danych.
- Routingu biznesowego.

## Weryfikacja
- npm.cmd run check:stage53-client-operational-recent-moves
- npm.cmd run verify:ui-contrast
- npm.cmd run build

## Smoke test
1. Wejdź w Klienci -> konkretny klient.
2. Sprawdź, że marketingowy opis pod nazwą klienta zniknął.
3. Sprawdź panel Ostatnie ruchy w prawym railu.
4. Kliknij Zobacz całą aktywność.
