# STAGE212E - Mojibake, import order and visual runtime repair

## Cel
Naprawa blokady po Stage212B/C/D:
- przywrócenie poprawnego porządku `@import` w `src/index.css`,
- naprawa mojibake w `Layout.tsx`,
- utrzymanie runtime visual foundation jako finalnej warstwy CSS,
- naprawa aktywnej ikonki w sidebarze, która nie ma już być białym kwadratem.

## Zakres
- `src/index.css`
- `src/components/Layout.tsx`
- `src/components/VisualFoundationRuntimeStage212B.tsx`
- `src/styles/closeflow-visual-foundation-stage212b.css`
- `scripts/check-stage212e-mojibake-import-and-runtime.cjs`

## Czego nie ruszano
- Supabase
- RLS
- routing danych
- formularze
- deployment
- push

## Testy
- `node scripts/check-stage212e-mojibake-import-and-runtime.cjs`
- `npm run build`
