# REPO_MAP (ClientPilot)

Ta mapa jest generowana automatycznie na bazie `git ls-files` (czyli tylko pliki w repo).

- Repo root: `C:/Users/malim/Desktop/biznesy_ai/Nowy folder/leadflowv1`
- Branch: `etap16-qa-2026-04-08`
- HEAD: `f94d827 Rule: update REPO_MAP after every change`
- Generated: `2026-04-08T17:16:38.651Z`

## Jak używać

- Zanim cokolwiek zmienisz: znajdź odpowiedni folder/plik w tej mapie.
- Zmieniaj tylko pliki, które są potrzebne do celu zmiany (unikamy skanowania całego repo).
- Jeśli musisz coś znaleźć: ogranicz `rg` do 1-3 katalogów lub konkretnych plików z mapy.

## Foldery (cel/purpose)

- `.`: Repo root (entry configs + docs).
- `app`: Next.js App Router: pages, layouts, and API routes.
- `app/access-blocked`: Folder.
- `app/activity`: Folder.
- `app/api/access/redeem-code`: Next.js server routes (API endpoints).
- `app/api/app/snapshot`: Next.js server routes (API endpoints).
- `app/api/auth/ensure-core-state`: Next.js server routes (API endpoints).
- `app/api/auth/forgot-password`: Next.js server routes (API endpoints).
- `app/api/auth/login`: Next.js server routes (API endpoints).
- `app/api/auth/logout`: Next.js server routes (API endpoints).
- `app/api/auth/oauth-session`: Next.js server routes (API endpoints).
- `app/api/auth/oauth-start`: Next.js server routes (API endpoints).
- `app/api/auth/resend-confirmation`: Next.js server routes (API endpoints).
- `app/api/auth/session`: Next.js server routes (API endpoints).
- `app/api/auth/set-password`: Next.js server routes (API endpoints).
- `app/api/auth/signup`: Next.js server routes (API endpoints).
- `app/api/auth/update-password`: Next.js server routes (API endpoints).
- `app/api/system/account-status-emails`: Next.js server routes (API endpoints).
- `app/api/system/workflow-notifications`: Next.js server routes (API endpoints).
- `app/auth/callback`: Folder.
- `app/auth/confirm`: Folder.
- `app/billing`: Folder.
- `app/calendar`: Folder.
- `app/cases`: Folder.
- `app/check-email`: Folder.
- `app/client-portal/[token]`: Folder.
- `app/forgot-password`: Folder.
- `app/leads`: Folder.
- `app/login`: Folder.
- `app/reset-password`: Folder.
- `app/settings`: Folder.
- `app/signup`: Folder.
- `app/tasks`: Folder.
- `app/templates`: Folder.
- `app/today`: Folder.
- `components`: React components for operator UI + client portal.
- `components/layout`: Shared layout shells/headers used across operator pages.
- `components/ui`: UI primitives (view states, badges helpers, small utilities).
- `docs`: Product + implementation docs (scope, env, rollout, rules).
- `docs/project-input`: Folder.
- `docs/workspace-files`: Folder.
- `lib`: Core product logic (types, store, snapshot, domain rules).
- `lib/access`: Folder.
- `lib/account`: Folder.
- `lib/auth`: Auth/session/cookies + access enforcement utilities.
- `lib/billing`: Folder.
- `lib/data`: Folder.
- `lib/mail`: Email templates + notification payloads.
- `lib/mailer`: Folder.
- `lib/promo`: Folder.
- `lib/repository`: Repository/domain layer: workspace-scoped data model and dashboards.
- `lib/security`: Security helpers (rate limit, token safety).
- `lib/storage`: Upload policy + signed access helpers.
- `lib/supabase`: Supabase clients/admin/server helpers.
- `public`: Public static assets (icons, manifest assets).
- `scripts`: Dev/automation scripts (launch, tooling).
- `supabase`: SQL migrations/schema for Supabase (tables, RLS, triggers).
- `tests`: Regression tests covering auth/access/workflow/repository.

## Indeks plików (każdy plik w repo)

### .

- `.env.example` - File.
- `.gitignore` - File.
- `.npmrc` - File.
- `agent.md` - Agent rules + product source-of-truth + workflow constraints.
- `etapy.md` - Docs: ETAP 0 - definicja produktu i dokumentacja.
- `kierunek.txt` - File.
- `kontrola leadów.txt` - File.
- `middleware.ts` - Next.js middleware / request gatekeeping (auth/access routing).
- `next-env.d.ts` - Source module.
- `next.config.ts` - Next.js configuration.
- `package-lock.json` - File.
- `package.json` - Project scripts + deps (Next/React/TS) for ClientPilot.
- `product-scope-v2.md` - Docs: Definicja produktu.
- `README.md` - Top-level README (project entry, product summary).
- `start_leadflow_with_tests.bat` - File.
- `start_leadflow_with_tests.ps1` - File.
- `start_leadflow.bat` - File.
- `start_leadflow.ps1` - File.
- `tsconfig.json` - TypeScript config (app build).
- `tsconfig.tests.json` - TypeScript config (tests build).
- `vercel.json` - File.

### app

- `app/globals.css` - Global CSS: tokens + Visual System Lock + component styles + responsive rules.
- `app/layout.tsx` - Next.js root layout (global wrapper, metadata import, globals.css).
- `app/manifest.ts` - PWA manifest definition.
- `app/page.tsx` - Module default export `HomePage` (see file for details).
- `app/providers.tsx` - App-level client providers (global state/session/theme wiring).

### app/access-blocked

- `app/access-blocked/page.tsx` - Next.js page route: `/access-blocked`.

### app/activity

- `app/activity/page.tsx` - Next.js page route: `/activity`.

### app/api/access/redeem-code

- `app/api/access/redeem-code/route.ts` - Next.js route handler: `/api/access/redeem-code`.

### app/api/app/snapshot

- `app/api/app/snapshot/route.ts` - Next.js route handler: `/api/app/snapshot`.

### app/api/auth/ensure-core-state

- `app/api/auth/ensure-core-state/route.ts` - Next.js route handler: `/api/auth/ensure-core-state`.

### app/api/auth/forgot-password

- `app/api/auth/forgot-password/route.ts` - Next.js route handler: `/api/auth/forgot-password`.

### app/api/auth/login

- `app/api/auth/login/route.ts` - Next.js route handler: `/api/auth/login`.

### app/api/auth/logout

- `app/api/auth/logout/route.ts` - Next.js route handler: `/api/auth/logout`.

### app/api/auth/oauth-session

- `app/api/auth/oauth-session/route.ts` - Next.js route handler: `/api/auth/oauth-session`.

### app/api/auth/oauth-start

- `app/api/auth/oauth-start/route.ts` - Next.js route handler: `/api/auth/oauth-start`.

### app/api/auth/resend-confirmation

- `app/api/auth/resend-confirmation/route.ts` - Next.js route handler: `/api/auth/resend-confirmation`.

### app/api/auth/session

- `app/api/auth/session/route.ts` - Next.js route handler: `/api/auth/session`.

### app/api/auth/set-password

- `app/api/auth/set-password/route.ts` - Next.js route handler: `/api/auth/set-password`.

### app/api/auth/signup

- `app/api/auth/signup/route.ts` - Next.js route handler: `/api/auth/signup`.

### app/api/auth/update-password

- `app/api/auth/update-password/route.ts` - Next.js route handler: `/api/auth/update-password`.

### app/api/system/account-status-emails

- `app/api/system/account-status-emails/route.ts` - Next.js route handler: `/api/system/account-status-emails`.

### app/api/system/workflow-notifications

- `app/api/system/workflow-notifications/route.ts` - Next.js route handler: `/api/system/workflow-notifications`.

### app/auth/callback

- `app/auth/callback/page.tsx` - Next.js page route: `/auth/callback`.

### app/auth/confirm

- `app/auth/confirm/route.ts` - Source module.

### app/billing

- `app/billing/page.tsx` - Next.js page route: `/billing`.

### app/calendar

- `app/calendar/page.tsx` - Next.js page route: `/calendar`.

### app/cases

- `app/cases/page.tsx` - Next.js page route: `/cases`.

### app/check-email

- `app/check-email/page.tsx` - Next.js page route: `/check-email`.

### app/client-portal/[token]

- `app/client-portal/[token]/page.tsx` - Next.js page route: `/client-portal/[token]`.

### app/forgot-password

- `app/forgot-password/page.tsx` - Next.js page route: `/forgot-password`.

### app/leads

- `app/leads/page.tsx` - Next.js page route: `/leads`.

### app/login

- `app/login/page.tsx` - Next.js page route: `/login`.

### app/reset-password

- `app/reset-password/page.tsx` - Next.js page route: `/reset-password`.

### app/settings

- `app/settings/page.tsx` - Next.js page route: `/settings`.

### app/signup

- `app/signup/page.tsx` - Next.js page route: `/signup`.

### app/tasks

- `app/tasks/page.tsx` - Next.js page route: `/tasks`.

### app/templates

- `app/templates/page.tsx` - Next.js page route: `/templates`.

### app/today

- `app/today/page.tsx` - Next.js page route: `/today`.

### components

- `components/account-status-panel.tsx` - React UI component (operator UI / portal UI composition).
- `components/auth-shell.tsx` - React UI component (operator UI / portal UI composition).
- `components/client-portal-page.tsx` - React UI component (operator UI / portal UI composition).
- `components/confirm-dialog.tsx` - React UI component (operator UI / portal UI composition).
- `components/dashboard-shell.tsx` - React UI component (operator UI / portal UI composition).
- `components/today-page-view.tsx` - React UI component (operator UI / portal UI composition).
- `components/views.tsx` - React UI component (operator UI / portal UI composition).

### components/layout

- `components/layout/page-shell.tsx` - Layout component (shared shells/headers for operator UI).

### components/ui

- `components/ui/risk.ts` - UI primitive / helper (view states, labels, small utilities).
- `components/ui/view-state.tsx` - UI primitive / helper (view states, labels, small utilities).

### docs

- `docs/data-model-lead-case.md` - Docs: Data Model Lead -> Case.
- `docs/EMAIL_SETUP.md` - Docs: ClientPilot — konfiguracja maili.
- `docs/environment-matrix.md` - Docs: ENVIRONMENT MATRIX.
- `docs/etap-0-hard-rules.md` - Docs: ETAP 0 - HARD RULES.
- `docs/etap-1-konta-techniczne-i-srodowiska.md` - Docs: ETAP 1 - KONTA TECHNICZNE I SRODOWISKA.
- `docs/etapy_wdrozenia_v1_lead_followup_app_2026-04-03.md` - Docs: Etapy wdrożenia V1 — aplikacja lead follow-up + kalendarz + przypomnienia.
- `docs/leadcrm_template_source.jsx` - Docs / project notes.
- `docs/LISTA_DO_ZROBIENIA_ETAP_1_REALNA_WERYFIKACJA_BUILDA.md` - Docs: LISTA DO ZROBIENIA.
- `docs/REPO_MAP.md` - Docs: Jak używać.
- `docs/zakres_v1_lead_followup_app_2026-04-03.md` - Docs: Zakres V1 - status.
- `docs/zasady.md` - Docs: zasady.md.

### docs/project-input

- `docs/project-input/LISTA_DO_ZROBIENIA_ETAP_1_REALNA_WERYFIKACJA_BUILDA.md` - Docs: LISTA DO ZROBIENIA.
- `docs/project-input/README-WDROZENIE.md` - Docs: ClientPilot — etap auth bez zmiany UI.
- `docs/project-input/za┼éo┼╝enia g┼é├│wne.md` - Docs / project notes.
- `docs/project-input/zakres_v1_lead_followup_app_2026-04-03.md` - Docs: Zakres V1 - status.
- `docs/project-input/zasady.md` - Docs: zasady.md.

### docs/workspace-files

- `docs/workspace-files/LISTA_DO_ZROBIENIA_ETAP_1_REALNA_WERYFIKACJA_BUILDA.md` - Docs: LISTA DO ZROBIENIA.
- `docs/workspace-files/README-WDROZENIE.md` - Docs: ClientPilot — etap auth bez zmiany UI.
- `docs/workspace-files/za┼éo┼╝enia g┼é├│wne.md` - Docs / project notes.
- `docs/workspace-files/zakres_v1_lead_followup_app_2026-04-03.md` - Docs: Zakres V1 - status.
- `docs/workspace-files/zasady.md` - Docs: zasady.md.

### lib

- `lib/client-portal-token.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/constants.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/seed.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/snapshot.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/store.tsx` - Core library (types, utils, store, snapshot, domain logic).
- `lib/today.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/types.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/utils.ts` - Core library (types, utils, store, snapshot, domain logic).

### lib/access

- `lib/access/account-status.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/access/decision.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/access/machine.ts` - Core library (types, utils, store, snapshot, domain logic).

### lib/account

- `lib/account/account-settings.ts` - Core library (types, utils, store, snapshot, domain logic).

### lib/auth

- `lib/auth/cookies.ts` - Auth library (session, cookies, rate limits, policy).
- `lib/auth/email.ts` - Auth library (session, cookies, rate limits, policy).
- `lib/auth/messages.ts` - Auth library (session, cookies, rate limits, policy).
- `lib/auth/rate-limit.ts` - Auth library (session, cookies, rate limits, policy).
- `lib/auth/request.ts` - Auth library (session, cookies, rate limits, policy).
- `lib/auth/session-provider.tsx` - Auth library (session, cookies, rate limits, policy).
- `lib/auth/session.ts` - Auth library (session, cookies, rate limits, policy).
- `lib/auth/supabase-errors.ts` - Auth library (session, cookies, rate limits, policy).

### lib/billing

- `lib/billing/webhooks.ts` - Core library (types, utils, store, snapshot, domain logic).

### lib/data

- `lib/data/actions.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/data/repository.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/data/snapshot-selection.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/data/storage-adapter.ts` - Core library (types, utils, store, snapshot, domain logic).
- `lib/data/storage-key.ts` - Core library (types, utils, store, snapshot, domain logic).

### lib/mail

- `lib/mail/config.ts` - Email templates/planning (account status + workflow notifications).
- `lib/mail/resend.ts` - Email templates/planning (account status + workflow notifications).
- `lib/mail/status-planner.ts` - Email templates/planning (account status + workflow notifications).
- `lib/mail/templates.ts` - Email templates/planning (account status + workflow notifications).

### lib/mailer

- `lib/mailer/system.ts` - Core library (types, utils, store, snapshot, domain logic).

### lib/promo

- `lib/promo/service.ts` - Core library (types, utils, store, snapshot, domain logic).

### lib/repository

- `lib/repository/access-codes.server.ts` - Repository layer (domain model + query/mutation + online storage).
- `lib/repository/access-state.server.ts` - Repository layer (domain model + query/mutation + online storage).
- `lib/repository/bootstrap.ts` - Repository layer (domain model + query/mutation + online storage).
- `lib/repository/cases-dashboard.ts` - Repository layer (domain model + query/mutation + online storage).
- `lib/repository/lead-case.domain.ts` - Repository layer (domain model + query/mutation + online storage).
- `lib/repository/promo-codes.server.ts` - Repository layer (domain model + query/mutation + online storage).
- `lib/repository/schema.ts` - Repository layer (domain model + query/mutation + online storage).

### lib/security

- `lib/security/rate-limit.ts` - Security primitives (rate limiting, portal token safety).

### lib/storage

- `lib/storage/signed-access.ts` - Storage primitives (upload policy, signed access).
- `lib/storage/upload-policy.ts` - Storage primitives (upload policy, signed access).

### lib/supabase

- `lib/supabase/access-status.ts` - Supabase integration (client/admin/server helpers).
- `lib/supabase/admin.ts` - Supabase integration (client/admin/server helpers).
- `lib/supabase/app-snapshot.ts` - Supabase integration (client/admin/server helpers).
- `lib/supabase/browser.ts` - Supabase integration (client/admin/server helpers).
- `lib/supabase/config.ts` - Supabase integration (client/admin/server helpers).
- `lib/supabase/server.ts` - Supabase integration (client/admin/server helpers).

### public

- `public/icon.svg` - Static public asset (icons, PWA assets).

### scripts

- `scripts/gen-repo-map.mjs` - Source module.
- `scripts/launch-dev.mjs` - Source module.
- `scripts/open-browser-after-ready.mjs` - Source module.

### supabase

- `supabase/001_init.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/002_workspace_access_model.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/003_access_status_bonus.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/004_system_email_events.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/005_access_state_machine.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/006_user_core_state_backfill.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/007_trial_starts_after_email_confirmation.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/008_admin_access_override.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/009_tester_access_codes.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/010_promo_codes_central_access_effects.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/011_lead_case_bridge.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/012_status_layers.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).
- `supabase/013_security_storage_audit.sql` - SQL migration / schema for Supabase (tables, RLS, triggers).

### tests

- `tests/access-decision.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/access-machine.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/account-status.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/auth-browser.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/auth-route-policy.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/auth-session.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/cases-dashboard.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/etap16-flow.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/lead-case-domain.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/node-shims.d.ts` - Node test (domain/repository/auth/access regression).
- `tests/repository-model.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/repository.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/security-portal.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/snapshot-selection.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/snapshot.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/status-email-planner.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/today.test.ts` - Node test (domain/repository/auth/access regression).
- `tests/utils.test.ts` - Node test (domain/repository/auth/access regression).

