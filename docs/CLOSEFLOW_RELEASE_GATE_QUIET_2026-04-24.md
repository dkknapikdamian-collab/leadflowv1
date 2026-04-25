# CloseFlow quiet release gate

Data: 2026-04-24

## Po co to jest

Pełna bramka `verify:closeflow` działa, ale wypisuje dużo logów z builda i testów.

Do codziennej pracy dodano krótszą komendę:

```powershell
npm.cmd run verify:closeflow:quiet
```

## Jak działa

Pokazuje tylko skrócony wynik:

```text
âś“ production build
âś“ tests/...
CloseFlow quiet release gate passed.
```

Pełny log pokazuje dopiero wtedy, gdy build albo test się wysypie.

## Zasada

- przed większym commitem można używać `verify:closeflow:quiet`,
- przy podejrzanych błędach nadal można odpalić pełne `verify:closeflow`,
- oba warianty sprawdzają produkcyjny build i zestaw testów regresji.

