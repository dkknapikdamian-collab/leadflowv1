# STAGE16AD Vercel TSC script and AI import repair

Cel:
- naprawić błąd wykryty przez Vercel po commicie `78cd0c3`,
- domknąć backend TypeScript/serverless, którego nie łapie samo `vite build`,
- nie zmieniać funkcji produktowych poza naprawą kompilacji/importów.

Zakres:
- `src/server/ai-assistant.ts`
- `src/server/assistant-query-handler.ts`
- `scripts/repair-stage16f-pwa-manifest-guard-reconcile.cjs`

Kontrole:
- `npm run build`
- `npx tsc --noEmit --pretty false`
- testy AI assistant order/search
- `npm run test:critical`
- `npm run verify:closeflow:quiet`

Uwagi:
- plik Stage16F jest historycznym helperem naprawczym; został unieszkodliwiony składniowo, bo blokował pełny typecheck.
- poprawka używa jawnych importów `.js` w server-side runtime dla Vercel.
