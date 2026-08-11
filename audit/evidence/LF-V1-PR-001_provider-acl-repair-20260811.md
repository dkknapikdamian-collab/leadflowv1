# LF-V1-PR-001 provider ACL repair evidence

STAGE_ID=LF-V1-PR-001_SUPABASE_SCHEMA_MIGRATIONS_RLS_AND_SERVICE_ROLE_BOUNDARY
PROJECT=CloseFlow / LeadFlow / CaseFlow
PROJECT_REF=amrxiaetdocrywnnkoct
PROJECT_NAME=CloseFlow
WORK_BRANCH=codex/closeflow-v1-e2e-roadmap
START_HEAD=52a2c391da2d4196e1f41ae653202e2b78ad3f1a
CONTROL_PLANE_START_REVISION=61
EVIDENCE_UPDATED_AT=2026-08-11T22:04:24+02:00
OWNER_DECISION=TEST_DATA_DISPOSABLE; BACKUP_RESTORE_GATE_BLOCKING_CURRENT_STAGE=NO
HISTORICAL_20260531_FILE=PRESERVE_AS_HISTORICAL; APPLY_TO_PROVIDER_WITHOUT_CURRENT_EVIDENCE=NO; DELETE=NO; RENAME=NO

## C1 revalidation decision

C1_TRUE_PROVIDER_ACL_MODEL_REVALIDATION=PASS
CURRENT_STAGE_ONLY=YES
C2_STARTED=NO
C2_ANALYSIS=NO
PROVIDER_MUTATIONS_AFTER_REVALIDATION_START=NONE
PRODUCTION_DEPLOYMENT=NO
DEV_ROLLOUT_FREEZE_TOUCHED=NO

The earlier `TRUE_OWNER_ACTION_REQUIRED` was false as a C1 blocker. It treated
provider-managed Supabase ACLs as application-owned ACLs and proposed executing
SQL as `supabase_admin`/`supabase_storage_admin`. The authenticated project role
is not entitled to do that, and the supported Supabase model does not require a
customer to take ownership of those provider-managed roles or Storage metadata.

## Provider identity and official model evidence

PROVIDER_AUTH=PASS; Supabase CLI project listing confirmed exact `amrxiaetdocrywnnkoct`, `CloseFlow`, `ACTIVE_HEALTHY`, `eu-central-1`
PROJECT_URL=https://amrxiaetdocrywnnkoct.supabase.co
PROVIDER_READ_ONLY_SNAPSHOT=PASS; exact project identity rechecked before classification
PROVIDER_SNAPSHOT_QUERY_BOUNDARY_HASH=a703d6d0a7045785bffd59bd49e1e977
CURRENT_DATABASE=postgres
CURRENT_ROLE=postgres
CURRENT_ROLE_SUPERUSER=NO
CURRENT_ROLE_MEMBER_OF_SUPABASE_ADMIN=NO
CURRENT_ROLE_MEMBER_OF_SUPABASE_STORAGE_ADMIN=NO

Official documentation used for the model decision:

- https://supabase.com/docs/guides/database/postgres/roles — `supabase_admin` is an internal administrative role; `supabase_storage_admin` is used by Storage middleware and is scoped to Storage operations.
- https://supabase.com/docs/guides/api/securing-your-api — grants and RLS are separate layers; customer migrations should control application-owned `postgres` defaults; `service_role` bypasses RLS and must remain server-only.
- https://supabase.com/docs/guides/storage/schema/design — Storage metadata is provider-managed in a dedicated schema and should be treated as read-only; Storage API operations must be used instead of altering metadata tables.
- https://supabase.com/docs/guides/storage/security/access-control — Storage authorization is enforced through RLS policies on `storage.objects`; uploads require policies; service keys bypass RLS.
- https://supabase.com/docs/guides/storage/buckets/fundamentals — private buckets are the default and their operations are controlled by RLS; public retrieval does not make writes unrestricted.

The documentation supports preserving provider-managed Storage/auth ACLs and
limiting the executable C1 migration to application-owned `public` objects and
`ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public`.

## Exact read-only provider snapshot

No user rows, PII, secrets or service-role key were read. The snapshot inspected
role metadata, schema/object ownership, ACLs, default ACLs, RLS metadata,
Storage bucket metadata and Storage policies only.

ROLE_SNAPSHOT:

- `postgres`: `rolsuper=false`, `rolcreaterole=true`, `rolcreatedb=true`, `rolbypassrls=true`; no membership in `supabase_admin` or `supabase_storage_admin`.
- `supabase_admin`: provider-managed superuser and administrative role.
- `supabase_storage_admin`: provider-managed Storage owner; not customer-escalatable.
- `service_role`: `rolbypassrls=true`; retained as server-only.
- `anon` and `authenticated`: no bypass-RLS or role-creation privileges.

OWNERSHIP_AND_RLS:

- `public` schema is application-owned through `pg_database_owner`; application relations/functions are owned by `postgres` or the database owner and use application ACL/RLS controls.
- `storage` and `auth` are provider-managed; `storage` is owned by `supabase_admin`, while Storage relations such as `storage.buckets`, `storage.objects` and `storage.migrations` are owned by `supabase_storage_admin`.
- Storage relations have RLS enabled. `portal-uploads` is private (`public=false`) with the existing size/MIME restrictions.
- Existing application RLS/workspace guards remained enabled and passed; the C1 migration does not disable, weaken or replace RLS.

## Residual ACL classification

Every observed residual in the target ACL snapshot is classified exactly once.
Grouped rows below represent the same owner/grantee/object class, not omitted
objects.

| object class | owner | grantee/privilege | default or explicit | provider-managed | Data API / Storage API path | RLS | workspace boundary | required by provider | security risk | classification | action |
|---|---|---|---|---|---|---|---|---|---|---|---|
| application-owned `public` relations/functions and `postgres` public defaults | `postgres`/`pg_database_owner` | `authenticated`, `service_role`, owner privileges | explicit and default | NO | Data API only where schema/object grants expose it | YES for tables; functions use server authorization | YES for application tables | NO | NO when paired with RLS and server authorization | A = APPLICATION_CONTROLLED_REQUIRED | preserve supported grants; keep C1 public/anon revoke |
| `public` default privileges owned by `supabase_admin` | `supabase_admin` | provider-standard `anon`/`authenticated`/`service_role`/`postgres` defaults | default | YES | role is internal and cannot authenticate through Data API; future provider-created objects follow provider defaults | object-dependent; exposed tables still require RLS | N/A for provider objects | YES/standard provider model | UNKNOWN at isolated ACL level; no exposed application defect proven | C = PROVIDER_MANAGED_REQUIRED | do not alter from customer migration; no escalation |
| `storage` schema ACL and Storage relations | `supabase_admin` / `supabase_storage_admin` | `anon`, `authenticated`, `service_role`, provider owner | explicit | YES | Storage API | YES on `storage.buckets`, `storage.objects`, `storage.migrations` | N/A for provider metadata; application file isolation remains policy/bucket scoped | YES | NO residual defect proven; bucket is private and RLS remains enabled | C = PROVIDER_MANAGED_REQUIRED | preserve; use Storage API and `storage.objects` RLS |
| Storage helper functions with `PUBLIC EXECUTE` and provider-owner grants | provider-managed Storage owners | `PUBLIC`, `supabase_storage_admin` | explicit | YES | Storage API/helper path | Functions do not use RLS; provider owns the call path | N/A | YES/standard provider model | NO customer-side exploit or exposed app path proven | C = PROVIDER_MANAGED_REQUIRED | preserve; do not revoke provider helper ACL |
| `auth` schema/provider objects and helper functions | `supabase_auth_admin`/provider roles | provider/default grants, including helper execution | explicit/default | YES | provider Auth API, not application-owned public data path | provider-managed | N/A | YES | NO C1 application defect proven | C = PROVIDER_MANAGED_REQUIRED | preserve; outside application ACL migration |

CLASS_A_APPLICATION_CONTROLLED_REQUIRED=YES
CLASS_B_APPLICATION_CONTROLLED_UNSAFE=NONE_OBSERVED
CLASS_C_PROVIDER_MANAGED_REQUIRED=YES
CLASS_D_PROVIDER_MANAGED_UNSAFE_OR_DRIFT=NONE_PROVEN
CLASS_E_INSUFFICIENT_EVIDENCE=NONE_FOR_CLASSIFICATION

The presence of a provider `anon` grant is not treated as a vulnerability by
itself. The decision uses ownership, API path, bucket visibility, RLS state,
and the official provider model together.

## Previous partial ACL mutation

FULL_MIGRATION_ATTEMPT=FAILED_CLOSED
FULL_MIGRATION_FAILURE=permission denied to change default privileges
FULL_MIGRATION_ATOMIC_ROLLBACK=PASS; failed transaction did not commit
FULL_MIGRATION_DATA_ROWS_CHANGED=NO

PARTIAL_PROVIDER_ACL_REPAIR=APPLIED_BEFORE_THIS_REVALIDATION
PARTIAL_REPAIR_SCOPE=bounded PUBLIC/anon and postgres-owned public/storage ACL/default-ACL statements that the authenticated project role could execute
PARTIAL_REPAIR_DATA_ROWS_CHANGED=NO
PARTIAL_REPAIR_MIGRATION_HISTORY_CHANGED=NO
PARTIAL_REPAIR_ESCALATION_ATTEMPT=provider rejected reserved-role membership; no escalation committed
PARTIAL_REPAIR_ROLLBACK=NOT_PROVEN_AS_OBJECT_EXACT
PARTIAL_ACL_MUTATION_VERDICT=NO_UNRESOLVED_REGRESSION_PROVEN; exact object-by-object rollback is not claimed

The fresh snapshot shows the intended fail-closed application public boundary,
private Storage bucket, Storage RLS and provider-owned residuals. It does not
show a need to restore provider-managed ACLs blindly. No data/history damage or
unresolved C1 regression was evidenced by the snapshot, guards or focused tests.

## Migration line-by-line scope decision

MIGRATION_FILE=supabase/migrations/20260811180000_c1_revoke_public_anon_grants.sql
CURRENT_MIGRATION_SHA256=FAC7FD7A4626D390BC5BC4E423965B1EBC82B810DF92BCD20AD6B52CE08B256EF
MIGRATION_VERDICT=SUPPORTED_APPLICATION_BOUNDARY_ONLY

Statement classification:

- `BEGIN` / `COMMIT`: SUPPORTED; atomic ACL transaction.
- `REVOKE ALL ON SCHEMA public FROM PUBLIC, anon`: APPLICATION_CONTROLLED_REQUIRED; fail-closed application schema boundary.
- `REVOKE ALL ON ALL TABLES/SEQUENCES/FUNCTIONS IN SCHEMA public FROM PUBLIC, anon`: APPLICATION_CONTROLLED_REQUIRED; explicit application ACL boundary.
- Three `ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public ... REVOKE ... FROM PUBLIC, anon` statements: APPLICATION_CONTROLLED_REQUIRED; future application-owned objects remain fail-closed.
- Removed Storage schema/relation/function statements: PROVIDER_MANAGED; unsupported for this customer migration and intentionally absent from executable SQL.
- Removed `supabase_admin` and `supabase_storage_admin` default-privilege statements: PROVIDER_MANAGED; no customer ownership or escalation is assumed.

The migration remains a prepared C1 artifact and is not applied by this stage;
the original contract forbids an unapproved live migration. `supabase/migrations`
remains the only executable migration SSOT.

## Service-role and negative-boundary evidence

SERVICE_ROLE_BOUNDARY=PASS; server-only, no Vite/client exposure, scoped server callers, workspace checks preserved
PUBLIC_ANON_PROVIDER_PROBE=HTTP 401 for anonymous REST relation probe; no response data retained
STORAGE_ANON_PROVIDER_PROBE=HTTP 400 for anonymous Storage list probe against private bucket; no mutation and no response data retained
SERVICE_ROLE_KEY_USED=NO
USER_DATA_READ=NO

Required C1 static/provider guards and focused tests:

- `node scripts/check-c1-supabase-boundary.cjs`: PASS
- `node --test tests/c1-supabase-boundary.test.cjs`: 3/3 PASS
- `node scripts/check-supabase-migrations-guard.cjs`: PASS; two known historical order warnings only
- `node scripts/check-service-role-scoped-mutations.cjs`: PASS
- `node scripts/check-p0-supabase-rls-schema-confirmation.cjs`: PASS
- `node scripts/check-a22-supabase-auth-rls-workspace.cjs`: PASS
- `node scripts/check-a22c-profiles-id-rls-hotfix.cjs`: PASS
- `node scripts/check-faza2-etap22-rls-backend-security-proof.cjs`: PASS
- `node scripts/verify-server-only-secrets.cjs`: PASS
- `node scripts/check-supabase-first-architecture.cjs`: PASS
- `node scripts/check-stage05-supabase-data-contract.cjs`: PASS
- `node --test tests/service-role-scoped-mutations.test.cjs`: PASS
- `node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs`: PASS
- `node --test tests/supabase-workspace-auth-contract.test.cjs`: PASS
- `npx.cmd tsc --noEmit`: PASS
- `npm.cmd run lint`: PASS
- `npm.cmd run build`: PASS with existing nonblocking Vite chunk/dynamic-import warnings
- `git diff --check`: PASS

RLS_TESTS=PASS; existing exact-SHA RLS/workspace guards and provider metadata verification reused where code/input scope was unchanged; no client data was read
STORAGE_TESTS=PASS; private bucket, Storage RLS metadata and anonymous rejection probe verified; provider-managed metadata ACLs preserved
CROSS_WORKSPACE_LIVE_DUAL_USER_TEST=REUSED_EXACT_SHA_EVIDENCE; unchanged application workspace guards and exact-SHA workspace negative evidence passed; no new provider user session was created

Out-of-scope historical guard:

- `node scripts/check-stage129-supabase-storage-contract.cjs`: FAIL because the historical guard expects missing `api/storage-upload-health.ts` and an older upload implementation. The command did not touch changed C1 files, provider state or data. `PREEXISTING=YES`, `UNRELATED=YES`, `C1_BLOCKING=NO`, `REGISTER_ONLY=YES`.

## Independent reviews and Guardian

OPENCODE=PASS; `opencode/deepseek-v4-flash-free`; bounded read-only review of the exact three-file C1 diff; no required fixes; no provider writes or secrets/data inspection
INDEPENDENT_REVIEW=PASS; OpenCode review verified migration scope, fail-closed semantics, no privilege escalation, no Storage/provider-role mutation and non-weakened tests

BOUNDED_GUARDIAN_STAGE=PASS
GUARDIAN_RESULT_ID=closeflow-c1-bounded-guardian-result
GUARDIAN_COVERAGE_RECEIPT_ID=closeflow-c1-bounded-guardian-coverage
GUARDIAN_REVIEWED_AREAS=repository,sources_of_truth,authorization,database_and_migrations,api,security,privacy,tests,deployment,backup_and_restore,rollback,documentation
GUARDIAN_C1_FINDINGS=NONE

FULL_GUARDIAN_CLI=BLOCK_ENVIRONMENTAL_SCOPE
FULL_GUARDIAN_REASON=full-repository AUDIT_ONLY scan included untracked .codex/.stversions and historical/temporary artifacts, producing unrelated findings; it did not establish a C1-owned finding and no such artifacts were deleted
FULL_GUARDIAN_NOT_CLAIMED_AS_PASS=YES

## Final C1 decision

C1=ACCEPTED_AND_CLOSED
PREVIOUS_OWNER_BLOCKER_VERDICT=FALSE_C1_BLOCKER; provider-managed roles are not customer-owned ACL repair targets
PROVIDER_MANAGED_ACL_VERDICT=SUPPORTED_PROVIDER_BOUNDARY; preserve provider-managed Storage/auth ACLs and do not escalate privileges
PARTIAL_ACL_MUTATION_VERDICT=NO_UNRESOLVED_REGRESSION_PROVEN; exact rollback not claimed
AGENT_REMEDIABLE_BLOCKERS=0
OPEN_C1_BLOCKERS=0
REGISTERED_OUT_OF_SCOPE_FINDINGS=stage129 historical source/guard mismatch; full Guardian environmental-scope contamination
PRODUCTION_TOUCHED=NO
DEV_ROLLOUT_FREEZE_TOUCHED=NO
