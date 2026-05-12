#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
function p(...parts){ return path.join(ROOT, ...parts); }
function stripBom(s){ return s && s.charCodeAt(0) === 0xfeff ? s.slice(1) : s; }
function read(rel){ return stripBom(fs.readFileSync(p(rel), 'utf8')); }
function exists(rel){ return fs.existsSync(p(rel)); }
function assert(condition, message){ if(!condition) throw new Error(message); }

const pkg = JSON.parse(read('package.json'));
assert(pkg.scripts && pkg.scripts['check:closeflow:action-colors:v1'], 'package.json missing check:closeflow:action-colors:v1');
assert(pkg.scripts && pkg.scripts['check:closeflow:action-colors:v1:repair6'], 'package.json missing check:closeflow:action-colors:v1:repair6');

assert(exists('src/lib/action-visual-taxonomy.ts'), 'action visual taxonomy lib missing');
const lib = read('src/lib/action-visual-taxonomy.ts');
for (const token of [
  'CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1',
  'CloseFlowActionVisualKind',
  'normalizeCloseFlowActionVisualKind',
  'inferCloseFlowActionVisualKind',
  'getCloseFlowActionKindClass',
  'getCloseFlowActionVisualClass',
  'getCloseFlowActionVisualDataKind',
  "'task'",
  "'event'",
  "'note'",
  "'followup'",
  "'deadline'",
  "'meeting'",
  "'call'",
  "'email'",
  "'payment'",
]) assert(lib.includes(token), 'taxonomy lib missing token: ' + token);

assert(exists('src/styles/action-color-taxonomy-v1.css'), 'action color taxonomy CSS missing');
const css = read('src/styles/action-color-taxonomy-v1.css');
for (const token of [
  'CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1',
  '.cf-action-kind-task',
  '.cf-action-kind-event',
  '.cf-action-kind-note',
  '.cf-action-kind-followup',
  '.cf-action-kind-deadline',
  '.cf-action-kind-meeting',
  '.cf-action-kind-call',
  '.cf-action-kind-email',
  '.cf-action-kind-payment',
  '[data-action-kind="task"]',
]) assert(css.includes(token), 'taxonomy CSS missing token: ' + token);

assert(exists('src/main.tsx'), 'src/main.tsx missing');
assert(read('src/main.tsx').includes('action-color-taxonomy-v1.css'), 'src/main.tsx missing action color taxonomy CSS import');

const importantFiles = [
  'src/pages/Calendar.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/TodayStable.tsx',
  'src/pages/Activity.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/CaseDetail.tsx',
  'src/lib/scheduling.ts',
  'src/lib/work-items/normalize.ts',
];
const fileStates = importantFiles.map((file) => ({ file, exists: exists(file) }));
assert(fileStates.find((x) => x.file === 'src/pages/Calendar.tsx').exists, 'Calendar.tsx missing');
assert(fileStates.find((x) => x.file === 'src/pages/TasksStable.tsx').exists, 'TasksStable.tsx missing');

const calendar = read('src/pages/Calendar.tsx');
assert(calendar.includes('action-visual-taxonomy'), 'Calendar visual taxonomy import missing');
assert(calendar.includes('calendarActionVisualKind') || calendar.includes('getCalendarActionVisualKind') || calendar.includes('getCloseFlowActionVisualClass') || calendar.includes('data-action-kind'), 'Calendar type class not patched');

const tasks = read('src/pages/TasksStable.tsx');
assert(tasks.includes('action-visual-taxonomy'), 'Tasks visual taxonomy import missing');
assert(tasks.includes('tasksActionVisualKind') || tasks.includes('getTaskActionVisualKind') || tasks.includes('getCloseFlowActionVisualClass') || tasks.includes('data-action-kind'), 'Tasks visual kind helper missing');

if (exists('src/lib/scheduling.ts')) {
  assert(read('src/lib/scheduling.ts').includes('CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_SCHEDULING'), 'scheduling action color marker missing');
}
if (exists('src/lib/work-items/normalize.ts')) {
  assert(read('src/lib/work-items/normalize.ts').includes('CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_NORMALIZE'), 'normalize action color marker missing');
}

console.log('CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_CHECK_OK');
console.log(JSON.stringify({
  taxonomyLib: 'src/lib/action-visual-taxonomy.ts',
  css: 'src/styles/action-color-taxonomy-v1.css',
  main: 'src/main.tsx',
  importantFiles: fileStates,
  mappedKinds: ['task','event','note','followup','deadline','meeting','call','email','payment','system','default'],
  mode: 'action_color_taxonomy_v1',
}, null, 2));
