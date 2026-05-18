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
  assert.notEqual(braceStart, -1, 'missing handler body start: ' + functionName);
  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    const char = source[i];
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) return source.slice(braceStart, i + 1);
  }
  throw new Error('missing handler body end: ' + functionName);
}

test('Stage123 documents and fixes the scheduledAt-over-dueAt task shift bug', () => {
  const contract = read('src/lib/task-event-contract.ts');
  assert.match(contract, /normalizeTaskV1\(task\)/);
  assert.match(contract, /normalized\.scheduledAt \?\? normalized\.reminderAt/);
  assert.match(contract, /syncTaskDerivedFields/);
});

test('day and hour task shift overwrite scheduledAt before syncTaskDerivedFields', () => {
  const calendar = read('src/pages/Calendar.tsx');
  const day = extractFunctionBody(calendar, 'handleShiftEntry');
  const hour = extractFunctionBody(calendar, 'handleShiftEntryHours');

  for (const [label, body] of [['day', day], ['hour', hour]]) {
    assert.match(body, /STAGE123_CALENDAR_TASK_SHIFT_PAYLOAD_SOURCE/, label + ' branch should carry Stage123 marker');
    assert.match(body, /const shiftedTaskDraft = \{[\s\S]*\.\.\.entry\.raw[\s\S]*scheduledAt: shiftedStartAt[\s\S]*scheduled_at: shiftedStartAt[\s\S]*dueAt: shiftedStartAt[\s\S]*due_at: shiftedStartAt[\s\S]*date: shiftedDate[\s\S]*time: shiftedTime[\s\S]*\};/, label + ' branch must overwrite all task date fields before normalization');
    assert.match(body, /const taskPayload = syncTaskDerivedFields\(shiftedTaskDraft\);/, label + ' branch must normalize the shifted draft, not stale entry.raw');
    assert.doesNotMatch(body, /syncTaskDerivedFields\(\{\s*\.\.\.entry\.raw,\s*dueAt:/, label + ' branch must not let stale scheduledAt win over dueAt');
    assert.match(body, /date:\s*taskPayload\.date,[\s\S]*scheduledAt:\s*taskPayload\.dueAt,[\s\S]*dueAt:\s*taskPayload\.dueAt,[\s\S]*time:\s*taskPayload\.time/, label + ' API payload must preserve Stage114 contract while using shifted taskPayload fields');
    assert.doesNotMatch(body, /date:\s*shiftedDate,[\s\S]*scheduledAt:\s*shiftedStartAt,[\s\S]*dueAt:\s*shiftedStartAt,[\s\S]*time:\s*shiftedTime/, label + ' API payload must not bypass taskPayload Stage114 contract');
  }
});

test('optimistic state updates camelCase and snake_case task date fields', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /dueAt: nextStartAt[\s\S]*due_at: nextStartAt[\s\S]*scheduledAt: nextStartAt[\s\S]*scheduled_at: nextStartAt[\s\S]*startAt: nextStartAt[\s\S]*start_at: nextStartAt/);
  assert.match(calendar, /startAt: nextStartAt[\s\S]*start_at: nextStartAt[\s\S]*scheduledAt: nextStartAt[\s\S]*scheduled_at: nextStartAt/);
});

test('Stage123 guard is wired into package scripts and quiet release gate once', () => {
  const packageJson = JSON.parse(read('package.json'));
  assert.equal(
    packageJson.scripts['test:stage123-calendar-task-shift-payload-source'],
    'node --test tests/stage123-calendar-task-shift-payload-source-contract.test.cjs',
  );

  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  const matches = gate.match(/tests\/stage123-calendar-task-shift-payload-source-contract\.test\.cjs/g) || [];
  assert.equal(matches.length, 1, 'Stage123 test should be registered exactly once in quiet gate');
});
