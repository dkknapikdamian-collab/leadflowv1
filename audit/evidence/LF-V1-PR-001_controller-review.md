# LF-V1-PR-001 controller review

STAGE_ID=LF-V1-PR-001_SUPABASE_SCHEMA_MIGRATIONS_RLS_AND_SERVICE_ROLE_BOUNDARY
START_SHA=baae74b2b3304bbbf5caedd56dda2f2db1eda03b
REVIEW_BASE_CONTRACT_SHA=baae74b2b3304bbbf5caedd56dda2f2db1eda03b

## Root-cause classifications

### Migration secret false positive

EXACT_FILE=scripts/check-supabase-migrations-guard.cjs
EXACT_SYMBOL_OR_TEST=likelySecretPatterns inside the migration inventory loop
EXACT_REGION=lines 24-58 before repair
ROOT_CAUSE=The guard searched SQL comments as if they were executable SQL and classified documentation mentioning SUPABASE_SERVICE_ROLE_KEY as a leaked secret.
DEPLOY01_RELEVANT=NO
REAL_DEFECT=YES
FALSE_POSITIVE=NO
REPAIR_REQUIRED=YES
REPAIR=Strip SQL block/line comments for the secret-pattern scan while retaining destructive-drop checks on the full source.
RESULT=node scripts/check-supabase-migrations-guard.cjs PASS with two legacy-format order warnings

### Supabase/RLS guard migration-source drift

EXACT_FILE=scripts/check-a22-supabase-auth-rls-workspace.cjs; scripts/check-a22c-profiles-id-rls-hotfix.cjs; scripts/check-faza2-etap22-rls-backend-security-proof.cjs; scripts/check-stage05-supabase-data-contract.cjs; tests/faza2-etap22-rls-backend-security-proof.test.cjs
EXACT_SYMBOL_OR_TEST=migration path constants
EXACT_REGION=old `2026-05-01_*` paths before repair
ROOT_CAUSE=Security guards and tests pointed at legacy-format copies while the current strict timestamp migrations contained the maintained schema/RLS implementation.
DEPLOY01_RELEVANT=NO
REAL_DEFECT=YES
FALSE_POSITIVE=NO
REPAIR_REQUIRED=YES
REPAIR=Bind guards/tests to the exact canonical strict migrations; do not create a compatibility migration source.
RESULT=A22, A22c, cumulative Faza2 RLS guard and its two tests PASS

### Stale access/service route guards

EXACT_FILE=scripts/check-p0-supabase-rls-schema-confirmation.cjs; scripts/check-service-role-scoped-mutations.cjs
EXACT_SYMBOL_OR_TEST=access-gate owner assertions and endpoint inventory
EXACT_REGION=accessGate checks and endpointFiles before repair
ROOT_CAUSE=The guards assumed plan-model exports lived in `_access-gate` and that `/api/activities` remained a physical endpoint, although the canonical owners are `src/lib/plans.ts` and the consolidated handlers.
DEPLOY01_RELEVANT=NO
REAL_DEFECT=YES
FALSE_POSITIVE=NO
REPAIR_REQUIRED=YES
REPAIR=Assert `buildPlanAccessModel` at its canonical owner, recognize `src/server/activities-handler.ts` and `src/server/records.ts`, and remove the nonexistent endpoint from the guard inventory.
RESULT=P0 RLS guard and service-role scoped mutation guard PASS

### Unscoped consolidated activity mutation

EXACT_FILE=src/server/records.ts
EXACT_SYMBOL_OR_TEST=activities PATCH and DELETE branches in the records handler
EXACT_REGION=old lines 110 and 120
ROOT_CAUSE=The handler performed a scoped pre-read but then used service-role `updateById`/`deleteById`, leaving a time-of-check/time-of-use path without a workspace predicate.
DEPLOY01_RELEVANT=NO
REAL_DEFECT=YES
FALSE_POSITIVE=NO
REPAIR_REQUIRED=YES
REPAIR=Use `updateByIdScoped` and `deleteByIdScoped` with the resolved workspace ID.
RESULT=C1 guard and focused C1 test PASS

### Supabase-first guard false positives

EXACT_FILE=scripts/check-supabase-first-architecture.cjs
EXACT_SYMBOL_OR_TEST=forbiddenRuntimePatterns
EXACT_REGION=call-expression regexes for onSnapshot and related APIs
ROOT_CAUSE=Unbounded identifier matching treated `readButtonSnapshots()` and `readGoogleCalendarMutationSnapshot()` as Firestore `onSnapshot()` calls.
DEPLOY01_RELEVANT=NO
REAL_DEFECT=YES
FALSE_POSITIVE=NO
REPAIR_REQUIRED=YES
REPAIR=Use word-boundary call patterns so only actual Firestore API calls match.
RESULT=Supabase-first architecture guard PASS

### Secret guard physical-tree traversal and evidence-boundary failure

EXACT_FILE=scripts/verify-server-only-secrets.cjs
EXACT_SYMBOL_OR_TEST=scanForbiddenNames and trackedTextFiles
EXACT_REGION=walk(repoRoot) traversal before repair; tracked input boundary after repair
ROOT_CAUSE=The previous guard recursively traversed the entire physical worktree and could crash on local historical trees; after bounding traversal, committed evidence containing a guard-only VITE name was incorrectly treated as runtime source.
DEPLOY01_RELEVANT=NO
REAL_DEFECT=YES
FALSE_POSITIVE=NO
REPAIR_REQUIRED=YES
REPAIR=Scan Git-tracked release inputs, exclude only audit/evidence as non-runtime evidence, and retain a separate dist/build actual-value scan. Git boundary failure is fail-closed.
RESULT=node scripts/verify-server-only-secrets.cjs PASS in approximately 2.5 seconds; no residual process

## C1 evidence and tests

C1_LEDGER=PASS_WITH_REGISTERED_PROVIDER_BOUNDARY; 54 physical SQL files, 51 strict 14-digit files, 3 legacy-format candidates, exact hashes in LF-V1-PR-001_migration-ledger.md
C1_STATIC_BOUNDARY=PASS
C1_SECRET_BOUNDARY=PASS
C1_FOCUSED_TESTS=2/2 PASS
A22_GUARD=PASS
A22C_GUARD=PASS
P0_RLS_GUARD=PASS
SERVICE_ROLE_GUARD=PASS
SUPABASE_FIRST_GUARD=PASS
FAZA2_RLS_PROOF=97/97 PASS
REPO_BACKUP_HYGIENE=2/2 PASS
TSC=PASS
LINT=PASS
BUILD=PASS; pre-existing non-blocking warnings for Supabase fallback chunk overlap, large chunks and retained Firebase vendor chunk

## Findings not silently accepted

STAGE05_LEGACY_GUARD=FAIL outside the C1 mutation scope because its historical guard additionally asserts a calendar-items contract; this is registered as unrelated guard drift and is not reported as a C1 PASS.
FAZA2_ETAP21_LEGACY_GUARD=FAIL outside the C1 mutation scope because its audit guard still reports the pre-existing `body.workspaceId` marker in request-scope source; the direct Etap21 runtime test passes and no C1 file changed this surface.
LEGACY_FORMAT_MIGRATION_RECONCILIATION=OWNER_BOUNDARY_REQUIRED; two duplicate historical-format files are preserved because deleting/renaming a migration without provider migration history can break replay safety.
LIVE_SCHEMA_DUMP=PASS_READ_ONLY_MANAGEMENT_API; exact digest in LF-V1-PR-001_provider-readonly.md
BACKUP_BEFORE_CHANGE=OWNER_BOUNDARY_REQUIRED
PRODUCTION_TOUCHED=NO
PROVIDER_MUTATION=NO
SECRET_CHANGED=NO

## Independent review

IMPLEMENTER=CONTROLLER_FALLBACK; GPT implementer delegation failed with agent thread limit before work began
GPT_INDEPENDENT_REVIEWER=UNAVAILABLE_THREAD_LIMIT
OPENCODE=INITIAL_NO_TOOL_REVIEW_REFUSED; SECOND_READ_ONLY_REVIEW=NO_DEFECT_FOUND_WITH_LOW_GUARD_SCOPE_NOTES; FINAL_ATTACHED_FILE_REVIEW=PASS_AFTER_POSTGRES_SUPABASE_ADMIN_AND_SUPABASE_STORAGE_ADMIN_REPAIR
FREEBUFF=NOT_DELEGATED; canonical WinPTY adapter was unavailable in this process; no residual process
CONTROLLER_REVIEW=COMPLETED; source-backed exact diff, PostgreSQL privilege semantics, guard results and provider evidence reviewed

## Provider revalidation and C1 repair

PROVIDER_AUTH=PASS; exact project ref `amrxiaetdocrywnnkoct`, `CloseFlow`, `ACTIVE_HEALTHY`
LIVE_SCHEMA_DUMP=PASS_READ_ONLY_MANAGEMENT_API; exact digest and query scope in `LF-V1-PR-001_provider-readonly.md`
ROOT_CAUSE_PROVIDER_ACL_DRIFT=explicit `anon` arwdDxtm ACL remained on 20 of 24 public tables, `supabase_admin` default ACLs granted broad anon rights, and storage relations are owned by `supabase_storage_admin`; RLS was enabled but defense-in-depth contract was not met
REPAIR=add `20260811180000_c1_revoke_public_anon_grants.sql` for postgres, supabase_admin and supabase_storage_admin owners, then bind C1 guard to it
BACKUP_BEFORE_CHANGE=OWNER_BOUNDARY_REQUIRED; PITR disabled and no listed backups
LIVE_MIGRATION=FORBIDDEN_AND_NOT_PERFORMED

## Controller decision

C1_LOCAL_IMPLEMENTATION=PASS_WITH_REGISTERED_OWNER_BOUNDARY
AGENT_REMEDIABLE_CODE_BLOCKERS_REMAIN=0
NEXT_REQUIRED_BOUNDARY=owner-controlled backup/restore evidence remains required before any live migration or ACL repair; no live change was authorized or performed
