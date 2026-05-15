# CloseFlow lead app - final checks v7

## Test results
- OK - node scripts/check-json-no-bom-stage73b.cjs
- OK - node scripts/check-project-memory.cjs
- OK - npm run check:project-memory
- SKIP - npm run typecheck
- OK - npm run build
- FAIL - npm run verify:closeflow:quiet

## Details

### OK - node scripts/check-json-no-bom-stage73b.cjs
~~~text
OK json no BOM stage73b
~~~

### OK - node scripts/check-project-memory.cjs
~~~text
OK: project memory files are complete for CloseFlow Lead App.
~~~

### OK - npm run check:project-memory
~~~text
> closeflow@0.0.0 check:project-memory
> node scripts/check-project-memory.cjs

OK: project memory files are complete for CloseFlow Lead App.
~~~

### SKIP - npm run typecheck
~~~text
Script not present in package.json.
~~~

### OK - npm run build
~~~text
o-hygiene-stage73.cjs

OK json no BOM stage73b
OK Calendar handler scope guard passed
OK right rail source truth stage70
OK: legacy clients lead-linking rail compatibility guard passed.
OK: legacy clients lead-linking rail compatibility guard passed.
OK: legacy clients lead-linking rail compatibility guard passed.
OK closeflow repo hygiene stage73

> closeflow@0.0.0 build
> vite build

[36mvite v6.4.2 [32mbuilding for production...[36m[39m
transforming...
[32mâś“[39m 3044 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                                                  [39m[1m[2m  1.74 kB[22m[1m[22m[2m â”‚ gzip:   0.66 kB[22m
[2mdist/[22m[35massets/hotfix-right-rail-dark-wrappers-C8Oihgab.css         [39m[1m[2m  2.85 kB[22m[1m[22m[2m â”‚ gzip:   0.54 kB[22m
[2mdist/[22m[35massets/Leads-D_9lLZa_.css                                   [39m[1m[2m  4.93 kB[22m[1m[22m[2m â”‚ gzip:   1.44 kB[22m
[2mdist/[22m[35massets/visual-stage23-client-case-forms-vnext-DLVgrbFg.css  [39m[1m[2m  5.16 kB[22m[1m[22m[2m â”‚ gzip:   1.32 kB[22m
[2mdist/[22m[35massets/Settings-B80anTkp.css                                [39m[1m[2m  6.61 kB[22m[1m[22m[2m â”‚ gzip:   1.61 kB[22m
[2mdist/[22m[35massets/Clients-ClWN_mxB.css                                 [39m[1m[2m  7.24 kB[22m[1m[22m[2m â”‚ gzip:   1.38 kB[22m
[2mdist/[22m[35massets/closeflow-page-header-v2-CVJvd1gS.css                [39m[1m[2m  8.83 kB[22m[1m[22m[2m â”‚ gzip:   1.78 kB[22m
[2mdist/[22m[35massets/SupportCenter-DbMfYC4h.css                           [39m[1m[2m  9.61 kB[22m[1m[22m[2m â”‚ gzip:   2.23 kB[22m
[2mdist/[22m[35massets/Billing-C_TinWM4.css                                 [39m[1m[2m  9.86 kB[22m[1m[22m[2m â”‚ gzip:   2.11 kB[22m
[2mdist/[22m[35massets/PublicLanding-C-dOsqc3.css                           [39m[1m[2m 10.91 kB[22m[1m[22m[2m â”‚ gzip:   2.47 kB[22m
[2mdist/[22m[35massets/closeflow-record-list-source-truth-DEDoVnVX.css      [39m[1m[2m 11.45 kB[22m[1m[22m[2m â”‚ gzip:   1.54 kB[22m
[2mdist/[22m[35massets/Activity-M0MNj6Uy.css                                [39m[1m[2m 12.75 kB[22m[1m[22m[2m â”‚ gzip:   2.60 kB[22m
[2mdist/[22m[35massets/NotificationsCenter-BdCs1Ouv.css                     [39m[1m[2m 13.20 kB[22m[1m[22m[2m â”‚ gzip:   2.62 kB[22m
[2mdist/[22m[35massets/Layout-DbmUe2fs.css                                  [39m[1m[2m 16.13 kB[22m[1m[22m[2m â”‚ gzip:   3.29 kB[22m
[2mdist/[22m[35massets/AiDrafts-ICOvzt1S.css                                [39m[1m[2m 17.60 kB[22m[1m[22m[2m â”‚ gzip:   3.26 kB[22m
[2mdist/[22m[35massets/LeadDetail-DCDewCLf.css                              [39m[1m[2m 17.79 kB[22m[1m[22m[2m â”‚ gzip:   3.36 kB[22m
[2mdist/[22m[35massets/Calendar-CvWnXgRr.css                                [39m[1m[2m 51.37 kB[22m[1m[22m[2m â”‚ gzip:   6.38 kB[22m
[2mdist/[22m[35massets/ClientDetail-CxnJDV-p.css                            [39m[1m[2m 74.51 kB[22m[1m[22m[2m â”‚ gzip:   9.14 kB[22m
[2mdist/[22m[35massets/index-DaJkT2q7.css                                   [39m[1m[2m712.22 kB[22m[1m[22m[2m â”‚ gzip:  90.61 kB[22m
[2mdist/[22m[36massets/app-preferences-OunjYGCB.js                          [39m[1m[2m  0.25 kB[22m[1m[22m[2m â”‚ gzip:   0.19 kB[22m
[2mdist/[22m[36massets/firebase-gKjVCrxB.js                                 [39m[1m[2m  0.53 kB[22m[1m[22m[2m â”‚ gzip:   0.38 kB[22m
[2mdist/[22m[36massets/browser-CfwPmiAU.js                                  [39m[1m[2m  0.62 kB[22m[1m[22m[2m â”‚ gzip:   0.43 kB[22m
[2mdist/[22m[36massets/input-CfPrE3Y3.js                                    [39m[1m[2m  0.90 kB[22m[1m[22m[2m â”‚ gzip:   0.48 kB[22m
[2mdist/[22m[36massets/card-fqCvUvtY.js                                     [39m[1m[2m  1.03 kB[22m[1m[22m[2m â”‚ gzip:   0.40 kB[22m
[2mdist/[22m[36massets/planned-actions-C473IeWU.js                          [39m[1m[2m  1.31 kB[22m[1m[22m[2m â”‚ gzip:   0.61 kB[22m
[2mdist/[22m[36massets/EntityIcon-sjMq378M.js                               [39m[1m[2m  1.36 kB[22m[1m[22m[2m â”‚ gzip:   0.60 kB[22m
[2mdist/[22m[36massets/StatShortcutCard-CqXUW_V9.js                         [39m[1m[2m  1.69 kB[22m[1m[22m[2m â”‚ gzip:   0.76 kB[22m
[2mdist/[22m[36massets/nearest-action-Bn0Gn-ag.js                           [39m[1m[2m  1.74 kB[22m[1m[22m[2m â”‚ gzip:   0.74 kB[22m
[2mdist/[22m[36massets/OperatorMetricTiles-C_qbas4f.js                      [39m[1m[2m  2.26 kB[22m[1m[22m[2m â”‚ gzip:   0.84 kB[22m
[2mdist/[22m[36massets/textarea-DMGukqW2.js                                 [39m[1m[2m  2.85 kB[22m[1m[22m[2m â”‚ gzip:   1.09 kB[22m
[2mdist/[22m[36massets/CloseFlowPageHeaderV2-C5bv9h-2.js                    [39m[1m[2m  3.17 kB[22m[1m[22m[2m â”‚ gzip:   1.59 kB[22m
[2mdist/[22m[36massets/closeflow-record-list-source-truth-D7rzWeWJ.js       [39m[1m[2m  5.12 kB[22m[1m[22m[2m â”‚ gzip:   1.91 kB[22m
[2mdist/[22m[36massets/AdminAiSettings-u1sAH3aY.js                          [39m[1m[2m  6.24 kB[22m[1m[22m[2m â”‚ gzip:   2.23 kB[22m
[2mdist/[22m[36massets/UiPreviewVNext-DX07H4cd.js                           [39m[1m[2m  6.63 kB[22m[1m[22m[2m â”‚ gzip:   1.77 kB[22m
[2mdist/[22m[36massets/ClientPortal-BkOYO_Hb.js                             [39m[1m[2m  9.57 kB[22m[1m[22m[2m â”‚ gzip:   3.52 kB[22m
[2mdist/[22m[36massets/ResponseTemplates-UTvzIpJN.js                        [39m[1m[2m 10.32 kB[22m[1m[22m[2m â”‚ gzip:   3.44 kB[22m
[2mdist/[22m[36massets/PublicLanding-CPHWsLzg.js                            [39m[1m[2m 10.43 kB[22m[1m[22m[2m â”‚ gzip:   3.17 kB[22m
[2mdist/[22m[36massets/screen-slots-DUuAEPVH.js                             [39m[1m[2m 10.74 kB[22m[1m[22m[2m â”‚ gzip:   3.43 kB[22m
[2mdist/[22m[36massets/SupportCenter-ClnFTVwM.js                            [39m[1m[2m 14.21 kB[22m[1m[22m[2m â”‚ gzip:   4.65 kB[22m
[2mdist/[22m[36massets/Login-DGVFLGl-.js                                    [39m[1m[2m 14.93 kB[22m[1m[22m[2m â”‚ gzip:   4.53 kB[22m
[2mdist/[22m[36massets/TasksStable-C-cmRrKH.js                              [39m[1m[2m 15.50 kB[22m[1m[22m[2m â”‚ gzip:   4.81 kB[22m
[2mdist/[22m[36massets/Billing-XLcS_L3w.js                                  [39m[1m[2m 16.26 kB[22m[1m[22m[2m â”‚ gzip:   5.76 kB[22m
[2mdist/[22m[36massets/NotificationsCenter-CQ4_2tQp.js                      [39m[1m[2m 17.59 kB[22m[1m[22m[2m â”‚ gzip:   5.36 kB[22m
[2mdist/[22m[36massets/Clients-L7zoDhkS.js                                  [39m[1m[2m 18.35 kB[22m[1m[22m[2m â”‚ gzip:   5.95 kB[22m
[2mdist/[22m[36massets/Activity-DfVUG552.js                                 [39m[1m[2m 20.12 kB[22m[1m[22m[2m â”‚ gzip:   5.54 kB[22m
[2mdist/[22m[36massets/Templates-D1ZM7LfT.js                                [39m[1m[2m 22.64 kB[22m[1m[22m[2m â”‚ gzip:   6.41 kB[22m
[2mdist/[22m[36massets/Cases-DQS2nhip.js                                    [39m[1m[2m 23.86 kB[22m[1m[22m[2m â”‚ gzip:   7.60 kB[22m
[2mdist/[22m[36massets/Leads-DMlTqKpa.js                                    [39m[1m[2m 25.73 kB[22m[1m[22m[2m â”‚ gzip:   8.31 kB[22m
[2mdist/[22m[36massets/Settings-Dz4BpLZb.js                                 [39m[1m[2m 30.60 kB[22m[1m[22m[2m â”‚ gzip:   8.03 kB[22m
[2mdist/[22m[36massets/AiDrafts-A06n1AN2.js                                 [39m[1m[2m 33.18 kB[22m[1m[22m[2m â”‚ gzip:   9.50 kB[22m
[2mdist/[22m[36massets/vendor-feedback-BoLVksxY.js                          [39m[1m[2m 33.84 kB[22m[1m[22m[2m â”‚ gzip:   9.57 kB[22m
[2mdist/[22m[36massets/vendor-date-DxUNpV6I.js                              [39m[1m[2m 34.31 kB[22m[1m[22m[2m â”‚ gzip:   9.69 kB[22m
[2mdist/[22m[36massets/TodayStable-BwSInP38.js                              [39m[1m[2m 36.04 kB[22m[1m[22m[2m â”‚ gzip:  10.70 kB[22m
[2mdist/[22m[36massets/vendor-routing-3S9uqWfj.js                           [39m[1m[2m 38.21 kB[22m[1m[22m[2m â”‚ gzip:  13.69 kB[22m
[2mdist/[22m[36massets/vendor-icons-BdYwAuRn.js                             [39m[1m[2m 39.47 kB[22m[1m[22m[2m â”‚ gzip:   7.60 kB[22m
[2mdist/[22m[36massets/LeadDetail-o-SgWZ1i.js                               [39m[1m[2m 46.61 kB[22m[1m[22m[2m â”‚ gzip:  12.58 kB[22m
[2mdist/[22m[36massets/CaseDetail-D-tMtXvg.js                               [39m[1m[2m 53.76 kB[22m[1m[22m[2m â”‚ gzip:  13.46 kB[22m
[2mdist/[22m[36massets/Calendar-BWnx-r4q.js                                 [39m[1m[2m 61.78 kB[22m[1m[22m[2m â”‚ gzip:  16.08 kB[22m
[2mdist/[22m[36massets/ClientDetail-Bf9oODR1.js                             [39m[1m[2m 63.54 kB[22m[1m[22m[2m â”‚ gzip:  16.22 kB[22m
[2mdist/[22m[36massets/UiPreviewVNextFull-D0BEVs_0.js                       [39m[1m[2m 71.77 kB[22m[1m[22m[2m â”‚ gzip:  13.85 kB[22m
[2mdist/[22m[36massets/vendor-radix-Bb5zOtlW.js                             [39m[1m[2m 78.01 kB[22m[1m[22m[2m â”‚ gzip:  23.53 kB[22m
[2mdist/[22m[36massets/Layout-BCLCQTQ6.js                                   [39m[1m[2m 82.99 kB[22m[1m[22m[2m â”‚ gzip:  23.75 kB[22m
[2mdist/[22m[36massets/vendor-firebase-DmwLizUx.js                          [39m[1m[2m183.59 kB[22m[1m[22m[2m â”‚ gzip:  37.96 kB[22m
[2mdist/[22m[36massets/index-cVC8G3XO.js                                    [39m[1m[2m241.04 kB[22m[1m[22m[2m â”‚ gzip:  68.18 kB[22m
[2mdist/[22m[36massets/vendor-react-Dc0mxdKt.js                             [39m[1m[2m336.75 kB[22m[1m[22m[2m â”‚ gzip: 110.36 kB[22m
[32mâś“ built in 4.91s[39m
~~~

### FAIL - npm run verify:closeflow:quiet
~~~text
m \'../components/ui/button\';\nimport { Badge } from \'../components/ui/badge\';\nimport { Input } from \'../components/ui/input\';\nimport { Label } from \'../components/ui/label\';\nimport { TopicContactPicker } from \'../components/topic-contact-picker\';\nimport { fetchCalendarBundleFromSupabase } from \'../lib/calendar-items\';\nimport {\r\n  buildStartEndPair,\r\n  combineScheduleEntries,\r\n  createDefaultRecurrence,\r\n  createDefaultReminder,\r\n  getEntriesForDay,\r\n  getEntryTone,\r\n  getTaskStartAt,\r\n  normalizeRecurrenceConfig,\r\n  normalizeReminderConfig,\r\n  syncTaskDerivedFields,\r\n  toDateTimeLocalValue,\r\n  toReminderAtIso,\r\n  type ScheduleEntry\r\n} from \'../lib/scheduling\';\nimport {\r\n  EVENT_TYPES,\r\n  PRIORITY_OPTIONS,\r\n  RECURRENCE_OPTIONS,\r\n  REMINDER_MODE_OPTIONS,\r\n  REMINDER_OFFSET_OPTIONS,\r\n  TASK_TYPES\r\n} from \'../lib/options\';\nimport { buildConflictCandidates, confirmScheduleConflicts } from \'../lib/schedule-conflicts\';\nimport {\r\n  buildTopicContactOptions,\r\n  findTopicContactOption,\r\n  resolveTopicContactLink,\r\n  type TopicContactOption\r\n} from \'../lib/topic-contact\';\nimport { requireWorkspaceId } from \'../lib/workspace-context\';\nimport {\r\n  deleteEventFromSupabase,\r\n  deleteTaskFromSupabase,\r\n  fetchCasesFromSupabase,\r\n  fetchClientsFromSupabase,\r\n  insertActivityToSupabase,\r\n  insertEventToSupabase,\r\n  insertTaskToSupabase,\r\n  updateEventInSupabase,\r\n  updateTaskInSupabase\r\n} from \'../lib/supabase-fallback\';\nimport { subscribeCloseflowDataMutations } from \'../lib/supabase-fallback\';\nimport { auth } from \'../firebase\';\nimport {\r\n  addDays,\r\n  addHours,\r\n  addMonths,\r\n  eachDayOfInterval,\r\n  endOfMonth,\r\n  endOfWeek,\r\n  format,\r\n  isSameDay,\r\n  isSameMonth,\r\n  isToday,\r\n  parseISO,\r\n  startOfMonth,\r\n  startOfWeek,\r\n  subMonths\r\n} from \'date-fns\';\nimport { toast } from \'sonner\';\nimport { useWorkspace } from \'../hooks/useWorkspace\';\nimport Layout from \'../components/Layout\';\nimport { pl } from \'date-fns/locale\';\nimport \'../styles/visual-stage22-event-form-vnext.css\';\nimport { normalizeWorkItem } from \'../lib/work-items/normalize\';\nimport { CloseFlowPageHeaderV2 } from \'../components/CloseFlowPageHeaderV2\';\nimport \'../styles/closeflow-page-header-v2.css\';\nimport \'../styles/closeflow-calendar-skin-only-v1.css\';\nimport \'../styles/closeflow-calendar-color-tooltip-v2.css\';\nimport \'../styles/closeflow-calendar-month-chip-overlap-fix-v1.css\';\nimport \'../styles/closeflow-calendar-month-rows-no-overlap-repair2.css\';\nimport \'../styles/closeflow-calendar-month-entry-structural-fix-v3.css\';\nimport \'../styles/closeflow-calendar-month-plain-text-rows-v4.css\';\nimport \'../styles/closeflow-calendar-selected-day-full-text-repair11.css\';\nimport \'../styles/closeflow-calendar-selected-day-new-tile-v9.css\';\r\n// CLOSEFLOW_CARD_READABILITY_CONTRACT_STAGE7_CALENDAR\r\n\r\ntype CalendarEditDraft = {\r\n  title: string;\r\n  type: string;\r\n  startAt: string;\r\n  endAt: string;\r\n  leadId: string;\r\n  caseId: string;\r\n  clientId?: string;\r\n  relationQuery: string;\r\n  priority: string;\r\n  status?: string;\r\n  recurrence: ReturnType<typeof createDefaultRecurrence>;\r\n  reminder: ReturnType<typeof createDefaultReminder>;\r\n};\r\n\r\ntype CalendarScale = \'compact\' | \'default\' | \'large\';\r\n\r\ntype CalendarView = \'week\' | \'month\';\r\n\r\nconst EVENT_FORM_VISUAL_REBUILD_STAGE22 = \'EVENT_FORM_VISUAL_REBUILD_STAGE22\';\r\nconst STAGE34_CALENDAR_COMPLETED_VISIBILITY = \'STAGE34_CALENDAR_COMPLETED_VISIBILITY calendar-entry-completed data-calendar-entry-completed data-calendar-stage34="readability-status-forms"\';\r\nconst EVENT_FORM_STAGE22_HUMAN_COPY = \'Nowe wydarzenie Edytuj wydarzenie TytuĹ‚ Typ Data Start Koniec PowiÄ…zanie Opis Status Zapisz wydarzenie Podaj tytuĹ‚ wydarzenia. Wybierz poprawnÄ… datÄ™. Godzina koĹ„ca nie moĹĽe byÄ‡ przed startem.\';\r\n\r\nconst CLOSEFLOW_FB1_CALENDAR_COPY_NOISE_CLEANUP = \'CLOSEFLOW_FB1_COPY_NOISE_CLEANUP_2026_05_09\';\r\nconst CALENDAR_SCALE_STORAGE_KEY = \'leadflow-calendar-scale\';\r\nconst CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2 = \'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_2026_05_12\';\r\nconst CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1 = \'CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_2026_05_12\';\r\nconst CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2 = \'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_2026_05_12\';\r\nconst CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1 = \'CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_2026_05_12\';\r\nconst CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2 = \'CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_2026_05_12\';\r\nconst CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2 = \'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_MASSCHECK_2026_05_12\';\r\nconst CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4 = \'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12\';\r\nconst CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR11 = \'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_TEXT_REPAIR11_2026_05_12\';\r\nconst CLOSEFLOW_CALENDAR_SKIN_ONLY_V1 = \'CLOSEFLOW_CALENDAR_SKIN_ONLY_V1_2026_05_12\';\nconst CLOSEFLOW_CALENDAR_SELECTED_DAY_HANDLER_SCOPE_FIX_V12_2026_05_14 = \'CLOSEFLOW_CALENDAR_SELECTED_DAY_HANDLER_SCOPE_FIX_V12_2026_05_14\';\r\nconst CALENDAR_VIEW_STORAGE_KEY = \'closeflow:calendar:view:v1\';\r\nconst modalSelectClass = \'w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20\';\r\n\r\nfunction readCalendarRawText(value: unknown, fallback = \'\') {\r\n  if (typeof value === \'string\') return value;\r\n  if (typeof value === \'number\' && Number.isFinite(value)) return String(value);\r\n  return fallback;\r\n}\r\nfunction readScheduleRawText(raw: ScheduleEntry[\'raw\'] | null | undefined, key: string, fallback = \'\') {\r\n  if (!raw || typeof raw !== \'object\') return fallback;\r\n  const value = (raw as Record<string, unknown>)[key];\r\n  if (typeof value === \'string\') return value.trim() || fallback;\r\n  if (typeof value === \'number\' && Number.isFinite(value)) return String(value);\r\n  return fallback;\r\n}\r\n\r\nfunction createEntryActionClass() {\r\n  return \'inline-flex h-[30px] w-auto min-w-0 items-center justify-center rounded-full border border-slate-200 bg-white px-3 text-[12px] font-bold leading-none text-slate-700 shadow-none transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50\';\r\n}\r\n\r\nfunction toCalendarDateInput(value: unknown, fallback: string) {\r\n  if (value instanceof Date && Number.isFinite(value.getTime())) return value.toISOString();\r\n  if (typeof value === \'string\' && value.trim()) return value.trim();\r\n  return fallback;\r\n}\r\n\r\nfunction buildEditDraft(entry: ScheduleEntry): CalendarEditDraft {\r\n  const normalized = normalizeWorkItem(entry.raw);\r\n  if (entry.kind === \'event\') {\r\n    return {\r\n      title: readCalendarRawText(entry.raw?.title, entry.title),\r\n      type: readCalendarRawText(entry.raw?.type, \'meeting\'),\r\n      startAt: normalized.dateAt || normalized.startAt || entry.startsAt,\r\n      endAt: normalized.endAt || readCalendarRawText(entry.raw?.endAt, entry.endsAt || buildStartEndPair(entry.startsAt).endAt),\r\n      leadId: readCalendarRawText(normalized.leadId),\r\n      caseId: readCalendarRawText(normalized.caseId),\r\n      relationQuery: entry.raw?.caseId ? (readCalendarRawText(entry.raw?.title, entry.title)) : readCalendarRawText(entry.raw?.leadName),\r\n      priority: \'medium\',\r\n      recurrence: normalizeRecurrenceConfig(entry.raw?.recurrence || { mode: entry.raw?.recurrenceRule || \'none\' }),\r\n      reminder: normalizeReminderConfig(entry.raw?.reminder || (entry.raw?.reminderAt ? { mode: \'once\', minutesBefore: 60 } : createDefaultReminder())),\r\n    };\r\n  }\r\n\r\n  if (entry.kind === \'task\') {\r\n    return {\r\n      title: readCalendarRawText(entry.raw?.title, entry.title),\r\n      type: readCalendarRawText(entry.raw?.type, \'follow_up\'),\r\n      startAt: normalized.dateAt || getTaskStartAt(entry.raw) || entry.startsAt,\r\n      endAt: \'\',\r\n      leadId: readCalendarRawText(normalized.leadId),\r\n      caseId: readCalendarRawText(normalized.caseId),\r\n      relationQuery: entry.raw?.caseId ? (readCalendarRawText(entry.raw?.title, entry.title)) : readCalendarRawText(entry.raw?.leadName),\r\n      priority: readCalendarRawText(entry.raw?.priority, \'medium\'),\r\n      recurrence: normalizeRecurrenceConfig(entry.raw?.recurrence || { mode: entry.raw?.recurrenceRule || \'none\' }),\r\n      reminder: normalizeReminderConfig(entry.raw?.reminder || (entry.raw?.reminderAt ? { mode: \'once\', minutesBefore: 60 } : createDefaultReminder())),\r\n    };\r\n  }\r\n\r\n  return {\r\n    title: entry.title,\r\n    type: \'follow_up\',\r\n    startAt: normalized.dateAt || entry.startsAt,\r\n    endAt: \'\',\r\n    leadId: readCalendarRawText(normalized.leadId),\r\n    caseId: readCalendarRawText(normalized.caseId),\r\n    relationQuery: readCalendarRawText(entry.raw?.leadName),\r\n    priority: readCalendarRawText(entry.raw?.priority, \'medium\'),\r\n    recurrence: normalizeRecurrenceConfig(entry.raw?.recurrence || { mode: entry.raw?.recurrenceRule || \'none\' }),\r\n    reminder: normalizeReminderConfig(entry.raw?.reminder || (entry.raw?.reminderAt ? { mode: \'once\', minutesBefore: 60 } : createDefaultReminder())),\r\n  };\r\n}\r\n\r\nfunction getEntrySubtitle(entry: ScheduleEntry) {\r\n  if (entry.leadName) {\r\n    return `Lead: ${entry.leadName}`;\r\n  }\r\n\r\n  return \'\';\r\n}\r\n\r\nfunction getCalendarEntryStatus(entry: ScheduleEntry) '... 97257 more characters,
    expected: /import \{ Link \} from 'react-router-dom'/,
    operator: 'match',
    diff: 'simple'
  }
~~~