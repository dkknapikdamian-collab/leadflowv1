const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}
function mustNotInclude(rel, marker) {
  if (read(rel).includes(marker)) throw new Error(`${rel} must not contain marker: ${marker}`);
}

mustInclude('src/App.tsx', "import './styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css';");

const app = read('src/App.tsx');
if (app.includes("closeflow-leads-clients-list-layout-source-truth-stage177.css")) {
  if (app.indexOf("closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css") < app.indexOf("closeflow-leads-clients-list-layout-source-truth-stage177.css")) {
    throw new Error('Stage178 CSS import must be after Stage177 CSS import.');
  }
}

const tasks = 'src/pages/TasksStable.tsx';
[
  "type TaskScope = 'active' | 'today' | 'overdue' | 'done' | 'high' | 'unlinked';",
  "type TaskGroupId = 'overdue' | 'today' | 'upcoming' | 'no_due' | 'done';",
  'function isTaskHighPriority',
  'function isTaskUnlinked',
  'function buildTaskGroups',
  'function getUrgentTasks',
  'const groupedTasks = useMemo(() => buildTaskGroups(filteredTasks), [filteredTasks]);',
  'const urgentTasks = useMemo(() => getUrgentTasks(tasks), [tasks]);',
  'const taskScopeFilters = useMemo(() =>',
  'data-stage178-tasks-operational-panel="true"',
  'className="tasks-stage178-workspace"',
  'className="tasks-stage178-main-stack"',
  'data-tasks-search-panel-stage178="true"',
  'data-cf-main-search-stage178="true"',
  'data-stage178-tasks-grouped-list="true"',
  'className="tasks-stage178-right-rail cf-operator-right-rail"',
  'data-stage178-tasks-filter-card="true"',
  'Filtry zadań',
  'Najpilniejsze zadania',
  'setScope(filter.id)',
].forEach((marker) => mustInclude(tasks, marker));

mustNotInclude(tasks, 'className="relative w-full sm:max-w-md"');
mustNotInclude(tasks, 'className="pl-9"');

const css = 'src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css';
[
  'CLOSEFLOW_STAGE178_TASKS_RIGHT_RAIL_GROUPED_LIST_SOURCE_TRUTH',
  '--closeflow-stage178-tasks-right-rail-grouped-list-source-truth: "active"',
  '--cf178-tasks-rail-width: 320px',
  '.tasks-stage178-workspace',
  'grid-template-columns: minmax(0, 1fr) minmax(var(--cf178-tasks-rail-width), var(--cf178-tasks-rail-width)) !important',
  '.tasks-stage178-right-rail',
  '.tasks-stage178-grouped-list',
  '.tasks-stage178-filter-button',
  '.tasks-stage178-urgent-button',
  '.tasks-stage178-focus-row',
].forEach((marker) => mustInclude(css, marker));

[
  'scripts/apply-stage178-tasks-right-rail-grouped-list-source-truth.cjs',
  'scripts/check-stage178-tasks-right-rail-grouped-list-source-truth.cjs',
  'docs/ui/CLOSEFLOW_STAGE178_TASKS_RIGHT_RAIL_GROUPED_LIST_SOURCE_TRUTH.md',
  'docs/ui/CLOSEFLOW_STAGE178_RUNTIME_TASKS_LAYOUT_AUDIT.js',
  '_project/STAGE178_TASKS_RIGHT_RAIL_GROUPED_LIST_SOURCE_TRUTH_REPORT.md',
  'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-24 - CloseFlow Stage178 tasks right rail grouped list source truth.md',
].forEach((rel) => {
  if (!fs.existsSync(path.join(root, rel))) throw new Error(`Missing Stage178 file: ${rel}`);
});

console.log('OK: Stage178 tasks right rail and grouped list source truth guard passed.');
