# STAGE211F - Canvas edge color source truth

## Cel
Ujednolicić kolor pierwszej warstwy tła aplikacji operatora, szczególnie warstwy dotykającej lewego panelu bocznego.

## Fakty
- Wzorem jest canvas ekranu Dziś.
- Problem dotyczył różnicy między tłem strony a tłem globalnego shellu/main/view.
- Stage211F ustawia jeden token: `--cf-canvas-bg: #f8fafc`.

## Zmienione pliki
- `src/styles/closeflow-canvas-edge-color-source-truth-stage211f.css`
- `src/components/Layout.tsx`
- `src/index.css`
- `src/styles/closeflow-operator-top-trim-source-truth.css`

## Zakres
Tylko tło/canvas/gutter aplikacji.

## Nie ruszano
Supabase, RLS, routing, formularze, listy, dane, deployment, push.

## Testy
- `node scripts/check-stage211f-canvas-edge-color-source-truth.cjs`
- `npm run build`
