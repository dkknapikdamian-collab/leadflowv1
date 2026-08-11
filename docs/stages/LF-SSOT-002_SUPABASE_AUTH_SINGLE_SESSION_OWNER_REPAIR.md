---
typ: implementation_stage
doc_role: active_stage_contract
status: active
canonical: true
project_id: closeflow_lead_app
stage_id: LF-SSOT-002_SUPABASE_AUTH_SINGLE_SESSION_OWNER_REPAIR
parent_program: ONE_SOURCE_OF_TRUTH
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: b2e18253d61c4ce5760df18feed1a35567cf69e4
target_branch: codex/closeflow-v1-e2e-roadmap
---

# Goal

Make Supabase Auth the only active browser/server session and identity owner
for the production application paths. Preserve Firebase files only as clearly
legacy compatibility artifacts that are not reachable as an active authority.

This stage is the SSOT-program routing of the existing STAGE231B backlog item
(`STAGE231B_SUPABASE_ONLY_SETTINGS_SECURITY`); it does not activate unrelated
product work or C2.

## Root cause

`src/App.tsx` already bootstraps the active application from
`useSupabaseSession` and server routes verify Supabase bearer tokens, but active
production pages still import `src/firebase.ts`. `Settings` uses Firebase Auth
for password/email operations, while `Dashboard`, `Tasks`, `Calendar` and
`SupportCenter` read `auth.currentUser`. Google Calendar mutation helpers also
fall back to client-supplied legacy identity headers when a verified request
identity is unavailable. This leaves a second reachable session/identity
authority beside Supabase Auth.

The Stage 01 auth guard also names a non-existent hyphenated migration file
although the canonical executable ledger contains the timestamped
`supabase/migrations/20260501010100_stage01_supabase_auth_identity.sql`.
That guard drift must be repaired without creating a duplicate migration.

```text
ROOT_CAUSE=active Firebase Auth reads and security mutations remain reachable beside Supabase Auth; Google sync has legacy header identity fallback; Stage 01 guard points at a non-canonical migration filename
WHY_NOT_PATCH=remove the active competing authority at its call sites and make verification bind to the existing canonical Supabase implementation
CANONICAL_OWNER=src/lib/supabase-auth.ts + src/hooks/useSupabaseSession.ts + verified server Supabase request context
COMPETING_OWNER=Firebase Auth SDK in active pages and unverified x-user/x-auth/x-firebase identity fallback
ACTIVE_RUNTIME_PATH=App -> useSupabaseSession; protected pages; Settings security actions; api/work-items and api/leads Google sync; src/server/google-calendar-handler
SSOT_IMPACT=AUTH_SESSION_AUTHORITY=1; client auth snapshot is a cache/adapter only and must never authenticate a request
SECURITY_IMPACT=eliminate legacy identity substitution and prevent a valid Supabase session from selecting another user's Google connection through spoofable legacy headers
```

## Evidence

- `src/App.tsx` uses `useSupabaseSession` and does not import Firebase.
- `src/lib/supabase-auth.ts` owns Supabase session, access token, sign-in and sign-out operations.
- Active imports of `src/firebase.ts` remain in `Settings`, `Dashboard`, `Tasks`,
  `Calendar` and `SupportCenter`.
- `src/server/google-calendar-handler.ts`, `api/work-items.ts` and `api/leads.ts`
  contain legacy header identity fallbacks reachable from protected routes.
- `scripts/check-stage01-supabase-auth.cjs` fails before its assertions because
  it requires the missing non-canonical path
  `supabase/migrations/2026-05-01_stage01_supabase_auth_identity.sql`; the
  timestamped migration exists and is already part of the executable ledger.
- `scripts/check-stage03-firebase-legacy-lockdown.cjs`, the Firestore migration
  guard and the Supabase-first guard pass; their PASS does not prove that
  Firebase Auth security calls are unreachable, which is the defect bounded here.

## Allowed mutable paths

- `src/lib/supabase-auth.ts`
- `src/lib/supabase-fallback.ts`
- `src/pages/Settings.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/Tasks.tsx`
- `src/pages/Calendar.tsx`
- `src/pages/SupportCenter.tsx`
- `api/work-items.ts`
- `api/leads.ts`
- `src/server/google-calendar-handler.ts`
- `scripts/check-stage01-supabase-auth.cjs`
- one new bounded auth-SSOT guard and its focused tests
- this contract and the existing C1 evidence/control-plane entry

## Forbidden scope

- no Firebase data migration or provider mutation;
- do not delete legacy Firebase config, rules or compatibility files;
- do not change `dev-rollout-freeze`;
- do not create or rename migrations;
- do not change workspace, billing, Storage or product feature behavior beyond
  the identity/session boundary needed by this stage;
- do not trust client auth snapshots or custom identity headers as authority;
- no C2 implementation and no unrelated refactor.

## Required invariants

```text
SUPABASE_AUTH_SESSION_OWNER=1
ACTIVE_FIREBASE_AUTH_IMPORTS_OUTSIDE_LEGACY_ALLOWLIST=0
ACTIVE_FIREBASE_AUTH_SECURITY_MUTATIONS=0
SERVER_AUTH_SOURCE=VERIFIED_SUPABASE_BEARER_CONTEXT
LEGACY_IDENTITY_HEADER_FALLBACKS_IN_AUTHORITY_PATHS=0
CLIENT_AUTH_SNAPSHOT=NON_AUTHENTICATING_CACHE_ONLY
CANONICAL_STAGE01_MIGRATION=20260501010100_stage01_supabase_auth_identity.sql
EXECUTABLE_MIGRATION_LEDGER_UNCHANGED=YES
```

## Required tests

- focused source guard and negative duplicate-authority fixture;
- Supabase Auth helper/runtime matrix for password/email/session operations;
- Stage 01 auth guard with the canonical timestamped migration path;
- direct regressions: Supabase-first, Firebase legacy lockdown, A23 migration,
  server-only secrets, workspace/RLS boundary and access/billing truth;
- TSC, lint, build and `git diff --check`.

## Guardian and review

AI Code Guardian stage review is required. A read-only independent review is
required when available; timeout must be recorded and cannot be treated as a
PASS. The controller must inspect the exact diff and confirm that Firebase
legacy artifacts remain non-authoritative.

## Pass conditions

```text
AUTH_SESSION_AUTHORITY=PASS
ACTIVE_FIREBASE_AUTH_CALLS=0
LEGACY_HEADER_AUTHORITY=0
STAGE01_AUTH_GUARD=PASS
FOCUSED_NEGATIVE_TESTS=PASS
DIRECT_REGRESSIONS=PASS_OR_EXPLICIT_HISTORICAL_DRIFT_REGISTERED
GUARDIAN=PASS
TSC=PASS
LINT=PASS
BUILD=PASS
GIT_DIFF_CHECK=PASS
PRODUCTION_TOUCHED=NO
DEV_ROLLOUT_FREEZE_TOUCHED=NO
```

## Stop condition

Close this stage only after the exact evidence proves one active Auth/session
authority. Then route the next SSOT audit; do not implement C2.
