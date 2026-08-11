# LF-SEC-CG-001H controller review

STAGE_ID=LF-SEC-CG-001H_INDEPENDENT_SECURITY_RESCAN_AND_RELEASE_GATE
SOURCE_SHA=59c2741e43097b017b145b189c38ae1633849aea
REVIEW_SCOPE=B1-B7 cumulative security rescan plus bounded repair of findings raised by the rescan

## Finding classification and disposition

### UNBOUNDED_RETRY / server-only secret scanner traversal failure

EXACT_FILE=scripts/verify-server-only-secrets.cjs
EXACT_SYMBOL_OR_TEST=walk(dirAbs, callback)
EXACT_REGION=lines 36-49 and recursive traversal at lines 84-95
ROOT_CAUSE=The guard walked local physical directories outside tracked release inputs and reached an inaccessible historical _local_backups tree; .stversions was also local evidence rather than release input.
DEPLOY01_RELEVANT=NO
REAL_DEFECT=YES
FALSE_POSITIVE=NO
REPAIR_REQUIRED=YES
REPAIR=Added explicit bounded exclusions for _local_backups and .stversions while retaining fail-closed scanning for release-relevant text files.
POST_REPAIR_RESULT=npm run verify:security:server-only-secrets PASS

### DISABLED_TEST_MASKING_FAILURE / Firebase Stage 03 guard drift

EXACT_FILE=scripts/check-stage03-firebase-legacy-lockdown.cjs; source firestore.rules
EXACT_SYMBOL_OR_TEST=client_portal_tokens lockdown assertion
EXACT_REGION=guard lines 40-43; firestore.rules lines 154-162
ROOT_CAUSE=The guard asserted an obsolete owner-only allow get/list rule although the canonical source intentionally disables the legacy collection with allow read, write: if false.
DEPLOY01_RELEVANT=NO
REAL_DEFECT=YES
FALSE_POSITIVE=NO
REPAIR_REQUIRED=YES
REPAIR=Changed the stale assertion to require the canonical deny-all legacy-token rule. The source was not weakened.
POST_REPAIR_RESULT=npm run verify:security:firebase-stage03 PASS

Both findings were agent-remediable guard defects, not application-runtime vulnerabilities. Both were repaired within the B8 bounded scope.

## Cumulative evidence

B1_B7_STATIC_TESTS=23/23 PASS
B1_B7_RUNTIME_TESTS=38/38 PASS
CRITICAL_TESTS=13/13 PASS
NPM_AUDIT=0 vulnerabilities; exact raw final evidence in audit/evidence/LF-SEC-CG-001G_npm-audit-final.json
GEMINI_CLIENT_GUARD=PASS
SERVER_ONLY_SECRET_GUARD=PASS after repair
FIREBASE_STAGE03_GUARD=PASS after repair
TSC=PASS
LINT=PASS
BUILD=PASS; existing non-blocking warnings only for Supabase fallback chunk overlap and large chunks
PRODUCTION_TOUCHED=NO
RUNTIME_DEPENDENCY_MIGRATION_SECRET_CHANGE=NO

## Independent review providers

GPT_INDEPENDENT_REVIEWER=UNAVAILABLE_THREAD_LIMIT
OPENCODE=TIMEOUT_124S; free DeepSeek invocation was read-only, process was killed, no residual process
FREEBUFF=BLOCKED_PROVIDER_WORK_DEADLINE; prior canonical WinPTY invocation was cleaned with no residual process
CONTROLLER_INDEPENDENT_REVIEW=PASS; exact source, diff, guard behavior, and negative security assertions reviewed after repair

## Registered non-blocking findings

FIREBASE_CLIENT_API_KEY_RESTRICTIONS=UNVERIFIED_PROVIDER_SIDE_CONTROL; the Firebase client key is public client configuration, but provider-side API restrictions remain a release/security follow-up before production promotion.
LIVE_PROVIDER_EVIDENCE=NOT_EXECUTED; B8 is a repository/security rescan and did not mutate production or provider state.

## Controller verdict

B8_VERDICT=PASS_WITH_REGISTERED_FINDINGS
AGENT_REMEDIABLE_BLOCKERS_REMAIN=0
NEXT_STAGE=LF-V1-PR-001_SUPABASE_SCHEMA_MIGRATIONS_RLS_AND_SERVICE_ROLE_BOUNDARY
