# A20c - sidebar Today hitbox fix

## Goal

Fix the remaining desktop sidebar click bug on the Today route.

## User-visible symptom

When the app is on Today, the first sidebar group can look correct but Leady, Klienci and Sprawy do not navigate. Opening DevTools changes the viewport and the problem disappears. This points to a transparent hitbox/stacking issue, not to API, auth or React Router.

## Change

- Add `src/styles/stageA20c-sidebar-today-hitbox-fix.css`.
- Import it after the A20 sidebar CSS.
- Keep sidebar above Today layers with a very high z-index.
- Disable pointer events on the empty Today main shell.
- Restore pointer events for real Today content and its children.

## Not changed

- No routing change.
- No API change.
- No Supabase change.
- No status contract change.
- No voice notes change.
- No lead/client/case flow change.

## Manual check

1. Open Today after deploy.
2. Without opening DevTools, click Leady.
3. Go back to Today.
4. Click Klienci.
5. Go back to Today.
6. Click Sprawy.
7. Confirm Zadania still works.
8. Confirm buttons and cards inside Today still work.

## Finish criteria

The first sidebar group is clickable directly from Today without DevTools and without first visiting Zadania.
