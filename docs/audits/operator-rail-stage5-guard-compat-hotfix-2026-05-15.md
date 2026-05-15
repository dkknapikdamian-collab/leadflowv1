# Operator rail Stage 5 — guard compatibility hotfix

Data: 2026-05-15

## Problem

ETAP 5 świadomie usunął panel `Najcenniejsi klienci` z `/clients`, ale stare guardy Stage71/72/74/75 nadal traktowały ten panel jako obowiązkowy.

Dodatkowo wcześniejsza paczka hotfix miała błąd składni w skrypcie patchującym oraz uszkodzony regex w `scripts/check-operator-rail-stage5.cjs`.

## Naprawa

- Zaktualizowano guardy Stage71/72/74/75 do aktualnego kontraktu: `/clients` ma panel `Najcenniejsi klienci` oparty o `TopValueRecordsCard` i `buildTopClientValueEntries`.
- Naprawiono `scripts/check-operator-rail-stage5.cjs`.
- Dodano `scripts/check-operator-rail-stage5-guard-compat.cjs`.
- Przepięto stare selektory `operator-top-value-card` na `operator-top-value-card` w source-truth CSS/mapach.

## Czego nie cofnięto

- Nie przywrócono panelu `Najcenniejsi klienci`.
- Nie przywrócono `leadsNeedingClientOrCaseLink`.
- Nie zmieniono logiki wartości klientów ani leadów.
- Nie wykonano commita ani pushu.
