# CloseFlow Visual Tile Atlas

Status:
ACTIVE MAP / DO NOT SKIP BEFORE TILE MIGRATIONS

Stage:
STAGE231D0G_VISUAL_TILE_SOURCE_TRUTH_ATLAS

Created:
2026-06-12 20:10 Europe/Warsaw

Baseline:
FunnelMetricTileR13 -> CloseFlowMetricTileV2

## Purpose

Map every major CloseFlow route before migrating visual cards to the R13 Funnel tile style.

No runtime mass refactor in this stage.

## Atlas table

| Route | Page file | UI area | Current class/source | Target source truth | Priority | Notes |
|---|---|---|---|---|---|---|
| `/today` | `src/pages/TodayStable.tsx` | operator dashboard metrics, today tasks, upcoming movement, risk cards | legacy mixed dashboard/cards | CloseFlowMetricTileV2 + SharedFilterStrip + RecordListCard | WAVE 2 / HIGH | Most visible start page; migrate after Wave 1 visual baseline is safe. |
| `/leads` | `src/pages/Leads.tsx` | top metrics, lead rows, filters, right rail top value records | StatShortcutCard + operator rail + record-list CSS | CloseFlowMetricTileV2 + SharedFilterStrip + RecordListCard | WAVE 1 / HIGH | Has lead action colors and highest-value lead records. |
| `/funnel` | `src/pages/SalesFunnel.tsx` | owner decision tiles, stage filters, decision records, priority rail | FunnelMetricTileR13 | FunnelMetricTileR13 -> CloseFlowMetricTileV2 | SOURCE TRUTH / FROZEN | Do not change layout; only regression guard from now. |
| `/cases` | `src/pages/Cases.tsx` | case list status cards, risk badges, filters, case rows | StatShortcutCard + SimpleFiltersCard + record-list CSS | CloseFlowMetricTileV2 + SharedFilterStrip + RecordListCard | WAVE 1 / HIGH | Cases list is high-traffic and financially important. |
| `/case/:caseId` | `src/pages/CaseDetail.tsx` | detail header, service workspace, settlement rail, quick actions | CaseServiceWorkspaceGridR4 + CaseSettlementRailCardLean | CloseFlowMetricTileV2 + RightRailCard + FinanceMetricTile | WAVE 1 / HIGH | R4 lean workspace is frozen baseline; do not disturb layout. |
| `/clients` | `src/pages/Clients.tsx` | client top metrics, cadence filters, client rows, highest commission | StatShortcutCard + contact cadence strip + record-list CSS | CloseFlowMetricTileV2 + SharedFilterStrip + ClientListCard | WAVE 1 / HIGH | Shared filters already partly aligned with Funnel. |
| `/clients/:clientId` | `src/pages/ClientDetail.tsx` | client detail header, relationship cards, active case cards, finance context | ClientDetailWorkspace + visual-stage12-client-detail-vnext.css | CloseFlowMetricTileV2 + DetailHeader + FinanceMetricTile | WAVE 1 / HIGH | Local file has dirty local changes; migrate carefully after cleanup. |
| `/tasks` | `src/pages/TasksStable.tsx` | task status metrics, due today, overdue, priority cards | tasks page local cards | CloseFlowMetricTileV2 + SharedFilterStrip + RecordListCard | WAVE 2 / MEDIUM | Operational but less critical than entity lists. |
| `/calendar` | `src/pages/Calendar.tsx` | events today/upcoming/source cards, event rows | Calendar local cards | CloseFlowMetricTileV2 + CalendarEventCard | WAVE 2 / MEDIUM | Keep Google/local source distinctions. |
| `/billing` | `src/pages/Billing.tsx` | commission, paid, unpaid, costs, balance | finance local cards | CloseFlowMetricTileV2 + FinanceMetricTile + CaseSettlementRailCardLean | WAVE 2 / HIGH | Money tone must be green; cost/warning amber/red only when needed. |
| `/activity` | `src/pages/Activity.tsx` | activity types, recent actions, operator log | activity feed cards | CloseFlowMetricTileV2 + ActivityFeedCard | WAVE 2 / MEDIUM | Feed cards should remain compact. |
| `/notifications` | `src/pages/NotificationsCenter.tsx` | top metric tiles, active filter pills, list header, row icons, right rail cards | legacy notifications-today-parity-card + cf-severity-dot row icon + conflict placeholder card | Top metric tiles -> CloseFlowMetricTileV2; Right rail cards -> RightRailCard; Rows -> NotificationsRow / RecordListCard derivative | WAVE 2 / MEDIUM / N1 BASELINE | N1 removes conflict placeholder card, moves last refresh to right meta, and replaces row icon dot with NotificationsRowIcon. |
| `/templates` | `src/pages/Templates.tsx` | template counts, categories, active/archive | template local cards | CloseFlowMetricTileV2 + RecordListCard | WAVE 3 / LOW-MEDIUM | Do after core sales/ops pages. |
| `/response-templates` | `src/pages/ResponseTemplates.tsx` | response template counts, usage, category cards | response template local cards | CloseFlowMetricTileV2 + RecordListCard | WAVE 3 / LOW-MEDIUM | Do with templates. |
| `/settings` | `src/pages/Settings.tsx` | integration status, account, config cards | settings local cards | SettingsStatusCard + CloseFlowMetricTileV2 | WAVE 3 / MEDIUM | Do not touch auth/config logic. |
| `/settings/ai` | `src/pages/AdminAiSettings.tsx` | providers, limits, keys, status cards | provider config cards | ProviderConfigCard + SettingsStatusCard + CloseFlowMetricTileV2 | WAVE 3 / MEDIUM | Do not expose secrets; visual mapping only. |
| `/support` | `src/pages/SupportCenter.tsx` | support categories, ticket/status cards | support local cards | CloseFlowMetricTileV2 + RecordListCard | WAVE 3 / LOW-MEDIUM | Exists in App route; include for completeness. |

## Wave plan

### Wave 1 — high risk / most visible

- `/funnel` — already source truth
- `/leads`
- `/clients`
- `/cases`
- `/case/:caseId`
- `/clients/:clientId`

### Wave 2 — operational

- `/today`
- `/tasks`
- `/calendar`
- `/billing`
- `/activity`
- `/notifications`

### Wave 3 — support / settings / template surfaces

- `/templates`
- `/response-templates`
- `/settings`
- `/settings/ai`
- `/support`

## Guard rule

Any stage migrating tiles must cite this atlas and must state which route/area from the table it changes.
