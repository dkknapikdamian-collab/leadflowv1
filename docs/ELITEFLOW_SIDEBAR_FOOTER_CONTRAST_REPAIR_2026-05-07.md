# EliteFlow / CloseFlow - sidebar footer contrast repair - 2026-05-07

## Problem

The bottom part of the left sidebar had two visual issues on desktop:

- the logged-in user card became too bright and the text was almost invisible,
- the sidebar footer area did not visually continue the same dark panel background as the upper navigation.

## Fix

- Add final CSS layer: `src/styles/eliteflow-sidebar-footer-contrast-repair.css`.
- Import it as the last line in `src/index.css`.
- Restore dark translucent user card background.
- Force readable white user name and muted email.
- Add a dark footer backdrop behind the user card and logout button.
- Keep the compact sidebar breakpoint unchanged.

## Verification

Run:

```powershell
node scripts/check-eliteflow-sidebar-footer-contrast.cjs
npm run build
```

Manual smoke:

- Open any desktop route.
- Scroll the left sidebar to the bottom.
- Confirm the user card is readable.
- Confirm footer background is dark and visually connected with the sidebar.
