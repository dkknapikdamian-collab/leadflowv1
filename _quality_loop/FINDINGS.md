# CLOSEFLOW_LEAD_APP — Quality Loop Findings

Audit-memory only. This file is not a canonical execution queue.

## CFL-FRT036-PARTIAL-CREATE-FALSE-FAILURE-001 — Case creation can persist a case and then report creation failure

- FINDING_ID: `CFL-FRT036-PARTIAL-CREATE-FALSE-FAILURE-001`
- SEVERITY: `HIGH`
- LIFECYCLE: `REPAIR_QUEUED`
- FINDING_FINGERPRINT: `frt036:create-case-commits-before-post-create-checklist-activity-refresh:single-catch-reports-create-failure:no-request-idempotency`
- CURRENT_EVIDENCE: validated previously and promoted into FRT-036; current production fingerprint remains unchanged.
- DONE_PROOF_REQUIRED: exact candidate failure-injection, duplicate-safe replay, authenticated browser/DB proof, Guardian and FRT-036 receipt.

---

## CFL-WORKSPACE-WRITE-ACCESS-FAILOPEN-001 — Workspace entitlement lookup failure grants synthetic trial write access

- FINDING_ID: `CFL-WORKSPACE-WRITE-ACCESS-FAILOPEN-001`
- SEVERITY: `HIGH`
- LIFECYCLE: `OPEN_VALIDATED`
- FINDING_FINGERPRINT: `access-gate:string-workspace:lookup-error-or-no-row->null->synthetic-trial_active->write-allowed`
- CURRENT_EVIDENCE: current at `425ab6b23b71b6b919143f0f982dc6d1adcad96c`; shared access-gate lookup can fail open to synthetic `trial_active`.
- LEGAL_REPAIR_BOUNDARY: `CANONICAL_STAGE_QUEUE_MISSING` until a shared security/access owner is active.

---

## CFL-FRT036-CLIENT-CREATED-BEFORE-CASE-PREFLIGHT-001 — Add Case can create a client before later case preflight rejects the request

- FINDING_ID: `CFL-FRT036-CLIENT-CREATED-BEFORE-CASE-PREFLIGHT-001`
- TITLE: `Add Case can create a client before later case preflight rejects the request`
- SEVERITY: `HIGH`
- LIFECYCLE: `REPAIR_QUEUED`
- FIRST_SEEN_SHA: `425ab6b23b71b6b919143f0f982dc6d1adcad96c`
- LAST_CHECKED_SHA: `425ab6b23b71b6b919143f0f982dc6d1adcad96c`
- CURRENT_TREE: `e4c3f9dd13e73b32b016f3d208faf3aed14d9ad3`
- FIRST_SEEN_AT: `2026-09-05 03:58 Europe/Warsaw`
- LAST_CHECKED_AT: `2026-09-05 03:58 Europe/Warsaw`
- FINDING_FINGERPRINT: `frt036:ensure-client-insert-before-portal-config-and-primary-case-preflight:request-can-return-without-case`

### PROBLEM_STATEMENT
The canonical POST case-create path calls `ensureClientForCase()` before all case-create preconditions are known to pass. For a new client, that helper may insert a durable `clients` row. Only afterward does the handler validate portal-email prerequisites and primary-case conflict conditions. A request can therefore return `422`, `503`, or `409` without creating a case while leaving a client created as a side effect.

### USER_OR_SYSTEM_IMPACT
A failed Add Case action can silently change canonical client state. Repeated attempts can leave unintended client records or create confusing client/case lifecycle divergence. This is a partial-commit defect across the Client→Case boundary; duplicate-client frequency in production is `INSUFFICIENT_EVIDENCE`.

### EXPECTED_INVARIANT
A rejected case-create preflight must not persist a new client. Either all rejectable case preconditions must complete before client creation, or client+case creation must have an explicit atomic/compensating owner with truthful outcome semantics.

### OBSERVED_BEHAVIOR
`api/cases.ts` resolves/scopes the workspace and lead, then calls `ensureClientForCase()`. That helper first searches for an existing client and, when none is found, inserts a new client. After it returns, POST checks `sendClientLink && !clientEmail` → `422`, missing Resend configuration → `503`, and existing primary-case conflict → `409`; all can return before `insertCaseWithSchemaFallback(payload)`.

### CURRENT_EVIDENCE
Current SHA/tree above: `api/cases.ts` functions `findExistingClient`, `ensureClientForCase`, and POST case-create branch. The active FRT-036 contract explicitly preserves case creation, client relation, validation and real mutation.

### REPRODUCTION_OR_VERIFICATION
Use a workspace with no matching client. Submit Add Case with enough client data to create a client and `sendClientLink=true` while mail configuration is unavailable. Current source ordering permits client insert followed by `503 CLIENT_PORTAL_EMAIL_NOT_CONFIGURED` before case insert. Repaired behavior: response may reject, but client count and case count both remain unchanged.

### ROOT_CAUSE
`PRECONDITION_ORDERING / CROSS-ENTITY_PARTIAL_COMMIT`: durable relation creation occurs before later rejectable validation owned by the same logical Add Case intent.

### AFFECTED_FLOW_AND_OWNERS
`/cases Add Case → POST /api/cases → workspace/lead validation → ensureClientForCase → clients persistence → portal/primary-case preflight → cases persistence`. Legal owner: active FRT-036 case-create mutation/client-relation boundary.

### COUNTEREVIDENCE_CHECKED
Existing clients are reused rather than always inserted. Workspace and lead relation checks occur before client creation. No live runtime reproduction was executed, so occurrence rate and duplicate-client incidence remain `INSUFFICIENT_EVIDENCE`.

### REPAIR_OBJECTIVE
Ensure every rejectable Add Case precondition that does not require a newly persisted client is evaluated before new-client persistence; if any later operation must still fail after client persistence, expose an explicit atomic/compensating boundary rather than silent orphan creation.

### IMPLEMENTATION_BLUEPRINT
1. Re-read fresh HEAD and enumerate all POST preconditions and side effects in order.
2. Separate pure input/preflight derivation from durable client creation.
3. Run portal-email configuration/address and primary-case/relation checks before creating a new client whenever semantically possible.
4. Keep one canonical client owner and one case-create owner; do not add a second store.
5. If a required post-client check cannot move earlier, add bounded compensation/transaction semantics with explicit failure handling.
6. Preserve workspace, owner, lead and existing-client scope rules.

### CURRENT_CODE_ANCHORS
`api/cases.ts` → `ensureClientForCase`, portal email preflight, primary-case conflict check, `insertCaseWithSchemaFallback`. STALE-CODE SAFETY: remap semantics on fresh canonical HEAD before repair.

### IN_SCOPE
Case-create preflight ordering, new-client relation side effect, truthful failure semantics, focused regression tests.

### OUT_OF_SCOPE
Client redesign, CRM dedup redesign, broad transaction framework, pricing, unrelated Forteca stages.

### DEPENDENCIES_AND_LEGAL_REPAIR_BOUNDARY
FRT-036 explicitly owns real case mutation, validation and client relation, so this finding is legal to promote into the current stage. Production repair still requires current capability routing/Guardian and normal FRT-036 evidence.

### TEST_PLAN
Negative: new-client + missing portal email → reject with client delta=0/case delta=0; new-client + mail unavailable → reject with client delta=0/case delta=0; any primary-case conflict path → no unintended new client; case insert failure after preflight → no silently orphaned client or explicit proven compensation. Positive: valid new-client case create produces exactly one client and one case linked together; existing-client create does not duplicate client; workspace/lead/owner scope remains enforced.

### ACCEPTANCE_GATES
Every pre-case rejection has zero unintended client persistence; valid new-client create yields exactly one linked client+case; no second relation SOT; focused failure-injection plus browser/DB proof and required Guardian bind to exact candidate SHA.

### REGRESSION_RISKS_AND_ROLLBACK
Reordering validation can expose dependencies on generated client IDs. Preserve semantics explicitly and avoid speculative transaction infrastructure. Roll back by normal revert if valid new-client creation or existing-client reuse regresses.

### DONE_PROOF_REQUIRED
Exact candidate SHA/tree; deterministic preflight-failure client/case count deltas; valid linked create proof; existing-client no-duplicate proof; authenticated browser+DB evidence; required Guardian; FRT-036 receipt on same candidate.

### HISTORY
- `2026-09-05 03:58 Europe/Warsaw` — validated in rotation C from current source ordering; promoted to active FRT-036 contract; no production code changed by Quality Loop.

---

## CFL-RELEASE-EXACT-SHA-CI-STATUS-DIVERGENCE-001 — Exact-SHA required CI fails while external deployment statuses remain green

- FINDING_ID: `CFL-RELEASE-EXACT-SHA-CI-STATUS-DIVERGENCE-001`
- TITLE: `Exact-SHA required CI fails while external deployment statuses remain green`
- SEVERITY: `HIGH`
- LIFECYCLE: `OPEN_VALIDATED`
- FIRST_SEEN_SHA: `9003da4415ca30a483795a759ff293a62e0a8605`
- LAST_CHECKED_SHA: `9003da4415ca30a483795a759ff293a62e0a8605`
- CURRENT_TREE: `aac4a136a599291e8b86860a33f02f2ba6734bd4`
- FIRST_SEEN_AT: `2026-09-06 06:00 Europe/Warsaw`
- LAST_CHECKED_AT: `2026-09-06 07:02 Europe/Warsaw`
- FINDING_FINGERPRINT: `release:exact-sha-9003da44:vercel-production-deploy-run-33979220850:quality-gate-lint-failure:build-tests-guards-deploy-skipped:external-vercel-statuses-green`

### PROBLEM_STATEMENT
The exact current application SHA has conflicting release evidence. GitHub Actions workflow `Vercel Production Deploy` run `33979220850` is completed with conclusion `failure`. Its `ci / quality-gate` job fails at `Lint`, after which Build, Forteca tests, architecture/security/release guards and the deploy job are skipped. At the same SHA, external Vercel commit statuses can still report successful deployments. A green external deployment status therefore cannot by itself prove this candidate passed the repository release gate.

### USER_OR_SYSTEM_IMPACT
Any release decision, automation or audit that treats aggregate/external deployment status as sufficient can falsely classify a candidate as release-ready while required CI never completed. This is an evidence-integrity and release-readiness blocker; whether production users currently receive a broken artifact is `INSUFFICIENT_EVIDENCE`.

### EXPECTED_INVARIANT
Release readiness must bind to one exact candidate SHA and require the canonical quality/release workflow to complete successfully. External provider deployment success may supplement but must not override a failed required CI gate.

### OBSERVED_BEHAVIOR
For SHA `9003da4415ca30a483795a759ff293a62e0a8605`, workflow run `33979220850` is `completed/failure`. Job `ci / quality-gate` has `Lint=failure`; Build, Forteca current suite and all subsequent guards are skipped. The `deploy` job is skipped. Separate Vercel statuses for the same commit report successful deployments.

### CURRENT_EVIDENCE
GitHub Actions run `33979220850` and its jobs endpoint on the exact current SHA/tree. H revalidation independently re-fetched both and confirmed the failure was unchanged. The exact lint diagnostic text remains unavailable in current evidence.

### REPRODUCTION_OR_VERIFICATION
Open exact-SHA workflow run `33979220850`: verify `conclusion=failure`; inspect jobs: `Lint=failure`, downstream build/tests/guards skipped, deploy skipped. Compare with external Vercel commit statuses on the same SHA. Repaired release truth: one exact candidate must have the canonical required workflow fully green before release-ready classification.

### ROOT_CAUSE
`RELEASE_EVIDENCE_AUTHORITY_DIVERGENCE`: provider deployment status and repository quality-gate status represent different authorities, while current evidence allows them to disagree. The concrete cause of the lint failure is `INSUFFICIENT_EVIDENCE`.

### AFFECTED_FLOW_AND_OWNERS
`push exact SHA → repository quality gate → build/tests/guards → canonical deploy → external provider status → release-readiness decision`. Legal repair owner is not established by the active FRT-036 case-create contract.

### COUNTEREVIDENCE_CHECKED
External Vercel statuses are green, so a deploy artifact may exist. That does not prove Build/Forteca tests/guards passed because the repository workflow shows they were skipped. No evidence proves the failed workflow is intentionally non-blocking for canonical release truth.

### REPAIR_OBJECTIVE
Restore one deterministic exact-SHA release authority: identify and repair the lint failure under the legal workflow owner, rerun the canonical workflow, and require full green quality-gate plus deploy evidence before release-ready classification.

### IMPLEMENTATION_BLUEPRINT
1. Retrieve the exact lint diagnostic for run `33979220850` or reproduce lint on the exact SHA.
2. Resolve the canonical stage/recovery/precondition owner before any production-code repair.
3. Apply only the smallest legal repair.
4. Rerun the full canonical workflow on the resulting exact candidate SHA.
5. Bind release evidence to that workflow and preserve provider status as supplemental evidence only.

### CURRENT_CODE_ANCHORS
`.github/workflows/vercel-production-deploy.yml`; referenced `.github/workflows/ci.yml`; exact run `33979220850`. STALE-CODE SAFETY: re-fetch workflow definitions and candidate SHA before repair.

### IN_SCOPE
Exact-SHA CI/release evidence, lint blocker diagnosis, quality-gate/deploy truth and release-readiness classification.

### OUT_OF_SCOPE
Broad CI redesign, unrelated application refactors, Vercel provider redesign, FRT-036 case-create behavior unless the lint failure is proven to belong there.

### DEPENDENCIES_AND_LEGAL_REPAIR_BOUNDARY
`CANONICAL_STAGE_QUEUE_MISSING` for the repair until fresh canonical workflow identifies a legal release/CI owner. Do not attach the repair to FRT-036 merely because FRT-036 is active.

### TEST_PLAN
Negative: a candidate with lint failure must not be classified release-ready even if external Vercel status is green. Positive: exact candidate runs Lint, Build, Forteca tests, all required guards and deploy successfully. Regression: release status aggregation cannot mask a failed required workflow.

### ACCEPTANCE_GATES
Same exact candidate SHA: `Lint=PASS`; `Build=PASS`; `Forteca current suite=PASS`; all required guards=PASS; deploy job executes and succeeds; provider deployment evidence agrees; no failed required workflow remains for the candidate.

### REGRESSION_RISKS_AND_ROLLBACK
Changing release-gate ownership can accidentally block valid deployments or duplicate CI authority. Preserve one canonical gate; do not add a parallel release router. Any repair rollback must use normal revert, never force/reset/clean.

### DONE_PROOF_REQUIRED
Exact repair candidate SHA/tree; exact lint diagnostic and repair mapping; full successful canonical workflow receipt with build/tests/guards/deploy; matching deployment/provider receipt; release-readiness decision bound to that exact SHA.

### HISTORY
- `2026-09-06 06:00 Europe/Warsaw` — first observed in rotation G as exact-SHA release/evidence conflict.
- `2026-09-06 07:02 Europe/Warsaw` — independently revalidated in rotation H; workflow failure and skipped downstream steps remain unchanged; finding persisted to audit memory; no production code changed.
