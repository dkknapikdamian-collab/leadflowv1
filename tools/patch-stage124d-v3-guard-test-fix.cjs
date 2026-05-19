const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const changed = [];

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, content) {
  const full = path.join(repo, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  const before = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
  if (before !== content) {
    fs.writeFileSync(full, content, 'utf8');
    changed.push(rel);
  }
}

for (const rel of ['api/tasks.ts', 'api/events.ts']) {
  if (!fs.existsSync(path.join(repo, rel))) {
    throw new Error(`Stage124D V3 requires ${rel} from Stage124D/V2. Re-run Stage124D first; do not patch blindly.`);
  }
}

const guard = `const fs = require('fs');
const assert = require('node:assert/strict');

const ROUTES = ['api/tasks.ts', 'api/events.ts'];

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function assertNoSelectStar(text, file) {
  assert.doesNotMatch(text, /select\\\\s*=\\\\s*\\\\*/i, file + ' must not contain select=*');
  assert.doesNotMatch(text, /work_items\\\\?select=\\\\*/i, file + ' must not query work_items with select=*');
}

for (const file of ROUTES) {
  assert.ok(fs.existsSync(file), file + ' must exist');
  const text = read(file);

  assertNoSelectStar(text, file);
  assert.match(text, /STAGE124D_SUPABASE_EGRESS_LIGHT_(TASK|EVENT)_ROUTE/, file + ' must carry Stage124D route marker');
  assert.ok(text.includes('resolveRequestWorkspaceId(req'), file + ' must resolve workspace from request context');
  assert.ok(text.includes('withWorkspaceFilter('), file + ' must scope reads by workspace');
  assert.ok(text.includes('updateByIdScoped('), file + ' must scope updates by workspace');
  assert.ok(text.includes('deleteByIdScoped('), file + ' must scope deletes by workspace');
  assert.ok(text.includes('capLimit('), file + ' must cap list limit');
  assert.ok(text.includes('&limit=') || text.includes('limit='), file + ' must include a list limit in queries');
  assert.ok(text.includes('addDateRange('), file + ' must support date range filtering');
  assert.ok(/LIST_SELECT_STAGE124D/.test(text), file + ' must use an explicit Stage124D list select constant');
  assert.ok(text.includes('select=') && text.includes('LIST_SELECT_STAGE124D'), file + ' must build select from explicit list constant');
}

console.log('✔ Stage124D lightweight task/event route contract holds');
`;

const test = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('Stage124D restores lightweight task/event API routes', () => {
  const files = ['api/tasks.ts', 'api/events.ts'];
  for (const file of files) {
    assert.ok(fs.existsSync(file), file + ' should exist');
    const text = fs.readFileSync(file, 'utf8');

    assert.doesNotMatch(text, /select\\\\s*=\\\\s*\\\\*/i, file + ' should not use select=*');
    assert.doesNotMatch(text, /work_items\\\\?select=\\\\*/i, file + ' should not query work_items with select=*');

    assert.match(text, /LIST_SELECT_STAGE124D/, file + ' should define explicit ListDTO select columns');
    assert.match(text, /resolveRequestWorkspaceId\\(req/, file + ' should resolve workspace from request context');
    assert.match(text, /withWorkspaceFilter\\(/, file + ' should apply workspace filter');
    assert.match(text, /updateByIdScoped\\(/, file + ' should scope updates');
    assert.match(text, /deleteByIdScoped\\(/, file + ' should scope deletes');
    assert.match(text, /capLimit\\(/, file + ' should cap response size');
    assert.match(text, /addDateRange\\(/, file + ' should support range reads for calendar/tasks');
  }

  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.equal(
    packageJson.scripts['check:stage124d-task-event-routes'],
    'node scripts/check-stage124d-task-event-routes.cjs',
    'package.json should expose the Stage124D guard',
  );
});
`;

write('scripts/check-stage124d-task-event-routes.cjs', guard);
write('tests/stage124d-task-event-routes.test.cjs', test);

const packagePath = path.join(repo, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
pkg.scripts = pkg.scripts || {};
if (pkg.scripts['check:stage124d-task-event-routes'] !== 'node scripts/check-stage124d-task-event-routes.cjs') {
  pkg.scripts['check:stage124d-task-event-routes'] = 'node scripts/check-stage124d-task-event-routes.cjs';
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  changed.push('package.json');
}

const report = `# Stage124D V3 - restore tasks/events guard/test fix

Date: 2026-05-19

## Status
LOCAL PATCH APPLIED, COMMIT AFTER GREEN GUARDS ONLY.

## Purpose
Fix Stage124D guard/test false positives without changing the task/event route logic.

## What V3 changes
- Rewrites \`scripts/check-stage124d-task-event-routes.cjs\`.
- Rewrites \`tests/stage124d-task-event-routes.test.cjs\`.
- Ensures \`package.json\` exposes \`check:stage124d-task-event-routes\`.
- Does not modify \`api/tasks.ts\` or \`api/events.ts\`.

## Why
Stage124D V2 route logic built successfully, but the guard/test still had faulty regex checks:
- invalid regex around limit,
- false positive where \`/select=*/i\` matched ordinary \`select=\` strings.

## Required checks
- \`npm run check:stage124d-task-event-routes\`
- \`node --test tests/stage124d-task-event-routes.test.cjs\`
- \`npm run check:stage124-supabase-egress-contract\`
- \`npm run build\`

## Commit policy
Do not use \`git add .\`.
Only commit explicit Stage124D files after all checks are green.
`;

write('_project/runs/2026-05-19_stage124d_v3_restore_tasks_events_guard_test_fix.md', report);

console.log('Stage124D V3 changed files:');
for (const rel of changed) console.log('- ' + rel);
if (changed.length === 0) console.log('- none');
