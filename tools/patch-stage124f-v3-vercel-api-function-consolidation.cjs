const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');
const { execSync } = require('node:child_process');

function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
}
function rm(file) { if (fs.existsSync(file)) fs.rmSync(file, { force: true }); }
function fromHead(file) {
  return execSync(`git show HEAD:${file}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}
function readOrHead(file) {
  if (fs.existsSync(file)) return read(file);
  return fromHead(file);
}
function ensurePackageScript(name, command) {
  const pkgPath = 'package.json';
  const pkg = JSON.parse(read(pkgPath));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts[name] = command;
  write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}
function convertApiRouteToServerRoute(text, routeName, exportName) {
  let next = text;
  next = next.replace(
    /import \{([^}]+)\} from '\.\.\/src\/server\/_supabase\.js';/,
    "import {$1} from './_supabase.js';",
  );
  next = next.replace(
    /import \{([^}]+)\} from '\.\.\/src\/server\/_request-scope\.js';/,
    "import {$1} from './_request-scope.js';",
  );
  next = next.replace(
    /import \{([^}]+)\} from '\.\.\/src\/lib\/data-contract\.js';/,
    "import {$1} from '../lib/data-contract.js';",
  );
  next = next.replace(/export default async function handler\(/, `export default async function ${exportName}(`);
  if (!next.includes(`STAGE124F_VERCEL_HOBBY_CONSOLIDATED_${routeName}_ROUTE`)) {
    next = `// STAGE124F_VERCEL_HOBBY_CONSOLIDATED_${routeName}_ROUTE\n` + next;
  }
  assert.ok(next.includes('LIST_SELECT_STAGE124D'), `${routeName} server route must keep ListDTO select`);
  assert.ok(next.includes('addDateRange('), `${routeName} server route must keep range filtering`);
  assert.ok(next.includes(`export default async function ${exportName}(`), `${routeName} server route export conversion failed`);
  return next;
}

const taskRoute = convertApiRouteToServerRoute(readOrHead('api/tasks.ts'), 'TASK', 'taskRouteStage124FHandler');
const eventRoute = convertApiRouteToServerRoute(readOrHead('api/events.ts'), 'EVENT', 'eventRouteStage124FHandler');

write('src/server/task-route-stage124f.ts', taskRoute);
write('src/server/event-route-stage124f.ts', eventRoute);

rm('api/tasks.ts');
rm('api/events.ts');
rm('tools/patch-stage124f-vercel-api-function-consolidation.cjs');
rm('tools/patch-stage124f-v2-vercel-api-function-consolidation.cjs');

let system = read('api/system.ts');
if (!system.includes("task-route-stage124f")) {
  const importAnchor = "import googleCalendarHandler from '../src/server/google-calendar-handler.js';";
  assert.ok(system.includes(importAnchor), 'api/system.ts import anchor missing');
  system = system.replace(
    importAnchor,
    importAnchor + "\nimport taskRouteStage124FHandler from '../src/server/task-route-stage124f.js';\nimport eventRouteStage124FHandler from '../src/server/event-route-stage124f.js';",
  );
}

const routeBlock = `
    // STAGE124F_VERCEL_HOBBY_TASK_EVENT_CONSOLIDATION
    // Keep task/event routes behind api/system so Vercel Hobby does not deploy separate serverless functions.
    if (apiRoute === 'tasks') {
      await taskRouteStage124FHandler(req, res);
      return;
    }
    if (apiRoute === 'events') {
      await eventRouteStage124FHandler(req, res);
      return;
    }

`;
if (!system.includes('STAGE124F_VERCEL_HOBBY_TASK_EVENT_CONSOLIDATION')) {
  const googleAnchor = "if (kind === 'google-calendar') {";
  assert.ok(system.includes(googleAnchor), 'api/system.ts google-calendar route anchor missing');
  system = system.replace(googleAnchor, routeBlock + '  ' + googleAnchor);
}
write('api/system.ts', system);

let fallback = read('src/lib/supabase-fallback.ts');
fallback = fallback.replaceAll(
  "'/api/tasks' + buildTaskEventRangeQueryStage124E(params)",
  "'/api/system?apiRoute=tasks' + buildTaskEventRangeQueryStage124E(params).replace('?', '&')",
);
fallback = fallback.replaceAll(
  "'/api/events' + buildTaskEventRangeQueryStage124E(params)",
  "'/api/system?apiRoute=events' + buildTaskEventRangeQueryStage124E(params).replace('?', '&')",
);
assert.ok(fallback.includes("/api/system?apiRoute=tasks"), 'task fetch must route through api/system');
assert.ok(fallback.includes("/api/system?apiRoute=events"), 'event fetch must route through api/system');
write('src/lib/supabase-fallback.ts', fallback);

const stage124DGuard = `const fs = require('fs');\nconst assert = require('node:assert/strict');\n\nconst ROUTES = [\n  ['src/server/task-route-stage124f.ts', 'TASK'],\n  ['src/server/event-route-stage124f.ts', 'EVENT'],\n];\n\nfunction read(file) {\n  return fs.readFileSync(file, 'utf8');\n}\nfunction assertNoSelectStar(text, file) {\n  assert.doesNotMatch(text, /select\\\\s*=\\\\s*\\\\*/i, file + ' must not contain select=*');\n  assert.doesNotMatch(text, /work_items\\\\?select=\\\\*/i, file + ' must not query work_items with select=*');\n}\n\nassert.ok(!fs.existsSync('api/tasks.ts'), 'api/tasks.ts must stay consolidated into api/system');\nassert.ok(!fs.existsSync('api/events.ts'), 'api/events.ts must stay consolidated into api/system');\n\nfor (const [file, kind] of ROUTES) {\n  assert.ok(fs.existsSync(file), file + ' must exist');\n  const text = read(file);\n  assertNoSelectStar(text, file);\n  assert.match(text, new RegExp('STAGE124D_SUPABASE_EGRESS_LIGHT_' + kind + '_ROUTE'), file + ' must carry Stage124D route marker');\n  assert.ok(text.includes('resolveRequestWorkspaceId(req'), file + ' must resolve workspace from request context');\n  assert.ok(text.includes('withWorkspaceFilter('), file + ' must scope reads by workspace');\n  assert.ok(text.includes('updateByIdScoped('), file + ' must scope updates by workspace');\n  assert.ok(text.includes('deleteByIdScoped('), file + ' must scope deletes by workspace');\n  assert.ok(text.includes('capLimit('), file + ' must cap list limit');\n  assert.ok(text.includes('&limit=') || text.includes('limit='), file + ' must include a list limit in queries');\n  assert.ok(text.includes('addDateRange('), file + ' must support date range filtering');\n  assert.ok(/LIST_SELECT_STAGE124D/.test(text), file + ' must use an explicit Stage124D list select constant');\n  assert.ok(text.includes('select=') && text.includes('LIST_SELECT_STAGE124D'), file + ' must build select from explicit list constant');\n}\n\nconst system = read('api/system.ts');\nassert.ok(system.includes('STAGE124F_VERCEL_HOBBY_TASK_EVENT_CONSOLIDATION'), 'api/system.ts must route consolidated task/event handlers');\nconsole.log('✔ Stage124D lightweight task/event route contract holds under Stage124F consolidation');\n`;
write('scripts/check-stage124d-task-event-routes.cjs', stage124DGuard);

const stage124DTest = `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst fs = require('fs');\n\ntest('Stage124D lightweight task/event API routes are preserved under Stage124F consolidation', () => {\n  assert.ok(!fs.existsSync('api/tasks.ts'), 'api/tasks.ts should not exist as a standalone Vercel function');\n  assert.ok(!fs.existsSync('api/events.ts'), 'api/events.ts should not exist as a standalone Vercel function');\n\n  const files = ['src/server/task-route-stage124f.ts', 'src/server/event-route-stage124f.ts'];\n  for (const file of files) {\n    assert.ok(fs.existsSync(file), file + ' should exist');\n    const text = fs.readFileSync(file, 'utf8');\n    assert.doesNotMatch(text, /select\\\\s*=\\\\s*\\\\*/i, file + ' should not use select=*');\n    assert.doesNotMatch(text, /work_items\\\\?select=\\\\*/i, file + ' should not query work_items with select=*');\n    assert.match(text, /LIST_SELECT_STAGE124D/, file + ' should define explicit ListDTO select columns');\n    assert.match(text, /resolveRequestWorkspaceId\\(req/, file + ' should resolve workspace from request context');\n    assert.match(text, /withWorkspaceFilter\\(/, file + ' should apply workspace filter');\n    assert.match(text, /updateByIdScoped\\(/, file + ' should scope updates');\n    assert.match(text, /deleteByIdScoped\\(/, file + ' should scope deletes');\n    assert.match(text, /capLimit\\(/, file + ' should cap response size');\n    assert.match(text, /addDateRange\\(/, file + ' should support range reads for calendar/tasks');\n  }\n});\n`;
write('tests/stage124d-task-event-routes.test.cjs', stage124DTest);

const stage124FGuard = `const fs = require('fs');\nconst path = require('path');\nconst assert = require('node:assert/strict');\nfunction walk(dir, out = []) {\n  if (!fs.existsSync(dir)) return out;\n  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {\n    const full = path.join(dir, entry.name);\n    if (entry.isDirectory()) walk(full, out);\n    else out.push(full.replace(/\\\\/g, '/'));\n  }\n  return out;\n}\nconst apiFiles = walk('api').filter((file) => /\\\\.(ts|js|mjs|cjs)$/.test(file)).filter((file) => !file.endsWith('.d.ts'));\nassert.ok(!fs.existsSync('api/tasks.ts'), 'api/tasks.ts must not be a standalone Vercel function');\nassert.ok(!fs.existsSync('api/events.ts'), 'api/events.ts must not be a standalone Vercel function');\nassert.ok(apiFiles.length <= 12, 'Vercel Hobby allows max 12 serverless functions. Current api files: ' + apiFiles.join(', '));\nconst system = fs.readFileSync('api/system.ts', 'utf8');\nassert.ok(system.includes('STAGE124F_VERCEL_HOBBY_TASK_EVENT_CONSOLIDATION'), 'api/system.ts must include Stage124F route marker');\nassert.ok(system.includes('task-route-stage124f'), 'api/system.ts must import task route handler');\nassert.ok(system.includes('event-route-stage124f'), 'api/system.ts must import event route handler');\nassert.ok(system.includes(\"apiRoute === 'tasks'\"), 'api/system.ts must route apiRoute=tasks');\nassert.ok(system.includes(\"apiRoute === 'events'\"), 'api/system.ts must route apiRoute=events');\nconst fallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');\nassert.ok(fallback.includes('/api/system?apiRoute=tasks'), 'frontend task fetch must use api/system router');\nassert.ok(fallback.includes('/api/system?apiRoute=events'), 'frontend event fetch must use api/system router');\nassert.ok(!fallback.includes(\"'/api/tasks' + buildTaskEventRangeQueryStage124E\"), 'frontend must not call /api/tasks directly');\nassert.ok(!fallback.includes(\"'/api/events' + buildTaskEventRangeQueryStage124E\"), 'frontend must not call /api/events directly');\nfor (const file of ['src/server/task-route-stage124f.ts', 'src/server/event-route-stage124f.ts']) {\n  assert.ok(fs.existsSync(file), file + ' must exist');\n  const text = fs.readFileSync(file, 'utf8');\n  assert.doesNotMatch(text, /select\\\\s*=\\\\s*\\\\*/i, file + ' must not use select=*');\n  assert.ok(text.includes('LIST_SELECT_STAGE124D'), file + ' must keep light ListDTO select');\n  assert.ok(text.includes('addDateRange('), file + ' must keep range filtering');\n}\nconsole.log('✔ Stage124F Vercel API function consolidation contract holds');\n`;
write('scripts/check-stage124f-vercel-api-function-consolidation.cjs', stage124FGuard);

const stage124FTest = `const test = require('node:test');\nconst assert = require('node:assert/strict');\nconst fs = require('fs');\nconst path = require('path');\nfunction walk(dir, out = []) {\n  if (!fs.existsSync(dir)) return out;\n  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {\n    const full = path.join(dir, entry.name);\n    if (entry.isDirectory()) walk(full, out);\n    else out.push(full.replace(/\\\\/g, '/'));\n  }\n  return out;\n}\ntest('Stage124F consolidates task/event API functions behind api/system', () => {\n  const apiFiles = walk('api').filter((file) => /\\\\.(ts|js|mjs|cjs)$/.test(file)).filter((file) => !file.endsWith('.d.ts'));\n  assert.ok(apiFiles.length <= 12, 'api function file count should stay within Hobby limit');\n  assert.ok(!apiFiles.includes('api/tasks.ts'), 'tasks should not be a standalone function');\n  assert.ok(!apiFiles.includes('api/events.ts'), 'events should not be a standalone function');\n  const system = fs.readFileSync('api/system.ts', 'utf8');\n  assert.match(system, /STAGE124F_VERCEL_HOBBY_TASK_EVENT_CONSOLIDATION/);\n  assert.match(system, /apiRoute === 'tasks'/);\n  assert.match(system, /apiRoute === 'events'/);\n  const fallback = fs.readFileSync('src/lib/supabase-fallback.ts', 'utf8');\n  assert.match(fallback, /\\/api\\/system\\?apiRoute=tasks/);\n  assert.match(fallback, /\\/api\\/system\\?apiRoute=events/);\n});\n`;
write('tests/stage124f-vercel-api-function-consolidation.test.cjs', stage124FTest);

ensurePackageScript('check:stage124f-vercel-api-function-consolidation', 'node scripts/check-stage124f-vercel-api-function-consolidation.cjs');
ensurePackageScript('check:stage124d-task-event-routes', 'node scripts/check-stage124d-task-event-routes.cjs');

const runDoc = `# CloseFlow Stage124F V3 - Vercel API function consolidation\n\n## Status\nPrepared by local ZIP package. Commit only after guard, tests and build are green.\n\n## Facts\n- Supabase egress spike is PostgREST-heavy, so lightweight data routes remain required.\n- Vercel Hobby deployment failed because the app exceeded the 12 Serverless Functions limit.\n- Standalone api/tasks.ts and api/events.ts are removed as Vercel functions.\n- Task/event logic is kept in src/server/task-route-stage124f.ts and src/server/event-route-stage124f.ts.\n- api/system.ts routes apiRoute=tasks and apiRoute=events.\n- Frontend task/event reads use /api/system?apiRoute=tasks/events and preserve Stage124E from/to/limit query params.\n\n## Guards\n- npm run check:stage124f-vercel-api-function-consolidation\n- npm run check:stage124d-task-event-routes\n- npm run check:stage124e-calendar-range-params\n- npm run check:stage124-supabase-egress-contract\n- npm run build\n\n## Next step\nIf green, selectively commit only Stage124F V3 files. Do not use git add .\n`;
write('_project/runs/2026-05-19_stage124f_v3_vercel_api_function_consolidation.md', runDoc);

console.log('Stage124F V3 changed files prepared');
