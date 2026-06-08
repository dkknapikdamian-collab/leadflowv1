# Stage228L â€” text-leaf soft-tone source truth

Date: 2026-06-07 21:25 Europe/Warsaw

## Problem
Previous Stage228I/J/K soft-tone attempts either did not hit the actual DOM or coloured parent rows, visually merging internal text tiles.

## Fix
Added runtime mapper `src/lib/cf-soft-tone-text-leaf-stage228l.ts`.

Rules:
- palette and text style follow /tasks -> Filtry zadaĹ„,
- background/border are applied only to the meaningful row/text leaf,
- top-value cards use segment mode so name and amount are separate tiles,
- font colour is unified to task-like slate, not tone-specific blue/red/green,
- previous Stage228I/J/K tone attributes are cleared before applying Stage228L,
- MutationObserver reapplies mapping after route changes.

## Guard
`npm run check:stage228l-text-leaf-soft-tone-source-truth`

## Manual check
/tasks, /leads, /clients, /cases, /activity, /ai-drafts, /notifications, /help, /settings, /billing.
