# UI copy and billing cleanup v5 - 2026-04-26

## Fix over v4

v4 failed because `billingCheckResult` remained in `Billing.tsx`.
v5 removes the billing diagnostics function by a direct start/end span:

- from `const handleBillingCheck = async () => {`
- to `const handleUpgrade = async (plan: PlanCard) => {`

It also removes the diagnostics card by the title and next plans-grid marker.

## Removed from UI

- Lead handoff helper copy.
- Already-linked-to-case helper copy.
- Shared client record helper copy.
- Daily execution helper copy.
- Redundant operational status label.
- Visible technical payment diagnostics card.

## Verification

node scripts/check-polish-mojibake.cjs --repo . --check
npm.cmd run lint
node tests/ui-copy-and-billing-cleanup.test.cjs
node tests/billing-ui-polish-and-diagnostics.test.cjs
npm.cmd run verify:closeflow:quiet
