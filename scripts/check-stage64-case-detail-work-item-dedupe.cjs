const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const caseDetailPath = path.join(repoRoot, 'src', 'pages', 'CaseDetail.tsx');
const packagePath = path.join(repoRoot, 'package.json');

function fail(message) {
  console.error(`FAIL STAGE64_CASE_DETAIL_WORK_ITEM_DEDUPE: ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

if (!fs.existsSync(caseDetailPath)) fail('missing src/pages/CaseDetail.tsx');
if (!fs.existsSync(packagePath)) fail('missing package.json');

const source = fs.readFileSync(caseDetailPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8').replace(/^\\uFEFF/, ''));

const requiredFragments = [
  'STAGE64_CASE_DETAIL_WORK_ITEM_DEDUPE',
  'function normalizeCaseRelationId(',
  'function getCaseRelationPriority(',
  'function dedupeCaseTasks(',
  'function dedupeCaseEvents(',
  'function dedupeCaseWorkItems(',
  'dedupeCaseTasks(',
  'dedupeCaseEvents(',
  'dedupeCaseWorkItems(buildWorkItems(',
];

for (const fragment of requiredFragments) {
  if (!source.includes(fragment)) fail(`CaseDetail.tsx does not contain: ${fragment}`);
  pass(`CaseDetail.tsx contains: ${fragment}`);
}

if (/setTasks\(\(\(Array\.isArray\(taskRowsRaw\)/.test(source)) {
  fail('raw setTasks filter still writes potentially duplicated case tasks');
}
pass('raw duplicated setTasks assignment removed');

if (/setEvents\(\(\(Array\.isArray\(eventRowsRaw\)/.test(source)) {
  fail('raw setEvents filter still writes potentially duplicated case events');
}
pass('raw duplicated setEvents assignment removed');

const scripts = pkg.scripts || {};
if (!scripts['check:stage64-case-detail-work-item-dedupe']) fail('missing package script check:stage64-case-detail-work-item-dedupe');
if (!scripts['test:stage64-case-detail-work-item-dedupe']) fail('missing package script test:stage64-case-detail-work-item-dedupe');
pass('package.json contains Stage64 scripts');

console.log('PASS STAGE64_CASE_DETAIL_WORK_ITEM_DEDUPE');
