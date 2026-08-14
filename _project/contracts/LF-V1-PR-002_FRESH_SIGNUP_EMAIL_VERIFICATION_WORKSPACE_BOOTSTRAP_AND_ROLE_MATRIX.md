# LF-V1-PR-002 — Fresh signup, email verification, workspace bootstrap and role matrix

## Contract

- Stage ID: `LF-V1-PR-002`
- Project: `closeflow_lead_app`
- Status: `ACTIVE`
- Operator: Codex, one primary executor
- Base branch: `dev-rollout-freeze`
- Base SHA: `3bcd836255e7de22ff04b85ee83bd71c2657fc8a`
- Working branch: `codex/closeflow-v1-c2-email-workspace-bootstrap`
- One stage only: `YES`
- Previous stage: `LF-UI-SOT-007`, already `ACCEPTED_AND_CLOSED`; it is not rerun or reopened.

## Objective

Make the existing Supabase Auth path the only runtime identity owner for a new account and make workspace membership the only workspace-role authority returned to the client. A fresh email signup must have one idempotent workspace bootstrap path, an unconfirmed email must remain gated, and an authenticated user must never receive workspace access from request-body, local-storage, or synthetic local identity data.

## In scope

1. Fresh email signup and email-verification response contract.
2. Login, logout and password-recovery regression through the existing Supabase Auth owner.
3. One canonical database bootstrap trigger for profile, workspace and owner membership.
4. Idempotent server recovery in `/api/me` for installations where the trigger has not yet been applied.
5. Exact membership lookup by verified Supabase user ID and workspace ID.
6. Owner/Admin/Member role normalization and exposure to the existing frontend hook.
7. Existing C1/Supabase identity and workspace-scope guard regressions.

## Explicit exclusions

- No new auth provider, session owner, token format, router, registry or source of truth.
- No invitations or acceptance flow is invented where no existing route exists; it remains a later bounded capability.
- No UI visual-system, CSS, LF-UI-SOT-007, `api/version.stage`, `DEP0169`, dependency upgrade, or unrelated product behavior change.
- No direct Obsidian vault mutation. This repository emits an update proposal only.
- No production database migration or production deployment is claimed from a repository commit alone.

## Findings carried into execution

- Supabase Auth is the active frontend and server identity owner.
- The historical Stage01 trigger `on_auth_user_created_closeflow` and the A22 trigger `closeflow_bootstrap_user_after_auth_insert` both exist in the migration history. The new migration removes the historical trigger from the live schema and replaces the bootstrap function with one canonical fourteen-day trial path.
- `api/me` previously returned profile-role authority without verifying the exact workspace membership row. C2 adds exact membership resolution and fail-closed behavior for non-members.
- `src/lib/workspace.ts` is not an active runtime consumer, but its configured-auth fallback could synthesize `local-<uid>` workspace authority. Configured Supabase callers now fail closed instead.
- The repository roadmap in the canonical Obsidian vault is stale and does not contain C2. It is not silently rewritten; the proposal records the conflict for owner-controlled memory synchronization.

## Allowed paths

- `api/me.ts`
- `src/hooks/useWorkspace.ts`
- `src/lib/supabase-fallback.ts`
- `src/lib/workspace.ts`
- `supabase/migrations/20260814190000_c2_auth_workspace_bootstrap_single_source.sql`
- `scripts/check-c2-auth-workspace-bootstrap.cjs`
- `tests/c2-auth-workspace-bootstrap.test.cjs`
- `package.json`
- `_project/WORKFLOW_STATE.json`
- `_project/contracts/LF-V1-PR-002_FRESH_SIGNUP_EMAIL_VERIFICATION_WORKSPACE_BOOTSTRAP_AND_ROLE_MATRIX.md`
- `_project/runs/LF-V1-PR-002_C2_EXECUTION_REPORT.md`
- `_project/obsidian_updates/LF-V1-PR-002_C2_MEMORY_UPDATE_PROPOSAL.md`

## Guard and test contract

- `check:c2-auth-workspace-bootstrap`
- `test:c2-auth-workspace-bootstrap`
- `check:a15-email-verification`
- `check:a22-supabase-auth-rls-workspace`
- `check:c1-supabase-boundary`
- `test:c1-supabase-boundary`
- `guard:ssot-auth-session-owner`
- `test:ssot-auth-session-owner`
- `check:p0-auth-bootstrap-race`
- `check:p0-api-workspace-scope`
- TypeScript, build and `git diff --check` are required release evidence. The repository lint command is run and any pre-existing failure is reported without being mislabeled as a C2 pass.
- Guardian is required. A partial, timed-out, unavailable-provider or untrusted receipt is not a PASS.

## Acceptance cases

- Fresh email user: verified server identity, one workspace, one owner membership, canonical `trial_14d` / fourteen-day trial.
- Unconfirmed email user: `email_unconfirmed`, no workspace access, verification payload present.
- Existing member: workspace is selected only from the verified membership and returned role is `owner`, `admin` or `member`.
- Missing membership: fail closed; no role is inferred from body, local storage or profile-only workspace linkage.
- Owner/admin UI capability: derives from canonical membership role response.
- Invalid or expired bearer token: rejected by the existing Supabase verification path.
- Existing C1 and SSOT auth/session-owner guards remain green.

## Manual/runtime boundary

Repository/static evidence is executable in this stage. Live Supabase migration application, fresh signup confirmation and cross-tenant browser proof require the configured external project and are not claimed until verified. `MANUAL_TEST_STATUS` starts as `BRAK POTWIERDZONEGO TESTU RECZNEGO` and may be changed only with exact evidence.

## Memory and closeout

The executor may write only the repository proposal under `_project/obsidian_updates/`. Canonical Obsidian memory remains owner-controlled. The stage cannot be self-accepted; after technical evidence it stops at the owner/runtime boundary. No next workflow is activated by this contract.
