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

The FRT-036 Add Case flow treats the base case insert, optional checklist/activity enrichment, and the subsequent list refresh as one logical failure boundary even though they are not one atomic operation. `createStarterCaseForClient()` persists the case first and may then throw while reading/inserting checklist items or inserting the creation activity. `handleCreateCase()` also awaits `refreshCases()` after a successful create. Any of those post-insert failures reaches the same catch block that reports `Nie udało się utworzyć sprawy` while the case may already exist in canonical persistence.

### USER_OR_SYSTEM_IMPACT

A transient or deterministic failure after the base insert can leave a real case in the database while the UI tells the operator that creation failed and keeps the creation flow retryable. A normal retry can therefore create a second case for the same intended user action. The persisted record may also be missing requested checklist/activity enrichment. This violates UI/backend truth and makes retry behavior unsafe for a core business entity.

### EXPECTED_INVARIANT

For one user create intent, the system must expose one truthful terminal state. Before persistence, failures may be reported as creation failure. After the base case is durably created, subsequent enrichment or refresh failures must never be represented as if no case was created. Retrying the same logical create after an ambiguous response must not silently create a duplicate canonical case.

### OBSERVED_BEHAVIOR

1. `handleCreateCase()` awaits `createStarterCaseForClient()` and then `refreshCases()` inside one try/catch.
2. The catch always reports `Nie udało się utworzyć sprawy`.
3. `createStarterCaseForClient()` calls `createCaseInSupabase()` before optional checklist reads/inserts and activity insertion.
4. Failures in those later operations are thrown after the case ID already exists.
5. A rejected case-list fetch in `refreshCases()` is also thrown after successful creation.
6. The current POST `/api/cases` path performs a new case insert and the audited path exposes no create-intent/idempotency key that would make a retry of the same UI action return the already-created case.

### CURRENT_EVIDENCE

Current at `2abb05c43362cd02294d9e6c8ef3d0b64c1b021c`, tree `5140e605174dcaf61bcec7ece854fbfd24d50d3b`:

- `src/pages/Cases.tsx` — semantic anchor `handleCreateCase`: base create, `await refreshCases()`, success messaging, and a shared catch that reports creation failure.
- `src/pages/Cases.tsx` — semantic anchor `refreshCases`: rejected canonical case fetch throws.
- `src/lib/cases/create-client-case.ts` — semantic anchor `createStarterCaseForClient`: `createCaseInSupabase()` precedes checklist read/insert and activity insertion; later failures can propagate after persistence.
- `api/cases.ts` — semantic anchor POST handler: validates workspace/client/owner and then performs `insertCaseWithSchemaFallback(payload)`; no audited create-intent/idempotency token is consumed before insertion.
- `tests/forteca-frt-036-cases-add.test.cjs` — focused test asserts the create path and presence of `await refreshCases()`, but does not verify post-insert failure classification, duplicate-safe retry, or partial-enrichment recovery.

### REPRODUCTION_OR_VERIFICATION

Shortest deterministic verification strategy:

1. Instrument or mock the existing create path so the base case insert returns a real created case ID.
2. Force exactly one post-insert operation to reject: checklist existing-item read, checklist item insert, activity insert, or the canonical case-list refresh.
3. Submit Add Case once.
4. Verify the canonical case record exists.
5. Observe that the current UI path enters the generic create-failure catch.
6. Retry the same form submission and verify whether a second canonical case is inserted. The repaired behavior must either resume/complete the existing create intent or clearly report `case created; follow-up failed` without issuing an unsafe duplicate create.

### ROOT_CAUSE

Class: `PARTIAL_COMMIT / FALSE_FAILURE / NON_IDEMPOTENT_RETRY_BOUNDARY`.

The create orchestration conflates irreversible base persistence with fallible post-create enrichment and read-model refresh. Error ownership is defined by the outer UI try/catch rather than by the actual commit boundary. The POST create path also lacks a visible request identity that could make ambiguous retries safe.

### AFFECTED_FLOW_AND_OWNERS

Flow: `/cases` Add Case modal → `handleCreateCase` → `createStarterCaseForClient` → `createCaseInSupabase` / POST `api/cases.ts` → canonical `cases` persistence → optional checklist/activity writes → `refreshCases` → visible list/result.

Current semantic owners at last check:

- UI orchestration: `src/pages/Cases.tsx`
- case-create orchestration: `src/lib/cases/create-client-case.ts`
- canonical case mutation/API boundary: `api/cases.ts` and the existing Supabase request owner it calls
- focused acceptance coverage: `tests/forteca-frt-036-cases-add.test.cjs`
- legal workflow owner: active stage `FRT-036`

### COUNTEREVIDENCE_CHECKED

- The API validates workspace write access and scopes the case payload to the resolved workspace; this finding is not an isolation/auth finding.
- Portal email failure is already converted to `portalLink.status=failed` and can be surfaced as a warning; that is evidence the product already recognizes post-create partial success for one side effect.
- The focused FRT-036 test checks that refresh is called, but it does not prove correct failure semantics when refresh rejects after persistence.
- No current runtime reproduction was executed in this audit; the defect is source-proven from deterministic control flow. Runtime frequency is therefore `INSUFFICIENT_EVIDENCE`, not assumed.

### REPAIR_OBJECTIVE

Make the case-create commit boundary explicit and make retry semantics safe. Once a canonical case ID has been created, the UI must never claim that the case itself failed to be created. Post-create enrichment and refresh must have separate truthful outcomes, and an ambiguous retry must not create a second case for the same logical submit intent.

### IMPLEMENTATION_BLUEPRINT

1. Re-read current HEAD and remap these semantic owners before editing; do not apply stale line-number patches.
2. Define the create operation result around the canonical base-case commit: once a case ID exists, preserve and return that identity even if later enrichment cannot fully complete.
3. Separate base-create failure from post-create enrichment failure. Checklist/activity failures after base persistence must produce a partial-success/recovery result that includes the created case ID and the failed follow-up class.
4. Separate canonical mutation truth from list refresh truth in `handleCreateCase`. A refresh failure after creation must not be rendered as `case creation failed`; keep or reconcile the created ID and offer/retry refresh independently.
5. Introduce or reuse one bounded create-intent/idempotency mechanism at the canonical mutation owner so retransmission of the same pending submit cannot silently insert a second case. Do not create a second store or router. The request identity must be scoped to workspace and one logical create intent and must return/reconcile the previously created case on replay.
6. Preserve current workspace/client/owner validation and portal-link partial-success semantics.
7. Add deterministic tests at the lowest useful layer for: pre-insert failure, base insert success + checklist read failure, base insert success + checklist insert failure, base insert success + activity failure, base insert success + refresh failure, and replay of the same create intent.
8. Run the FRT-036 focused matrix plus relevant case-create/API tests and exact browser proof before stage acceptance.

### CURRENT_CODE_ANCHORS

`CURRENT_AT_LAST_CHECK` only:

- `src/pages/Cases.tsx` → `handleCreateCase`, `refreshCases`
- `src/lib/cases/create-client-case.ts` → `createStarterCaseForClient`
- `api/cases.ts` → POST case-create branch, `insertCaseWithSchemaFallback`
- `tests/forteca-frt-036-cases-add.test.cjs` → `FRT-036 keeps write behavior on the existing scoped create path`

STALE-CODE SAFETY: before repair, resolve fresh canonical branch/HEAD/tree, re-read the active workflow/contract, and semantically remap all owners above. Paths and symbols are anchors from the last check, not timeless patch instructions.

### IN_SCOPE

- truthful base-create vs post-create result classification
- checklist/activity partial-success handling for this create flow
- list refresh failure after successful create
- duplicate-safe retry/idempotency for one Add Case create intent
- focused regression/browser evidence required by FRT-036

### OUT_OF_SCOPE

- redesigning the Cases page
- changing unrelated case lifecycle/status behavior
- broad database refactors
- replacing canonical Supabase persistence
- redesigning portal token/mail architecture beyond preserving current partial-success behavior
- unrelated Forteca stages

### DEPENDENCIES_AND_LEGAL_REPAIR_BOUNDARY

The current canonical workflow already owns this behavior in active `FRT-036 — CASE ADD`: its mission explicitly covers real case mutation, validation and list refresh, and its allowed write set includes the existing case-create dialog/mutation and focused tests/guards. No new workflow owner is required. Any production repair remains subject to FRT-036 scope, current capability routing, and required Guardian/test/browser/receipt gates.

### TEST_PLAN

Positive:

- normal create persists exactly one workspace-scoped case, returns its ID, completes requested enrichment, refreshes the list and shows success;
- portal email failure after create remains a truthful warning without reverting the created-case truth.

Negative/failure-boundary:

- base insert failure produces create failure and no case;
- checklist existing-read failure after base insert reports partial success/recovery with the same created case ID;
- checklist item failure after base insert does not report that the case was not created;
- activity failure after base insert does not report that the case was not created;
- list refresh failure after base insert does not report create failure and does not discard the created-case identity.

Retry/idempotency:

- replay the same create intent after each post-insert failure and prove canonical case count increases by zero;
- a distinct new create intent with the same business fields can still create a new case when explicitly submitted as a new intent.

Regression:

- workspace/client/owner scope guards remain fail-closed;
- `primaryForClient` conflict behavior remains intact;
- client portal email prerequisites remain pre-insert where currently required;
- existing FRT-036 focused visual/form tests remain green;
- no second case store/router/state owner is introduced.

### ACCEPTANCE_GATES

- Exactly one canonical case exists for one replayed create intent across tested post-insert failures.
- UI never emits the generic create-failure message after the canonical case ID is known to exist.
- Every post-create failure class has a truthful user-visible/recoverable outcome bound to the created case ID.
- Fresh list refresh can be retried/reconciled without reissuing base creation.
- Existing workspace/client/owner authorization behavior remains unchanged or stronger.
- Focused deterministic tests pass on exact candidate SHA.
- Real browser + canonical DB evidence proves one submit/retry scenario and visible result reconciliation.
- Required Guardian result and FRT-036 receipt bind to the exact candidate SHA before stage acceptance.

### REGRESSION_RISKS_AND_ROLLBACK

Risks: over-broad retry logic could suppress legitimate distinct creates; moving errors could hide failed checklist/activity enrichment; an idempotency token with wrong scope could collide across workspaces or user intents. Keep the repair bounded to one create intent and preserve explicit follow-up failure state. Roll back the repair commit through the project’s normal non-destructive revert path if exact candidate tests/browser/DB evidence shows lost creates, cross-intent collisions, or broken workspace scoping.

### DONE_PROOF_REQUIRED

- exact candidate SHA/tree
- deterministic failure-injection test results for every listed boundary
- duplicate-safe replay proof
- real authenticated browser proof for Add Case
- canonical DB evidence showing one case for one logical retry scenario
- Guardian coverage/result evidence required by current routing
- FRT-036 stage receipt and workflow acceptance bound to the same candidate

### HISTORY

- `2026-09-04 18:05 Europe/Warsaw` — validated during rotation C against `2abb05c4...`; source control flow proves false failure after partial commit and unsafe retry potential. Promoted to the existing active FRT-036 repair boundary; no production code changed by the Quality Loop.
