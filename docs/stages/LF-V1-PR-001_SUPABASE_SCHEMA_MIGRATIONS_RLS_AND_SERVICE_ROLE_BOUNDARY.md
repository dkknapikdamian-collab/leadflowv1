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
