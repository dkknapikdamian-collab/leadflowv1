# STAGE231B0-R15-R3 — ClientDetail width guard + Polish encoding guard

Status: FINAL_GUARD_FOR_PUSH

## User confirmation
Kartoteka klienta po R15-R2 wygląda poprawnie: ma pełną szerokość od lewego panelu roboczego do prawej strony.

## Changes
- Added final width source-truth guard.
- Added final Polish encoding/mojibake guard scoped to ClientDetail width stage files.
- Normalized EOF in ClientDetail.
- Kept shared canvas source of truth in `closeflow-unified-page-canvas-stage211c.css`.

## Risks
- Guard is intentionally scoped to ClientDetail stage files, not the whole legacy app, because older files may contain historical markers.
- Future layout changes must reuse `cf-page-canvas` and `data-cf-page-canvas="full"` instead of custom width hacks.
