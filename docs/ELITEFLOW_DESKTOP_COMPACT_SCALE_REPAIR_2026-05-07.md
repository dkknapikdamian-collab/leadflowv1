# EliteFlow / CloseFlow - desktop compact scale repair - 2026-05-07

## Problem

The previous scale package had a PowerShell parser error caused by non-ASCII text inside a quoted string.

## Fix

This repair package uses an ASCII-only PowerShell installer.

It adds:

- `src/styles/eliteflow-desktop-compact-scale.css`
- `scripts/check-eliteflow-desktop-compact-scale.cjs`

The CSS is imported as the last line in `src/index.css`.

## Product decision

This is a fast test layer for desktop only.

It makes the app render closer to the user's preferred 80-85 percent browser zoom without changing browser zoom. Media queries still use the real viewport, so the layout should not collapse as quickly as with Ctrl+scroll browser zoom.

## Verification

Run:

```powershell
node scripts/check-eliteflow-desktop-compact-scale.cjs
npm run build
```

## Manual smoke

Check:

- Today
- Leads
- Clients
- Cases
- Tasks
- Calendar
- Templates
- Response templates
- Activity
- Detail pages
- Modals

If sticky bars or modals feel wrong, replace this layer later with a real compact-density system instead of transform scaling.

