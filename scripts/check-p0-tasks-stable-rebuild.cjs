#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];
function read(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    failures.push(rel + ' is missing');
    return '';
  }
  return fs.readFileSync(abs, 'utf8');
}

const app = read('src/App.tsx');
const tasks = read('src/pages/TasksStable.tsx');
const pkg = JSON.parse(read('package.json') || '{}');

for (const marker of [
  "const Tasks = lazy(() => import('./pages/TasksStable'))",
  '<Route path="/tasks" element={isLoggedIn ? <Tasks /> : <Navigate to="/login" />} />',
]) {
  if (!app.includes(marker)) failures.push('App.tsx missing: ' + marker);
}

for (const marker of [
  'P0_TASKS_STABLE_REBUILD',
  'fetchTasksFromSupabase().catch(() => [])',
  'insertTaskToSupabase(payload)',
  'updateTaskInSupabase({',
  'deleteTaskFromSupabase(String(task.id))',
  'data-p0-tasks-stable-rebuild="true"',
]) {
  if (!tasks.includes(marker)) failures.push('TasksStable.tsx missing: ' + marker);
}

if (tasks.includes('auth.currentUser')) failures.push('TasksStable.tsx must not use Firebase auth.currentUser gate');
if (pkg.scripts?.['check:p0-tasks-stable-rebuild'] !== 'node scripts/check-p0-tasks-stable-rebuild.cjs') {
  failures.push('package.json missing check:p0-tasks-stable-rebuild');
}

if (failures.length) {
  console.error('P0 Tasks stable rebuild guard failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: P0 Tasks stable rebuild guard passed.');
