# CLOSEFLOW_TODAY_HEADER_ACTIONS_STACK_FIX_2026-05-11

## Cel

Naprawić układ nagłówka Centrum dnia na aktywnym ekranie Today.

Feedback: `Widok` ma być pod kontrolą prawej krawędzi, pod / przy `Odśwież dane`, a nie wyglądać jak przypadkowo doklejony tekst.

## Zakres

Aktywny ekran `/` i `/today` jest ładowany przez `src/pages/TodayStable.tsx`.
`src/pages/Today.tsx` jest legacy/inactive i nie jest miejscem głównej naprawy.

## Zmienione pliki

- `src/pages/TodayStable.tsx`
- `src/styles/closeflow-action-tokens.css`
- `scripts/check-closeflow-today-header-actions-stack.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `package.json`

## Zachowanie po zmianie

Prawa kolumna nagłówka Today ma układ:

```text
[Ostatni odczyt: ...]
[Odśwież dane]
[Widok]
```

Na mobile przyciski mogą przejść na pełną szerokość, bez sklejania i bez wychodzenia poza ekran.

## Czego nie zmieniano

- logiki odświeżania danych,
- treści `Ostatni odczyt`,
- logiki panelu `Widok`,
- całego układu Today,
- legacy `src/pages/Today.tsx`.

## Guard

Dodano:

```bash
npm run check:today-header-actions-stack
```

Guard jest podpięty do quiet release gate bez zmiany kontraktu:

```bash
npm run verify:closeflow:quiet
```
