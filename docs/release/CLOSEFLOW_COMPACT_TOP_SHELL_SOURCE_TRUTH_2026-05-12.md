# CLOSEFLOW_COMPACT_TOP_SHELL_SOURCE_TRUTH_2026-05-12

## Cel

Usunąć ciężkie kafle nagłówkowe z widoków operatora na desktopie i przenieść rytm pracy bliżej górnego paska, żeby widok przy 100% zoomu był mniej przytłaczający i wymagał mniej scrollowania.

## Decyzja

Nie używamy `zoom`, `transform: scale()` ani sztucznego pomniejszania całej aplikacji.

Wprowadzamy desktopowy kontrakt gęstości:

```text
src/styles/closeflow-compact-top-shell-source-truth.css
```

Import jest globalny przez:

```text
src/components/Layout.tsx
```

## Zakres

- desktop od 901px i urządzenia z myszką/touchpadem,
- ukrycie copy ciężkiego `CloseFlowPageHeaderV2`, czyli kicker/title/description,
- pozostawienie akcji z nagłówków jako kompaktowego rzędu,
- przesunięcie treści wyżej,
- lekkie powiększenie tytułu aktywnej zakładki w globalnym pasku, np. `Dziś`, `Leady`, `Kalendarz`,
- brak zmian w routingu, danych, API i modelu biznesowym.

## Poza zakresem

- mobile,
- przebudowa sidebaru,
- usuwanie metryk/statystyk,
- zmiany logiki widoków.

## Kryterium zakończenia

- duży nagłówek typu `Priorytety i najbliższe ruchy` nie zabiera miejsca na desktopie,
- akcje strony nadal są dostępne,
- treść zaczyna się wyżej,
- górny pasek czytelniej pokazuje aktywną zakładkę.
