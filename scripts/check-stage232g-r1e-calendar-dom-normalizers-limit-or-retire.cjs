#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const stage = 'STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE';
const failures = [];
function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    failures.push(`missing file: ${rel}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}
function requireIncludes(rel, text, needle, label = needle) {
  if (!text.includes(needle)) failures.push(`${rel} missing ${label}`);
}
function requireRegex(rel, text, re, label = String(re)) {
  if (!re.test(text)) failures.push(`${rel} missing ${label}`);
}

const calendar = read('src/pages/Calendar.tsx');
const policy = read('src/lib/calendar-dom-normalizer-policy.ts');
const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');
const guard = read('scripts/check-stage232g-r1e-calendar-dom-normalizers-limit-or-retire.cjs');
const test = read('tests/stage232g-r1e-calendar-dom-normalizers-limit-or-retire.test.cjs');
const run = read('_project/runs/STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE.md');
const obsidian = read('_project/obsidian_updates/2026-06-23_STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE.md');

requireIncludes('src/pages/Calendar.tsx', calendar, 'calendar-dom-normalizer-policy', 'dom normalizer policy import');
requireIncludes('src/pages/Calendar.tsx', calendar, 'STAGE232G_R1E_CALENDAR_DOM_NORMALIZER_POLICY_GUARD', 'R1E policy marker');
requireIncludes('src/pages/Calendar.tsx', calendar, 'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT', 'color tooltip effect marker');
requireIncludes('src/pages/Calendar.tsx', calendar, 'CLOSEFLOW_CALENDAR_MONTH_ENTRY_STRUCTURAL_FIX_V3_REPAIR2_EFFECT', 'month structural effect marker');
requireIncludes('src/pages/Calendar.tsx', calendar, 'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_EFFECT', 'month plain text rows effect marker');
requireRegex('src/pages/Calendar.tsx', calendar, /shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.colorTooltipV2\)/, 'color tooltip policy gate');
requireRegex('src/pages/Calendar.tsx', calendar, /shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.monthEntryStructuralV3\)/, 'month structural policy gate');
requireRegex('src/pages/Calendar.tsx', calendar, /shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.monthPlainTextRowsV4\)/, 'month plain-text policy gate');
requireIncludes('src/pages/Calendar.tsx', calendar, 'STAGE232G_R1D_RESTORE_ACTION_CONTRACT_GUARD', 'R1D restore guard preserved');

requireIncludes('src/lib/calendar-dom-normalizer-policy.ts', policy, 'CALENDAR_DOM_NORMALIZER_IDS', 'ids export');
requireIncludes('src/lib/calendar-dom-normalizer-policy.ts', policy, 'shouldRunCalendarDomNormalizer', 'policy function');
requireIncludes('src/lib/calendar-dom-normalizer-policy.ts', policy, 'closeflow:calendar:dom-normalizers', 'global override key');
requireIncludes('src/lib/calendar-dom-normalizer-policy.ts', policy, 'state: \'allowed\'', 'allowed policy state');

requireIncludes('scripts/check-cf-runtime-00-source-truth.cjs', cfRuntime, 'STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE_ALLOWLIST', 'CF runtime allowlist marker');
requireIncludes('scripts/check-stage232g-r1e-calendar-dom-normalizers-limit-or-retire.cjs', guard, stage, 'R1E guard stage marker');
requireIncludes('tests/stage232g-r1e-calendar-dom-normalizers-limit-or-retire.test.cjs', test, stage, 'R1E test stage marker');
requireIncludes('_project/runs/STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE.md', run, stage, 'R1E run report marker');
requireIncludes('_project/obsidian_updates/2026-06-23_STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE.md', obsidian, stage, 'R1E obsidian payload marker');

if (failures.length) {
  console.error(`${stage}_FAIL`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  stage,
  ok: true,
  scope: 'Calendar DOM normalizers are centrally gated before retirement',
  runtimeTouched: 'Calendar.tsx + pure DOM normalizer policy module only',
  nextRecommended: 'STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE',
}, null, 2));
