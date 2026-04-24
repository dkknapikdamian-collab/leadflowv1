# Release gate path typo fix

Data: 2026-04-24

## Problem

Po poprawce runtime dla Cases test bramki probowal odczytac plik jako:

```text
scriptscloseflow-release-check.cjs
```

To jest literowka w sciezce. Brakowalo ukosnika po katalogu `scripts`.

## Poprawka

Test bramki czyta teraz poprawna sciezke:

```text
scripts/closeflow-release-check.cjs
```

## Efekt

`verify:closeflow:quiet` moze dojsc do konca i faktycznie sprawdzic nowy test:

```text
tests/cases-filetext-runtime.test.cjs
```
