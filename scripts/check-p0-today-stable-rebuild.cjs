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
const today = read('src/pages/TodayStable.tsx');
const pkg = JSON.parse(read('package.json') || '{}');

for (const marker of [
  "const Today = lazy(() => import('./pages/TodayStable'))",
  '<Route path="/" element={isLoggedIn ? <Today /> : <Navigate to="/login" />} />',
]) {
  if (!app.includes(marker)) failures.push('App.tsx missing: ' + marker);
}

for (const marker of [
  'P0_TODAY_STABLE_REBUILD',
  'fetchTasksFromSupabase().catch(() => [])',
  'fetchLeadsFromSupabase().catch(() => [])',
  'getAiLeadDraftsAsync().catch(() => [])',
  'operatorTasks.length',
  'operatorLeads.length',
  'Bez najbliższej zaplanowanej akcji',
  'dateKey <= todayKey',
]) {
  if (!today.includes(marker)) failures.push('TodayStable.tsx missing: ' + marker);
}

if (pkg.scripts?.['check:p0-today-stable-rebuild'] !== 'node scripts/check-p0-today-stable-rebuild.cjs') {
  failures.push('package.json missing check:p0-today-stable-rebuild');
}

if (failures.length) {
  console.error('P0 Today stable rebuild guard failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: P0 Today stable rebuild guard passed.');
