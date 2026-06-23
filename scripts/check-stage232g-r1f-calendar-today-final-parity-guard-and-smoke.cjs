#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

const root = process.cwd();
const stage = 'STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE';
const failures = [];
function rel(p) { return path.join(root, p); }
function read(p) {
  const file = rel(p);
  if (!fs.existsSync(file)) {
    failures.push(`missing file: ${p}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}
function expect(condition, message) { if (!condition) failures.push(message); }
function includes(file, text, needle, label = needle) { if (!text.includes(needle)) failures.push(`${file} missing ${label}`); }
function regex(file, text, re, label = String(re)) { if (!re.test(text)) failures.push(`${file} missing ${label}`); }

const files = {
  contract: 'src/lib/calendar-operational-entry-contract.ts',
  todayAdapter: 'src/lib/calendar-operational-entry-today-adapter.ts',
  leadShadowPolicy: 'src/lib/calendar-lead-shadow-entry-policy.ts',
  scheduling: 'src/lib/scheduling.ts',
  actionPolicy: 'src/lib/calendar-operational-entry-action-policy.ts',
  domPolicy: 'src/lib/calendar-dom-normalizer-policy.ts',
  calendar: 'src/pages/Calendar.tsx',
  today: 'src/pages/TodayStable.tsx',
  apiWorkItems: 'api/work-items.ts',
  cfRuntime: 'scripts/check-cf-runtime-00-source-truth.cjs',
  guard: 'scripts/check-stage232g-r1f-calendar-today-final-parity-guard-and-smoke.cjs',
  test: 'tests/stage232g-r1f-calendar-today-final-parity-guard-and-smoke.test.cjs',
  run: '_project/runs/STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE.md',
  payload: '_project/obsidian_updates/2026-06-23_STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE.md',
};

const contract = read(files.contract);
const todayAdapter = read(files.todayAdapter);
const leadShadowPolicy = read(files.leadShadowPolicy);
const scheduling = read(files.scheduling);
const actionPolicy = read(files.actionPolicy);
const domPolicy = read(files.domPolicy);
const calendar = read(files.calendar);
const today = read(files.today);
const api = read(files.apiWorkItems);
const cfRuntime = read(files.cfRuntime);
const run = read(files.run);
const payload = read(files.payload);

// R1A: shared operational entry contract remains the source boundary.
includes(files.contract, contract, 'STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT', 'R1A marker');
includes(files.contract, contract, 'buildCalendarTodayParityFingerprint', 'parity fingerprint');
includes(files.contract, contract, 'buildOperationalEntryContract', 'entry contract builder');
includes(files.contract, contract, "export type OperationalEntryKind = 'event' | 'task' | 'lead'", 'entry kinds event/task/lead');
includes(files.contract, contract, "export type OperationalEntryAction", 'entry action type');

// R1B: Today uses contract wrappers.
includes(files.todayAdapter, todayAdapter, 'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT', 'R1B adapter marker');
includes(files.todayAdapter, todayAdapter, 'calendar-operational-entry-contract', 'adapter imports R1A contract');
for (const fn of ['getTodayTaskMomentRaw', 'getTodayEventMomentRaw', 'getTodayLeadMomentRaw', 'getTodayOperationalDayKey']) includes(files.todayAdapter, todayAdapter, fn, `adapter ${fn}`);
includes(files.today, today, 'STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT', 'Today R1B marker');
includes(files.today, today, 'calendar-operational-entry-today-adapter', 'Today imports R1B adapter');
for (const fn of ['getTodayTaskMomentRaw', 'getTodayEventMomentRaw', 'getTodayLeadMomentRaw', 'getTodayOperationalDayKey']) includes(files.today, today, fn, `Today uses ${fn}`);

// R1C: lead shadow is policy controlled and not destructively actionable.
includes(files.leadShadowPolicy, leadShadowPolicy, 'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP', 'R1C policy marker');
includes(files.leadShadowPolicy, leadShadowPolicy, 'applyLeadShadowEntryPolicy', 'lead shadow apply policy');
includes(files.leadShadowPolicy, leadShadowPolicy, 'duplicate_lead_shadow', 'lead shadow duplicate decision');
expect(!/LEAD_ALLOWED_ACTIONS[\s\S]{0,260}(complete|restore|delete)/.test(leadShadowPolicy), 'lead shadow allowed actions must not include complete/restore/delete');
includes(files.scheduling, scheduling, 'STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP', 'scheduling R1C marker');
includes(files.scheduling, scheduling, 'applyLeadShadowEntryPolicy', 'scheduling applies lead shadow policy');

// R1D: Calendar/Today actions respect operational policy.
includes(files.actionPolicy, actionPolicy, 'STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT', 'R1D action policy marker');
includes(files.actionPolicy, actionPolicy, 'isOperationalEntryActionAllowed', 'action policy decision helper');
includes(files.actionPolicy, actionPolicy, 'blocked_for_lead_shadow', 'lead shadow action block reason');
includes(files.calendar, calendar, 'calendar-operational-entry-action-policy', 'Calendar imports action policy');
includes(files.today, today, 'calendar-operational-entry-action-policy', 'Today imports action policy');
for (const token of ['STAGE232G_R1D_COMPLETE_ACTION_CONTRACT_GUARD', 'STAGE232G_R1D_DELETE_ACTION_CONTRACT_GUARD', 'STAGE232G_R1D_RESTORE_ACTION_CONTRACT_GUARD']) {
  expect(calendar.includes(token) || today.includes(token), `Calendar/Today missing ${token}`);
}
expect(calendar.includes('isOperationalEntryActionAllowed') || today.includes('isOperationalEntryActionAllowed'), 'Calendar/Today must call isOperationalEntryActionAllowed');

// R1E: DOM normalizers are policy gated before retirement.
includes(files.domPolicy, domPolicy, 'STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE', 'R1E policy marker');
includes(files.domPolicy, domPolicy, 'CALENDAR_DOM_NORMALIZER_IDS', 'DOM normalizer ids');
includes(files.domPolicy, domPolicy, 'shouldRunCalendarDomNormalizer', 'DOM normalizer gate');
includes(files.calendar, calendar, 'calendar-dom-normalizer-policy', 'Calendar imports DOM normalizer policy');
includes(files.calendar, calendar, 'STAGE232G_R1E_CALENDAR_DOM_NORMALIZER_POLICY_GUARD', 'Calendar R1E policy marker');
regex(files.calendar, calendar, /shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.colorTooltipV2\)/, 'color tooltip policy gate');
regex(files.calendar, calendar, /shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.monthEntryStructuralV3\)/, 'month structural policy gate');
regex(files.calendar, calendar, /shouldRunCalendarDomNormalizer\(CALENDAR_DOM_NORMALIZER_IDS\.monthPlainTextRowsV4\)/, 'plain text rows policy gate');

// R1E1: Vercel work-items TS blocker stays fixed.
includes(files.apiWorkItems, api, 'STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME', 'R1E1 R2 marker');
includes(files.apiWorkItems, api, 'readBlocksProgressStage232GR1A', 'blocksProgress reader helper');
if (/\b[A-Za-z_$][\w$]*\.blocksProgress\b/.test(api.replace(/record\['blocksProgress'\]/g, ''))) failures.push('unsafe direct .blocksProgress read remains in api/work-items.ts');

// R1F package/source-of-truth docs.
includes(files.cfRuntime, cfRuntime, `${stage}_ALLOWLIST`, 'R1F CF_RUNTIME allowlist marker');
for (const p of Object.values(files)) {
  if (p.startsWith('src/') || p === 'api/work-items.ts') continue;
  includes(files.cfRuntime, cfRuntime, p, `CF_RUNTIME allowlist includes ${p}`);
}
includes(files.run, run, stage, 'R1F run report marker');
includes(files.payload, payload, stage, 'R1F Obsidian payload marker');
for (const [file, marker] of [
  ['10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md', `${stage}_00_START`],
  ['_project/04_ETAPY_ROZWOJU_APLIKACJI.md', `${stage}_QUEUE`],
  ['_project/06_GUARDS_AND_TESTS.md', `${stage}_GUARDS`],
  ['_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md', `${stage}_TESTS`],
  ['_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md', `${stage}_RISKS`],
  ['_project/CODEX_CONTEXT_INDEX.md', `${stage}_CODEX`],
]) includes(file, read(file), marker, `central marker ${marker}`);

// R1F must not change runtime files. It is final guard/docs only.
try {
  const changed = cp.execSync('git status --porcelain', { cwd: root, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean).map((line) => line.replace(/^\s*[AMDRCU?! ]+\s+/, '').replace(/^"/, '').replace(/"$/, '').replace(/\\/g, '/'));
  const allowed = new Set([
    '10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md',
    '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
    '_project/06_GUARDS_AND_TESTS.md',
    '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
    '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
    '_project/CODEX_CONTEXT_INDEX.md',
    'scripts/check-cf-runtime-00-source-truth.cjs',
    files.run,
    files.payload,
    files.guard,
    files.test,
  ]);
  const forbiddenRuntime = new Set([
    files.calendar,
    files.today,
    files.contract,
    files.todayAdapter,
    files.leadShadowPolicy,
    files.scheduling,
    files.actionPolicy,
    files.domPolicy,
    files.apiWorkItems,
  ]);
  for (const file of changed) {
    if (forbiddenRuntime.has(file)) failures.push(`R1F must not change runtime/source file: ${file}`);
    if (!allowed.has(file)) failures.push(`out-of-scope changed file for R1F: ${file}`);
  }
} catch (error) {
  failures.push(`could not inspect git status: ${error.message}`);
}

if (failures.length) {
  console.error(`${stage}_FAIL`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  stage,
  ok: true,
  scope: 'final Calendar/Today parity guard and smoke checklist only',
  runtimeTouched: 'none by R1F',
  seriesStatusAfterPush: 'STAGE232G_CLOSED_PENDING_MANUAL_SMOKE_AND_VERCEL_CONFIRMATION',
  nextRecommended: 'NONE_PLANNED_BY_OWNER_RULE; only fix bugs found in current series',
}, null, 2));
