const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full.replace(/\\/g, '/'));
  }
  return out;
}
const apiFiles = walk('api').filter((file) => /\\.(ts|js|mjs|cjs)$/.test(file)).filter((file) => !file.endsWith('.d.ts'));
assert.ok(!fs.existsSync('api/tasks.ts'), 'api/tasks.ts must not be a standalone Vercel function');
assert.ok(!fs.existsSync('api/events.ts'), 'api/events.ts must not be a standalone Vercel function');
assert.ok(apiFiles.length <= 12, 'Vercel Hobby allows max 12 serverless functions. Current api files: ' + apiFiles.join(', '));
const system = fs.readFileSync('api/system.ts', 'utf8');
assert.ok(system.includes('STAGE124F_VERCEL_HOBBY_TASK_EVENT_CONSOLIDATION'), 'api/system.ts must include Stage124F route marker');
assert.ok(system.includes('task-route-stage124f'), 'api/system.ts must import task route handler');
assert.ok(system.includes('event-route-stage124f'), 'api/system.ts must import event route handler');
assert.ok(system.includes("apiRoute === 'tasks'"), 'api/system.ts must route apiRoute=tasks');
assert.ok(system.includes("apiRoute === 'events'"), 'api/system.ts must route apiRoute=events');
const fallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');
assert.ok(fallback.includes('/api/system?apiRoute=tasks'), 'frontend task fetch must use api/system router');
assert.ok(fallback.includes('/api/system?apiRoute=events'), 'frontend event fetch must use api/system router');
assert.ok(!fallback.includes("'/api/tasks' + buildTaskEventRangeQueryStage124E"), 'frontend must not call /api/tasks directly');
assert.ok(!fallback.includes("'/api/events' + buildTaskEventRangeQueryStage124E"), 'frontend must not call /api/events directly');
for (const file of ['src/server/task-route-stage124f.ts', 'src/server/event-route-stage124f.ts']) {
  assert.ok(fs.existsSync(file), file + ' must exist');
  const text = fs.readFileSync(file, 'utf8');
  assert.doesNotMatch(text, /select\\s*=\\s*\\*/i, file + ' must not use select=*');
  assert.ok(text.includes('LIST_SELECT_STAGE124D'), file + ' must keep light ListDTO select');
  assert.ok(text.includes('addDateRange('), file + ' must keep range filtering');
}
console.log('✔ Stage124F Vercel API function consolidation contract holds');
