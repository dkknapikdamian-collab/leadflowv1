# CLOSEFLOW_RECORD_LIST_DEDUPE_2026-05-12

## Cel

Usunąć duplikaty informacji z list Leadów i Klientów po wprowadzeniu wspólnego poziomego układu kart rekordów.

## Problem wejściowy

Na `/leads` te same fakty były widoczne w kilku miejscach:

- źródło `Telefon` jako osobny tekst obok kontaktu,
- źródło `Telefon` jako drugi chip pod statusem,
- wartość `0 PLN` bez podpisu w głównej części karty,
- osobna kolumna `Wartość` już pokazywała tę samą informację poprawnie.

Na `/clients` karta miała duplikaty:

- chip `Leady: 0`,
- fioletowy chip `Wartość: 0 PLN`,
- osobne kolumny `Sprawy` i relacyjna wartość już niosły właściwe informacje.

## Decyzja

Nie robimy nowego układu od zera. Deduplikujemy obecny wspólny kontrakt list przez:

- opisanie kontaktu w jednym miejscu,
- zostawienie wartości tylko w kolumnie wartości,
- zostawienie spraw/liczników tylko w dedykowanych kolumnach,
- ukrycie starych chipów, które dublują fakty.

## Zmiany

- `src/pages/Leads.tsx`
  - `getLeadPrimaryContact()` zwraca teraz opisany kontakt:
    - `Telefon: ...`,
    - `E-mail: ...`,
    - `Firma: ...`,
    - `Kontakt: -`.

- `src/styles/closeflow-record-list-source-truth.css`
  - ukrywa zduplikowane źródło i wartość w `/leads`,
  - ukrywa `Leady: ...` i fioletową wartość w `/clients`,
  - utrzymuje jeden wspólny rytm wizualny list.

- `scripts/check-closeflow-record-list-dedupe.cjs`
  - pilnuje, że reguły deduplikacji i fallback kontaktu nie znikną.

## Kryterium zakończenia

- `/leads`: nie ma dwóch napisów `Telefon`, a kontakt jest opisany jako `Telefon: numer` albo fallback.
- `/leads`: `0 PLN` bez podpisu znika z głównej sekcji, zostaje tylko dedykowana kolumna `Wartość`.
- `/clients`: znika chip `Leady: 0`.
- `/clients`: znika fioletowy chip `Wartość: 0 PLN`.
- Obie listy nadal korzystają z jednego wspólnego kontraktu wizualnego.
