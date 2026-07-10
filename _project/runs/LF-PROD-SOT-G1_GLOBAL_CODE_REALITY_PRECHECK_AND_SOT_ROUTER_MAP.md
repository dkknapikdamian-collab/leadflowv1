---
typ: app_run_report
stage: LF-PROD-SOT-G1_GLOBAL_CODE_REALITY_PRECHECK_AND_SOT_ROUTER_MAP
status: PASS_WITH_FINDINGS
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
created: 2026-07-10 Europe/Warsaw
runtime_change: NO
---

# LF-PROD-SOT-G1 GLOBAL CODE REALITY PRECHECK AND SOT ROUTER MAP

## Scope

Goal: realny precheck repo aplikacji i mapa globalnych pozostalych zrodel prawdy.

This stage is map-only. It does not move to G2, does not change runtime code, does not change SQL, and does not repair findings.

## Branch / repo precheck

| Check | Result |
|---|---|
| App path | `C:\Users\malim\Desktop\biznesy_ai\2.closeflow` |
| App status | `## dev-rollout-freeze...origin/dev-rollout-freeze` |
| App branch | `dev-rollout-freeze` |
| Obsidian path | `C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT` |
| Obsidian status | `## main...origin/main` |
| Obsidian branch | `main` |
| App HEAD before G1 docs | `2804c3e5 Add R27 TasksStable grouping decision gate` |
| Obsidian HEAD before G1 docs | `c8d142ac Add R27 TasksStable grouping decision map` |

## Read scope

Read:

- `AGENTS.md`
- `_project/00_AI_START_SPIS_TRESCI.md`
- `package.json`
- `scripts/guards`
- `tests`
- `_project/runs`
- `src/lib`
- `src/pages`
- `src/components`
- Obsidian router: `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/00_MAPY_I_ZALEZNOSCI_SOT.md`

Attempted but missing:

- `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE_MAP.md`

Intentionally not read:

- whole Obsidian vault
- Current State
- historical reports outside the grep/map scope
- runtime/server/API folders outside the requested app scope
- SQL/migrations outside requested scope

## Grep terms

Grep/map terms used in app repo:

```txt
status
date
tone
badge
group
calendar
gcal
finance
commission
invoice
payment
template
```

## Global SOT area table

| Area | Current code reality | Main source / owner candidates | Runtime consumers found | Remaining SOT risk | Recommended G2 route |
|---|---|---|---|---|---|
| lists/cards | Mixed but partially centralized. Leads/Cases use config wrappers and SOT options; TasksStable uses SOT display helper only for label/tone; operational badges have separate helper. | `src/lib/source-of-truth/lead-options.ts`, `src/lib/source-of-truth/case-options.ts`, `src/lib/config/lead-status.ts`, `src/lib/config/case-status.ts`, `src/lib/record-operational-badges.ts`, `src/components/ui-system/StatusPill.tsx` | `src/pages/Leads.tsx`, `src/pages/Cases.tsx`, `src/pages/TasksStable.tsx`, `src/pages/TodayStable.tsx` | duplicated badge/tone rendering and mixed imports from config vs source-of-truth. | First map exact list/card runtime callsites, then pick one narrow no-drift facade adoption. |
| CaseDetail | Large local runtime remains with local status/payment/finance helpers and imported configured case status helpers. Prior baseline is frozen; finance is high-risk. | `src/pages/CaseDetail.tsx`, `src/lib/source-of-truth/casedetail-isolated-adoption-plan.ts`, `src/lib/finance/case-finance-source.ts`, `src/lib/config/case-status.ts` | `src/pages/CaseDetail.tsx`, finance dialogs/components | high blast radius; local helpers plus finance settlement/payment logic make direct rewires risky. | Do not rewrite. Create isolated CaseDetail ownership map before any runtime adoption. |
| GCal / Calendar | Calendar has local status/date/type helpers. SOT has readonly calendar boundary files, but Google sync/boundary is explicitly protected. | `src/pages/Calendar.tsx`, `src/lib/source-of-truth/calendar-date-time-boundary-readonly-runtime.ts`, `src/lib/source-of-truth/calendar-status-date-readonly-runtime.ts`, `src/lib/calendar-operational-entry-contract.ts`, `src/lib/calendar-items.ts` | `src/pages/Calendar.tsx`, Today calendar adapters, tests/guards for calendar/GCal | local calendar labels and day buckets are separate from Google boundary; direct adoption can shift dates or remote sync behavior. | Keep GCal as separate boundary lane; no Calendar/GCal runtime adoption in G2 unless explicitly scoped. |
| Finance | Finance has a dedicated lib and UI components, but labels/status tones are partly local. Commission status is derived/read-only in status repository. | `src/lib/finance/*`, `src/components/finance/*`, `src/lib/source-of-truth/status-repository.ts`, `src/lib/source-of-truth/date-time-repository.ts` | `src/components/finance/PaymentList.tsx`, `FinanceMiniSummary.tsx`, `CaseSettlementPanel.tsx`, CaseDetail finance blocks | payment status, paid-like compatibility, commission derived status, and finance date-only T23:59:59 must not be merged with task/event semantics. | Treat Finance as separate SOT lane; map first, no direct G2 runtime patch. |
| Response templates | ResponseTemplates page uses Supabase helpers and local Badge/UI rendering. Template checklist SOT exists separately. | `src/pages/ResponseTemplates.tsx`, `src/lib/source-of-truth/template-options.ts`, `src/pages/Templates.tsx` | `/response-templates`, `/templates` routes, sidebar/layout guards | response templates and case checklist templates are adjacent but not the same domain; risk of merging them accidentally. | Split ResponseTemplates from case Templates in router map. |
| UI duplication | Shared primitives exist (`StatusPill`, `Badge`, VST registry), but code still has many local `cf-status-pill`, `Badge`, `data-cf-status-tone`, and inline class/tone decisions. | `src/components/ui-system/StatusPill.tsx`, `src/components/ui/badge.tsx`, `src/lib/source-of-truth/visual-repository.ts`, `src/lib/source-of-truth/ui-tones.ts` | Leads, Cases, TasksStable, TodayStable, Calendar, Templates, finance components | visual semantics are not fully consolidated; broad UI cleanup would be risky and could overwrite accepted baselines. | G2 should be router/map only or one narrow visual ownership inventory, not broad UI refactor. |

## Important code reality evidence

- Status repository exists and maps source/derived/ui-only/legacy status domains in `src/lib/source-of-truth/status-repository.ts`.
- Domain status values and normalization are still centralized separately in `src/lib/domain-statuses.ts`.
- Date/time repository exists in `src/lib/source-of-truth/date-time-repository.ts` and explicitly separates task/event T09:00 from finance T23:59:59.
- TasksStable still has local grouping helpers: `getTaskDateKey`, `getTaskGroupId`, `buildTaskGroups`, while status label/tone call SOT helper in `src/pages/TasksStable.tsx`.
- Calendar page still owns local entry status/type/date label helpers in `src/pages/Calendar.tsx`.
- Finance UI has local tone helpers in `src/components/finance/PaymentList.tsx` and `src/components/finance/FinanceMiniSummary.tsx`.
- Templates use `src/lib/source-of-truth/template-options.ts`; ResponseTemplates is a separate route/page.

## Findings

### FINDING G1-001: missing R28 input map

Problem / chance: the requested input map `LF-PROD-SOT-005C-R28_TASKS_STABLE_STATUS_DATE_GROUPING_SOT_FINAL_CLOSEOUT_GATE_MAP.md` was not present in the requested Obsidian folder.

Why it matters: G1 can still map real code, but any claim that G1 consumed R28 closeout would be false.

Risk if ignored: G2 may assume a closed R28 gate exists and may route from non-existent evidence.

Recommended action: before G2, either create/restore the R28 map or explicitly mark G2 input as G1-only plus R27/R26 lineage.

### FINDING G1-002: template SOT labels contain mojibake

Problem / chance: `src/lib/source-of-truth/template-options.ts` contains mojibake labels such as `DostÄ™p / login`, `PĹ‚atnoĹ›Ä‡ / faktura`, `MateriaĹ‚y / zdjÄ™cia`.

Why it matters: this is a source-of-truth file used by `src/pages/Templates.tsx`, so bad labels can propagate to UI and tests.

Risk if ignored: users see broken Polish text and future guards can normalize around corrupted strings.

Recommended action: schedule a narrow encoding repair stage; do not hide this inside G2 runtime adoption.

### FINDING G1-003: finance UI has additional mojibake-like labels

Problem / chance: grep surfaced broken Polish labels in finance components, e.g. `Pozosta?o`, `Warto??`, `Wp?acono`.

Why it matters: finance copy is business-critical and user-facing.

Risk if ignored: production trust drops and finance labels can be misunderstood.

Recommended action: map and repair encoding in a dedicated finance-copy/encoding stage, separate from finance logic.

## G2 exact required inputs

G2 must read exactly:

- `10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-PROD-SOT-G1_GLOBAL_CODE_REALITY_PRECHECK_AND_SOT_ROUTER_MAP.md`
- `_project/runs/LF-PROD-SOT-G1_GLOBAL_CODE_REALITY_PRECHECK_AND_SOT_ROUTER_MAP.md`

G2 must not assume R28 input exists unless that file is restored or explicitly supplied.

## G2 routing recommendation

Best next action:

1. Start G2 as router/map-only.
2. Do not touch runtime in G2.
3. Split lanes:
   - lists/cards
   - CaseDetail
   - GCal/Calendar boundary
   - Finance
   - ResponseTemplates vs Templates
   - UI duplication/shared primitives
4. For each lane, name one owner file, known consumers, forbidden adjacent domains, and first safe candidate.

## Verification planned for closeout

- `npm.cmd run build`
- `git diff --check`
- `git status --short --branch`

