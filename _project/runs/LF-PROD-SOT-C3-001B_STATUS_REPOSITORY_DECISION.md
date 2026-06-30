# LF-PROD-SOT-C3-001B_STATUS_REPOSITORY_DECISION

Date: 2026-06-30 18:15 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Stage: LF-PROD-SOT-C3-001B_STATUS_REPOSITORY_DECISION
Consistency closeout: LF-PROD-SOT-C3-001B-R1_REPORT_CONSISTENCY_CLOSEOUT

## 1. Werdykt

Status:

```txt
LF-PROD-SOT-C3-001B:
STATUS_REPOSITORY_DECISION_DONE / DOMAIN_SPLIT_APPROVED_FOR_DESIGN / LOCAL_CLEAN_CHECK_PASS / NO_RUNTIME_CHANGE / READY_FOR_001C_DESIGN_ONLY
```

Technical decision:

```txt
First design should include only:
- Lead entity status
- Case entity status
```

Local clean check was confirmed from the Windows repo on 2026-06-30 17:59 Europe/Warsaw and recorded in commit `d8b79953`.

No runtime status repository was created.
No runtime imports were rewired.
No CSS, SQL, Supabase, API, auth, routes or Google Calendar code was changed.

## 2. PROJECT_SCAN

Read mode: decision pass based on the 001A map, source files and local clean confirmation.

Previous reports read:

```txt
_project/runs/LF-PROD-SOT-C3-001A_STATUS_MAP_ONLY.md
_project/runs/LF-PROD-SOT-C3-LOCAL-CHECK-PASS-CLOSEOUT.md
_project/runs/LF-PROD-SOT-C3-001B_SUPERSEDED_BY_LOCAL_CHECK_PASS.md
```

001A status found:

```txt
MAP_DELIVERED_REMOTE / NO_RUNTIME_CHANGE / LOCAL_GIT_CHECK_PENDING
```

001B local closeout status found:

```txt
LOCAL_CLEAN_CHECK_PASS / NO_RUNTIME_CHANGE / READY_FOR_001C_DESIGN_ONLY
```

## 3. LOCAL_CLEAN_CHECK

```txt
LOCAL_CLEAN_CHECK:
- command: git pull --ff-only origin dev-rollout-freeze
- result: PASS
- command: git status --short --branch
- result: PASS / CLEAN BEFORE CLOSEOUT
- command: git diff --check
- result: PASS
- verdict: LOCAL_CLEAN_CHECK_PASS
```

Recorded local command output came from the Windows working tree:

```txt
C:\Users\malim\Desktop\biznesy_ai\2.closeflow
```

## 4. Pliki przeczytane

```txt
_project/runs/LF-PROD-SOT-C3-001A_STATUS_MAP_ONLY.md
_project/runs/LF-PROD-SOT-C3-LOCAL-CHECK-PASS-CLOSEOUT.md
_project/runs/LF-PROD-SOT-C3-001B_SUPERSEDED_BY_LOCAL_CHECK_PASS.md
AGENTS.md
package.json
src/App.tsx
src/lib/routes.ts
src/components/Layout.tsx
src/lib/domain-statuses.ts
src/lib/source-of-truth/lead-options.ts
src/lib/source-of-truth/case-options.ts
src/lib/source-of-truth/client-options.ts
src/lib/source-of-truth/schedule-options.ts
src/lib/data-contract.ts
src/lib/finance/finance-types.ts
src/lib/finance/finance-normalize.ts
src/lib/calendar-items.ts
src/lib/owner-control/owner-risk-rules.ts
src/pages/Leads.tsx
src/pages/Cases.tsx
src/pages/TasksStable.tsx
src/pages/Templates.tsx
src/pages/ResponseTemplates.tsx
api/leads.ts
api/cases.ts
api/system.ts
```

## 5. Pliki nieistniejące

```txt
src/lib/source-of-truth/status-repository.ts - FILE_NOT_FOUND / EXPECTED / DO_NOT_CREATE_IN_001B
```

## 6. STATUS_REPOSITORY_DECISION

```txt
STATUS_REPOSITORY_DECISION:
- final verdict: DESIGN_ONLY_NEXT
- local clean check: PASS
- domains allowed into first design:
  - Lead entity status
  - Case entity status
- domains excluded:
  - Lead visibility
  - Lead sales outcome
  - Lead risk badges
  - Client health/source/portal
  - Client lifecycle/archive
  - Case filters/lifecycle buckets
  - Case item/portal item
  - Task entity status for first pass
  - Task UI scopes/groups
  - Task blocker/missing semantics
  - Event entity status for first pass
  - Event calendar sync
  - Calendar visibility
  - Google Calendar sync
  - Payment status
  - Billing/access status
  - Commission status/mode/base
  - Owner Control risk
  - Activity taxonomy
  - Templates lifecycle metadata
  - ResponseTemplates lifecycle metadata
- domains requiring Damian decision:
  - approve first design scope as Lead + Case only
  - decide if Task/Event stay later until blocker/calendar split
  - decide if finance/billing/commission get separate owner/repository
  - decide if legacy aliases are migration-only or permanent compatibility
- domains requiring separate repository:
  - finance/payment/commission
  - billing/access
  - calendar/sync
  - owner-control risk badges
  - activity taxonomy
  - template lifecycle/content metadata
- domains requiring migration/alias audit:
  - Lead legacy aliases
  - Case legacy aliases
  - Task legacy aliases
  - Event legacy aliases
  - Payment legacy aliases
  - Billing/access mixed legacy values
- forbidden runtime changes:
  - no status-repository implementation
  - no import rewiring
  - no UI/component/CSS/API/SQL/auth/routes/Google Calendar changes
```

## 7. DOMAIN_SPLIT_TABLE

| Domain | Include in first status repository design? | Keep separate? | Reason | Risk | Decision needed? |
|---|---:|---:|---|---|---:|
| Lead entity status | YES | NO | Mature entity status set with labels/options. | HIGH | YES |
| Lead visibility | NO | YES | Visibility/trash/archive state is not lead status. | HIGH | YES |
| Lead sales outcome | NO | YES | Outcome is business result, not lifecycle status. | HIGH | YES |
| Lead risk badges | NO | YES | Owner-control/risk badge domain. | MEDIUM | NO |
| Client health/source/portal | NO | YES | Derived classification, not DB status. | MEDIUM | NO |
| Client lifecycle/archive | NO | YES | Timestamp/metadata state. | HIGH | YES |
| Case entity status | YES | NO | Mature entity status set with labels/options. | HIGH | YES |
| Case filters/lifecycle buckets | NO | YES | Page filter/lifecycle projection, not DB enum. | HIGH | YES |
| Case item/portal item | NO | YES | Checklist/portal domain overlaps but is separate. | HIGH | YES |
| Task entity status | NO for first pass | YES for now | Blocked by missing/blocker and UI group semantics. | CRITICAL | YES |
| Task UI scopes/groups | NO | YES | View/filter state only. | HIGH | NO |
| Event entity status | NO for first pass | YES for now | Needs calendar/sync separation first. | HIGH | YES |
| Calendar visibility | NO | YES | Projection/visibility domain. | CRITICAL | YES |
| Google Calendar sync | NO | YES | External sync state, not entity status. | CRITICAL | YES |
| Payment status | NO | YES | Finance domain. | CRITICAL | YES |
| Billing/access status | NO | YES | Access/billing domain, mixed today. | CRITICAL | YES |
| Commission status/mode/base | NO | YES | Finance/commission domain. | CRITICAL | YES |
| Owner Control risk | NO | YES | Badge/severity domain. | MEDIUM | NO |
| Activity taxonomy | NO | YES | eventType/actorType taxonomy. | MEDIUM | NO |
| Templates lifecycle metadata | NO | YES | archivedAt/category/tags metadata. | LOW | NO |
| ResponseTemplates lifecycle metadata | NO | YES | archivedAt/category/tags/variables metadata. | LOW | NO |
| Legacy aliases | NO | YES | Compatibility/migration layer. | CRITICAL | YES |

## 8. DAMIAN_DECISION_QUEUE

### 1. Czy pierwszy projekt status repository ma obejmować tylko Lead + Case entity status?

```txt
rekomendacja developera: TAK, tylko Lead + Case entity status.
ryzyko: niskie w porównaniu do Task/Event/Finance, ale nadal wymagany design-only etap.
co się stanie, jeśli źle zdecydujemy: status repo zacznie mieszać entity status z filtrami i visibility, co popsuje listy i badge.
sugerowany następny etap: LF-PROD-SOT-C3-001C_STATUS_REPOSITORY_DESIGN_ONLY
```

### 2. Czy Task/Event zostawić na później do czasu rozdzielenia blocker/calendar semantics?

```txt
rekomendacja developera: TAK, zostawić na później.
ryzyko: wysokie, bo Task miesza UI scopes i missing/blocker, a Event miesza lifecycle z Calendar/Google sync.
co się stanie, jeśli źle zdecydujemy: można zepsuć work_items status constraints, kalendarz i filtrację zadań.
sugerowany następny etap: osobny C3 task/event semantics split po Lead+Case design.
```

### 3. Czy finance/billing/commission robić jako osobny etap i osobny owner?

```txt
rekomendacja developera: TAK, osobny finance/access owner.
ryzyko: krytyczne, bo to są pieniądze, dostęp, płatności i prowizje.
co się stanie, jeśli źle zdecydujemy: błędne liczniki płatności, rozjazd prowizji, zły access status.
sugerowany następny etap: C3_FINANCE_STATUS_DOMAIN_DECISION po Lead+Case.
```

### 4. Czy legacy aliases zostają migration-only czy permanent compatibility layer?

```txt
rekomendacja developera: zostawić jako compatibility layer do czasu audytu danych.
ryzyko: krytyczne przy usunięciu bez audytu.
co się stanie, jeśli źle zdecydujemy: stare rekordy przestaną normalizować się do poprawnych statusów.
sugerowany następny etap: LEGACY_STATUS_ALIAS_DATA_AUDIT przed jakimkolwiek usuwaniem.
```

### 5. Czy Client health/source/portal mają pozostać derived classification poza status repository?

```txt
rekomendacja developera: TAK, poza status repository.
ryzyko: średnie.
co się stanie, jeśli źle zdecydujemy: klient dostanie sztuczny DB status, który będzie dublował zdrowie, źródło i portal.
sugerowany następny etap: brak teraz; zostawić client-options jako derived SOT.
```

## 9. Domeny dopuszczone do pierwszego design-only

```txt
Lead entity status
Case entity status
```

Warunek: tylko design-only, bez runtime.

## 10. Domeny wykluczone z pierwszego design-only

```txt
Lead visibility
Lead sales outcome
Lead risk badges
Client health/source/portal
Client lifecycle/archive
Case filters/lifecycle buckets
Case item/portal item
Task entity status
Task UI scopes/groups
Task blocker/missing semantics
Event entity status
Event calendar sync
Calendar visibility
Google Calendar sync
Payment status
Billing/access status
Commission status/mode/base
Owner Control risk
Activity taxonomy
Templates lifecycle metadata
ResponseTemplates lifecycle metadata
Legacy aliases
```

## 11. Domeny wymagające osobnego ownera/repository

```txt
finance/payment/commission
billing/access
calendar/sync
owner-control risk
activity taxonomy
template lifecycle/content metadata
```

## 12. Domeny wymagające migration/alias audit

```txt
Lead legacy aliases
Case legacy aliases
Task legacy aliases
Event legacy aliases
Payment aliases
Billing/access mixed values
```

## 13. Czego nie wolno centralizować

```txt
UI filters
page scopes
derived badges
risk badges
visibility/trash/archive state
sales outcome
Google Calendar sync state
payment/billing/commission in one generic bucket
legacy aliases as primary status definitions
```

## 14. Czego nie ruszano

```txt
runtime: NOT_TOUCHED
CSS: NOT_TOUCHED
SQL: NOT_TOUCHED
Supabase: NOT_TOUCHED
API: NOT_TOUCHED
auth: NOT_TOUCHED
routes: NOT_TOUCHED
Google Calendar: NOT_TOUCHED
legacy aliases: NOT_TOUCHED
status-repository.ts: NOT_CREATED
```

## 15. Następny etap

```txt
LF-PROD-SOT-C3-001C_STATUS_REPOSITORY_DESIGN_ONLY
```

Guard:

```txt
001C remains design-only. No runtime implementation allowed.
```

## 16. Zapis do Obsidiana

```txt
data i godzina: 2026-06-30 18:15 Europe/Warsaw
name/alias: LF-PROD-SOT-C3-001B status repository decision
stage_id: LF-PROD-SOT-C3-001B_STATUS_REPOSITORY_DECISION
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target app report: _project/runs/LF-PROD-SOT-C3-001B_STATUS_REPOSITORY_DECISION.md
target obsidian payload: _project/obsidian_updates/2026-06-30_LF-PROD-SOT-C3-001B_STATUS_REPOSITORY_DECISION.md
save status: APP_REPORT_CORRECTED_BY_R1
Obsidian GitHub sync: APP_PAYLOAD_UPDATED
Obsidian local sync: OBSIDIAN_LOCAL_SYNC_PENDING
tests:
- git status --short --branch: PASS / CLEAN BEFORE CLOSEOUT
- git diff --check: PASS
- status-repository.ts exists: FALSE / EXPECTED
risk audit: 001C may start only as design-only; runtime implementation remains forbidden
what was not touched: runtime, CSS, SQL, Supabase, API, auth, routes, Google Calendar, legacy aliases
next step: LF-PROD-SOT-C3-001C_STATUS_REPOSITORY_DESIGN_ONLY
```

## LOCAL_CLEAN_CHECK_CONFIRMATION

```txt
data i godzina: 2026-06-30 17:59 Europe/Warsaw
stage_id: LF-PROD-SOT-C3-001B_STATUS_REPOSITORY_DECISION
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
git pull --ff-only origin dev-rollout-freeze: PASS
git status --short --branch: PASS / CLEAN BEFORE CLOSEOUT
git diff --check: PASS
runtime touched: NO
CSS touched: NO
SQL/API/auth/routes/Google Calendar touched: NO
status-repository.ts created: NO
final verdict:
LF-PROD-SOT-C3-001B:
STATUS_REPOSITORY_DECISION_DONE / DOMAIN_SPLIT_APPROVED_FOR_DESIGN / LOCAL_CLEAN_CHECK_PASS / NO_RUNTIME_CHANGE / READY_FOR_001C_DESIGN_ONLY
next step:
LF-PROD-SOT-C3-001C_STATUS_REPOSITORY_DESIGN_ONLY
```
