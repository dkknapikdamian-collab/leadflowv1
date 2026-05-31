---
typ: raport_stage
stage: Stage215
status: coverage_matrix_prepared
project: CloseFlow / LeadFlow
data: 2026-05-31
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
---

# Stage215 - Supabase Coverage Matrix + Functional QA

## Cel

Ten etap definiuje, kiedy mozna powiedziec, ze migracja Supabase jest ogarnieta. Nie naprawia kodu, nie zmienia SQL, nie zmienia RLS, nie zmienia GRANT i nie dotyka danych Supabase.

Stage215 tworzy macierz:

```text
tabela/storage -> API endpoint -> funkcja klienta -> ekran UI -> test manualny -> status
```

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- poprzednie etapy: Stage213B, Stage213C-A, Stage213C-B, Stage213C-C, Stage214
- generated_at: 2026-05-31T19:43:49.257Z

## Scan evidence

- api files: 12
- page files: 28
- lib files: 81
- server files: 43
- migration files: 44
- structural pass: 5
- structural gap: 7
- modules total: 12

## Definicja DONE dla Supabase

Supabase migration mozna uznac za ogarnieta dopiero wtedy, gdy:

- kazdy obszar krytyczny ma structural status `STRUCTURAL_PASS` albo jawnie opisany accepted gap,
- kazdy obszar krytyczny ma manual QA `PASS`,
- nie ma `INVALID_API_RESPONSE` w konsoli dla glownego flow,
- hard refresh dziala na trasach: `/`, `/leads`, `/clients`, `/cases`, `/tasks`, `/calendar`, `/notifications`, `/settings`,
- workspace scope dziala i nie miesza danych miedzy workspace,
- portal klienta nie pokazuje danych operatora,
- storage upload, jesli testowany, ma kontrolowana sciezke i aktywny bucket,
- query budget po Stage213C nie wraca do polling/retry storm.

## Macierz pokrycia

| obszar | tabele / storage | API | UI | structural | QA | braki strukturalne |
|---|---|---|---|---|---|---|
| Auth + workspace context | profiles, workspaces, workspace_members | /api/me, /api/workspace-settings, /api/system?kind=profile-settings | /login, /settings | STRUCTURAL_GAP | DO_WYKONANIA | api:workspace-settings |
| Leads | leads | /api/leads | /leads, /leads/:id | STRUCTURAL_PASS | DO_WYKONANIA | brak |
| Clients | clients | /api/clients | /clients, /clients/:id | STRUCTURAL_PASS | DO_WYKONANIA | brak |
| Cases | cases, case_items | /api/cases, /api/case-items | /cases, /cases/:id | STRUCTURAL_PASS | DO_WYKONANIA | brak |
| Tasks | tasks | /api/tasks, /api/system?apiRoute=tasks | /tasks, /, /calendar | STRUCTURAL_GAP | DO_WYKONANIA | api:tasks |
| Events + Calendar | events | /api/events, /api/system?apiRoute=events | /calendar, / | STRUCTURAL_GAP | DO_WYKONANIA | api:events |
| Notifications | tasks, events, leads, activities | /api/system?kind= | /notifications | STRUCTURAL_PASS | DO_WYKONANIA | brak |
| Activities | activities | /api/activities | /activity, /cases/:id, /leads/:id, /clients/:id | STRUCTURAL_PASS | DO_WYKONANIA | brak |
| Payments + billing | payments, workspaces | /api/payments, /api/billing-checkout, /api/billing-actions, /api/workspace-settings | /billing, /leads/:id, /cases/:id, /clients/:id | STRUCTURAL_GAP | DO_WYKONANIA | api:payments; api:billing-actions; api:workspace-settings |
| AI drafts + response templates | ai_drafts, response_templates | /api/system?kind=ai-drafts, /api/response-templates | /ai-drafts, /templates, / | STRUCTURAL_GAP | DO_WYKONANIA | api:response-templates |
| Client portal + storage upload | client_portal_tokens, cases, case_items, activities, storage bucket | /api/client-portal-tokens, /api/client-portal-session, /api/storage-upload, /api/case-items | /portal, /cases/:id | STRUCTURAL_GAP | DO_WYKONANIA | api:client-portal-tokens; api:client-portal-session |
| Support + settings | support_requests, profiles, workspaces | /api/support-requests, /api/system?kind=profile-settings, /api/workspace-settings | /support, /settings | STRUCTURAL_GAP | DO_WYKONANIA | api:support-requests; api:workspace-settings |

## Manual QA checklist

### Auth + workspace context

- status strukturalny: STRUCTURAL_GAP
- status QA: DO_WYKONANIA
- krytyczny flow: login -> workspace context -> x-workspace-id headers -> scoped API reads
- testy reczne:
  - [ ] Login with real operator account.
  - [ ] Open /settings and confirm workspace/profile data loads.
  - [ ] Hard refresh / and /settings. Confirm no INVALID_API_RESPONSE.
  - [ ] Confirm workspace id persists and data does not switch to another workspace.

### Leads

- status strukturalny: STRUCTURAL_PASS
- status QA: DO_WYKONANIA
- krytyczny flow: create/read/update/archive/start service
- testy reczne:
  - [ ] Create a lead with name, phone/email, source, value and next action.
  - [ ] Hard refresh /leads and detail page. Confirm lead persists.
  - [ ] Edit status/value/next action. Confirm Today and Calendar react correctly.
  - [ ] Archive/delete lead only through intended UI and confirm it does not leak into active views.

### Clients

- status strukturalny: STRUCTURAL_PASS
- status QA: DO_WYKONANIA
- krytyczny flow: create/read/update/archive primary-case
- testy reczne:
  - [ ] Create or convert a client.
  - [ ] Open client detail after hard refresh.
  - [ ] Edit contact data and primary case.
  - [ ] Confirm archived clients do not pollute active calendar/task lists.

### Cases

- status strukturalny: STRUCTURAL_PASS
- status QA: DO_WYKONANIA
- krytyczny flow: case CRUD + case item checklist + portal preparation
- testy reczne:
  - [ ] Create case linked to client or lead.
  - [ ] Open case detail after hard refresh.
  - [ ] Add/update checklist item.
  - [ ] Confirm related tasks/events/activities show proper context.

### Tasks

- status strukturalny: STRUCTURAL_GAP
- status QA: DO_WYKONANIA
- krytyczny flow: task CRUD + done + Today/Calendar propagation
- testy reczne:
  - [ ] Create task from Tasks and from Calendar.
  - [ ] Mark task done from Today.
  - [ ] Hard refresh /tasks, /, and /calendar.
  - [ ] Confirm parent archived client/case filtering still works.

### Events + Calendar

- status strukturalny: STRUCTURAL_GAP
- status QA: DO_WYKONANIA
- krytyczny flow: event CRUD + calendar hard refresh + Google sync non-blocking refresh
- testy reczne:
  - [ ] Create event from Calendar.
  - [ ] Edit and move event.
  - [ ] Hard refresh /calendar.
  - [ ] Check Google sync status and ensure local calendar remains usable if Google sync fails.

### Notifications

- status strukturalny: STRUCTURAL_PASS
- status QA: DO_WYKONANIA
- krytyczny flow: derived notifications + read/snooze/log without full bundle spam
- testy reczne:
  - [ ] Open /notifications with overdue task/event/lead.
  - [ ] Snooze notification.
  - [ ] Mark notification read.
  - [ ] Return after hard refresh and confirm no error in console.

### Activities

- status strukturalny: STRUCTURAL_PASS
- status QA: DO_WYKONANIA
- krytyczny flow: activity writes from reminders/portal/operations and scoped reads
- testy reczne:
  - [ ] Trigger activity from reminder or case action.
  - [ ] Open activity list.
  - [ ] Confirm activity links to correct lead/case/client.
  - [ ] Confirm no cross-workspace activity leakage.

### Payments + billing

- status strukturalny: STRUCTURAL_GAP
- status QA: DO_WYKONANIA
- krytyczny flow: payment CRUD + billing checkout + subscription access gates
- testy reczne:
  - [ ] Create payment row in context of lead/case/client.
  - [ ] Edit payment status.
  - [ ] Open /billing and verify current access copy.
  - [ ] Dry-run checkout if payment env is not production-ready.

### AI drafts + response templates

- status strukturalny: STRUCTURAL_GAP
- status QA: DO_WYKONANIA
- krytyczny flow: draft read/approve + template CRUD
- testy reczne:
  - [ ] Create or view AI draft.
  - [ ] Approve draft into lead if configured.
  - [ ] Create response template.
  - [ ] Hard refresh template page and confirm persistence.

### Client portal + storage upload

- status strukturalny: STRUCTURAL_GAP
- status QA: DO_WYKONANIA
- krytyczny flow: operator creates token -> client opens portal -> uploads file -> case item updates
- testy reczne:
  - [ ] Create portal token for case.
  - [ ] Open portal session.
  - [ ] Upload small test file.
  - [ ] Confirm file path/item status/activity persist and no operator data leaks.

### Support + settings

- status strukturalny: STRUCTURAL_GAP
- status QA: DO_WYKONANIA
- krytyczny flow: support ticket + profile/workspace settings
- testy reczne:
  - [ ] Create support request.
  - [ ] Append reply or status if admin path is available.
  - [ ] Update profile/workspace settings.
  - [ ] Hard refresh settings and support page.


## Krytyczne reguly

- Nie uzywaj `git add .`.
- Nie tworz ani nie uruchamiaj SQL w tym etapie.
- Nie zmieniaj RLS ani GRANT w tym etapie.
- Nie kasuj backupow w tym etapie.
- Jezeli test manualny wykryje blad, zapisz go jako osobny Stage216-* fix, a nie naprawiaj wszystkiego naraz.

## Proponowana kolejnosc po Stage215

1. Stage216-A - leads/clients/cases CRUD and detail page fixes.
2. Stage216-B - tasks/events/calendar relation fixes.
3. Stage216-C - notifications/activity QA fixes.
4. Stage216-D - portal/storage QA fixes.
5. Stage216-E - settings/billing/support QA fixes.

## Testy wykonawcze

```powershell
node tools/stage215-generate-supabase-coverage-matrix.cjs
node scripts/check-stage215-supabase-coverage-matrix.cjs
npm run build
```

## Wynik

Stage215 jest audytem/macierza. Nie wykonano cleanupu, nie wykonano SQL, nie zmieniono RLS, nie zmieniono GRANT, nie zmieniono danych Supabase.
