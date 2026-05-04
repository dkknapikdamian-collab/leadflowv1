import fs from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const tasks = fs.readFileSync(path.join(repo, 'src/pages/Tasks.tsx'), 'utf8');
const indexCss = fs.readFileSync(path.join(repo, 'src/index.css'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/tasks-header-stage45b-cleanup.css'), 'utf8');

function fail(message) {
  console.error('FAIL tasks header cleanup: ' + message);
  process.exit(1);
}

const tasksWithoutComments = tasks.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

if (/Stabilny widok Supabase bez bramki Firebase|Dane (?:ładują|laduja) się od razu po wejściu w zakładkę|Dane laduja sie od razu po wejsciu w zakladke/i.test(tasksWithoutComments)) {
  fail('implementation helper copy is still visible in Tasks page source');
}

const localTaskCta = /<(?:Button|button)\b(?=[\s\S]{0,1800}setIsNewTaskOpen\(true\))(?=[\s\S]{0,1800}(?:Nowe|Dodaj)\s+zadanie)[\s\S]{0,3000}<\/(?:Button|button)>/m;
if (localTaskCta.test(tasksWithoutComments)) {
  fail('local Tasks add-task CTA is still present');
}

if (!tasks.includes('TASKS_HEADER_STAGE45B_CLEANUP')) {
  fail('Stage45B cleanup marker missing in Tasks.tsx');
}
if (!indexCss.includes('tasks-header-stage45b-cleanup.css')) {
  fail('Stage45B CSS import missing from src/index.css');
}
if (!css.includes('TASKS_HEADER_STAGE45B_CLEANUP_CSS') || !css.includes('[data-current-section="zadania"]')) {
  fail('Stage45B route-scoped title readability CSS missing');
}

console.log('PASS tasks header cleanup: local header add button removed, technical helper copy removed, title readability CSS locked.');
