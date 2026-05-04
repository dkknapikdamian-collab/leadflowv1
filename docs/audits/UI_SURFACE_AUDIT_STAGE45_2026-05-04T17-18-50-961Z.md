# CloseFlow UI Surface Audit Stage45

Generated: 2026-05-04T17:18:50.961Z

## Werdykt

NIE WDRAŻAĆ kolejnych punktowych patchy. Jest 24 wysokich problemów powierzchni UI/guardów.

## Route map

| route | component | file |
|---|---|---|
| /login | Login | src/pages/Login.tsx |
| /portal/:caseId/:token | ClientPortal | src/pages/ClientPortal.tsx |
| / | Today | src/pages/TodayStable.tsx |
| /leads | Leads | src/pages/Leads.tsx |
| /leads/:leadId | LeadDetail | src/pages/LeadDetail.tsx |
| /tasks | Tasks | src/pages/TasksStable.tsx |
| /calendar | Calendar | src/pages/Calendar.tsx |
| /cases | Cases | src/pages/Cases.tsx |
| /case/:caseId | CaseDetail | src/pages/CaseDetail.tsx |
| /cases/:caseId | CaseDetail | src/pages/CaseDetail.tsx |
| /clients | Clients | src/pages/Clients.tsx |
| /clients/:clientId | ClientDetail | src/pages/ClientDetail.tsx |
| /activity | Activity | src/pages/Activity.tsx |
| /ai-drafts | AiDrafts | src/pages/AiDrafts.tsx |
| /notifications | NotificationsCenter | src/pages/NotificationsCenter.tsx |
| /templates | Templates | src/pages/Templates.tsx |
| /case-templates | ResponseTemplates | src/pages/ResponseTemplates.tsx |
| /billing | Billing | src/pages/Billing.tsx |
| /help | SupportCenter | src/pages/SupportCenter.tsx |
| /settings/ai | AdminAiSettings | src/pages/AdminAiSettings.tsx |
| /settings | Settings | src/pages/Settings.tsx |
| /ui-preview-vnext | UiPreviewVNext | src/pages/UiPreviewVNext.tsx |
| /ui-preview-vnext-full | UiPreviewVNextFull | src/pages/UiPreviewVNextFull.tsx |
| * | PwaInstallPrompt | ? |

## Findings

### 1. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: scripts/audit-closeflow-ui-surface-stage45.mjs:104
- Evidence: `const noComments = stripComments(source); const idx = noComments.indexOf('src/pages/Tasks.tsx'); if (idx >= 0) { addFinding( findings, 'HIGH', 'dead-guard', file, lineOf(source, source.indexOf('src/pages/Tasks.tsx')), 'Guard/test sprawd`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 2. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: scripts/check-access-billing-source-of-truth-stage02a.cjs:135
- Evidence: `rface'); const screens = [ 'src/pages/Today.tsx', 'src/pages/Leads.tsx', 'src/pages/Tasks.tsx', 'src/pages/Calendar.tsx', 'src/pages/LeadDetail.tsx', 'src/pages/CaseDetail.tsx', ]; for (const screen of screens) { const content = readRequired(screen); const hasWorkspaceHook = /useWork`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 3. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: scripts/check-client-inline-edit-and-task-edit.cjs:17
- Evidence: `) { console.error(message); process.exit(1); } } const tasks = read('src/pages/Tasks.tsx'); const clientDetail = read('src/pages/ClientDetail.tsx'); const topicContact = read('src/lib/topic-contact.ts'); assert(tasks.includes('clientId: newTask.clientId || null'), 'Tasks add flow does no`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 4. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: scripts/check-faza4-etap44a-live-refresh-mutation-bus.cjs:34
- Evidence: `=='); } const files = { fallback: 'src/lib/supabase-fallback.ts', tasks: 'src/pages/Tasks.tsx', calendar: 'src/pages/Calendar.tsx', releaseDoc: 'docs/release/FAZA4_ETAP44A_LIVE_REFRESH_MUTATION_BUS_2026-05-04.md', technicalDoc: 'docs/technical/LIVE_REFRESH_MUTATION_BUS_STAGE44A_2026-05-0`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 5. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: scripts/check-faza4-etap44c-mutation-bus-coverage-smoke.cjs:53
- Evidence: `ny}\`); } const files = { fallback: 'src/lib/supabase-fallback.ts', tasks: 'src/pages/Tasks.tsx', calendar: 'src/pages/Calendar.tsx', today: 'src/pages/TodayStable.tsx', releaseDoc: 'docs/release/FAZA4_ETAP44C_MUTATION_BUS_COVERAGE_SMOKE_2026-05-04.md', technicalDoc: 'docs/technical/LIVE`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 6. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: scripts/check-google-calendar-stage08d-runtime-ui-sync.cjs:16
- Evidence: `ar must not block data load on Firebase auth.currentUser'); const tasks = read('src/pages/Tasks.tsx'); assert(tasks.includes('subscribeGlobalQuickAction'), 'Tasks must subscribe to same-route global actions'); assert(!tasks.includes('if (!auth.currentUser || workspaceLoading || !workspace?.id)'), 'T`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 7. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: scripts/check-hotfix-global-task-action-modal-no-route.cjs:25
- Evidence: `.tsx'); const globalSource = stripComments(globalRaw); const tasksRaw = read('src/pages/Tasks.tsx'); const tasksSource = stripComments(tasksRaw); const pkgRaw = read('package.json'); const quiet = read('scripts/closeflow-release-check-quiet.cjs'); expect('src/components/GlobalQuickActions.ts`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 8. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: scripts/check-task-edit-reminder-and-week-calendar.cjs:17
- Evidence: `) { console.error(message); process.exit(1); } } const tasks = read('src/pages/Tasks.tsx'); const today = read('src/pages/Today.tsx'); const calendar = read('src/pages/Calendar.tsx'); assert(tasks.includes('function TaskReminderEditor('), 'Tasks missing TaskReminderEditor'); assert(tasks`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 9. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: scripts/verify-global-task-unified-modal.mjs:18
- Evidence: `.tsx'); const globalSource = stripComments(globalRaw); const tasksRaw = read('src/pages/Tasks.tsx'); const tasksSource = stripComments(tasksRaw); const pkg = JSON.parse(read('package.json')); if (!globalRaw.includes('STAGE45C_GLOBAL_TASK_SINGLE_MODAL')) fail('missing Stage45C marker'); if (!`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 10. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: scripts/verify-task-reminders.mjs:13
- Evidence: `(message) => console.log('PASS task reminders:', message); const tasks = read('src/pages/Tasks.tsx'); const options = read('src/lib/options.ts'); function getBetween(source, startNeedle, endNeedle) { const start = source.indexOf(startNeedle); if (start === -1) return ''; const end = source.i`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 11. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: scripts/verify-tasks-header-cleanup.mjs:5
- Evidence: `const repo = process.cwd(); const tasks = fs.readFileSync(path.join(repo, 'src/pages/Tasks.tsx'), 'utf8'); const indexCss = fs.readFileSync(path.join(repo, 'src/index.css'), 'utf8'); const css = fs.readFileSync(path.join(repo, 'src/styles/tasks-header-stage45b-cleanup.css'), 'utf8'); funct`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 12. [HIGH] Widoczny techniczny tekst na ekranie Zadań

- Category: ui-copy
- File: src/pages/TasksStable.tsx:341
- Evidence: `zadań</h1> <p className="mt-2 max-w-2xl text-sm text-slate-600">Stabilny widok Supabase bez bramki Firebase. Dane ładują się od razu po wejściu w zakładkę.</p> </div> <div className="flex flex-wrap gap-2"> <Button type="button" variant="outlin`
- Recommendation: Usunąć techniczne copy z UI. Użytkownik nie powinien widzieć Firebase/Supabase/Stable.

### 13. [HIGH] Widoczny techniczny tekst na ekranie Zadań

- Category: ui-copy
- File: src/pages/TasksStable.tsx:341
- Evidence: `max-w-2xl text-sm text-slate-600">Stabilny widok Supabase bez bramki Firebase. Dane ładują się od razu po wejściu w zakładkę.</p> </div> <div className="flex flex-wrap gap-2"> <Button type="button" variant="outline" onClick={() => void refreshData()} disable`
- Recommendation: Usunąć techniczne copy z UI. Użytkownik nie powinien widzieć Firebase/Supabase/Stable.

### 14. [HIGH] Lokalny przycisk dodawania zadania jest nadal w realnym ekranie

- Category: duplicate-action
- File: src/pages/TasksStable.tsx:344
- Evidence: `<Button type="button" onClick={openNewTask} disabled={!hasAccess || workspaceLoading}> <Plus className="mr-2 h-4 w-4" /> Nowe zadanie </Button>`
- Recommendation: Usunąć lokalny CTA z nagłówka. Dodawanie ma iść z globalnego panelu operatora.

### 15. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: tests/faza4-etap44a-live-refresh-mutation-bus.test.cjs:23
- Evidence: `A Tasks and Calendar listen without full reload', () => { const tasks = read('src/pages/Tasks.tsx'); const calendar = read('src/pages/Calendar.tsx'); assert.match(tasks, /FAZA4_ETAP44A_TASKS_LIVE_REFRESH/); assert.match(tasks, /subscribeCloseflowDataMutations\(\(detail\)[\s\S]*refreshSupaba`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 16. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: tests/faza4-etap44c-mutation-bus-coverage-smoke.test.cjs:27
- Evidence: `d screens import and subscribe exactly once', () => { const screens = [ ['src/pages/Tasks.tsx', /refreshSupabaseData\s*\(/], ['src/pages/Calendar.tsx', /refreshSupabaseBundle\s*\(/], ['src/pages/TodayStable.tsx', /refreshData\s*\(\s*\)/], ]; for (const [relativePath, refreshRegex]`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 17. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: tests/global-quick-actions-open-modals.test.cjs:22
- Evidence: `', () => { const leads = read('src/pages/Leads.tsx'); const tasks = read('src/pages/Tasks.tsx'); const calendar = read('src/pages/Calendar.tsx'); assert.ok(leads.includes('consumeGlobalQuickAction')); assert.ok(leads.includes("consumeGlobalQuickAction() === 'lead'")); assert.ok(l`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 18. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: tests/hotfix-global-task-action-modal-no-route.test.cjs:48
- Evidence: `asks page remains owner of the task create modal', () => { const raw = read('src/pages/Tasks.tsx'); const source = stripComments(raw); assert.match(source, /consumeGlobalQuickAction/); assert.match(source, /consumeGlobalQuickAction\(\) === ['"]task['"]/); assert.match(source, /setIs`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 19. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: tests/hotfix-task-stat-tiles-clean.test.cjs:31
- Evidence: `asks page still uses shared stat shortcut cards', () => { const tasks = read('src/pages/Tasks.tsx'); assertIncludes(tasks, 'StatShortcutCard', 'Tasks.tsx'); });`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 20. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: tests/stage7_tasks_compact_after_calendar.test.cjs:7
- Evidence: `node:test'); const root = process.cwd(); const tasksPath = path.join(root, 'src/pages/Tasks.tsx'); const cssPath = path.join(root, 'src/styles/visual-stage30-tasks-compact-after-calendar.css'); const tasks = fs.readFileSync(tasksPath, 'utf8'); const css = fs.readFileSync(cssPath, 'utf8');`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 21. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: tests/stage7a_tasks_blue_outline_fix.test.cjs:7
- Evidence: `node:test'); const root = process.cwd(); const tasksPath = path.join(root, 'src/pages/Tasks.tsx'); const indexPath = path.join(root, 'src/index.css'); const cssPath = path.join(root, 'src/styles/stage7a-tasks-blue-outline-fix.css'); const tasks = fs.readFileSync(tasksPath, 'utf8'); const i`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 22. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: tests/stat-shortcut-cards-standard.test.cjs:25
- Evidence: `the same shared clickable stat card component', () => { for (const file of ['src/pages/Tasks.tsx', 'src/pages/Leads.tsx', 'src/pages/Cases.tsx']) { const source = read(file); assert.match(source, /StatShortcutCard/); assert.match(source, /onClick=/); assert.doesNotMatch(source, /c`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 23. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: tests/ui-completed-label-consistency.test.cjs:14
- Evidence: `); } const uiFiles = [ 'src/pages/Today.tsx', 'src/pages/Calendar.tsx', 'src/pages/Tasks.tsx', 'src/pages/Cases.tsx', 'src/pages/CaseDetail.tsx', 'src/pages/Dashboard.tsx', ]; test('completed action/status wording is consistent in main UI screens', () => { for (const file of uiFiles)`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 24. [HIGH] Guard/test sprawdza martwy Tasks.tsx zamiast realnego TasksStable.tsx

- Category: dead-guard
- File: tests/ui-copy-and-billing-cleanup.test.cjs:25
- Evidence: `s/Leads.tsx', 'src/pages/CaseDetail.tsx', 'src/pages/Clients.tsx', 'src/pages/Tasks.tsx', 'src/pages/Cases.tsx', ]; const offenders = files.filter((file) => { const source = fs.existsSync(path.join(root, file)) ? read(file) : ''; return forbiddenCopy.some((pattern) => pa`
- Recommendation: Przepiąć guard/test na src/pages/TasksStable.tsx albo sprawdzać komponent z mapowania App.tsx.

### 25. [MEDIUM] Inny plik poza realnym route zawiera modal/otwieranie zadania

- Category: duplicate-modal-surface
- File: src/components/TaskCreateDialog.tsx:102
- Evidence: `sk-create-dialog-stage45i="true"> <DialogHeader> <DialogTitle>Nowe zadanie</DialogTitle> </DialogHeader> <form onSubmit={handleSubmit} className="space-y-4"> <div className="space-y-2"> <Label>Tytuł</Label> <Input valu`
- Recommendation: Ustalić, czy to aktywny ekran, czy martwy legacy. Dla aktywnych powierzchni użyć wspólnego TaskCreateDialog.

### 26. [MEDIUM] Inny plik poza realnym route zawiera modal/otwieranie zadania

- Category: duplicate-modal-surface
- File: src/pages/Calendar.tsx:444
- Evidence: `[isNewEventOpen, setIsNewEventOpen] = useState(false); const [isNewTaskOpen, setIsNewTaskOpen] = useState(false); const [editEntry, setEditEntry] = useState<ScheduleEntry | null>(null); const [editDraft, setEditDraft] = useState<CalendarEditDraft | null>(null); const [actionPendingId, se`
- Recommendation: Ustalić, czy to aktywny ekran, czy martwy legacy. Dla aktywnych powierzchni użyć wspólnego TaskCreateDialog.

### 27. [MEDIUM] Inny plik poza realnym route zawiera modal/otwieranie zadania

- Category: duplicate-modal-surface
- File: src/pages/Tasks.tsx:4
- Evidence: `TASK_FORM_VISUAL_REBUILD_STAGE21_COMPAT_GUARD TASK_FORM_VISUAL_REBUILD_STAGE21 Nowe zadanie Edytuj zadanie Tytuł Typ Termin Priorytet Powiązanie Zapisz zadanie +1H +1D +1W Zrobione Podaj tytuł zadania. Nie udało się zapisać zadania. Spróbuj ponownie. */ /* TASKS_PAGE_GREEN_ADD_BUTTON_REMOVED_HOTFIX`
- Recommendation: Ustalić, czy to aktywny ekran, czy martwy legacy. Dla aktywnych powierzchni użyć wspólnego TaskCreateDialog.

### 28. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/Activity.tsx:628
- Evidence: `Effect(() => { let cancelled = false; setLoading(true); if (!isSupabaseConfigured() || workspaceLoading || !workspace?.id) { setActivities([]); setLeadLookup(new Map()); setCaseLookup(new Map());`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 29. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/AiDrafts.tsx:403
- Evidence: `ny) { setDrafts([]); toast.error('Nie udało się pobrać szkiców AI z Supabase: ' + (error?.message || 'REQUEST_FAILED')); } finally { setDraftsLoading(false); } }; useEffect(() => { void reloadDrafts(); }`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 30. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/Calendar.tsx:572
- Evidence: `freshTimer); refreshTimer = window.setTimeout(() => { void refreshSupabaseBundle().catch((error: any) => { console.warn('CALENDAR_LIVE_REFRESH_FAILED', error); }); }, 120); }); return () => {`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 31. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:42
- Evidence: `ientPortalTokenInSupabase, deleteCaseItemFromSupabase, fetchActivitiesFromSupabase, fetchCaseByIdFromSupabase, fetchCaseItemsFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, in`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 32. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:42
- Evidence: `ientPortalTokenInSupabase, deleteCaseItemFromSupabase, fetchActivitiesFromSupabase, fetchCaseByIdFromSupabase, fetchCaseItemsFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, in`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 33. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:43
- Evidence: `deleteCaseItemFromSupabase, fetchActivitiesFromSupabase, fetchCaseByIdFromSupabase, fetchCaseItemsFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, ins`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 34. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:43
- Evidence: `deleteCaseItemFromSupabase, fetchActivitiesFromSupabase, fetchCaseByIdFromSupabase, fetchCaseItemsFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, ins`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 35. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:44
- Evidence: `fetchActivitiesFromSupabase, fetchCaseByIdFromSupabase, fetchCaseItemsFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTa`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 36. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:44
- Evidence: `fetchActivitiesFromSupabase, fetchCaseByIdFromSupabase, fetchCaseItemsFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTa`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 37. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:45
- Evidence: `fetchCaseByIdFromSupabase, fetchCaseItemsFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseC`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 38. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:45
- Evidence: `fetchCaseByIdFromSupabase, fetchCaseItemsFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseC`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 39. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:46
- Evidence: `se, fetchCaseItemsFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInS`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 40. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:46
- Evidence: `se, fetchCaseItemsFromSupabase, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInS`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 41. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:47
- Evidence: `base, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInSupabase, updateCaseItemInS`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 42. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:47
- Evidence: `base, fetchEventsFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInSupabase, updateCaseItemInS`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 43. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:48
- Evidence: `ase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInSupabase, updateCaseItemInSupabase, updateEventInSupa`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 44. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:48
- Evidence: `ase, fetchTasksFromSupabase, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInSupabase, updateCaseItemInSupabase, updateEventInSupa`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 45. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:49
- Evidence: `base, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInSupabase, updateCaseItemInSupabase, updateEventInSupabase, updateTaskInSupab`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 46. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:49
- Evidence: `base, insertActivityToSupabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInSupabase, updateCaseItemInSupabase, updateEventInSupabase, updateTaskInSupab`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 47. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:50
- Evidence: `Supabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInSupabase, updateCaseItemInSupabase, updateEventInSupabase, updateTaskInSupabase, fetchLeadByIdFrom`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 48. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:50
- Evidence: `Supabase, insertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInSupabase, updateCaseItemInSupabase, updateEventInSupabase, updateTaskInSupabase, fetchLeadByIdFrom`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 49. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:51
- Evidence: `sertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInSupabase, updateCaseItemInSupabase, updateEventInSupabase, updateTaskInSupabase, fetchLeadByIdFromSupabase, } fr`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 50. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:51
- Evidence: `sertCaseItemToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, updateCaseInSupabase, updateCaseItemInSupabase, updateEventInSupabase, updateTaskInSupabase, fetchLeadByIdFromSupabase, } fr`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 51. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:484
- Evidence: `awy w adresie.'); setLoading(false); return; } if (!isSupabaseConfigured()) { setLoadError('Brak konfiguracji Supabase. Sprawdź zmienne środowiskowe aplikacji.'); setLoading(false); return;`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 52. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:484
- Evidence: `awy w adresie.'); setLoading(false); return; } if (!isSupabaseConfigured()) { setLoadError('Brak konfiguracji Supabase. Sprawdź zmienne środowiskowe aplikacji.'); setLoading(false); return;`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 53. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:485
- Evidence: `} if (!isSupabaseConfigured()) { setLoadError('Brak konfiguracji Supabase. Sprawdź zmienne środowiskowe aplikacji.'); setLoading(false); return; } let timeoutId: number | undefined; try {`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 54. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/CaseDetail.tsx:485
- Evidence: `} if (!isSupabaseConfigured()) { setLoadError('Brak konfiguracji Supabase. Sprawdź zmienne środowiskowe aplikacji.'); setLoading(false); return; } let timeoutId: number | undefined; try {`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 55. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/Cases.tsx:253
- Evidence: `eEffect(() => { let isMounted = true; setLoading(true); if (!isSupabaseConfigured() || workspaceLoading || !workspace?.id) { setCases([]); setLeadCandidates([]); setClientCandidates([]); setCaseT`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 56. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/ClientDetail.tsx:43
- Evidence: `fetchActivitiesFromSupabase, fetchCasesFromSupabase, fetchClientByIdFromSupabase, fetchEventsFromSupabase, fetchLeadsFromSupabase, fetchPaymentsFromSupabase, fetchTasksFromSupabase, updateClientInSupabase, updateLe`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 57. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/ClientPortal.tsx:74
- Evidence: `ken) return; let cancelled = false; setLoading(true); if (!isSupabaseConfigured()) { setInvalidReason('Portal klienta wymaga skonfigurowanego Supabase.'); setIsValid(false); setLoading(false);`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 58. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/ClientPortal.tsx:75
- Evidence: `Configured()) { setInvalidReason('Portal klienta wymaga skonfigurowanego Supabase.'); setIsValid(false); setLoading(false); return () => { cancelled = true; }; } createPortalSessionFro`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 59. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:51
- Evidence: `mport { deleteEventFromSupabase, deleteLeadFromSupabase, deleteTaskFromSupabase, fetchActivitiesFromSupabase, fetchCasesFromSupabase, fetchEventsFromSupabase, fetchLeadByIdFromSupabase, fetchTasksFromSupabase, ins`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 60. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:52
- Evidence: `se, deleteLeadFromSupabase, deleteTaskFromSupabase, fetchActivitiesFromSupabase, fetchCasesFromSupabase, fetchEventsFromSupabase, fetchLeadByIdFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insert`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 61. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:53
- Evidence: `se, deleteTaskFromSupabase, fetchActivitiesFromSupabase, fetchCasesFromSupabase, fetchEventsFromSupabase, fetchLeadByIdFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertEventToSupabase, insertT`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 62. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:54
- Evidence: `e, fetchActivitiesFromSupabase, fetchCasesFromSupabase, fetchEventsFromSupabase, fetchLeadByIdFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabase`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 63. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:55
- Evidence: `ase, fetchCasesFromSupabase, fetchEventsFromSupabase, fetchLeadByIdFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, startLeadServic`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 64. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:56
- Evidence: `ase, fetchEventsFromSupabase, fetchLeadByIdFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, startLeadServiceInSupabase, updateActiv`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 65. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:57
- Evidence: `se, fetchLeadByIdFromSupabase, fetchTasksFromSupabase, insertActivityToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, startLeadServiceInSupabase, updateActivityInSupabase, deleteActiv`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 66. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:58
- Evidence: `pabase, fetchTasksFromSupabase, insertActivityToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, startLeadServiceInSupabase, updateActivityInSupabase, deleteActivityFromSupabase, update`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 67. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:59
- Evidence: `Supabase, insertActivityToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, startLeadServiceInSupabase, updateActivityInSupabase, deleteActivityFromSupabase, updateEventInSupabase, updat`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 68. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:60
- Evidence: `sertActivityToSupabase, insertEventToSupabase, insertTaskToSupabase, isSupabaseConfigured, startLeadServiceInSupabase, updateActivityInSupabase, deleteActivityFromSupabase, updateEventInSupabase, updateLeadInSupabase`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 69. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:466
- Evidence: `useEffect(() => { if (!leadId || !workspaceReady) return; if (!isSupabaseConfigured()) { setLoadError('Brak konfiguracji Supabase.'); setLoading(false); return; } void loadLead(); }, [leadId,`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 70. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:1083
- Evidence: `ks, events: linkedEvents, startLeadService: startLeadServiceInSupabase, updateTask: updateTaskInSupabase, updateEvent: updateEventInSupabase, }); setStartServiceSuccess({ caseId: result.ca`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 71. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:1084
- Evidence: `startLeadService: startLeadServiceInSupabase, updateTask: updateTaskInSupabase, updateEvent: updateEventInSupabase, }); setStartServiceSuccess({ caseId: result.caseId, title: result.caseTitle }); se`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 72. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/LeadDetail.tsx:1085
- Evidence: `, updateTask: updateTaskInSupabase, updateEvent: updateEventInSupabase, }); setStartServiceSuccess({ caseId: result.caseId, title: result.caseTitle }); setAssociatedCase(result.case); setLead(`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 73. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/Leads.tsx:251
- Evidence: `ading(false); } }, [workspace?.id]); useEffect(() => { if (!isSupabaseConfigured() || workspaceLoading || !workspace?.id) { setLoading(workspaceLoading); return; } void loadLeads(); }, [loadLeads`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 74. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/Login.tsx:69
- Evidence: `oogleLogin = async () => { if (!authConfig.configured) { toast.error('Supabase Auth nie jest skonfigurowany. Uzupełnij VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY.'); return; } if (isEmbeddedGoogleAuthBlockedUserAgent`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 75. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/Login.tsx:69
- Evidence: `red) { toast.error('Supabase Auth nie jest skonfigurowany. Uzupełnij VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY.'); return; } if (isEmbeddedGoogleAuthBlockedUserAgent()) { setGoogleWebViewBlocked(true); toast`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 76. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/Login.tsx:69
- Evidence: `rror('Supabase Auth nie jest skonfigurowany. Uzupełnij VITE_SUPABASE_URL i VITE_SUPABASE_ANON_KEY.'); return; } if (isEmbeddedGoogleAuthBlockedUserAgent()) { setGoogleWebViewBlocked(true); toast.error('Google bloku`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 77. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/Login.tsx:105
- Evidence: `assword(email, password, fullName); toast.success('Konto utworzone. Jeśli Supabase wymaga potwierdzenia, sprawdź e-mail.'); } catch (error: any) { toast.error('Błąd rejestracji: ' + (error?.message || 'UNKNOWN_ERROR'));`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 78. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/Login.tsx:183
- Evidence: `order border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"> Supabase Auth nie jest jeszcze skonfigurowany. Uzupełnij zmienne środowiskowe i redirect URL w panelu Supabase. </div> ) : null} <Tabs defa`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 79. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/Login.tsx:183
- Evidence: `jeszcze skonfigurowany. Uzupełnij zmienne środowiskowe i redirect URL w panelu Supabase. </div> ) : null} <Tabs defaultValue="login" className="space-y-6"> <TabsList className="grid w-full grid-cols-2 rounded-2`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 80. [LOW] Możliwy techniczny tekst w routowanym ekranie: guard

- Category: possible-tech-copy
- File: src/pages/Login.tsx:221
- Evidence: `/div> {googleWebViewBlocked ? ( <div data-google-webview-guard="true" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"> <p className="font-semibold">Google blokuje l`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 81. [LOW] Możliwy techniczny tekst w routowanym ekranie: stable

- Category: possible-tech-copy
- File: src/pages/TasksStable.tsx:331
- Evidence: `assName="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6" data-p0-tasks-stable-rebuild="true"> <section className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6"> <div className="flex flex-`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 82. [LOW] Możliwy techniczny tekst w routowanym ekranie: Firebase

- Category: possible-tech-copy
- File: src/pages/TasksStable.tsx:337
- Evidence: `Name="mt-2 max-w-2xl text-sm text-slate-600">Stabilny widok Supabase bez bramki Firebase. Dane ładują się od razu po wejściu w zakładkę.</p> </div> <div className="flex flex-wrap gap-2"> <Button type`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 83. [LOW] Możliwy techniczny tekst w routowanym ekranie: Supabase

- Category: possible-tech-copy
- File: src/pages/TasksStable.tsx:337
- Evidence: `<p className="mt-2 max-w-2xl text-sm text-slate-600">Stabilny widok Supabase bez bramki Firebase. Dane ładują się od razu po wejściu w zakładkę.</p> </div> <div className="flex flex-wrap gap-2">`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 84. [LOW] Możliwy techniczny tekst w routowanym ekranie: stable

- Category: possible-tech-copy
- File: src/pages/TodayStable.tsx:337
- Evidence: `assName="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6" data-p0-today-stable-rebuild="true"> <section className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6"> <div className="flex flex-co`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 85. [LOW] Możliwy techniczny tekst w routowanym ekranie: stable

- Category: possible-tech-copy
- File: src/pages/TodayStable.tsx:371
- Evidence: `</section> <section className="grid gap-4 xl:grid-cols-2"> <StableCard> <SectionHeader title="Leady do ruchu" count={operatorLeads.length} icon={<UserRound className="h-5 w-5" />} tone="bg-blue-50 text-blue-7`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 86. [LOW] Możliwy techniczny tekst w routowanym ekranie: stable

- Category: possible-tech-copy
- File: src/pages/TodayStable.tsx:383
- Evidence: `)) : <EmptyState text="Brak leadów wymagających ruchu." />} </StableCard> <StableCard> <SectionHeader title="Zadania na dziś" count={operatorTasks.length} icon={<CheckSquare className="h-5 w-5" />} t`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 87. [LOW] Możliwy techniczny tekst w routowanym ekranie: stable

- Category: possible-tech-copy
- File: src/pages/TodayStable.tsx:385
- Evidence: `text="Brak leadów wymagających ruchu." />} </StableCard> <StableCard> <SectionHeader title="Zadania na dziś" count={operatorTasks.length} icon={<CheckSquare className="h-5 w-5" />} tone="bg-emerald-50 text-`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 88. [LOW] Możliwy techniczny tekst w routowanym ekranie: stable

- Category: possible-tech-copy
- File: src/pages/TodayStable.tsx:400
- Evidence: `}) : <EmptyState text="Brak zadań zaległych lub na dziś." />} </StableCard> <StableCard> <SectionHeader title="Wydarzenia" count={todayEvents.length} icon={<CalendarDays className="h-5 w-5" />} tone="b`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 89. [LOW] Możliwy techniczny tekst w routowanym ekranie: stable

- Category: possible-tech-copy
- File: src/pages/TodayStable.tsx:402
- Evidence: `ext="Brak zadań zaległych lub na dziś." />} </StableCard> <StableCard> <SectionHeader title="Wydarzenia" count={todayEvents.length} icon={<CalendarDays className="h-5 w-5" />} tone="bg-indigo-50 text-indigo-`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 90. [LOW] Możliwy techniczny tekst w routowanym ekranie: stable

- Category: possible-tech-copy
- File: src/pages/TodayStable.tsx:414
- Evidence: `/> )) : <EmptyState text="Brak wydarzeń na dziś." />} </StableCard> <StableCard> <SectionHeader title="Szkice do zatwierdzenia" count={pendingDrafts.length} icon={<FileText className="h-5 w-5"`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 91. [LOW] Możliwy techniczny tekst w routowanym ekranie: stable

- Category: possible-tech-copy
- File: src/pages/TodayStable.tsx:416
- Evidence: `mptyState text="Brak wydarzeń na dziś." />} </StableCard> <StableCard> <SectionHeader title="Szkice do zatwierdzenia" count={pendingDrafts.length} icon={<FileText className="h-5 w-5" />} tone="bg-amber-50 te`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.

### 92. [LOW] Możliwy techniczny tekst w routowanym ekranie: stable

- Category: possible-tech-copy
- File: src/pages/TodayStable.tsx:427
- Evidence: `)) : <EmptyState text="Brak szkiców do zatwierdzenia." />} </StableCard> </section> {loading ? ( <div className="fixed bottom-4 right-4 rounded-full border border-slate-200 bg-white px-4 py-2 te`
- Recommendation: Sprawdzić, czy to nie jest tekst widoczny dla użytkownika. Jeśli widoczny, usunąć albo przepisać na język produktowy.


## Następny krok

Najpierw naprawić wszystkie HIGH w jednym patchu. Dopiero potem uruchamiać pełny release gate.
