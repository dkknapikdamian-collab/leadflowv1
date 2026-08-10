---
typ: implementation_stage
doc_role: active_stage_contract
status: active
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-01_FIREBASE_SESSION_USER_IMPORT_NAMESPACE_CONTRACT_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 299a4e165e27bc36d73b72980beab30f79b246f9
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-01 — Firebase session User import namespace contract repair

## Objective

Remove the stale value import of `User` from `lucide-react` in
`src/hooks/useFirebaseSession.ts`. The hook's `User` type must resolve only to
the Firebase Auth `User` type already imported from `firebase/auth`.

This is the first root-cause-first A2 substage selected from the fresh
TypeScript map at `299a4e165e27bc36d73b72980beab30f79b246f9`.

## Evidence and root cause

The baseline has 49 active TypeScript error lines. The first three are in this
file and are all caused by two declarations named `User` in one module:

```text
src/hooks/useFirebaseSession.ts(2,10) TS2300 Duplicate identifier 'User'
src/hooks/useFirebaseSession.ts(3,46) TS2300 Duplicate identifier 'User'
src/hooks/useFirebaseSession.ts(6,36) TS2749 'User' refers to a value, but is being used as a type here
```

`useFirebaseSession` is not used by the active `src/App.tsx` path. The active
authentication source of truth is `useSupabaseSession`; the existing Stage 01
guard explicitly rejects wiring `useFirebaseSession` into the app. The Lucide
import is therefore unused legacy residue, not an authentication dependency.

```text
ROOT_CAUSE=unused lucide-react value import collides with Firebase Auth type import
WHY_THIS_IS_NOT_A_PATCH=remove the invalid declaration at its source; preserve the intended Firebase type and all hook behavior
SSOT_IMPACT=none; Supabase remains the active auth source of truth
PREVIOUS_STAGE_IMPACT=none; R23L icon registry and its exact scope remain unchanged
SECURITY_IMPACT=none; no auth flow or trust boundary changes
```

## Bounded read set

Read before implementation:

1. `src/hooks/useFirebaseSession.ts`
2. `src/hooks/useSupabaseSession.ts`
3. `src/App.tsx`
4. `scripts/check-stage01-supabase-auth.cjs`
5. the fresh A2 TypeScript map captured at the base SHA

## Mutable paths and allowlist

Only these files may change:

1. `src/hooks/useFirebaseSession.ts`
2. `scripts/check-lf-prod-sot-g15-r23m-01-firebase-session-user-import.cjs`
3. `tests/lf-prod-sot-g15-r23m-01-firebase-session-user-import.test.cjs`

Do not change dependency manifests, auth providers, application wiring,
runtime behavior, or any R23L file.

## Required checks

1. Fail-first evidence: baseline `npx tsc --noEmit --pretty false` reports the
   three listed errors and 49 total error lines.
2. The focused guard proves exactly one Firebase `User` type import remains,
   no Lucide `User` value import remains, and the hook's auth calls and return
   contract are unchanged.
3. The focused Node test passes, including a negative mutation check.
4. Fresh TypeScript mapping reports the expected delta `49 -> 46` unless the
   compiler exposes an additional root-cause dependency; no errors may be
   hidden, excluded, or bypassed.
5. `npm run build` passes.
6. Existing `npm run verify:auth:supabase-stage01` passes when available.
7. `git diff --check` and the exact allowlist guard pass.
8. AI Code Guardian review and an independent subagent review pass before the
   controller commits.

## PASS conditions

```text
ACTIVE_TSC_DELTA=49->46
NO_ANY_BYPASS=YES
NO_TS_IGNORE_BYPASS=YES
AUTH_RUNTIME_UNCHANGED=YES
R23L_SCOPE_UNCHANGED=YES
FOCUSED_GUARD=PASS
FOCUSED_TEST=PASS
BUILD=PASS
AUTH_GUARD=PASS
ALLOWLIST=PASS
```

## Recovery boundary

The implementation is one logical commit containing only the allowlisted
paths. If a check fails, preserve the current branch and fix only within this
contract; do not advance A2 or alter the workflow router until the stage is
closed. The next fresh TypeScript map, not this contract, selects A2-02.
