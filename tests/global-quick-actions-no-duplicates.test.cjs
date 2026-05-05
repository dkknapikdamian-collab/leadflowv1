const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    if (entry.isFile() && entry.name.endsWith('.tsx')) out.push(full);
  }
  return out;
}

test('global quick actions stay in one top bar', () => {
  const global = read('src/components/GlobalQuickActions.tsx');
  assert.match(global, /GLOBAL_QUICK_ACTIONS_SINGLE_SOURCE_V9[257]/);
  assert.match(global, /Asystent AI|GlobalAiAssistant/);
  assert.match(global, /Szybki szkic|QuickAiCapture/);
  assert.match(global, /Inbox szkiców/);
  assert.match(global, /Lead/);
  assert.match(global, /Zadanie/);
  assert.match(global, /Wydarzenie/);
});

test('pages do not render duplicate AI quick action widgets', () => {
  const pages = walk(path.join(repoRoot, 'src', 'pages'));
  const offenders = [];

  for (const file of pages) {
    const source = fs.readFileSync(file, 'utf8');
    const relative = path.relative(repoRoot, file);

    for (const component of ['GlobalAiAssistant', 'QuickAiCapture', 'TodayAiAssistant']) {
      if (new RegExp('import\\s+' + component + '\\s+from').test(source)) offenders.push(relative + ': imports ' + component);
      if (new RegExp('<' + component + '\\b').test(source)) offenders.push(relative + ': renders ' + component);
    }
  }

  assert.deepEqual(offenders, []);
});

test('global quick actions no duplicates test is included in quiet release gate', () => {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(gate.includes('tests/global-quick-actions-no-duplicates.test.cjs'));
});
