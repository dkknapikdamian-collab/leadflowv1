# CLOSEFLOW_STAGE40_REPAIR2_CHECK_SCRIPT_ESCAPE_FIX_2026-05-11

## Problem

Repair1 naprawił `package.json`, ale wygenerował niepoprawny plik `scripts/check-stage40-page-header-action-overflow-hardening.cjs`.

Błąd był w linii łączenia tekstów do skanowania sekretów. W wygenerowanym pliku pojawił się prawdziwy znak nowej linii wewnątrz stringa JS, więc Node zwracał `SyntaxError: Invalid or unexpected token`.

## Naprawa

Repair2 przepisuje check tak, żeby używał bezpiecznego separatora:

```js
String.fromCharCode(10)
```

Dzięki temu nie ma ryzyka, że generator paczki zamieni `\n` w fizyczną nową linię wewnątrz stringa.

## Zakres

- Nadpisuje tylko Stage40 CSS, Stage40 check, Stage40 docs i wpis/import Stage40.
- Zachowuje lokalne zmiany CaseDetail, jeśli są w working tree.
- Nie dotyka logiki aplikacji, danych ani kafelków.
