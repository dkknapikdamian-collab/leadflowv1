# Stage16AR - Today view all-options final repair

## Cel

Naprawia panel `Dziś -> Widok`, zeby odznaczona sekcja nie znikala z listy opcji i mogla zostac ponownie wlaczona.

## Zakres

- `src/pages/TodayStable.tsx`
- `package.json`
- `scripts/check-today-view-customizer-all-options.cjs`
- `tests/today-view-customizer-all-options.test.cjs`

## Zasada

Panel checkboxow zawsze renderuje pelne `todayTiles.map(...)`.
Stan zaznaczenia pochodzi z `visibleTodaySectionSet`.
Widocznosc sekcji nadal jest zapisywana w `localStorage`.

## Weryfikacja

- `npm run build`
- `npm run check:today-view-customizer-all-options`
- `npm run test:today-view-customizer-all-options`
- `npm run check:today-view-customizer`
- `npm run test:today-view-customizer`
- `npm run test:critical`
- `npm run verify:closeflow:quiet`
