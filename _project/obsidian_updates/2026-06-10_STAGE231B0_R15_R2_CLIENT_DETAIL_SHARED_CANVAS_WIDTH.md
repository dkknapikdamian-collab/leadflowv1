# Obsidian update — STAGE231B0-R15-R2 ClientDetail shared canvas width

Project: CloseFlow / LeadFlow
Date: 2026-06-10

## Fakt
R14 został wypchnięty, ale nie rozwiązał problemu szerokości kartoteki klienta, bo marker trafił w nested `ClientMultiContactField`, a nie w realny wrapper widoku.

## Decyzja
ClientDetail ma korzystać ze wspólnego źródła prawdy szerokości strony:
- `cf-page-canvas`
- `cf-page-canvas--full`
- `data-cf-page-canvas="full"`
- zmienne CSS `--cf-page-canvas-*`

## Pliki
- `src/pages/ClientDetail.tsx`
- `src/styles/closeflow-unified-page-canvas-stage211c.css`
- `src/styles/visual-stage12-client-detail-vnext.css`
- `scripts/check-stage231b0-r15-r2-client-detail-shared-canvas-width.cjs`
- `tests/stage231b0-r15-r2-client-detail-shared-canvas-width.test.cjs`

## Test produkcyjny po deployu
Sprawdzić kartotekę klienta na Vercel: pełna szerokość od lewego panelu roboczego do prawej krawędzi, brak przesuwania przy scrollu.
