const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage178b-tasks-rail-guard-repair.cjs <repo>');

const rel = 'src/pages/TasksStable.tsx';
const file = path.join(repo, rel);
if (!fs.existsSync(file)) throw new Error(`Missing ${rel}`);

let source = fs.readFileSync(file, 'utf8');

function replaceOnce(text, find, replacement) {
  if (!text.includes(find)) return text;
  return text.replace(find, replacement);
}

function insertAfter(text, anchor, addition) {
  if (text.includes(addition.trim().split('\n')[0].trim())) return text;
  const index = text.indexOf(anchor);
  if (index < 0) throw new Error('Missing anchor for insertion: ' + anchor.slice(0, 120));
  return text.slice(0, index + anchor.length) + addition + text.slice(index + anchor.length);
}

function ensureImport() {
  const appPath = path.join(repo, 'src/App.tsx');
  let app = fs.readFileSync(appPath, 'utf8');
  const line = "import './styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css';";
  if (!app.includes(line)) {
    const lines = app.split(/\r?\n/);
    let insertAfterIndex = -1;
    for (const marker of [
      'closeflow-leads-clients-list-layout-source-truth-stage177.css',
      'closeflow-extend-main-search-source-truth-secondary-pages-stage175.css',
      'closeflow-main-search-surface-and-text-normalization-stage174.css'
    ]) {
      if (insertAfterIndex >= 0) break;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(marker)) { insertAfterIndex = i; break; }
      }
    }
    if (insertAfterIndex < 0) {
      for (let i = 0; i < lines.length; i++) {
        if (/^import ['"]\.\/styles\//.test(lines[i])) insertAfterIndex = i;
      }
    }
    if (insertAfterIndex < 0) throw new Error('No CSS import insertion point in src/App.tsx');
    lines.splice(insertAfterIndex + 1, 0, line);
    fs.writeFileSync(appPath, lines.join('\n'), 'utf8');
    console.log('UPDATED src/App.tsx: ensured Stage178 CSS import');
  }
}

ensureImport();

source = replaceOnce(
  source,
  "type TaskScope = 'active' | 'today' | 'overdue' | 'done';",
  "type TaskScope = 'active' | 'today' | 'overdue' | 'done' | 'high' | 'unlinked';"
);

const helperAnchor = `function isTaskOverdue(task: any) {
  const dateKey = getTaskDateKey(task);
  return Boolean(dateKey) && dateKey < localDateKey() && !isTaskDone(task);
}
`;

source = insertAfter(source, helperAnchor, `

type TaskGroupId = 'overdue' | 'today' | 'upcoming' | 'no_due' | 'done';

function isTaskHighPriority(task: any) {
  const priority = readText(task, ['priority'], '').trim().toLowerCase();
  return priority === 'high' || priority === 'urgent' || priority === 'wysoki' || priority === 'pilne';
}

function isTaskUnlinked(task: any) {
  const relationIds = getTaskRelationIds(task);
  return !relationIds.leadId && !relationIds.caseId && !relationIds.clientId;
}

function getTaskGroupId(task: any): TaskGroupId {
  if (isTaskDone(task)) return 'done';
  if (isTaskOverdue(task)) return 'overdue';
  if (isTaskToday(task)) return 'today';
  const raw = getTaskMomentRaw(task);
  if (!raw) return 'no_due';
  return 'upcoming';
}

function buildTaskGroups(tasksToGroup: any[]) {
  const groups: Array<{ id: TaskGroupId; label: string; hint: string; tasks: any[] }> = [
    { id: 'overdue', label: 'Zaległe', hint: 'najpierw odblokuj ryzyko', tasks: [] },
    { id: 'today', label: 'Dziś', hint: 'zadania na teraz', tasks: [] },
    { id: 'upcoming', label: 'Nadchodzące', hint: 'najbliższe terminy', tasks: [] },
    { id: 'no_due', label: 'Bez terminu', hint: 'do uporządkowania', tasks: [] },
    { id: 'done', label: 'Zrobione', hint: 'zamknięte działania', tasks: [] },
  ];

  const byId = new Map(groups.map((group) => [group.id, group]));
  for (const task of tasksToGroup) {
    byId.get(getTaskGroupId(task))?.tasks.push(task);
  }

  return groups.filter((group) => group.tasks.length > 0);
}

function getUrgentTasks(tasksToRank: any[]) {
  return tasksToRank
    .filter((task) => !isTaskDone(task))
    .slice()
    .sort((a, b) => {
      const scoreA = (isTaskOverdue(a) ? -2000000000000000 : 0) + (isTaskToday(a) ? -1000000000000000 : 0) + (isTaskHighPriority(a) ? -500000000000000 : 0) + parseTaskTime(a);
      const scoreB = (isTaskOverdue(b) ? -2000000000000000 : 0) + (isTaskToday(b) ? -1000000000000000 : 0) + (isTaskHighPriority(b) ? -500000000000000 : 0) + parseTaskTime(b);
      return scoreA - scoreB;
    })
    .slice(0, 5);
}
`);

source = source.replace(
  `        if (scope === 'done') return isTaskDone(task);
        if (scope === 'today') return !isTaskDone(task) && isTaskToday(task);
        if (scope === 'overdue') return isTaskOverdue(task);
        return !isTaskDone(task);`,
  `        if (scope === 'done') return isTaskDone(task);
        if (scope === 'today') return !isTaskDone(task) && isTaskToday(task);
        if (scope === 'overdue') return isTaskOverdue(task);
        if (scope === 'high') return !isTaskDone(task) && isTaskHighPriority(task);
        if (scope === 'unlinked') return !isTaskDone(task) && isTaskUnlinked(task);
        return !isTaskDone(task);`
);

const filteredBlockEnd = `  }, [casesById, scope, searchQuery, tasks]);
`;
source = insertAfter(source, filteredBlockEnd, `

  const groupedTasks = useMemo(() => buildTaskGroups(filteredTasks), [filteredTasks]);
  const urgentTasks = useMemo(() => getUrgentTasks(tasks), [tasks]);

  const taskScopeFilters = useMemo(() => ([
    { id: 'active' as TaskScope, label: 'Aktywne', count: stats.active, tone: 'blue' },
    { id: 'today' as TaskScope, label: 'Dziś', count: stats.today, tone: 'blue' },
    { id: 'overdue' as TaskScope, label: 'Zaległe', count: stats.overdue, tone: 'red' },
    { id: 'high' as TaskScope, label: 'Wysoki priorytet', count: tasks.filter((task) => !isTaskDone(task) && isTaskHighPriority(task)).length, tone: 'amber' },
    { id: 'unlinked' as TaskScope, label: 'Bez powiązania', count: tasks.filter((task) => !isTaskDone(task) && isTaskUnlinked(task)).length, tone: 'neutral' },
    { id: 'done' as TaskScope, label: 'Zrobione', count: stats.done, tone: 'green' },
  ]), [stats, tasks]);

  const nextTaskMoment = urgentTasks[0] ? formatTaskMoment(urgentTasks[0]) : 'Brak';
`);

source = source.replace(
  /<main className="mx-auto flex w-full max-w-[^"]* flex-col gap-5 p-4 sm:p-6"([^>]*)>/,
  (match, attrs) => {
    let next = `<main className="mx-auto flex w-full max-w-none flex-col gap-5 p-4 sm:p-6"${attrs}>`;
    if (!next.includes('data-stage178-tasks-operational-panel="true"')) {
      next = next.replace(/>$/, ' data-stage178-tasks-operational-panel="true">');
    }
    return next;
  }
);

if (!source.includes('Filtry zadań')) {
  const metricsEnd = source.indexOf(`        />\n\n`, source.indexOf('<OperatorMetricTiles'));
  const dialogStart = source.indexOf(`        <Dialog open={isDialogOpen}`, metricsEnd);
  if (metricsEnd < 0 || dialogStart < 0) {
    throw new Error('Cannot locate task search/list area for Stage178B repair.');
  }

  const before = source.slice(0, metricsEnd + `        />\n\n`.length);
  const after = source.slice(dialogStart);

  const newBlock = `        <div className="tasks-stage178-workspace" data-stage178-tasks-workspace="true">
          <div className="tasks-stage178-main-stack">
            <Card className="border-slate-100 shadow-sm" data-tasks-search-panel-stage178="true">
              <CardContent className="p-4 sm:p-5">
                <div className="tasks-stage178-search-row">
                  <div className="relative w-full cf-main-search cf-main-search-stage175 cf-main-search-stage178" data-cf-main-search-source="stage173" data-cf-main-search-stage175="true" data-cf-main-search-stage178="true">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Szukaj zadania, sprawy albo priorytetu..." />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">Widoczne: {filteredTasks.length}</p>
                </div>
              </CardContent>
            </Card>

            <section className="tasks-stage178-grouped-list" data-tasks-compact-list-stage48="true" data-stage178-tasks-grouped-list="true">
              {loading ? (
                <Card className="border-slate-100"><CardContent className="flex items-center gap-3 p-5 text-slate-600"><Loader2 className="h-4 w-4 animate-spin" /> Ładowanie zadań...</CardContent></Card>
              ) : filteredTasks.length ? groupedTasks.map((group) => (
                <div key={group.id} className="tasks-stage178-group" data-stage178-task-group={group.id}>
                  <div className="tasks-stage178-group-header">
                    <div className="tasks-stage178-group-title">
                      <strong>{group.label}</strong>
                      <span>{group.hint}</span>
                    </div>
                    <span className="tasks-stage178-group-count">{group.tasks.length}</span>
                  </div>

                  {group.tasks.map((task) => {
                    const caseRecord = task.caseId ? casesById.get(String(task.caseId)) : null;
                    return (
                      <Card key={String(task.id || getTaskTitle(task))} className="border-slate-100 shadow-sm tasks-stage48-task-card">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="cf-status-pill" data-cf-status-tone={getTaskStatusTone(task)}>{getStatusBadge(task)}</span>
                                <Badge variant="outline" className="rounded-full">{readText(task, ['priority'], 'medium')}</Badge>
                                <Badge variant="outline" className="rounded-full">{readText(task, ['type'], 'task')}</Badge>
                              </div>
                              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1" data-task-title-date-row-stage48="true">
                                <h2 className={'text-base font-bold text-slate-950 sm:text-lg ' + (isTaskDone(task) ? 'line-through opacity-60' : '')}>{getTaskTitle(task)}</h2>
                                <span className="text-xs font-bold text-slate-500" data-task-date-inline-stage48="true">{formatTaskMoment(task)}</span>
                              </div>
                              {caseRecord ? <p className="mt-1 text-sm text-slate-600">Sprawa: {getCaseTitle(caseRecord)}</p> : null}
                              {readText(task, ['leadName', 'lead_name'], '') ? <p className="mt-1 text-sm text-slate-600">Lead: {readText(task, ['leadName', 'lead_name'], '')}</p> : null}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button type="button" variant="outline" className={actionButtonClass('neutral', 'tasks-stage47-action-button tasks-stage48-task-action-button')} data-task-action-visible-stage48="done-toggle" onClick={() => void toggleTask(task)}>
                                {isTaskDone(task) ? 'Przywróć' : 'Zrobione'}
                              </Button>
                              <Button type="button" variant="outline" className={actionButtonClass('neutral', 'tasks-stage47-action-button tasks-stage48-task-action-button')} data-task-action-visible-stage48="edit" onClick={() => openEditTask(task)}>
                                Edytuj
                              </Button>
                              <EntityTrashButton type="button" variant="outline" className="tasks-stage47-action-button tasks-stage48-task-action-button tasks-stage48-danger-action" data-task-action-visible-stage48="delete" onClick={() => void deleteTask(task)}>
                                <Trash2 className={trashActionIconClass("mr-2 h-4 w-4")} /> Usuń
                              </EntityTrashButton>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )) : (
                <Card className="border-slate-100"><CardContent className="p-6 text-sm text-slate-500">Brak zadań w tym widoku.</CardContent></Card>
              )}
            </section>
          </div>

          <aside className="tasks-stage178-right-rail cf-operator-right-rail" data-stage178-tasks-right-rail="true" aria-label="Panel operacyjny zadań">
            <section className="tasks-stage178-rail-card" data-stage178-tasks-filter-card="true">
              <div className="tasks-stage178-rail-head">
                <h2>Filtry zadań</h2>
                <p>Bez klikania po zakładkach. Najpierw to, co wymaga ruchu.</p>
              </div>
              <div className="tasks-stage178-filter-list">
                {taskScopeFilters.map((filter) => (
                  <button key={filter.id} type="button" className="tasks-stage178-filter-button" data-active={scope === filter.id ? 'true' : 'false'} data-tone={filter.tone} onClick={() => setScope(filter.id)}>
                    <span className="tasks-stage178-filter-label">{filter.label}</span>
                    <span className="tasks-stage178-filter-count">{filter.count}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="tasks-stage178-rail-card" data-stage178-tasks-urgent-card="true">
              <div className="tasks-stage178-rail-head">
                <h3>Najpilniejsze zadania</h3>
                <p>5 zadań, które najłatwiej zgubić w pracy operacyjnej.</p>
              </div>
              {urgentTasks.length ? (
                <div className="tasks-stage178-urgent-list">
                  {urgentTasks.map((task) => (
                    <button key={String(task.id || getTaskTitle(task))} type="button" className="tasks-stage178-urgent-button" onClick={() => { setScope(isTaskDone(task) ? 'done' : 'active'); setSearchQuery(getTaskTitle(task)); }}>
                      <span className="tasks-stage178-urgent-title">{getTaskTitle(task)}</span>
                      <span className="tasks-stage178-urgent-meta">{formatTaskMoment(task)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="tasks-stage178-empty-rail-note">Brak aktywnych pilnych zadań.</p>
              )}
            </section>

            <section className="tasks-stage178-rail-card" data-stage178-tasks-focus-card="true">
              <div className="tasks-stage178-rail-head">
                <h3>Szybki fokus</h3>
                <p>Krótki radar właściciela.</p>
              </div>
              <div className="tasks-stage178-focus-list">
                <div className="tasks-stage178-focus-row">
                  <span className="tasks-stage178-focus-label">Zaległe</span>
                  <span className="tasks-stage178-focus-value">{stats.overdue}</span>
                </div>
                <div className="tasks-stage178-focus-row">
                  <span className="tasks-stage178-focus-label">Dziś</span>
                  <span className="tasks-stage178-focus-value">{stats.today}</span>
                </div>
                <div className="tasks-stage178-focus-row">
                  <span className="tasks-stage178-focus-label">Najbliższe</span>
                  <span className="tasks-stage178-focus-value">{nextTaskMoment}</span>
                </div>
              </div>
            </section>
          </aside>
        </div>

`;

  source = before + newBlock + after;
}

fs.writeFileSync(file, source, 'utf8');
console.log('DONE Stage178B repaired TasksStable right rail/list JSX.');
