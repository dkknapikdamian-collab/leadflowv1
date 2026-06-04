# STAGE220A27A - Payment correction history - 2026-06-04

## Cel

Dodać produkcyjny sposób cofania pomyłek we wpłatach bez cichego kasowania danych.

## Decyzja

Nie usuwamy oryginalnej wpłaty.
Korekta jest osobnym rekordem płatności:
- type: refund
- status: paid
- amount: dodatnia kwota korekty
- paidAt: data korekty
- note: powód korekty + opis oryginalnej wpłaty

## Efekt

- historia wpłat pokazuje oryginał i korektę,
- finanse sprawy odejmują refund,
- finanse klienta sumują już wartość po korekcie,
- historia aktywności dostaje payment_correction_added.

## Nie ruszano

- SQL
- RLS
- API
- routing
- schema danych

## Test ręczny

1. Sprawa ma wartość 1280 PLN.
2. Dodaj wpłatę 500 PLN.
3. Sprawdź: wpłaty 500, do domknięcia 780.
4. W historii wpłat kliknij Koryguj.
5. Wpisz korektę 500, datę i powód.
6. Zapisz.
7. Sprawdź: wpłaty 0, do domknięcia 1280.
8. Historia wpłat ma pokazać wpłatę i korektę.
9. Klient ma pokazać skorygowaną sumę wpłat.
