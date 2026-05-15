# Operator rail Stage5 stabilizer

Data: 2026-05-15

## Cel

Ustabilizować cleanup po usunięciu panelu `stary panel spięcia leadów` z `/clients`.

## Naprawa

- `/clients` ma używać `TopValueRecordsCard` dla panelu `Najcenniejsi klienci`.
- Guardy Stage71/72/74/75 zostały przepisane na nową prawdę produktową.
- Naprawiono uszkodzony regex w teście `right-rail-card-source-of-truth.test.cjs`.
- Naprawiono składnię `check-operator-rail-stage5.cjs`.

## Brak pushu

Zmiany zostają lokalnie do zbiorczego commita/pusha.
