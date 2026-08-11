# LF-V1-PR-001 provider ACL repair evidence

STAGE_ID=LF-V1-PR-001_SUPABASE_SCHEMA_MIGRATIONS_RLS_AND_SERVICE_ROLE_BOUNDARY
PROJECT_REF=amrxiaetdocrywnnkoct
PROJECT_NAME=CloseFlow
CAPTURED_AT=2026-08-11T19:19:22Z
OWNER_DECISION=TEST_DATA_DISPOSABLE; BACKUP_RESTORE_GATE_BLOCKING_CURRENT_STAGE=NO
HISTORICAL_20260531_FILE=PRESERVE_AS_HISTORICAL; NOT_APPLIED; NOT_DELETED; NOT_RENAMED

## Provider identity and preflight

PROVIDER_AUTH=PASS; exact project `amrxiaetdocrywnnkoct`, `CloseFlow`, `ACTIVE_HEALTHY`, `eu-central-1`
PROVIDER_TRANSPORT=Supabase CLI `db query --linked` through the supported IPv4 pooler path
CURRENT_DATABASE=postgres
CURRENT_ROLE=postgres
SCHEMA_TABLE_COUNT=32
RELATION_COUNT=33

Before mutation the provider ACL snapshot showed explicit `anon`/`PUBLIC` grants
in `public` and `storage`, plus default grants. The exact prepared migration
hash was:

FULL_PREPARED_MIGRATION=supabase/migrations/20260811180000_c1_revoke_public_anon_grants.sql
FULL_PREPARED_MIGRATION_SHA256=2b9a0755258d72b04543432c820bcf287cf69006e78da1147e72fcc403b10043

## Full migration attempt and rollback

FULL_MIGRATION_ATTEMPT=FAILED_CLOSED
FAILURE=permission denied to change default privileges
ATOMIC_ROLLBACK=PASS; the transaction did not commit
ROLLBACK_PROOF_AFTER_FAILED_ATTEMPT=target_default_acl_rows=36; target_relation_acl_rows=191
PROVIDER_DATA_ROWS_CHANGED_BY_FAILED_ATTEMPT=NO

The full file was not replayed through `db push`; no unrelated pending
migrations were applied and no row-data operation was executed.

## Bounded provider repair that did apply

APPLIED_SCOPE=existing public/storage schema, table, sequence and function ACLs plus default privileges owned by postgres
APPLIED_TRANSACTION=BEGIN/COMMIT
APPLIED_OPERATION=REVOKE PUBLIC/anon privileges; no table data changed
PROVIDER_MUTATION=YES; bounded ACL-only change authorized by the owner decision
PRODUCTION_DEPLOYMENT=NO; no Vercel, application branch or runtime deployment was touched
PUBLIC_EXPLICIT_TARGET_ACL_AFTER=0 observed schema/relation/function rows for PUBLIC/anon in public
POSTGRES_DEFAULT_ACL_AFTER=removed for the executed public/storage postgres-owned defaults
PARTIAL_REPAIR_ROLLBACK=NOT_PROVEN_AS_OBJECT_EXACT; no false rollback claim is made, and this prevents C1 acceptance

## Residual provider boundary

CURRENT_ROLE_SUPERUSER=NO
CURRENT_ROLE_MEMBER_OF_SUPABASE_ADMIN=NO
CURRENT_ROLE_MEMBER_OF_SUPABASE_STORAGE_ADMIN=NO
SUPABASE_ADMIN_SUPERUSER=YES
STORAGE_OBJECT_OWNER=supabase_storage_admin

The remaining ACLs are not removable by the authenticated project role:

- `supabase_admin` retains 12 public default-ACL privilege entries for `anon`:
  8 table, 3 sequence and 1 function privilege groups;
- storage retains explicit `anon` privileges on 3 relations across the listed
  relation privilege types, `anon` schema usage, and `PUBLIC EXECUTE` on 17
  storage functions;
- `GRANT supabase_storage_admin TO postgres` was rejected by the provider as a
  reserved role membership; no privilege escalation was committed.

The residual is a true provider privilege boundary, not a missing local fix.
The full prepared migration cannot be marked applied while these rows remain.
The bounded `db query` operation also does not create a
`supabase_migrations.schema_migrations` history row; no history row was forged.

## Validation

LOCAL_C1_BOUNDARY_GUARD=PASS
LOCAL_C1_TESTS=2/2 PASS
MIGRATION_GUARD=PASS_WITH_TWO_LEGACY_ORDER_WARNINGS
SERVICE_ROLE_GUARD=PASS
P0_RLS_GUARD=PASS
A22_GUARD=PASS
A22C_GUARD=PASS
FAZA2_RLS_GUARD=97/97 PASS
SERVER_ONLY_SECRET_GUARD=PASS
SUPABASE_FIRST_GUARD=PASS
TSC=PASS
LINT=PASS
BUILD=PASS_WITH_EXISTING_NONBLOCKING_CHUNK_WARNINGS

## Decision

C1=NOT_ACCEPTED
REASON=provider-managed default ACL and storage-object ACL residual remains; the current project role cannot execute the remaining exact statements
AGENT_REMEDIABLE_BLOCKERS=0
PRODUCTION_TOUCHED=NO
DEV_ROLLOUT_FREEZE_TOUCHED=NO
NEXT_ROUTING=DO_NOT_ROUTE_C2
MINIMAL_PROVIDER_ACTION=execute the remaining exact ACL statements as the owning provider roles (`supabase_admin` and `supabase_storage_admin`) through a provider-supported privileged channel, then rerun the C1 read-only ACL/RLS verification
