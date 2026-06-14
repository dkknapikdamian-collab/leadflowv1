const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const report = fs.readFileSync(path.join(root, '_project/runs/STAGE231H_R1_CASE_DETAIL_FUNCTION_MAPPING_AUDIT_AND_REPAIR.md'), 'utf8');
const obsidian = fs.readFileSync(path.join(root, '_project/obsidian_updates/2026-06-14_STAGE231H_R1_CASE_DETAIL_FUNCTION_MAPPING_AUDIT_AND_REPAIR.md'), 'utf8');

test('STAGE231H_R1 audit documents confirmed CaseDetail risks', () => {
  for (const token of [
    'DICTATION_COPY_FALSE_PROMISE',
    'DUAL_CASE_ITEM_PATHS',
    'CONTRACT_VALUE_PERCENT_ONLY',
    'PAYMENT_HISTORY_LIMITED_VISIBLE_LIST',
    'NEXT_ACTION_MISSING_FALLBACK',
    'CASE_COSTS_LIFECYCLE_UNCONFIRMED',
  ]) {
    assert.ok(report.includes(token), 'run report missing ' + token);
    assert.ok(obsidian.includes(token), 'obsidian payload missing ' + token);
  }
});

test('STAGE231H_R1 audit stays open until R1B runtime repair', () => {
  assert.ok(report.includes('REQUIRES_R1B_RUNTIME_REPAIR'));
  assert.ok(obsidian.includes('REQUIRES_R1B_RUNTIME_REPAIR'));
  assert.ok(report.includes('SQL: NOT_TOUCHED'));
});
