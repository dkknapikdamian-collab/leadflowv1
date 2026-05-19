const fs = require('fs');
const assert = require('node:assert/strict');

const ROUTES = [
  ['src/server/task-route-stage124f.ts', 'TASK'],
  ['src/server/event-route-stage124f.ts', 'EVENT'],
];

function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function assertNoSelectStar(text, file) {
  assert.doesNotMatch(text, /select\\s*=\\s*\\*/i, file + ' must not contain select=*');
  assert.doesNotMatch(text, /work_items\\?select=\\*/i, file + ' must not query work_items with select=*');
}

assert.ok(!fs.existsSync('api/tasks.ts'), 'api/tasks.ts must stay consolidated into api/system');
assert.ok(!fs.existsSync('api/events.ts'), 'api/events.ts must stay consolidated into api/system');

for (const [file, kind] of ROUTES) {
  assert.ok(fs.existsSync(file), file + ' must exist');
  const text = read(file);
  assertNoSelectStar(text, file);
  assert.match(text, new RegExp('STAGE124D_SUPABASE_EGRESS_LIGHT_' + kind + '_ROUTE'), file + ' must carry Stage124D route marker');
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

const system = read('api/system.ts');
assert.ok(system.includes('STAGE124F_VERCEL_HOBBY_TASK_EVENT_CONSOLIDATION'), 'api/system.ts must route consolidated task/event handlers');
console.log('✔ Stage124D lightweight task/event route contract holds under Stage124F consolidation');
