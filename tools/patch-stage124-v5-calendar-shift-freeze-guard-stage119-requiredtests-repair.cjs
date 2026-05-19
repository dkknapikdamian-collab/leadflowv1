const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const stage119Path = path.join(repoRoot, 'tests/stage119-calendar-release-gate-trust.test.cjs');
const stage124Path = path.join(repoRoot, 'tests/stage124-calendar-shift-freeze-guard.test.cjs');
const packagePath = path.join(repoRoot, 'package.json');
const quietPath = path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs');
const runDocPath = path.join(repoRoot, '_project/runs/2026-05-18_stage124_v5_calendar_shift_freeze_guard_stage119_requiredtests_repair.md');

const stage98 = 'tests/stage98-polish-mojibake-calendar-guard.test.cjs';
const stage119 = 'tests/stage119-calendar-release-gate-trust.test.cjs';
const stage124 = 'tests/stage124-calendar-shift-freeze-guard.test.cjs';

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content.replace(/[ \t]+$/gm, '').replace(/\r?\n/g, '\n'), 'utf8');
}

function extractRequiredTests(text) {
  const match = text.match(/const\s+requiredTests\s*=\s*\[([\s\S]*?)\];/);
  if (!match) throw new Error('requiredTests array must exist.');
  return Array.from(match[1].matchAll(/['"]([^'"]+\.test\.cjs)['"]/g)).map((entry) => entry[1]);
}

function dedupe(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const normalized = String(item || '').trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

function ensureFile(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) throw new Error('Missing required file: ' + relativePath);
}

const stage119Test = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const gatePath = path.join(repoRoot, 'scripts', 'closeflow-release-check-quiet.cjs');
const stage98 = 'tests/stage98-polish-mojibake-calendar-guard.test.cjs';
const stage119 = 'tests/stage119-calendar-release-gate-trust.test.cjs';

function readGate() {
  return fs.readFileSync(gatePath, 'utf8');
}

function extractRequiredTests(text) {
  const match = text.match(/const\\s+requiredTests\\s*=\\s*\\[([\\s\\S]*?)\\];/);
  assert.ok(match, 'requiredTests array must exist.');
  return Array.from(match[1].matchAll(/['\"]([^'\"]+\\.test\\.cjs)['\"]/g)).map((entry) => entry[1]);
}

function count(list, value) {
  return list.filter((item) => item === value).length;
}

function duplicates(list) {
  const seen = new Set();
  const dupes = [];
  for (const item of list) {
    if (seen.has(item) && !dupes.includes(item)) dupes.push(item);
    seen.add(item);
  }
  return dupes;
}

test('Stage119 V5 gate harness has one Stage98 preflight before build and no duplicate requiredTests', () => {
  const text = readGate();
  const requiredTests = extractRequiredTests(text);
  const dupes = duplicates(requiredTests);

  assert.deepStrictEqual(dupes, [], 'requiredTests duplicate paths: ' + dupes.join(', '));
  assert.equal(count(requiredTests, stage98), 1, 'Expected exactly one Stage98 requiredTests entry.');
  assert.equal(count(requiredTests, stage119), 1, 'Expected exactly one Stage119 requiredTests entry.');

  const preflightStarts = (text.match(/STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_START/g) || []).length;
  const preflightEnds = (text.match(/STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_END/g) || []).length;
  assert.equal(preflightStarts, 1, 'Expected exactly one Stage119 preflight start marker.');
  assert.equal(preflightEnds, 1, 'Expected exactly one Stage119 preflight end marker.');

  const preflightStart = text.indexOf('// STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_START');
  const preflightEnd = text.indexOf('// STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_END');
  const buildIndex = text.indexOf("runQuiet('production build'");

  assert.ok(preflightStart !== -1, 'Stage119 preflight start marker must exist.');
  assert.ok(preflightEnd > preflightStart, 'Stage119 preflight end marker must follow start marker.');
  assert.ok(buildIndex > preflightEnd, 'Production build must run after Stage98 calendar preflight.');

  const preflightBlock = text.slice(preflightStart, preflightEnd);
  assert.match(preflightBlock, /stage98 calendar mojibake hard gate preflight/);
  assert.match(preflightBlock, /tests\\/stage98-polish-mojibake-calendar-guard\\.test\\.cjs/);

  assert.equal(text.includes('STAGE98B_MOJIBAKE_PREFLIGHT_V22_START'), false);
  assert.equal(text.includes('STAGE98B_MOJIBAKE_PREFLIGHT_V20_START'), false);
  assert.equal(text.includes('STAGE98B_MOJIBAKE_PREFLIGHT_QUIET_GATE'), false);
  assert.equal(text.includes('CLOSEFLOW_STAGE98B_MOJIBAKE_PREFLIGHT'), false);
});

test('Stage119 V5 requiredTests preflight reports all missing tests before quiet gate', () => {
  const text = readGate();
  const requiredTests = extractRequiredTests(text);
  const missing = requiredTests.filter((relativePath) => !fs.existsSync(path.join(repoRoot, relativePath)));
  assert.deepStrictEqual(missing, [], 'Missing requiredTests files: ' + missing.join(', '));
});

test('Stage98 hard gate scans active code/test/script sources, not historical _project reports', () => {
  const guard = fs.readFileSync(path.join(repoRoot, stage98), 'utf8');
  assert.match(guard, /const roots = \\['src', 'tests', 'scripts'\\]/);
  assert.doesNotMatch(guard, /const roots = \\['src', 'tests', 'scripts', '_project'\\]/);
  assert.match(guard, /active code\\/test\\/script sources/);
});

test('Stage119 guard is registered in package scripts', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts['test:stage119-calendar-release-gate-trust'], 'node --test tests/stage119-calendar-release-gate-trust.test.cjs');
});
`;

const stage124Test = `const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function extractFunctionBody(source, functionName) {
  const index = source.indexOf('const ' + functionName + ' = async');
  assert.notEqual(index, -1, 'missing handler: ' + functionName);
  const braceStart = source.indexOf('{', index);
  assert.notEqual(braceStart, -1, 'missing body start: ' + functionName);
  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    const c = source[i];
    if (c === '{') depth += 1;
    if (c === '}') depth -= 1;
    if (depth === 0) return source.slice(braceStart, i + 1);
  }
  throw new Error('missing body end: ' + functionName);
}

function assertTaskShiftBranch(label, body) {
  assert.match(body, /STAGE123_CALENDAR_TASK_SHIFT_PAYLOAD_SOURCE/, label + ': missing Stage123 marker');
  assert.match(body, /const shiftedTaskDraft = \\{[\\s\\S]*\\.\\.\\.entry\\.raw[\\s\\S]*scheduledAt: shiftedStartAt[\\s\\S]*scheduled_at: shiftedStartAt[\\s\\S]*dueAt: shiftedStartAt[\\s\\S]*due_at: shiftedStartAt[\\s\\S]*date: shiftedDate[\\s\\S]*time: shiftedTime[\\s\\S]*\\};/, label + ': shifted draft must overwrite every date field before normalization');
  assert.match(body, /const taskPayload = syncTaskDerivedFields\\(shiftedTaskDraft\\);/, label + ': must normalize shifted draft');
  assert.doesNotMatch(body, /syncTaskDerivedFields\\(\\{\\s*\\.\\.\\.entry\\.raw,\\s*dueAt:/, label + ': stale scheduledAt-over-dueAt bug must not return');
  assert.match(body, /date:\\s*taskPayload\\.date,[\\s\\S]*scheduledAt:\\s*taskPayload\\.dueAt,[\\s\\S]*dueAt:\\s*taskPayload\\.dueAt,[\\s\\S]*time:\\s*taskPayload\\.time,/, label + ': API payload must preserve Stage114 contract shape');
  assert.doesNotMatch(body, /date:\\s*shiftedDate,[\\s\\S]*scheduledAt:\\s*shiftedStartAt,[\\s\\S]*dueAt:\\s*shiftedStartAt,[\\s\\S]*time:\\s*shiftedTime,/, label + ': do not bypass Stage114 payload fields');
}

test('Stage124 freezes confirmed working task day and hour shift payload source', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assertTaskShiftBranch('day', extractFunctionBody(calendar, 'handleShiftEntry'));
  assertTaskShiftBranch('hour', extractFunctionBody(calendar, 'handleShiftEntryHours'));
});

test('Stage124 freezes optimistic state updates for camelCase and snake_case date fields', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /dueAt: nextStartAt[\\s\\S]*due_at: nextStartAt[\\s\\S]*scheduledAt: nextStartAt[\\s\\S]*scheduled_at: nextStartAt[\\s\\S]*startAt: nextStartAt[\\s\\S]*start_at: nextStartAt/);
  assert.match(calendar, /startAt: nextStartAt[\\s\\S]*start_at: nextStartAt[\\s\\S]*scheduledAt: nextStartAt[\\s\\S]*scheduled_at: nextStartAt[\\s\\S]*endAt:[\\s\\S]*end_at:/);
});

test('Stage124 freeze guard is wired into package scripts and quiet gate exactly once', () => {
  const packageJson = JSON.parse(read('package.json'));
  assert.equal(packageJson.scripts['test:stage124-calendar-shift-freeze-guard'], 'node --test tests/stage124-calendar-shift-freeze-guard.test.cjs');
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  const matches = gate.match(/tests\\/stage124-calendar-shift-freeze-guard\\.test\\.cjs/g) || [];
  assert.equal(matches.length, 1, 'Stage124 freeze guard should be registered exactly once');
});
`;

function rewriteStageTests() {
  write(stage119Path, stage119Test);
  write(stage124Path, stage124Test);
}

function patchPackageJson() {
  const pkg = JSON.parse(read(packagePath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['test:stage119-calendar-release-gate-trust'] = 'node --test tests/stage119-calendar-release-gate-trust.test.cjs';
  pkg.scripts['test:stage124-calendar-shift-freeze-guard'] = 'node --test tests/stage124-calendar-shift-freeze-guard.test.cjs';
  write(packagePath, JSON.stringify(pkg, null, 2) + '\n');
}

function stripOldPreflights(text) {
  const removals = [
    /\/\/ STAGE98B_MOJIBAKE_PREFLIGHT_V22_START[\s\S]*?\/\/ STAGE98B_MOJIBAKE_PREFLIGHT_V22_END\s*/g,
    /\/\* STAGE98B_MOJIBAKE_PREFLIGHT_V20_START \*\/[\s\S]*?\/\* STAGE98B_MOJIBAKE_PREFLIGHT_V20_END \*\/\s*/g,
    /\/\* STAGE98B_MOJIBAKE_PREFLIGHT_QUIET_GATE \*\/[\s\S]*?\/\* STAGE98B_MOJIBAKE_PREFLIGHT_QUIET_GATE_END \*\/\s*/g,
    /\/\/ CLOSEFLOW_STAGE98B_MOJIBAKE_PREFLIGHT\s*\r?\nrunQuiet\([^\n]*stage98[^;]*;\s*/g,
    /\/\/ STAGE119_CALENDAR_RELEASE_GATE_TRUST_START[\s\S]*?\/\/ STAGE119_CALENDAR_RELEASE_GATE_TRUST_END\s*/g,
    /\/\/ STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_START[\s\S]*?\/\/ STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_END\s*/g,
  ];
  let next = text;
  for (const re of removals) next = next.replace(re, '');
  return next;
}

function patchQuietGate() {
  ensureFile(stage98);
  ensureFile(stage119);
  ensureFile(stage124);

  let text = stripOldPreflights(read(quietPath));
  const parsed = extractRequiredTests(text);
  const withoutManaged = parsed.filter((item) => ![stage98, stage119, stage124].includes(item));
  const list = dedupe([stage98, stage119, stage124, ...withoutManaged]);
  const rebuiltArray = 'const requiredTests = [\n' + list.map((item) => `  '${item}',`).join('\n') + '\n];';
  text = text.replace(/const\s+requiredTests\s*=\s*\[[\s\S]*?\];/, rebuiltArray);

  const preflightBlock = `// STAGE119_CALENDAR_RELEASE_GATE_TRUST_START
// Stage98 calendar mojibake guard is the single pre-build hard gate for the quiet release gate.
// STAGE119_CALENDAR_RELEASE_GATE_TRUST_END

// STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_START
runQuiet('stage98 calendar mojibake hard gate preflight', process.execPath, ['--test', '${stage98}']);
// STAGE119_CALENDAR_RELEASE_GATE_TRUST_PREFLIGHT_END
`;
  const buildCall = "runQuiet('production build'";
  const buildIndex = text.indexOf(buildCall);
  if (buildIndex === -1) throw new Error('Cannot find production build runQuiet call.');
  text = text.slice(0, buildIndex) + preflightBlock + text.slice(buildIndex);
  text = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  write(quietPath, text);

  const repaired = read(quietPath);
  const repairedTests = extractRequiredTests(repaired);
  const counts = new Map();
  for (const item of repairedTests) counts.set(item, (counts.get(item) || 0) + 1);
  for (const item of [stage98, stage119, stage124]) {
    if ((counts.get(item) || 0) !== 1) throw new Error(item + ' count is ' + String(counts.get(item) || 0));
  }
  const dupes = Array.from(counts.entries()).filter((entry) => entry[1] > 1).map((entry) => entry[0]);
  if (dupes.length) throw new Error('Duplicate requiredTests after repair: ' + dupes.join(', '));
  const missing = repairedTests.filter((relativePath) => !fs.existsSync(path.join(repoRoot, relativePath)));
  if (missing.length) throw new Error('Missing requiredTests after repair: ' + missing.join(', '));
}

function writeRunDoc() {
  write(runDocPath, `# Stage124 V5 - Calendar shift freeze guard requiredTests repair

## FAKTY
- Damian confirmed Stage123 works: task +1D/+1H shift moves and persists.
- Stage124 V4 failed before freeze commit because local quiet gate had zero Stage98 entries in requiredTests.
- Correct freeze state requires Stage98, Stage119 and Stage124 each exactly once in requiredTests.

## ZMIANY
- Rewrites Stage119 guard to current V5 contract.
- Rewrites Stage124 freeze guard with valid regexes.
- Repairs quiet release gate structurally: removes old preflight blocks, rebuilds requiredTests with Stage98, Stage119 and Stage124 exactly once, and inserts one Stage119 preflight before production build.
- Does not change the working Calendar Stage123 product logic.

## TESTY
- Stage119 release gate trust guard
- Stage124 freeze guard
- Stage123 task shift payload guard
- Stage114 shift persistence guard
- npm run build
- npm run verify:closeflow:quiet

## POTWIERDZENIE DAMIANA
DZIAŁA. Stage124 is a freeze guard for the confirmed working task shift behavior.
`);
}

rewriteStageTests();
patchPackageJson();
patchQuietGate();
writeRunDoc();
console.log('Stage124 V5 freeze guard and Stage119 requiredTests repair applied.');
