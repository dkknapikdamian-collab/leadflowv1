# STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_V1

GeneratedAt: `2026-05-06T11:47:14.522Z`
Branch: `dev-rollout-freeze`
Commit: `09f4abf`

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
M docs/release/STAGE11_VERCEL_HOBBY_FUNCTION_BUDGET_GUARD_V1_2026-05-06.md
 M docs/release/STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_V1_2026-05-06.md
 M package.json
 M scripts/check-stage11-vercel-hobby-function-budget-guard.cjs
 M scripts/print-stage12-ai-assistant-vercel-release-evidence.cjs
 M src/components/ContextActionDialogs.tsx
 M tests/stage11-vercel-hobby-function-budget-guard.test.cjs
 M tests/stage12-ai-assistant-vercel-release-evidence.test.cjs
?? docs/release/STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_LATEST.md
?? docs/release/STAGE13_PACKAGE_JSON_STAGE11_12_SCRIPT_REGISTRATION_V1_2026-05-06.md
?? docs/release/STAGE14_CONTEXT_ACTION_ROUTE_PARITY_V1_2026-05-06.md
?? docs/release/STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT_V1_2026-05-06.md
?? docs/release/STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_LATEST.md
?? docs/release/STAGE16_CONTEXT_ACTION_BUTTON_PARITY_AUDIT_V1_2026-05-06.md
?? docs/release/STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1_2026-05-06.md
?? docs/release/STAGE18_CONTEXT_ACTION_RUNTIME_SMOKE_V1_2026-05-06.md
?? docs/release/STAGE19B_CONTEXT_ACTION_ROUTE_MAP_RUNNER_REPAIR_V1_2026-05-06.md
?? docs/release/STAGE19C_CONTEXT_ACTION_ROUTE_MAP_STAGE16_DOC_REPAIR_V1_2026-05-06.md
?? docs/release/STAGE19_CONTEXT_ACTION_ROUTE_MAP_EVIDENCE_V1_2026-05-06.md
?? scripts/audit-context-action-button-parity.cjs
?? scripts/audit-context-action-route-map.cjs
?? scripts/check-stage13-package-json-stage11-12-script-registration.cjs
?? scripts/check-stage14-context-action-route-parity.cjs
?? scripts/check-stage15-context-action-explicit-trigger-contract.cjs
?? scripts/check-stage16-context-action-button-parity-audit.cjs
?? scripts/check-stage17-context-action-contract-registry.cjs
?? scripts/check-stage18-context-action-runtime-smoke.cjs
?? scripts/check-stage19-context-action-route-map-evidence.cjs
?? scripts/smoke-stage18-context-action-runtime-contract.cjs
?? src/lib/context-action-contract.ts
?? tests/stage13-package-json-stage11-12-script-registration.test.cjs
?? tests/stage14-context-action-route-parity.test.cjs
?? tests/stage15-context-action-explicit-trigger-contract.test.cjs
?? tests/stage16-context-action-button-parity-audit.test.cjs
?? tests/stage17-context-action-contract-registry.test.cjs
?? tests/stage18-context-action-runtime-smoke.test.cjs
?? tests/stage19-context-action-route-map-evidence.test.cjs
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
