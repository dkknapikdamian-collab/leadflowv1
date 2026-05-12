# CLOSEFLOW MOBILE TILES SOURCE INSPECT — 2026-05-12

## Werdykt

INSPECT_ONLY: nie zmieniono runtime UI. Raport ma wskazać realny plik/wrapper przed następnym patchem.

## Top pliki po score

- `src/pages/Today.tsx` score=215 operator=false/0 stat=false/0 dataTrim=false centrum=false
- `src/components/ui-system/OperatorMetricTiles.tsx` score=179 operator=true/8 stat=true/1 dataTrim=false centrum=false
- `src/pages/TodayStable.tsx` score=117 operator=false/0 stat=false/0 dataTrim=false centrum=false
- `src/pages/Activity.tsx` score=99 operator=false/0 stat=true/8 dataTrim=false centrum=false
- `src/pages/Leads.tsx` score=77 operator=false/0 stat=true/8 dataTrim=false centrum=false
- `src/pages/Clients.tsx` score=68 operator=false/0 stat=true/6 dataTrim=false centrum=false
- `src/pages/Cases.tsx` score=67 operator=false/0 stat=true/7 dataTrim=false centrum=false
- `src/components/StatShortcutCard.tsx` score=66 operator=false/0 stat=true/6 dataTrim=false centrum=false
- `src/components/ui-system/index.ts` score=63 operator=true/5 stat=false/0 dataTrim=false centrum=false
- `src/pages/ResponseTemplates.tsx` score=55 operator=false/0 stat=true/6 dataTrim=false centrum=false
- `src/pages/Templates.tsx` score=55 operator=false/0 stat=true/6 dataTrim=false centrum=false
- `src/styles/closeflow-mobile-start-tile-trim.css` score=55 operator=false/0 stat=false/0 dataTrim=true centrum=true
- `src/styles/closeflow-operator-metric-tiles.css` score=54 operator=true/1 stat=true/3 dataTrim=false centrum=false
- `src/styles/closeflow-operator-semantic-tones.css` score=54 operator=true/2 stat=true/1 dataTrim=false centrum=false
- `src/styles/emergency/emergency-hotfixes.css` score=54 operator=true/2 stat=true/1 dataTrim=false centrum=false

## Kandydaci i fragmenty

### src/pages/Today.tsx — score 215

Patterny: Today @ line 3

```tsx
   1 | /*
   2 | STAGE11_REPAIR11_LEGACY_TODAY_UTF8_GUARD_COMPAT
   3 | Legacy guard compatibility markers for inactive Today.tsx.
   4 | Active / and /today route through TodayStable. These exact UTF-8 strings keep old source guards stable without changing active UI.
   5 | function TodayEntryRelationLinks
   6 | to={`/leads/${leadId}`}
   7 | to={`/cases/${caseId}`}
```

Patterny: TodayStable, Today @ line 4

```tsx
   1 | /*
   2 | STAGE11_REPAIR11_LEGACY_TODAY_UTF8_GUARD_COMPAT
   3 | Legacy guard compatibility markers for inactive Today.tsx.
   4 | Active / and /today route through TodayStable. These exact UTF-8 strings keep old source guards stable without changing active UI.
   5 | function TodayEntryRelationLinks
   6 | to={`/leads/${leadId}`}
   7 | to={`/cases/${caseId}`}
   8 | Otwórz lead
```

Patterny: Today @ line 5

```tsx
   1 | /*
   2 | STAGE11_REPAIR11_LEGACY_TODAY_UTF8_GUARD_COMPAT
   3 | Legacy guard compatibility markers for inactive Today.tsx.
   4 | Active / and /today route through TodayStable. These exact UTF-8 strings keep old source guards stable without changing active UI.
   5 | function TodayEntryRelationLinks
   6 | to={`/leads/${leadId}`}
   7 | to={`/cases/${caseId}`}
   8 | Otwórz lead
   9 | Otwórz sprawę
```

Patterny: Today @ line 10

```tsx
   6 | to={`/leads/${leadId}`}
   7 | to={`/cases/${caseId}`}
   8 | Otwórz lead
   9 | Otwórz sprawę
  10 | <TodayEntryRelationLinks entry={entry} />
  11 | <TodayEntryRelationLinks entry={entry} />
  12 | function formatTodayCompleteActionLabel
  13 | formatTodayCompleteActionLabel(isCompleted, completePending)
  14 | formatTodayCompleteActionLabel(isCompleted, completePending)
```

Patterny: Today @ line 11

```tsx
   7 | to={`/cases/${caseId}`}
   8 | Otwórz lead
   9 | Otwórz sprawę
  10 | <TodayEntryRelationLinks entry={entry} />
  11 | <TodayEntryRelationLinks entry={entry} />
  12 | function formatTodayCompleteActionLabel
  13 | formatTodayCompleteActionLabel(isCompleted, completePending)
  14 | formatTodayCompleteActionLabel(isCompleted, completePending)
  15 | return isCompleted ? 'Przywróć' : 'Zrobione';
```

Patterny: Today @ line 12

```tsx
   8 | Otwórz lead
   9 | Otwórz sprawę
  10 | <TodayEntryRelationLinks entry={entry} />
  11 | <TodayEntryRelationLinks entry={entry} />
  12 | function formatTodayCompleteActionLabel
  13 | formatTodayCompleteActionLabel(isCompleted, completePending)
  14 | formatTodayCompleteActionLabel(isCompleted, completePending)
  15 | return isCompleted ? 'Przywróć' : 'Zrobione';
  16 | const nextStatus = isCompletedTodayEntry(entry) ? 'scheduled' : 'completed'
```

Patterny: Today @ line 13

```tsx
   9 | Otwórz sprawę
  10 | <TodayEntryRelationLinks entry={entry} />
  11 | <TodayEntryRelationLinks entry={entry} />
  12 | function formatTodayCompleteActionLabel
  13 | formatTodayCompleteActionLabel(isCompleted, completePending)
  14 | formatTodayCompleteActionLabel(isCompleted, completePending)
  15 | return isCompleted ? 'Przywróć' : 'Zrobione';
  16 | const nextStatus = isCompletedTodayEntry(entry) ? 'scheduled' : 'completed'
  17 | const nextStatus = isCompletedTodayEntry(entry) ? 'todo' : 'done'
```

Patterny: Today @ line 14

```tsx
  10 | <TodayEntryRelationLinks entry={entry} />
  11 | <TodayEntryRelationLinks entry={entry} />
  12 | function formatTodayCompleteActionLabel
  13 | formatTodayCompleteActionLabel(isCompleted, completePending)
  14 | formatTodayCompleteActionLabel(isCompleted, completePending)
  15 | return isCompleted ? 'Przywróć' : 'Zrobione';
  16 | const nextStatus = isCompletedTodayEntry(entry) ? 'scheduled' : 'completed'
  17 | const nextStatus = isCompletedTodayEntry(entry) ? 'todo' : 'done'
  18 | */
```

### src/components/ui-system/OperatorMetricTiles.tsx — score 179

Patterny: OperatorMetricTiles @ line 8

```tsx
   4 | export type { OperatorMetricTone } from './operator-metric-tone-contract';
   5 | 
   6 | const CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V = 'CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V: isolated metric renderer';
   7 | /* CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V_COMPAT data-cf-metric-source-truth="vs5v" */
   8 | const CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W = 'CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W: OperatorMetricTiles owns value/icon tone and metric identity';
   9 | const CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3 = 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3: OperatorMetricTile is the shared final renderer for StatShortcutCard and OperatorMetricTiles';
  10 | const CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH_COMPAT = 'CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH: OperatorMetricTiles resolves tones from semantic id/label before local screen colors';
  11 | void CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V;
  12 | void CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W;
```

Patterny: OperatorMetricTiles, StatShortcutCard @ line 9

```tsx
   5 | 
   6 | const CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V = 'CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V: isolated metric renderer';
   7 | /* CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V_COMPAT data-cf-metric-source-truth="vs5v" */
   8 | const CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W = 'CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W: OperatorMetricTiles owns value/icon tone and metric identity';
   9 | const CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3 = 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3: OperatorMetricTile is the shared final renderer for StatShortcutCard and OperatorMetricTiles';
  10 | const CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH_COMPAT = 'CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH: OperatorMetricTiles resolves tones from semantic id/label before local screen colors';
  11 | void CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V;
  12 | void CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W;
  13 | void CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3;
```

Patterny: OperatorMetricTiles @ line 10

```tsx
   6 | const CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V = 'CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V: isolated metric renderer';
   7 | /* CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V_COMPAT data-cf-metric-source-truth="vs5v" */
   8 | const CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W = 'CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W: OperatorMetricTiles owns value/icon tone and metric identity';
   9 | const CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3 = 'CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3: OperatorMetricTile is the shared final renderer for StatShortcutCard and OperatorMetricTiles';
  10 | const CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH_COMPAT = 'CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH: OperatorMetricTiles resolves tones from semantic id/label before local screen colors';
  11 | void CLOSEFLOW_OPERATOR_METRIC_TILES_VS5V;
  12 | void CLOSEFLOW_OPERATOR_METRIC_TONE_PARITY_VS5W;
  13 | void CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3;
  14 | void CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH_COMPAT;
```

Patterny: OperatorMetricTiles @ line 31

```tsx
  27 |   ariaLabel?: string;
  28 |   helper?: ReactNode;
  29 | };
  30 | 
  31 | export type OperatorMetricTilesProps<TId extends string = string> = Omit<HTMLAttributes<HTMLElement>, 'onSelect'> & {
  32 |   items: OperatorMetricTileItem<TId>[];
  33 |   activeId?: TId | string | null;
  34 |   onSelect?: (item: OperatorMetricTileItem<TId>) => void;
  35 |   columns?: 2 | 3 | 4;
```

Patterny: OperatorMetricTiles @ line 39

```tsx
  35 |   columns?: 2 | 3 | 4;
  36 | };
  37 | 
  38 | 
  39 | export function OperatorMetricTiles<TId extends string = string>({
  40 |   items,
  41 |   activeId,
  42 |   onSelect,
  43 |   columns = 4,
```

Patterny: OperatorMetricTiles @ line 46

```tsx
  42 |   onSelect,
  43 |   columns = 4,
  44 |   className = '',
  45 |   ...rest
  46 | }: OperatorMetricTilesProps<TId>) {
  47 |   return (
  48 |     <section
  49 |       {...rest}
  50 |       className={['cf-operator-metric-grid', 'cf-operator-metric-grid-' + columns, className].filter(Boolean).join(' ')}
```

Patterny: OperatorMetricTiles @ line 52

```tsx
  48 |     <section
  49 |       {...rest}
  50 |       className={['cf-operator-metric-grid', 'cf-operator-metric-grid-' + columns, className].filter(Boolean).join(' ')}
  51 |       data-cf-operator-metric-grid="true"
  52 |       data-cf-metric-renderer="OperatorMetricTiles"
  53 |       data-cf-metric-source-truth="vs5x-repair3"
  54 |     >
  55 |       {items.map((item) => {
  56 |         const isActive = item.active ?? (activeId != null && String(activeId) === String(item.id));
```

Patterny: OperatorMetricTiles @ line 143

```tsx
 139 |     </button>
 140 |   );
 141 | }
 142 | 
 143 | export default OperatorMetricTiles;
 144 | 
```

### src/pages/TodayStable.tsx — score 117

Patterny: Today @ line 5

```tsx
   1 | import {
   2 |   EntityIcon } from '../components/ui-system';
   3 | /*
   4 | P0_TODAY_STABLE_REBUILD
   5 | Stable Today screen reads the same Supabase API collections that Network diagnostics proved are working.
   6 | This page intentionally bypasses the legacy Today.tsx scheduler stack for operator sections.
   7 | */
   8 | 
   9 | import {
```

Patterny: Today @ line 6

```tsx
   2 |   EntityIcon } from '../components/ui-system';
   3 | /*
   4 | P0_TODAY_STABLE_REBUILD
   5 | Stable Today screen reads the same Supabase API collections that Network diagnostics proved are working.
   6 | This page intentionally bypasses the legacy Today.tsx scheduler stack for operator sections.
   7 | */
   8 | 
   9 | import {
  10 |   useCallback,
```

Patterny: Today @ line 100

```tsx
  96 |   cases: any[];
  97 |   drafts: AiLeadDraft[];
  98 | };
  99 | 
 100 | type TodayLeadRisk = {
 101 |   reason: string;
 102 |   suggestedAction: string;
 103 |   score: number;
 104 |   tone: 'red' | 'amber' | 'blue' | 'slate';
```

Patterny: Today @ line 118

```tsx
 114 |   to: string;
 115 |   badge: string;
 116 | };
 117 | 
 118 | type TodaySectionKey = 'no_action' | 'risk' | 'waiting' | 'leads' | 'tasks' | 'events' | 'drafts' | 'upcoming';
 119 | 
 120 | const TODAY_SECTION_KEYS: TodaySectionKey[] = [
 121 |   'no_action',
 122 |   'risk',
```

Patterny: Today @ line 120

```tsx
 116 | };
 117 | 
 118 | type TodaySectionKey = 'no_action' | 'risk' | 'waiting' | 'leads' | 'tasks' | 'events' | 'drafts' | 'upcoming';
 119 | 
 120 | const TODAY_SECTION_KEYS: TodaySectionKey[] = [
 121 |   'no_action',
 122 |   'risk',
 123 |   'waiting',
 124 |   'leads',
```

Patterny: Today @ line 131

```tsx
 127 |   'upcoming',
 128 |   'drafts',
 129 | ];
 130 | 
 131 | function sanitizeTodayVisibleSections(value: unknown): TodaySectionKey[] {
 132 |   if (!Array.isArray(value)) return [...TODAY_SECTION_KEYS];
 133 |   const unique = new Set<TodaySectionKey>();
 134 |   for (const item of value) {
 135 |     if (TODAY_SECTION_KEYS.includes(item as TodaySectionKey)) unique.add(item as TodaySectionKey);
```

Patterny: Today @ line 133

```tsx
 129 | ];
 130 | 
 131 | function sanitizeTodayVisibleSections(value: unknown): TodaySectionKey[] {
 132 |   if (!Array.isArray(value)) return [...TODAY_SECTION_KEYS];
 133 |   const unique = new Set<TodaySectionKey>();
 134 |   for (const item of value) {
 135 |     if (TODAY_SECTION_KEYS.includes(item as TodaySectionKey)) unique.add(item as TodaySectionKey);
 136 |   }
 137 |   return [...unique];
```

Patterny: Today @ line 135

```tsx
 131 | function sanitizeTodayVisibleSections(value: unknown): TodaySectionKey[] {
 132 |   if (!Array.isArray(value)) return [...TODAY_SECTION_KEYS];
 133 |   const unique = new Set<TodaySectionKey>();
 134 |   for (const item of value) {
 135 |     if (TODAY_SECTION_KEYS.includes(item as TodaySectionKey)) unique.add(item as TodaySectionKey);
 136 |   }
 137 |   return [...unique];
 138 | }
 139 | 
```

### src/pages/Activity.tsx — score 99

Patterny: StatShortcutCard @ line 34

```tsx
  30 | import '../styles/visual-stage8-activity-vnext.css';
  31 | import '../styles/hotfix-right-rail-dark-wrappers.css';
  32 | 
  33 | import {
  34 |   StatShortcutCard
  35 | } from '../components/StatShortcutCard';
  36 | 
  37 | import {
  38 |   fetchActivitiesFromSupabase,
```

Patterny: StatShortcutCard @ line 35

```tsx
  31 | import '../styles/hotfix-right-rail-dark-wrappers.css';
  32 | 
  33 | import {
  34 |   StatShortcutCard
  35 | } from '../components/StatShortcutCard';
  36 | 
  37 | import {
  38 |   fetchActivitiesFromSupabase,
  39 |   fetchCasesFromSupabase,
```

Patterny: Kalendarz @ line 55

```tsx
  51 | import { getCloseFlowActionKindClass, getCloseFlowActionVisualClass, getCloseFlowActionVisualDataKind, inferCloseFlowActionVisualKind } from '../lib/action-visual-taxonomy';
  52 | const sourceOptions = [
  53 |   { value: 'all', label: 'Wszystko' },
  54 |   { value: 'today', label: 'Dziś' },
  55 |   { value: 'calendar', label: 'Kalendarz' },
  56 |   { value: 'lead', label: 'Lead' },
  57 |   { value: 'case', label: 'Sprawa' },
  58 |   { value: 'other', label: 'Inne' },
  59 | ];
```

Patterny: Leady @ line 80

```tsx
  76 | 
  77 | const activityFilters = [
  78 |   { value: 'all', label: 'Wszystko' },
  79 |   { value: 'today', label: 'Dzisiaj' },
  80 |   { value: 'lead', label: 'Leady' },
  81 |   { value: 'case', label: 'Sprawy' },
  82 |   { value: 'task', label: 'Zadania' },
  83 |   { value: 'event', label: 'Wydarzenia' },
  84 |   { value: 'system', label: 'Systemowe' },
```

Patterny: Zadania @ line 82

```tsx
  78 |   { value: 'all', label: 'Wszystko' },
  79 |   { value: 'today', label: 'Dzisiaj' },
  80 |   { value: 'lead', label: 'Leady' },
  81 |   { value: 'case', label: 'Sprawy' },
  82 |   { value: 'task', label: 'Zadania' },
  83 |   { value: 'event', label: 'Wydarzenia' },
  84 |   { value: 'system', label: 'Systemowe' },
  85 | ];
  86 | 
```

Patterny: Kalendarz @ line 275

```tsx
 271 | function getActivityTitle(activity: any) {
 272 |   const eventType = normalizeLower(activity?.eventType);
 273 |   const entity = getActivityEntity(activity);
 274 | 
 275 |   if (eventType === 'calendar_entry_completed') return 'Kalendarz: oznaczono wpis jako zrobiony';
 276 |   if (eventType === 'calendar_entry_restored') return 'Kalendarz: przywrócono wpis do pracy';
 277 |   if (eventType === 'calendar_entry_deleted') return 'Kalendarz: usunięto wpis';
 278 |   if (eventType === 'case_lifecycle_started') return 'Rozpoczęto realizację sprawy';
 279 |   if (eventType === 'case_lifecycle_completed') return 'Oznaczono sprawę jako zrobioną';
```

Patterny: Kalendarz @ line 276

```tsx
 272 |   const eventType = normalizeLower(activity?.eventType);
 273 |   const entity = getActivityEntity(activity);
 274 | 
 275 |   if (eventType === 'calendar_entry_completed') return 'Kalendarz: oznaczono wpis jako zrobiony';
 276 |   if (eventType === 'calendar_entry_restored') return 'Kalendarz: przywrócono wpis do pracy';
 277 |   if (eventType === 'calendar_entry_deleted') return 'Kalendarz: usunięto wpis';
 278 |   if (eventType === 'case_lifecycle_started') return 'Rozpoczęto realizację sprawy';
 279 |   if (eventType === 'case_lifecycle_completed') return 'Oznaczono sprawę jako zrobioną';
 280 |   if (eventType === 'case_lifecycle_reopened') return 'Przywrócono sprawę do pracy';
```

Patterny: Kalendarz @ line 277

```tsx
 273 |   const entity = getActivityEntity(activity);
 274 | 
 275 |   if (eventType === 'calendar_entry_completed') return 'Kalendarz: oznaczono wpis jako zrobiony';
 276 |   if (eventType === 'calendar_entry_restored') return 'Kalendarz: przywrócono wpis do pracy';
 277 |   if (eventType === 'calendar_entry_deleted') return 'Kalendarz: usunięto wpis';
 278 |   if (eventType === 'case_lifecycle_started') return 'Rozpoczęto realizację sprawy';
 279 |   if (eventType === 'case_lifecycle_completed') return 'Oznaczono sprawę jako zrobioną';
 280 |   if (eventType === 'case_lifecycle_reopened') return 'Przywrócono sprawę do pracy';
 281 |   if (eventType === 'today_task_completed') return 'Dziś: oznaczono zadanie jako zrobione';
```

### src/pages/Leads.tsx — score 77

Patterny: StatShortcutCard @ line 46

```tsx
  42 | import { Badge } from '../components/ui/badge';
  43 | import { Input } from '../components/ui/input';
  44 | import { Label } from '../components/ui/label';
  45 | import { EntityConflictDialog, type EntityConflictCandidate } from '../components/EntityConflictDialog';
  46 | import { StatShortcutCard } from '../components/StatShortcutCard';
  47 | import { requireWorkspaceId } from '../lib/workspace-context';
  48 | import {
  49 |   fetchCasesFromSupabase,
  50 |   fetchClientsFromSupabase,
```

Patterny: StatShortcutCard @ line 858

```tsx
 854 |           }
 855 |         />
 856 | 
 857 |         <div className="grid-5">
 858 |           <StatShortcutCard
 859 |             label="Wszystkie"
 860 |             value={stats.total}
 861 |             icon={LeadEntityIcon}
 862 |             active={quickFilter === 'all' && !valueSortEnabled && !showTrash}
```

Patterny: StatShortcutCard @ line 868

```tsx
 864 |             title="Pokaż wszystkie leady"
 865 |             ariaLabel="Pokaż wszystkie leady"
 866 |           />
 867 | 
 868 |           <StatShortcutCard
 869 |             label="Aktywne"
 870 |             value={stats.active}
 871 |             icon={TrendingUp}
 872 |             active={quickFilter === 'active' && !showTrash}
```

Patterny: StatShortcutCard @ line 880

```tsx
 876 |             valueClassName="text-slate-900"
 877 |             iconClassName="bg-blue-50 text-blue-500"
 878 |           />
 879 | 
 880 |           <StatShortcutCard
 881 |             label="Wartość"
 882 |             value={`${stats.value.toLocaleString('pl-PL')} PLN`}
 883 |             icon={TrendingUp}
 884 |             active={valueSortEnabled && !showTrash}
```

Patterny: StatShortcutCard @ line 891

```tsx
 887 |             ariaLabel="Sortuj leady po wartości"
 888 |             helper={valueSortEnabled ? 'sortowanie aktywne' : 'kliknij, aby sortować!'}
 889 |           />
 890 | 
 891 |           <StatShortcutCard
 892 |             label="Zagrożone"
 893 |             value={stats.atRisk}
 894 |             icon={AlertTriangle}
 895 |             active={quickFilter === 'at-risk' && !showTrash}
```

Patterny: StatShortcutCard @ line 902

```tsx
 898 |             ariaLabel="Pokaż zagrożone leady"
 899 |             tone="risk"
 900 |           />
 901 | 
 902 |           <StatShortcutCard
 903 |             label="Historia"
 904 |             value={stats.linkedToCase}
 905 |             icon={CaseEntityIcon}
 906 |             active={quickFilter === 'history' && !showTrash}
```

Patterny: StatShortcutCard @ line 1136

```tsx
1132 | </Layout>
1133 |   );
1134 | }
1135 | 
1136 | /* PHASE0_STAT_CARD_PAGE_GUARD StatShortcutCard onClick= toggleQuickFilter('active') toggleValueSorting */
1137 | 
1138 | /* GLOBAL_QUICK_ACTIONS_STAGE08D_LEAD_MODAL_EVENT_BUS */
1139 | 
1140 | /*
```

### src/pages/Clients.tsx — score 68

Patterny: StatShortcutCard @ line 45

```tsx
  41 |   actionIconClass,
  42 |   modalFooterClass
  43 | } from '../components/entity-actions';
  44 | import {
  45 |   StatShortcutCard
  46 | } from '../components/StatShortcutCard';
  47 | import {
  48 |   Button
  49 | } from '../components/ui/button';
```

Patterny: StatShortcutCard @ line 46

```tsx
  42 |   modalFooterClass
  43 | } from '../components/entity-actions';
  44 | import {
  45 |   StatShortcutCard
  46 | } from '../components/StatShortcutCard';
  47 | import {
  48 |   Button
  49 | } from '../components/ui/button';
  50 | import {
```

Patterny: StatShortcutCard @ line 619

```tsx
 615 |           }
 616 |         />
 617 | 
 618 |         <div className="grid-4">
 619 |           <StatShortcutCard
 620 |             label="Aktywni"
 621 |             value={activeCount}
 622 |             icon={LeadEntityIcon}
 623 |             active={!showArchived}
```

Patterny: StatShortcutCard @ line 630

```tsx
 626 |             ariaLabel="Pokaż aktywnych klientów"
 627 |             tone="blue"
 628 |             helper="z otwartą sprawą"
 629 |           />
 630 |           <StatShortcutCard
 631 |             label="Bez sprawy"
 632 |             value={clientsWithoutCases}
 633 |             icon={CaseEntityIcon}
 634 |             onClick={() => setShowArchived(false)}
```

Patterny: StatShortcutCard @ line 640

```tsx
 636 |             ariaLabel="Pokaż klientów bez sprawy"
 637 |             tone="neutral"
 638 |             helper="tylko kontakt"
 639 |           />
 640 |           <StatShortcutCard
 641 |             label="Wartość"
 642 |             value={formatClientMoney(relationValue)}
 643 |             icon={PaymentEntityIcon}
 644 |             onClick={() => setShowArchived(false)}
```

Patterny: StatShortcutCard @ line 650

```tsx
 646 |             ariaLabel="Pokaż wartość relacji"
 647 |             tone="green"
 648 |             helper="w relacjach"
 649 |           />
 650 |           <StatShortcutCard
 651 |             label="Bez ruchu"
 652 |             value={staleClients}
 653 |             icon={AlertTriangle}
 654 |             onClick={() => setShowArchived(false)}
```

Patterny: Leady @ line 693

```tsx
 689 |                              <span className="cf-list-row-value">{formatClientMoney(clientValue)}</span>
 690 |                            </span>
 691 |                            <span className="statusline">
 692 |                              {isArchived ? <span className="cf-status-pill" data-cf-status-tone="amber">W koszu</span> : counters.cases > 0 ? <span className="cf-status-pill cf-chip-case-active" data-cf-status-tone="green">Aktywna sprawa</span> : <span className="cf-status-pill cf-chip-no-case">Bez sprawy</span>}
 693 |                              <span className="cf-status-pill cf-chip-leads-count" data-cf-status-tone="blue">Leady: {counters.leads}</span>
 694 |                              <span className="cf-list-row-value cf-chip-client-value">Wartość: {formatClientMoney(clientValue)}</span>
 695 |                              <span className="pill cf-chip-last-contact">Ostatni kontakt: {counters.payments > 0 ? 'jest' : 'brak'}</span>
 696 |                            </span>
 697 |                          </span>
```

Patterny: Leady @ line 740

```tsx
 736 |                 {followupCandidates.length ? followupCandidates.map((client) => {
 737 |                   const counters = countersByClientId.get(client.id) || { leads: 0, cases: 0, payments: 0 };
 738 |                   return (
 739 |                     <Link key={client.id} to={`/clients/${client.id}`}>
 740 |                       <span><strong>{client.name || 'Klient'}</strong><small>Leady {counters.leads} · Sprawy {counters.cases}</small></span>
 741 |                       <EntityIcon entity="client" className="h-4 w-4" />
 742 |                     </Link>
 743 |                   );
 744 |                 }) : <div className="note">Brak klientów wymagających natychmiastowej uwagi.</div>}
```

### src/pages/Cases.tsx — score 67

Patterny: StatShortcutCard @ line 10

```tsx
   6 | import { EntityIcon } from '../components/ui-system/EntityIcon';
   7 | import { toast } from 'sonner';
   8 | 
   9 | import { ConfirmDialog } from '../components/confirm-dialog';
  10 | import { StatShortcutCard } from '../components/StatShortcutCard';
  11 | import Layout from '../components/Layout';
  12 | import { EntityTrashButton, modalFooterClass } from '../components/entity-actions';
  13 | import { Input } from '../components/ui/input';
  14 | import { Button } from '../components/ui/button';
```

Patterny: StatShortcutCard @ line 650

```tsx
 646 |           }
 647 |         />
 648 | 
 649 |         <div className="grid-4" data-stage16c-cases-stat-grid="true">
 650 |           <StatShortcutCard
 651 |             label="W realizacji"
 652 |             value={stats.total}
 653 |             icon={FileText}
 654 |             tone="blue"
```

Patterny: StatShortcutCard @ line 658

```tsx
 654 |             tone="blue"
 655 |             active={caseView === 'all'}
 656 |             onClick={() => setCaseView('all')}
 657 |           />
 658 |           <StatShortcutCard
 659 |             label="Czeka na klienta"
 660 |             value={stats.waiting}
 661 |             icon={Clock}
 662 |             tone="amber"
```

Patterny: StatShortcutCard @ line 666

```tsx
 662 |             tone="amber"
 663 |             active={caseView === 'waiting' || caseView === 'approval'}
 664 |             onClick={() => toggleCaseView('waiting')}
 665 |           />
 666 |           <StatShortcutCard
 667 |             label="Zablokowane"
 668 |             value={stats.blocked}
 669 |             icon={AlertTriangle}
 670 |             tone="red"
```

Patterny: StatShortcutCard @ line 674

```tsx
 670 |             tone="red"
 671 |             active={caseView === 'blocked'}
 672 |             onClick={() => toggleCaseView('blocked')}
 673 |           />
 674 |           <StatShortcutCard
 675 |             label="Gotowe"
 676 |             value={stats.ready}
 677 |             icon={CheckCircle2}
 678 |             tone="green"
```

Patterny: shortcut @ line 792

```tsx
 788 |             )}
 789 |           </div>
 790 | 
 791 |           <div className="cases-right-rail">
 792 |             <aside className="right-card cases-shortcuts-rail-card">
 793 |               <div className="panel-head"><div><h3>Operacyjne skróty</h3></div></div>
 794 |               <div className="quick-list">
 795 |                 <button type="button" onClick={() => toggleCaseView('needs_next_step')}><span>Bez zaplanowanej akcji</span><strong>{stats.needsNextStep}</strong></button>
 796 |                 <button type="button" onClick={() => toggleCaseView('linked')}><span>Portal klienta</span><strong>{stats.linked}</strong></button>
```

Patterny: StatShortcutCard @ line 837

```tsx
 833 |     </Layout>
 834 |   );
 835 | }
 836 | 
 837 | /* PHASE0_STAT_CARD_PAGE_GUARD StatShortcutCard onClick= toggleCaseView('blocked') toggleCaseView('needs_next_step') */
 838 | 
 839 | 
```

### src/components/StatShortcutCard.tsx — score 66

Patterny: StatShortcutCard @ line 10

```tsx
   6 | const ELITEFLOW_TODAY_METRIC_TILE_LOCK = 'ELITEFLOW_TODAY_METRIC_TILE_LOCK_2026_05_07';
   7 | const ELITEFLOW_FINAL_METRIC_TILES_HARD_LOCK = 'ELITEFLOW_FINAL_METRIC_TILES_HARD_LOCK_2026_05_07';
   8 | const ELITEFLOW_METRIC_TILES_COLOR_FONT_PARITY = 'ELITEFLOW_METRIC_TILES_COLOR_FONT_PARITY_2026_05_07';
   9 | const ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR = 'ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR_2026_05_07';
  10 | const CLOSEFLOW_VS2_STAT_SHORTCUT_CARD_METRIC_TILE_ADAPTER = 'StatShortcutCard delegates rendering to ui-system OperatorMetricTile';
  11 | const CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3 = 'StatShortcutCard is a compatibility adapter to OperatorMetricTile';
  12 | void STAGE16AK_UNIFIED_TOP_METRIC_TILES;
  13 | void STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE;
  14 | void ELITEFLOW_TODAY_METRIC_TILE_LOCK;
```

Patterny: StatShortcutCard @ line 11

```tsx
   7 | const ELITEFLOW_FINAL_METRIC_TILES_HARD_LOCK = 'ELITEFLOW_FINAL_METRIC_TILES_HARD_LOCK_2026_05_07';
   8 | const ELITEFLOW_METRIC_TILES_COLOR_FONT_PARITY = 'ELITEFLOW_METRIC_TILES_COLOR_FONT_PARITY_2026_05_07';
   9 | const ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR = 'ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR_2026_05_07';
  10 | const CLOSEFLOW_VS2_STAT_SHORTCUT_CARD_METRIC_TILE_ADAPTER = 'StatShortcutCard delegates rendering to ui-system OperatorMetricTile';
  11 | const CLOSEFLOW_METRIC_TILES_FINAL_SYSTEM_VS5X_REPAIR3 = 'StatShortcutCard is a compatibility adapter to OperatorMetricTile';
  12 | void STAGE16AK_UNIFIED_TOP_METRIC_TILES;
  13 | void STAGE16AL_METRIC_TILE_ICONS_NEXT_TO_VALUE;
  14 | void ELITEFLOW_TODAY_METRIC_TILE_LOCK;
  15 | void ELITEFLOW_FINAL_METRIC_TILES_HARD_LOCK;
```

Patterny: StatShortcutCard @ line 32

```tsx
  28 |   | 'value'
  29 |   | 'ai'
  30 |   | 'drafts';
  31 | 
  32 | export type StatShortcutCardProps = {
  33 |   key?: string | number;
  34 |   label: string;
  35 |   value: string | number;
  36 |   icon: ComponentType<{ className?: string }>;
```

Patterny: StatShortcutCard @ line 99

```tsx
  95 | 
  96 |   return 'neutral';
  97 | }
  98 | 
  99 | export function StatShortcutCard({
 100 |   label,
 101 |   value,
 102 |   icon,
 103 |   active = false,
```

Patterny: StatShortcutCard @ line 113

```tsx
 109 |   title,
 110 |   ariaLabel,
 111 |   tone,
 112 |   dataTab,
 113 | }: StatShortcutCardProps) {
 114 |   const resolvedTone = resolveMetricTone(label, valueClassName, iconClassName, tone);
 115 |   return (
 116 |     <OperatorMetricTile
 117 |       item={{
```

Patterny: StatShortcutCard @ line 142

```tsx
 138 | /* ELITEFLOW_TODAY_METRIC_TILE_LOCK_GUARD min-h-[72px] rounded-[22px] cf-top-metric-tile-label cf-top-metric-tile-value-row */
 139 | /* ELITEFLOW_METRIC_TILES_COLOR_FONT_PARITY_GUARD data-eliteflow-metric-tone resolveMetricTone */
 140 | /* ELITEFLOW_TASKS_TILES_TEXT_CLIP_REPAIR_GUARD no-truncate metric-value line-height-safe */
 141 | /* VS2_STAT_SHORTCUT_CARD_ADAPTER_COMPAT OperatorMetricTile data-cf-operator-metric-tile data-cf-metric-source-truth */
 142 | /* CLOSEFLOW_METRIC_TILES_FINAL_MIGRATION_VS5_GUARD StatShortcutCard delegates to OperatorMetricTile and must not render local card markup */
 143 | 
```

### src/components/ui-system/index.ts — score 63

Patterny: OperatorMetricTiles @ line 19

```tsx
  15 | export * from './semantic-visual-registry';
  16 | export * from './operator-metric-tone-contract';
  17 | export { OperatorMetricToneRuntime } from './OperatorMetricToneRuntime';
  18 | 
  19 | export * from './OperatorMetricTiles';
  20 | export { OperatorMetricTiles, OperatorMetricTile } from './OperatorMetricTiles';
  21 | export type { OperatorMetricTilesProps, OperatorMetricTileItem, OperatorMetricTone } from './OperatorMetricTiles';
  22 | export * from './screen-slots';
  23 | 
```

Patterny: OperatorMetricTiles @ line 20

```tsx
  16 | export * from './operator-metric-tone-contract';
  17 | export { OperatorMetricToneRuntime } from './OperatorMetricToneRuntime';
  18 | 
  19 | export * from './OperatorMetricTiles';
  20 | export { OperatorMetricTiles, OperatorMetricTile } from './OperatorMetricTiles';
  21 | export type { OperatorMetricTilesProps, OperatorMetricTileItem, OperatorMetricTone } from './OperatorMetricTiles';
  22 | export * from './screen-slots';
  23 | 
```

Patterny: OperatorMetricTiles @ line 21

```tsx
  17 | export { OperatorMetricToneRuntime } from './OperatorMetricToneRuntime';
  18 | 
  19 | export * from './OperatorMetricTiles';
  20 | export { OperatorMetricTiles, OperatorMetricTile } from './OperatorMetricTiles';
  21 | export type { OperatorMetricTilesProps, OperatorMetricTileItem, OperatorMetricTone } from './OperatorMetricTiles';
  22 | export * from './screen-slots';
  23 | 
```

### src/pages/ResponseTemplates.tsx — score 55

Patterny: StatShortcutCard @ line 19

```tsx
  15 | } from 'lucide-react';
  16 | import { toast } from 'sonner';
  17 | 
  18 | import Layout from '../components/Layout';
  19 | import { StatShortcutCard } from '../components/StatShortcutCard';
  20 | import { Button } from '../components/ui/button';
  21 | import { Card, CardContent } from '../components/ui/card';
  22 | import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
  23 | import { Input } from '../components/ui/input';
```

Patterny: StatShortcutCard @ line 205

```tsx
 201 |       <div className="cf-html-view mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 md:px-8 md:py-8" data-a13-template-style="response-templates-v2">
 202 |         <CloseFlowPageHeaderV2 pageKey="responseTemplates" />
 203 | 
 204 |         <section className="grid-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
 205 |           <StatShortcutCard label="Szablony" value={stats.total} icon={AiEntityIcon} iconClassName="app-primary-chip" valueClassName="app-text" />
 206 |           <StatShortcutCard label="Kategorie" value={stats.categories} icon={MessageSquareText} iconClassName="bg-indigo-500/12 text-indigo-600" valueClassName="app-text" />
 207 |           <StatShortcutCard label="Tagi" value={stats.tags} icon={Tags} iconClassName="bg-amber-500/12 text-amber-600" valueClassName="text-amber-600" />
 208 |           <StatShortcutCard label="Zmienne" value={stats.withVariables} icon={Copy} iconClassName="bg-emerald-500/12 text-emerald-600" valueClassName="text-emerald-600" />
 209 |         </section>
```

Patterny: StatShortcutCard @ line 206

```tsx
 202 |         <CloseFlowPageHeaderV2 pageKey="responseTemplates" />
 203 | 
 204 |         <section className="grid-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
 205 |           <StatShortcutCard label="Szablony" value={stats.total} icon={AiEntityIcon} iconClassName="app-primary-chip" valueClassName="app-text" />
 206 |           <StatShortcutCard label="Kategorie" value={stats.categories} icon={MessageSquareText} iconClassName="bg-indigo-500/12 text-indigo-600" valueClassName="app-text" />
 207 |           <StatShortcutCard label="Tagi" value={stats.tags} icon={Tags} iconClassName="bg-amber-500/12 text-amber-600" valueClassName="text-amber-600" />
 208 |           <StatShortcutCard label="Zmienne" value={stats.withVariables} icon={Copy} iconClassName="bg-emerald-500/12 text-emerald-600" valueClassName="text-emerald-600" />
 209 |         </section>
 210 | 
```

Patterny: StatShortcutCard @ line 207

```tsx
 203 | 
 204 |         <section className="grid-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
 205 |           <StatShortcutCard label="Szablony" value={stats.total} icon={AiEntityIcon} iconClassName="app-primary-chip" valueClassName="app-text" />
 206 |           <StatShortcutCard label="Kategorie" value={stats.categories} icon={MessageSquareText} iconClassName="bg-indigo-500/12 text-indigo-600" valueClassName="app-text" />
 207 |           <StatShortcutCard label="Tagi" value={stats.tags} icon={Tags} iconClassName="bg-amber-500/12 text-amber-600" valueClassName="text-amber-600" />
 208 |           <StatShortcutCard label="Zmienne" value={stats.withVariables} icon={Copy} iconClassName="bg-emerald-500/12 text-emerald-600" valueClassName="text-emerald-600" />
 209 |         </section>
 210 | 
 211 |         <Card className="cf-readable-card border-none app-surface-strong app-shadow">
```

Patterny: StatShortcutCard @ line 208

```tsx
 204 |         <section className="grid-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
 205 |           <StatShortcutCard label="Szablony" value={stats.total} icon={AiEntityIcon} iconClassName="app-primary-chip" valueClassName="app-text" />
 206 |           <StatShortcutCard label="Kategorie" value={stats.categories} icon={MessageSquareText} iconClassName="bg-indigo-500/12 text-indigo-600" valueClassName="app-text" />
 207 |           <StatShortcutCard label="Tagi" value={stats.tags} icon={Tags} iconClassName="bg-amber-500/12 text-amber-600" valueClassName="text-amber-600" />
 208 |           <StatShortcutCard label="Zmienne" value={stats.withVariables} icon={Copy} iconClassName="bg-emerald-500/12 text-emerald-600" valueClassName="text-emerald-600" />
 209 |         </section>
 210 | 
 211 |         <Card className="cf-readable-card border-none app-surface-strong app-shadow">
 212 |           <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
```


## CSS / display important / trim

### src/styles/clients-next-action-layout.css

line 9

```css
   6 | */
   7 | 
   8 | .main-clients-html .client-row {
   9 |   display: grid !important;
  10 |   grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr) minmax(7.5rem, auto);
  11 |   grid-template-areas:
  12 |     "index main value"
```

line 39

```css
  36 |   grid-area: next;
  37 |   width: 100%;
  38 |   min-width: 0;
  39 |   display: flex !important;
  40 |   flex-direction: column;
  41 |   align-items: flex-start;
  42 |   gap: 0.2rem;
```

line 75

```css
  72 |   justify-self: end;
  73 |   width: 100%;
  74 |   min-width: 0;
  75 |   display: flex !important;
  76 |   flex-wrap: wrap;
  77 |   justify-content: flex-end;
  78 |   gap: 0.5rem;
```

### src/styles/closeflow-calendar-color-tooltip-v2.css

line 39

```css
  36 | /* Stronger colors for type badges created by the tooltip enhancer */
  37 | #root [data-cf-page-header-v2="calendar"] ~ * .cf-calendar-type-badge,
  38 | #root [data-cf-page-header-v2="calendar"] ~ * [data-cf-calendar-kind] {
  39 |   display: inline-flex !important;
  40 |   align-items: center !important;
  41 |   justify-content: center !important;
  42 |   width: fit-content !important;
```

### src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css

line 38

```css
  35 |   [class*="calendar"] [class*="events"],
  36 |   [class*="calendar"] [class*="entries"]
  37 | ) {
  38 |   display: grid !important;
  39 |   grid-auto-rows: minmax(var(--cf-cal-month-chip-height-v1), auto) !important;
  40 |   gap: var(--cf-cal-month-chip-gap-v1) !important;
  41 |   align-items: start !important;
```

line 56

```css
  53 | ) {
  54 |   position: relative !important;
  55 |   isolation: isolate !important;
  56 |   display: grid !important;
  57 |   grid-template-columns: auto minmax(0, 1fr) !important;
  58 |   grid-auto-flow: column !important;
  59 |   align-items: center !important;
```

### src/styles/closeflow-calendar-month-entry-structural-fix-v3.css

line 37

```css
  34 | 
  35 | #root [data-cf-page-header-v2="calendar"] ~ * .cf-month-entry-chip-structural {
  36 |   box-sizing: border-box !important;
  37 |   display: flex !important;
  38 |   flex-direction: row !important;
  39 |   flex-wrap: nowrap !important;
  40 |   align-items: center !important;
```

line 94

```css
  91 |   height: 18px !important;
  92 |   min-height: 18px !important;
  93 |   max-height: 18px !important;
  94 |   display: inline-flex !important;
  95 |   align-items: center !important;
  96 |   justify-content: center !important;
  97 |   padding: 0 5px !important;
```

line 114

```css
 111 |   min-width: 0 !important;
 112 |   width: auto !important;
 113 |   max-width: 100% !important;
 114 |   display: block !important;
 115 |   height: 18px !important;
 116 |   max-height: 18px !important;
 117 |   font-size: 11px !important;
```

line 184

```css
 181 | 
 182 | #root [data-cf-page-header-v2="calendar"] ~ * .cf-month-entry-more,
 183 | #root [data-cf-page-header-v2="calendar"] ~ * :is([class*="more"], [class*="remaining"], [class*="overflow"]) {
 184 |   display: block !important;
 185 |   clear: both !important;
 186 |   margin-top: 2px !important;
 187 |   color: #2563eb !important;
```

### src/styles/closeflow-calendar-month-plain-text-rows-v4.css

line 26

```css
  23 | 
  24 | #root [data-cf-page-header-v2="calendar"] ~ * .cf-calendar-month-text-row {
  25 |   box-sizing: border-box !important;
  26 |   display: flex !important;
  27 |   flex-direction: row !important;
  28 |   flex-wrap: nowrap !important;
  29 |   align-items: center !important;
```

line 97

```css
  94 |   height: 14px !important;
  95 |   min-height: 14px !important;
  96 |   max-height: 14px !important;
  97 |   display: inline-flex !important;
  98 |   align-items: center !important;
  99 |   justify-content: center !important;
 100 |   border-radius: 999px !important;
```

line 117

```css
 114 |   min-width: 0 !important;
 115 |   width: auto !important;
 116 |   max-width: 100% !important;
 117 |   display: block !important;
 118 |   height: var(--cf-cal-month-line-height-v4) !important;
 119 |   max-height: var(--cf-cal-month-line-height-v4) !important;
 120 |   color: var(--cf-cal-month-line-text-v4) !important;
```

line 155

```css
 152 | /* Keep +X more as own row. */
 153 | #root [data-cf-page-header-v2="calendar"] ~ * .cf-calendar-month-more-row,
 154 | #root [data-cf-page-header-v2="calendar"] ~ * :is([class*="more"], [class*="remaining"], [class*="overflow"]) {
 155 |   display: block !important;
 156 |   width: 100% !important;
 157 |   margin-top: 2px !important;
 158 |   border: 0 !important;
```

### src/styles/closeflow-calendar-month-rows-no-overlap-repair2.css

line 62

```css
  59 |   [class*="calendar"] [class*="items"],
  60 |   [class*="calendar"] [class*="list"]
  61 | ) {
  62 |   display: block !important;
  63 |   position: relative !important;
  64 |   min-width: 0 !important;
  65 |   max-width: 100% !important;
```

line 83

```css
  80 |   box-sizing: border-box !important;
  81 |   position: relative !important;
  82 |   isolation: isolate !important;
  83 |   display: flex !important;
  84 |   flex-direction: row !important;
  85 |   flex-wrap: nowrap !important;
  86 |   align-items: center !important;
```

line 147

```css
 144 |   clear: none !important;
 145 |   z-index: auto !important;
 146 | 
 147 |   display: inline-flex !important;
 148 |   align-items: center !important;
 149 |   vertical-align: middle !important;
 150 | 
```

### src/styles/closeflow-calendar-selected-day-full-text-repair11.css

line 8

```css
   5 | 
   6 | #root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card,
   7 | #root [data-cf-calendar-selected-day="true"] .calendar-entry-card {
   8 |   display: block !important;
   9 |   width: 100% !important;
  10 |   min-height: 52px !important;
  11 |   overflow: visible !important;
```

line 20

```css
  17 | 
  18 | #root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card > div,
  19 | #root [data-cf-calendar-selected-day="true"] .calendar-entry-card > div {
  20 |   display: grid !important;
  21 |   grid-template-columns: auto minmax(0, 1fr) auto auto auto !important;
  22 |   align-items: center !important;
  23 |   gap: 10px !important;
```

line 31

```css
  28 | #root [data-cf-calendar-selected-day="true"] [data-cf-entry-type-label="true"],
  29 | #root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card .cf-entity-type-pill,
  30 | #root [data-cf-calendar-selected-day="true"] .calendar-entry-card .cf-entity-type-pill {
  31 |   display: inline-flex !important;
  32 |   align-items: center !important;
  33 |   justify-content: center !important;
  34 |   width: auto !important;
```

line 66

```css
  63 | 
  64 | #root .cf-html-shell [data-cf-calendar-selected-day="true"] [data-cf-entry-title="true"],
  65 | #root [data-cf-calendar-selected-day="true"] [data-cf-entry-title="true"] {
  66 |   display: block !important;
  67 |   min-width: 0 !important;
  68 |   max-width: 100% !important;
  69 |   overflow: visible !important;
```

### src/styles/closeflow-calendar-selected-day-full-text-repair12.css

line 8

```css
   5 | 
   6 | #root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card,
   7 | #root [data-cf-calendar-selected-day="true"] .calendar-entry-card {
   8 |   display: block !important;
   9 |   width: 100% !important;
  10 |   min-height: 52px !important;
  11 |   overflow: visible !important;
```

line 20

```css
  17 | 
  18 | #root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card > div,
  19 | #root [data-cf-calendar-selected-day="true"] .calendar-entry-card > div {
  20 |   display: grid !important;
  21 |   grid-template-columns: auto minmax(0, 1fr) auto auto auto !important;
  22 |   align-items: center !important;
  23 |   gap: 10px !important;
```

line 31

```css
  28 | #root [data-cf-calendar-selected-day="true"] [data-cf-entry-type-label="true"],
  29 | #root .cf-html-shell [data-cf-calendar-selected-day="true"] .calendar-entry-card .cf-entity-type-pill,
  30 | #root [data-cf-calendar-selected-day="true"] .calendar-entry-card .cf-entity-type-pill {
  31 |   display: inline-flex !important;
  32 |   align-items: center !important;
  33 |   justify-content: center !important;
  34 |   width: auto !important;
```

line 66

```css
  63 | 
  64 | #root .cf-html-shell [data-cf-calendar-selected-day="true"] [data-cf-entry-title="true"],
  65 | #root [data-cf-calendar-selected-day="true"] [data-cf-entry-title="true"] {
  66 |   display: block !important;
  67 |   min-width: 0 !important;
  68 |   max-width: 100% !important;
  69 |   overflow: visible !important;
```

### src/styles/closeflow-calendar-skin-only-v1.css

line 345

```css
 342 |   border-radius: var(--cf-cal-radius-md) !important;
 343 |   background: #f8fafc !important;
 344 |   color: var(--cf-cal-text-muted) !important;
 345 |   display: flex !important;
 346 |   align-items: center !important;
 347 |   justify-content: center !important;
 348 |   font-size: 13px !important;
```

line 368

```css
 365 | }
 366 | 
 367 | html body #root [data-calendar-month-entry="true"] {
 368 |   display: block !important;
 369 |   box-sizing: border-box;
 370 |   width: 100%;
 371 |   min-width: 0;
```

### src/styles/closeflow-case-detail-focus.css

line 267

```css
 264 | .cf-sub-card-header {
 265 |   padding: 18px 20px !important;
 266 |   border-bottom: 1px solid var(--cf-case-border);
 267 |   display: flex !important;
 268 |   align-items: center;
 269 |   justify-content: space-between;
 270 |   gap: 14px;
```

line 834

```css
 831 | 
 832 |   .cf-tabs-list {
 833 |     width: 100%;
 834 |     display: grid !important;
 835 |     grid-template-columns: repeat(3, 1fr);
 836 |   }
 837 | 
```

### src/styles/closeflow-client-event-modal-runtime-repair.css

line 12

```css
   9 |   width: min(780px, calc(100vw - 24px)) !important;
  10 |   max-width: 780px !important;
  11 |   max-height: min(92vh, 860px) !important;
  12 |   display: flex !important;
  13 |   flex-direction: column !important;
  14 |   overflow: hidden !important;
  15 |   border: 1px solid #dbe3ef !important;
```

line 47

```css
  44 |   background: #f8fafc !important;
  45 |   color: #0f172a !important;
  46 |   padding: 18px 22px !important;
  47 |   display: grid !important;
  48 |   gap: 14px !important;
  49 | }
  50 | 
```

line 95

```css
  92 |   position: sticky !important;
  93 |   bottom: 0 !important;
  94 |   z-index: 20 !important;
  95 |   display: flex !important;
  96 |   flex-wrap: wrap !important;
  97 |   justify-content: flex-end !important;
  98 |   gap: 10px !important;
```

line 131

```css
 128 |   }
 129 | 
 130 |   :where(.event-form-vnext-content, [data-event-create-dialog-stage85="true"], [data-event-create-dialog-stage22b="true"], .closeflow-event-modal-readable) :is(.event-form-footer, [data-event-modal-save-footer="true"], [data-radix-dialog-footer]) {
 131 |     display: grid !important;
 132 |     grid-template-columns: 1fr !important;
 133 |     margin: 8px -14px -14px !important;
 134 |     padding: 12px 14px !important;
```

### src/styles/closeflow-command-actions-source-truth.css

line 41

```css
  38 | #root .cf-html-shell [data-global-quick-actions="true"].global-actions,
  39 | #root [data-global-quick-actions="true"].global-actions,
  40 | [data-global-quick-actions="true"].global-actions {
  41 |   display: flex !important;
  42 |   flex-direction: row !important;
  43 |   flex-wrap: nowrap !important;
  44 |   align-items: center !important;
```

line 59

```css
  56 | [data-global-quick-actions="true"] :is(button, a, .btn) {
  57 |   min-height: var(--cf-command-action-height) !important;
  58 |   height: var(--cf-command-action-height) !important;
  59 |   display: inline-flex !important;
  60 |   align-items: center !important;
  61 |   justify-content: center !important;
  62 |   gap: var(--cf-command-action-gap) !important;
```

line 122

```css
 119 | /* -------------------------------------------------------------------------- */
 120 | 
 121 | #root .cf-html-shell [data-cf-page-header="true"].cf-page-header {
 122 |   display: grid !important;
 123 |   grid-template-columns: minmax(0, 1fr) max-content !important;
 124 |   align-items: start !important;
 125 |   column-gap: 18px !important;
```

line 129

```css
 126 | }
 127 | 
 128 | #root .cf-html-shell [data-cf-page-header="true"].cf-page-header .cf-page-hero-layout {
 129 |   display: grid !important;
 130 |   grid-template-columns: minmax(0, 1fr) max-content !important;
 131 |   align-items: start !important;
 132 |   column-gap: 18px !important;
```

line 160

```css
 157 |   align-self: var(--cf-command-actions-align) !important;
 158 |   margin-left: auto !important;
 159 | 
 160 |   display: flex !important;
 161 |   flex-direction: row !important;
 162 |   flex-wrap: nowrap !important;
 163 |   align-items: center !important;
```

### src/styles/closeflow-metric-tile-visual-source-truth.css

line 56

```css
  53 |   .cf-html-shell .main-today .grid:has([data-stat-shortcut-card]),
  54 |   .cf-html-shell .main-today .grid:has(.today-top-tile)
  55 | ) {
  56 |   display: grid !important;
  57 |   grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  58 |   gap: var(--cf-metric-source-gap) !important;
  59 |   align-items: stretch !important;
```

line 67

```css
  64 |   [data-stat-shortcut-card][data-eliteflow-today-metric-lock="true"],
  65 |   .cf-top-metric-tile
  66 | ) {
  67 |   display: block !important;
  68 |   width: 100% !important;
  69 |   min-height: 0 !important;
  70 |   padding: 0 !important;
```

line 94

```css
  91 |   min-height: var(--cf-metric-source-min-height) !important;
  92 |   height: 100% !important;
  93 |   width: 100% !important;
  94 |   display: flex !important;
  95 |   flex-direction: row !important;
  96 |   align-items: center !important;
  97 |   justify-content: space-between !important;
```

line 135

```css
 132 | html body #root .cf-top-metric-tile-left {
 133 |   min-width: 0 !important;
 134 |   flex: 1 1 auto !important;
 135 |   display: block !important;
 136 | }
 137 | 
 138 | html body #root :is(
```

line 148

```css
 145 |   .cf-html-shell .main-today .today-metric label,
 146 |   .cf-html-shell .main-today .today-shortcuts label
 147 | ) {
 148 |   display: block !important;
 149 |   max-width: 100% !important;
 150 |   margin: 0 !important;
 151 |   color: var(--cf-metric-source-label) !important;
```

### src/styles/closeflow-metric-tiles.css

line 63

```css
  60 | .cf-top-metric-tile-content {
  61 |   min-height: var(--cf-metric-tile-min-height) !important;
  62 |   width: 100%;
  63 |   display: flex !important;
  64 |   align-items: center !important;
  65 |   justify-content: space-between !important;
  66 |   gap: 16px !important;
```

line 125

```css
 122 | }
 123 | 
 124 | .cf-top-metric-tile-value-row {
 125 |   display: flex !important;
 126 |   align-items: center !important;
 127 |   justify-content: flex-end !important;
 128 |   gap: 12px !important;
```

line 149

```css
 146 |   width: var(--cf-metric-tile-icon-size) !important;
 147 |   height: var(--cf-metric-tile-icon-size) !important;
 148 |   min-width: var(--cf-metric-tile-icon-size) !important;
 149 |   display: inline-flex !important;
 150 |   align-items: center !important;
 151 |   justify-content: center !important;
 152 |   border-radius: var(--cf-metric-tile-icon-radius) !important;
```

line 236

```css
 233 |   .cf-html-view[data-a16-template-light-ui="true"]
 234 | ) :is(.grid-5, .grid-4, .grid-3, .stats-grid, .stat-grid, .metric-grid, .summary-grid),
 235 | main[data-p0-tasks-stable-rebuild="true"] section[data-eliteflow-task-stat-grid="true"] {
 236 |   display: grid !important;
 237 |   grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
 238 |   gap: var(--cf-metric-tile-gap) !important;
 239 |   align-items: stretch !important;
```

line 244

```css
 241 | 
 242 | main[data-p0-tasks-stable-rebuild="true"] section[data-eliteflow-task-stat-grid="true"] > [data-stat-shortcut-card] {
 243 |   min-height: 0 !important;
 244 |   display: block !important;
 245 |   padding: 0 !important;
 246 |   border: 0 !important;
 247 |   border-radius: var(--cf-metric-tile-radius) !important;
```

### src/styles/closeflow-mobile-start-tile-trim.css

line 12

```css
   9 | 
  10 | @media (max-width: 767px) {
  11 |   #root :is(
  12 |     [data-cf-mobile-start-tile-trim="true"],
  13 |     [data-cf-page-header-shortcuts="true"],
  14 |     [data-cf-page-header-tiles="true"],
  15 |     [data-cf-stat-shortcut-grid="true"],
```


## src/index.css imports

```css
9: @import "tailwindcss";
12: @import './styles/design-system/index.css';
15: @import './styles/core/core-contracts.css';
18: @import './styles/page-adapters/page-adapters.css';
21: @import './styles/legacy/legacy-imports.css';
24: @import './styles/temporary/temporary-overrides.css';
27: @import './styles/emergency/emergency-hotfixes.css';
237: @import "./styles/closeflow-mobile-start-tile-trim.css";
```
