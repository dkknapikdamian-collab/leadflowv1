# CLOSEFLOW_LEAD_APP — Quality Loop Findings

Audit-memory only. This file is not a canonical execution queue.

## CFL-FRT036-PARTIAL-CREATE-FALSE-FAILURE-001 — Case creation can persist a case and then report creation failure

- FINDING_ID: `CFL-FRT036-PARTIAL-CREATE-FALSE-FAILURE-001`
- TITLE: `Case creation can persist a case and then report creation failure`
- SEVERITY: `HIGH`
- LIFECYCLE: `REPAIR_QUEUED`
- FIRST_SEEN_SHA: `2abb05c43362cd02294d9e6c8ef3d0b64c1b021c`
- LAST_CHECKED_SHA: `2abb05c43362cd02294d9e6c8ef3d0b64c1b021c`
- CURRENT_TREE: `5140e605174dcaf61bcec7ece854fbfd24d50d3b`
- FIRST_SEEN_AT: `2026-09-04 18:05 Europe/Warsaw`
- LAST_CHECKED_AT: `2026-09-04 18:05 Europe/Warsaw`
- FINDING_FINGERPRINT: `frt036:create-case-commits-before-post-create-checklist-activity-refresh:single-catch-reports-create-failure:no-request-idempotency`

### PROBLEM_STATEMENT
The FRT-036 Add Case flow treats the base case insert, optional checklist/activity enrichment, and subsequent list refresh as one logical failure boundary although they are not atomic. A post-insert failure can therefore report creation failure after canonical persistence already succeeded.

### USER_OR_SYSTEM_IMPACT
A real case can exist while the UI tells the operator creation failed. A normal retry can create another case for the same intended action and post-create enrichment can be incomplete.

### EXPECTED_INVARIANT
One create intent must expose one truthful canonical outcome. Once a canonical case ID exists, later enrichment/refresh failures must not be represented as base-create failure, and replay of the same logical intent must not silently duplicate the case.

### OBSERVED_BEHAVIOR
`handleCreateCase()` includes create plus `refreshCases()` in one failure boundary; `createStarterCaseForClient()` can persist before later checklist/activity work; the POST create path performs a new insert and the audited path exposes no create-intent identity.

### CURRENT_EVIDENCE
Current at validation SHA `2abb05c43362cd02294d9e6c8ef3d0b64c1b021c`, tree `5140e605174dcaf61bcec7ece854fbfd24d50d3b`: `src/pages/Cases.tsx` (`handleCreateCase`, `refreshCases`), `src/lib/cases/create-client-case.ts` (`createStarterCaseForClient`), `api/cases.ts` POST create branch, and `tests/forteca-frt-036-cases-add.test.cjs`.

### REPRODUCTION_OR_VERIFICATION
Make base insert return a real case ID, force one post-insert operation to fail, verify the case exists, then replay the same logical submit. Repaired behavior must keep canonical case count at one and expose truthful partial-success/recovery state.

### ROOT_CAUSE
`PARTIAL_COMMIT / FALSE_FAILURE / NON_IDEMPOTENT_RETRY_BOUNDARY`: irreversible persistence, fallible enrichment and read-model refresh share an outer failure owner that does not correspond to the commit boundary.

### AFFECTED_FLOW_AND_OWNERS
`/cases` Add Case → UI orchestration → case-create orchestration → POST `api/cases.ts` → canonical `cases` persistence → checklist/activity → list refresh. Legal workflow owner: active FRT-036.

### COUNTEREVIDENCE_CHECKED
Workspace scoping exists; portal-mail failure already uses partial-success semantics. No runtime reproduction was executed, so runtime frequency remains `INSUFFICIENT_EVIDENCE`.

### REPAIR_OBJECTIVE
Make base-create commit truth explicit, classify post-create failures separately, and make retry of one logical create intent duplicate-safe.

### IMPLEMENTATION_BLUEPRINT
1. Re-read fresh HEAD and semantically remap owners.
2. Preserve created case identity immediately after canonical persistence.
3. Return post-create enrichment failures as partial-success/recovery, not base-create failure.
4. Reconcile list refresh independently from base creation.
5. Add/reuse one workspace-scoped create-intent/idempotency mechanism at the existing canonical mutation owner.
6. Preserve workspace/client/owner and portal-link semantics.
7. Add deterministic failure-injection and replay tests.
8. Require exact candidate browser/DB/Guardian/receipt proof.

### CURRENT_CODE_ANCHORS
`CURRENT_AT_LAST_CHECK`: `src/pages/Cases.tsx` (`handleCreateCase`, `refreshCases`); `src/lib/cases/create-client-case.ts` (`createStarterCaseForClient`); `api/cases.ts` POST branch; focused FRT-036 test. STALE-CODE SAFETY: resolve fresh canonical HEAD/tree/workflow and remap semantics before repair; these are not timeless line-number instructions.

### IN_SCOPE
Truthful create/post-create outcomes, post-create recovery, duplicate-safe retry, focused acceptance evidence.

### OUT_OF_SCOPE
Cases redesign, unrelated lifecycle changes, broad DB refactor, replacement persistence, unrelated Forteca stages.

### DEPENDENCIES_AND_LEGAL_REPAIR_BOUNDARY
Active FRT-036 already owns case mutation/list refresh and is the legal repair boundary. Production repair remains subject to current capability routing and Guardian/test/browser/receipt gates.

### TEST_PLAN
Pre-insert failure → no case; each post-insert failure → created identity retained; refresh failure → no false create failure; replay same intent → zero additional cases; deliberately new intent with identical fields → distinct case allowed; workspace/client/owner and portal behavior unchanged.

### ACCEPTANCE_GATES
Exactly one canonical case per replayed intent; no generic create-failure after known persistence; truthful recoverable post-create states; refresh retry without re-creating; focused tests + browser/DB + Guardian + FRT-036 receipt bound to exact candidate SHA.

### REGRESSION_RISKS_AND_ROLLBACK
Avoid collisions between distinct intents and hiding failed enrichment. Keep identity workspace-scoped. Roll back by normal non-destructive revert if exact proof shows lost creates, collisions or scope regression.

### DONE_PROOF_REQUIRED
Exact candidate SHA/tree; failure-injection results; duplicate-safe replay; authenticated browser proof; canonical DB count; required Guardian evidence; FRT-036 receipt/workflow acceptance on the same candidate.

### FINDING_FINGERPRINT
`frt036:create-case-commits-before-post-create-checklist-activity-refresh:single-catch-reports-create-failure:no-request-idempotency`

### HISTORY
- `2026-09-04 18:05 Europe/Warsaw` — validated in rotation C and promoted into FRT-036; no production code changed by the Quality Loop.

---

## CFL-WORKSPACE-WRITE-ACCESS-FAILOPEN-001 — Workspace entitlement lookup failure grants synthetic trial write access

- FINDING_ID: `CFL-WORKSPACE-WRITE-ACCESS-FAILOPEN-001`
- TITLE: `Workspace entitlement lookup failure grants synthetic trial write access`
- SEVERITY: `HIGH`
- LIFECYCLE: `OPEN_VALIDATED`
- FIRST_SEEN_SHA: `425ab6b23b71b6b919143f0f982dc6d1adcad96c`
- LAST_CHECKED_SHA: `425ab6b23b71b6b919143f0f982dc6d1adcad96c`
- CURRENT_TREE: `e4c3f9dd13e73b32b016f3d208faf3aed14d9ad3`
- FIRST_SEEN_AT: `2026-09-04 20:58 Europe/Warsaw`
- LAST_CHECKED_AT: `2026-09-04 20:58 Europe/Warsaw`
- FINDING_FINGERPRINT: `access-gate:string-workspace:lookup-error-or-no-row->null->synthetic-trial_active->write-allowed`

### PROBLEM_STATEMENT
The canonical workspace write-access gate fails open when it receives a workspace ID string and cannot obtain the corresponding workspace entitlement row. `selectWorkspaceAccessRow()` catches lookup failures and returns `null` unless explicitly called with `failClosed`. `resolveWorkspaceAccessInput()` then converts that missing result into a synthetic `{ id, access_status: 'trial_active' }`. `assertWorkspaceWriteAccess()` consequently authorizes the mutation. The current case mutation API invokes this gate for every non-GET request using the resolved workspace ID, so an entitlement lookup failure can bypass a real blocked billing/access state.

### USER_OR_SYSTEM_IMPACT
A workspace whose authoritative state is expired, canceled, payment-failed, inactive, missing, or temporarily unreadable can receive mutation permission as `trial_active` if the entitlement lookup fails. This does not by itself prove cross-workspace data access because request/workspace scoping is separate, but it does break the canonical write-authority boundary and can permit writes that product/billing policy intends to block.

### EXPECTED_INVARIANT
A write-authority decision must be based on an authoritative workspace entitlement row or another explicitly authoritative policy source. Failure to read that authority must fail closed with an unavailable/denied result. A missing or unreadable entitlement row must never be upgraded to an allowed synthetic state.

### OBSERVED_BEHAVIOR
1. `selectWorkspaceAccessRow(workspaceId)` catches query errors and returns `null` when `failClosed` is not set.
2. `resolveWorkspaceAccessInput(workspaceId)` calls that default fail-open form.
3. If no row is returned, it constructs `{ id: workspaceId, access_status: 'trial_active' }`.
4. `normalizeWorkspaceAccessStatus()` preserves `trial_active`.
5. `isAllowedWriteStatus()` returns true for `trial_active`.
6. `assertWorkspaceWriteAccess()` therefore returns true.
7. `api/cases.ts` calls `await assertWorkspaceWriteAccess(workspaceId, req)` before POST/PATCH/DELETE case mutations.

### CURRENT_EVIDENCE
Current at SHA `425ab6b23b71b6b919143f0f982dc6d1adcad96c`, tree `e4c3f9dd13e73b32b016f3d208faf3aed14d9ad3`:
- `src/server/_access-gate.ts` — `selectWorkspaceAccessRow`, `resolveWorkspaceAccessInput`, `normalizeWorkspaceAccessStatus`, `isAllowedWriteStatus`, `assertWorkspaceWriteAccess`.
- `api/cases.ts` — non-GET `P0_SERVICE_ROLE_SCOPE_MUTATION_GATE` calls `assertWorkspaceWriteAccess(workspaceId, req)` before case mutations.
- The same access-gate module already uses `{ failClosed: true }` for AI entitlement lookup, demonstrating that fail-closed lookup semantics are supported but are not applied to the general write gate.

### REPRODUCTION_OR_VERIFICATION
Shortest deterministic source/runtime test:
1. Call `assertWorkspaceWriteAccess(validWorkspaceId)` with `selectFirstAvailable` forced to throw or return no workspace row.
2. Observe current result: write access resolves through synthetic `trial_active` instead of throwing `WORKSPACE_ACCESS_UNAVAILABLE`/access denied.
3. At API level, authenticate a request to an owned workspace whose entitlement lookup is forced unavailable and attempt POST/PATCH/DELETE `/api/cases`.
4. Repaired behavior must reject the mutation before persistence and produce zero DB changes.

### ROOT_CAUSE
Class: `AUTHORITY_FAIL_OPEN / SYNTHETIC_DEFAULT / ERROR_COLLAPSE`. Compatibility logic collapses two materially different states — authoritative active trial and inability to read authority — into the same allowed `trial_active` value. The comment assumes ownership/scoping checks are sufficient, but ownership and billing/write entitlement are different authorities.

### AFFECTED_FLOW_AND_OWNERS
Flow: authenticated mutation → resolved workspace → shared `assertWorkspaceWriteAccess` → workspace entitlement lookup → mutation API → service-role persistence. Current semantic owner is `src/server/_access-gate.ts`; `api/cases.ts` is one confirmed consumer. Because the gate is shared, other mutation consumers must be enumerated before repair rather than patched individually.

### COUNTEREVIDENCE_CHECKED
- `api/cases.ts` separately resolves/scopes workspace and relationships; this reduces cross-tenant risk but does not satisfy billing/write entitlement authority.
- `normalizeWorkspaceAccessStatus()` contains legitimate compatibility normalization for historical stored statuses; this finding does not require deleting those mappings when an authoritative row was successfully read.
- `assertWorkspaceAiAllowed()` already requests `selectWorkspaceAccessRow(..., { failClosed: true })`, proving the module recognizes authority-unavailable as a distinct fail-closed state in another sensitive path.
- No live production outage or unauthorized mutation was reproduced in this run; exploit frequency/production occurrence is `INSUFFICIENT_EVIDENCE`. The authorization defect itself is source-proven.

### REPAIR_OBJECTIVE
Make general workspace write authorization fail closed when the authoritative workspace row cannot be read or does not exist, while preserving explicitly supported historical status/plan normalization only after an authoritative row is available.

### IMPLEMENTATION_BLUEPRINT
1. Resolve fresh HEAD/workflow and enumerate current callers of `assertWorkspaceWriteAccess` before editing.
2. At the shared access-gate owner, distinguish `lookup unavailable`, `workspace missing`, and `authoritative row present` instead of returning synthetic `trial_active` for the first two.
3. Require the string-workspace path used by mutation APIs to read entitlement with fail-closed semantics. Map lookup infrastructure failure to a stable unavailable response (for example existing `WORKSPACE_ACCESS_UNAVAILABLE` semantics) and missing workspace to the project’s canonical denied/not-found authority response.
4. Preserve compatibility normalization only for fields from an authoritative row; do not infer active trial solely from a workspace ID.
5. Do not add per-endpoint fallback gates or a second entitlement owner.
6. Add deterministic unit coverage for thrown lookup, missing row, trial-active row, free row, paid-active row, expired row, canceled row, payment-failed row and inactive row.
7. Add at least one mutation-boundary regression proving POST/PATCH/DELETE cannot persist when entitlement authority is unavailable.
8. Re-run affected access/billing and mutation tests plus required Guardian/security evidence before closeout.

### CURRENT_CODE_ANCHORS
`CURRENT_AT_LAST_CHECK` only:
- `src/server/_access-gate.ts` → `selectWorkspaceAccessRow`, `resolveWorkspaceAccessInput`, `assertWorkspaceWriteAccess`, `assertWorkspaceAiAllowed`
- `api/cases.ts` → `P0_SERVICE_ROLE_SCOPE_MUTATION_GATE`
STALE-CODE SAFETY: before repair, resolve fresh canonical HEAD/tree/workflow and semantically remap the shared gate and all current callers. Do not implement from stale line numbers or assume the case API is the only consumer.

### IN_SCOPE
Shared workspace write-entitlement lookup semantics; unavailable/missing authority behavior; existing callers; deterministic negative mutation tests; current billing/access compatibility after authoritative read.

### OUT_OF_SCOPE
Authentication redesign; workspace identity resolution redesign; RLS replacement; pricing/plan changes; unrelated Forteca UI; AI-specific entitlement behavior except as counterevidence; production data migration unless fresh evidence proves it is required.

### DEPENDENCIES_AND_LEGAL_REPAIR_BOUNDARY
The active FRT-036 contract owns Case Add mutation behavior but its allowed write set does not clearly own the shared cross-application billing/access authority gate. No separate currently active canonical repair owner was proven in this run. Promotion status is therefore `CANONICAL_STAGE_QUEUE_MISSING` until fresh workflow provides an existing legal security/access repair boundary or explicitly expands a canonical owner. Do not smuggle this shared repair into FRT-036 solely because `/api/cases` is a consumer.

### TEST_PLAN
Positive: authoritative `trial_active`, supported Free and valid paid rows retain allowed writes according to current policy. Negative: lookup throws → denied/unavailable and zero mutation; workspace row missing → denied and zero mutation; `trial_expired`, `payment_failed`, `inactive`, `canceled` remain denied. Regression: historical status/plan normalization still works when the row exists; workspace scoping remains unchanged; AI fail-closed path remains unchanged or stronger; at least one real mutation endpoint proves no persistence under authority-unavailable.

### ACCEPTANCE_GATES
No mutation path can obtain write permission solely from a workspace ID when entitlement lookup fails or returns no authoritative row; deterministic gate tests cover all listed states; affected mutation regression proves zero persistence on unavailable authority; no second access SOT is introduced; required Security Review/Guardian evidence binds to the exact candidate SHA.

### REGRESSION_RISKS_AND_ROLLBACK
Fail-closing may expose previously masked legacy workspaces with missing rows or infrastructure/schema faults. That is expected authority behavior but can surface operational errors. Distinguish unavailable from legitimately blocked states so operators can diagnose without granting access. Roll back only by normal non-destructive revert if exact tests show authoritative active workspaces are incorrectly denied; never restore synthetic allow-on-lookup-failure as the fix.

### DONE_PROOF_REQUIRED
Exact candidate SHA/tree; complete caller map; deterministic shared-gate tests; mutation-boundary zero-write proof for lookup failure/missing row; regression proof for valid trial/free/paid states and blocked states; required executable Guardian/security receipt when available; canonical workflow/repair receipt owning the shared gate.

### HISTORY
- `2026-09-04 20:58 Europe/Warsaw` — validated in rotation F against `425ab6b2...`; source proves a general write-authority lookup failure is converted into allowed synthetic `trial_active`. No production code changed. Promotion preflight found no proven legal shared-access repair owner in the active FRT-036 boundary.
