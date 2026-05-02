# Release Candidate Evidence — CloseFlow / LeadFlow

**Data wygenerowania:** 2026-05-02T12:54:39.883Z  
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
| Commit | `2fc7701ef003d1f330dd34482d1952cfc98ef903` |
| Short commit | `2fc7701` |
| Commit date | `2026-05-02T12:22:34+02:00` |
| Commit subject | Fix P14 duplicate billing badge guard |
| Preview URL | [https://closeflowapp.vercel.app](https://closeflowapp.vercel.app) |
| Working tree | DIRTY |
| Node | `v24.14.0` |
| npm | `11.9.0` |
| package | `closeflow` |
| package version | `0.0.0` |

### Git working tree

```text
M package.json
 M src/pages/Calendar.tsx
?? docs/P14H_BOM_SAFE_FINAL_2026-05-02.md
?? docs/release/
?? scripts/print-release-evidence.cjs
?? test-results/
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
| `check:polish-mojibake` | PASS | 0 | 0.4s |
| `verify:closeflow:quiet` | FAIL | 1 | 7.9s |
| `test:critical` | PASS | 0 | 0.6s |
| `build` | PASS | 0 | 5.0s |

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
- Duration: `0.4s`

```text
STDOUT:

> closeflow@0.0.0 check:polish-mojibake
> node scripts/check-polish-mojibake.cjs

OK: no Polish mojibake detected.
```

### FAIL: `verify:closeflow:quiet`

- Command: `npm.cmd run verify:closeflow:quiet`
- Exit code: `1`
- Duration: `7.9s`

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


STDERR:
]) {\r\n' +
    "  const caseId = String(caseRecord?.id || '');\r\n" +
    "  const caseTasks = tasks.filter((task) => String(task.caseId || '') === caseId && !isDoneStatus(task.status));\r\n" +
    "  const caseEvents = events.filter((event) => String(event.caseId || '') === caseId && !isDoneStatus(event.status));\r\n" +
    '  const entries = [\r\n' +
    '    ...caseTasks.map((task) => ({\r\n' +
    "      kind: 'task' as const,\r\n" +
    "      title: String(task.title || '"... 44352 more characters
  
      at TestContext.<anonymous> (C:\Users\malim\Desktop\biznesy_ai\2.closeflow\tests\client-detail-simplified-card-view.test.cjs:23:10)
      at Test.runInAsyncScope (node:async_hooks:228:14)
      at Test.run (node:internal/test_runner/test:1118:25)
      at Test.start (node:internal/test_runner/test:1015:17)
      at startSubtestAfterBootstrap (node:internal/test_runner/harness:358:17) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: '/*\nCLIENT_DETAIL_VISUAL_REBUILD_STAGE12\nClient is a relation record. Operational work after acquisition happens in Case.\nCLIENT_DETAIL_FINAL_OPERATING_MODEL_V83\r\nCLIENT_DETAIL_WORK_IN_CASE_OR_ACTIVE_LEAD\r\nCLIENT_DETAIL_MORE_MENU_SECONDARY\r\nCLIENT_DETAIL_TABS_KARTOTEKA_RELACJE_HISTORIA_WIECEJ\nSTAGE35_CLIENT_DETAIL_VISIBLE_EDIT_ACTION\n*/\nconst STAGE35_CLIENT_DETAIL_EDIT_TOGGLE_GUARD = "contactEditing ? \'Zapisz\' : \'Edytuj\'";\nconst A16_V2_CONTACT_WRITE_STORM_GUARD = "contact-onchange-local-only-save-button-persists";\nimport { useCallback, useEffect, useMemo, useRef, useState } from \'react\';\nimport { Link, useNavigate, useParams } from \'react-router-dom\';\r\nimport {\r\n  Activity,\r\n  AlertTriangle,\r\n  ArrowLeft,\r\n  Briefcase,\r\n  Building2,\r\n  Calendar,\r\n  CheckCircle2,\r\n  Clock,\r\n  Copy,\r\n  FileText,\r\n  Loader2,\r\n  Mail,\n  Mic,\n  MicOff,\n  Pencil,\r\n  Phone,\r\n  Plus,\r\n  Save,\r\n  Sparkles,\r\n  Target,\r\n  UserRound,\r\n} from \'lucide-react\';\r\nimport { toast } from \'sonner\';\r\n\r\nimport Layout from \'../components/Layout\';\r\nimport { Button } from \'../components/ui/button\';\r\nimport { Input } from \'../components/ui/input\';\r\nimport { Label } from \'../components/ui/label\';\r\nimport { Textarea } from \'../components/ui/textarea\';\r\nimport { useWorkspace } from \'../hooks/useWorkspace\';\r\nimport {\r\n  fetchActivitiesFromSupabase,\r\n  fetchCasesFromSupabase,\r\n  fetchClientByIdFromSupabase,\r\n  fetchEventsFromSupabase,\r\n  fetchLeadsFromSupabase,\r\n  fetchPaymentsFromSupabase,\r\n  fetchTasksFromSupabase,\r\n  updateClientInSupabase,\r\n  updateLeadInSupabase,\r\n} from \'../lib/supabase-fallback\';\r\nimport \'../styles/visual-stage12-client-detail-vnext.css\';\r\n\r\ntype ClientTab = \'summary\' | \'cases\' | \'contact\' | \'history\';\r\n\r\ntype ClientNextAction = {\r\n  kind: \'task\' | \'event\' | \'case\' | \'lead\' | \'empty\';\r\n  title: string;\r\n  subtitle: string;\r\n  to?: string;\r\n  date?: string;\r\n  relationId?: string;\r\n  tone: \'red\' | \'amber\' | \'blue\' | \'emerald\' | \'slate\';\r\n};\r\n\r\ntype ClientCaseRow = {\n  id: string;\r\n  title: string;\r\n  leadId?: string | null;\r\n  status: string;\r\n  statusLabel: string;\r\n  nextActionLabel: string;\r\n  nextActionMeta: string;\r\n  sourceLabel: string;\r\n  completeness: number;\r\n  blocker: string;\n};\n\ntype SpeechRecognitionLike = {\n  lang: string;\n  continuous: boolean;\n  interimResults: boolean;\n  onresult: ((event: any) => void) | null;\n  onerror: ((event: any) => void) | null;\n  onend: (() => void) | null;\n  start: () => void;\n  stop: () => void;\n  abort?: () => void;\n};\n\ntype SpeechRecognitionConstructor = new () => SpeechRecognitionLike;\n\nfunction getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {\n  if (typeof window === \'undefined\') return null;\n  const browserWindow = window as any;\n  return browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition || null;\n}\n\nfunction joinTranscript(previous: string, addition: string) {\n  const base = previous.trim();\n  const next = addition.trim();\n  if (!next) return base;\n  return base ? `${base} ${next}` : next;\n}\n\r\nfunction asText(value: unknown) {\r\n  return typeof value === \'string\' ? value.trim() : \'\';\r\n}\r\n\r\nfunction asDate(value: unknown) {\r\n  if (!value) return null;\r\n  const parsed = new Date(String(value));\r\n  return Number.isNaN(parsed.getTime()) ? null : parsed;\r\n}\r\n\r\nfunction formatDate(value: unknown) {\r\n  const parsed = asDate(value);\r\n  if (!parsed) return \'Brak daty\';\r\n  return parsed.toLocaleDateString(\'pl-PL\', {\r\n    day: \'2-digit\',\r\n    month: \'2-digit\',\r\n    year: \'numeric\',\r\n  });\r\n}\r\n\r\nfunction formatDateTime(value: unknown) {\r\n  const parsed = asDate(value);\r\n  if (!parsed) return \'Brak daty\';\r\n  return parsed.toLocaleString(\'pl-PL\', {\r\n    day: \'2-digit\',\r\n    month: \'2-digit\',\r\n    year: \'numeric\',\r\n    hour: \'2-digit\',\r\n    minute: \'2-digit\',\r\n  });\r\n}\r\n\r\nfunction formatMoney(value: unknown) {\r\n  const amount = Number(value || 0);\r\n  return Number.isFinite(amount) ? `${amount.toLocaleString(\'pl-PL\')} PLN` : \'0 PLN\';\r\n}\r\n\r\nfunction getTaskDate(task: any) {\r\n  return String(task?.scheduledAt || task?.dueAt || task?.reminderAt || task?.date || task?.createdAt || \'\');\r\n}\r\n\r\nfunction getEventDate(event: any) {\r\n  return String(event?.startAt || event?.scheduledAt || event?.reminderAt || event?.createdAt || \'\');\r\n}\r\n\r\nfunction isDoneStatus(status: unknown) {\r\n  return [\'done\', \'completed\', \'archived\', \'cancelled\', \'canceled\'].includes(String(status || \'\').toLowerCase());\r\n}\r\n\r\nfunction getActivityTime(activity: any) {\r\n  return String(activity?.createdAt || activity?.updatedAt || activity?.happenedAt || \'\');\r\n}\r\n\r\nfunction leadStatusLabel(status?: string) {\r\n  switch (status) {\r\n    case \'new\':\r\n      return \'Nowy\';\r\n    case \'contacted\':\r\n      return \'Skontaktowany\';\r\n    case \'qualification\':\r\n      return \'Kwalifikacja\';\r\n    case \'proposal_sent\':\r\n      return \'Oferta wysłana\';\r\n    case \'waiting_response\':\r\n      return \'Czeka na odpowiedź\';\r\n    case \'accepted\':\r\n      return \'Zaakceptowany\';\r\n    case \'moved_to_service\':\r\n      return \'W obsłudze\';\r\n    case \'won\':\r\n      return \'Wygrany\';\r\n    case \'lost\':\r\n      return \'Przegrany\';\r\n    case \'archived\':\r\n      return \'Archiwum\';\r\n    default:\r\n      return status || \'Lead\';\r\n  }\r\n}\r\n\r\nfunction caseStatusLabel(status?: string) {\r\n  switch (status) {\r\n    case \'new\':\r\n      return \'Nowa\';\r\n    case \'waiting_on_client\':\r\n      return \'Czeka na klienta\';\r\n    case \'blocked\':\r\n      return \'Zablokowana\';\r\n    case \'to_approve\':\r\n      return \'Do akceptacji\';\r\n    case \'ready_to_start\':\r\n      return \'Gotowa do startu\';\r\n    case \'in_progress\':\r\n      return \'W realizacji\';\r\n    case \'on_hold\':\r\n      return \'Wstrzymana\';\r\n    case \'completed\':\r\n      return \'Zakończona\';\r\n    case \'canceled\':\r\n      return \'Anulowana\';\r\n    default:\r\n      return status || \'Sprawa\';\r\n  }\r\n}\r\n\r\nfunction paymentStatusLabel(status?: string) {\r\n  switch (status) {\r\n    case \'paid\':\r\n    case \'fully_paid\':\r\n      return \'Opłacone\';\r\n    case \'partially_paid\':\r\n      return \'Częściowo opłacone\';\r\n    case \'awaiting_payment\':\r\n      return \'Czeka na płatność\';\r\n    case \'deposit_paid\':\r\n      return \'Zaliczka\';\r\n    case \'refunded\':\r\n      return \'Zwrot\';\r\n    case \'written_off\':\r\n      return \'Spisane\';\r\n    default:\r\n      return status || \'Rozliczenie\';\r\n  }\r\n}\r\n\r\nfunction activityLabel(activity: any) {\r\n  const eventType = String(activity?.eventType || activity?.activityType || \'activity\');\r\n  const title = asText(activity?.payload?.title) || asText(activity?.title);\r\n\r\n  switch (eventType) {\r\n    case \'calendar_entry_completed\':\r\n      return title ? `Wpis kalendarza wykonany: ${title}` : \'Wpis kalendarza wykonany\';\r\n    case \'calendar_entry_restored\':\r\n      return title ? `Wpis kalendarza przywrócony: ${title}` : \'Wpis kalendarza przywrócony\';\r\n    case \'calendar_entry_deleted\':\r\n      return title ? `Wpis kalendarza usunięty: ${title}` : \'Wpis kalendarza usunięty\';\r\n    case \'today_task_completed\':\r\n      return title ? `Zadanie wykonane: ${title}` : \'Zadanie wykonane\';\r\n    case \'today_task_restored\':\r\n      return title ? `Zadanie przywrócone: ${title}` : \'Zadanie przywrócone\';\r\n    case \'today_task_snoozed\':\r\n      return title ? `Zadanie przesunięte: ${title}` : \'Zadanie przesunięte\';\r\n    case \'today_event_snoozed\':\r\n      return title ? `Wydarzenie przesunięte: ${title}` : \'Wydarzenie przesunięte\';\r\n    case \'case_lifecycle_started\':\r\n      return title ? `Sprawa rozpoczęta: ${title}` : \'Sprawa rozpoczęta\';\r\n    case \'case_lifecycle_completed\':\r\n      return title ? `Sprawa zakończona: ${title}` : \'Sprawa zakończona\';\r\n    case \'case_lifecycle_reopened\':\r\n      return title ? `Sprawa wznowiona: ${title}` : \'Sprawa wznowiona\';\r\n    case \'ai_draft_converted\':\r\n      return title ? `Szkic zatwierdzony: ${title}` : \'Szkic zatwierdzony\';\r\n    default:\r\n      return title || \'Aktywność klienta\';\r\n  }\r\n}\r\n\r\nfunction getInitials(client: any) {\r\n  const source = String(client?.name || client?.company || \'Klient\');\r\n  const initials = source\r\n    .split(/\\s+/)\r\n    .filter(Boolean)\r\n    .slice(0, 2)\r\n    .map((part) => part[0]?.toUpperCase())\r\n    .join(\'\');\r\n  return initials || \'K\';\r\n}\r\n\r\nfunction getClientName(client: any) {\r\n  return String(client?.name || client?.company || \'Klient bez nazwy\');\r\n}\r\n\r\nfunction getCaseTitle(caseRecord: any) {\r\n  return String(caseRecord?.title || caseRecord?.clientName || \'Sprawa klienta\');\r\n}\r\n\r\nfunction getCaseCompleteness(caseRecord: any) {\r\n  const value = Number(caseRecord?.completenessPercent || caseRecord?.completionPercent || 0);\r\n  return Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;\r\n}\r\n\r\nfunction getCaseBlocker(caseRecord: any) {\r\n  const explicit = asText(caseRecord?.blocker) || asText(caseRecord?.blockReason) || asText(caseRecord?.missingReason);\r\n  if (explicit) return explicit;\r\n  const status = String(caseRecord?.status || \'\');\r\n  if (status === \'blocked\') return \'blokada w sprawie\';\r\n  if (status === \'waiting_on_client\') return \'czeka na klienta\';\r\n  if (status === \'to_approve\') return \'czeka na akceptację\';\r\n  if (status === \'on_hold\') return \'sprawa wstrzymana\';\r\n  return \'\';\r\n}\r\n\r\nfunction getCaseSourceLead(caseRecord: any, leads: any[]) {\r\n  const caseId = String(caseRecord?.id || \'\');\r\n  const directLeadId = String(caseRecord?.leadId || caseRecord?.sourceLeadId || \'\');\r\n  return (\r\n    leads.find((lead) => String(lead.id || \'\') === directLeadId) ||\r\n    leads.find((lead) => String(lead.linkedCaseId || lead.caseId || \'\') === caseId) ||\r\n    null\r\n  );\r\n}\r\n\r\nfunction getCaseNextAction(caseRecord: any, tasks: any[], events: any[]) {\r\n  const caseId = String(caseRecord?.id || \'\');\r\n  const caseTasks = tasks.filter((task) => String(task.caseId || \'\') === caseId && !isDoneStatus(task.status));\r\n  const caseEvents = events.filter((event) => String(event.caseId || \'\') === caseId && !isDoneStatus(event.status));\r\n  const entries = [\r\n    ...caseTasks.map((task) => ({\r\n      kind: \'task\' as const,\r\n      title: String(task.title || \''... 44352 more characters,
    expected: /\+ Nowa sprawa dla klienta/,
    operator: 'match',
    diff: 'simple'
  }
```

### PASS: `test:critical`

- Command: `npm.cmd run test:critical`
- Exit code: `0`
- Duration: `0.6s`

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
- Duration: `5.0s`

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
[2mdist/[22m[36massets/workspace-context-CZUNSIKY.js                        [39m[1m[2m  0.10 kB[22m[1m[22m[2m │ gzip:   0.12 kB[22m
[2mdist/[22m[36massets/app-preferences-OunjYGCB.js                          [39m[1m[2m  0.25 kB[22m[1m[22m[2m │ gzip:   0.19 kB[22m
[2mdist/[22m[36massets/label-PnG2hTmW.js                                    [39m[1m[2m  0.39 kB[22m[1m[22m[2m │ gzip:   0.28 kB[22m
[2mdist/[22m[36massets/firebase-gKjVCrxB.js                                 [39m[1m[2m  0.53 kB[22m[1m[22m[2m │ gzip:   0.38 kB[22m
[2mdist/[22m[36massets/input-DmJo-IU5.js                                    [39m[1m[2m  0.61 kB[22m[1m[22m[2m │ gzip:   0.38 kB[22m
[2mdist/[22m[36massets/browser-DU5MMTTh.js                                  [39m[1m[2m  0.62 kB[22m[1m[22m[2m │ gzip:   0.43 kB[22m
[2mdist/[22m[36massets/card-OhchSc7U.js                                     [39m[1m[2m  1.03 kB[22m[1m[22m[2m │ gzip:   0.40 kB[22m
[2mdist/[22m[36massets/tabs-Caz79luu.js                                     [39m[1m[2m  1.14 kB[22m[1m[22m[2m │ gzip:   0.48 kB[22m
[2mdist/[22m[36massets/options-D422aFpW.js                                  [39m[1m[2m  1.60 kB[22m[1m[22m[2m │ gzip:   0.62 kB[22m
[2mdist/[22m[36massets/textarea-DL7BsMp2.js                                 [39m[1m[2m  2.73 kB[22m[1m[22m[2m │ gzip:   1.04 kB[22m
[2mdist/[22m[36massets/schedule-conflicts-BCvORYDB.js                       [39m[1m[2m  2.76 kB[22m[1m[22m[2m │ gzip:   1.13 kB[22m
[2mdist/[22m[36massets/case-lifecycle-v1-BrO9kis0.js                        [39m[1m[2m  2.98 kB[22m[1m[22m[2m │ gzip:   1.12 kB[22m
[2mdist/[22m[36massets/UiPreviewVNext-DJaXv13B.js                           [39m[1m[2m  6.63 kB[22m[1m[22m[2m │ gzip:   1.77 kB[22m
[2mdist/[22m[36massets/AdminAiSettings-DGWEKbwX.js                          [39m[1m[2m  6.78 kB[22m[1m[22m[2m │ gzip:   2.42 kB[22m
[2mdist/[22m[36massets/ClientPortal-ETtcBFKn.js                             [39m[1m[2m  9.52 kB[22m[1m[22m[2m │ gzip:   3.48 kB[22m
[2mdist/[22m[36massets/TodayStable-CUr-dTCl.js                              [39m[1m[2m 11.01 kB[22m[1m[22m[2m │ gzip:   3.61 kB[22m
[2mdist/[22m[36massets/TasksStable-au0lhnlc.js                              [39m[1m[2m 12.33 kB[22m[1m[22m[2m │ gzip:   4.05 kB[22m
[2mdist/[22m[36massets/ResponseTemplates-C2gqcGzo.js                        [39m[1m[2m 12.38 kB[22m[1m[22m[2m │ gzip:   3.57 kB[22m
[2mdist/[22m[36massets/Login-DwvyBNX5.js                                    [39m[1m[2m 13.95 kB[22m[1m[22m[2m │ gzip:   4.27 kB[22m
[2mdist/[22m[36massets/Clients-xlkh_HXX.js                                  [39m[1m[2m 14.52 kB[22m[1m[22m[2m │ gzip:   4.38 kB[22m
[2mdist/[22m[36massets/SupportCenter-Tl1jOu9F.js                            [39m[1m[2m 16.05 kB[22m[1m[22m[2m │ gzip:   5.17 kB[22m
[2mdist/[22m[36massets/NotificationsCenter-DtGOLySF.js                      [39m[1m[2m 17.52 kB[22m[1m[22m[2m │ gzip:   5.24 kB[22m
[2mdist/[22m[36massets/Billing-CHULm39X.js                                  [39m[1m[2m 19.18 kB[22m[1m[22m[2m │ gzip:   6.14 kB[22m
[2mdist/[22m[36massets/Activity-sWvEY50t.js                                 [39m[1m[2m 20.10 kB[22m[1m[22m[2m │ gzip:   5.44 kB[22m
[2mdist/[22m[36massets/Cases-CBvDpCeI.js                                    [39m[1m[2m 20.32 kB[22m[1m[22m[2m │ gzip:   6.60 kB[22m
[2mdist/[22m[36massets/Templates-BXsBrXoF.js                                [39m[1m[2m 23.32 kB[22m[1m[22m[2m │ gzip:   6.43 kB[22m
[2mdist/[22m[36massets/Settings-BWzzT6G0.js                                 [39m[1m[2m 24.23 kB[22m[1m[22m[2m │ gzip:   6.24 kB[22m
[2mdist/[22m[36massets/Leads-DI0luwPZ.js                                    [39m[1m[2m 24.72 kB[22m[1m[22m[2m │ gzip:   7.73 kB[22m
[2mdist/[22m[36massets/ClientDetail-C_aNTpRu.js                             [39m[1m[2m 30.30 kB[22m[1m[22m[2m │ gzip:   8.40 kB[22m
[2mdist/[22m[36massets/AiDrafts-BVnlVtBL.js                                 [39m[1m[2m 32.59 kB[22m[1m[22m[2m │ gzip:   9.18 kB[22m
[2mdist/[22m[36massets/vendor-feedback-CWL61Qmj.js                          [39m[1m[2m 33.84 kB[22m[1m[22m[2m │ gzip:   9.57 kB[22m
[2mdist/[22m[36massets/vendor-date-DxUNpV6I.js                              [39m[1m[2m 34.31 kB[22m[1m[22m[2m │ gzip:   9.69 kB[22m
[2mdist/[22m[36massets/CaseDetail-DxlxqgvT.js                               [39m[1m[2m 34.52 kB[22m[1m[22m[2m │ gzip:   8.92 kB[22m
[2mdist/[22m[36massets/vendor-routing-DzBk4N5V.js                           [39m[1m[2m 38.21 kB[22m[1m[22m[2m │ gzip:  13.69 kB[22m
[2mdist/[22m[36massets/vendor-icons-BHsd-uM9.js                             [39m[1m[2m 39.06 kB[22m[1m[22m[2m │ gzip:   7.67 kB[22m
[2mdist/[22m[36massets/Calendar-yFhpYf5t.js                                 [39m[1m[2m 48.26 kB[22m[1m[22m[2m │ gzip:  12.45 kB[22m
[2mdist/[22m[36massets/Layout-ixGR_IJU.js                                   [39m[1m[2m 53.34 kB[22m[1m[22m[2m │ gzip:  16.59 kB[22m
[2mdist/[22m[36massets/LeadDetail-C7iIUaq9.js                               [39m[1m[2m 54.07 kB[22m[1m[22m[2m │ gzip:  13.63 kB[22m
[2mdist/[22m[36massets/UiPreviewVNextFull-BeANUZ-K.js                       [39m[1m[2m 71.76 kB[22m[1m[22m[2m │ gzip:  13.86 kB[22m
[2mdist/[22m[36massets/vendor-radix-fPQS1UQN.js                             [39m[1m[2m 78.01 kB[22m[1m[22m[2m │ gzip:  23.55 kB[22m
[2mdist/[22m[36massets/vendor-firebase-DmwLizUx.js                          [39m[1m[2m183.59 kB[22m[1m[22m[2m │ gzip:  37.96 kB[22m
[2mdist/[22m[36massets/index-TzUR_C2_.js                                    [39m[1m[2m218.96 kB[22m[1m[22m[2m │ gzip:  62.05 kB[22m
[2mdist/[22m[36massets/vendor-react-8zHiQ6Mn.js                             [39m[1m[2m336.75 kB[22m[1m[22m[2m │ gzip: 110.36 kB[22m
[32m✓ built in 4.21s[39m


STDERR:
[33m[plugin vite:esbuild] src/pages/Calendar.tsx: [33mDuplicate key "leadId" in object literal[33m
823|          caseId: readCalendarRawText(entry.raw?.caseId) || null,
824|          workspaceId: workspace?.id ?? null,
825|                  leadId: entry.raw?.leadId ?? null,
   |                  ^
826|          caseId: entry.raw?.caseId ?? null,
827|  payload: {
[39m
[33m[plugin vite:esbuild] src/pages/Calendar.tsx: [33mDuplicate key "caseId" in object literal[33m
824|          workspaceId: workspace?.id ?? null,
825|                  leadId: entry.raw?.leadId ?? null,
826|          caseId: entry.raw?.caseId ?? null,
   |          ^
827|  payload: {
828|            source: 'calendar',
[39m
```

---

## 8. Decyzja gate



❌ Gate nie przeszedł. Nie przekazywać aplikacji użytkownikowi, dopóki czerwone checki lub brak package.json / brak builda nie zostaną naprawione.
