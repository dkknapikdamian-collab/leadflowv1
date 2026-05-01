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

function hasAny(text, markers) {
  return markers.some((marker) => text.includes(marker));
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

const requiredCollections = [
  {
    name: 'tasks',
    markers: [
      'fetchTasksFromSupabase().catch(() => [])',
      'readCollection(() => fetchTasksFromSupabase())',
      'readCalendarCollection(() => fetchTasksFromSupabase())',
    ],
  },
  {
    name: 'events',
    markers: [
      'fetchEventsFromSupabase().catch(() => [])',
      'readCollection(() => fetchEventsFromSupabase())',
      'readCalendarCollection(() => fetchEventsFromSupabase())',
    ],
  },
  {
    name: 'cases',
    markers: [
      'fetchCasesFromSupabase().catch(() => [])',
      'readCollection(() => fetchCasesFromSupabase())',
      'readCalendarCollection(() => fetchCasesFromSupabase())',
    ],
  },
  {
    name: 'leads',
    markers: [
      'fetchLeadsFromSupabase().catch(() => [])',
      'readCollection(() => fetchLeadsFromSupabase())',
      'readCalendarCollection(() => fetchLeadsFromSupabase())',
    ],
  },
];

for (const collection of requiredCollections) {
  if (!hasAny(calendar, collection.markers)) {
    failures.push('src/lib/calendar-items.ts missing resilient loader for ' + collection.name);
  }
}

if (!hasAny(calendar, ['P0_TODAY_403_RESILIENT_BUNDLE', 'readCollection', 'readCalendarCollection'])) {
  failures.push('src/lib/calendar-items.ts missing Today bundle resilience marker/helper');
}

if (!hasAny(calendar, ['P0_TODAY_BOOTSTRAP_RETRY', 'ensureWorkspaceContext', 'ensureCalendarWorkspaceBootstrap'])) {
  failures.push('src/lib/calendar-items.ts missing Today bootstrap retry marker/helper');
}

if (!today.includes('fetchCalendarBundleFromSupabase')) {
  failures.push('src/pages/Today.tsx must load calendar bundle through Supabase API helper');
}

if (today.includes('../firebase') || today.includes("'../firebase'") || today.includes('"../firebase"')) {
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

console.log('OK: P0 Today loader uses Supabase API and resilient per-collection reads.');
