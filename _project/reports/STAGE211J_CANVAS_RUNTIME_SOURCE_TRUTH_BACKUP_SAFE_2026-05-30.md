# STAGE211J - Canvas runtime source truth backup-safe

## Cel
Domknąć ujednolicenie tła aplikacji po runtime mapie. Stage211I nie doszedł do patcha, bo backup nie tworzył katalogów pośrednich.

## Fakty z runtime mapy
- html/body/cf-route-work-root używały #f8fafc.
- #root/.app/.main/.view.active używały #f3f6fb.
- Jeden grid na Dziś miał własny linear-gradient między kafelkami.

## Decyzja
Kolor canvasu: #f8fafc. Karty i panele zostają białe jako surface.

## Zakres
- Nowy CSS source truth: src/styles/closeflow-canvas-runtime-source-truth-stage211j.css
- Import w index.css, Layout.tsx i głównych stronach.
- Operator bg tokeny przepięte na --cf-canvas-bg.
- Guard: scripts/check-stage211j-canvas-runtime-source-truth.cjs

## Czego nie ruszano
Supabase, RLS, routing, dane, formularze, listy, deployment, push.

## Testy
- node scripts/check-stage211j-canvas-runtime-source-truth.cjs
- npm run build

## Następny krok
Restart dev servera, Ctrl+F5, sprawdzić pasek przy sidebarze i tło między kafelkami.
