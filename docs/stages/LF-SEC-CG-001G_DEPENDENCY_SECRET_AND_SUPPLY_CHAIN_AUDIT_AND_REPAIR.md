---
typ: implementation_stage
doc_role: active_stage_contract
status: routed
canonical: true
project_id: closeflow_lead_app
stage_id: LF-SEC-CG-001G_DEPENDENCY_SECRET_AND_SUPPLY_CHAIN_AUDIT_AND_REPAIR
parent_stage: LF-SEC-CG-001F_PORTAL_UPLOAD_PARENT_SCOPE_RATE_LIMIT_AND_QUOTA_REPAIR
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 8889c7c7
target_branch: codex/closeflow-v1-e2e-roadmap
---

# B7 - dependency, secret and supply-chain audit and repair

## Objective

Produce an exact, reproducible dependency and supply-chain evidence pack for
the active CloseFlow runtime. Identify reachable vulnerabilities, leaked
secrets, unsafe install scripts, transitive dependency risk and uncontrolled
drift. Apply only justified, bounded upgrades with focused regression evidence.

## Controller contract

```text
ROOT_CAUSE=DEPENDENCY_AND_SUPPLY_CHAIN_RISK_REQUIRES_REPRODUCIBLE_REACHABILITY_AUDIT
WHY_THIS_IS_NOT_A_PATCH=the result must cover the lockfile, transitive graph, scripts and secret boundaries as one release input
SSOT_IMPACT=package.json/package-lock.json remain the only dependency declaration; no generated or alternative lockfile becomes authoritative
PREVIOUS_STAGE_IMPACT=B6 adds storage/RPC dependencies and migration surface that must be included in the audit
SECURITY_IMPACT=prevent exploitable reachable CVEs, credential disclosure and install-time code execution surprises
```

## Required evidence

1. Confirm package manager, exact `package.json` and lockfile identity, lockfile
   reproducibility and dependency drift.
2. Run and preserve raw `npm audit --json` output without applying automatic
   repairs.
3. Classify findings by direct/transitive reachability and active production
   path; distinguish development-only findings from runtime exposure.
4. Scan tracked source, config, migrations, scripts and generated artifacts for
   secrets, private keys, tokens and unsafe credential logging.
5. Inspect package lifecycle/install scripts and high-risk transitive packages.
6. If remediation is required, use controlled exact upgrades, focused tests,
   TSC/lint/build and quiet release evidence. Never run `npm audit fix` blindly.
7. Run Guardian dependency/architecture and test-quality checks plus an
   independent security review. Missing live/provider evidence remains a
   registered finding.

## PASS conditions

```text
LOCKFILE_EXACT_AND_REPRODUCIBLE=PASS_OR_REGISTERED_FINDING
RAW_AUDIT_JSON=PRESENT
REACHABILITY_CLASSIFIED=YES
SECRET_SCAN=PASS_OR_REGISTERED_FINDING
INSTALL_SCRIPT_REVIEW=COMPLETE
CONTROLLED_REMEDIATION=YES_OR_NOT_REQUIRED
FOCUSED_REGRESSION=PASS
GUARDIAN=PASS_OR_REGISTERED_FINDING
INDEPENDENT_SECURITY_REVIEW=COMPLETED_OR_TIMEOUT_REGISTERED
```
