# CloseFlow mobile start tiles source-truth final fix — 2026-05-12

## Cel

Ukryć na telefonie startowe kafelki/metryki zajmujące górę widoku, bez ruszania desktopu.

## Co naprawiono

- Usunięto BOM z `package.json`, bo build/Tailwind czytał plik jako niepoprawny JSON.
- Zostawiono jedno źródło prawdy dla ukrywania mobile: `data-cf-mobile-start-tile-trim="true"` w TSX/JSX.
- CSS działa wyłącznie na `max-width: 767px`.
- Usunięto zależność od zgadywania po klasach/hrefach.

## Próby patchera

```json
[
  {
    "file": "src/pages/TodayStable.tsx",
    "method": "no-OperatorMetricTiles-jsx"
  },
  {
    "file": "src/pages/Today.tsx",
    "method": "no-OperatorMetricTiles-jsx"
  },
  {
    "file": "src/components/ui-system/OperatorMetricTiles.tsx",
    "method": "component-root-data-attr-fallback"
  }
]
```

## Weryfikacja

- `npm run check:mobile-start-tile-trim:source-truth-final`
- `npm run build`

## Czego nie zmieniano

- Nie zmieniano logiki biznesowej.
- Nie zmieniano danych.
- Nie zmieniano desktop layoutu.
