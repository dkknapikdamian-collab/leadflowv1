# LF-PROD-SOT-001A — Mapowanie statusów

Date: 2026-06-30 19:32 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY

## Status

```txt
STATUS_MAP_DONE / READY_FOR_001B_STATUS_REPOSITORY / LOCAL_GUARDS_PASS / OBSIDIAN_LOCAL_SYNC_DONE
```

001A is closed as audit/map-only.

No runtime implementation was created.
No `src/lib/source-of-truth/status-repository.ts` was created.
No imports were rewired.
No UI, CSS, SQL, Supabase, routing, auth or data-provider changes were made.

## Wejście

```txt
Previous stage: LF-PROD-SOT-CLEANUP-000 = CLOSED / READY_FOR_MAPPING_001
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Remote HEAD before 001A map: 578b4276835bae56a791ca3225f9a930edeb4958
Map report remote commit: ed0a02890ea37f04b6c440958fce0a19d3efad90
Local verified HEAD: ed0a0289 — docs(closeflow): complete production status source map
```

## Local verification pasted by Damian

```txt
git pull --ff-only origin dev-rollout-freeze: PASS / fast-forward 578b4276..ed0a0289
git status --short --branch: PASS / ## dev-rollout-freeze...origin/dev-rollout-freeze
git branch --show-current: PASS / dev-rollout-freeze
git log --oneline -1: PASS / ed0a0289 docs(closeflow): complete production status source map
npm run guard:routes:canonical: PASS / ok true / screensChecked 17
npm run guard:ui:patch-layers: PASS / ok true / knownDebt recorded, no failure
npm run check:polish-mojibake: PASS / OK no Polish mojibake detected
git diff --check: PASS / no output
git status --short --branch after guards: PASS / ## dev-rollout-freeze...origin/dev-rollout-freeze
Obsidian git pull --ff-only origin main: PASS / fast-forward 9229d72e..42e423ca
Obsidian git status --short --branch -- . ":(exclude).tmp.driveupload": PASS / ## main...origin/main
```

## Zakres

Mapowane encje: Lead, Client, Case, Task, Event, Payment, Missing item / blocker, Calendar Done, Owner Control, Activity, Finance / commission.

## STATUS_MAP

### Lead status

- statusy: `new`, `contacted`, `qualification`, `proposal_sent`, `waiting_response`, `negotiation`, `accepted`, `won`, `lost`, `moved_to_service`, `archived`.
- label/helper: `src/lib/domain-statuses.ts`; meta/tone/pill: `src/lib/source-of-truth/lead-options.ts`; tone class: `src/lib/source-of-truth/ui-tones.ts`.
- duplikaty: `src/lib/work-items/normalize.ts` fallbackuje lead status do `new`; `src/lib/owner-control/owner-control-baseline.ts` ma własny closed set; `src/lib/config/badges.ts` mapuje statusy na klasy pigułek.
- użycia: `src/pages/Leads.tsx`, `src/pages/LeadDetail.tsx`, owner-control, work-items.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE / LOCAL_COLOR_MAP / DUPLICATE_STATUS_LOGIC`.
- rekomendowane SOT 001B: adapter oparty o `domain-statuses.ts` + `lead-options.ts`, nie nowa lista od zera.

### Client status

- statusy: brak jednego prostego `client.status`; aktualny model to derived `clientHealth` (`in_progress`, `onboarding`, `needs_attention`, `in_sales`, `needs_linking`, `unknown`), `clientSource` i `portalStatus`.
- label/tone/helper: `src/lib/source-of-truth/client-options.ts` (`deriveClientHealthValue`, `getClientHealthMeta`, `getPortalStatusMeta`).
- duplikaty: `src/lib/owner-control/owner-control-baseline.ts` ma lokalny `ACTIVE_CLIENT_SERVICE_STATUSES`; `src/pages/Clients.tsx` ma relation filters: `without_case`, `needs_contact`, `active_commission`, `archived`.
- użycia: `src/pages/Clients.tsx`, `src/pages/ClientDetail.tsx`, owner-control, finance summary.
- kategoria: `DERIVED_STATUS / UI_ONLY_STATUS / LOCAL_STATUS_MAP`.
- rekomendowane SOT 001B: nie robić jednego `clientStatus`; rozdzielić `clientHealth`, `clientSource`, `portalStatus`.

### Case status

- statusy: `new`, `waiting_on_client`, `blocked`, `to_approve`, `ready_to_start`, `in_progress`, `on_hold`, `completed`, `canceled`, `archived`.
- label/helper: `src/lib/domain-statuses.ts` i `src/lib/source-of-truth/case-options.ts` przez `src/lib/config/case-status.ts`.
- rozjazd: `completed` ma label `Zakonczona` w `domain-statuses.ts`, ale `Zamknieta` w `case-options.ts`.
- duplikaty: `src/lib/case-lifecycle-v1.ts` ma derived buckets; `src/pages/Cases.tsx` ma `CaseView` i lokalne lifecycle varianty.
- użycia: `src/pages/Cases.tsx`, `src/pages/CaseDetail.tsx`, `src/lib/cases.ts`, `src/lib/case-lifecycle-v1.ts`.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE / LOCAL_LABEL_MAP / DERIVED_STATUS / DUPLICATE_STATUS_LOGIC`.
- rekomendowane SOT 001B: rozdzielić `case.status`, `caseLifecycle.bucket`, `caseItem.status`.

### Task status

- statusy: canonical `todo`, `scheduled`, `in_progress`, `done`, `canceled`, `deleted`; aliases `open`, `completed`, `cancelled`, `archived`.
- label/helper: `src/lib/domain-statuses.ts`, `src/lib/source-of-truth/schedule-options.ts`, `src/lib/config/calendar-status.ts`.
- duplikaty: `src/lib/work-items/normalize.ts` fallbackuje do `todo`; `src/components/work-item-card.tsx` wylicza tone z labela/overdue; `src/lib/config/badges.ts` ma lokalną klasę.
- użycia: Today, Tasks, Calendar, LeadDetail, CaseDetail, WorkItemCard.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE / FALLBACK_STATUS / DUPLICATE_STATUS_LOGIC`.
- rekomendowane SOT 001B: centralny `taskStatus` label/closed/done; bez przepinania całego Calendar.

### Event status

- statusy: canonical `scheduled`, `in_progress`, `done`, `canceled`, `deleted`; aliases `planned`, `open`, `completed`, `cancelled`.
- label/helper: `domain-statuses.ts` i `schedule-options.ts`.
- rozjazd: event `done` = `Zrobione` w domain, ale `Odbyte` w schedule-options.
- duplikaty: `Calendar.tsx` ma status w edit draft; `scheduling.ts` eksportuje operational status helpers; `work-item-card.tsx` tonuje po labelu.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE / LOCAL_LABEL_MAP / DUPLICATE_STATUS_LOGIC`.
- rekomendowane SOT 001B: osobne meta dla `task.done` i `event.done`.

### Payment status

- statusy: `planned`, `due`, `paid`, `cancelled`.
- label/helper: `src/lib/finance/finance-types.ts`, `src/lib/finance/finance-normalize.ts`.
- duplikaty: `src/lib/finance/case-finance-source.ts` ma własne `PAID_LIKE_STATUSES` i `DUE_LIKE_STATUSES`, szersze niż canonical payment enum.
- użycia: Case finance, billing, payments, CaseSettlement.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE / LEGACY_STATUS / DUPLICATE_STATUS_LOGIC`.
- rekomendowane SOT 001B: jawnie rozdzielić `payment.status`, `payment.type`, `paidLike`, `dueLike`; nie zaczynać od finance runtime.

### Missing item / blocker status

- statusy/kind: aktywne `missing_item`, `blocking_missing_item`, `blocksProgress=true`; zamknięte: `resolved`, `deleted`, `done`, `completed`, `closed`, `cancelled`, `canceled`, `archived`.
- label/helper: `src/lib/owner-control/owner-control-missing-blockers.ts`, `src/lib/activity-timeline.ts`, detail pages.
- duplikaty: Owner Control i Activity Timeline mają osobne wykrywanie Brak/Blokada; `case-options.ts` ma legacy case item status.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE / DERIVED_STATUS / LEGACY_STATUS / DUPLICATE_STATUS_LOGIC`.
- rekomendowane SOT 001B: active missing = source task/work item + explicit source record; historia nie może być aktywnym źródłem.

### Calendar Done status

- statusy: closed/done sets: `done`, `completed`, `cancelled`, `canceled`, `archived`, `deleted`; operational action policy przez `scheduling.ts` i `calendar-operational-entry-contract`.
- duplikaty: `schedule-options.ts` `CLOSED_WORK_ITEM_STATUSES`, `work-item-card.tsx` regex na labelu, `case-lifecycle-v1.ts` własne open action logic.
- kategoria: `DERIVED_STATUS / DUPLICATE_STATUS_LOGIC`.
- rekomendowane SOT 001B: nie ruszać Calendar jako pierwszego; opisać boundary task/event/lead-shadow.

### Owner Control status

- statusy/warstwy: severity `critical`, `warning`, `normal`; closed set; client service set; missing severity; note-without-followup gap.
- helper: `src/lib/owner-control/owner-control-baseline.ts`, `owner-control-missing-blockers.ts`, `next-move-contract.ts`, `activity-truth.ts`.
- duplikaty: `CLOSED_RECORD_STATUSES` zawiera statusy lead/case/task razem; `ACTIVE_CLIENT_SERVICE_STATUSES` jest lokalną mapą client service.
- kategoria: `DERIVED_STATUS / LOCAL_STATUS_MAP / DUPLICATE_STATUS_LOGIC`.
- rekomendowane SOT 001B: Owner Control ma być konsumentem repozytorium statusów, nie źródłem.

### Activity status

- statusy/typy: event types zawierające `status`, `task`, `event`, `missing_item`, `payment`, `paid`, `billing`, `case_created`, `case_linked`, `lead_moved`, `converted`.
- helper: `src/lib/activity-timeline.ts` (`getActivityTimelineTitle`, `getActivityTimelineDescription`, `normalizeActivityTimelineItem`).
- duplikaty: własne rozpoznanie missing/blocker/payment; formatter status transition zależny od wstrzykniętego `statusLabel`.
- kategoria: `UI_ONLY_STATUS / LOCAL_LABEL_MAP / DUPLICATE_STATUS_LOGIC`.
- rekomendowane SOT 001B: status repository powinien eksportować formattery per entity do activity timeline.

### Finance / commission status

- statusy: commission `not_set`, `expected`, `due`, `partially_paid`, `paid`, `overdue`; payment `planned`, `due`, `paid`, `cancelled`; billing/access statusy także w `domain-statuses.ts`.
- helper: `normalizeCommissionStatus`, `deriveCommissionStatus`, `getCaseFinanceSummary`, `getCaseCommissionPaidAmount`, `buildCaseFinancePatch`.
- duplikaty: `deriveCommissionStatus` liczy status z payments; `buildCaseFinancePatch` zapisuje cache `commissionStatus: not_set`; `domain-statuses.ts` miesza billing/payment/commission-like values.
- kategoria: `DERIVED_STATUS / SOURCE_OF_TRUTH_CANDIDATE / LEGACY_STATUS`.
- rekomendowane SOT 001B: finance/commission tylko jako read-only derived contract; nie przywracać ręcznego selecta.

## Najważniejsze duplikaty

| Encja | Duplikat | Pliki | Ryzyko | Rekomendacja |
|---|---|---|---|---|
| Lead | values/meta/tone/closed set w wielu miejscach | `domain-statuses.ts`, `lead-options.ts`, `badges.ts`, `owner-control-baseline.ts` | label/tone drift | adapter w 001B |
| Client | health/source/portal vs local service statuses | `client-options.ts`, `owner-control-baseline.ts`, `Clients.tsx` | fałszywy jeden status klienta | multi-dimensional status |
| Case | label mismatch `completed` | `domain-statuses.ts`, `case-options.ts` | niespójne UI copy | jedna decyzja label |
| Case lifecycle | source status vs derived bucket | `case-lifecycle-v1.ts`, `Cases.tsx` | bucket jako status źródłowy | rozdzielić |
| Task/Event | domain vs schedule aliases | `domain-statuses.ts`, `schedule-options.ts` | done znaczy co innego | osobne meta |
| Payment | canonical vs paid-like | `finance-types.ts`, `case-finance-source.ts` | błędne naliczenie paid | jawna compatibility layer |
| Missing | active vs history | `owner-control-missing-blockers.ts`, `activity-timeline.ts` | historia wskrzesza brak | source-record contract |
| Calendar Done | kilka closed setów | `schedule-options.ts`, `work-item-card.tsx`, `case-lifecycle-v1.ts` | zła akcja complete/delete | zostawić na później |
| Commission | derived vs cache/manual | `finance-normalize.ts`, `case-finance-source.ts` | powrót ręcznego statusu | read-only derived |

## Kandydaci do 001B

Tak, można w 001B stworzyć `src/lib/source-of-truth/status-repository.ts`, ale jako warstwę spinającą istniejące definicje, nie jako nowe niezależne źródło.

Rekomendowany układ 001B:

```txt
status-repository.ts
- re-export/adapters dla domain-statuses.ts,
- entity meta: lead, case, task, event, payment, missing, ownerControl, activity, commission,
- explicit: source vs derived vs UI-only vs legacy,
- explicit legacyAliases,
- no runtime migration in first commit.
```

Najbezpieczniejsze ograniczone podpięcie w 001B:

```txt
1. Leads / LeadDetail — już używają lead-options/config.
2. Cases / CaseDetail — tylko read-only label/meta, bez lifecycle refactoru.
```

Nie ruszać w pierwszym 001B:

```txt
Calendar, Finance/CaseSettlement, Owner Control, ClientDetail, MissingItemsManager, Supabase/API.
```

## Czego nie ruszano

```txt
runtime: NOT_TOUCHED
CSS: NOT_TOUCHED
SQL: NOT_TOUCHED
Supabase: NOT_TOUCHED
routing: NOT_TOUCHED
auth: NOT_TOUCHED
UI redesign: NOT_TOUCHED
data provider: NOT_TOUCHED
status repository: NOT_CREATED
```

## Ryzyka po zamknięciu

```txt
- 001B nie może być big-bang refactorem,
- 001B może podpiąć tylko 1–2 najbardziej ryzykowne widoki,
- statusy wyliczane, np. prowizja, nie mogą wrócić jako ręczny select,
- Missing item / blocker musi respektować source record,
- Calendar Done nie może mieszać task/event/case/lead-shadow,
- Client status nie może zostać spłaszczony do jednego selecta,
- Case lifecycle bucket nie może zostać pomylony z case.status.
```

## Decyzja

```txt
LF-PROD-SOT-001A:
STATUS_MAP_DONE / READY_FOR_001B_STATUS_REPOSITORY

Następny etap:
LF-PROD-SOT-001B — Status repository

001B musi być osobnym etapem.
```

## Zapis do Obsidiana

```txt
data i godzina: 2026-06-30 19:32 Europe/Warsaw
name/alias: LF-PROD-SOT-001A status map closeout
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target app report: _project/runs/LF-PROD-SOT-001A_STATUS_MAP.md
target obsidian path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-001A_STATUS_MAP.md
save status: APP_REPORT_PUSHED_REMOTE / OBSIDIAN_REPORT_PUSHED_REMOTE / LOCAL_PASS_CONFIRMED
Obsidian GitHub sync: DONE_REMOTE
Obsidian local sync: DONE / ## main...origin/main
tests:
- guard:routes:canonical: PASS
- guard:ui:patch-layers: PASS
- check:polish-mojibake: PASS
- git diff --check: PASS
risk audit: 001A closed; 001B allowed only as status repository stage, no big-bang runtime refactor
what was not touched: runtime, CSS, SQL, Supabase, routing, auth, UI redesign, data provider
next step: LF-PROD-SOT-001B — Status repository
```
