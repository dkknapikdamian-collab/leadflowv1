# LF-SEC-CG-001H root-cause and bounded guard repair

STAGE_ID=LF-SEC-CG-001H_INDEPENDENT_SECURITY_RESCAN_AND_RELEASE_GATE
BASE_SHA=59c2741e43097b017b145b189c38ae1633849aea

## Finding 1

EXACT_FILE=scripts/verify-server-only-secrets.cjs
EXACT_SYMBOL_OR_TEST=walk(dirAbs, callback)
EXACT_REGION=lines 82-93 before repair
ROOT_CAUSE=The recursive scanner enumerates every physical directory below the repository but neither limits traversal to tracked release inputs nor handles Windows access-denied directories. Local historical `_local_backups` content is outside the tracked source/config scope and can raise EPERM before the actual secret assertions run.
DEPLOY01_RELEVANT=NO
REAL_DEFECT=YES (security evidence guard robustness)
FALSE_POSITIVE=NO
REPAIR_REQUIRED=YES
WHY_NOT_PATCH=The guard must remain fail-closed for tracked release inputs while deterministically excluding known local backup/versioning trees that are not repository evidence. A silent catch would weaken evidence, so the repair is an explicit bounded traversal exclusion plus a post-repair guard run.

## Finding 2

EXACT_FILE=scripts/check-stage03-firebase-legacy-lockdown.cjs and firestore.rules
EXACT_SYMBOL_OR_TEST=client_portal_tokens assertion
EXACT_REGION=guard lines 40-41 before repair; rules lines 154-158
ROOT_CAUSE=The guard still requires an owner-only `allow get, list` rule for the legacy token collection, while the current source intentionally disables the legacy path with `allow read, write: if false;`. The source is stricter than the old guard contract, so the rescan fails on contract drift rather than an access vulnerability.
DEPLOY01_RELEVANT=NO
REAL_DEFECT=YES (stale security guard contract)
FALSE_POSITIVE=NO
REPAIR_REQUIRED=YES
WHY_NOT_PATCH=The guard must assert the canonical deny-all legacy-token rule that the source actually owns. Changing the source to satisfy the old assertion would weaken security and violate the single source of truth.

BOUNDED_REPAIR_SCOPE=scripts/verify-server-only-secrets.cjs; scripts/check-stage03-firebase-legacy-lockdown.cjs; audit/evidence/LF-SEC-CG-001H_*
FORBIDDEN_SCOPE=application runtime, migrations, dependency manifests, test weakening, production/provider state
