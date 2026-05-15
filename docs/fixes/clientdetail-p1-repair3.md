# CloseFlow ClientDetail P1 REPAIR3

## Scope

This cumulative local repair targets three admin feedback issues on `ClientDetail`:

1. Client notes/dictation duplicated across panels.
2. Client notes need edit/delete actions.
3. Case value badge should display value defensively and the green/value background should shrink to content.

It also keeps the earlier tab-order rule: `Sprawy` before `Podsumowanie`.

## Files touched by the pack

- `src/pages/ClientDetail.tsx`
- `src/styles/emergency/emergency-hotfixes.css` if present, otherwise a small CSS repair file under `src/styles/`
- `tools/repair-clientdetail-p1-repair3.cjs`
- `tests/clientdetail-p1-repair3.test.cjs`
- `docs/fixes/clientdetail-p1-repair3.md`

## Safety rules

- No Git commit.
- No push.
- No Vercel deploy.
- The pack runs local guard/build only.
