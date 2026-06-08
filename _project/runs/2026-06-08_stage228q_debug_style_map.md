# 2026-06-08 - STAGE228Q DEBUG STYLE MAP
STATUS: LOCAL_ONLY_PREPARED
## Cel
Dodano dev-only debug mapper, który mapuje gdzie dany element ma podpięty tekst, ikonki, rozmiary, style, klasy, data-atrybuty, matched CSS rules, source hints i stabilność stylu po renderze.
## Zakres
- src/debug/cf-style-map-debugger-stage228q.ts
- src/main.* import debuggera po index.css
- scripts/check-stage228q-debug-style-map.cjs
- package.json script check:stage228q-debug-style-map
## Użycie ręczne
```js
window.__cfStyleMapDebugStage228Q.startClickCapture()
window.__cfStyleMapDebugStage228Q.auditKnownTargets()
await window.__cfStyleMapDebugStage228Q.auditStability('aside.cases-risk-rail-card .panel-head h3', 2400)
```
## Guard
`npm run check:stage228q-debug-style-map`
## Ryzyko
Debugger jest dev-only/local-only i nie powinien zmieniać UI. Nie używa MutationObserver, setInterval ani setProperty important.
