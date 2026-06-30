# LF-PROD-SOT-001B — Status repository

## Status

```txt
STATUS_REPOSITORY_ADDED_REMOTE / GUARD_ADDED / TEST_ADDED / PACKAGE_ALIAS_PENDING / LOCAL_GUARDS_PENDING / DO_NOT_MOVE_TO_002A
```

Etap wdrozony zdalnie w zakresie rdzenia: status repository, guard, test i raport.

Nie wpisuje pelnego `STATUS_REPOSITORY_ADDED / GUARD_PASS / TEST_PASS / BUILD_PASS`, bo lokalne komendy nie zostaly uruchomione w tej odpowiedzi, a package alias wymaga bezpiecznego lokalnego dopisania do bardzo duzego `package.json`.

## Wejście

```txt
Previous stage:
LF-PROD-SOT-001A = CLOSED / STATUS_MAP_DONE / READY_FOR_001B_STATUS_REPOSITORY

Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
HEAD before remote implementation: ed0a0289 — docs(closeflow): complete production status source map
```

## Zakres

Co dodano:

```txt
- src/lib/source-of-truth/status-repository.ts
- scripts/guards/verify-lf-prod-sot-001b-status-repository.cjs
- tests/lf-prod-sot-001b-status-repository.test.cjs
- _project/runs/LF-PROD-SOT-001B_STATUS_REPOSITORY.md
```

Package alias:

```txt
verify:lf-prod-sot-001b-status-repository = PENDING_LOCAL_SAFE_PATCH
```

Ograniczone read-only adoption:

```txt
ADOPTION_DEFERRED_TO_NEXT_STAGE
```

Nie przepieto runtime w tym etapie.

## STATUS_REPOSITORY_SOURCE_MAP

### leadStatus

```txt
entity: lead
source file: src/lib/domain-statuses.ts + src/lib/source-of-truth/lead-options.ts
imported/adapted: LEAD_STATUS_VALUES + LEAD_STATUS_META_BY_VALUE + isClosedLeadStatus
not duplicated: wartosci i meta sa importowane/adaptowane z istniejacych zrodel; legacy aliases sa mostem do prywatnej mapy normalizacji domain-statuses
derived/ui-only/legacy handling: source=true, derived=false, uiOnly=false, legacy=true
```

### clientHealthStatus

```txt
entity: client.health
source file: src/lib/source-of-truth/client-options.ts
imported/adapted: CLIENT_HEALTH_OPTIONS + deriveClientHealthValue contract
not duplicated: client health zostaje derived, nie powstal jeden plaski clientStatus
derived/ui-only/legacy handling: source=false, derived=true, uiOnly=false, legacy=false
```

### clientSourceStatus

```txt
entity: client.source
source file: src/lib/source-of-truth/client-options.ts
imported/adapted: CLIENT_SOURCE_OPTIONS
not duplicated: client source zostaje osobnym wymiarem
derived/ui-only/legacy handling: source=true, derived=false, uiOnly=false, legacy=false
```

### clientPortalStatus

```txt
entity: client.portal
source file: src/lib/source-of-truth/client-options.ts
imported/adapted: PORTAL_STATUS_OPTIONS + getPortalStatusValue contract
not duplicated: portal status zostaje derived/read-only z portalReady
derived/ui-only/legacy handling: source=false, derived=true, uiOnly=false, legacy=false
```

### caseStatus

```txt
entity: case
source file: src/lib/domain-statuses.ts + src/lib/source-of-truth/case-options.ts
imported/adapted: CASE_STATUS_VALUES + CASE_STATUS_META_BY_VALUE + CASE_CLOSED_STATUSES
not duplicated: case.status zostaje osobno od caseLifecycle.bucket
derived/ui-only/legacy handling: source=true, derived=false, uiOnly=false, legacy=true
```

### caseLifecycleStatus

```txt
entity: case.lifecycle
source file: src/lib/case-lifecycle-v1.ts
imported/adapted: CaseLifecycleBucketV1 contract from resolveCaseLifecycleV1
not duplicated: lifecycle bucket jest derived/read-only, nie status zrodlowy sprawy
derived/ui-only/legacy handling: source=false, derived=true, uiOnly=false, legacy=false
```

### taskStatus

```txt
entity: task
source file: src/lib/domain-statuses.ts + src/lib/source-of-truth/schedule-options.ts
imported/adapted: TASK_STATUS_VALUES + schedule-options alias contract
not duplicated: task status oddzielony od event status
derived/ui-only/legacy handling: source=true, derived=false, uiOnly=false, legacy=true
```

### eventStatus

```txt
entity: event
source file: src/lib/domain-statuses.ts + src/lib/source-of-truth/schedule-options.ts
imported/adapted: EVENT_STATUS_VALUES + schedule-options event done label contract
not duplicated: event.done ma osobna semantyke od task.done
derived/ui-only/legacy handling: source=true, derived=false, uiOnly=false, legacy=true
```

### paymentStatus

```txt
entity: payment
source file: src/lib/finance/finance-types.ts + src/lib/finance/finance-normalize.ts + src/lib/finance/case-finance-source.ts
imported/adapted: PAYMENT_STATUSES + normalizePaymentStatus; paidLike/dueLike zapisane jako compatibility layer
not duplicated: payment.status oddzielony od payment paid-like compatibility
derived/ui-only/legacy handling: source=true, derived=false, uiOnly=false, legacy=true
```

### missingItemStatus

```txt
entity: missing-item
source file: src/lib/owner-control/owner-control-missing-blockers.ts + src/lib/activity-timeline.ts + src/lib/source-of-truth/case-options.ts
imported/adapted: isOwnerMissingControlItem contract + activity timeline label contract
not duplicated: aktywny Brak/Blokada to source task/work-item, historia nie jest aktywnym zrodlem
derived/ui-only/legacy handling: source=true, derived=true, uiOnly=false, legacy=true
```

### ownerControlStatus

```txt
entity: owner-control
source file: src/lib/owner-control/owner-control-baseline.ts + src/lib/owner-control/owner-control-missing-blockers.ts
imported/adapted: severity contract only
not duplicated: Owner Control zostaje agregatorem/konsumentem statusow, nie zrodlem
derived/ui-only/legacy handling: source=false, derived=true, uiOnly=false, legacy=false
```

### activityStatus

```txt
entity: activity
source file: src/lib/activity-timeline.ts
imported/adapted: activity timeline event-type label contract
not duplicated: activity pozostaje UI-only timeline formatting, nie source status
derived/ui-only/legacy handling: source=false, derived=false, uiOnly=true, legacy=false
```

### commissionStatus

```txt
entity: commission
source file: src/lib/finance/finance-types.ts + src/lib/finance/finance-normalize.ts + src/lib/finance/case-finance-source.ts
imported/adapted: COMMISSION_STATUSES + normalizeCommissionStatus + derived getCaseFinanceSummary contract
not duplicated: commissionStatus jest derived/read-only, nie reczny select
derived/ui-only/legacy handling: source=false, derived=true, uiOnly=false, legacy=true
```

## Eksporty repository

```txt
leadStatus
clientHealthStatus
clientSourceStatus
clientPortalStatus
caseStatus
caseLifecycleStatus
caseItemStatus
taskStatus
eventStatus
paymentStatus
missingItemStatus
ownerControlStatus
activityStatus
commissionStatus
billingStatus
statusRepository
STATUS_REPOSITORY_SOURCE_MAP
```

## Ograniczone podpięcie

```txt
ADOPTION_DEFERRED_TO_NEXT_STAGE
```

Powod: 001B ma najpierw stworzyc centralny punkt wejscia, guard i test. Runtime adoption w Leads/LeadDetail/Cases/CaseDetail zostaje na kolejny maly etap, zeby nie robic big-bang refactoru.

## Czego nie ruszano

```txt
Calendar: NOT_TOUCHED
Finance / CaseSettlement: NOT_TOUCHED
Owner Control: NOT_TOUCHED
ClientDetail: NOT_TOUCHED
MissingItemsManager: NOT_TOUCHED
Supabase/API: NOT_TOUCHED
SQL/migrations: NOT_TOUCHED
auth: NOT_TOUCHED
routing: NOT_TOUCHED
CSS: NOT_TOUCHED
layout: NOT_TOUCHED
UI redesign: NOT_TOUCHED
```

## Guard/test/build

```txt
npm run verify:lf-prod-sot-001b-status-repository: NOT_RUN_LOCAL / PACKAGE_ALIAS_PENDING
node scripts/guards/verify-lf-prod-sot-001b-status-repository.cjs: NOT_RUN_LOCAL / REQUIRED
node --test tests/lf-prod-sot-001b-status-repository.test.cjs: NOT_RUN_LOCAL / REQUIRED
npm run guard:routes:canonical: NOT_RUN_LOCAL / REQUIRED
npm run guard:ui:patch-layers: NOT_RUN_LOCAL / REQUIRED
npm run check:polish-mojibake: NOT_RUN_LOCAL / REQUIRED
npm run build: NOT_RUN_LOCAL / REQUIRED
git diff --check: NOT_RUN_LOCAL / REQUIRED
```

## Local package alias patch required

`package.json` jest bardzo duzy. Connector nie ma bezpiecznego patchowania pojedynczej linii bez ryzyka nadpisania pliku. Alias nalezy dopisac lokalnie po pullu:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
node -e "const fs=require('fs'); const p='package.json'; const pkg=JSON.parse(fs.readFileSync(p,'utf8')); pkg.scripts=pkg.scripts||{}; pkg.scripts['verify:lf-prod-sot-001b-status-repository']='node scripts/guards/verify-lf-prod-sot-001b-status-repository.cjs'; fs.writeFileSync(p, JSON.stringify(pkg,null,2)+'\n');"
```

Po tym package alias ma byc commitowany selektywnie razem z ewentualna aktualizacja raportu PASS.

## Ryzyka

```txt
- status repository nie moze byc konkurencyjna lista statusow,
- 002A nie moze startowac, jesli 001B nie ma PASS,
- Client status nie moze zostac splaszczony,
- Finance/commission nie moze wrocic do recznego statusu,
- Calendar Done zostaje poza migracja w tym etapie,
- runtime adoption musi byc osobnym, malym etapem.
```

## Decyzja

```txt
LF-PROD-SOT-001B:
STATUS_REPOSITORY_ADDED_REMOTE / PACKAGE_ALIAS_PENDING / LOCAL_PASS_PENDING

Nie przechodzic do 002A.
```

## Zapis do Obsidiana

```txt
data i godzina: 2026-06-30 19:55 Europe/Warsaw
name/alias: LF-PROD-SOT-001B status repository
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY
target app report: _project/runs/LF-PROD-SOT-001B_STATUS_REPOSITORY.md
target obsidian path: 10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-001B_STATUS_REPOSITORY.md
save status: APP_REPORT_PUSHED_REMOTE / OBSIDIAN_REPORT_PENDING / PACKAGE_ALIAS_PENDING / LOCAL_PASS_PENDING
Obsidian GitHub sync: PENDING
Obsidian local sync: LOCAL_SYNC_PENDING
tests: local guard/test/build pending
risk audit: status repository added, no runtime adoption; 002A blocked until local PASS
what was not touched: Calendar, Finance/CaseSettlement runtime, Owner Control runtime, ClientDetail, MissingItemsManager, Supabase/API, SQL/migrations, auth, routing, CSS, layout, UI redesign
next step: local package alias patch + local verification + report closeout
```
