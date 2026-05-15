# CloseFlow /clients - Stage 1 cleanup: remove stale lead-attention rail

Date: 2026-05-15
Branch: dev-rollout-freeze
Scope: /clients

## Goal
Remove the stale active card from /clients:

- Leady do spiÄ™cia
- Brak klienta albo sprawy przy aktywnym temacie.
- data-clients-lead-attention-rail
- clients-lead-attention-card
- data-right-rail-list="lead-attention"

## Files changed

- src/pages/Clients.tsx
- tools/patch-clients-no-lead-attention-rail-stage1.cjs
- tests/stage79-clients-no-lead-attention-rail.test.cjs

## Files intentionally not changed

- src/components/operator-rail/OperatorSideCard.tsx
- src/components/operator-rail/TopValueRecordsCard.tsx
- src/components/operator-rail/index.ts
- client list logic
- add-client form
- trash/archive logic
- page header

## Verification

Required guard:

node tests/stage79-clients-no-lead-attention-rail.test.cjs

Expected manual check:

1. Open /clients.
2. Confirm the following texts are not visible:
   - Leady do spiÄ™cia
   - Brak klienta
   - Brak sprawy
   - Lead do spiÄ™cia
3. Confirm the clients list, client creation, client detail entry, archive/trash and header still work.

## Rollback

Backup was written to:

C:\Users\malim\Desktop\biznesy_ai\2.closeflow\docs\audits\clients-no-lead-attention-stage1-backup-20260515_193140
