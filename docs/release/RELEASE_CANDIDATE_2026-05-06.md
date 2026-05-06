# Release Candidate Evidence — CloseFlow / LeadFlow

**Data wygenerowania:** 2026-05-06T17:56:26.193Z  
**Status evidence gate:** ❌ **FAIL**  
**Zakres:** ETAP 0.1 — Release Candidate Evidence Gate  
**Uwaga:** ten dokument nie zmienia działania aplikacji. To dowód release’u dla audytu.

---

## 1. Źródło prawdy release candidate

| Pole | Wartość |
|---|---|
| Repo root | `C:/Users/malim/Desktop/biznesy_ai/2.closeflow` |
| Repo remote | `https://github.com/dkknapikdamian-collab/leadflowv1.git` |
| Branch | `dev-rollout-freeze` |
| Commit | `da48e5d5f983650ad9a4c131beb00ed812a15383` |
| Short commit | `da48e5d` |
| Commit date | `2026-05-06T19:39:49+02:00` |
| Commit subject | docs: set active product direction sources |
| Preview URL | **NOT_PROVIDED** |
| Working tree | DIRTY |
| Node | `v24.14.0` |
| npm | `11.9.0` |
| package | `closeflow` |
| package version | `0.0.0` |

### Git working tree

```text
M api/activities.ts
 M api/cases.ts
 M api/clients.ts
 M api/leads.ts
 M api/work-items.ts
 M package.json
 M scripts/check-assistant-operator-v1.cjs
 M scripts/check-polish-mojibake.cjs
 M scripts/print-release-evidence.cjs
 M src/App.tsx
 M src/components/GlobalQuickActions.tsx
 M src/components/admin-tools/admin-tools-export.ts
 M src/lib/access.ts
 M src/lib/lead-service-state.ts
 M src/pages/AdminAiSettings.tsx
 M src/pages/AiDrafts.tsx
 M src/pages/Billing.tsx
 M src/pages/Calendar.tsx
 M src/pages/CaseDetail.tsx
 M src/pages/ClientDetail.tsx
 M src/pages/LeadDetail.tsx
 M src/pages/Leads.tsx
 M src/pages/Settings.tsx
 M src/pages/SupportCenter.tsx
 M src/pages/Templates.tsx
 M src/server/_access-gate.ts
 M src/server/_request-scope.ts
 M src/server/_supabase.ts
 M src/server/ai-config.ts
 M src/server/billing-checkout-handler.ts
 M src/server/service-profiles.ts
 M src/server/support-handler.ts
?? docs/release/BUTTON_ACTION_MAP_2026-05-06.json
?? docs/release/MANUAL_QA_CHECKLIST_2026-05-06.md
?? docs/release/RELEASE_CANDIDATE_2026-05-06.md
?? docs/release/STAGE16_ADMIN_BACKEND_SERVICE_ROLE_GUARD_2026-05-06.md
?? docs/release/STAGE16_FINAL_QA_RELEASE_CANDIDATE_2026-05-06.md
?? scripts/check-admin-backend-guard.cjs
?? scripts/check-button-action-map.cjs
?? scripts/check-no-body-workspace-trust.cjs
?? scripts/check-service-role-scoped-mutations.cjs
?? scripts/check-ui-truth-copy.cjs
?? scripts/check-workspace-scope.cjs
?? scripts/repair-stage14c-runtime-copy.cjs
?? scripts/repair-stage14d-runtime-copy.cjs
?? scripts/repair-stage14e-leftover-mojibake.cjs
?? scripts/repair-stage14f-leftover-mojibake-force.cjs
?? scripts/repair-stage14g-structural-mojibake-force.cjs
?? scripts/repair-stage15-workspace-security.cjs
?? scripts/repair-stage15c-request-scope-hard-lock.cjs
?? scripts/repair-stage15d-no-body-workspace-trust.cjs
?? scripts/repair-stage16-admin-service-role-guard.cjs
?? scripts/repair-stage16-final-qa-release-candidate.cjs
?? src/lib/ui-truth.ts
?? tests/admin-backend-guard.test.cjs
?? tests/button-action-map.test.cjs
?? tests/route-smoke.test.cjs
?? tests/service-role-scoped-mutations.test.cjs
?? tests/ui-truth-copy.test.cjs
?? tests/workspace-isolation.test.cjs
```

---

## 2. Lista skryptów testowych / release guardów wykrytych w package.json

| Script | Command |
|---|---|
| `audit:etap0-freeze-evidence` | `node scripts/collect-etap0-freeze-evidence.cjs` |
| `audit:release-candidate` | `node scripts/print-release-evidence.cjs --write --out=docs/release/RELEASE_CANDIDATE_2026-05-06.md --checks=build,verify:closeflow:quiet,test:critical,check:polish-mojibake,check:ui-truth-copy,check:workspace-scope,check:plan-access-gating,check:assistant-operator-v1,check:pwa-safe-cache,test:route-smoke,test:button-action-map,check:button-action-map` |
| `audit:release-evidence` | `node scripts/print-release-evidence.cjs --write --out=docs/release/RELEASE_CANDIDATE_EVIDENCE_2026-05-02.md` |
| `audit:release-evidence:etap0.1` | `node scripts/print-release-evidence.cjs --write --out=docs/release/RELEASE_CANDIDATE_EVIDENCE_2026-05-02.md` |
| `audit:stage02-access-release-evidence` | `node scripts/print-stage02-access-release-evidence.cjs` |
| `audit:stage12-ai-assistant-vercel-release-evidence` | `node scripts/print-stage12-ai-assistant-vercel-release-evidence.cjs` |
| `audit:stage16-context-action-button-parity` | `node scripts/audit-context-action-button-parity.cjs` |
| `audit:stage18-context-action-runtime-smoke` | `node scripts/smoke-stage18-context-action-runtime-contract.cjs` |
| `audit:stage19-context-action-route-map` | `node scripts/audit-context-action-route-map.cjs` |
| `audit:stage19-context-action-route-map-evidence` | `node scripts/audit-stage19-context-action-route-map-evidence.cjs` |
| `audit:stage20-context-action-real-button-trigger` | `node scripts/audit-stage20-context-action-real-button-trigger.cjs` |
| `audit:stage20-context-action-real-button-triggers` | `node scripts/audit-context-action-real-button-triggers.cjs` |
| `audit:ui-surface-stage45` | `node scripts/audit-closeflow-ui-surface-stage45.mjs` |
| `build` | `vite build` |
| `check:a13-critical-regressions` | `node scripts/check-a13-critical-regressions.cjs` |
| `check:a14-business-types` | `node scripts/check-a14-business-types.cjs` |
| `check:a15-email-verification` | `node scripts/check-a15-email-verification.cjs` |
| `check:a16-no-onchange-write-storm` | `node scripts/check-a16-no-onchange-write-storm.cjs` |
| `check:a18-branding-docs` | `node scripts/check-a18-branding-docs.cjs` |
| `check:a19-admin-role` | `node scripts/check-a19-admin-role.cjs` |
| `check:a19v2-admin-schema-sidebar` | `node scripts/check-a19v2-admin-schema-sidebar.cjs` |
| `check:a20-runtime-imports` | `node scripts/check-a20-runtime-imports.cjs` |
| `check:a20-status-contract-sidebar` | `node scripts/check-a20-status-contract-sidebar.cjs` |
| `check:a20c-sidebar-hitbox` | `node scripts/check-a20c-sidebar-hitbox.cjs` |
| `check:a20d-sidebar-pointer-router` | `node scripts/check-a20d-sidebar-pointer-router.cjs` |
| `check:a20e-sidebar-today-tone` | `node scripts/check-a20e-sidebar-today-tone.cjs` |
| `check:a22-supabase-auth-rls-workspace` | `node scripts/check-a22-supabase-auth-rls-workspace.cjs` |
| `check:a22c-profiles-id-rls-hotfix` | `node scripts/check-a22c-profiles-id-rls-hotfix.cjs` |
| `check:a23-firestore-supabase-migration` | `node scripts/check-a23-firestore-supabase-migration.cjs` |
| `check:a24-lead-to-case-flow` | `node scripts/check-a24-lead-to-case-flow.cjs` |
| `check:a25-nearest-planned-action` | `node scripts/check-a25-nearest-planned-action.cjs` |
| `check:a26-activities-ai-drafts-supabase` | `node scripts/check-a26-activities-ai-drafts-supabase.cjs` |
| `check:a27b-response-templates-supabase` | `node scripts/check-a27b-response-templates-supabase.cjs` |
| `check:a27c-response-templates-sql-fix` | `node scripts/check-a27c-response-templates-sql-fix.cjs` |
| `check:a27g-response-template-encoding` | `node scripts/check-a27g-response-template-encoding.cjs` |
| `check:a28-digest-notifications-pwa` | `node scripts/check-a28-digest-notifications-pwa.cjs` |
| `check:a29-supabase-runtime-shell` | `node scripts/check-a29-supabase-runtime-shell.cjs` |
| `check:a29f-vercel-deploy-hotfix` | `node scripts/check-a29f-vercel-deploy-hotfix.cjs` |
| `check:access-billing-source-of-truth-stage02a` | `node scripts/check-access-billing-source-of-truth-stage02a.cjs` |
| `check:admin-ai-role-gate` | `node scripts/check-admin-ai-role-gate.cjs` |
| `check:admin-backend-guard` | `node scripts/check-admin-backend-guard.cjs` |
| `check:admin-button-matrix` | `node scripts/check-admin-button-matrix.cjs` |
| `check:admin-click-to-annotate` | `node scripts/check-admin-click-to-annotate.cjs` |
| `check:admin-debug-toolbar` | `node scripts/check-admin-debug-toolbar.cjs` |
| `check:admin-dialog-drag-lower` | `node scripts/check-admin-dialog-drag-lower.cjs` |
| `check:admin-dialog-stack-fix` | `node scripts/check-admin-dialog-stack-fix.cjs` |
| `check:admin-feedback-export` | `node scripts/check-admin-feedback-export.cjs` |
| `check:admin-quick-editor-portal-drag` | `node scripts/check-admin-quick-editor-portal-drag.cjs` |
| `check:admin-review-mode` | `node scripts/check-admin-review-mode.cjs` |
| `check:admin-toolbar-utf8-portal-force` | `node scripts/check-admin-toolbar-utf8-portal-force.cjs` |
| `check:ai-app-context-operator-stage26` | `node scripts/check-ai-app-context-operator-stage26.cjs` |
| `check:assistant-operator-v1` | `node scripts/check-assistant-operator-v1.cjs` |
| `check:billing-truth` | `node scripts/check-billing-truth.cjs` |
| `check:button-action-map` | `node scripts/check-button-action-map.cjs` |
| `check:case-detail-write-access-gate-stage02b` | `node tests/case-detail-write-access-gate-stage02b.test.cjs` |
| `check:client-inline-edit` | `node scripts/check-client-inline-edit-and-task-edit.cjs` |
| `check:data-contract-stage-a1` | `node scripts/check-data-contract-stage-a1.cjs` |
| `check:data-contract-stage-a2` | `node scripts/check-data-contract-stage-a2.cjs` |
| `check:data-contract-v1` | `node scripts/check-data-contract-v1.cjs` |
| `check:digest-env-truth` | `node scripts/check-digest-env-truth.cjs` |
| `check:draft-confirmation-flow` | `node scripts/check-draft-confirmation-flow.cjs` |
| `check:faza0-release-governance` | `node scripts/check-faza0-release-governance-naming.cjs` |
| `check:faza1-etap11-ui-copy-legal-truth` | `node scripts/check-faza1-etap11-ui-copy-legal-truth.cjs` |
| `check:faza1-etap12-guard-ui-truth` | `node scripts/check-faza1-etap12-guard-ui-truth.cjs` |
| `check:faza2-etap21-workspace-isolation` | `node scripts/check-faza2-etap21-workspace-isolation.cjs` |
| `check:faza2-etap22-rls-backend-security-proof` | `node scripts/check-faza2-etap22-rls-backend-security-proof.cjs` |
| `check:faza3-etap31-plan-source-of-truth` | `node scripts/check-faza3-etap31-plan-source-of-truth.cjs` |
| `check:faza3-etap32-plan-feature-access-gate` | `node scripts/check-faza3-etap32-plan-feature-access-gate.cjs` |
| `check:faza3-etap32b-plan-visibility-contract` | `node scripts/check-faza3-etap32b-plan-visibility-contract.cjs` |
| `check:faza3-etap32c-access-gate-runtime-hotfix-v3` | `node scripts/check-faza3-etap32c-access-gate-runtime-hotfix-v3.cjs` |
| `check:faza3-etap32d-plan-based-ui-visibility` | `node scripts/check-faza3-etap32d-plan-based-ui-visibility.cjs` |
| `check:faza3-etap32e-settings-digest-billing-visibility-smoke` | `node scripts/check-faza3-etap32e-settings-digest-billing-visibility-smoke.cjs` |
| `check:faza3-etap32f-backend-entity-limits-smoke` | `node scripts/check-faza3-etap32f-backend-entity-limits-smoke.cjs` |
| `check:faza3-etap32g-ai-draft-cancel-smoke` | `node scripts/check-faza3-etap32g-ai-draft-cancel-smoke.cjs` |
| `check:faza3-etap32h-lead-limit-placement-hotfix` | `node scripts/check-faza3-etap32h-lead-limit-placement-hotfix.cjs` |
| `check:faza4-etap41-data-contract-map` | `node scripts/check-faza4-etap41-data-contract-map.cjs` |
| `check:faza4-etap42-task-event-contract-normalization` | `node scripts/check-faza4-etap42-task-event-contract-normalization.cjs` |
| `check:faza4-etap43-critical-crud-smoke` | `node scripts/check-faza4-etap43-critical-crud-smoke.cjs` |
| `check:faza4-etap44a-live-refresh-mutation-bus` | `node scripts/check-faza4-etap44a-live-refresh-mutation-bus.cjs` |
| `check:faza4-etap44b-today-live-refresh-import-hotfix` | `node scripts/check-faza4-etap44b-today-live-refresh-import-hotfix.cjs` |
| `check:faza4-etap44b-today-live-refresh-listener` | `node scripts/check-faza4-etap44b-today-live-refresh-listener.cjs` |
| `check:faza4-etap44c-mutation-bus-coverage-smoke` | `node scripts/check-faza4-etap44c-mutation-bus-coverage-smoke.cjs` |
| `check:faza5-etap51-ai-read-vs-draft-intent` | `node scripts/check-faza5-etap51-ai-read-vs-draft-intent.cjs` |
| `check:faza5-etap52-today-collapsible-masonry` | `node scripts/check-faza5-etap52-today-collapsible-masonry.cjs` |
| `check:final-qa-release-candidate` | `node --test tests/route-smoke.test.cjs && node --test tests/button-action-map.test.cjs && node scripts/check-button-action-map.cjs` |
| `check:google-calendar-env-truth` | `node scripts/check-google-calendar-env-truth.cjs` |
| `check:google-calendar-stage04-oauth-env-smoke-docs` | `node scripts/check-google-calendar-stage04-oauth-env-smoke-docs.cjs` |
| `check:google-calendar-stage05-reminder-method-backend` | `node scripts/check-google-calendar-stage05-reminder-method-backend.cjs` |
| `check:google-calendar-stage06-reminder-method-ui` | `node scripts/check-google-calendar-stage06-reminder-method-ui.cjs` |
| `check:google-calendar-stage07-oauth-smoke-evidence-gate` | `node scripts/check-google-calendar-stage07-oauth-smoke-evidence-gate.cjs` |
| `check:google-calendar-stage07b-ts-contract-production-first` | `node scripts/check-google-calendar-stage07b-ts-contract-production-first.cjs` |
| `check:google-calendar-stage07c-settings-auth-snapshot` | `node scripts/check-google-calendar-stage07c-settings-auth-snapshot.cjs` |
| `check:google-calendar-stage08d-runtime-ui-sync` | `node scripts/check-google-calendar-stage08d-runtime-ui-sync.cjs` |
| `check:google-calendar-stage09b-full-calendar-parity` | `node scripts/check-google-calendar-stage09b-full-calendar-parity.cjs` |
| `check:google-calendar-stage09e-safe-source-url` | `node scripts/check-google-calendar-stage09e-safe-source-url.cjs` |
| `check:google-calendar-stage10k-inbound-sync-global` | `node scripts/check-google-calendar-stage10k-inbound-sync-global.cjs` |
| `check:google-calendar-stage10n-auto-pull-call` | `node scripts/check-google-calendar-stage10n-auto-pull-call.cjs` |
| `check:google-calendar-stage11c-reminder-all-day-parity` | `node scripts/check-google-calendar-stage11c-reminder-all-day-parity.cjs` |
| `check:google-calendar-stage11e-no-duplicate-helpers` | `node scripts/check-google-calendar-stage11e-no-duplicate-helpers.cjs` |
| `check:google-calendar-stage11f-bom-duplicate-helper-repair` | `node scripts/check-google-calendar-stage11f-bom-duplicate-helper-repair.cjs` |
| `check:google-calendar-stage11h-code-parity` | `node scripts/check-google-calendar-stage11h-code-parity.cjs` |
| `check:google-calendar-stage11i-guard-compat` | `node scripts/check-google-calendar-stage11i-guard-compat.cjs` |
| `check:google-calendar-stage12-outbound-backfill` | `node scripts/check-google-calendar-stage12-outbound-backfill.cjs` |
| `check:google-calendar-stage12b-runtime-import-hotfix` | `node scripts/check-google-calendar-stage12b-runtime-import-hotfix.cjs` |
| `check:google-calendar-sync-v1-event-wiring` | `node scripts/check-google-calendar-sync-v1-event-wiring.cjs` |
| `check:google-calendar-sync-v1-foundation` | `node scripts/check-google-calendar-sync-v1-foundation.cjs` |
| `check:google-calendar-sync-v1-settings-ui` | `node scripts/check-google-calendar-sync-v1-settings-ui.cjs` |
| `check:hotfix-global-task-action-modal-no-route` | `node scripts/check-hotfix-global-task-action-modal-no-route.cjs` |
| `check:integration-status-copy` | `node scripts/check-integration-status-copy.cjs` |
| `check:lead-service-state-ui` | `node scripts/check-lead-service-state-ui.cjs` |
| `check:lead-to-case-flow` | `node scripts/check-lead-to-case-flow.cjs` |
| `check:no-body-workspace-trust` | `node scripts/check-no-body-workspace-trust.cjs` |
| `check:no-next-step-ui` | `node scripts/check-no-next-step-ui.cjs` |
| `check:p0-api-workspace-scope` | `node scripts/check-p0-api-workspace-scope.cjs` |
| `check:p0-auth-bootstrap-race` | `node scripts/check-p0-auth-bootstrap-race.cjs` |
| `check:p0-plan-access-gating` | `node scripts/check-p0-plan-access-gating.cjs` |
| `check:p0-supabase-rls-schema-confirmation` | `node scripts/check-p0-supabase-rls-schema-confirmation.cjs` |
| `check:p0-today-loader-supabase-api` | `node scripts/check-p0-today-loader-supabase-api.cjs` |
| `check:p0-today-operator-sections` | `node scripts/check-p0-today-operator-sections.cjs` |
| `check:p0-today-stable-rebuild` | `node scripts/check-p0-today-stable-rebuild.cjs` |
| `check:p10-ai-draft-only` | `node scripts/check-p10-ai-draft-only.cjs` |
| `check:p10d-today-stable-rowlink-key` | `node scripts/check-p10d-today-stable-rowlink-key.cjs` |
| `check:p11-ai-drafts-supabase-source` | `node scripts/check-p11-ai-drafts-supabase-source.cjs` |
| `check:p12-admin-full-access-override` | `node scripts/check-p12c-creator-only-access-correction.cjs` |
| `check:p12c-creator-only-access-correction` | `node scripts/check-p12c-creator-only-access-correction.cjs` |
| `check:p13-app-owner-identity-hardening` | `node scripts/check-p13-app-owner-identity-hardening.cjs` |
| `check:p13-digest-pwa-notifications-qa` | `node scripts/check-p13-digest-pwa-notifications-qa.cjs` |
| `check:p14-billing-no-duplicate-badge` | `node scripts/check-p14-billing-no-duplicate-badge.cjs` |
| `check:p14-billing-production-validation` | `node scripts/check-p14-billing-production-validation.cjs` |
| `check:p14-ui-truth-copy-menu` | `node scripts/check-p14-ui-truth-copy-menu.cjs` |
| `check:p15-portal-storage-bucket` | `node scripts/check-p15-portal-storage-bucket.cjs` |
| `check:p7-lead-service-closeout` | `node scripts/check-p7-lead-service-closeout.cjs` |
| `check:p8-portal-secrets-hardening` | `node scripts/check-p8-portal-secrets-hardening.cjs` |
| `check:p9-portal-plaintext-legacy-removed` | `node scripts/check-p9-portal-plaintext-legacy-removed.cjs` |
| `check:plan-access-gating` | `node scripts/check-p0-plan-access-gating.cjs` |
| `check:polish` | `node scripts/check-polish-mojibake.cjs` |
| `check:polish-mojibake` | `node scripts/check-polish-mojibake.cjs` |
| `check:polish-text-global` | `node scripts/check-polish-text-global.cjs` |
| `check:public-security-claims` | `node scripts/check-public-security-claims.cjs` |
| `check:pwa-safe-cache` | `node scripts/check-pwa-safe-cache.cjs` |
| `check:relation-cleanup-today-sync` | `node scripts/check-relation-cleanup-today-toggle-sync.cjs` |
| `check:reminder-runtime` | `node scripts/check-reminder-runtime.cjs` |
| `check:repo-backup-hygiene` | `node tests/repo-backup-folders-not-tracked.test.cjs` |
| `check:service-role-scoped-mutations` | `node scripts/check-service-role-scoped-mutations.cjs` |
| `check:stage02-access-billing-release-evidence` | `node tests/stage02-access-billing-release-evidence.test.cjs` |
| `check:stage03a-api-schema-contract` | `node scripts/check-stage03a-api-schema-contract.cjs` |
| `check:stage03b-system-fallback-boundary` | `node scripts/check-stage03b-system-fallback-boundary.cjs` |
| `check:stage03c-leads-fallback-boundary` | `node scripts/check-stage03c-leads-fallback-boundary.cjs` |
| `check:stage03d-optional-columns-evidence` | `node scripts/check-stage03d-optional-columns-evidence.cjs` |
| `check:stage10c-vercel-hobby-assistant-route-collapse-resilient-v1` | `node scripts/check-stage10c-vercel-hobby-assistant-route-collapse-resilient.cjs` |
| `check:stage11-vercel-hobby-function-budget-guard-v1` | `node scripts/check-stage11-vercel-hobby-function-budget-guard.cjs` |
| `check:stage13-package-json-stage11-12-script-registration-v1` | `node scripts/check-stage13-package-json-stage11-12-script-registration.cjs` |
| `check:stage14-context-action-route-parity-v1` | `node scripts/check-stage14-context-action-route-parity.cjs` |
| `check:stage15-context-action-explicit-trigger-contract-v1` | `node scripts/check-stage15-context-action-explicit-trigger-contract.cjs` |
| `check:stage16-context-action-button-parity-audit-v1` | `node scripts/check-stage16-context-action-button-parity-audit.cjs` |
| `check:stage17-context-action-contract-registry-v1` | `node scripts/check-stage17-context-action-contract-registry.cjs` |
| `check:stage18-context-action-runtime-smoke-v1` | `node scripts/check-stage18-context-action-runtime-smoke.cjs` |
| `check:stage19-context-action-route-map-evidence-v1` | `node scripts/check-stage19-context-action-route-map-evidence.cjs` |
| `check:stage20-context-action-real-button-trigger-audit-v1` | `node scripts/check-stage20-context-action-real-button-trigger-audit.cjs` |
| `check:stage20-context-action-real-button-trigger-v1` | `node scripts/check-stage20-context-action-real-button-trigger.cjs` |
| `check:stage20b-context-action-verify-chain-repair-v1` | `node scripts/check-stage20b-context-action-verify-chain-repair.cjs` |
| `check:stage20c-context-action-verify-chain-stage14-repair-v1` | `node scripts/check-stage20c-context-action-verify-chain-stage14-repair.cjs` |
| `check:stage20d-stage18-smoke-alias-repair-v1` | `node scripts/check-stage20d-stage18-smoke-alias-repair.cjs` |
| `check:stage4-ai-draft-confirm-bridge-v1` | `node scripts/check-stage4-ai-draft-confirm-bridge-v1.cjs` |
| `check:stage49-client-detail-visible-actions` | `node scripts/check-stage49-client-detail-visible-actions.cjs` |
| `check:stage5-ai-read-query-hardening-v1` | `node scripts/check-stage5-ai-read-query-hardening-v1.cjs` |
| `check:stage50-client-detail-edit-header-polish` | `node scripts/check-stage50-client-detail-edit-header-polish.cjs` |
| `check:stage51-clients-case-contrast-hotfix` | `node scripts/check-stage51-clients-case-contrast-hotfix.cjs` |
| `check:stage52-ui-contrast-regression-guard` | `node scripts/check-stage52-ui-contrast-regression-guard.cjs` |
| `check:stage53-client-operational-recent-moves` | `node scripts/check-stage53-client-operational-recent-moves.cjs` |
| `check:stage54-client-cases-compact-fit` | `node scripts/check-stage54-client-cases-compact-fit.cjs` |
| `check:stage55-client-case-operational-pack` | `node scripts/check-stage55-client-case-operational-pack.cjs` |
| `check:stage56-case-quick-actions-dictation-dedupe` | `node scripts/check-stage56-case-quick-actions-dictation-dedupe.cjs` |
| `check:stage57-case-create-action-hub` | `node scripts/check-stage57-case-create-action-hub.cjs` |
| `check:stage58-case-recent-moves-panel` | `node scripts/check-stage58-case-recent-moves-panel.cjs` |
| `check:stage59-case-note-follow-up-prompt` | `node scripts/check-stage59-case-note-follow-up-prompt.cjs` |
| `check:stage5b-package-json-bom-build-gate-v1` | `node scripts/check-stage5b-package-json-bom-build-gate.cjs` |
| `check:stage6-ai-no-hallucination-data-truth-v1` | `node scripts/check-stage6-ai-no-hallucination-data-truth.cjs` |
| `check:stage60-case-action-copy-note-dedupe` | `node scripts/check-stage60-case-action-copy-note-dedupe.cjs` |
| `check:stage61-case-note-action-button-swap` | `node scripts/check-stage61-case-note-action-button-swap.cjs` |
| `check:stage62-case-important-actions-header-note-button-remove` | `node scripts/check-stage62-case-important-actions-header-note-button-remove.cjs` |
| `check:stage63-case-main-note-header-button-remove` | `node scripts/check-stage63-case-main-note-header-button-remove.cjs` |
| `check:stage64-case-detail-work-item-dedupe` | `node scripts/check-stage64-case-detail-work-item-dedupe.cjs` |
| `check:stage65-case-operational-verify-includes-stage64` | `node scripts/check-stage65-case-operational-verify-includes-stage64.cjs` |
| `check:stage66-case-history-passive-copy` | `node scripts/check-stage66-case-history-passive-copy.cjs` |
| `check:stage67-package-json-hygiene` | `node scripts/check-stage67-package-json-hygiene.cjs` |
| `check:stage68p-case-history-package-final` | `node scripts/check-stage68p-case-history-package-final.cjs` |
| `check:stage69f-soft-next-step-after-task-done-path-safe` | `node scripts/check-stage69f-soft-next-step-after-task-done-path-safe.cjs` |
| `check:stage69g-soft-next-step-after-task-done-final` | `node scripts/check-stage69g-soft-next-step-after-task-done-final.cjs` |
| `check:stage69h-soft-next-step-package-final` | `node scripts/check-stage69h-soft-next-step-package-final.cjs` |
| `check:stage6b-stage6-doc-and-gate-repair-v1` | `node scripts/check-stage6b-stage6-doc-and-gate-repair.cjs` |
| `check:stage6d-stage6b-gate-phrase-ascii-repair-v1` | `node scripts/check-stage6d-stage6b-gate-phrase-ascii-repair.cjs` |
| `check:stage7-ai-assistant-query-api-contract-smoke-v1` | `node scripts/check-stage7-ai-assistant-query-api-contract-smoke.cjs` |
| `check:stage70-today-decision-engine-starter` | `node scripts/check-stage70-today-decision-engine-starter.cjs` |
| `check:stage71-ai-draft-only-safety-guard` | `node scripts/check-stage71-ai-draft-only-safety-guard.cjs` |
| `check:stage72-access-billing-plan-truth-guard` | `node scripts/check-stage72-access-billing-plan-truth-guard.cjs` |
| `check:stage73-cumulative-package-guard` | `node scripts/check-stage73-cumulative-package-guard.cjs` |
| `check:stage74-runtime-smoke-contract` | `node scripts/check-stage74-runtime-smoke-contract.cjs` |
| `check:stage75-source-of-truth-guard` | `node scripts/check-stage75-source-of-truth-guard.cjs` |
| `check:stage76-backup-hygiene-guard` | `node scripts/check-stage76-backup-hygiene-guard.cjs` |
| `check:stage77-runtime-evidence-collector` | `node scripts/check-stage77-runtime-evidence-collector.cjs` |
| `check:stage78-failure-snapshot-guard` | `node scripts/check-stage78-failure-snapshot-guard.cjs` |
| `check:stage79-cumulative-manifest-guard` | `node scripts/check-stage79-cumulative-manifest-guard.cjs` |
| `check:stage7b-stage7-payload-copy-repair-v1` | `node scripts/check-stage7b-stage7-payload-copy-repair.cjs` |
| `check:stage8-ai-assistant-ui-contract-client-v1` | `node scripts/check-stage8-ai-assistant-ui-contract-client.cjs` |
| `check:stage80-one-command-result-summary` | `node scripts/check-stage80-one-command-result-summary.cjs` |
| `check:stage81-today-risk-reason-next-action` | `node scripts/check-stage81-today-risk-reason-next-action.cjs` |
| `check:stage82-today-next-7-days` | `node scripts/check-stage82-today-next-7-days.cjs` |
| `check:stage83-task-done-next-step-prompt` | `node scripts/check-stage83-task-done-next-step-prompt.cjs` |
| `check:stage84-lead-detail-work-center` | `node scripts/check-stage84-lead-detail-work-center.cjs` |
| `check:stage84b-lead-detail-polish-hotfix` | `node scripts/check-stage84g-lead-detail-polish-clean-sweep.cjs` |
| `check:stage84c-lead-detail-polish-real-fix` | `node scripts/check-stage84g-lead-detail-polish-clean-sweep.cjs` |
| `check:stage84d-lead-detail-polish-final` | `node scripts/check-stage84f-lead-detail-mojibake-sweep.cjs` |
| `check:stage84e-lead-detail-polish-no-false-success` | `node scripts/check-stage84g-lead-detail-polish-clean-sweep.cjs` |
| `check:stage84f-lead-detail-mojibake-sweep` | `node scripts/check-stage84g-lead-detail-polish-clean-sweep.cjs` |
| `check:stage84g-lead-detail-polish-clean-sweep` | `node scripts/check-stage84g-lead-detail-polish-clean-sweep.cjs` |
| `check:stage84h-lead-detail-guard-clean` | `node scripts/check-stage84h-lead-detail-guard-clean.cjs` |
| `check:stage85-context-action-dialog-unification` | `node scripts/check-stage85-context-action-dialog-unification.cjs` |
| `check:stage85d-context-dialog-finalizer` | `node scripts/check-stage85d-context-dialog-finalizer.cjs` |
| `check:stage86-billing-google-e2e-readiness` | `node scripts/check-stage86-billing-google-e2e-readiness.cjs` |
| `check:stage86-context-action-explicit-triggers` | `node scripts/check-stage86-context-action-explicit-triggers.cjs` |
| `check:stage86b-access-gate-billing-truth` | `node scripts/check-stage86b-access-gate-billing-truth.cjs` |
| `check:stage86d-access-gate-block-call` | `node scripts/check-stage86d-access-gate-block-call.cjs` |
| `check:stage86k-billing-workspace-resolution` | `node scripts/check-stage86k-billing-workspace-resolution.cjs` |
| `check:stage86m-billing-google-regression-suite` | `node scripts/check-stage86m-billing-google-regression-suite.cjs` |
| `check:stage86o-stripe-card-only-safe-patch` | `node scripts/check-stage86o-stripe-card-only-safe-patch.cjs` |
| `check:stage88-lead-admin-feedback-hotfix` | `node scripts/check-stage88-lead-admin-feedback-hotfix.cjs` |
| `check:stage89-right-rail-export-clear` | `node scripts/check-stage89-right-rail-export-clear.cjs` |
| `check:stage89c-manual-acceptance` | `node scripts/check-stage89c-manual-acceptance.cjs` |
| `check:stage9-ai-assistant-ui-smoke-prompts-v1` | `node scripts/check-stage9-ai-assistant-ui-smoke-prompts.cjs` |
| `check:stage90-env-portal-button-qa` | `node scripts/check-stage90-env-portal-button-qa.cjs` |
| `check:stage90d-live-smoke-runner` | `node scripts/check-stage90d-live-smoke-runner.cjs` |
| `check:stage92-work-items-date-contract` | `node scripts/check-stage92-work-items-date-contract.cjs` |
| `check:task-edit-reminder-week-calendar` | `node scripts/check-task-edit-reminder-and-week-calendar.cjs` |
| `check:task-event-contract` | `node scripts/check-task-event-contract.cjs` |
| `check:today-client-ui-cleanup` | `node scripts/check-today-week-client-more-ui-text-cleanup.cjs` |
| `check:today-command-center` | `node scripts/check-today-command-center.cjs` |
| `check:today-event-client-cleanup` | `node scripts/check-today-tiles-event-edit-client-cleanup.cjs` |
| `check:ui-developer-copy-paid-readiness` | `node scripts/check-ui-developer-copy-paid-readiness.cjs` |
| `check:ui-truth` | `node scripts/check-ui-truth-claims.cjs` |
| `check:ui-truth-copy` | `node scripts/check-ui-truth-copy.cjs` |
| `check:vercel-hobby-function-budget` | `node scripts/check-vercel-hobby-function-budget.cjs` |
| `check:vercel-hobby-function-budget-rule-doc` | `node scripts/check-vercel-hobby-function-budget-rule-doc.cjs` |
| `check:visual-html-theme-v14` | `node scripts/check-visual-html-theme-v14.cjs` |
| `check:visual-stage01-shell` | `node scripts/check-visual-stage01-shell.cjs` |
| `check:visual-stage02-today` | `node scripts/check-visual-stage02-today.cjs` |
| `check:visual-stage03-leads` | `node scripts/check-visual-stage03-leads.cjs` |
| `check:visual-stage04-lead-detail` | `node scripts/check-visual-stage04-lead-detail.cjs` |
| `check:visual-stage05-clients` | `node scripts/check-visual-stage05-clients.cjs` |
| `check:visual-stage06-client-detail` | `node scripts/check-visual-stage06-client-detail.cjs` |
| `check:visual-stage07-cases` | `node scripts/check-visual-stage07-cases.cjs` |
| `check:visual-stage08-case-detail` | `node scripts/check-visual-stage08-case-detail.cjs` |
| `check:visual-stage16-today-html-reset` | `node scripts/check-visual-stage16-today-html-reset.cjs` |
| `check:visual-stage17-today-hard-1to1` | `node scripts/check-visual-stage17-today-hard-1to1.cjs` |
| `check:visual-stage18-leads-hard-1to1` | `node scripts/check-visual-stage18-leads-hard-1to1.cjs` |
| `check:workspace-scope` | `node scripts/check-workspace-scope.cjs` |
| `lint` | `node scripts/check-a13-critical-regressions.cjs && node scripts/check-visual-stage18-leads-hard-1to1.cjs && node scripts/check-visual-stage17-today-hard-1to1.cjs && node scripts/check-visual-stage16-today-html-reset.cjs && node scripts/check-visual-html-theme-v14.cjs && node scripts/check-visual-stage08-case-detail.cjs && node scripts/check-visual-stage07-cases.cjs && node scripts/check-visual-stage06-client-detail.cjs && node scripts/check-visual-stage05-clients.cjs && node scripts/check-visual-stage04-lead-detail.cjs && node scripts/check-visual-stage03-leads.cjs && node scripts/check-visual-stage02-today.cjs && node scripts/check-visual-stage01-shell.cjs && node scripts/check-relation-cleanup-today-toggle-sync.cjs && node scripts/check-today-tiles-event-edit-client-cleanup.cjs && node scripts/check-today-week-client-more-ui-text-cleanup.cjs && node scripts/check-task-edit-reminder-and-week-calendar.cjs && node scripts/check-client-inline-edit-and-task-edit.cjs && node scripts/check-task-event-contract.cjs && node scripts/check-data-contract-stage-a1.cjs && node scripts/check-data-contract-stage-a2.cjs && node scripts/check-polish-mojibake.cjs && node scripts/check-access-billing-source-of-truth-stage02a.cjs && tsc --noEmit && npm.cmd run check:repo-backup-hygiene` |
| `test` | `node scripts/run-tests-compact.cjs` |
| `test:admin-backend-guard` | `node --test tests/admin-backend-guard.test.cjs` |
| `test:admin-click-to-annotate` | `node --test tests/admin-click-to-annotate.test.cjs` |
| `test:admin-dialog-drag-lower` | `node --test tests/admin-dialog-drag-lower.test.cjs` |
| `test:admin-dialog-stack-fix` | `node --test tests/admin-dialog-stack-fix.test.cjs` |
| `test:admin-quick-editor-portal-drag` | `node --test tests/admin-quick-editor-portal-drag.test.cjs` |
| `test:admin-review-mode-compat` | `node --test tests/admin-review-mode-compat.test.cjs` |
| `test:admin-toolbar-utf8-portal-force` | `node --test tests/admin-toolbar-utf8-portal-force.test.cjs` |
| `test:admin-tools` | `node --test tests/admin-tools.test.cjs` |
| `test:assistant-no-autowrite` | `node --test tests/assistant-no-autowrite.test.cjs` |
| `test:assistant-operator-context` | `node --test tests/assistant-operator-context.test.cjs` |
| `test:billing-checkout` | `node --test tests/billing-checkout.test.cjs` |
| `test:billing-webhook` | `node --test tests/billing-webhook.test.cjs` |
| `test:button-action-map` | `node --test tests/button-action-map.test.cjs` |
| `test:compact` | `node scripts/run-tests-compact.cjs` |
| `test:critical` | `node scripts/run-tests-compact.cjs --critical` |
| `test:data-contract-normalization` | `node --test tests/data-contract-normalization.test.cjs` |
| `test:digest-email` | `node --test tests/digest-email.test.cjs` |
| `test:draft-confirmation-flow` | `node --test tests/draft-confirmation-flow.test.cjs` |
| `test:faza2-etap21-workspace-isolation` | `node --test tests/faza2-etap21-workspace-isolation.test.cjs` |
| `test:faza2-etap22-rls-backend-security-proof` | `node --test tests/faza2-etap22-rls-backend-security-proof.test.cjs` |
| `test:faza3-etap31-plan-source-of-truth` | `node --test tests/faza3-etap31-plan-source-of-truth.test.cjs` |
| `test:faza3-etap32-plan-feature-access-gate` | `node --test tests/faza3-etap32-plan-feature-access-gate.test.cjs` |
| `test:faza3-etap32b-plan-visibility-contract` | `node --test tests/faza3-etap32b-plan-visibility-contract.test.cjs` |
| `test:faza3-etap32c-access-gate-runtime-hotfix-v3` | `node --test tests/faza3-etap32c-access-gate-runtime-hotfix-v3.test.cjs` |
| `test:faza3-etap32d-plan-based-ui-visibility` | `node --test tests/faza3-etap32d-plan-based-ui-visibility.test.cjs` |
| `test:faza3-etap32e-settings-digest-billing-visibility-smoke` | `node --test tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs` |
| `test:faza3-etap32f-backend-entity-limits-smoke` | `node --test tests/faza3-etap32f-backend-entity-limits-smoke.test.cjs` |
| `test:faza3-etap32g-ai-draft-cancel-smoke` | `node --test tests/faza3-etap32g-ai-draft-cancel-smoke.test.cjs` |
| `test:faza3-etap32h-lead-limit-placement-hotfix` | `node --test tests/faza3-etap32h-lead-limit-placement-hotfix.test.cjs` |
| `test:faza4-etap41-data-contract-map` | `node --test tests/faza4-etap41-data-contract-map.test.cjs` |
| `test:faza4-etap42-task-event-contract-normalization` | `node --test tests/faza4-etap42-task-event-contract-normalization.test.cjs` |
| `test:faza4-etap43-critical-crud-smoke` | `node --test tests/faza4-etap43-critical-crud-smoke.test.cjs` |
| `test:faza4-etap44a-live-refresh-mutation-bus` | `node --test tests/faza4-etap44a-live-refresh-mutation-bus.test.cjs` |
| `test:faza4-etap44b-today-live-refresh-import-hotfix` | `node --test tests/faza4-etap44b-today-live-refresh-import-hotfix.test.cjs` |
| `test:faza4-etap44b-today-live-refresh-listener` | `node --test tests/faza4-etap44b-today-live-refresh-listener.test.cjs` |
| `test:faza4-etap44c-mutation-bus-coverage-smoke` | `node --test tests/faza4-etap44c-mutation-bus-coverage-smoke.test.cjs` |
| `test:faza5-etap51-ai-read-vs-draft-intent` | `node --test tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs` |
| `test:google-calendar-gating` | `node --test tests/google-calendar-gating.test.cjs` |
| `test:google-calendar-sync-contract` | `node --test tests/google-calendar-sync-contract.test.cjs` |
| `test:hotfix-global-task-action-modal-no-route` | `node --test tests/hotfix-global-task-action-modal-no-route.test.cjs` |
| `test:lead-service-state-ui` | `node --test tests/lead-service-state-ui.test.cjs` |
| `test:lead-to-case-flow` | `node --test tests/lead-to-case-flow.test.cjs` |
| `test:nearest-action` | `node --test tests/nearest-action.test.cjs` |
| `test:plan-access-gating` | `node --test tests/plan-access-gating.test.cjs` |
| `test:pwa-safe-cache` | `node --test tests/pwa-safe-cache.test.cjs` |
| `test:raw` | `node --test "tests/**/*.test.cjs"` |
| `test:reminder-runtime` | `node --test tests/reminder-runtime.test.cjs` |
| `test:reminder-snooze` | `node --test tests/reminder-snooze.test.cjs` |
| `test:route-smoke` | `node --test tests/route-smoke.test.cjs` |
| `test:service-role-scoped-mutations` | `node --test tests/service-role-scoped-mutations.test.cjs` |
| `test:stage03a-api-schema-contract` | `node --test tests/stage03a-api-schema-contract.test.cjs` |
| `test:stage03b-system-fallback-boundary` | `node --test tests/stage03b-system-fallback-boundary.test.cjs` |
| `test:stage03c-leads-fallback-boundary` | `node --test tests/stage03c-leads-fallback-boundary.test.cjs` |
| `test:stage03d-optional-columns-evidence` | `node --test tests/stage03d-optional-columns-evidence.test.cjs` |
| `test:stage10c-vercel-hobby-assistant-route-collapse-resilient-v1` | `node --test tests/stage10c-vercel-hobby-assistant-route-collapse-resilient.test.cjs` |
| `test:stage11-vercel-hobby-function-budget-guard-v1` | `node --test tests/stage11-vercel-hobby-function-budget-guard.test.cjs` |
| `test:stage12-ai-assistant-vercel-release-evidence-v1` | `node --test tests/stage12-ai-assistant-vercel-release-evidence.test.cjs` |
| `test:stage13-package-json-stage11-12-script-registration-v1` | `node --test tests/stage13-package-json-stage11-12-script-registration.test.cjs` |
| `test:stage14-context-action-route-parity-v1` | `node --test tests/stage14-context-action-route-parity.test.cjs` |
| `test:stage15-context-action-explicit-trigger-contract-v1` | `node --test tests/stage15-context-action-explicit-trigger-contract.test.cjs` |
| `test:stage16-context-action-button-parity-audit-v1` | `node --test tests/stage16-context-action-button-parity-audit.test.cjs` |
| `test:stage17-context-action-contract-registry-v1` | `node --test tests/stage17-context-action-contract-registry.test.cjs` |
| `test:stage18-context-action-runtime-smoke-v1` | `node --test tests/stage18-context-action-runtime-smoke.test.cjs` |
| `test:stage19-context-action-route-map-evidence-v1` | `node --test tests/stage19-context-action-route-map-evidence.test.cjs` |
| `test:stage20-context-action-real-button-trigger-audit-v1` | `node --test tests/stage20-context-action-real-button-trigger-audit.test.cjs` |
| `test:stage20-context-action-real-button-trigger-v1` | `node --test tests/stage20-context-action-real-button-trigger.test.cjs` |
| `test:stage20b-context-action-verify-chain-repair-v1` | `node --test tests/stage20b-context-action-verify-chain-repair.test.cjs` |
| `test:stage20c-context-action-verify-chain-stage14-repair-v1` | `node --test tests/stage20c-context-action-verify-chain-stage14-repair.test.cjs` |
| `test:stage20d-stage18-smoke-alias-repair-v1` | `node --test tests/stage20d-stage18-smoke-alias-repair.test.cjs` |
| `test:stage4-ai-draft-confirm-bridge-v1` | `node --test tests/stage4-ai-draft-confirm-bridge-v1.test.cjs` |
| `test:stage5-ai-read-query-hardening-v1` | `node --test tests/stage5-ai-read-query-hardening-v1.test.cjs` |
| `test:stage50-client-detail-edit-header-polish` | `node --test tests/stage50-client-detail-edit-header-polish.test.cjs` |
| `test:stage52-ui-contrast-regression-guard` | `node --test tests/stage52-ui-contrast-regression-guard.test.cjs` |
| `test:stage53-client-operational-recent-moves` | `node --test tests/stage53-client-operational-recent-moves.test.cjs` |
| `test:stage54-client-cases-compact-fit` | `node --test tests/stage54-client-cases-compact-fit.test.cjs` |
| `test:stage55-client-case-operational-pack` | `node --test tests/stage55-client-case-operational-pack.test.cjs` |
| `test:stage56-case-quick-actions-dictation-dedupe` | `node --test tests/stage56-case-quick-actions-dictation-dedupe.test.cjs` |
| `test:stage57-case-create-action-hub` | `node --test tests/stage57-case-create-action-hub.test.cjs` |
| `test:stage58-case-recent-moves-panel` | `node --test tests/stage58-case-recent-moves-panel.test.cjs` |
| `test:stage59-case-note-follow-up-prompt` | `node --test tests/stage59-case-note-follow-up-prompt.test.cjs` |
| `test:stage5b-package-json-bom-build-gate-v1` | `node --test tests/stage5b-package-json-bom-build-gate.test.cjs` |
| `test:stage6-ai-no-hallucination-data-truth-v1` | `node --test tests/stage6-ai-no-hallucination-data-truth.test.cjs` |
| `test:stage60-case-action-copy-note-dedupe` | `node --test tests/stage60-case-action-copy-note-dedupe.test.cjs` |
| `test:stage61-case-note-action-button-swap` | `node --test tests/stage61-case-note-action-button-swap.test.cjs` |
| `test:stage62-case-important-actions-header-note-button-remove` | `node --test tests/stage62-case-important-actions-header-note-button-remove.test.cjs` |
| `test:stage63-case-main-note-header-button-remove` | `node --test tests/stage63-case-main-note-header-button-remove.test.cjs` |
| `test:stage64-case-detail-work-item-dedupe` | `node --test tests/stage64-case-detail-work-item-dedupe.test.cjs` |
| `test:stage65-case-operational-verify-includes-stage64` | `node --test tests/stage65-case-operational-verify-includes-stage64.test.cjs` |
| `test:stage66-case-history-passive-copy` | `node --test tests/stage66-case-history-passive-copy.test.cjs` |
| `test:stage67-package-json-hygiene` | `node --test tests/stage67-package-json-hygiene.test.cjs` |
| `test:stage68p-case-history-package-final` | `node --test tests/stage68p-case-history-package-final.test.cjs` |
| `test:stage69f-soft-next-step-after-task-done-path-safe` | `node --test tests/stage69f-soft-next-step-after-task-done-path-safe.test.cjs` |
| `test:stage69g-soft-next-step-after-task-done-final` | `node --test tests/stage69g-soft-next-step-after-task-done-final.test.cjs` |
| `test:stage69h-soft-next-step-package-final` | `node --test tests/stage69h-soft-next-step-package-final.test.cjs` |
| `test:stage6b-stage6-doc-and-gate-repair-v1` | `node --test tests/stage6b-stage6-doc-and-gate-repair.test.cjs` |
| `test:stage6d-stage6b-gate-phrase-ascii-repair-v1` | `node --test tests/stage6d-stage6b-gate-phrase-ascii-repair.test.cjs` |
| `test:stage7-ai-assistant-query-api-contract-smoke-v1` | `node --test tests/stage7-ai-assistant-query-api-contract-smoke.test.cjs` |
| `test:stage7b-stage7-payload-copy-repair-v1` | `node --test tests/stage7b-stage7-payload-copy-repair.test.cjs` |
| `test:stage8-ai-assistant-ui-contract-client-v1` | `node --test tests/stage8-ai-assistant-ui-contract-client.test.cjs` |
| `test:stage84-lead-detail-work-center` | `node --test tests/stage84-lead-detail-work-center.test.cjs` |
| `test:stage84g-lead-detail-polish-clean-sweep` | `node --test tests/stage84g-lead-detail-polish-clean-sweep.test.cjs` |
| `test:stage84h-lead-detail-guard-clean` | `node --test tests/stage84h-lead-detail-guard-clean.test.cjs` |
| `test:stage85-context-action-dialog-unification` | `node --test tests/stage85-context-action-dialog-unification.test.cjs` |
| `test:stage85d-context-dialog-finalizer` | `node --test tests/stage85d-context-dialog-finalizer.test.cjs` |
| `test:stage86-billing-google-e2e-readiness` | `node --test tests/stage86-billing-google-e2e-readiness.test.cjs` |
| `test:stage86-context-action-explicit-triggers` | `node --test tests/stage86-context-action-explicit-triggers.test.cjs` |
| `test:stage86b-access-gate-billing-truth` | `node --test tests/stage86b-access-gate-billing-truth.test.cjs` |
| `test:stage86d-access-gate-block-call` | `node --test tests/stage86d-access-gate-block-call.test.cjs` |
| `test:stage86k-billing-workspace-resolution` | `node --test tests/stage86k-billing-workspace-resolution.test.cjs` |
| `test:stage86m-billing-google-regression-suite` | `node --test tests/stage86m-billing-google-regression-suite.test.cjs` |
| `test:stage86o-stripe-card-only-safe-patch` | `node --test tests/stage86o-stripe-card-only-safe-patch.test.cjs` |
| `test:stage87-p0-workspace-security-hardening` | `node --test tests/stage87-p0-workspace-security-hardening.test.cjs` |
| `test:stage88-lead-admin-feedback-hotfix` | `node --test tests/stage88-lead-admin-feedback-hotfix.test.cjs` |
| `test:stage88-schema-contract-finance-baseline` | `node --test tests/stage88-schema-contract-finance-baseline.test.cjs` |
| `test:stage89-right-rail-export-clear` | `node --test tests/stage89-right-rail-export-clear.test.cjs` |
| `test:stage89c-manual-acceptance` | `node --test tests/stage89c-manual-acceptance.test.cjs` |
| `test:stage9-ai-assistant-ui-smoke-prompts-v1` | `node --test tests/stage9-ai-assistant-ui-smoke-prompts.test.cjs` |
| `test:stage90-env-portal-button-qa` | `node --test tests/stage90-env-portal-button-qa.test.cjs` |
| `test:stage90d-live-smoke-runner` | `node --test tests/stage90d-live-smoke-runner.test.cjs` |
| `test:stage92-work-items-date-contract` | `node --test tests/stage92-work-items-date-contract.test.cjs` |
| `test:today-sections` | `node scripts/_build-today-sections-test-module.cjs && node --test tests/today-sections.test.cjs` |
| `test:ui-developer-copy-paid-readiness` | `node --test tests/ui-developer-copy-paid-readiness.test.cjs` |
| `test:ui-truth-copy` | `node --test tests/ui-truth-copy.test.cjs` |
| `test:workspace-isolation` | `node --test tests/workspace-isolation.test.cjs` |
| `verify:admin-tools` | `npm.cmd run check:admin-debug-toolbar && npm.cmd run check:admin-review-mode && npm.cmd run check:admin-button-matrix && npm.cmd run check:admin-feedback-export && npm.cmd run test:admin-tools && npm.cmd run check:admin-dialog-drag-lower && npm.cmd run test:admin-dialog-drag-lower && npm.cmd run check:admin-dialog-stack-fix && npm.cmd run test:admin-dialog-stack-fix && npm.cmd run check:admin-click-to-annotate && npm.cmd run test:admin-click-to-annotate && npm.cmd run test:admin-review-mode-compat && npm.cmd run check:admin-quick-editor-portal-drag && npm.cmd run test:admin-quick-editor-portal-drag && npm.cmd run check:admin-toolbar-utf8-portal-force && npm.cmd run test:admin-toolbar-utf8-portal-force && npm.cmd run check:stage88-lead-admin-feedback-hotfix && npm.cmd run test:stage88-lead-admin-feedback-hotfix && npm.cmd run check:stage89-right-rail-export-clear && npm.cmd run test:stage89-right-rail-export-clear` |
| `verify:architecture:supabase-first` | `node scripts/check-supabase-first-architecture.cjs` |
| `verify:auth:supabase-stage01` | `node scripts/check-stage01-supabase-auth.cjs` |
| `verify:case-create-flow` | `npm.cmd run check:stage56-case-quick-actions-dictation-dedupe && npm.cmd run check:stage57-case-create-action-hub` |
| `verify:case-operational-ui` | `npm.cmd run check:stage56-case-quick-actions-dictation-dedupe && npm.cmd run check:stage57-case-create-action-hub && npm.cmd run check:stage58-case-recent-moves-panel && npm.cmd run check:stage59-case-note-follow-up-prompt && npm.cmd run check:stage60-case-action-copy-note-dedupe && npm.cmd run check:stage61-case-note-action-button-swap && npm.cmd run check:stage62-case-important-actions-header-note-button-remove && npm.cmd run check:stage63-case-main-note-header-button-remove && npm.cmd run verify:client-detail-operational-ui && npm.cmd run verify:ui-contrast && npm.cmd run check:stage64-case-detail-work-item-dedupe && npm.cmd run check:stage66-case-history-passive-copy && npm.cmd run check:stage68p-case-history-package-final && npm.cmd run check:stage69h-soft-next-step-package-final` |
| `verify:client-acquisition-history-only` | `node scripts/verify-client-acquisition-history-only.mjs` |
| `verify:client-detail-operational-ui` | `npm.cmd run check:stage53-client-operational-recent-moves && npm.cmd run check:stage54-client-cases-compact-fit && npm.cmd run check:stage55-client-case-operational-pack && npm.cmd run verify:ui-contrast` |
| `verify:closeflow` | `node scripts/closeflow-release-check.cjs` |
| `verify:closeflow:quiet` | `node scripts/closeflow-release-check-quiet.cjs` |
| `verify:data-contract-stage05` | `node scripts/check-stage05-supabase-data-contract.cjs` |
| `verify:global-task-unified-modal` | `node scripts/verify-global-task-unified-modal.mjs` |
| `verify:migrations:supabase` | `node scripts/check-supabase-migrations-guard.cjs` |
| `verify:security:firebase-stage03` | `node scripts/check-stage03-firebase-legacy-lockdown.cjs` |
| `verify:security:gemini-client` | `node scripts/verify-no-client-gemini-secret.cjs` |
| `verify:security:server-only-secrets` | `node scripts/verify-server-only-secrets.cjs` |
| `verify:stage11-stage12-ai-vercel-evidence` | `npm.cmd run check:stage11-vercel-hobby-function-budget-guard-v1 && npm.cmd run test:stage11-vercel-hobby-function-budget-guard-v1 && npm.cmd run audit:stage12-ai-assistant-vercel-release-evidence && npm.cmd run test:stage12-ai-assistant-vercel-release-evidence-v1` |
| `verify:stage14-action-route-parity` | `npm.cmd run check:stage14-context-action-route-parity-v1 && npm.cmd run test:stage14-context-action-route-parity-v1` |
| `verify:stage14-context-action-route-parity` | `npm.cmd run check:stage14-context-action-route-parity-v1 && npm.cmd run test:stage14-context-action-route-parity-v1` |
| `verify:stage15-context-action-contract` | `npm.cmd run verify:stage14-action-route-parity && npm.cmd run check:stage15-context-action-explicit-trigger-contract-v1 && npm.cmd run test:stage15-context-action-explicit-trigger-contract-v1` |
| `verify:stage16-context-action-button-parity` | `npm.cmd run audit:stage16-context-action-button-parity && npm.cmd run check:stage16-context-action-button-parity-audit-v1 && npm.cmd run test:stage16-context-action-button-parity-audit-v1` |
| `verify:stage17-context-action-contract-registry` | `npm.cmd run check:stage17-context-action-contract-registry-v1 && npm.cmd run test:stage17-context-action-contract-registry-v1` |
| `verify:stage18-context-action-runtime-smoke` | `npm.cmd run verify:stage17-context-action-contract-registry && npm.cmd run audit:stage18-context-action-runtime-smoke && npm.cmd run check:stage18-context-action-runtime-smoke-v1 && npm.cmd run test:stage18-context-action-runtime-smoke-v1` |
| `verify:stage19-context-action-route-map` | `npm.cmd run audit:stage19-context-action-route-map && npm.cmd run check:stage19-context-action-route-map-evidence-v1 && npm.cmd run test:stage19-context-action-route-map-evidence-v1` |
| `verify:stage19-context-action-route-map-evidence` | `npm.cmd run audit:stage19-context-action-route-map-evidence && npm.cmd run check:stage19-context-action-route-map-evidence-v1 && npm.cmd run test:stage19-context-action-route-map-evidence-v1` |
| `verify:stage20-context-action-real-button-trigger` | `npm.cmd run audit:stage20-context-action-real-button-trigger && npm.cmd run check:stage20-context-action-real-button-trigger-v1 && npm.cmd run test:stage20-context-action-real-button-trigger-v1` |
| `verify:stage20-context-action-real-button-triggers` | `npm.cmd run audit:stage20-context-action-real-button-triggers && npm.cmd run check:stage20-context-action-real-button-trigger-audit-v1 && npm.cmd run test:stage20-context-action-real-button-trigger-audit-v1` |
| `verify:stage20c-context-action-verify-chain-stage14-repair` | `npm.cmd run check:stage20c-context-action-verify-chain-stage14-repair-v1 && npm.cmd run test:stage20c-context-action-verify-chain-stage14-repair-v1` |
| `verify:stage20d-stage18-smoke-alias-repair` | `npm run check:stage20d-stage18-smoke-alias-repair-v1 && npm run test:stage20d-stage18-smoke-alias-repair-v1` |
| `verify:stage70-82-cumulative` | `node scripts/verify-stage70-82-cumulative.cjs` |
| `verify:stage83-task-next-step` | `npm.cmd run check:stage83-task-done-next-step-prompt && npm.cmd run build` |
| `verify:stage86-billing-google-hardening` | `npm.cmd run check:stage86m-billing-google-regression-suite && npm.cmd run test:stage86m-billing-google-regression-suite && npm.cmd run check:stage86k-billing-workspace-resolution && npm.cmd run test:stage86k-billing-workspace-resolution && npm.cmd run check:p14-billing-production-validation && npm.cmd run check:stage86b-access-gate-billing-truth && npm.cmd run check:stage86d-access-gate-block-call && npm.cmd run check:stage86o-stripe-card-only-safe-patch && npm.cmd run test:stage86o-stripe-card-only-safe-patch` |
| `verify:stage89-accepted` | `npm.cmd run check:stage89c-manual-acceptance && npm.cmd run test:stage89c-manual-acceptance && npm.cmd run verify:admin-tools` |
| `verify:stage90-env-portal-button-qa` | `npm.cmd run stage90:write-env-smoke-evidence && npm.cmd run check:stage90-env-portal-button-qa && npm.cmd run test:stage90-env-portal-button-qa` |
| `verify:stage90d-smoke-runner` | `npm.cmd run verify:stage90-env-portal-button-qa && npm.cmd run check:stage90d-live-smoke-runner && npm.cmd run test:stage90d-live-smoke-runner` |
| `verify:task-reminders` | `node scripts/verify-task-reminders.mjs` |
| `verify:tasks-compact-stage48` | `node scripts/verify-tasks-compact-stage48.mjs` |
| `verify:tasks-header-cleanup` | `node scripts/verify-tasks-header-cleanup.mjs` |
| `verify:tasks-visible-actions-stage47` | `node scripts/verify-tasks-visible-actions-stage47.mjs` |
| `verify:ui-contrast` | `npm.cmd run check:stage49-client-detail-visible-actions && npm.cmd run check:stage50-client-detail-edit-header-polish && npm.cmd run check:stage51-clients-case-contrast-hotfix && npm.cmd run check:stage52-ui-contrast-regression-guard` |

### Checki wymagane przez gate, ale niewykryte w package.json

- brak

---

## 3. Wyniki uruchomionych checków

| Script | Status | Exit code | Czas |
|---|---:|---:|---:|
| `build` | PASS | 0 | 13.9s |
| `verify:closeflow:quiet` | FAIL | 1 | 21.1s |
| `test:critical` | FAIL | 1 | 0.7s |
| `check:polish-mojibake` | PASS | 0 | 0.4s |
| `check:ui-truth-copy` | PASS | 0 | 0.4s |
| `check:workspace-scope` | PASS | 0 | 0.4s |
| `check:plan-access-gating` | FAIL | 1 | 0.4s |
| `check:assistant-operator-v1` | PASS | 0 | 0.4s |
| `check:pwa-safe-cache` | PASS | 0 | 0.4s |
| `test:route-smoke` | PASS | 0 | 0.5s |
| `test:button-action-map` | PASS | 0 | 0.4s |
| `check:button-action-map` | PASS | 0 | 0.4s |

### Wynik builda

| Pole | Wartość |
|---|---|
| Build script present | tak |
| Build result | PASS |

---

## 4. Env matrix bez sekretów

Statusy:
- `SET_IN_PROCESS` — zmienna ustawiona w procesie uruchomienia,
- `PRESENT_IN_ENV_FILE` — zmienna istnieje z wartością w pliku env repo,
- `EXAMPLE_ONLY` — zmienna jest tylko w przykładzie/template,
- `MISSING` — brak wykrycia.

| Env key | Obszar | Status | Źródła | Notatka |
|---|---|---|---|---|
| `APP_URL` | release/app | EXAMPLE_ONLY | .env.example | Publiczny URL aplikacji, używany w linkach i callbackach. |
| `RELEASE_PREVIEW_URL` | release/app | MISSING | - | Opcjonalny jawny URL preview do raportu release. |
| `VERCEL_URL` | release/app | EXAMPLE_ONLY | .env.example | URL deploymentu Vercel, zwykle ustawiany automatycznie. |
| `VITE_SUPABASE_URL` | data/auth | EXAMPLE_ONLY | .env.example | Frontend Supabase URL. |
| `VITE_SUPABASE_ANON_KEY` | data/auth | EXAMPLE_ONLY | .env.example | Frontend Supabase anon key. |
| `SUPABASE_URL` | data/auth | EXAMPLE_ONLY | .env.example | Backend Supabase URL. |
| `SUPABASE_ANON_KEY` | data/auth | EXAMPLE_ONLY | .env.example | Backend Supabase anon key, jeśli używany. |
| `SUPABASE_SERVICE_ROLE_KEY` | data/auth | EXAMPLE_ONLY | .env.example | Backend service role key, tylko server-side. |
| `VITE_FIREBASE_API_KEY` | auth | MISSING | - | Firebase auth frontend, jeśli używany. |
| `VITE_FIREBASE_AUTH_DOMAIN` | auth | MISSING | - | Firebase auth domain, jeśli używany. |
| `VITE_FIREBASE_PROJECT_ID` | auth | MISSING | - | Firebase project id, jeśli używany. |
| `STRIPE_SECRET_KEY` | billing | EXAMPLE_ONLY | .env.example | Stripe server key do checkoutu. |
| `STRIPE_WEBHOOK_SECRET` | billing | EXAMPLE_ONLY | .env.example | Stripe webhook signing secret. |
| `VITE_STRIPE_PUBLISHABLE_KEY` | billing | MISSING | - | Stripe publishable key dla frontu, jeśli używany. |
| `STRIPE_PRICE_ID_BASIC` | billing | MISSING | - | Price ID planu Basic, jeśli używany. |
| `STRIPE_PRICE_ID_PRO` | billing | MISSING | - | Price ID planu Pro, jeśli używany. |
| `STRIPE_PRICE_ID_AI` | billing | MISSING | - | Price ID planu AI, jeśli używany. |
| `RESEND_API_KEY` | mail/digest | EXAMPLE_ONLY | .env.example | Mail provider. Bez tego digest może przejść logikę, ale nie wyśle maila. |
| `DIGEST_FROM_EMAIL` | mail/digest | EXAMPLE_ONLY | .env.example | Adres nadawcy digestu. |
| `CRON_SECRET` | mail/digest | EXAMPLE_ONLY | .env.example | Sekret chroniący endpointy cron. |
| `DIGEST_ENFORCE_WORKSPACE_HOUR` | mail/digest | MISSING | - | Wymuszanie godziny workspace dla digestu. |
| `AI_ENABLED` | ai | MISSING | - | Włączenie/wyłączenie AI. |
| `AI_PRIMARY_PROVIDER` | ai | MISSING | - | Primary provider AI, np. gemini. |
| `GEMINI_API_KEY` | ai | SET_IN_PROCESS | .env.example | Gemini key, jeśli AI używa Gemini. |
| `GEMINI_MODEL` | ai | MISSING | - | Model Gemini. |
| `AI_FALLBACK_PROVIDER` | ai | MISSING | - | Fallback provider AI. |
| `CLOUDFLARE_ACCOUNT_ID` | ai | MISSING | - | Cloudflare Workers AI account. |
| `CLOUDFLARE_API_TOKEN` | ai | MISSING | - | Cloudflare Workers AI token. |
| `CLOUDFLARE_AI_MODEL` | ai | MISSING | - | Cloudflare Workers AI model. |
| `GOOGLE_CLIENT_ID` | google-calendar | MISSING | - | OAuth Google Calendar, jeśli sync jest aktywny. |
| `GOOGLE_CLIENT_SECRET` | google-calendar | MISSING | - | OAuth Google Calendar secret. |
| `GOOGLE_REDIRECT_URI` | google-calendar | MISSING | - | OAuth Google Calendar callback. |
| `CLOSEFLOW_ADMIN_EMAILS` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `CLOSEFLOW_APP_OWNER_UIDS` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `CLOSEFLOW_SERVER_ADMIN_EMAILS` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `CLOSEFLOW_SERVER_APP_OWNER_UIDS` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `PORTAL_SESSION_SECRET` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `PORTAL_STORAGE_HEALTH_SECRET` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `PORTAL_TOKEN_PEPPER` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `PORTAL_UPLOAD_ALLOWED_MIME_TYPES` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `PORTAL_UPLOAD_MAX_BYTES` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `STRIPE_PRICE_AI_MONTHLY` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `STRIPE_PRICE_AI_MONTHLY_PLN` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `STRIPE_PRICE_AI_YEARLY_PLN` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `STRIPE_PRICE_BASIC_MONTHLY` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `STRIPE_PRICE_BASIC_MONTHLY_PLN` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `STRIPE_PRICE_BASIC_YEARLY_PLN` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `STRIPE_PRICE_PRO_MONTHLY` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `STRIPE_PRICE_PRO_MONTHLY_PLN` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `STRIPE_PRICE_PRO_YEARLY_PLN` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `SUPABASE_PORTAL_BUCKET` | extra | EXAMPLE_ONLY | .env.example | Znalezione w plikach env repo. |
| `VITE_AI_USAGE_UNLIMITED` | extra | PRESENT_IN_ENV_FILE | .env.local | Znalezione w plikach env repo. |

---

## 5. Znane ograniczenia release candidate

- Preview URL nie został wykryty automatycznie. Podaj go przez --preview-url albo RELEASE_PREVIEW_URL.
- Jeśli Google Calendar sync jest w zakresie release, brak GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET oznacza brak pełnego testu OAuth/sync.
- Wartości sekretów nie są drukowane. Raport pokazuje tylko status obecności kluczy i nazwy źródeł.
- Commit hash w pliku markdown jest snapshotem z chwili uruchomienia. Najświeższy dowód dla audytora daje ponowne uruchomienie `npm run audit:release-evidence` na sprawdzanym branche.

---

## 6. Minimalny smoke test manualny do podpisu audytora

1. Zaloguj się zwykłym userem.
2. Utwórz leada, zadanie i wydarzenie.
3. Przekształć leada w sprawę / rozpocznij obsługę.
4. Wygeneruj szkic AI i zatwierdź go dopiero ręcznie.
5. Odśwież Today, Leads, Tasks, Calendar, Lead Detail, Case Detail.
6. Sprawdź, czy dane wracają po reloadzie.
7. Wyloguj się i zaloguj drugim userem z innego workspace.
8. Potwierdź brak przecieku danych i brak widoczności admin-only dla zwykłego usera.

---

## 7. Szczegółowy output checków

### PASS: `build`

- Command: `npm.cmd run build`
- Exit code: `0`
- Duration: `13.9s`

```text
STDOUT:

> closeflow@0.0.0 build
> vite build

[36mvite v6.4.2 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 2984 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                                                  [39m[1m[2m  1.74 kB[22m[1m[22m[2m │ gzip:   0.66 kB[22m
[2mdist/[22m[35massets/hotfix-right-rail-dark-wrappers-C8Oihgab.css         [39m[1m[2m  2.85 kB[22m[1m[22m[2m │ gzip:   0.54 kB[22m
[2mdist/[22m[35massets/Calendar-C_PhN0F-.css                                [39m[1m[2m  3.49 kB[22m[1m[22m[2m │ gzip:   1.00 kB[22m
[2mdist/[22m[35massets/Leads-BcKhW_Qx.css                                   [39m[1m[2m  4.25 kB[22m[1m[22m[2m │ gzip:   1.24 kB[22m
[2mdist/[22m[35massets/visual-stage23-client-case-forms-vnext-DLVgrbFg.css  [39m[1m[2m  5.16 kB[22m[1m[22m[2m │ gzip:   1.32 kB[22m
[2mdist/[22m[35massets/Layout-sQ9Dfk3B.css                                  [39m[1m[2m  6.00 kB[22m[1m[22m[2m │ gzip:   1.58 kB[22m
[2mdist/[22m[35massets/Settings-B80anTkp.css                                [39m[1m[2m  6.61 kB[22m[1m[22m[2m │ gzip:   1.61 kB[22m
[2mdist/[22m[35massets/SupportCenter-Chhd5_Sw.css                           [39m[1m[2m  9.61 kB[22m[1m[22m[2m │ gzip:   2.24 kB[22m
[2mdist/[22m[35massets/Billing-C_TinWM4.css                                 [39m[1m[2m  9.86 kB[22m[1m[22m[2m │ gzip:   2.11 kB[22m
[2mdist/[22m[35massets/Activity-M0MNj6Uy.css                                [39m[1m[2m 12.75 kB[22m[1m[22m[2m │ gzip:   2.60 kB[22m
[2mdist/[22m[35massets/NotificationsCenter-mUrAwngu.css                     [39m[1m[2m 14.29 kB[22m[1m[22m[2m │ gzip:   2.77 kB[22m
[2mdist/[22m[35massets/LeadDetail-DeQ0Wgmq.css                              [39m[1m[2m 15.67 kB[22m[1m[22m[2m │ gzip:   3.11 kB[22m
[2mdist/[22m[35massets/AiDrafts-ICOvzt1S.css                                [39m[1m[2m 17.60 kB[22m[1m[22m[2m │ gzip:   3.26 kB[22m
[2mdist/[22m[35massets/CaseDetail-HepruGOk.css                              [39m[1m[2m 17.91 kB[22m[1m[22m[2m │ gzip:   3.17 kB[22m
[2mdist/[22m[35massets/ClientDetail-LU66UCE9.css                            [39m[1m[2m 33.06 kB[22m[1m[22m[2m │ gzip:   4.71 kB[22m
[2mdist/[22m[35massets/index-BF4aC9Aj.css                                   [39m[1m[2m374.21 kB[22m[1m[22m[2m │ gzip:  52.23 kB[22m
[2mdist/[22m[36massets/app-preferences-OunjYGCB.js                          [39m[1m[2m  0.25 kB[22m[1m[22m[2m │ gzip:   0.19 kB[22m
[2mdist/[22m[36massets/firebase-gKjVCrxB.js                                 [39m[1m[2m  0.53 kB[22m[1m[22m[2m │ gzip:   0.38 kB[22m
[2mdist/[22m[36massets/browser-DU5MMTTh.js                                  [39m[1m[2m  0.62 kB[22m[1m[22m[2m │ gzip:   0.43 kB[22m
[2mdist/[22m[36massets/input-BpNlH4Nt.js                                    [39m[1m[2m  0.90 kB[22m[1m[22m[2m │ gzip:   0.48 kB[22m
[2mdist/[22m[36massets/card-qyM8BjwF.js                                     [39m[1m[2m  1.03 kB[22m[1m[22m[2m │ gzip:   0.40 kB[22m
[2mdist/[22m[36massets/tabs-BmPAE7Gt.js                                     [39m[1m[2m  1.14 kB[22m[1m[22m[2m │ gzip:   0.48 kB[22m
[2mdist/[22m[36massets/planned-actions-CYDsonxV.js                          [39m[1m[2m  1.31 kB[22m[1m[22m[2m │ gzip:   0.61 kB[22m
[2mdist/[22m[36massets/nearest-action-BtZP3ea_.js                           [39m[1m[2m  1.74 kB[22m[1m[22m[2m │ gzip:   0.74 kB[22m
[2mdist/[22m[36massets/textarea-X7ZzdztC.js                                 [39m[1m[2m  2.73 kB[22m[1m[22m[2m │ gzip:   1.04 kB[22m
[2mdist/[22m[36massets/case-lifecycle-v1-BrO9kis0.js                        [39m[1m[2m  2.98 kB[22m[1m[22m[2m │ gzip:   1.12 kB[22m
[2mdist/[22m[36massets/UiPreviewVNext-DJaXv13B.js                           [39m[1m[2m  6.63 kB[22m[1m[22m[2m │ gzip:   1.77 kB[22m
[2mdist/[22m[36massets/AdminAiSettings-Ba7HUnab.js                          [39m[1m[2m  6.78 kB[22m[1m[22m[2m │ gzip:   2.41 kB[22m
[2mdist/[22m[36massets/ClientPortal-Dnnx1-tT.js                             [39m[1m[2m  9.48 kB[22m[1m[22m[2m │ gzip:   3.47 kB[22m
[2mdist/[22m[36massets/ResponseTemplates-CV70Jcpq.js                        [39m[1m[2m 12.35 kB[22m[1m[22m[2m │ gzip:   3.55 kB[22m
[2mdist/[22m[36massets/Login-DfSUQl39.js                                    [39m[1m[2m 13.92 kB[22m[1m[22m[2m │ gzip:   4.25 kB[22m
[2mdist/[22m[36massets/Clients-CYPC5DhP.js                                  [39m[1m[2m 15.25 kB[22m[1m[22m[2m │ gzip:   4.63 kB[22m
[2mdist/[22m[36massets/TasksStable-COy3jAhz.js                              [39m[1m[2m 15.75 kB[22m[1m[22m[2m │ gzip:   4.73 kB[22m
[2mdist/[22m[36massets/SupportCenter-3edj31f5.js                            [39m[1m[2m 16.01 kB[22m[1m[22m[2m │ gzip:   5.14 kB[22m
[2mdist/[22m[36massets/NotificationsCenter-DCmVnRdM.js                      [39m[1m[2m 18.08 kB[22m[1m[22m[2m │ gzip:   5.41 kB[22m
[2mdist/[22m[36massets/Billing-SN1k1PSr.js                                  [39m[1m[2m 19.95 kB[22m[1m[22m[2m │ gzip:   6.41 kB[22m
[2mdist/[22m[36massets/Activity-C1TsWz2n.js                                 [39m[1m[2m 20.10 kB[22m[1m[22m[2m │ gzip:   5.44 kB[22m
[2mdist/[22m[36massets/TodayStable-B8xjsQBa.js                              [39m[1m[2m 20.23 kB[22m[1m[22m[2m │ gzip:   6.08 kB[22m
[2mdist/[22m[36massets/Cases-dtIbzOcK.js                                    [39m[1m[2m 20.50 kB[22m[1m[22m[2m │ gzip:   6.67 kB[22m
[2mdist/[22m[36massets/Leads-C9jBz4Gh.js                                    [39m[1m[2m 22.88 kB[22m[1m[22m[2m │ gzip:   7.20 kB[22m
[2mdist/[22m[36massets/Templates-rjLROZcA.js                                [39m[1m[2m 23.25 kB[22m[1m[22m[2m │ gzip:   6.39 kB[22m
[2mdist/[22m[36massets/AiDrafts-BdP5UlkE.js                                 [39m[1m[2m 33.40 kB[22m[1m[22m[2m │ gzip:   9.48 kB[22m
[2mdist/[22m[36massets/vendor-feedback-CWL61Qmj.js                          [39m[1m[2m 33.84 kB[22m[1m[22m[2m │ gzip:   9.57 kB[22m
[2mdist/[22m[36massets/vendor-date-DxUNpV6I.js                              [39m[1m[2m 34.31 kB[22m[1m[22m[2m │ gzip:   9.69 kB[22m
[2mdist/[22m[36massets/Settings-CG9rvaOa.js                                 [39m[1m[2m 35.33 kB[22m[1m[22m[2m │ gzip:   8.81 kB[22m
[2mdist/[22m[36massets/ClientDetail-BnLP8CDN.js                             [39m[1m[2m 35.82 kB[22m[1m[22m[2m │ gzip:   9.90 kB[22m
[2mdist/[22m[36massets/vendor-routing-63KbRTOb.js                           [39m[1m[2m 38.21 kB[22m[1m[22m[2m │ gzip:  13.69 kB[22m
[2mdist/[22m[36massets/vendor-icons-9WMwyGxT.js                             [39m[1m[2m 39.06 kB[22m[1m[22m[2m │ gzip:   7.67 kB[22m
[2mdist/[22m[36massets/CaseDetail-DTDAf4Kd.js                               [39m[1m[2m 42.17 kB[22m[1m[22m[2m │ gzip:  11.42 kB[22m
[2mdist/[22m[36massets/Calendar-CrBtIz36.js                                 [39m[1m[2m 51.15 kB[22m[1m[22m[2m │ gzip:  13.29 kB[22m
[2mdist/[22m[36massets/LeadDetail-ZuJSHVsd.js                               [39m[1m[2m 59.01 kB[22m[1m[22m[2m │ gzip:  15.37 kB[22m
[2mdist/[22m[36massets/UiPreviewVNextFull-Bvm2z2Hi.js                       [39m[1m[2m 71.77 kB[22m[1m[22m[2m │ gzip:  13.85 kB[22m
[2mdist/[22m[36massets/vendor-radix-fPQS1UQN.js                             [39m[1m[2m 78.01 kB[22m[1m[22m[2m │ gzip:  23.55 kB[22m
[2mdist/[22m[36massets/Layout-BoLNYH_9.js                                   [39m[1m[2m 80.84 kB[22m[1m[22m[2m │ gzip:  23.21 kB[22m
[2mdist/[22m[36massets/vendor-firebase-DmwLizUx.js                          [39m[1m[2m183.59 kB[22m[1m[22m[2m │ gzip:  37.96 kB[22m
[2mdist/[22m[36massets/index-BY4bbAL5.js                                    [39m[1m[2m231.84 kB[22m[1m[22m[2m │ gzip:  65.54 kB[22m
[2mdist/[22m[36massets/vendor-react-8zHiQ6Mn.js                             [39m[1m[2m336.75 kB[22m[1m[22m[2m │ gzip: 110.36 kB[22m
[32m✓ built in 12.50s[39m
```

### FAIL: `verify:closeflow:quiet`

- Command: `npm.cmd run verify:closeflow:quiet`
- Exit code: `1`
- Duration: `21.1s`

```text
STDOUT:

> closeflow@0.0.0 verify:closeflow:quiet
> node scripts/closeflow-release-check-quiet.cjs

OK production build
OK tests/closeflow-release-gate.test.cjs
OK tests/closeflow-release-gate-quiet.test.cjs
OK tests/lead-next-action-title-not-null.test.cjs
OK tests/lead-client-path-contract.test.cjs
OK tests/client-relation-command-center.test.cjs
OK tests/calendar-completed-event-behavior.test.cjs
OK tests/calendar-restore-completed-entries.test.cjs
OK tests/calendar-entry-relation-links.test.cjs
OK tests/today-completed-entries-behavior.test.cjs
OK tests/today-restore-completed-label.test.cjs
OK tests/today-entry-relation-links.test.cjs
OK tests/today-calendar-activity-logging.test.cjs
OK tests/activity-command-center.test.cjs


STDERR:

FAILED: tests/lead-service-mode-v1.test.cjs
✖ Lead service handoff opens case detail directly after start (1.3462ms)
✔ LeadDetail marks sold/service lead as operational archive (0.5337ms)
✔ LeadDetail blocks quick actions after handoff to case (0.4636ms)
✔ Lead service mode documentation exists (0.2479ms)
ℹ tests 4
ℹ suites 0
ℹ pass 3
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 68.7657

✖ failing tests:

test at tests\lead-service-mode-v1.test.cjs:12:1
✖ Lead service handoff opens case detail directly after start (1.3462ms)
  AssertionError [ERR_ASSERTION]: Po starcie obsługi ma kierować bezpośrednio do /case/:id.
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\lead-service-mode-v1.test.cjs:15:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: false,
    expected: true,
    operator: '==',
    diff: 'simple'
  }
```

### FAIL: `test:critical`

- Command: `npm.cmd run test:critical`
- Exit code: `1`
- Duration: `0.7s`

```text
STDOUT:

> closeflow@0.0.0 test:critical
> node scripts/run-tests-compact.cjs --critical

== CloseFlow compact test summary ==
Mode: critical
Critical files: 6
Tests: 13 | Pass: 12 | Fail: 1 | 212 ms
Full log: test-results\last-test-full.log

FAIL: testy nie przeszły. Pokazuję tylko krótką listę, bez pełnych diffów i bez zawartości plików.

1. A13 guards catch critical auth, access, data, portal, AI, Firestore, Gemini and template UI regressions
```

### PASS: `check:polish-mojibake`

- Command: `npm.cmd run check:polish-mojibake`
- Exit code: `0`
- Duration: `0.4s`

```text
STDOUT:

> closeflow@0.0.0 check:polish-mojibake
> node scripts/check-polish-mojibake.cjs

OK: no Polish mojibake detected in runtime UI/source copy.
```

### PASS: `check:ui-truth-copy`

- Command: `npm.cmd run check:ui-truth-copy`
- Exit code: `0`
- Duration: `0.4s`

```text
STDOUT:

> closeflow@0.0.0 check:ui-truth-copy
> node scripts/check-ui-truth-copy.cjs

OK: UI truth/copy guard passed.
```

### PASS: `check:workspace-scope`

- Command: `npm.cmd run check:workspace-scope`
- Exit code: `0`
- Duration: `0.4s`

```text
STDOUT:

> closeflow@0.0.0 check:workspace-scope
> node scripts/check-workspace-scope.cjs

OK: workspace scope guard passed.
```

### FAIL: `check:plan-access-gating`

- Command: `npm.cmd run check:plan-access-gating`
- Exit code: `1`
- Duration: `0.4s`

```text
STDOUT:

> closeflow@0.0.0 check:plan-access-gating
> node scripts/check-p0-plan-access-gating.cjs



STDERR:
P0 plan/access gating guard failed.
- src/server/_access-gate.ts missing: backend feature gate
- src/server/_access-gate.ts missing: Google Calendar backend gate key
- src/server/_access-gate.ts missing: AI plan error
- src/server/_access-gate.ts missing: Google Calendar plan error
- src/pages/Billing.tsx missing: Billing distinguishes full AI
- src/pages/Billing.tsx missing: Billing feature matrix gates Google Calendar
- src/pages/Billing.tsx missing: Billing feature matrix gates full AI
- src/components/GlobalQuickActions.tsx missing: global assistant is gated by plan feature
- src/components/GlobalQuickActions.tsx missing: locked AI button copy
```

### PASS: `check:assistant-operator-v1`

- Command: `npm.cmd run check:assistant-operator-v1`
- Exit code: `0`
- Duration: `0.4s`

```text
STDOUT:

> closeflow@0.0.0 check:assistant-operator-v1
> node scripts/check-assistant-operator-v1.cjs

OK: assistant operator V1 guard passed.
```

### PASS: `check:pwa-safe-cache`

- Command: `npm.cmd run check:pwa-safe-cache`
- Exit code: `0`
- Duration: `0.4s`

```text
STDOUT:

> closeflow@0.0.0 check:pwa-safe-cache
> node scripts/check-pwa-safe-cache.cjs

OK: PWA safe cache guard passed.
```

### PASS: `test:route-smoke`

- Command: `npm.cmd run test:route-smoke`
- Exit code: `0`
- Duration: `0.5s`

```text
STDOUT:

> closeflow@0.0.0 test:route-smoke
> node --test tests/route-smoke.test.cjs

✔ release candidate route smoke contract covers primary app routes (1.44ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 65.0808
```

### PASS: `test:button-action-map`

- Command: `npm.cmd run test:button-action-map`
- Exit code: `0`
- Duration: `0.4s`

```text
STDOUT:

> closeflow@0.0.0 test:button-action-map
> node --test tests/button-action-map.test.cjs

✔ button action map has release-candidate coverage for primary actions (2.6281ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 63.8183
```

### PASS: `check:button-action-map`

- Command: `npm.cmd run check:button-action-map`
- Exit code: `0`
- Duration: `0.4s`

```text
STDOUT:

> closeflow@0.0.0 check:button-action-map
> node scripts/check-button-action-map.cjs

OK: button action map guard passed.
```

---

## 8. Decyzja gate



❌ Gate nie przeszedł. Nie przekazywać aplikacji użytkownikowi, dopóki czerwone checki lub brak package.json / brak builda nie zostaną naprawione.
