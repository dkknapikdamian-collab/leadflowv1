# CloseFlow Stage11 guard repair13

## Cel
Domknięcie dwóch ostatnich błędów z wide quiet gate po repair12.

## Zmiany
- /api/support skonsolidowane przez /api/system?kind=support, aby utrzymać limit Vercel Hobby api/*.ts <= 12 po dodaniu api/daily-digest.ts.
- src/pages/Calendar.tsx ma osobny dokładny import subscribeCloseflowDataMutations wymagany przez guard Faza 4 Etap 4.4C.
- package.json zapisany jako UTF-8 bez BOM.

## Guardy
npm.cmd run check:closeflow-case-client-roadmap-repair
npm.cmd run build
npm.cmd run verify:closeflow:quiet:wide
npm.cmd run verify:closeflow:quiet
