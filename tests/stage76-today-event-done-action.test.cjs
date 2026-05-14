const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(relativePath) { return fs.readFileSync(path.join(root, relativePath), 'utf8'); }
function runNode(args) { return spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' }); }

test('Stage76 files are syntactically valid', () => {
  for (const file of [
    'scripts/check-stage76-today-event-done-action.cjs',
    'tests/stage76-today-event-done-action.test.cjs',
    'src/pages/TodayStable.tsx',
  ]) {
    const args = file.endsWith('.tsx') ? ['scripts/check-stage76-today-event-done-action.cjs'] : ['--check', file];
    const result = runNode(args);
    assert.equal(result.status, 0, file + '\n' + result.stdout + result.stderr);
  }
});

test('Today events can be marked done with the event update API', () => {
  const today = read('src/pages/TodayStable.tsx');
  assert.ok(today.includes('updateEventInSupabase'));
  assert.ok(today.includes('const handleMarkEventDone = useCallback'));
  assert.ok(today.includes("updateEventInSupabase({ id: eventId, status: 'done' })"));
  assert.ok(today.includes('data-stage76-event-done-action="true"'));
  assert.ok(today.includes('doneLabel="Zrobione"'));
  assert.ok(today.includes('handleMarkEventDone(String('));
});

test('Today active event list filters closed event statuses', () => {
  const today = read('src/pages/TodayStable.tsx');
  const start = today.indexOf('const todayEvents = useMemo');
  assert.notEqual(start, -1, 'missing todayEvents useMemo');
  const end = today.indexOf('\n  const ', start + 1);
  const block = today.slice(start, end === -1 ? today.length : end);
  assert.match(block, /isClosedStatus\(event\??\.status\)/);
});

test('Event done update is shared through supabase fallback, not Today-only storage', () => {
  const supabase = read('src/lib/supabase-fallback.ts');
  assert.ok(supabase.includes('export async function updateEventInSupabase'));
  assert.ok(supabase.includes("'/api/events'"));
  assert.ok(supabase.includes("method: 'PATCH'"));
  const today = read('src/pages/TodayStable.tsx');
  assert.ok(!today.includes('localStorage.setItem') || today.indexOf('localStorage.setItem') < today.indexOf('STAGE76_TODAY_EVENT_DONE_ACTION') || !today.slice(today.indexOf('STAGE76_TODAY_EVENT_DONE_ACTION')).includes('localStorage.setItem'));
});

test('Stage76 is wired into package scripts and quiet release gate', () => {
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.equal(pkg.scripts['check:stage76-today-event-done-action'], 'node scripts/check-stage76-today-event-done-action.cjs');
  assert.equal(pkg.scripts['test:stage76-today-event-done-action'], 'node --test tests/stage76-today-event-done-action.test.cjs');
  assert.ok(quiet.includes("'tests/stage76-today-event-done-action.test.cjs'"));
});
