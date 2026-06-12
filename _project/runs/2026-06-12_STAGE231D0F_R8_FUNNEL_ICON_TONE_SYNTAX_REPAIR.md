# 2026-06-12 — STAGE231D0F-R8 Funnel icon tone syntax repair

Status: READY_TO_APPLY

## Why R8 exists

R7 failed before patching because of a JavaScript syntax error in the patcher validation array:
`payment: \'green\''`.

This was a package bug, not an app/runtime bug.

## Decision

Funnel layout is frozen. This stage changes only icon/tone color source truth.

## Icon/tone map

- Lead / Target / move action: blue
- Client / done / accepted relation: green
- Case / system / upcoming / AI: purple
- Money / payment / commission / billing: green
- Risk / shield / trash / overdue: red
- Waiting / no next move / silence / clock / filter: amber
- All/lost/archive: neutral

## Runtime changes

- Add `metric-icon-tone-registry.ts`.
- Export registry from `ui-system/index.ts`.
- Use registry from `operator-metric-tone-contract.ts`.
- Use registry from `SalesFunnel.tsx`.
- Change Funnel money icon to `PaymentEntityIcon`.
- Keep all layout classes and geometry unchanged.

## Tests

- syntax preflight for package patcher/guard
- R8 guard/test
- R6 regression guard if present
- build
- `git diff --check`

## Risk audit

- Browser CSS cascade can still affect SVG color; manual QA is required.
- Do not push unrelated D0E/R4/R5/R6 sweep artifacts.
