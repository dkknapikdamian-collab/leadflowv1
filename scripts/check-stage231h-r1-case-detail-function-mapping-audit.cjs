const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
const reportPath = path.join(root, '_project/runs/STAGE231H_R1_CASE_DETAIL_FUNCTION_MAPPING_AUDIT_AND_REPAIR.md');
const obsidianPath = path.join(root, '_project/obsidian_updates/2026-06-14_STAGE231H_R1_CASE_DETAIL_FUNCTION_MAPPING_AUDIT_AND_REPAIR.md');
const caseDetailPath = path.join(root, 'src/pages/CaseDetail.tsx');

for (const filePath of [reportPath, obsidianPath, caseDetailPath]) {
  assert.ok(fs.existsSync(filePath), 'Missing required file: ' + path.relative(root, filePath));
}

const report = fs.readFileSync(reportPath, 'utf8');
const obsidian = fs.readFileSync(obsidianPath, 'utf8');
const caseDetail = fs.readFileSync(caseDetailPath, 'utf8');

const tokens = [
  'STAGE231H_R1_CASE_DETAIL_FUNCTION_MAPPING_AUDIT_AND_REPAIR',
  'REQUIRES_R1B_RUNTIME_REPAIR',
  'DICTATION_COPY_FALSE_PROMISE',
  'DUAL_CASE_ITEM_PATHS',
  'CONTRACT_VALUE_PERCENT_ONLY',
  'PAYMENT_HISTORY_LIMITED_VISIBLE_LIST',
  'NEXT_ACTION_MISSING_FALLBACK',
  'CASE_COSTS_LIFECYCLE_UNCONFIRMED',
  'SQL: NOT_TOUCHED'
];

for (const token of tokens) {
  assert.ok(report.includes(token), 'Run report missing token: ' + token);
}

for (const token of tokens.slice(1)) {
  assert.ok(obsidian.includes(token), 'Obsidian payload missing token: ' + token);
}

assert.ok(caseDetail.includes('CaseDetail'), 'CaseDetail source must be readable');

console.log('STAGE231H_R1 PASS: CaseDetail audit lock exists and requires R1B runtime repair.');
