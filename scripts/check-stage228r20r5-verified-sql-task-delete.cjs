const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

const api = read('api/system.ts');
const fallback = read('src/lib/supabase-fallback.ts');
const route = read('src/server/task-route-stage124f.ts');
const pkg = read('package.json');

const checks = [
  ['api/system routeKind accepts apiRoute', api.includes('apiRoute ?? body.kind') || api.includes('apiRoute ?? body.kind') || api.includes('req?.query?.apiRoute')],
  ['fallback exports async hardDeleteTaskFromSupabase', fallback.includes('export async function hardDeleteTaskFromSupabase')],
  ['fallback keeps R18R5-compatible delete URL', fallback.includes("'/api/system?apiRoute=tasks&id=' + encodeURIComponent(id), 'DELETE'")],
  ['task route has R20R5 verified delete marker', route.includes('STAGE228R20R5_VERIFIED_SQL_TASK_DELETE')],
  ['task route fails false delete success', route.includes('TASK_DELETE_VERIFY_FAILED')],
  ['task route exposes workspace mismatch', route.includes('TASK_DELETE_WORKSPACE_MISMATCH')],
  ['task route supports idempotent missing delete', route.includes('alreadyMissing: true')],
  ['package prebuild has R20R5 guard', pkg.includes('check-stage228r20r5-verified-sql-task-delete.cjs')],
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) {
  console.error('STAGE228R20R5_VERIFIED_SQL_TASK_DELETE_FAIL: ' + failed.join('; '));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R20R5_VERIFIED_SQL_TASK_DELETE',
  contract: 'Task delete uses apiRoute routing and verifies SQL row is gone after DELETE.'
}, null, 2));
