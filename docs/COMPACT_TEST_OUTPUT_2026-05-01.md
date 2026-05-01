# CloseFlow — kompaktowe wyjście testów

## Cel

Konsola nie może już wyrzucać wielkich bloków z zawartością całych plików przy `AssertionError.actual`.

Od tego etapu:

- `npm.cmd test` uruchamia pełne testy w trybie kompaktowym,
- krótka lista błędów trafia do konsoli,
- pełny log trafia do `test-results/last-test-full.log`,
- krótki raport trafia do `test-results/last-test-summary.txt`,
- stary tryb zostaje jako `npm.cmd run test:raw`.

## Komendy

```powershell
npm.cmd test
```

Pełne testy, ale krótki output.

```powershell
npm.cmd run test:critical
```

Najważniejsze testy ryzyka dla aktualnych etapów.

```powershell
npm.cmd run test:raw
```

Stary, pełny output Node test runnera.

## Zasada

Na czat kopiować tylko `test-results/last-test-summary.txt`, chyba że poproszę o pełny log konkretnego testu.
