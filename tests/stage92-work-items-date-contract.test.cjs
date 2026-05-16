const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, '');

test('Stage92 guard exists and validates core date contract markers', () => {
  const script = read('scripts/check-stage92-work-items-date-contract.cjs');
  const normalize = read('src/lib/work-items/normalize.ts');
  const calendarItems = read('src/lib/calendar-items.ts');
  const taskEvent = read('src/lib/task-event-contract.ts');

  assert.match(script, /PASS STAGE92_WORK_ITEMS_DATE_CONTRACT/);
  assert.match(script, /forbidden reminder preset 15m detected/);
  assert.match(script, /forbidden fallback detected/);

  assert.match(normalize, /export function normalizeWorkItem/);
  assert.match(calendarItems, /import \{ normalizeWorkItem \}/);
  assert.match(taskEvent, /import \{ normalizeWorkItem \}/);
});
