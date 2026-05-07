# EliteFlow / CloseFlow - sidebar user footer below nav - 2026-05-07

## Problem

The logged-in user card in the left sidebar overlapped the `System` navigation items after the compact desktop scaling and earlier footer contrast patch.

## Fix

- Add final CSS layer: `src/styles/eliteflow-sidebar-user-footer-below-nav.css`.
- Import it as the last line in `src/index.css`.
- Make the sidebar footer a normal static block below the navigation.
- Remove the footer pseudo overlay.
- Make the navigation area scroll independently.
- Make the user card a two-column row with ellipsis for long name/email.

## Verification

```powershell
node scripts/check-eliteflow-sidebar-user-footer-below-nav.cjs
npm run build
```

Manual smoke:

- Open a desktop route.
- Scroll the left sidebar to the bottom.
- The `System` menu must not overlap the logged-in user card.
- The user card must sit below navigation and above `Wyloguj się`.
