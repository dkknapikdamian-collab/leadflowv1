STAGE55_CLIENT_CASE_OPERATIONAL_PACK

# STAGE55 - Client case operational pack - 2026-05-04

## Cel
Zrobić większy pakiet porządkowy dla ekranu klienta i spraw w kliencie: mniej opisów, więcej realnej pracy, mniej rozjazdów kafelków.

## Zmieniono
- Dodano twardy kompaktowy layout dla wierszy/kafelków spraw w ClientDetail.
- Ograniczono długie tytuły, meta opisy i wartości do bezpiecznej liczby linii.
- Zmniejszono statusy, przyciski i meta teksty w sprawach klienta.
- Usunięto marketingowo-instruktażowe teksty o kliencie jako rekordzie zbiorczym oraz centrum relacji, jeśli występowały w źródle.
- Dodano zbiorczy verify:client-detail-operational-ui.

## Nie zmieniono
- API.
- Supabase.
- Modelu danych.
- Routingów biznesowych.

## Weryfikacja
- npm.cmd run check:stage55-client-case-operational-pack
- npm.cmd run verify:client-detail-operational-ui
- npm.cmd run build

## Smoke test
1. Wejdź w Klienci -> konkretny klient -> Sprawy.
2. Sprawdź, czy kafelki spraw nie rozpychają layoutu.
3. Sprawdź, czy długie tytuły/mety są przycięte, a nie wypychają karty.
4. Sprawdź, czy tekst o rekordzie zbiorczym nie występuje.

