# Release Candidate Evidence — CloseFlow / LeadFlow

**Data wygenerowania:** 2026-05-03T09:04:09.121Z  
**Status evidence gate:** ✅ **PASS**  
**Zakres:** ETAP 0.1 — Release Candidate Evidence Gate  
**Uwaga:** ten dokument nie zmienia działania aplikacji. To dowód release’u dla audytu.

---

## 1. Źródło prawdy release candidate

| Pole | Wartość |
|---|---|
| Repo root | `C:/Users/malim/Desktop/biznesy_ai/2.closeflow` |
| Repo remote | `https://github.com/dkknapikdamian-collab/leadflowv1.git` |
| Branch | `dev-rollout-freeze` |
| Commit | `65dd3f72821b61f99a67f0785465af1ef836fc18` |
| Short commit | `65dd3f7` |
| Commit date | `2026-05-03T11:03:12+02:00` |
| Commit subject | Fix CloseFlow workspace write access runtime gate |
| Preview URL | [https://closeflowapp.vercel.app](https://closeflowapp.vercel.app) |
| Working tree | CLEAN |
| Node | `v24.14.0` |
| npm | `11.9.0` |
| package | `closeflow` |
| package version | `0.0.0` |

### Git working tree

```text
clean
```

---

## 2. Lista skryptów testowych / release guardów wykrytych w package.json

| Script | Command |
|---|---|
| `audit:release-evidence` | `node scripts/print-release-evidence.cjs --write` |
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
| `check:ai-app-context-operator-stage26` | `node scripts/check-ai-app-context-operator-stage26.cjs` |
| `check:client-inline-edit` | `node scripts/check-client-inline-edit-and-task-edit.cjs` |
| `check:data-contract-stage-a1` | `node scripts/check-data-contract-stage-a1.cjs` |
| `check:data-contract-stage-a2` | `node scripts/check-data-contract-stage-a2.cjs` |
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
| `check:polish` | `node scripts/check-polish-mojibake.cjs` |
| `check:polish-mojibake` | `node scripts/check-polish-mojibake.cjs` |
| `check:relation-cleanup-today-sync` | `node scripts/check-relation-cleanup-today-toggle-sync.cjs` |
| `check:task-edit-reminder-week-calendar` | `node scripts/check-task-edit-reminder-and-week-calendar.cjs` |
| `check:task-event-contract` | `node scripts/check-task-event-contract.cjs` |
| `check:today-client-ui-cleanup` | `node scripts/check-today-week-client-more-ui-text-cleanup.cjs` |
| `check:today-event-client-cleanup` | `node scripts/check-today-tiles-event-edit-client-cleanup.cjs` |
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
| `lint` | `node scripts/check-a13-critical-regressions.cjs && node scripts/check-visual-stage18-leads-hard-1to1.cjs && node scripts/check-visual-stage17-today-hard-1to1.cjs && node scripts/check-visual-stage16-today-html-reset.cjs && node scripts/check-visual-html-theme-v14.cjs && node scripts/check-visual-stage08-case-detail.cjs && node scripts/check-visual-stage07-cases.cjs && node scripts/check-visual-stage06-client-detail.cjs && node scripts/check-visual-stage05-clients.cjs && node scripts/check-visual-stage04-lead-detail.cjs && node scripts/check-visual-stage03-leads.cjs && node scripts/check-visual-stage02-today.cjs && node scripts/check-visual-stage01-shell.cjs && node scripts/check-relation-cleanup-today-toggle-sync.cjs && node scripts/check-today-tiles-event-edit-client-cleanup.cjs && node scripts/check-today-week-client-more-ui-text-cleanup.cjs && node scripts/check-task-edit-reminder-and-week-calendar.cjs && node scripts/check-client-inline-edit-and-task-edit.cjs && node scripts/check-task-event-contract.cjs && node scripts/check-data-contract-stage-a1.cjs && node scripts/check-data-contract-stage-a2.cjs && node scripts/check-polish-mojibake.cjs && tsc --noEmit` |
| `test` | `node scripts/run-tests-compact.cjs` |
| `test:compact` | `node scripts/run-tests-compact.cjs` |
| `test:critical` | `node scripts/run-tests-compact.cjs --critical` |
| `test:raw` | `node --test "tests/**/*.test.cjs"` |
| `verify:architecture:supabase-first` | `node scripts/check-supabase-first-architecture.cjs` |
| `verify:auth:supabase-stage01` | `node scripts/check-stage01-supabase-auth.cjs` |
| `verify:closeflow` | `node scripts/closeflow-release-check.cjs` |
| `verify:closeflow:quiet` | `node scripts/closeflow-release-check-quiet.cjs` |
| `verify:data-contract-stage05` | `node scripts/check-stage05-supabase-data-contract.cjs` |
| `verify:migrations:supabase` | `node scripts/check-supabase-migrations-guard.cjs` |
| `verify:security:firebase-stage03` | `node scripts/check-stage03-firebase-legacy-lockdown.cjs` |
| `verify:security:gemini-client` | `node scripts/verify-no-client-gemini-secret.cjs` |
| `verify:security:server-only-secrets` | `node scripts/verify-server-only-secrets.cjs` |

### Checki wymagane przez gate, ale niewykryte w package.json

- brak

---

## 3. Wyniki uruchomionych checków

| Script | Status | Exit code | Czas |
|---|---:|---:|---:|
| `check:polish-mojibake` | PASS | 0 | 0.5s |
| `verify:closeflow:quiet` | PASS | 0 | 36.3s |
| `test:critical` | PASS | 0 | 0.7s |
| `build` | PASS | 0 | 18.2s |

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
| `GEMINI_API_KEY` | ai | EXAMPLE_ONLY | .env.example | Gemini key, jeśli AI używa Gemini. |
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

### PASS: `check:polish-mojibake`

- Command: `npm.cmd run check:polish-mojibake`
- Exit code: `0`
- Duration: `0.5s`

```text
STDOUT:

> closeflow@0.0.0 check:polish-mojibake
> node scripts/check-polish-mojibake.cjs

OK: no Polish mojibake detected.
```

### PASS: `verify:closeflow:quiet`

- Command: `npm.cmd run verify:closeflow:quiet`
- Exit code: `0`
- Duration: `36.3s`

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
OK tests/lead-service-mode-v1.test.cjs
OK tests/panel-delete-actions-v1.test.cjs
OK tests/case-lifecycle-v1-foundation.test.cjs
OK tests/today-v1-final-action-board.test.cjs
OK tests/today-priority-reasons-runtime.test.cjs
OK tests/cases-v1-lifecycle-command-board.test.cjs
OK tests/cases-filetext-runtime.test.cjs
OK tests/case-detail-v1-command-center.test.cjs
OK tests/client-detail-v1-operational-center.test.cjs
OK tests/client-detail-simplified-card-view.test.cjs
OK tests/client-detail-final-operating-model.test.cjs
OK tests/today-quick-snooze-options.test.cjs
OK tests/today-quick-snooze-click-edit-polish.test.cjs
OK tests/today-quick-snooze-hard-click-fix.test.cjs
OK tests/pwa-foundation.test.cjs
OK tests/daily-digest-email-runtime.test.cjs
OK tests/email-digest-domain-gate.test.cjs
OK tests/billing-stripe-blik-foundation.test.cjs
OK tests/billing-foundation-test-polish-label-regression.test.cjs
OK tests/billing-stripe-blik-multi-plan-pricing.test.cjs
OK tests/billing-checkout-vercel-api-type-guard.test.cjs
OK tests/billing-ui-polish-and-diagnostics.test.cjs
OK tests/ui-copy-and-billing-cleanup.test.cjs
OK tests/ai-config-admin-foundation.test.cjs
OK tests/ai-config-no-secret-leak.test.cjs
OK tests/cases-page-helper-copy-cleanup.test.cjs
OK tests/stat-shortcut-cards-standard.test.cjs
OK tests/ui-completed-label-consistency.test.cjs
OK tests/leads-history-copy-cleanup.test.cjs
OK tests/ai-quick-capture-foundation.test.cjs
OK tests/ai-quick-capture-voice-and-today.test.cjs
OK tests/ai-followup-draft.test.cjs
OK tests/ai-next-action-suggestion.test.cjs
OK tests/ai-next-action-create-task.test.cjs
OK tests/ai-assistant-command-center.test.cjs
OK tests/ai-capture-speech-parser.test.cjs
OK tests/ai-assistant-scope-budget-guard.test.cjs
OK tests/ai-assistant-capture-handoff.test.cjs
OK tests/billing-stripe-diagnostics-dry-run.test.cjs
OK tests/billing-dry-run-test-order-regression.test.cjs
OK tests/stripe-checkout-app-url-normalization.test.cjs
OK tests/daily-digest-diagnostics.test.cjs
OK tests/daily-digest-cron-auth.test.cjs
OK tests/today-action-layout-not-column-cramped.test.cjs
OK tests/vercel-hobby-function-budget.test.cjs
OK tests/request-scope-server-helper.test.cjs
OK tests/request-identity-vercel-api-signature.test.cjs
OK tests/polish-mojibake-audit.test.cjs
OK tests/stage30-leads-clients-trash-contract.test.cjs
OK tests/stage31-leads-thin-list-search.test.cjs
OK tests/stage32-leads-value-right-rail.test.cjs
OK tests/stage32e-relation-rail-copy-compat.test.cjs
OK tests/stage32g-relation-funnel-full-gate-contract.test.cjs
OK tests/stage32f-relation-funnel-contract.test.cjs
OK tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs
OK tests/stage35-ai-assistant-compact-ui.test.cjs
OK tests/layout-brand-label.test.cjs
OK tests/lead-start-service-case-redirect.test.cjs
OK tests/billing-checkout-no-prefilled-personal-email.test.cjs
OK tests/lead-write-access-gate.test.cjs
OK tests/billing-access-plan-normalization.test.cjs
OK tests/today-quick-snooze-real-button-click.test.cjs
OK tests/google-mobile-login-webview-guard.test.cjs
OK tests/relation-funnel-value.test.cjs
OK tests/global-quick-actions-open-modals.test.cjs
OK tests/ai-draft-inbox-flow.test.cjs
OK tests/ai-draft-inbox-command-center.test.cjs
OK tests/global-quick-actions-sticky-single-source.test.cjs
OK tests/global-quick-actions-no-duplicates.test.cjs
OK tests/global-quick-actions-toolbar-a11y.test.cjs
OK tests/ai-usage-limit-guard.test.cjs
OK tests/ai-real-provider-wiring.test.cjs
OK tests/ai-cloudflare-provider-wiring.test.cjs
OK tests/ai-assistant-global-app-search.test.cjs
OK tests/ai-assistant-autospeech-and-clear-input.test.cjs
OK tests/ai-assistant-save-vs-search-rule.test.cjs
OK tests/ai-assistant-admin-and-app-scope.test.cjs
OK tests/ai-safety-gates-direct-write.test.cjs
OK tests/ai-direct-write-respects-mode-stage28.test.cjs
OK tests/today-ai-drafts-tile-stage29.test.cjs
OK tests/stage29d-today-ai-drafts-compact-tile.test.cjs
OK tests/supabase-first-readiness-stage16.test.cjs

CloseFlow quiet release gate passed.
```

### PASS: `test:critical`

- Command: `npm.cmd run test:critical`
- Exit code: `0`
- Duration: `0.7s`

```text
STDOUT:

> closeflow@0.0.0 test:critical
> node scripts/run-tests-compact.cjs --critical

== CloseFlow compact test summary ==
Mode: critical
Critical files: 6
Tests: 13 | Pass: 13 | Fail: 0 | 196 ms
Full log: test-results\last-test-full.log

OK: testy przeszły.
```

### PASS: `build`

- Command: `npm.cmd run build`
- Exit code: `0`
- Duration: `18.2s`

```text
STDOUT:

> closeflow@0.0.0 build
> vite build

[36mvite v6.4.2 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 2965 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                                                  [39m[1m[2m  1.74 kB[22m[1m[22m[2m │ gzip:   0.66 kB[22m
[2mdist/[22m[35massets/hotfix-right-rail-dark-wrappers-C8Oihgab.css         [39m[1m[2m  2.85 kB[22m[1m[22m[2m │ gzip:   0.54 kB[22m
[2mdist/[22m[35massets/Calendar-C_PhN0F-.css                                [39m[1m[2m  3.49 kB[22m[1m[22m[2m │ gzip:   1.00 kB[22m
[2mdist/[22m[35massets/Leads-BcKhW_Qx.css                                   [39m[1m[2m  4.25 kB[22m[1m[22m[2m │ gzip:   1.24 kB[22m
[2mdist/[22m[35massets/visual-stage23-client-case-forms-vnext-DLVgrbFg.css  [39m[1m[2m  5.16 kB[22m[1m[22m[2m │ gzip:   1.32 kB[22m
[2mdist/[22m[35massets/Settings-B80anTkp.css                                [39m[1m[2m  6.61 kB[22m[1m[22m[2m │ gzip:   1.61 kB[22m
[2mdist/[22m[35massets/SupportCenter-Chhd5_Sw.css                           [39m[1m[2m  9.61 kB[22m[1m[22m[2m │ gzip:   2.24 kB[22m
[2mdist/[22m[35massets/Billing-C_TinWM4.css                                 [39m[1m[2m  9.86 kB[22m[1m[22m[2m │ gzip:   2.11 kB[22m
[2mdist/[22m[35massets/CaseDetail-DEYpIvMU.css                              [39m[1m[2m 10.21 kB[22m[1m[22m[2m │ gzip:   2.18 kB[22m
[2mdist/[22m[35massets/LeadDetail-CqEK1oQ3.css                              [39m[1m[2m 10.23 kB[22m[1m[22m[2m │ gzip:   2.25 kB[22m
[2mdist/[22m[35massets/Activity-M0MNj6Uy.css                                [39m[1m[2m 12.75 kB[22m[1m[22m[2m │ gzip:   2.60 kB[22m
[2mdist/[22m[35massets/NotificationsCenter-mUrAwngu.css                     [39m[1m[2m 14.29 kB[22m[1m[22m[2m │ gzip:   2.77 kB[22m
[2mdist/[22m[35massets/ClientDetail-H5r4uBB6.css                            [39m[1m[2m 15.46 kB[22m[1m[22m[2m │ gzip:   3.00 kB[22m
[2mdist/[22m[35massets/AiDrafts-ICOvzt1S.css                                [39m[1m[2m 17.60 kB[22m[1m[22m[2m │ gzip:   3.26 kB[22m
[2mdist/[22m[35massets/index-B3l78PTx.css                                   [39m[1m[2m354.30 kB[22m[1m[22m[2m │ gzip:  49.43 kB[22m
[2mdist/[22m[36massets/workspace-context-CGkulUyh.js                        [39m[1m[2m  0.10 kB[22m[1m[22m[2m │ gzip:   0.12 kB[22m
[2mdist/[22m[36massets/app-preferences-OunjYGCB.js                          [39m[1m[2m  0.25 kB[22m[1m[22m[2m │ gzip:   0.19 kB[22m
[2mdist/[22m[36massets/label-B27kwzLI.js                                    [39m[1m[2m  0.39 kB[22m[1m[22m[2m │ gzip:   0.28 kB[22m
[2mdist/[22m[36massets/firebase-gKjVCrxB.js                                 [39m[1m[2m  0.53 kB[22m[1m[22m[2m │ gzip:   0.38 kB[22m
[2mdist/[22m[36massets/input-BfNGUCHo.js                                    [39m[1m[2m  0.61 kB[22m[1m[22m[2m │ gzip:   0.38 kB[22m
[2mdist/[22m[36massets/browser-DU5MMTTh.js                                  [39m[1m[2m  0.62 kB[22m[1m[22m[2m │ gzip:   0.43 kB[22m
[2mdist/[22m[36massets/card-n57dbNAw.js                                     [39m[1m[2m  1.03 kB[22m[1m[22m[2m │ gzip:   0.40 kB[22m
[2mdist/[22m[36massets/tabs-D_TiDakG.js                                     [39m[1m[2m  1.14 kB[22m[1m[22m[2m │ gzip:   0.48 kB[22m
[2mdist/[22m[36massets/options-BgH3h7l-.js                                  [39m[1m[2m  1.60 kB[22m[1m[22m[2m │ gzip:   0.62 kB[22m
[2mdist/[22m[36massets/textarea-D0o1MHyI.js                                 [39m[1m[2m  2.73 kB[22m[1m[22m[2m │ gzip:   1.03 kB[22m
[2mdist/[22m[36massets/schedule-conflicts-Cy0IzNR-.js                       [39m[1m[2m  2.76 kB[22m[1m[22m[2m │ gzip:   1.13 kB[22m
[2mdist/[22m[36massets/case-lifecycle-v1-BrO9kis0.js                        [39m[1m[2m  2.98 kB[22m[1m[22m[2m │ gzip:   1.12 kB[22m
[2mdist/[22m[36massets/UiPreviewVNext-DJaXv13B.js                           [39m[1m[2m  6.63 kB[22m[1m[22m[2m │ gzip:   1.77 kB[22m
[2mdist/[22m[36massets/AdminAiSettings-BniXl2E-.js                          [39m[1m[2m  6.78 kB[22m[1m[22m[2m │ gzip:   2.41 kB[22m
[2mdist/[22m[36massets/ClientPortal-DH7s3bvD.js                             [39m[1m[2m  9.52 kB[22m[1m[22m[2m │ gzip:   3.48 kB[22m
[2mdist/[22m[36massets/TodayStable-CfhA3MR4.js                              [39m[1m[2m 11.01 kB[22m[1m[22m[2m │ gzip:   3.61 kB[22m
[2mdist/[22m[36massets/TasksStable-sBr6-X9l.js                              [39m[1m[2m 12.33 kB[22m[1m[22m[2m │ gzip:   4.05 kB[22m
[2mdist/[22m[36massets/ResponseTemplates-CPUxvTKF.js                        [39m[1m[2m 12.38 kB[22m[1m[22m[2m │ gzip:   3.56 kB[22m
[2mdist/[22m[36massets/Login-C5wY_Vnc.js                                    [39m[1m[2m 13.95 kB[22m[1m[22m[2m │ gzip:   4.27 kB[22m
[2mdist/[22m[36massets/Clients-BzyAJrdy.js                                  [39m[1m[2m 14.52 kB[22m[1m[22m[2m │ gzip:   4.38 kB[22m
[2mdist/[22m[36massets/SupportCenter-DEUpXmPM.js                            [39m[1m[2m 16.05 kB[22m[1m[22m[2m │ gzip:   5.17 kB[22m
[2mdist/[22m[36massets/NotificationsCenter-PHLguS5D.js                      [39m[1m[2m 17.52 kB[22m[1m[22m[2m │ gzip:   5.24 kB[22m
[2mdist/[22m[36massets/Billing-Clgoqd3j.js                                  [39m[1m[2m 19.18 kB[22m[1m[22m[2m │ gzip:   6.14 kB[22m
[2mdist/[22m[36massets/Activity-BPfTtcqt.js                                 [39m[1m[2m 20.10 kB[22m[1m[22m[2m │ gzip:   5.44 kB[22m
[2mdist/[22m[36massets/Settings-CXyhtPuW.js                                 [39m[1m[2m 20.26 kB[22m[1m[22m[2m │ gzip:   5.46 kB[22m
[2mdist/[22m[36massets/Cases-0yQPsYmE.js                                    [39m[1m[2m 20.32 kB[22m[1m[22m[2m │ gzip:   6.60 kB[22m
[2mdist/[22m[36massets/Templates-naiaEWvR.js                                [39m[1m[2m 23.32 kB[22m[1m[22m[2m │ gzip:   6.43 kB[22m
[2mdist/[22m[36massets/Leads-BGjA9dMO.js                                    [39m[1m[2m 24.72 kB[22m[1m[22m[2m │ gzip:   7.72 kB[22m
[2mdist/[22m[36massets/ClientDetail-DczLN-ib.js                             [39m[1m[2m 30.30 kB[22m[1m[22m[2m │ gzip:   8.40 kB[22m
[2mdist/[22m[36massets/AiDrafts-Dek2GrHO.js                                 [39m[1m[2m 32.59 kB[22m[1m[22m[2m │ gzip:   9.18 kB[22m
[2mdist/[22m[36massets/vendor-feedback-CWL61Qmj.js                          [39m[1m[2m 33.84 kB[22m[1m[22m[2m │ gzip:   9.57 kB[22m
[2mdist/[22m[36massets/vendor-date-DxUNpV6I.js                              [39m[1m[2m 34.31 kB[22m[1m[22m[2m │ gzip:   9.69 kB[22m
[2mdist/[22m[36massets/CaseDetail-CeW5gXem.js                               [39m[1m[2m 34.52 kB[22m[1m[22m[2m │ gzip:   8.92 kB[22m
[2mdist/[22m[36massets/vendor-routing-DzBk4N5V.js                           [39m[1m[2m 38.21 kB[22m[1m[22m[2m │ gzip:  13.69 kB[22m
[2mdist/[22m[36massets/vendor-icons-BHsd-uM9.js                             [39m[1m[2m 39.06 kB[22m[1m[22m[2m │ gzip:   7.67 kB[22m
[2mdist/[22m[36massets/Calendar-DoU6nNK-.js                                 [39m[1m[2m 48.16 kB[22m[1m[22m[2m │ gzip:  12.43 kB[22m
[2mdist/[22m[36massets/Layout-CBmzpTm1.js                                   [39m[1m[2m 53.34 kB[22m[1m[22m[2m │ gzip:  16.59 kB[22m
[2mdist/[22m[36massets/LeadDetail-DLz2_QqY.js                               [39m[1m[2m 54.07 kB[22m[1m[22m[2m │ gzip:  13.62 kB[22m
[2mdist/[22m[36massets/UiPreviewVNextFull-BeANUZ-K.js                       [39m[1m[2m 71.76 kB[22m[1m[22m[2m │ gzip:  13.86 kB[22m
[2mdist/[22m[36massets/vendor-radix-fPQS1UQN.js                             [39m[1m[2m 78.01 kB[22m[1m[22m[2m │ gzip:  23.55 kB[22m
[2mdist/[22m[36massets/vendor-firebase-DmwLizUx.js                          [39m[1m[2m183.59 kB[22m[1m[22m[2m │ gzip:  37.96 kB[22m
[2mdist/[22m[36massets/index-DcBF9dS3.js                                    [39m[1m[2m219.42 kB[22m[1m[22m[2m │ gzip:  62.23 kB[22m
[2mdist/[22m[36massets/vendor-react-8zHiQ6Mn.js                             [39m[1m[2m336.75 kB[22m[1m[22m[2m │ gzip: 110.36 kB[22m
[32m✓ built in 17.05s[39m
```

---

## 8. Decyzja gate

✅ Gate techniczny przeszedł. Nadal wymagany jest manualny smoke test krytycznych ścieżek.


