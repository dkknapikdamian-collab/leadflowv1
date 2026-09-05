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
