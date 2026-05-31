# STAGE211K - Canvas final source truth

## Cel
Ujednolicić tło/canvas operatora CloseFlow na wszystkich głównych zakładkach.

## Routing
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Fakty
Runtime audit wykazał rozjazd:
- `html` i `body`: `rgb(248, 250, 252)`
- `#root`, `.app`, `.main`, `.view.active`: `rgb(243, 246, 251)`
- `.cf-route-work-root`: `rgb(248, 250, 252)`
- grid na Dziś miał dodatkowy pastelowy `linear-gradient`.

## Decyzja
Jedno źródło prawdy canvasu: `#f8fafc`.
Karty i panele pozostają białymi powierzchniami.
Sidebar i topbar nie są częścią canvasu i nie są przebarwiane.

## Zakres
- dodano `src/styles/closeflow-canvas-final-source-truth-stage211k.css`
- import w `src/index.css`
- import w `src/components/Layout.tsx`
- dodano guard `scripts/check-stage211k-canvas-final-source-truth.cjs`

## Testy
- `node scripts/check-stage211k-canvas-final-source-truth.cjs`
- `npm run build`

## Czego nie ruszano
- Supabase
- RLS
- routing
- formularze
- listy
- deployment
- push
