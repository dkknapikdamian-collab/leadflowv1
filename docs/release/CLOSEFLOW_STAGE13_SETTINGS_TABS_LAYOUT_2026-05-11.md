# CloseFlow Stage 13 - Settings tabs layout

Date: 2026-05-11
Branch: dev-rollout-freeze

## Scope

This stage restructures `/settings` into a tabbed layout:

- Plany
- Konto
- Bezpieczenstwo
- Workspace
- Powiadomienia
- Integracje

The default tab is `Plany`.

A persistent account rail is visible on the right on desktop and below the main content on mobile.
It contains:

- Email
- Workspace
- Plan
- Status dostepu

## Product decision

This stage does not move the full Billing page into Settings. Settings shows a compact plan summary and links to `/billing`.

This stage does not pretend that security, Google Calendar, Stripe, AI, PWA or email digest are fully production-ready unless the feature is already backed by configuration and implementation. Status badges are informational.

## Implementation notes

The previous `src/pages/Settings.tsx` is copied to `src/pages/SettingsLegacy.tsx` on first run, and the new `Settings.tsx` wraps it inside the Konto tab.

This keeps old settings reachable and avoids deleting working controls.

## Verification

Run:

```powershell
npm.cmd run check:settings-tabs-layout
npm.cmd run build
```

## Manual QA

Open `/settings` and check:

1. The default selected tab is `Plany`.
2. `Plany` appears before `Konto`.
3. `Dane konta` is visible on the right on desktop.
4. On mobile, `Dane konta` moves below the main content.
5. Existing settings are still reachable in the `Konto` tab.
6. `/billing` remains the full billing page.
