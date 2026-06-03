const fs = require('fs');

function fail(message) {
  console.error('STAGE220A23_TASK_DIALOGS_VST_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

const tasks = read('src/pages/Tasks.tsx');
const css = read('src/styles/closeflow-visual-source-truth.css');
const doc = read('docs/visual/CLOSEFLOW_VISUAL_SOURCE_OF_TRUTH.md');
const pkg = JSON.parse(read('package.json'));

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

function forbidText(text, needle, label) {
  if (text.includes(needle)) fail(label + ' forbidden: ' + needle);
}

requireText(tasks, 'STAGE220A23_TASK_DIALOGS_VST', 'Tasks marker');
requireText(tasks, "import { ConfirmDialog } from '../components/confirm-dialog';", 'ConfirmDialog import');
requireText(tasks, 'taskToDelete', 'task delete state');
requireText(tasks, 'confirmDeleteTask', 'production delete handler');
requireText(tasks, 'softNextStepDialog', 'soft next step state');
requireText(tasks, 'confirmSoftNextStepDialog', 'production next step handler');
requireText(tasks, 'skipSoftNextStepDialog', 'skip next step handler');
requireText(tasks, 'data-stage220a23-task-next-step-dialog="true"', 'next step dialog marker');
requireText(tasks, 'data-stage220a23-next-step-title="true"', 'next step title marker');
requireText(tasks, 'data-stage220a23-next-step-priority="true"', 'next step priority marker');
requireText(tasks, 'requestDeleteTask(task)', 'delete button opens production dialog');
requireText(tasks, 'cf-vst-input w-full h-10', 'select class uses VST input');

forbidText(tasks, "window.confirm('Usunąć zadanie?')", 'native delete confirm');
forbidText(tasks, 'window.prompt(promptText', 'native next step prompt');
forbidText(tasks, 'const promptText = [', 'prompt text block');

requireText(css, 'STAGE220A23_TASK_DIALOGS_VST', 'A23 CSS marker');
requireText(css, '.task-next-step-dialog-stage220a23', 'next step dialog CSS');
requireText(css, 'var(--cf-vst-surface-card-solid)', 'VST surface token');
requireText(css, 'var(--cf-vst-shadow-modal)', 'VST modal shadow token');

requireText(doc, 'STAGE220A23 - produkcyjne komunikaty zadań', 'doc A23 section');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a23-task-dialogs-vst.cjs', 'prebuild A23 guard');

console.log('STAGE220A23_TASK_DIALOGS_VST_GUARD: OK');
