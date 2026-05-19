const assert = require('node:assert/strict');
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
  assert.match(body, /const shiftedTaskDraft = \{[\s\S]*\.\.\.entry\.raw[\s\S]*scheduledAt: shiftedStartAt[\s\S]*scheduled_at: shiftedStartAt[\s\S]*dueAt: shiftedStartAt[\s\S]*due_at: shiftedStartAt[\s\S]*date: shiftedDate[\s\S]*time: shiftedTime[\s\S]*\};/, label + ': shifted draft must overwrite every date field before normalization');
  assert.match(body, /const taskPayload = syncTaskDerivedFields\(shiftedTaskDraft\);/, label + ': must normalize shifted draft');
  assert.doesNotMatch(body, /syncTaskDerivedFields\(\{\s*\.\.\.entry\.raw,\s*dueAt:/, label + ': stale scheduledAt-over-dueAt bug must not return');
  assert.match(body, /date:\s*taskPayload\.date,[\s\S]*scheduledAt:\s*taskPayload\.dueAt,[\s\S]*dueAt:\s*taskPayload\.dueAt,[\s\S]*time:\s*taskPayload\.time,/, label + ': API payload must preserve Stage114 contract shape');
  assert.doesNotMatch(body, /date:\s*shiftedDate,[\s\S]*scheduledAt:\s*shiftedStartAt,[\s\S]*dueAt:\s*shiftedStartAt,[\s\S]*time:\s*shiftedTime,/, label + ': do not bypass Stage114 payload fields');
}

test('Stage124 freezes confirmed working task day and hour shift payload source', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assertTaskShiftBranch('day', extractFunctionBody(calendar, 'handleShiftEntry'));
  assertTaskShiftBranch('hour', extractFunctionBody(calendar, 'handleShiftEntryHours'));
});

test('Stage124 freezes optimistic state updates for camelCase and snake_case date fields', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /dueAt: nextStartAt[\s\S]*due_at: nextStartAt[\s\S]*scheduledAt: nextStartAt[\s\S]*scheduled_at: nextStartAt[\s\S]*startAt: nextStartAt[\s\S]*start_at: nextStartAt/);
  assert.match(calendar, /startAt: nextStartAt[\s\S]*start_at: nextStartAt[\s\S]*scheduledAt: nextStartAt[\s\S]*scheduled_at: nextStartAt[\s\S]*endAt:[\s\S]*end_at:/);
});

test('Stage124 freeze guard is wired into package scripts and quiet gate exactly once', () => {
  const packageJson = JSON.parse(read('package.json'));
  assert.equal(packageJson.scripts['test:stage124-calendar-shift-freeze-guard'], 'node --test tests/stage124-calendar-shift-freeze-guard.test.cjs');
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  const matches = gate.match(/tests\/stage124-calendar-shift-freeze-guard\.test\.cjs/g) || [];
  assert.equal(matches.length, 1, 'Stage124 freeze guard should be registered exactly once');
});
