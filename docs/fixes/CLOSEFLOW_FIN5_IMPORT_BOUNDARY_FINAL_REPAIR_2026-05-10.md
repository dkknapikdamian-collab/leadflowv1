# CLOSEFLOW FIN-5 import boundary final repair — 2026-05-10

## Cel
Naprawić klasę błędów importów wykrytą przez heavy QA bez dalszego punktowego łatania.

## Zakres
- React hooks/types -> `react`
- Router symbols -> `react-router-dom`
- Normal Lucide icons -> `lucide-react`
- Entity icons / OperatorMetric components -> `../components/ui-system`
- Global quick action helpers -> `../components/GlobalQuickActions`

## Poza zakresem
- Konsolidacja `/api/*` pod limit Vercel Hobby 12 funkcji. To osobny etap `API-0`.
- Zmiany UX poza FIN-5.

## Guardy
- `npm run check:closeflow-fin5-import-boundaries-final`
- `npm run check:closeflow-case-settlement-panel`
- `npx tsc --noEmit --pretty false`
