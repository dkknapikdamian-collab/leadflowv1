# Obsidian update — STAGE231B0-R15-R3 ClientDetail width and Polish guards

Project: CloseFlow / LeadFlow
Date: 2026-06-10

## Decyzja
Po wizualnym potwierdzeniu przez użytkownika ustawiamy guardy:
- guard szerokości kartoteki klienta,
- guard polskich znaków/mojibake.

## Źródło prawdy
Szerokość strony ma iść przez wspólny canvas:
- `cf-page-canvas`
- `cf-page-canvas--full`
- `data-cf-page-canvas="full"`
- `--cf-page-canvas-*`

## Guardy
- `scripts/check-stage231b0-r15-r3-client-detail-width-source-truth.cjs`
- `scripts/check-stage231b0-r15-r3-polish-encoding.cjs`

## Test produkcyjny
Po pushu i deployu sprawdzić, czy kartoteka klienta nadal ma pełną szerokość i czy polskie znaki są poprawne.
