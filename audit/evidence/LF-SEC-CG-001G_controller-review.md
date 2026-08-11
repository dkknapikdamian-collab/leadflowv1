# LF-SEC-CG-001G controller review

STAGE_ID=LF-SEC-CG-001G_DEPENDENCY_SECRET_AND_SUPPLY_CHAIN_AUDIT_AND_REPAIR
START_SHA=be11058ba2ea20d803508c3e3cd808cb2b6e0666
CURRENT_HEAD=be11058ba2ea20d803508c3e3cd808cb2b6e0666
WORK_BRANCH=codex/closeflow-v1-e2e-roadmap
PRODUCTION_BRANCH=dev-rollout-freeze
PRODUCTION_TOUCHED=NO

## Root cause and repair decision

ROOT_CAUSE_CONFIRMED=YES
ROOT_CAUSE=The npm lockfile resolved vulnerable direct and transitive versions in the active dependency graph. The defect was dependency provenance and resolution drift, not an application-code symptom.
WHY_NOT_PATCH=The repair updates manifest declarations and reproducible lockfile resolutions together, then proves the resulting graph with npm audit, npm ls, npm ci dry-run, TSC, lint, build and focused security/regression tests.
CONTROLLER_DECISION=PASS_WITH_REGISTERED_NON_BLOCKING_FINDINGS

Direct controlled upgrades:

- @supabase/supabase-js: 2.112.2
- express: 4.22.2
- react-router-dom/react-router: 7.18.2
- vite: 6.4.3, retained as a dev/build dependency
- tsx: 4.23.12
- @types/react: 19.2.17 and @types/react-dom: 19.2.3, added as explicit dev dependencies to make the JSX type surface reproducible

Transitive fixes are bounded by exact npm overrides for @babel/core, @grpc/grpc-js, @hono/node-server, @modelcontextprotocol/sdk and its nested body-parser, brace-expansion, express-rate-limit, fast-uri, hono, ip-address, js-yaml, nanoid, postcss, protobufjs, websocket-driver, ws, and tsx's esbuild. No blind `npm audit fix` or major Firebase/@google/genai upgrade was used.

## Exact current evidence

PACKAGE_JSON_SHA256=dc790114d172bda45315c574d161ffe5d0bcf77b928c6b423f7ffdaa6935283d
PACKAGE_LOCK_SHA256=b295a53b04b41daed0af03887b7c1b918a8748a6a4a94ea9fce844fb047a3981
LOCKFILE_VERSION=3
LOCK_PACKAGE_ENTRIES_EXCLUDING_ROOT=685
MANIFEST_LOCK_ROOT_MISMATCHES=0
LOCK_ENTRIES_MISSING_RESOLVED_OR_INTEGRITY=0
PACKAGE_SCRIPTS_REMOVED=0

PRE_REMEDIATION_AUDIT_JSON=audit/evidence/LF-SEC-CG-001G_npm-audit.json
PRE_REMEDIATION_AUDIT_SHA256=cdf19378ae523125fdee422d3147e93e012f276fdf6235009a6d667e1e7a4bd9
PRE_REMEDIATION_VULNERABILITIES=25 (low=4, moderate=7, high=12, critical=2)

POST_REMEDIATION_AUDIT_JSON=audit/evidence/LF-SEC-CG-001G_npm-audit-post-remediation.json
POST_REMEDIATION_AUDIT_SHA256=4b51d4ec4a06d1e5e6fbc537c349c202b20da0fae9bba14749b8a9a98cdea72
POST_REMEDIATION_VULNERABILITIES=0 (low=0, moderate=0, high=0, critical=0)

FINAL_AUDIT_JSON=audit/evidence/LF-SEC-CG-001G_npm-audit-final.json
FINAL_AUDIT_SHA256=89837368b014128cf423792a93438bf791ffb7d70069c45fe49d26007bbaa4a9
FINAL_AUDIT_PRODUCTION_VULNERABILITIES=0 (npm audit --omit=dev)

## Verification results

PASS `npm ci --dry-run --ignore-scripts --audit=false --fund=false`
PASS `npm audit --json --no-fund`
PASS `npm audit --omit=dev --json`
PASS `npm ls` reachability review: protobufjs=7.6.5, websocket-driver=0.7.5, @grpc/grpc-js=1.9.16, ws=8.21.3 and all declared override targets resolve as intended
PASS `node --test tests/ai-config-no-secret-leak.test.cjs tests/b6-portal-upload-scope.test.cjs` (6/6)
PASS `node --import tsx --test tests/b6-portal-upload-scope-runtime.test.ts` (6/6)
PASS `node --test tests/stage5b-package-json-bom-build-gate.test.cjs` (3/3)
PASS `npm run verify:security:gemini-client`
PASS `npx tsc --noEmit`
PASS `npm run lint`
PASS `npm run build`
PASS `git diff --check`

Build warnings remain pre-existing and non-failing: static/dynamic import overlap for `supabase-fallback` and chunks above 500 kB. They were not hidden or altered by this stage.

## Lifecycle and secret boundary review

ROOT_PACKAGE_LIFECYCLE_HOOKS=NONE
LOCK_PACKAGES_WITH_INSTALL_METADATA=6
LIFECYCLE_ENTRIES=@firebase/util, esbuild, fsevents(optional), msw, protobufjs, vite/node_modules/esbuild
LIFECYCLE_REVIEW=Static review completed. Firebase/util and protobufjs run local package scripts; esbuild binaries run install scripts; MSW's postinstall catches its own import error; optional fsevents is not installed on this platform. `--ignore-scripts` was intentional, so provider-download/install-script runtime behavior remains an evidence limitation, not a fabricated PASS.

TRACKED_SECRET_SCAN=No actual secret values or private-key material found in tracked source/config by bounded pattern scan. `VITE_SUPABASE_SERVICE_ROLE_KEY` occurs only in a guard's negative assertion; the Firebase `AIza...` value is a public client configuration key and is not treated as a server secret. `WKLEJ_PORTAL_STORAGE_HEALTH_SECRET` is a Polish placeholder label in historical instructions, not a credential; it was not redacted.

## Registered findings

FINDING_1=The server-only-secret guard recursively traverses local historical `_local_backups` and raises Windows EPERM on an inaccessible nested path. This is a guard robustness issue outside B7 dependency ownership; it did not report an application secret leak. REGISTERED_NON_BLOCKING=YES.

FINDING_2=The Firebase Stage03 guard expects `client_portal_tokens` to have an owner-only allow rule, while current `firestore.rules` intentionally denies all access to the legacy collection. Deny-all is stricter, but the guard/source contract is stale. This is an existing security-guard contract mismatch outside B7 dependency ownership. REGISTERED_NON_BLOCKING=YES.

FINDING_3=The Firebase API key in `firebase-applet-config.json` is client configuration, not a server secret, but its provider-side restriction status is not proven locally. OWNER/SECURITY follow-up should verify API-key restrictions before production promotion. It is not a B7 dependency blocker.

## Independent review and Guardian

IMPLEMENTER=Epicurus/previous B7 worker; no self-acceptance relied upon.
OPENCODE=TIMEOUT after 184 seconds; process explicitly terminated and no residual opencode process remained.
FREEBUFF=BLOCKED_PROVIDER_WORK_DEADLINE after task submission; canonical WinPTY 140x40 adapter killed the process tree and verified no residual `freebuff`/`manicode` process. Provider output was untrusted and not treated as PASS.
GPT_INDEPENDENT_REVIEWER=UNAVAILABLE; agent thread limit reached.
CONTROLLER_INDEPENDENT_REVIEW=PASS: performed a separate read-only review of the exact manifest/lock semantics, raw audit hashes, npm ls reachability, lifecycle list, secret classifications, focused tests, TSC/lint/build, and changed-path boundary.
GUARDIAN_INLINE=PASS: no application-code suppression, disabled test, credential addition, broad audit fix, production mutation, or second source of truth found.
GUARDIAN_STAGE=PASS_WITH_REGISTERED_FINDINGS: current B7 contract satisfied; the two existing guard failures are explicitly registered outside dependency ownership.

COMMIT=NONE
PUSH=NONE
WORKFLOW_STATE_CHANGED=NO
NEXT_CONTROLLER_ACTION=Review exact staged path set, selectively commit only B7 package/evidence changes, push the accepted commit to the work branch, then run the mandatory milestone Guardian before routing B8.
