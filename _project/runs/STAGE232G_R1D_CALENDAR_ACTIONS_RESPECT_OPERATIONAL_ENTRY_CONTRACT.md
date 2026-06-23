# STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT

Date: 2026-06-23 09:35 Europe/Warsaw

## Status

APPLIED_PENDING_TEST_OR_PUSH

## Scope

Calendar/Today action policy guards for operational entries. Lead shadow entries remain derived records and must not expose destructive `complete/delete/restore` behavior as if they were authoritative tasks/events.

## Tests

- `node scripts/check-stage232g-r1d-calendar-actions-respect-operational-entry-contract.cjs`
- `node --test tests/stage232g-r1d-calendar-actions-respect-operational-entry-contract.test.cjs`
- `node scripts/check-cf-runtime-00-source-truth.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`
- `git diff --check`

## Risk audit

R1D intentionally does not remove calendar DOM normalizers. That remains R1E.
