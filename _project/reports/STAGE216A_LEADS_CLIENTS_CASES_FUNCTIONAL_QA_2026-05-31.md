---
typ: raport_stage
stage: Stage216-A
status: prepared
project: CloseFlow / LeadFlow
data: 2026-05-31
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
---

# Stage216-A - Leads / Clients / Cases functional QA

## Cel

Ustalić, czy rdzeń CRM po migracji Supabase działa funkcjonalnie: leady, klienci, sprawy, ich detail pages i relacje.

To jest etap QA + bramka do poprawek. Nie wykonuje automatycznych napraw runtime.

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- poprzedni etap: Stage215 Supabase Coverage Matrix
- report_id: STAGE216A_LEADS_CLIENTS_CASES_FUNCTIONAL_QA_2026-05-31

## FAKTY

- Stage216-A is a functional QA gate for Leads / Clients / Cases after Stage215 coverage matrix.
- The frontend API wrapper throws INVALID_API_RESPONSE when an endpoint returns non-JSON/raw content, so runtime endpoint checks matter.
- Server Supabase access requires SUPABASE_SERVICE_ROLE_KEY and a Supabase URL, so missing env can still break API while build passes.
- Clients and cases APIs require workspace context and scoped write access for mutations.
- No SQL, RLS, GRANT, data mutation, cleanup, or runtime UI patch is performed by this stage.

## DECYZJE DAMIANA / OPERACYJNE

- Do not repair every module at once.
- Stage216-A only covers Leads / Clients / Cases.
- Runtime write probes are opt-in only and disabled by default.
- If Stage216-A finds runtime FAILs, split fixes into Stage216-A1/A2/A3 rather than one large risky patch.

## HIPOTEZY AI

- Likely failure class #1: detail pages can fail after hard refresh if id/detail endpoint shape differs from list DTO assumptions.
- Likely failure class #2: relation creation lead → client → case can fail through workspace scoping or duplicate conflict logic.
- Likely failure class #3: empty-state UI may be acceptable visually but still hide INVALID_API_RESPONSE errors in console.

## Zakres

| ID | Moduł | API | UI | Funkcje klienta | Relacje | Static status | Runtime status |
|---|---|---|---|---|---|---|---|
| LCC-01 | Leads list | `/api/leads` | `/leads` | `fetchLeadsFromSupabase`, `insertLeadToSupabase`, `updateLeadInSupabase`, `deleteLeadFromSupabase`, `findEntityConflictsInSupabase` | lead → client; lead → case via linked_case_id / start_service | STATIC_PASS / STATIC_PASS | RUNTIME_NOT_RUN |
| LCC-02 | Lead detail | `/api/leads?id=:id` | `/leads/:id` | `fetchLeadByIdFromSupabase`, `updateLeadInSupabase`, `startLeadServiceInSupabase`, `fetchActivitiesFromSupabase` | lead detail → activities; lead detail → case link; lead detail → client link | STATIC_PASS / STATIC_PASS | RUNTIME_NOT_RUN |
| LCC-03 | Clients list | `/api/clients` | `/clients` | `fetchClientsFromSupabase`, `createClientInSupabase`, `updateClientInSupabase`, `deleteClientFromSupabase`, `findEntityConflictsInSupabase` | client → cases; client → tasks/events via relations; client archive hides child work from calendar | STATIC_PASS / STATIC_PASS | RUNTIME_NOT_RUN |
| LCC-04 | Client detail | `/api/clients?id=:id` | `/clients/:clientId` | `fetchClientByIdFromSupabase`, `fetchCasesFromSupabase`, `fetchLeadsFromSupabase`, `fetchTasksFromSupabase`, `fetchEventsFromSupabase`, `fetchPaymentsFromSupabase` | client detail → cases; client detail → acquisition history; client detail → payments | STATIC_PASS / STATIC_PASS | RUNTIME_NOT_RUN |
| LCC-05 | Cases list | `/api/cases` | `/cases` | `fetchCasesFromSupabase`, `createCaseInSupabase`, `updateCaseInSupabase`, `deleteCaseFromSupabase` | case → client; case → lead; case → primary case for client | STATIC_PASS / STATIC_PASS | RUNTIME_NOT_RUN |
| LCC-06 | Case detail | `/api/cases?id=:id` | `/cases/:id` | `fetchCaseByIdFromSupabase`, `fetchCaseItemsFromSupabase`, `fetchActivitiesFromSupabase`, `fetchPaymentsFromSupabase` | case detail → items; case detail → activities; case detail → portal; case detail → payments | STATIC_PASS / STATIC_PASS | RUNTIME_NOT_RUN |

## Trasy hard-refresh

- [ ] `/`
- [ ] `/leads`
- [ ] `/clients`
- [ ] `/cases`
- [ ] `/leads/:id`
- [ ] `/clients/:clientId`
- [ ] `/cases/:id`

## Manual QA checklist

### LCC-01 - Leads list

- [ ] Open /leads after hard refresh.
- [ ] Create a lead with name, company, phone/email, value and source.
- [ ] Open created lead detail.
- [ ] Edit status/value/next action.
- [ ] Move/convert lead to service/case if UI exposes this action.
- [ ] Archive/delete lead and verify it disappears from active list.
- [ ] Console has no `INVALID_API_RESPONSE`.
- [ ] Network response is JSON, not HTML/error shell.
- [ ] Data still appears after `CTRL+F5`.

### LCC-02 - Lead detail

- [ ] Open an existing lead detail directly by URL.
- [ ] Hard refresh the detail page.
- [ ] Confirm no INVALID_API_RESPONSE appears.
- [ ] Confirm empty/missing id shows controlled not-found/error state.
- [ ] Console has no `INVALID_API_RESPONSE`.
- [ ] Network response is JSON, not HTML/error shell.
- [ ] Data still appears after `CTRL+F5`.

### LCC-03 - Clients list

- [ ] Open /clients after hard refresh.
- [ ] Create a client with name, company and contact fields.
- [ ] Edit contact fields and save.
- [ ] Confirm duplicate conflict dialog does not block valid explicit override.
- [ ] Archive/delete client and verify active list excludes archived row.
- [ ] Console has no `INVALID_API_RESPONSE`.
- [ ] Network response is JSON, not HTML/error shell.
- [ ] Data still appears after `CTRL+F5`.

### LCC-04 - Client detail

- [ ] Open client detail directly by URL.
- [ ] Hard refresh client detail.
- [ ] Confirm related cases and acquisition history render.
- [ ] Create a new case from client if UI exposes this action.
- [ ] Confirm no useWorkspace/useParams runtime crash.
- [ ] Console has no `INVALID_API_RESPONSE`.
- [ ] Network response is JSON, not HTML/error shell.
- [ ] Data still appears after `CTRL+F5`.

### LCC-05 - Cases list

- [ ] Open /cases after hard refresh.
- [ ] Create case without linked lead but with client contact fields.
- [ ] Create case linked to existing lead/client if possible.
- [ ] Edit status and finance fields.
- [ ] Archive/delete case and confirm list excludes archived row.
- [ ] Console has no `INVALID_API_RESPONSE`.
- [ ] Network response is JSON, not HTML/error shell.
- [ ] Data still appears after `CTRL+F5`.

### LCC-06 - Case detail

- [ ] Open case detail directly by URL.
- [ ] Hard refresh case detail.
- [ ] Confirm tasks/events/activity/case items are stable.
- [ ] Add/update a case item or note if UI exposes this action.
- [ ] Confirm portal readiness/action panel does not throw.
- [ ] Console has no `INVALID_API_RESPONSE`.
- [ ] Network response is JSON, not HTML/error shell.
- [ ] Data still appears after `CTRL+F5`.


## Opcjonalny runtime probe

Domyślnie probe jest GET-only i nie zapisuje danych.

```powershell
$env:CLOSEFLOW_APP_URL="http://localhost:3000"
$env:CLOSEFLOW_WORKSPACE_ID="REAL_WORKSPACE_UUID"
# opcjonalnie, jeśli endpoint wymaga tokenu:
# $env:CLOSEFLOW_ACCESS_TOKEN="SUPABASE_ACCESS_TOKEN"
node tools/stage216a-lcc-api-probe.cjs
```

Write probe jest wyłączony. Nie uruchamiać go bez osobnej decyzji.

## TESTY AUTOMATYCZNE

```powershell
node scripts/check-stage216a-lcc-functional-qa.cjs
npm run build
```

## RYZYKA

- Build PASS nie potwierdza runtime Supabase.
- Lista może działać, a detail page może padać po hard refresh.
- GET może działać, a POST/PATCH/DELETE może padać przez workspace/RLS/access gate.
- Nie mieszać tego etapu z tasks/events/calendar.

## NASTĘPNY KROK

- Run static Stage216-A guard.
- Run optional GET-only probe against local or production URL with real workspace/auth headers.
- Perform manual QA checklist for /leads, /clients, /cases and detail routes.
- Record PASS/FAIL evidence in this report before any Stage216-A fix.
