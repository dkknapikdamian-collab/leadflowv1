# STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT

Data: 2026-06-23 06:35 Europe/Warsaw
Status: READY_TO_APPLY_ZIP / RUNTIME_CONTRACT_FOUNDATION / REVIEW_REQUIRED
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## PROSTO

R1A wprowadza pierwszy wspólny kontrakt operacyjnego wpisu dla Calendar i Today.

To nie jest pełne przepięcie Today ani czyszczenie całego Calendar UI. To jest bezpieczny fundament pod R1B/R1C:

- jeden typ wpisu operacyjnego: event / task / lead,
- jeden sposób wyciągania momentu operacyjnego z rekordu,
- jeden dayKey do porównania Calendar/Today,
- jedna lista akcji per typ,
- jawne ograniczenie: lead shadow entry nie dostaje complete/restore/delete w tym kontrakcie.

## SCAN_REPORT

Przeczytano / uwzględniono:

- Obsidian `00_START - CloseFlow Lead App.md`.
- Obsidian `04_ETAPY_ROZWOJU_APLIKACJI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`.
- Obsidian `04_KIERUNEK_DO_WDROZENIA - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`.
- Obsidian `06_PLAN_WDROZEN_NAPRAW_PO_AUDYTACH.md`.
- R0 report: `_project/runs/STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT.md`.
- Repo runtime: `src/lib/scheduling.ts` przez aktualny branch `dev-rollout-freeze`.
- CF runtime guard: `scripts/check-cf-runtime-00-source-truth.cjs`.

Wniosek ze skanu:

```txt
R0_RESULT: CALENDAR_SOURCE_TRUTH_STATUS == PARTIAL
NEXT_STAGE: STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT
CF_RUNTIME_04_CONTEXT: Workqueue/date engine obejmuje Today/Tasks/Calendar/Activity/Notifications
```

## IMPLEMENTATION_SCOPE

Dodano:

- `src/lib/calendar-operational-entry-contract.ts`
- eksport kontraktu przez `src/lib/scheduling.ts`
- guard `scripts/check-stage232g-r1a-calendar-today-operational-entry-contract.cjs`
- test `tests/stage232g-r1a-calendar-today-operational-entry-contract.test.cjs`
- run report R1A
- payload Obsidiana R1A
- wpisy w centralnych plikach `_project` i `00_START`
- allowlistę zakresu w `scripts/check-cf-runtime-00-source-truth.cjs`

## CONTRACT_DECISIONS

### OperationalEntryKind

```txt
event
task
lead
```

### Field contract

Kontrakt zawiera:

```txt
kind
sourceId
sourceTable
title
startsAt
scheduledAt
dueAt
date
time
status
dayKey
leadId
caseId
clientId
actions
```

### Moment priority

Event:

```txt
startAt -> startsAt -> dateTime -> date_time -> date
```

Task:

```txt
scheduledAt -> scheduled_at -> dueAt -> due_at -> dateTime -> date_time -> date
```

Lead:

```txt
nextActionAt -> next_action_at -> followUpAt -> follow_up_at -> dateTime -> date_time -> date
```

### Action contract

Event/task:

```txt
edit
shift
complete
restore
delete
open-related
```

Lead shadow entry:

```txt
edit
shift
open-related
```

Powód: R0 wykazał, że complete/restore/delete dla lead entry są największym ryzykiem false-success. R1A kontrakt nie daje leadowi tych akcji, dopóki R1C nie podejmie jawnej decyzji.

## WHAT_R1A_DOES_NOT_DO

Nie robi jeszcze:

- pełnego przepięcia Today na ten kontrakt,
- pełnego przepięcia Calendar UI,
- usuwania DOM normalizerów,
- zmiany Google Calendar sync/OAuth,
- SQL/RLS,
- finansów/prowizji,
- Owner Control runtime,
- Braków/Blokad runtime.

## TESTS_TO_RUN

```powershell
node scripts/check-stage232g-r1a-calendar-today-operational-entry-contract.cjs
node --test tests/stage232g-r1a-calendar-today-operational-entry-contract.test.cjs
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## EXPECTED_RESULT

```txt
R1A guard: PASS
R1A node test: PASS
verify:closeflow:quiet: PASS
git diff --check: PASS
runtimeTouched: contract-only
```

## RISK_AUDIT_AFTER_R1A

Ryzyka po R1A:

1. Today jeszcze nie jest przepięty — status parity pozostaje PARTIAL do R1B.
2. Lead shadow entry ma świadomie ograniczone akcje — to zmniejsza false-success, ale wymaga R1C decyzji UX.
3. Nowy kontrakt jest foundation layer — nie wolno uznać całego Calendar/Today za naprawiony tylko po R1A.
4. `scheduling.ts` eksportuje kontrakt, więc production build powinien złapać błąd typów, jeżeli helper jest niepoprawny.

## NEXT_STEP

```txt
STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT
```

R1B powinien podpiąć Today do wspólnego adaptera momentu/dayKey i dodać test porównania z Calendar bez przebudowy całego UI naraz.
