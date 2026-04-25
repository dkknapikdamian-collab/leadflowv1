const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today task/action rows cannot squeeze title into one-letter column', () => {
  const today = read('src/pages/Today.tsx');

  assert.doesNotMatch(today, /w-full p-4 flex items-center justify-between gap-4 text-left/);
  assert.doesNotMatch(today, /p-4 flex items-center justify-between gap-4/);
  assert.doesNotMatch(today, /className="flex items-start justify-between gap-4"/);
  assert.doesNotMatch(today, /className="flex items-center justify-between gap-4"/);
  assert.doesNotMatch(today, /className="min-w-0 w-full flex-1"/);
  assert.doesNotMatch(today, /className="flex flex-wrap items-center gap-2 shrink-0/);

  assert.match(today, /sm:flex-wrap/);
  assert.match(today, /min-w-0 basis-full sm:basis-72 flex-1/);
  assert.match(today, /flex w-full flex-wrap items-center gap-2 sm:w-auto/);
});

test('Today quick snooze bar wraps safely and does not split button text', () => {
  const today = read('src/pages/Today.tsx');

  assert.match(today, /TodayEntrySnoozeBar/);
  assert.match(today, /TODAY_QUICK_SNOOZE_OPTIONS/);
  assert.match(today, /mt-3 flex w-full max-w-full flex-wrap items-center gap-2/);
  assert.match(today, /shrink-0 text-xs font-semibold text-slate-500/);
  assert.match(today, /whitespace-nowrap rounded-lg border border-slate-200/);
});

test('release gates include Today layout regression test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assert.match(quietGate, /tests\/today-action-layout-not-column-cramped\.test\.cjs/);
  assert.match(fullGate, /tests\/today-action-layout-not-column-cramped\.test\.cjs/);
});
