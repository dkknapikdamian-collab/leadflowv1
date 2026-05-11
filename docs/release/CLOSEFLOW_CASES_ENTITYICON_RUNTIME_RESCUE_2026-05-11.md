# CLOSEFLOW_CASES_ENTITYICON_RUNTIME_RESCUE_2026-05-11

## Cel

Naprawa runtime crash na widoku Cases:

```text
ReferenceError: EntityIcon is not defined
APP_ROUTE_RENDER_FAILED
```

## Przyczyna

`src/pages/Cases.tsx` używał `EntityIcon`, ale symbol nie był importowany ani lokalnie zadeklarowany po wcześniejszych naprawach importów.

## Zmiana

- naprawiono krytyczne importy React/router/lucide w `src/pages/Cases.tsx`,
- automatycznie wykryto źródło eksportu `EntityIcon` w `src` i dodano poprawny import,
- poszerzono guard `scripts/check-closeflow-cases-loader2-import.cjs` o `EntityIcon`,
- guard sprawdza też składnię przez `node --check` w paczce.

## Weryfikacja

- `npm.cmd run check:closeflow-cases-loader2-import`,
- `npm.cmd run verify:closeflow:quiet`,
- ręcznie: wejście na `/cases` po deployu.
