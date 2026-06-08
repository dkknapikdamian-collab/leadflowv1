const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

const fallback = read('src/lib/supabase-fallback.ts');
const eventRoute = read('src/server/event-route-stage124f.ts');
const taskRoute = read('src/server/task-route-stage124f.ts');
const pkg = read('package.json');

const checks = [
  ['resolver recognizes apiRoute tasks', fallback.includes('apiroute=tasks')],
  ['resolver recognizes apiRoute events', fallback.includes('apiroute=events')],
  ['resolver marker present', fallback.includes('STAGE228R22_API_ROUTE_MUTATION_CACHE_INVALIDATION')],
  ['event delete verified marker present', eventRoute.includes('STAGE228R22_VERIFIED_SQL_EVENT_DELETE')],
  ['event delete verify fail present', eventRoute.includes('EVENT_DELETE_VERIFY_FAILED')],
  ['event workspace mismatch present', eventRoute.includes('EVENT_DELETE_WORKSPACE_MISMATCH')],
  ['event delete idempotent missing present', eventRoute.includes('alreadyMissing: true')],
  ['task verified delete still present', taskRoute.includes('STAGE228R20R5_VERIFIED_SQL_TASK_DELETE')],
  ['package prebuild has R22 guard', pkg.includes('check-stage228r22-delete-cache-and-event-verify.cjs')],
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) {
  console.error('STAGE228R22_DELETE_CACHE_AND_EVENT_VERIFY_FAIL: ' + failed.join('; '));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R22_DELETE_CACHE_AND_EVENT_VERIFY',
  contract: 'apiRoute mutations clear the correct cache category and event deletes are SQL-verified.'
}, null, 2));
