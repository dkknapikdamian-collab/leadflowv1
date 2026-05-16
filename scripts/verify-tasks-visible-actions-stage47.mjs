import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(repo, relativePath), 'utf8');
}

function walk(dir, predicate, out = []) {
  const fullDir = path.join(repo, dir);
  if (!fs.existsSync(fullDir)) return out;
  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(rel, predicate, out);
    else if (!predicate || predicate(rel)) out.push(rel);
  }
  return out;
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
}

function fail(message) {
  console.error('FAIL tasks visible actions stage47:', message);
  process.exit(1);
}

const tasks = read('src/pages/TasksStable.tsx');
const css = read('src/styles/tasks-header-stage45b-cleanup.css');
const executableTasks = stripComments(tasks);

const forbidden = [
  'Stabilny widok Supabase bez bramki Firebase',
  'Dane \u0142aduj\u0105 si\u0119 od razu po wej\u015Bciu w zak\u0142adk\u0119',
];

for (const rel of walk('src', (item) => /\.(tsx|ts|css)$/.test(item))) {
  const content = stripComments(read(rel));
  for (const phrase of forbidden) {
    if (content.includes(phrase)) fail(`${rel} still contains visible technical copy: ${phrase}`);
  }
}

if (!tasks.includes('TASKS_VISIBLE_ACTIONS_STAGE47')) fail('missing Stage47 marker');
if (!tasks.includes('data-tasks-action-visible-stage47="done"')) fail('missing visible done/restore action marker');
if (!tasks.includes('data-tasks-action-visible-stage47="edit"')) fail('missing visible edit action marker');
if (!tasks.includes('tasks-stage47-action-button')) fail('missing shared visible action class');
if (!tasks.includes("isTaskDone(task) ? 'Przywr\u00F3\u0107' : 'Zrobione'")) fail('done/restore label contract changed');
if (!executableTasks.includes('Edytuj')) fail('edit label missing');
if (!css.includes('TASKS_VISIBLE_ACTIONS_STAGE47')) fail('missing Stage47 CSS marker');
if (!css.includes('color: #0f172a !important')) fail('CSS does not force readable text color');
if (!css.includes('background: #ffffff !important')) fail('CSS does not force readable background');

console.log('PASS tasks visible actions stage47: technical copy removed and TasksStable action buttons are readable.');
