# STAGE220A16B - Visual foundations - 2026-06-03

## Cel

Rozszerzyć CloseFlow Visual Source of Truth poza kolory:
- typografia,
- rozmiary fontów,
- line-height,
- font-weight,
- odstępy,
- layout,
- panele boczne,
- kafelki,
- przyciski,
- formularze,
- modale,
- listy,
- ikony,
- metryki i liczby,
- stany UI.

## Decyzja

Nie przepinamy całej aplikacji naraz. Najpierw tworzymy mapę i guard, potem etapami podpinamy konkretne widoki.

## Zmienione pliki

- src/styles/closeflow-visual-source-truth.css
- src/lib/closeflow-visual-source-truth.ts
- docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md
- scripts/check-stage220a16b-visual-foundations.cjs
- _project/reports/STAGE220A16B_VISUAL_FOUNDATIONS_2026-06-03.md
- package.json

## Testy

- node scripts/check-stage220a16-visual-source-truth.cjs
- node scripts/check-stage220a16b-visual-foundations.cjs
- npm run build
