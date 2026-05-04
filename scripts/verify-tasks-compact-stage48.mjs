import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const tasks = fs.readFileSync(path.join(repo, 'src/pages/TasksStable.tsx'), 'utf8');
const today = fs.readFileSync(path.join(repo, 'src/pages/TodayStable.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/tasks-header-stage45b-cleanup.css'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));

function fail(message) {
  console.error('FAIL tasks compact stage48:', message);
  process.exit(1);
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
}

const taskUi = stripComments(tasks);
const todayUi = stripComments(today);

if (!tasks.includes('data-tasks-compact-stage48="true"')) fail('TasksStable lacks compact main marker');
if (!tasks.includes('data-tasks-compact-list-stage48="true"')) fail('TasksStable lacks compact list marker');
if (!tasks.includes('tasks-stage48-task-card')) fail('task card compact class missing');
if (!tasks.includes('data-task-title-date-row-stage48="true"')) fail('title/date row marker missing');
if (!tasks.includes('data-task-date-inline-stage48="true"')) fail('inline task date marker missing');
if (tasks.includes('<p className="mt-1 text-sm font-medium text-slate-500">{formatTaskMoment(task)}</p>')) fail('task date is still rendered below title');
if (!tasks.includes('data-task-action-visible-stage48="done-toggle"')) fail('done toggle action visibility marker missing');
if (!tasks.includes('data-task-action-visible-stage48="edit"')) fail('edit action visibility marker missing');
if (!tasks.includes('data-task-action-visible-stage48="delete"')) fail('delete action visibility marker missing');
if (!css.includes('TASKS_COMPACT_CARDS_STAGE48')) fail('Stage48 compact CSS marker missing');
if (!css.includes('max-width: 52rem')) fail('task list width clamp missing');
if (todayUi.includes('Stabilny widok operatora')) fail('Today helper copy is still visible');
if (taskUi.includes('Stabilny widok Supabase bez bramki Firebase')) fail('Tasks technical Supabase/Firebase copy is visible');
if (packageJson.scripts?.['verify:tasks-compact-stage48'] !== 'node scripts/verify-tasks-compact-stage48.mjs') fail('package script missing');
console.log('PASS tasks compact stage48: task cards are compact, due date is inline, actions are visible, and Today helper copy is removed.');
