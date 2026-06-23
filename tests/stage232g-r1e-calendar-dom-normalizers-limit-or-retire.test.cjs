const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const stage = 'STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE';
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('STAGE232G R1E policy module defines explicit normalizer ids and switch', () => {
  const source = read('src/lib/calendar-dom-normalizer-policy.ts');
  assert.match(source, /CALENDAR_DOM_NORMALIZER_IDS/);
  assert.match(source, /color-tooltip-v2/);
  assert.match(source, /month-entry-structural-v3/);
  assert.match(source, /month-plain-text-rows-v4/);
  assert.match(source, /shouldRunCalendarDomNormalizer/);
  assert.match(source, /closeflow:calendar:dom-normalizers/);
});

test('STAGE232G R1E Calendar gates known DOM normalizers', () => {
  const source = read('src/pages/Calendar.tsx');
  assert.match(source, /calendar-dom-normalizer-policy/);
  assert.match(source, /STAGE232G_R1E_CALENDAR_DOM_NORMALIZER_POLICY_GUARD/);
  assert.match(source, /CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT[\s\S]*shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.colorTooltipV2\)|shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.colorTooltipV2\)[\s\S]*CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT/);
  assert.match(source, /CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT[\s\S]*shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.monthEntryStructuralV3\)|shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.monthEntryStructuralV3\)[\s\S]*CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT/);
  assert.match(source, /CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_EFFECT[\s\S]*shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.monthPlainTextRowsV4\)|shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.monthPlainTextRowsV4\)[\s\S]*CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_EFFECT/);
});

test('STAGE232G R1E preserves R1D action contract guard', () => {
  const source = read('src/pages/Calendar.tsx');
  assert.match(source, /STAGE232G_R1D_COMPLETE_ACTION_CONTRACT_GUARD/);
  assert.match(source, /STAGE232G_R1D_DELETE_ACTION_CONTRACT_GUARD/);
  assert.match(source, /STAGE232G_R1D_RESTORE_ACTION_CONTRACT_GUARD/);
});

test('STAGE232G R1E guard and docs are present', () => {
  assert.match(read('scripts/check-stage232g-r1e-calendar-dom-normalizers-limit-or-retire.cjs'), new RegExp(stage));
  assert.match(read('_project/runs/STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE.md'), new RegExp(stage));
  assert.match(read('_project/obsidian_updates/2026-06-23_STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE.md'), new RegExp(stage));
});
