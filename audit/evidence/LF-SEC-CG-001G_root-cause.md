# LF-SEC-CG-001G root-cause record

STAGE_ID=LF-SEC-CG-001G_DEPENDENCY_SECRET_AND_SUPPLY_CHAIN_AUDIT_AND_REPAIR
START_SHA=be11058ba2ea20d803508c3e3cd808cb2b6e0666

ROOT_CAUSE=The repository lockfile resolves vulnerable dependency versions inside the active npm dependency graph. Direct ranges and stale transitive resolutions permit vulnerable versions of react-router-dom/react-router, vite, express/qs, @supabase/supabase-js, protobufjs, websocket-driver, and related packages to remain installed.

WHY_THIS_IS_NOT_A_PATCH=The defect is dependency provenance and lockfile resolution drift, not an application symptom. The repair must update the declared direct dependency constraints and the reproducible lockfile resolution together, then verify the resulting graph and application regression. No production-only fallback, test weakening, suppression, or audit-output filtering is acceptable.

CANONICAL_OWNER=package.json + package-lock.json, with npm as the repository package manager.
SSOT_IMPACT=package.json declares the supported direct dependency ranges; package-lock.json is the reproducible resolved graph and integrity source.
PREVIOUS_STAGE_IMPACT=No application source path is changed. Prior B6 evidence remains valid only for unchanged code/config surfaces; dependency and build evidence is re-run after this repair.
SECURITY_IMPACT=The vulnerable graph includes two critical and twelve high findings in the pre-repair audit. Directly reachable runtime packages and build/tooling packages require separate reachability classification; no finding is dismissed solely because it is transitive.
BLAST_RADIUS=Dependency manifests, lockfile, installed dependency graph, build tooling, router runtime, API server dependency surface, Supabase client and Firebase/Google SDK transitive paths.

CONTROLLED_REMEDIATION_PLAN=
1. Update only direct packages with an available fixed version identified by the bounded npm audit dry-run: @supabase/supabase-js 2.112.2, react-router-dom 7.18.2, express 4.22.2, and vite 6.4.3.
2. Re-resolve the lockfile with scripts disabled and audit disabled during installation; do not run npm audit fix.
3. Re-run raw npm audit, npm explain/npm ls reachability checks, lifecycle-script review, secret guards, focused regression, TypeScript, lint, and build.
4. Reject the repair if the lockfile becomes non-reproducible, integrity metadata is missing, a direct API regression appears, or a critical/high reachable finding remains without an evidenced compensating control or a separately registered external blocker.
