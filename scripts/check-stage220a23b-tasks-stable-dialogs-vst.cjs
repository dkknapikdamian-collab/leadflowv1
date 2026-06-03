const fs = require('fs');

function fail(message) {
  console.error('STAGE220A23B_TASKS_STABLE_DIALOGS_VST_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const tasks = read('src/pages/TasksStable.tsx');
const css = read('src/styles/closeflow-visual-source-truth.css');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

function forbidText(text, needle, label) {
  if (text.includes(needle)) fail(label + ' forbidden: ' + needle);
}

requireText(tasks, 'STAGE220A23B_TASKS_STABLE_DIALOGS_VST', 'TasksStable marker');
requireText(tasks, "import { ConfirmDialog } from '../components/confirm-dialog';", 'ConfirmDialog import');
requireText(tasks, 'STAGE220A23B_TASK_DELETE_CONFIRM', 'delete confirm marker');
requireText(tasks, 'taskToDelete', 'delete state');
requireText(tasks, 'confirmDeleteTask', 'delete handler');
requireText(tasks, 'requestDeleteTask(task)', 'delete button opens dialog');
requireText(tasks, 'data-stage220a23b-task-form-dialog="true"', 'task form dialog marker');
requireText(tasks, 'data-stage220a23b-task-next-step-dialog="true"', 'next step dialog marker');
requireText(tasks, 'tasksStableModalSelectClassStage220A23B', 'VST select class');
requireText(tasks, 'tasks-stable-dialog-stage220a23b-primary', 'primary button class');

forbidText(tasks, "window.confirm('Usunąć zadanie?')", 'native task delete confirm');
forbidText(tasks, 'className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"', 'old select class');

requireText(css, 'STAGE220A23B_TASKS_STABLE_DIALOGS_VST', 'CSS marker');
requireText(css, '.tasks-stable-dialog-stage220a23b', 'task form CSS');
requireText(css, '.task-next-step-dialog-stage220a23b', 'next step CSS');
requireText(css, 'var(--cf-vst-surface-card-solid)', 'surface token');
requireText(css, 'var(--cf-vst-color-primary)', 'primary token');

requireText(doc, 'STAGE220A23B - aktywny ekran zadań TasksStable', 'doc A23B section');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a23b-tasks-stable-dialogs-vst.cjs', 'prebuild A23B guard');

console.log('STAGE220A23B_TASKS_STABLE_DIALOGS_VST_GUARD: OK');
