#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const schedulingPath = path.join(root, 'src/lib/scheduling.ts');
const scheduling = fs.readFileSync(schedulingPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const failures = [];

for (const marker of [
  'P0_TODAY_OPERATOR_SECTIONS_FIX',
  'expandOperatorTodayTaskEntries',
  'expandOperatorTodayLeadEntries',
  'isActiveOpenLeadForOperatorToday',
  'Ustal nast\u0119pny krok',
  "...expandOperatorTodayTaskEntries(tasks, rangeStart, rangeEnd)",
  "...expandOperatorTodayLeadEntries(leads, rangeStart, rangeEnd)",
]) {
  if (!scheduling.includes(marker)) failures.push('scheduling.ts missing: ' + marker);
}

if (!/import\s*\{[\s\S]*\bisToday\b[\s\S]*\}\s*from 'date-fns'/.test(scheduling)) {
  failures.push('scheduling.ts date-fns import missing isToday');
}

if (pkg.scripts?.['check:p0-today-operator-sections'] !== 'node scripts/check-p0-today-operator-sections.cjs') {
  failures.push('package.json missing check:p0-today-operator-sections');
}

if (failures.length) {
  console.error('P0 Today operator sections guard failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: P0 Today operator sections guard passed.');
