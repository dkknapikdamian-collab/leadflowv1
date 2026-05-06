# STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_V1

GeneratedAt: `2026-05-06T11:53:38.871Z`
Branch: `dev-rollout-freeze`
Commit: `d789e39`

## Vercel Hobby API budget evidence

- api function count <= 12: `PASS`
- api function count: `12`
- api/assistant/query.ts removed: `PASS`
- /api/assistant/query rewrite to /api/system?kind=assistant-query: `PASS`
- api/system.ts assistant-query route: `PASS`
- src/server/assistant-query-handler.ts exists: `PASS`

## Physical API functions

- `api/activities.ts`
- `api/billing-checkout.ts`
- `api/case-items.ts`
- `api/cases.ts`
- `api/clients.ts`
- `api/daily-digest.ts`
- `api/leads.ts`
- `api/me.ts`
- `api/stripe-webhook.ts`
- `api/support.ts`
- `api/system.ts`
- `api/work-items.ts`

## Working tree

```text
M docs/release/STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_LATEST.md
 M package.json
?? docs/release/STAGE20B_CONTEXT_ACTION_VERIFY_CHAIN_REPAIR_V1_2026-05-06.md
?? docs/release/STAGE20_CONTEXT_ACTION_REAL_BUTTON_TRIGGER_AUDIT_V1_2026-05-06.md
?? scripts/audit-context-action-real-button-triggers.cjs
?? scripts/check-stage20-context-action-real-button-trigger-audit.cjs
?? scripts/check-stage20b-context-action-verify-chain-repair.cjs
?? tests/stage20-context-action-real-button-trigger-audit.test.cjs
?? tests/stage20b-context-action-verify-chain-repair.test.cjs
```

## Commands for manual verification

```powershell
node scripts/check-stage11-vercel-hobby-function-budget-guard.cjs
node --test tests/stage11-vercel-hobby-function-budget-guard.test.cjs
node scripts/print-stage12-ai-assistant-vercel-release-evidence.cjs
node --test tests/stage12-ai-assistant-vercel-release-evidence.test.cjs
npm run build
```

## Verdict

PASS: assistant endpoint is collapsed under system API and remains inside Vercel Hobby function budget.
