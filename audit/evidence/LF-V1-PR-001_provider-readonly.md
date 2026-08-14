# LF-V1-PR-001 provider read-only evidence

STAGE_ID=LF-V1-PR-001_SUPABASE_SCHEMA_MIGRATIONS_RLS_AND_SERVICE_ROLE_BOUNDARY
PROJECT_REF=amrxiaetdocrywnnkoct
PROJECT_NAME=CloseFlow
PROVIDER_AUTH=PASS; `npx.cmd --yes supabase@latest projects list --output json` returned exact ref and `ACTIVE_HEALTHY`
PROBE_MODE=Supabase Management API read-only SQL; no link, password, migration, backup creation or provider write
CAPTURED_AT=2026-08-11T17:51:34Z
C1_DIGEST_SHA256=d5a81a9669852742188f4a47091e6d8734e47c4ef03c3245bc3f095f79b8c66a
C1_DIGEST_JSON_UTF8_BYTES=167983

## Exact read-only probe scope

The digest covers deterministic, ordered JSON from:

- `information_schema.tables` and `information_schema.columns` for `public` and `storage`;
- foreign keys from `pg_constraint`, indexes from `pg_indexes`, triggers from `information_schema.triggers`;
- public/storage function identity and security metadata from `pg_proc`;
- RLS enabled/forced state from `pg_class` and all policies from `pg_policies`;
- storage buckets and allowlisted MIME/size metadata;
- applied migration versions/names from `supabase_migrations.schema_migrations`.

## Provider result

SCHEMA_PUBLIC_TABLES=24
SCHEMA_STORAGE_TABLES=8
SCHEMA_COLUMNS=496
SCHEMA_FOREIGN_KEYS=11
SCHEMA_INDEXES=187
SCHEMA_TRIGGERS=0
SCHEMA_PUBLIC_FUNCTIONS=27
PUBLIC_POLICIES=62
STORAGE_POLICIES=0
PUBLIC_RLS_ENABLED=24/24
PUBLIC_RLS_FORCED=15/24
STORAGE_OBJECTS_RLS_ENABLED=YES
PRIVATE_STORAGE_BUCKETS=1; `portal-uploads`; `public=false`; 10 MiB; expected MIME allowlist

## Security finding and local repair

ANON_SELECT_GRANTS=20/24
ANON_INSERT_GRANTS=20/24
ANON_UPDATE_GRANTS=20/24
ANON_DELETE_GRANTS=20/24
AUTHENTICATED_INSERT_GRANTS=24/24
SUPABASE_ADMIN_PUBLIC_DEFAULT_ACL=present for tables, sequences and functions; anon remained in each ACL before the pending local repair
SUPABASE_ADMIN_STORAGE_DEFAULT_ACL=not listed by the read-only probe; local repair is fail-closed for future storage objects as well
STORAGE_RELATION_OWNER=supabase_storage_admin; 8 storage relations; local repair covers its future table, sequence and function defaults

RLS currently prevents effective anonymous rows because workspace policies require authenticated context, but the explicit `anon` ACL is broader than the C1 contract and creates avoidable bypass risk if policy coverage drifts. A second read-only default-ACL probe also found broad `anon` defaults for `supabase_admin` in `public`; the local repair therefore covers both `postgres` and `supabase_admin` owners. The local repair is:

`supabase/migrations/20260811180000_c1_revoke_public_anon_grants.sql`

It revokes `PUBLIC`/`anon` schema, table, sequence and function privileges for `public` and `storage`, and revokes corresponding `postgres`, `supabase_admin` and `supabase_storage_admin` default privileges. It has not been applied.

## Migration history reconciliation

PROVIDER_APPLIED_MIGRATIONS=42
LOCAL_PHYSICAL_SQL_FILES=54
LOCAL_STRICT_14_DIGIT_FILES=51
LOCAL_LEGACY_FORMAT_FILES=3
PROVIDER_APPLIED_NOT_LOCAL=0
LOCAL_STRICT_NOT_PROVIDER=9; the two 20260613 entries, six 20260810 B1-B6 entries and the new C1 repair remain unapplied.

Legacy-format outcomes:

- `2026-05-01_stageA22_supabase_auth_rls_workspace_foundation.sql`: no provider history row; strict `20260501012200_stageA22_supabase_auth_rls_workspace_foundation.sql` is applied.
- `20260502_portal_uploads_storage_bucket.sql`: no provider history row; strict `20260502100000_portal_uploads_storage_bucket.sql` is applied.
- `20260531_stage213a_public_data_api_explicit_grants.sql`: no provider history row and no strict counterpart; remains a pending legacy-format candidate and is not applied or renamed automatically.

## Backup gate

The read-only backup endpoint returned `pitr_enabled=false`, `walg_enabled=true`, `backups=[]`, and empty `physical_backup_data`. This is not verified restore/rollback evidence. Therefore `BACKUP_BEFORE_CHANGE=OWNER_BOUNDARY_REQUIRED` remains active before any live migration or ACL repair.

PRODUCTION_TOUCHED=NO
PROVIDER_MUTATION=NO
SECRETS_READ=NO
