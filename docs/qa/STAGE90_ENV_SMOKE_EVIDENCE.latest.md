# Stage90 Env Smoke Evidence

GeneratedAt: 2026-05-05T18:05:24.064Z
Status: EVIDENCE_TEMPLATE_NOT_LIVE_COMPLETE
Package: CUMULATIVE_STAGE90F

## Env status

| Key | Status |
|---|---|
| APP_URL | MISSING |
| RELEASE_PREVIEW_URL | MISSING |
| VERCEL_URL | MISSING |
| RESEND_API_KEY | MISSING |
| DIGEST_FROM_EMAIL | MISSING |
| CRON_SECRET | MISSING |
| SUPABASE_URL | MISSING |
| SUPABASE_SERVICE_ROLE_KEY | MISSING |
| SUPABASE_PORTAL_BUCKET | MISSING |
| VITE_SUPABASE_URL | MISSING |
| VITE_SUPABASE_ANON_KEY | MISSING |

## Static contract snapshot

| Area | Result | Evidence |
|---|---:|---|
| NotificationRuntime file | YES | src/components/NotificationRuntime.tsx |
| NotificationRuntime interval/poll contract | YES | accepts 60000, 60_000, 60*1000, pollInterval/setInterval |
| Notification runtime mounted | YES | App/Layout scan |
| Service worker avoids API/auth/storage cache | YES | public/src SW scan |
| Daily digest API/server contract | YES | scanned 111 relevant files |
| Resend contract referenced | YES | digest scan |
| Vercel cron configured | YES | /api/daily-digest @ 5 5 * * *; /api/weekly-report @ 15 6 * * 1 |
| Vercel rewrite daily digest/system | YES | vercel.json scan |
| Portal relevant files found | YES | scanned 109 relevant files |
| Portal token/session contract | YES | portal scan |
| Portal storage/upload/bucket contract | YES | portal/storage recursive scan |
| Portal blocks missing token/session | YES | portal/upload scan |
| Button QA checklist exists | YES | docs/qa/CHECKLISTA_QA_PRZYCISKOW_CLOSEFLOW_2026-05-05.md |

## Relevant files discovered

### Digest
- 00_READ_FIRST_STAGE90_QA_SMOKE_PWA_DIGEST_PORTAL_BUTTON_MATRIX.md
- api/daily-digest.ts
- api/me.ts
- api/system.ts
- docs/AKTUALNY_STATUS_I_LISTA_WDROZEN_2026-04-28.md
- docs/audits/STAGE47_TASKS_UI_TRUTH_AND_NEXT_STAGE_SCAN_2026-05-04.md
- docs/closeflow_plan_wartosci_dyktowanie_ai_szablony_2026-04-30.md
- docs/closeflow_supabase_first_full_execution_plan_2026-05-01.md
- docs/closeflow_super_audit_prompt_2026-05-01.md
- docs/CUMULATIVE_NEXT_STAGES_2026-04-27.md
- docs/DAILY_DIGEST_DIAGNOSTICS_2026-04-25.md
- docs/DAILY_DIGEST_EMAIL_RUNTIME_2026-04-25.md
- docs/EMAIL_DIGEST_DOMAIN_GATE_2026-04-25.md
- docs/P12_ADMIN_FULL_ACCESS_OVERRIDE.md
- docs/P13_DIGEST_PWA_NOTIFICATIONS_QA.md
- docs/profile-workspace-source-of-truth.md
- docs/qa/STAGE90D_LIVE_SMOKE_COMMANDS.md
- docs/qa/STAGE90_ENV_SMOKE_EVIDENCE.latest.md
- docs/release/FAZA1_ETAP11_PRODUCT_TRUTH_STATUS_MATRIX_2026-05-03.md
- docs/release/FAZA1_ETAP11_UI_COPY_LEGAL_TRUTH_2026-05-03.md

### Portal / storage
- 00_READ_FIRST_STAGE90_QA_SMOKE_PWA_DIGEST_PORTAL_BUTTON_MATRIX.md
- api/activities.ts
- api/case-items.ts
- api/cases.ts
- api/leads.ts
- api/system.ts
- docs/A13_TEMPLATES_STYLE_AND_CRITICAL_TESTS.md
- docs/architecture/API_SUPABASE_SCHEMA_CONTRACT_STAGE03A.md
- docs/audits/UI_SURFACE_AUDIT_STAGE45_2026-05-04T17-18-50-961Z.md
- docs/AUDYT_I_PLAN_MIGRACJI_FIREBASE_DO_SUPABASE_2026-04-22.md
- docs/CASE_DETAIL_UI_PLAN_2026-04-27.md
- docs/CASE_DETAIL_V1_COMMAND_CENTER_2026-04-24.md
- docs/closeflow_supabase_first_full_execution_plan_2026-05-01.md
- docs/closeflow_super_audit_prompt_2026-05-01.md
- docs/CLOSEFLOW_V1_STAGE_MAP_2026-04-24.md
- docs/DATA_SOURCE_MAP.md
- docs/DOMAIN_STATUSES_CONTRACT.md
- docs/FIREBASE_DECOMMISSION_PLAN.md
- docs/LEAD_CLIENT_CASE_FLOW.md
- docs/legacy/firebase-blueprint.legacy.json
- docs/P0_SUPABASE_RLS_SCHEMA_CONFIRMATION.md
- docs/P15_PORTAL_STORAGE_BUCKET.md
- docs/P8_PORTAL_SECRETS_HARDENING.md
- docs/P9_REMOVE_LEGACY_PLAINTEXT_PORTAL_HANDLER.md
- docs/PRODUCTION_READINESS_STATUS.md
- docs/qa/CHECKLISTA_QA_PRZYCISKOW_CLOSEFLOW_2026-05-05.md
- docs/qa/STAGE90D_LIVE_SMOKE_COMMANDS.md
- docs/qa/STAGE90_ENV_SMOKE_EVIDENCE.latest.md
- docs/release/FAZA2_ETAP22_RLS_BACKEND_SECURITY_PROOF_2026-05-03.md
- docs/release/RELEASE_CANDIDATE_2026-05-02.md

## Live smoke required

### Etap 13 - PWA / notifications / digest

- [ ] Browser notification permission requested in real browser.
- [ ] Toast appears when due notification exists.
- [ ] Browser notification appears when permission is granted.
- [ ] PWA install/service worker visible in browser application panel.
- [ ] Daily digest cron route works in Vercel logs.
- [ ] Resend delivery verified with non-production test recipient or safe dry-run route.
- [ ] Digest dedupe verified: second run does not duplicate same digest.

### Etap 14 - Portal / storage

- [ ] Portal without token returns no access.
- [ ] Portal with valid token opens correct scoped session.
- [ ] Upload valid file succeeds.
- [ ] Upload invalid type/oversize fails.
- [ ] Uploaded file is not publicly listable.
- [ ] Token from another client/workspace cannot access data.

### Etap 15 - Button Matrix

- [ ] Fill live status in `docs/qa/CHECKLISTA_QA_PRZYCISKOW_CLOSEFLOW_2026-05-05.md`.
- [ ] Every PENDING/FAIL creates a new small repair stage.

## Decision

Do not mark Stage13/14/15 as fully DONE until live boxes above are checked.
