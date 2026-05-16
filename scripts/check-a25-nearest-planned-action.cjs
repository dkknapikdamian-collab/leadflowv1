#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const requiredFiles = [
  'src/lib/planned-actions.ts',
  'src/lib/lead-next-action.ts',
  'docs/STAGE_A25_NEAREST_PLANNED_ACTION.md',
  'docs/NEAREST_PLANNED_ACTION_CONTRACT.md',
  'src/styles/stageA25-today-relations-lead-badge-inline.css',
];

for (const file of requiredFiles) {
  expect(exists(file), file + ' is missing');
}

if (exists('src/lib/planned-actions.ts')) {
  const helper = read('src/lib/planned-actions.ts');
  expect(helper.includes('getNearestPlannedAction'), 'planned-actions helper must export getNearestPlannedAction');
  expect(helper.includes("recordType: 'lead'") || helper.includes("PlannedActionRecordType = 'lead'"), 'helper must support lead');
  expect(helper.includes("'case'"), 'helper must support case');
  expect(helper.includes("'client'"), 'helper must support client');
  expect(helper.includes('normalizeCalendarTask'), 'helper must use tasks');
  expect(helper.includes('normalizeCalendarEvent'), 'helper must use events');
  expect(helper.includes('Brak zaplanowanych dzia\u0142a\u0144'), 'helper must expose empty planned action label');
  expect(helper.includes('Bez zaplanowanej akcji'), 'helper must expose Today planned action label');
}

if (exists('src/lib/lead-next-action.ts')) {
  const compat = read('src/lib/lead-next-action.ts');
  expect(compat.includes('getNearestPlannedAction'), 'lead-next-action must delegate to getNearestPlannedAction');
  expect(!compat.includes('nextActionTitle'), 'lead-next-action must not use nextActionTitle as core');
  expect(!compat.includes('nextActionAt'), 'lead-next-action must not use nextActionAt as core');
}

if (exists('src/lib/lead-health.ts')) {
  const health = read('src/lib/lead-health.ts');
  expect(health.includes('Brak zaplanowanej akcji'), 'lead-health should use planned action empty wording');
}

const uiFiles = ['src/pages/Today.tsx', 'src/pages/Leads.tsx', 'src/pages/LeadDetail.tsx', 'src/pages/CaseDetail.tsx'];
for (const file of uiFiles) {
  if (!exists(file)) continue;
  const content = read(file);
  expect(!content.includes('Nast\u0119pny krok'), file + ' still contains old label "Nast\u0119pny krok"');
}

const today = exists('src/pages/Today.tsx') ? read('src/pages/Today.tsx') : '';
expect(today.includes('Bez zaplanowanej akcji'), 'Today must show Bez zaplanowanej akcji');

const indexCss = exists('src/index.css') ? read('src/index.css') : '';
expect(indexCss.includes('stageA25-today-relations-lead-badge-inline.css'), 'index.css must import A25 relations badge CSS');

const pkg = JSON.parse(read('package.json'));
expect(pkg.scripts && pkg.scripts['check:a25-nearest-planned-action'], 'package.json missing check:a25-nearest-planned-action');

if (fail.length) {
  console.error('A25 nearest planned action guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: A25 nearest planned action guard passed.');
