---
typ: implementation_stage
doc_role: active_stage_contract
status: routed
canonical: true
project_id: closeflow_lead_app
stage_id: LF-V1-PR-001_SUPABASE_SCHEMA_MIGRATIONS_RLS_AND_SERVICE_ROLE_BOUNDARY
parent_stage: LF-SEC-CG-001H_INDEPENDENT_SECURITY_RESCAN_AND_RELEASE_GATE
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: baae74b2b3304bbbf5caedd56dda2f2db1eda03b
target_branch: codex/closeflow-v1-e2e-roadmap
---

# C1 - Supabase schema, migrations, RLS and service-role boundary

## Objective

Create one auditable, reproducible Supabase database boundary for CloseFlow:
the executable migration ledger must be distinct from historical SQL and
rescue material, schema drift must be measured, RLS and storage policies must
be fail-closed and workspace-scoped, and every service-role write must have a
source-backed owner and authorization matrix. Establish the backup-before-
change gate without applying a live migration or mutating a provider.

## Controller contract

```text
ROOT_CAUSE=MIGRATION_SCHEMA_AND_SERVICE_ROLE_AUTHORITY_DRIFT_MAKES_DATABASE_SAFETY_UNPROVABLE
WHY_THIS_IS_NOT_A_PATCH=the deliverable must reconcile migration provenance, schema/RLS state, storage policy state and server-only service-role writes as one database security boundary
CANONICAL_OWNER=supabase/migrations plus the server Supabase adapter and its scoped API callers; supabase/sql, rescue and _legacy_migration_filenames_* remain historical evidence only
SSOT_IMPACT=supabase/migrations is the executable schema ledger; no duplicate SQL directory, generated dump or runtime fallback becomes a competing migration authority
PREVIOUS_STAGE_IMPACT=B1-B8 established workspace, billing, AI, support, upload, dependency and secret invariants that C1 must preserve
SECURITY_IMPACT=prevent cross-workspace reads/writes, public storage access, unreviewed service-role authority and irreversible schema changes without backup evidence
BLAST_RADIUS=database schema, RLS/storage policies, server service-role helpers, selected API callers and their focused guards/tests; no production/provider mutation
```

## Entry conditions

- The remote working branch contains the accepted B8 repair commit
  `baae74b2b3304bbbf5caedd56dda2f2db1eda03b` and state revision 58 routes C1.
- `origin/dev-rollout-freeze` remains the production reference; no merge,
  deployment, live migration, secret change or provider write is authorized.
- Existing B1-B8 security evidence is reusable only where the exact source SHA,
  inputs and changed surface remain unchanged.
- Unrelated local evidence such as `.stversions/` and the prior worker receipt
  must remain untouched and outside C1 staging.

## Bounded READ_FIRST

- `_project/WORKFLOW_STATE.json` from the remote working branch
- this contract and only the C1 section of the canonical CloseFlow roadmap
- `supabase/migrations/` inventory and the existing migration/security guards
- `src/server/_supabase.ts`, `src/server/_supabase-auth.ts`,
  `src/server/_portal-storage.ts`, `src/server/_portal-token.ts`
- the endpoint callers named by `scripts/check-service-role-scoped-mutations.cjs`
- focused migration, RLS, storage, workspace and service-role tests
- existing B1-B8 receipts needed to preserve their exact invariants

Do not preload C2 or later stages. Do not inspect or change provider secrets.

## Allowed mutable paths

```text
supabase/migrations/<one bounded C1 migration or explicit repair only>
scripts/check-supabase-migrations-guard.cjs
scripts/check-service-role-scoped-mutations.cjs
scripts/check-p0-supabase-rls-schema-confirmation.cjs
scripts/check-supabase-first-architecture.cjs
scripts/verify-server-only-secrets.cjs
scripts/check-a22-supabase-auth-rls-workspace.cjs
scripts/check-a22c-profiles-id-rls-hotfix.cjs
scripts/check-faza2-etap22-rls-backend-security-proof.cjs
scripts/check-stage05-supabase-data-contract.cjs
tests/faza2-etap22-rls-backend-security-proof.test.cjs
package.json
src/server/records.ts
scripts/check-c1-*.cjs
tests/c1-*.test.cjs
tests/c1-*.test.ts
audit/evidence/LF-V1-PR-001_*
```

The controller may narrow this list before implementation. Do not modify
`supabase/sql`, `supabase/rescue`, `_legacy_migration_filenames_*`, package
manifests, production configuration or application UI unless a directly
evidenced C1 root cause requires it and the controller records the narrowed
scope first. `_project/WORKFLOW_STATE.json` is updated only as the separate
control-plane closeout commit.

## Required checks

1. Produce an exact migration ledger: filename order, timestamp/prefix
   collisions, executable-vs-historical classification, content hashes and
   the rule that only `supabase/migrations` is executable. No blind migration
   apply and no `npm audit fix`-style automatic database repair.
2. Compare the repository schema contract with the available schema evidence:
   tables, columns, foreign keys, indexes, triggers, functions, grants,
   RLS-enabled/forced state, policies and private storage buckets. If a
   read-only provider probe or exact schema dump is unavailable, record the
   missing evidence and owner boundary explicitly rather than guessing.
3. Verify every public table and storage path has fail-closed, workspace-aware
   policies; verify anonymous/public writes are absent; verify service-role
   bypass is intentional, server-only and not exposed through `VITE_*` or
   client bundles.
4. Build a service-role write matrix from the adapter, RPCs and API callers:
   operation, table/bucket, workspace predicate, actor/role check, audit
   trail, idempotency/transaction boundary and negative cross-workspace case.
   Repair only proven boundary defects.
5. Establish backup-before-change evidence. A local evidence receipt may
   describe the exact required backup and restore/rollback command, but no
   live backup, migration apply or provider mutation may be fabricated or
   executed in this stage.
6. Add or run focused static and runtime negative tests for migration ledger,
   RLS/storage fail-closed behavior, service-role server-only use and
   cross-workspace mutation rejection. Reuse unchanged B1-B8 evidence with
   exact hashes where valid.
7. Run TSC, lint, build, relevant direct regressions and Guardian security,
   architecture and test-quality checks. Obtain an independent read-only
   review; provider timeout is recorded as timeout, never as PASS.

## Forbidden shortcuts

```text
LIVE_MIGRATION_APPLY=FORBIDDEN
PROVIDER_WRITE=FORBIDDEN
SECRETS_OR_TOKENS=DO_NOT_READ_OR_CHANGE
BLIND_MIGRATION_REPAIR=FORBIDDEN
SECOND_MIGRATION_SSOT=FORBIDDEN
PUBLIC_RLS_OR_STORAGE_WRITE=FORBIDDEN
CLIENT_SERVICE_ROLE=FORBIDDEN
TEST_WEAKENING=FORBIDDEN
```

## PASS conditions

```text
EXACT_BASE_SHA=PASS
CANONICAL_MIGRATION_LEDGER=PASS_OR_EVIDENCED_NON_BLOCKING_FINDING
SCHEMA_DRIFT_CLASSIFIED=YES
RLS_AND_STORAGE_FAIL_CLOSED=PASS_OR_EVIDENCED_NON_BLOCKING_FINDING
SERVICE_ROLE_WRITE_MATRIX=COMPLETE
SERVER_ONLY_SERVICE_ROLE_BOUNDARY=PASS
BACKUP_BEFORE_CHANGE=PROOF_OR_EXPLICIT_OWNER_BOUNDARY
FOCUSED_NEGATIVE_TESTS=PASS
TSC=PASS
LINT=PASS
BUILD=PASS
GUARDIAN=PASS_OR_REGISTERED_FINDING
INDEPENDENT_REVIEW=COMPLETED_OR_TIMEOUT_REGISTERED
PRODUCTION_TOUCHED=NO
```

Any agent-remediable database or authorization defect is a FAIL until fixed
and re-tested. A missing live/provider backup or schema proof may be a
registered owner boundary only after the complete local evidence pack and
fail-closed code gates pass; it is not permission to apply the change.

## Commit and recovery boundary

Use one logical C1 implementation/evidence commit with explicit selective
staging, then exact commit review, push to
`codex/closeflow-v1-e2e-roadmap` and remote SHA verification. Never use
`git add .`, `git add -A`, reset/clean/restore/stash/rebase, amend or force
push. Preserve unrelated local evidence and stop before C2 after C1 verdict
and router update.

---

## OWNER AMENDMENT 2026-08-11 - mandatory SSOT pre-close gate

```text
OWNER_APPROVED_SCOPE_EXTENSION=TRUE
AMENDMENT_SCOPE=ONE_SOURCE_OF_TRUTH_REPAIR_ONLY
ONE_STAGE_ONLY=TRUE
CURRENT_STAGE=C1
C2_IMPLEMENTATION=FORBIDDEN
C2_CODE_CHANGE=0
C2_PROVIDER_CHANGE=0
NO_PARALLEL_ROADMAP=TRUE
NO_SECOND_STATUS_SYSTEM=TRUE
```

This amendment is part of the current C1 contract. It does not create a new
stage and must be read and executed before C1 can be accepted or closed. The
owner explicitly requires the controller to eliminate the evidenced SSOT drift
below before stopping. Findings outside the exact items below remain
`REGISTER_ONLY` unless independently required by the original C1 contract.

### Why this amendment exists

A bounded repository audit at working-branch HEAD
`52a2c391da2d4196e1f41ae653202e2b78ad3f1a` found current conflicts between
routing, workflow state, migration history semantics and runtime status
semantics. These are not permission to redesign the product. They are a
mandatory consistency repair so a later stage does not inherit multiple active
truths.

### C1-SSOT-01 - canonical project entry/router drift

Evidence:

- project binding declares canonical Obsidian router
  `10_PROJEKTY/CloseFlow_Lead_App/00_AI_START_SPIS_TRESCI.md`;
- `AGENTS.md` and `_project/PROJECT_MANIFEST.json` point to
  `10_PROJEKTY/CloseFlow_Lead_App/00_AI_START.md`;
- `_project/00_AI_START_SPIS_TRESCI.md` points to
  `10_PROJEKTY/CloseFlow_Lead_App/00_AI_START_SPIS_TRESCI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`;
- `_project/Naprawa_Zrodla_Prawdy/00_START_NAPRAWA_ZRODLA_PRAWDY.md` references
  `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`.

Required repair:

1. Resolve the authoritative route from current connected Obsidian/project
   registry evidence if available.
2. If no newer authoritative registry evidence exists, use the project binding
   route `10_PROJEKTY/CloseFlow_Lead_App/00_AI_START_SPIS_TRESCI.md`.
3. Align repo pointers/bridges to that one route; keep legacy aliases only as
   explicit legacy redirects, never as competing canonical starts.
4. Do not fabricate Obsidian readback. If the canonical Vault cannot be read or
   written, record `OBSIDIAN_ROUTER_READBACK_REQUIRED` / `LOCAL_SYNC_PENDING`
   as appropriate.

Acceptance:

```text
ONE_CANONICAL_PROJECT_ENTRY=PASS
ALL_REPO_POINTERS_RESOLVE_TO_CANONICAL_ENTRY=PASS
LEGACY_ALIASES_EXPLICITLY_NON_CANONICAL=PASS
```

### C1-SSOT-02 - current workflow / last accepted ambiguity

Evidence:

`_project/WORKFLOW_STATE.json` revision 61 names the same C1 workflow both as:

- `last_accepted.status=CLOSED_WITH_REGISTERED_OWNER_BOUNDARY`, and
- `current_workflow.status=OWNER_REQUIRED`,

while the current provider evidence states `C1=NOT_ACCEPTED`.

Required repair:

- reconcile state using current evidence;
- if C1 was reopened after an earlier bounded closeout, encode that explicitly
  instead of representing one stage as simultaneously accepted and not
  accepted;
- preserve historical accepted evidence as history, but ensure exactly one
  unambiguous current stage status;
- `current_workflow`, `last_accepted`, `next_workflow` and the evidence receipt
  must not contradict one another after closeout.

Acceptance:

```text
CURRENT_WORKFLOW_STATUS_UNAMBIGUOUS=PASS
LAST_ACCEPTED_SEMANTICS_NON_CONTRADICTORY=PASS
NEXT_WORKFLOW_MATCHES_CURRENT_VERDICT=PASS
```

### C1-SSOT-03 - original C1 contract versus later provider mutation drift

Evidence:

The original C1 contract states `PROVIDER_WRITE=FORBIDDEN` and describes C1 as
not applying a provider mutation. Later evidence
`audit/evidence/LF-V1-PR-001_provider-acl-repair-20260811.md` records
`PROVIDER_MUTATION=YES` for an owner-authorized bounded ACL repair.

Required repair:

- do not rewrite history to pretend the original contract authorized the
  mutation;
- preserve the original prohibition as the historical stage baseline and add
  an explicit owner-authorized reopen/amendment record describing the later
  bounded mutation, exact scope, result and rollback limitations;
- final C1 evidence must make the chronology auditable.

Acceptance:

```text
ORIGINAL_CONTRACT_HISTORY_PRESERVED=PASS
LATER_OWNER_AUTHORIZATION_EXPLICIT=PASS
PROVIDER_MUTATION_CHRONOLOGY_AUDITABLE=PASS
```

### C1-SSOT-04 - migration file comment / execution-history semantics drift

Evidence:

`supabase/migrations/20260811180000_c1_revoke_public_anon_grants.sql` says it is
intentionally not applied and that backup evidence is required before live
migration. Current evidence records a bounded subset applied through direct
`db query`, while also correctly recording that no
`supabase_migrations.schema_migrations` history row was created.

Required repair:

- reconcile comments, migration ledger and evidence with the actual chronology;
- never mark the migration as fully applied while residual statements remain;
- never forge or manually insert a migration-history row;
- direct bounded ACL repair and executable migration status must remain distinct
  concepts;
- retain `supabase/migrations` as the only executable migration SSOT.

Acceptance:

```text
MIGRATION_COMMENT_MATCHES_CURRENT_TRUTH=PASS
DIRECT_REPAIR_NOT_MISREPRESENTED_AS_MIGRATION_APPLY=PASS
MIGRATION_HISTORY_NOT_FORGED=PASS
ONE_EXECUTABLE_MIGRATION_SSOT=PASS
```

### C1-SSOT-05 - source-truth repair index / SOT-006 provenance drift

Evidence:

`_project/Naprawa_Zrodla_Prawdy/00_START_NAPRAWA_ZRODLA_PRAWDY.md` indexes
SOT-000 through SOT-003 and later records SOT-004 completion, but does not index
SOT-006. `LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP.md` exists and says it
turns an `SOT-005` audit into guards. The bounded current-repository search did
not establish a canonical `LF-UI-SOT-005*` artifact.

Required repair:

1. Search exact current repository/commit history for the referenced SOT-005
   provenance before editing anything.
2. If the real SOT-005 artifact exists, link the canonical artifact and repair
   the index.
3. If it does not exist, do not invent it. Correct SOT-006 provenance to the
   actual evidence source and record that the historical SOT-005 reference was
   stale/unresolved.
4. Update the existing SSOT repair index so every active/current artifact has
   one canonical route and explicit status.
5. Do not create another SSOT index.

Acceptance:

```text
SOT006_PROVENANCE_RESOLVED=PASS
SOURCE_TRUTH_REPAIR_INDEX_COMPLETE=PASS
MISSING_SOT005_NOT_FABRICATED=PASS
SECOND_SSOT_INDEX=NO
```

### C1-SSOT-06 - duplicated task/event status semantics

Current code contains overlapping definitions of the same task/event status
meaning across:

- `src/lib/domain-statuses.ts`;
- `src/lib/source-of-truth/schedule-options.ts`;
- `src/lib/source-of-truth/today-work-item-status.ts`;
- `src/lib/source-of-truth/task-display-status.ts`;
- active Today/Tasks/Calendar runtime helpers and page-level predicates.

Confirmed examples include:

- event `done` rendered as `Zrobione` in `domain-statuses.ts` but `Odbyte` in
  `schedule-options.ts`;
- multiple independent closed-status sets with different compatibility values;
- Today/task-display logic considers values such as `closed`, `removed`,
  `archived`/`deleted`, while other active grouping predicates use narrower
  sets.

This finding does NOT mean every presentation label must be identical. A
context-specific display adapter may intentionally render the same canonical
status differently. The defect is allowing multiple modules/pages to own raw
normalization, legacy equivalence or closed/open domain meaning independently.

Required repair:

1. Trace active call sites first; do not choose a new owner from filenames or
   aesthetics.
2. Select one existing canonical owner for raw task/event status values,
   normalization, legacy aliases and closed/open semantics.
3. Make Today, Tasks, Calendar and schedule/config layers consume that owner.
4. Presentation adapters may keep context-specific wording only if they import
   canonical status meaning and contain no competing raw-domain truth.
5. Remove or convert duplicate sets/predicates to adapters; do not create a new
   status repository if an existing owner can be repaired.
6. Preserve valid delete/archive behavior and all accepted runtime behavior
   unless evidence proves it is the drift being repaired.

Acceptance:

```text
ONE_TASK_EVENT_DOMAIN_STATUS_OWNER=PASS
RAW_NORMALIZATION_DUPLICATION=0_OR_EXPLICIT_ADAPTER_ONLY
CLOSED_OPEN_SEMANTICS_SINGLE_OWNER=PASS
TODAY_TASKS_CALENDAR_CONSUME_CANONICAL_STATUS_MEANING=PASS
CONTEXT_DISPLAY_ADAPTERS_NON_OWNING=PASS
```

### C1-SSOT-07 - status guard blind spot

Evidence:

`scripts/check-config-status-source-of-truth.cjs` checks only six active pages
for local status maps (`Leads`, `LeadDetail`, `Cases`, `ClientDetail`,
`CaseDetail`, `SalesFunnel`). It does not inspect active Today/Tasks/Calendar
status semantics. Existing marker/import guards therefore can pass while the
same raw status meaning is duplicated with different closed sets or aliases.

Required repair:

- extend or add a C1-scoped deterministic SSOT guard that covers active
  Today/Tasks/Calendar runtime;
- guard canonical status owner imports and semantic equivalence, not just token
  presence;
- reject new page-local/raw duplicate closed sets, legacy alias maps and domain
  normalizers unless explicitly registered as non-owning adapters;
- add focused negative tests proving the guard fails on a competing status
  truth and passes on a canonical adapter.

Acceptance:

```text
STATUS_SSOT_GUARD_COVERS_TODAY=PASS
STATUS_SSOT_GUARD_COVERS_TASKS=PASS
STATUS_SSOT_GUARD_COVERS_CALENDAR=PASS
SEMANTIC_DRIFT_NEGATIVE_TEST=PASS
DUPLICATE_DOMAIN_STATUS_OWNER_GUARD=PASS
```

### Bounded mutable-path extension for this owner amendment

Only if directly required to resolve C1-SSOT-01 through C1-SSOT-07, the
controller may additionally modify:

```text
AGENTS.md
_project/PROJECT_MANIFEST.json
_project/00_AI_START_SPIS_TRESCI.md
_project/Naprawa_Zrodla_Prawdy/00_START_NAPRAWA_ZRODLA_PRAWDY.md
_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-006_CSS_OWNER_GUARDS_BEFORE_CLEANUP.md
_project/WORKFLOW_STATE.json
docs/stages/LF-V1-PR-001_SUPABASE_SCHEMA_MIGRATIONS_RLS_AND_SERVICE_ROLE_BOUNDARY.md
supabase/migrations/20260811180000_c1_revoke_public_anon_grants.sql
audit/evidence/LF-V1-PR-001_*
src/lib/domain-statuses.ts
src/lib/config/calendar-status.ts
src/lib/source-of-truth/status-repository.ts
src/lib/source-of-truth/schedule-options.ts
src/lib/source-of-truth/today-work-item-status.ts
src/lib/source-of-truth/task-display-status.ts
src/pages/TodayStable.tsx
src/pages/TasksStable.tsx
src/pages/Calendar.tsx
scripts/check-config-status-source-of-truth.cjs
scripts/check-c1-*.cjs
tests/c1-*.test.cjs
tests/c1-*.test.ts
```

This is not blanket permission to edit every listed file. The controller must
narrow the actual write set after call-site mapping and keep unrelated visual,
product, SQL, integration and feature behavior untouched.

### Mandatory implementation order

```text
1. verify exact remote HEAD and worktree scope
2. load Guardian through project capability routing
3. reconcile canonical project routing evidence
4. reconcile C1 workflow/reopen chronology
5. reconcile migration/provider-mutation chronology
6. resolve SOT repair index/provenance
7. map task/event status ownership and active call sites
8. perform smallest coherent SSOT repair
9. add semantic SSOT guards/negative tests
10. run focused regressions + required C1 guards + TSC + lint + build
11. run Guardian review on final diff
12. git diff --check
13. selective commit/push and remote SHA verification
14. update control plane/evidence and canonical Obsidian memory if write access exists
15. C1 verdict
16. STOP before C2 implementation
```

### Mandatory pre-close checks added by owner

In addition to the original C1 checks, C1 cannot close until all of the
following are terminal:

```text
C1_SSOT_01_CANONICAL_PROJECT_ENTRY=PASS
C1_SSOT_02_WORKFLOW_STATE_SEMANTICS=PASS
C1_SSOT_03_PROVIDER_MUTATION_CHRONOLOGY=PASS
C1_SSOT_04_MIGRATION_EXECUTION_SEMANTICS=PASS
C1_SSOT_05_REPAIR_INDEX_PROVENANCE=PASS
C1_SSOT_06_TASK_EVENT_STATUS_SINGLE_OWNER=PASS
C1_SSOT_07_SEMANTIC_STATUS_GUARD=PASS
```

For an agent-remediable finding, `REGISTERED_FINDING` is not sufficient. It
must be repaired and retested inside C1. Only a proven external/provider or
owner-only boundary may remain blocked, with exact evidence.

### Git boundary for this amendment

The database/evidence work already committed before this amendment must not be
rewritten or amended. The remaining SSOT repair may use one dedicated logical
C1-SSOT implementation/evidence commit followed, if required by project
policy, by the existing separate control-plane closeout commit. Selective
staging only. No force push, amend, reset/clean/stash/rebase or unrelated
changes.

### Final stop condition

```text
C1_ACCEPTED_REQUIRES_ORIGINAL_C1_GATES_AND_ALL_C1_SSOT_GATES=TRUE
C2_IMPLEMENTATION_BEFORE_C1_FINAL_ACCEPTANCE=FORBIDDEN
NEXT_STAGE_MAY_BE_ROUTED_AFTER_C1=YES
NEXT_STAGE_IMPLEMENTATION_IN_THIS_MISSION=NO
```
