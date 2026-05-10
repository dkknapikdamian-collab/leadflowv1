# CloseFlow Calendar Bundle Import Dedup REPAIR4 — 2026-05-10

## Cel

Naprawić ostatnią regresję TypeScript po API-0/FIN-5: `fetchCalendarBundleFromSupabase` ma być importowane dokładnie raz z `../lib/calendar-items`.

## Zakres

Dotykane pliki:

- `src/pages/Calendar.tsx`
- `src/pages/NotificationsCenter.tsx`
- `scripts/check-closeflow-calendar-bundle-import-source.cjs`
- `tools/repair-closeflow-calendar-bundle-import-dedup-repair4.cjs`
- `package.json`

## Zasada

Nie ruszamy FIN-5 ani API-0. Ten etap usuwa tylko błędne lub zdublowane importy `fetchCalendarBundleFromSupabase` i zostawia użycia funkcji w kodzie.

## Bramki

- `npm run check:closeflow-calendar-bundle-import-source`
- `npm run check:closeflow-api0-vercel-hobby-functions`
- `npm run check:closeflow-case-settlement-panel`
- `npm run check:closeflow-fin5-import-boundaries-final`
- `npx tsc --noEmit --pretty false`
- `npm run build`
