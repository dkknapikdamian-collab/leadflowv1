#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
let failures = 0;

function fail(message) {
  failures += 1;
  console.error('FAIL STAGE227C1_MISSING_ITEM_QUICK_ACTION_CONTRACT: ' + message);
}
function pass(message) {
  console.log('PASS ' + message);
}
function read(file) {
  return fs.readFileSync(path.join(repo, file), 'utf8').replace(/^\uFEFF/, '');
}
function mustExist(file, label = file) {
  if (!fs.existsSync(path.join(repo, file))) {
    fail('missing ' + label);
    return '';
  }
  pass(label + ' exists');
  return read(file);
}
function mustContain(source, needle, label) {
  if (!source.includes(needle)) fail('missing: ' + label);
  else pass(label);
}
function mustNotContain(source, needle, label) {
  if (source.includes(needle)) fail('forbidden: ' + label);
  else pass('not contains: ' + label);
}

const pkg = JSON.parse(read('package.json'));
const doc = mustExist('docs/stages/STAGE227C1_MISSING_ITEM_QUICK_ACTION_CONTRACT.md', 'stage doc');
const contract = mustExist('src/lib/missing-items/stage227c1-missing-item-contract.ts', 'missing item contract module');
const obsidian = mustExist('_project/obsidian_updates/2026-06-07 - Stage227C1 Missing Item Quick Action Contract.md', 'obsidian update');
const report = mustExist('_project/reports/2026-06-07 - Stage227C1 Missing Item Quick Action Contract run report.md', 'run report');

mustContain(doc, 'STAGE227C1_MISSING_ITEM_QUICK_ACTION_CONTRACT', 'doc marker');
mustContain(doc, 'Bez nowej tabeli', 'no new table decision');
mustContain(doc, 'Bez migracji SQL', 'no SQL migration decision');
mustContain(doc, 'Lead / Client', 'lead/client routing');
mustContain(doc, 'case_items', 'case_items route for case');
mustContain(doc, 'task/activity', 'task/activity route for lead/client');

mustContain(contract, 'STAGE227C1_MISSING_ITEM_QUICK_ACTION_CONTRACT', 'module marker');
mustContain(contract, "entityType === 'case'", 'case route function');
mustContain(contract, "'case_items_missing'", 'case persistence target');
mustContain(contract, "'task_or_activity_missing_item'", 'lead/client persistence target');
mustContain(contract, 'Missing item title is required', 'required title validation');

mustNotContain(contract, 'create table', 'no create table in contract module');
mustNotContain(contract.toLowerCase(), 'supabase.from(', 'no direct Supabase writes in C1');
mustNotContain(contract.toLowerCase(), 'insert(', 'no direct insert in C1');

if (!pkg.scripts || pkg.scripts['check:stage227c1-missing-item-quick-action-contract'] !== 'node scripts/check-stage227c1-missing-item-quick-action-contract.cjs') {
  fail('package check script missing');
} else {
  pass('package check script');
}

if (!pkg.scripts || pkg.scripts['test:stage227c1-missing-item-quick-action-contract'] !== 'node --test tests/stage227c1-missing-item-quick-action-contract.test.cjs') {
  fail('package test script missing');
} else {
  pass('package test script');
}

mustContain(obsidian, 'Stage227C1', 'obsidian update mentions stage');
mustContain(report, 'PASS', 'run report records expected PASS');

if (failures > 0) {
  console.error('\nStage227C1 guard failures: ' + failures);
  process.exit(1);
}

console.log('PASS STAGE227C1_MISSING_ITEM_QUICK_ACTION_CONTRACT');
