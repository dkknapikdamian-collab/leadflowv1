const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Today card headers do not use one-row layout that can squeeze titles into one-letter columns', () => {
  const today = read('src/pages/Today.tsx');

  assert.doesNotMatch(today, /w-full p-4 flex items-center justify-between gap-4 text-left/);
  assert.doesNotMatch(today, /p-4 flex items-center justify-between gap-4/);
  assert.doesNotMatch(today, /className="flex items-start justify-between gap-4"/);
  assert.doesNotMatch(today, /className="flex items-center justify-between gap-4"/);

  assert.match(today, /sm:flex-row/);
  assert.match(today, /min-w-0 w-full flex-1/);
  assert.match(today, /flex flex-wrap items-center gap-2 shrink-0/);
});

test('Today quick action controls can wrap instead of stealing all text width', () => {
  const today = read('src/pages/Today.tsx');

  assert.match(today, /TodayEntrySnoozeBar/);
  assert.match(today, /Szybko od/);
  assert.match(today, /TODAY_QUICK_SNOOZE_OPTIONS/);
  assert.match(today, /flex flex-wrap items-center gap-2/);
});
