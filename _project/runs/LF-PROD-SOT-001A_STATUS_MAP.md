# LF-PROD-SOT-001A — Mapowanie statusów

Date: 2026-06-30 19:10 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY

## Status

```txt
STATUS_MAP_DONE_REMOTE / APP_REPORT_PUSHED / OBSIDIAN_PAYLOAD_REQUIRED / LOCAL_GUARDS_PENDING / DO_NOT_START_001B_BEFORE_LOCAL_PASS
```

This stage is audit/map-only.

No runtime implementation was created.
No `src/lib/source-of-truth/status-repository.ts` was created.
No imports were rewired.
No UI, CSS, SQL, Supabase, routing, auth or data-provider changes were made.

The map is complete enough for the next design step, but the stage must be locally reverified before it is treated as fully closed.

## Wejście

```txt
Previous stage:
LF-PROD-SOT-CLEANUP-000 = CLOSED / READY_FOR_MAPPING_001

Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
HEAD at start of remote mapping: 578b4276835bae56a791ca3225f9a930edeb4958 — docs(closeflow): close production sot cleanup preflight
```

## Zakres

Mapowane encje:

```txt
Lead
Client
Case
Task
Event
Payment
Missing item / blocker
Calendar Done
Owner Control
Activity
Finance / commission
```

## STATUS_MAP

### Lead status

- obecne statusy: `new`, `contacted`, `qualification`, `proposal_sent`, `waiting_response`, `negotiation`, `accepted`, `won`, `lost`, `moved_to_service`, `archived`.
- label: głównie `src/lib/domain-statuses.ts` (`LEAD_STATUS_META`), z override dla `moved_to_service` w `src/lib/source-of-truth/lead-options.ts`.
- tone/color: `src/lib/source-of-truth/lead-options.ts` (`LEAD_STATUS_TONES`) + `src/lib/source-of-truth/ui-tones.ts` (`LEAD_DETAIL_PILL_CLASS_BY_TONE`).
- helper: `normalizeLeadStatus`, `getLeadStatusMeta`, `getLeadStatusLabel`, `getLeadStatusTone`, `getLeadStatusPillClass`, `isClosedLeadStatus`.
- lokalne duplikaty: `src/lib/work-items/normalize.ts` normalizuje lead status jako surowy lowercase/fallback `new`; `src/lib/owner-control/owner-control-baseline.ts` ma własne closed status set; `src/lib/config/badges.ts` mapuje statusy do klas pigułek niezależnie od `lead-options.ts`.
- pliki użycia: `src/pages/Leads.tsx`, `src/pages/LeadDetail.tsx`, `src/lib/lead-health.ts`, `src/lib/lead-service-state.ts`, `src/lib/owner-control/*`, `src/lib/work-items/normalize.ts`.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE` + `LOCAL_COLOR_MAP` + `DUPLICATE_STATUS_LOGIC`.
- ryzyko: różne labelki i tony dla tego samego statusu; fallback `new` może ukryć nieznany status.
- rekomendowane SOT: w 001B nie tworzyć definicji od zera; użyć `domain-statuses.ts` jako bazę wartości/legacy normalize i spiąć z `lead-options.ts` jako meta/tone adapter.

### Client status

- obecne statusy: brak jednego prostego `client.status` SOT. Aktualny model to głównie derived health/source/portal: `in_progress`, `onboarding`, `needs_attention`, `in_sales`, `needs_linking`, `unknown`; source: `client`, `lead`, `manual`, `case`, `import`, `unknown`; portal: `enabled`, `disabled`, `pending`, `unknown`.
- label: `src/lib/source-of-truth/client-options.ts`.
- tone/color: `badgeClassName` w `client-options.ts`.
- helper: `deriveClientHealthValue`, `resolveClientHealthValue`, `getClientHealthMeta`, `getClientHealthLabel`, `getClientHealthTone`, `getClientSourceMeta`, `getPortalStatusValue`, `getPortalStatusMeta`, `getPortalStatusLabel`.
- lokalne duplikaty: `src/lib/owner-control/owner-control-baseline.ts` ma `ACTIVE_CLIENT_SERVICE_STATUSES`; `src/pages/Clients.tsx` ma relation filters (`without_case`, `needs_contact`, `active_commission`, `archived`) i finansowe helpery; `src/lib/work-items/normalize.ts` nie centralizuje client status, tylko relacje.
- pliki użycia: `src/pages/Clients.tsx`, `src/pages/ClientDetail.tsx`, `src/lib/source-of-truth/client-options.ts`, `src/lib/owner-control/owner-control-baseline.ts`, `src/lib/finance/case-finance-source.ts`.
- kategoria: `DERIVED_STATUS` + `UI_ONLY_STATUS` + `LOCAL_STATUS_MAP`.
- ryzyko: klient ma kilka wymiarów statusu, więc zrobienie jednego płaskiego selecta byłoby błędem.
- rekomendowane SOT: 001B powinien traktować Client jako kilka wymiarów: `clientHealth`, `clientSource`, `portalStatus`, a nie jeden `clientStatus`.

### Case status

- obecne statusy: `new`, `waiting_on_client`, `blocked`, `to_approve`, `ready_to_start`, `in_progress`, `on_hold`, `completed`, `canceled`, `archived`.
- label: `src/lib/domain-statuses.ts` i osobno `src/lib/source-of-truth/case-options.ts`; zauważalny rozjazd: `domain-statuses.ts` ma `completed: Zakonczona`, `case-options.ts` ma `completed: Zamknieta`.
- tone/color: `case-options.ts` (`CASE_STATUS_TONES`) + `ui-tones.ts` (`CASE_DETAIL_PILL_CLASS_BY_TONE`) + `config/badges.ts`.
- helper: `normalizeCaseStatus`, `getCaseStatusLabel`, `getCaseStatusHint`, `getCaseStatusTone`, `getCaseClientPillClass`, `getCaseDetailPillClass`, `isClosedCaseStatus`, `caseStatusBadgeVariant`.
- lokalne duplikaty: `src/lib/case-lifecycle-v1.ts` ma własne lifecycle buckets (`blocked`, `waiting_approval`, `ready_to_start`, `in_progress`, `completed`, `needs_next_step`); `src/pages/Cases.tsx` ma `CaseView` (`open`, `closed`, `waiting`, `blocked`, `approval`, `ready`, `needs_next_step`, `linked`) i lokalne varianty lifecycle.
- pliki użycia: `src/pages/Cases.tsx`, `src/pages/CaseDetail.tsx`, `src/lib/config/case-status.ts`, `src/lib/cases.ts`, `src/lib/case-lifecycle-v1.ts`, `src/lib/source-of-truth/case-options.ts`.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE` + `LOCAL_LABEL_MAP` + `DERIVED_STATUS` + `DUPLICATE_STATUS_LOGIC`.
- ryzyko: case status, checklist/case_item status i lifecycle bucket mogą być mylone jako jeden status.
- rekomendowane SOT: w 001B rozdzielić `case.status` od `caseLifecycle.bucket` i od `caseItemStatus`.

### Task status

- obecne statusy: canonical `todo`, `scheduled`, `in_progress`, `done`, `canceled`, `deleted`; compatibility aliases `open`, `completed`, `cancelled`, `archived`.
- label: `src/lib/domain-statuses.ts` i `src/lib/source-of-truth/schedule-options.ts`.
- tone/color: brak pełnej centralnej mapy status->tone; `src/components/work-item-card.tsx` wylicza `success/danger/neutral` z labela i overdue flag; `src/lib/config/badges.ts` ma lokalną klasę pigułki.
- helper: `normalizeTaskStatus`, `getTaskStatusLabel`, `isDoneStatus`, `isClosedWorkItemStatus`, `normalizeWorkItem`.
- lokalne duplikaty: `schedule-options.ts` utrzymuje aliasy poza `domain-statuses.ts`; `work-items/normalize.ts` fallbackuje do `todo` bez walidacji przez `normalizeTaskStatus`; `work-item-card.tsx` interpretuje status przez tekst labela.
- pliki użycia: `src/pages/TodayStable.tsx`, `src/pages/TasksStable.tsx`, `src/pages/Calendar.tsx`, `src/pages/LeadDetail.tsx`, `src/pages/CaseDetail.tsx`, `src/components/work-item-card.tsx`, `src/lib/work-items/*`.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE` + `FALLBACK_STATUS` + `DUPLICATE_STATUS_LOGIC`.
- ryzyko: status taska może być traktowany jako calendar done, owner-control done albo delete state.
- rekomendowane SOT: 001B powinien najpierw zcentralizować `taskStatus` label/closed/done semantics, bez przepinania wszystkich widoków.

### Event status

- obecne statusy: canonical `scheduled`, `in_progress`, `done`, `canceled`, `deleted`; compatibility aliases `planned`, `open`, `completed`, `cancelled`.
- label: `src/lib/domain-statuses.ts` i `src/lib/source-of-truth/schedule-options.ts`; event `done` ma label `Zrobione` w `domain-statuses.ts`, ale `Odbyte` w `schedule-options.ts`.
- tone/color: `config/badges.ts`, `work-item-card.tsx`, calendar entry styling, operational-entry contract.
- helper: `normalizeEventStatus`, `getCalendarEventStatusLabel`, `isDoneStatus`, `normalizeEventV1`.
- lokalne duplikaty: `Calendar.tsx` edytuje/odczytuje `status` w draftach; `scheduling.ts` eksportuje operational status helpers; `schedule-options.ts` ma alias mapę odrębną od `domain-statuses.ts`.
- pliki użycia: `src/pages/Calendar.tsx`, `src/pages/TodayStable.tsx`, `src/pages/LeadDetail.tsx`, `src/pages/CaseDetail.tsx`, `src/components/work-item-card.tsx`, `src/lib/scheduling.ts`.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE` + `LOCAL_LABEL_MAP` + `DUPLICATE_STATUS_LOGIC`.
- ryzyko: `done` dla eventu jest zdarzeniem odbytym, niekoniecznie tym samym co task done.
- rekomendowane SOT: 001B rozdziela `task.done = Zrobione` od `event.done = Odbyte`.

### Payment status

- obecne statusy: `planned`, `due`, `paid`, `cancelled`.
- label: brak osobnego `payment-options.ts`; statusy są w `src/lib/finance/finance-types.ts` i normalizacja w `finance-normalize.ts`.
- tone/color: brak jednego jawnego SOT; UI prawdopodobnie czyta finance summary albo lokalne komponenty finance.
- helper: `normalizePaymentStatus`, `normalizeFinancePayment`, `normalizeFinancePayments`.
- lokalne duplikaty: `case-finance-source.ts` ma własne `PAID_LIKE_STATUSES` i `DUE_LIKE_STATUSES`, szersze niż canonical payment status (`confirmed`, `settled`, `completed`, `done`, `pending`, `awaiting_payment`, `open`).
- pliki użycia: `src/lib/finance/finance-types.ts`, `src/lib/finance/finance-normalize.ts`, `src/lib/finance/case-finance-source.ts`, `src/components/finance/CaseSettlementSection.tsx`, `src/pages/CaseDetail.tsx`, `src/pages/Billing.tsx`.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE` + `LEGACY_STATUS` + `DUPLICATE_STATUS_LOGIC`.
- ryzyko: paid-like statusy finansowe są szersze niż payment status enum; można policzyć wpłatę jako paid bez jawnego statusu `paid`.
- rekomendowane SOT: 001B nie powinien przepinać finansów jako pierwszy. Najpierw opisać `payment.status`, `payment.type`, `paidLike`, `dueLike` jako jawne różne warstwy.

### Missing item / blocker status

- obecne statusy/kind: aktywne `missing_item`, `blocking_missing_item`, `blocksProgress=true`; zamknięte `resolved`, `deleted`, `done`, `completed`, `closed`, `cancelled`, `canceled`, `archived`.
- label: Owner Control `Brak` / `Blokada`; Activity Timeline `Brak` / `Blokada`; Case item legacy labels osobno.
- tone/color: Owner Control severity `warning` / `critical`; UI missing/blocker tone w LeadDetail/CaseDetail/ClientDetail; brak jednego status-tone repo.
- helper: `isOwnerMissingControlItem`, `buildMissingOwnerControlItems`, `isBlockingMissingItem`, `getActivityTimelineTitle`, `getActivityTimelineDescription`, `normalizeWorkItem`.
- lokalne duplikaty: `activity-timeline.ts` ma własne rozpoznawanie `missing_item`; `owner-control-missing-blockers.ts` ma własny closed set; LeadDetail/CaseDetail mają historyczne kontrakty aktywnych braków; `case-options.ts` ma legacy `CaseItemStatusValue`.
- pliki użycia: `src/lib/owner-control/owner-control-missing-blockers.ts`, `src/lib/activity-timeline.ts`, `src/pages/LeadDetail.tsx`, `src/pages/CaseDetail.tsx`, `src/pages/ClientDetail.tsx`, `src/components/detail/MissingItemsManagerDialog.tsx`.
- kategoria: `SOURCE_OF_TRUTH_CANDIDATE` + `DERIVED_STATUS` + `LEGACY_STATUS` + `DUPLICATE_STATUS_LOGIC`.
- ryzyko: case_items/checklist status może być pomylony z aktywnym missing_item; historia nie może wskrzeszać aktywnych braków.
- rekomendowane SOT: 001B powinien zdefiniować missing/blocker status contract jako źródłowy task/work item plus flags, bez ruszania case_items.

### Calendar Done status

- obecne statusy: done/completed/cancelled/canceled/archived/deleted jako closed; operational status przez `calendar-operational-entry-contract` eksportowany z `scheduling.ts`.
- label: `schedule-options.ts`, `domain-statuses.ts`, `Calendar.tsx` action labels.
- tone/color: `work-item-card.tsx` sukces/danger/neutral; Calendar CSS i entry classes.
- helper: `isDoneStatus`, `isCompletedOperationalStatus`, `normalizeOperationalStatus`, `getSupportedOperationalEntryActions`, `getOperationalEntryActionDecision`.
- lokalne duplikaty: `schedule-options.ts` `CLOSED_WORK_ITEM_STATUSES`, `work-item-card.tsx` regex na labelu, `case-lifecycle-v1.ts` własne `isOpenAction`.
- pliki użycia: `src/pages/Calendar.tsx`, `src/pages/TodayStable.tsx`, `src/lib/scheduling.ts`, `src/lib/calendar-operational-entry-contract.ts`, `src/lib/calendar-operational-entry-action-policy.ts`, `src/components/work-item-card.tsx`.
- kategoria: `DERIVED_STATUS` + `DUPLICATE_STATUS_LOGIC`.
- ryzyko: lead shadow entry nie może dostać akcji complete/delete/restore jak task/event.
- rekomendowane SOT: w 001B nie dotykać Calendar jako pierwszego; tylko opisać status boundary task/event/lead-shadow.

### Owner Control status

- obecne statusy/warstwy: severity `critical`, `warning`, `normal`; record closed status set; client service status set; missing item severity; note-without-followup gap status.
- label: `statusLabel`, `reason`, `signals` w Owner Control.
- tone/color: severity i priorytet (`critical/warning/normal`, `priority`).
- helper: `buildOwnerControlBaseline`, `buildMissingOwnerControlItems`, `buildNextMoveContract`, `buildActivityTruth`, `normalizeOwnerRiskSettings`.
- lokalne duplikaty: `CLOSED_RECORD_STATUSES` zawiera statusy lead/case/task razem; `ACTIVE_CLIENT_SERVICE_STATUSES` jest lokalnym client status mapem.
- pliki użycia: `src/lib/owner-control/owner-control-baseline.ts`, `src/lib/owner-control/owner-control-missing-blockers.ts`, `src/pages/TodayStable.tsx`.
- kategoria: `DERIVED_STATUS` + `LOCAL_STATUS_MAP` + `DUPLICATE_STATUS_LOGIC`.
- ryzyko: Owner Control agreguje różne encje; nie może stać się źródłem prawdy statusu.
- rekomendowane SOT: Owner Control powinien pozostać konsumentem status repository, nie źródłem.

### Activity status

- obecne statusy: activity event types zawierające `status`, `task`, `event`, `missing_item`, `payment`, `paid`, `billing`, `case_created`, `case_linked`, `lead_moved`, `converted`.
- label: `activity-timeline.ts` tytuły i opisy; status transitions używają opcjonalnego `statusLabel` formattera.
- tone/color: brak własnego centralnego status tone; opis/tytuł są tekstowe.
- helper: `getActivityTimelineTitle`, `getActivityTimelineDescription`, `normalizeActivityTimelineItem`.
- lokalne duplikaty: własne rozpoznanie missing/blocker i payment history; status transition formatter zależy od wstrzykniętego helpera.
- pliki użycia: `src/lib/activity-timeline.ts`, `src/pages/LeadDetail.tsx`, `src/pages/CaseDetail.tsx`, `src/pages/ClientDetail.tsx`.
- kategoria: `UI_ONLY_STATUS` + `LOCAL_LABEL_MAP` + `DUPLICATE_STATUS_LOGIC`.
- ryzyko: historia może dostać inne labelki niż aktywne rekordy, jeśli formatter nie używa wspólnego repozytorium.
- rekomendowane SOT: status repository powinno eksportować formattery per entity do activity timeline.

### Finance / commission status

- obecne statusy: commission `not_set`, `expected`, `due`, `partially_paid`, `paid`, `overdue`; payment `planned`, `due`, `paid`, `cancelled`; billing/access statusy także w `domain-statuses.ts`.
- label: finance status enum w `finance-types.ts`, billing labels w `domain-statuses.ts`; brak jednego `commissionStatusLabel` w mapowanych plikach.
- tone/color: finance UI i badges lokalnie; brak jednego status-tone SOT.
- helper: `normalizeCommissionStatus`, `deriveCommissionStatus`, `getCaseFinanceSummary`, `getCaseCommissionPaidAmount`, `buildCaseFinancePatch`.
- lokalne duplikaty: `deriveCommissionStatus` liczy status z payments i ignoruje ręczny status; `buildCaseFinancePatch` zapisuje `commissionStatus: not_set` jako cache/compat; `domain-statuses.ts` miesza billing/payment/commission-like values w `BILLING_STATUS_VALUES`.
- pliki użycia: `src/lib/finance/finance-types.ts`, `src/lib/finance/finance-normalize.ts`, `src/lib/finance/case-finance-source.ts`, `src/components/finance/CaseSettlementSection.tsx`, `src/pages/CaseDetail.tsx`, `src/pages/Clients.tsx`.
- kategoria: `DERIVED_STATUS` + `SOURCE_OF_TRUTH_CANDIDATE` + `LEGACY_STATUS`.
- ryzyko: status prowizji nie może wrócić jako ręczny select; status musi być wyliczany z kwot wpłat prowizji.
- rekomendowane SOT: 001B nie powinien zaczynać od finance. Finance statusy zostawić jako derived contract i tylko wpisać do repozytorium jako read-only derived.

## Najważniejsze duplikaty

| Encja | Duplikat | Pliki | Ryzyko | Rekomendacja |
|---|---|---|---|---|
| Lead | wartości w `domain-statuses.ts`, tone/meta w `lead-options.ts`, pill fallback w `config/badges.ts`, closed set w Owner Control | `domain-statuses.ts`, `lead-options.ts`, `badges.ts`, `owner-control-baseline.ts` | rozjazd label/tone/fallback | 001B: adapter z domain values + meta/tone |
| Case | label `completed` różni się między domain a case-options | `domain-statuses.ts`, `case-options.ts` | `Zakonczona` vs `Zamknieta` | 001B: jeden label publiczny, aliasy legacy osobno |
| Case lifecycle | status sprawy vs lifecycle bucket | `case-options.ts`, `case-lifecycle-v1.ts`, `Cases.tsx` | UI może traktować bucket jako źródłowy status | 001B: rozdzielić `case.status` i `case.lifecycleBucket` |
| Task/Event | domain labels vs schedule-options aliases | `domain-statuses.ts`, `schedule-options.ts` | `done` task/event ma różne znaczenie | 001B: osobne task/event meta |
| Calendar Done | regex na labelu i kilka closed-setów | `work-item-card.tsx`, `schedule-options.ts`, `case-lifecycle-v1.ts` | fałszywe complete/delete dla nie-tasków | nie ruszać w pierwszym podpięciu; zrobić mapę boundary |
| Payment | canonical payment enum vs paid-like/due-like sets | `finance-types.ts`, `finance-normalize.ts`, `case-finance-source.ts` | płatność może być policzona jako paid z legacy statusu | 001B: jawnie opisać canonical vs compatible paid-like |
| Missing/Blocker | owner-control i activity timeline mają własne wykrywanie | `owner-control-missing-blockers.ts`, `activity-timeline.ts`, detail pages | historia może pomylić aktywność z aktywnym brakiem | 001B: status contract dla active missing source record |
| Client | derived health/source/portal vs status set Owner Control | `client-options.ts`, `owner-control-baseline.ts`, `Clients.tsx` | błędne spłaszczenie klienta do jednego statusu | 001B: model wielowymiarowy, bez jednego selecta |
| Commission | derived status vs legacy/cache status | `finance-types.ts`, `finance-normalize.ts`, `case-finance-source.ts` | powrót ręcznego commissionStatus | tylko read-only derived status |
| Activity | status transition label zależny od formattera | `activity-timeline.ts`, detail pages | inne labelki w historii niż w aktywnym UI | eksport formatterów z repozytorium statusów |

## Kandydaci do 001B

Rekomendacja: tak, warto utworzyć `src/lib/source-of-truth/status-repository.ts`, ale dopiero w 001B.

Nie powinno to być nowe niezależne źródło wymyślone od zera. Najbezpieczniejszy układ:

```txt
status-repository.ts
- re-export / adapter dla domain-statuses.ts wartości i legacy normalize,
- entity-specific meta: lead, case, task, event, payment, missing, ownerControl, activity, commission,
- osobne helpers dla source status vs derived status vs UI-only status,
- explicit `derived: true` dla Client health, Owner Control, Case lifecycle, Commission,
- explicit `legacyAliases` dla old values,
- no runtime migration in first commit.
```

Uporządkować istniejące pliki przez adapter, nie kasować ich od razu:

```txt
lead-options.ts: zachować jako lead meta/tone adapter albo przenieść stopniowo.
client-options.ts: zachować, bo Client ma derived health/source/portal, nie jeden status.
case-options.ts: zachować, ale label mismatch dla completed musi być decyzją 001B.
schedule-options.ts: zachować, ale oddzielić Task/Event aliasy od canonical domain.
finance/finance-types.ts + finance-normalize.ts: zostawić finance jako derived/normalization domain.
payment-options.ts: FILE_NOT_FOUND — nie tworzyć w 001A.
calendar-options.ts: FILE_NOT_FOUND — funkcję pełni schedule-options.ts.
```

Najbezpieczniejsze 1–2 widoki do ograniczonego podpięcia w 001B:

```txt
1. Leads / LeadDetail — dużo użyć już idzie przez lead-options/config, więc ma niski koszt migracji.
2. Cases / CaseDetail tylko w zakresie label/meta read-only, bez lifecycle refactoru.
```

Widoki, których nie ruszać w pierwszym 001B:

```txt
Calendar — za dużo action-policy, task/event/lead-shadow boundary.
Finance / CaseSettlement — prowizja jest derived i nie może wrócić jako ręczny status.
Owner Control — agregator, nie source of truth.
ClientDetail — klient ma derived health/source/portal i wiele relacji.
MissingItemsManager — świeży, delikatny obszar source-record semantics.
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

## Guard/test/build

Ten etap jest mapowaniem, więc nie dodał runtime guarda i nie uruchamiał build.

```txt
git status --short --branch: NOT_RUN_LOCAL_REMOTE_GITHUB_CONNECTOR
git branch --show-current: NOT_RUN_LOCAL_REMOTE_GITHUB_CONNECTOR / target branch dev-rollout-freeze
git log --oneline -1: REMOTE_HEAD 578b4276835bae56a791ca3225f9a930edeb4958
npm run guard:routes:canonical: NOT_RUN_LOCAL_REMOTE_GITHUB_CONNECTOR / REQUIRED_LOCAL_REVERIFY
npm run guard:ui:patch-layers: NOT_RUN_LOCAL_REMOTE_GITHUB_CONNECTOR / REQUIRED_LOCAL_REVERIFY
npm run check:polish-mojibake: NOT_RUN_LOCAL_REMOTE_GITHUB_CONNECTOR / REQUIRED_LOCAL_REVERIFY
git diff --check: NOT_RUN_LOCAL_REMOTE_GITHUB_CONNECTOR / REQUIRED_LOCAL_REVERIFY
```

## Ryzyka

```txt
- 001B nie może być big-bang refactorem,
- 001B może podpiąć tylko 1–2 najbardziej ryzykowne widoki,
- statusy wyliczane, np. prowizja, nie mogą wrócić jako ręczny select,
- statusy Missing item / blocker muszą respektować source record,
- statusy Calendar Done nie mogą mieszać task/event/case/lead-shadow bez rozróżnienia źródła,
- Client status nie może zostać spłaszczony do jednego selecta,
- Case lifecycle bucket nie może zostać pomylony z `case.status`.
```

## Decyzja

```txt
LF-PROD-SOT-001A:
STATUS_MAP_DONE_REMOTE / READY_FOR_LOCAL_REVERIFY

Następny etap po lokalnym PASS:
LF-PROD-SOT-001B — Status repository

Nie wdrażano 001B w tym etapie.
Nie wolno startować 001B przed lokalnym PASS guardów po tej mapie.
```

## Lokalne komendy do domknięcia 001A

```powershell
$ErrorActionPreference = "Stop"
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

git pull --ff-only origin dev-rollout-freeze
git status --short --branch
git branch --show-current
git log --oneline -1

npm run guard:routes:canonical
npm run guard:ui:patch-layers
npm run check:polish-mojibake
git diff --check

git status --short --branch
```

Jeżeli wszystko przejdzie i raport ma zostać formalnie zamknięty, zaktualizować status na:

```txt
STATUS_MAP_DONE / READY_FOR_001B_STATUS_REPOSITORY
```

## Zapis do Obsidiana

```txt
data i godzina: 2026-06-30 19:10 Europe/Warsaw
name/alias: LF-PROD-SOT-001A status map
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target app report: _project/runs/LF-PROD-SOT-001A_STATUS_MAP.md
target obsidian path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-001A_STATUS_MAP.md
save status: APP_REPORT_PUSHED_REMOTE / OBSIDIAN_PAYLOAD_PENDING
Obsidian GitHub sync: PENDING_UNTIL_OBSIDIAN_REPORT_CREATED
Obsidian local sync: LOCAL_SYNC_PENDING
tests: local guard reverify pending after remote documentation push
risk audit: map complete, but no 001B until local PASS and Obsidian sync
what was not touched: runtime, CSS, SQL, Supabase, routing, auth, UI redesign, data provider
next step: create Obsidian payload, then local reverify; after PASS, close 001A and only then design 001B
```
