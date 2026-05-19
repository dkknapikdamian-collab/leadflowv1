const fs = require('fs');
const path = require('path');

const root = process.cwd();
const backupRoot = path.join(root, '_backup_local', '2026-05-19_stage124d_v2_restore_tasks_events_guard_fix');
fs.mkdirSync(backupRoot, { recursive: true });

function writeIfChanged(rel, content) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(backupRoot, rel.replace(/[\\/]/g, '__')));
  }
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (previous === content) return false;
  fs.writeFileSync(file, content, 'utf8');
  return true;
}

function appendOnce(rel, marker, block) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (previous.includes(marker)) return false;
  fs.writeFileSync(file, previous.replace(/\s*$/, '') + '\n\n' + block.trim() + '\n', 'utf8');
  return true;
}

const guard = `const fs = require('fs');
const assert = require('assert');

function read(file) { return fs.readFileSync(file, 'utf8'); }
function mustInclude(text, token, message) { assert.ok(text.includes(token), message + ' missing token: ' + token); }
function mustNotInclude(text, token, message) { assert.ok(!text.toLowerCase().includes(token.toLowerCase()), message + ' forbidden token: ' + token); }

const tasks = read('api/tasks.ts');
const events = read('api/events.ts');

for (const [name, text] of [['api/tasks.ts', tasks], ['api/events.ts', events]]) {
  assert.match(text, /STAGE124D_SUPABASE_EGRESS_LIGHT_(TASK|EVENT)_ROUTE/, name + ' must carry Stage124D marker');
  assert.doesNotMatch(text, /select=\*/i, name + ' must not use select=*');
  mustInclude(text, 'resolveRequestWorkspaceId(req', name + ' must resolve workspace from request context');
  mustInclude(text, 'withWorkspaceFilter(', name + ' must scope reads by workspace');
  mustInclude(text, 'updateByIdScoped(', name + ' must scope updates by workspace');
  mustInclude(text, 'deleteByIdScoped(', name + ' must scope deletes by workspace');
  assert.match(text, /limit=['"]?\s*\+\s*limit|limit=\$\{limit\}|limit=' \+ limit|limit=" \+ limit/, name + ' must cap list limit');
}

mustInclude(tasks, 'TASK_LIST_SELECT_STAGE124D', 'tasks route must use explicit ListDTO select contract');
mustInclude(events, 'EVENT_LIST_SELECT_STAGE124D', 'events route must use explicit ListDTO select contract');
mustInclude(tasks, "addDateRange(query, 'scheduled_at'", 'tasks route must support scheduled_at range');
mustInclude(events, "addDateRange(query, 'start_at'", 'events route must support start_at range');

console.log('✔ Stage124D task/event API routes are restored with explicit scoped list selects');
`;

const test = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('Stage124D restores lightweight task/event API routes', () => {
  for (const file of ['api/tasks.ts', 'api/events.ts']) {
    assert.equal(fs.existsSync(file), true, file + ' should exist');
    const text = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(text, /select=\*/i);
    assert.ok(text.includes('resolveRequestWorkspaceId(req'));
    assert.ok(text.includes('withWorkspaceFilter('));
    assert.ok(text.includes('updateByIdScoped('));
    assert.ok(text.includes('deleteByIdScoped('));
  }
});
`;

const changed = [];
if (writeIfChanged('scripts/check-stage124d-task-event-routes.cjs', guard)) changed.push('scripts/check-stage124d-task-event-routes.cjs');
if (writeIfChanged('tests/stage124d-task-event-routes.test.cjs', test)) changed.push('tests/stage124d-task-event-routes.test.cjs');
const self = fs.readFileSync(__filename, 'utf8');
if (writeIfChanged('tools/patch-stage124d-v2-guard-fix.cjs', self)) changed.push('tools/patch-stage124d-v2-guard-fix.cjs');

appendOnce('_project/12_IMPLEMENTATION_LEDGER.md', 'STAGE124D_V2_GUARD_FIX', `## 2026-05-19 - STAGE124D_V2_GUARD_FIX

FACTS:
- Stage124D route files were created and build passed.
- Stage124D guard failed because the generated guard contained an invalid JavaScript regex: /resolveRequestWorkspaceId(req/.
- Stage124D V2 fixes only the guard/test assertion style. API route logic is not changed by this V2 patch.

TESTS:
- npm run check:stage124d-task-event-routes
- node --test tests/stage124d-task-event-routes.test.cjs
- npm run check:stage124-supabase-egress-contract
- npm run build`);
appendOnce('_project/14_TEST_HISTORY.md', 'STAGE124D_V2_GUARD_FIX', `## 2026-05-19 - STAGE124D_V2_GUARD_FIX

Expected tests after local apply:
- npm run check:stage124d-task-event-routes
- node --test tests/stage124d-task-event-routes.test.cjs
- npm run check:stage124-supabase-egress-contract
- npm run build`);
appendOnce('_project/08_CHANGELOG_AI.md', 'STAGE124D_V2_GUARD_FIX', `## 2026-05-19 - STAGE124D_V2_GUARD_FIX

- Fixed Stage124D guard syntax by replacing fragile regex assertions with string token assertions.
- No API route behavior change.`);

const runReport = `# Stage124D V2 - guard fix for restored task/event routes

Date: 2026-05-19
Branch: dev-rollout-freeze
Mode: ZIP/local-only, manual commit/push after review

## Reason

Stage124D created api/tasks.ts and api/events.ts, Stage124A guard stayed green, node test passed, and build passed. The Stage124D guard failed before assertions due to an invalid JavaScript regex in scripts/check-stage124d-task-event-routes.cjs.

## Change

- Replace fragile regex assertion with token includes checks in Stage124D guard.
- Refresh Stage124D node test to use token assertions.
- Do not change api/tasks.ts or api/events.ts behavior.

## Required tests

- npm run check:stage124d-task-event-routes
- node --test tests/stage124d-task-event-routes.test.cjs
- npm run check:stage124-supabase-egress-contract
- npm run build
`;
if (writeIfChanged('_project/runs/2026-05-19_stage124d_v2_restore_tasks_events_guard_fix.md', runReport)) changed.push('_project/runs/2026-05-19_stage124d_v2_restore_tasks_events_guard_fix.md');

console.log('Stage124D V2 changed files:');
for (const file of changed) console.log('- ' + file);
console.log('Backup root: ' + backupRoot);
