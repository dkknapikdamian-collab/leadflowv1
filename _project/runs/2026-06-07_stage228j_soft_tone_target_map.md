# Stage228J â€” soft tone target map local package

Date: 2026-06-07 21:25 Europe/Warsaw

## Scope

- Added runtime visual source truth for soft tone colors based on Tasks / Filtry zadaĹ„.
- Mapped debug JSON targets for leads, clients, cases, tasks, activity, AI drafts, notifications, help, settings, billing.
- Added guard: `npm run check:stage228j-soft-tone-target-map`.

## Local-only

No commit and no push.

## Risk sweep

- CSS is injected at runtime after route CSS chunks to avoid being overridden.
- Exact target selectors from debug JSON are used where available.
- Some cards with unknown internal row class use parent-card + child row fallbacks.
- Requires visual screen-check on all mapped routes before commit.
