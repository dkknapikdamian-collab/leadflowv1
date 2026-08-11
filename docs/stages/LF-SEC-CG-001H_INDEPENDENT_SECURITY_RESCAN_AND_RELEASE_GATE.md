---
typ: implementation_stage
doc_role: active_stage_contract
status: routed
canonical: true
project_id: closeflow_lead_app
stage_id: LF-SEC-CG-001H_INDEPENDENT_SECURITY_RESCAN_AND_RELEASE_GATE
parent_stage: LF-SEC-CG-001G_DEPENDENCY_SECRET_AND_SUPPLY_CHAIN_AUDIT_AND_REPAIR
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 59c2741e43097b017b145b189c38ae1633849aea
target_branch: codex/closeflow-v1-e2e-roadmap
---

# B8 - independent security rescan and release gate

## Objective

Perform an independent, exact-SHA rescan of the accepted B1-B7 security work
and the mandatory cumulative A+B checkpoint. Produce a release-gate verdict
without trusting the implementers' own acceptance or silently converting
missing live evidence into PASS.

## Controller contract

```text
ROOT_CAUSE=The prior security stages have independent evidence, but release readiness requires one fresh cross-stage rescan at the exact accepted SHA and one cumulative checkpoint.
WHY_THIS_IS_NOT_A_PATCH=This stage validates trust-boundary closure and evidence composition across B1-B7; it must not hide a finding by editing one local assertion or weakening a prior gate.
SSOT_IMPACT=_project/WORKFLOW_STATE.json remains the only router; the accepted B1-B7 contracts and receipts remain the evidence sources.
SECURITY_IMPACT=Detect cross-stage regressions in authentication order, workspace isolation, billing authority, AI provider gating, support actor authority, portal upload scope and dependency/secret boundaries before release promotion.
```

## Entry conditions

- The remote working branch contains B7 accepted commit `59c2741e43097b017b145b189c38ae1633849aea`.
- The production reference remains `origin/dev-rollout-freeze`; no production write, merge or deploy is authorized.
- B7's two registered guard findings and the provider-review timeouts are carried forward explicitly.
- The current checkout may retain unrelated local evidence and pre-existing control-plane dirt; only named B8 evidence paths may be staged.

## Bounded READ_FIRST

- `_project/WORKFLOW_STATE.json` from the remote working branch
- this contract
- B1-B7 accepted state entries and their exact committed evidence paths
- the exact changed-path manifests for B1-B7
- current source owners for auth, workspace, billing, AI, support, portal upload, dependency and secret guards
- targeted tests and negative tests named by those accepted receipts

Do not preload C1 or any later stage. Do not perform live migrations, provider
deployment, billing changes, secret changes or customer actions.

## Mutable paths

```text
audit/evidence/LF-SEC-CG-001H_*
_project/WORKFLOW_STATE.json
```

No application source, test assertion, migration, dependency manifest or
production configuration may be changed by B8 unless a directly evidenced B8
rescan defect is first classified and the controller explicitly narrows a
repair to that defect.

## Required checks

1. Verify exact SHA and branch provenance for B1-B7; verify no production ref was touched.
2. Run the cumulative A+B Guardian checkpoint with source-backed coverage for auth-before-read, cross-workspace isolation, billing authority, AI plan/provider gates, support actor authority, portal upload parent scope/quota/rate limits, dependency/secret gates and test-quality integrity.
3. Re-run relevant negative tests and direct regressions for every unchanged B1-B7 surface, reusing evidence only where SHA, inputs and scope are unchanged.
4. Re-run TSC, lint, build and the B7 zero-vulnerability audit on the exact accepted SHA, or bind reuse to an exact evidence hash.
5. Perform an independent security review separate from the B1-B7 implementers. OpenCode/Freebuff are optional reviewers; timeout is recorded as timeout, never PASS.
6. Classify every finding with exact file, symbol/test, region, root cause, deployment relevance, real-defect/false-positive status and repair requirement.
7. Verify that no test weakening, disabled test, secret disclosure, broad cast, retry masking, second source of truth or production mutation was introduced.

## PASS conditions

```text
EXACT_SHA_BINDING=PASS
CUMULATIVE_A_PLUS_B_CHECKPOINT=PASS_OR_REGISTERED_FINDING
B1_TO_B7_SECURITY_RESCAN=COMPLETE
NEGATIVE_AND_DIRECT_REGRESSIONS=PASS_OR_REGISTERED_FINDING
DEPENDENCY_AND_SECRET_STATE=PASS_OR_REGISTERED_FINDING
GUARDIAN_MILESTONE=PASS_OR_REGISTERED_FINDING
INDEPENDENT_SECURITY_REVIEW=COMPLETED_OR_TIMEOUT_REGISTERED
PRODUCTION_TOUCHED=NO
```

Verdict must be exactly one of:

```text
PASS
PASS_WITH_REGISTERED_FINDING
FAIL
```

`PASS_WITH_REGISTERED_FINDING` is allowed only for evidenced, non-blocking
findings outside the B8 repair scope or for owner/runtime evidence explicitly
identified as unavailable. Any agent-remediable security defect is a FAIL until
repaired and re-tested.

## Commit and recovery boundary

Use one logical B8 evidence/repair commit, selective staging only, then push
`codex/closeflow-v1-e2e-roadmap` and verify the remote SHA. Never use
`git add .`, `git add -A`, reset/clean/restore/stash/rebase, amend or force push.
Preserve all unrelated local changes and stop before the next stage after the
B8 verdict and router update.
