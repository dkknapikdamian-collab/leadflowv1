#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];

function read(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    failures.push(`${rel} is missing`);
    return '';
  }
  return fs.readFileSync(abs, 'utf8');
}

const calendar = read('src/lib/calendar-items.ts');
const today = read('src/pages/Today.tsx');

if (calendar.includes('hasStoredWorkspaceContext')) {
  failures.push('src/lib/calendar-items.ts must not gate Today loader on hasStoredWorkspaceContext/localStorage');
}

if (calendar.includes('!hasStoredWorkspaceContext()')) {
  failures.push('src/lib/calendar-items.ts still returns empty bundle when workspace localStorage is missing');
}

if (!calendar.includes('export async function fetchCalendarBundleFromSupabase')) {
  failures.push('src/lib/calendar-items.ts missing fetchCalendarBundleFromSupabase');
}

for (const marker of [
  'fetchTasksFromSupabase()',
  'fetchEventsFromSupabase()',
  'fetchCasesFromSupabase().catch(() => [])',
  'fetchLeadsFromSupabase().catch(() => [])',
]) {
  if (!calendar.includes(marker)) {
    failures.push(`src/lib/calendar-items.ts missing API loader marker: ${marker}`);
  }
}

if (!today.includes('fetchCalendarBundleFromSupabase')) {
  failures.push('src/pages/Today.tsx must load calendar bundle through Supabase API helper');
}

if (today.includes("../firebase") || today.includes("'../firebase'") || today.includes('"../firebase"')) {
  failures.push('src/pages/Today.tsx must not import Firebase runtime');
}

if (today.includes('auth.currentUser') || today.includes('auth.signOut')) {
  failures.push('src/pages/Today.tsx must not use Firebase auth runtime');
}

if (failures.length) {
  console.error('P0 Today loader Supabase API guard failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: P0 Today loader uses Supabase API without local workspace gate.');
