const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function extractTodayEntrySnoozeBar(source) {
  const start = source.indexOf('function TodayEntrySnoozeBar({');
  const end = source.indexOf('export default function Today() {');

  assert.ok(start > -1, 'TodayEntrySnoozeBar component is missing');
  assert.ok(end > start, 'TodayEntrySnoozeBar component end marker is missing');

  return source.slice(start, end);
}

function expectText(source, text) {
  assert.ok(source.includes(text), 'Missing text: ' + text);
}

function expectPattern(source, pattern, label) {
  assert.ok(pattern.test(source), 'Missing pattern: ' + label);
}

function rejectPattern(source, pattern, label) {
  assert.ok(!pattern.test(source), 'Unexpected pattern: ' + label);
}

test('Today task/action rows cannot squeeze title into one-letter column', () => {
  const today = read('src/pages/Today.tsx');

  rejectPattern(today, /w-full p-4 flex items-center justify-between gap-4 text-left/, 'old one-row tile button layout');
  rejectPattern(today, /p-4 flex items-center justify-between gap-4/, 'old one-row compact layout');
  rejectPattern(today, /className="flex items-start justify-between gap-4"/, 'old start-justify-between layout');
  rejectPattern(today, /className="flex items-center justify-between gap-4"/, 'old center-justify-between layout');
  rejectPattern(today, /className="min-w-0 w-full flex-1"/, 'old title width squeeze layout');
  rejectPattern(today, /className="flex flex-wrap items-center gap-2 shrink-0/, 'old shrinking action group');

  expectText(today, 'sm:flex-wrap');
  expectText(today, 'min-w-0 basis-full sm:basis-72 flex-1');
  expectText(today, 'flex w-full flex-wrap items-center gap-2 sm:w-auto');
});

test('Today quick snooze bar wraps safely and does not split button text', () => {
  const today = read('src/pages/Today.tsx');
  const component = extractTodayEntrySnoozeBar(today);

  expectText(component, 'function TodayEntrySnoozeBar');
  expectText(component, 'TODAY_QUICK_SNOOZE_OPTIONS.map');
  expectText(component, 'mt-3 flex w-full max-w-full flex-wrap items-center gap-2');
  expectText(component, 'shrink-0 text-xs font-semibold text-slate-500');
  expectText(component, 'whitespace-nowrap');
  expectText(component, 'rounded-lg border');
  expectText(component, 'border-slate-200');
  expectText(component, 'role="button"');
  expectText(component, 'data-today-quick-snooze-action={option.key}');
  rejectPattern(component, /<button\b/, 'native nested quick snooze button');
});

test('release gates include Today layout regression test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  expectPattern(quietGate, /tests\/today-action-layout-not-column-cramped\.test\.cjs/, 'quiet release gate entry');
  expectPattern(fullGate, /tests\/today-action-layout-not-column-cramped\.test\.cjs/, 'full release gate entry');
});
