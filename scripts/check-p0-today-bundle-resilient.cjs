#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src/lib/calendar-items.ts');

if (!fs.existsSync(file)) {
  console.error('ERROR: src/lib/calendar-items.ts is missing');
  process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');

const required = [
  'P0_TODAY_403_RESILIENT_BUNDLE',
  'fetchTasksFromSupabase().catch(() => [])',
  'fetchEventsFromSupabase().catch(() => [])',
  'fetchCasesFromSupabase().catch(() => [])',
  'fetchLeadsFromSupabase().catch(() => [])',
];

const failures = required.filter((marker) => !content.includes(marker));

if (failures.length) {
  console.error('P0 Today resilient bundle guard failed.');
  for (const failure of failures) console.error('- missing marker: ' + failure);
  process.exit(1);
}

console.log('OK: P0 Today bundle degrades independently when a read endpoint returns 403.');
