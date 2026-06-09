const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
function must(condition, message) {
  if (!condition) throw new Error(message);
}
function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

const sql = read('supabase/sql/2026-06-09_stage228r46_work_items_deleted_status_constraint.sql');
must(sql.includes('work_items_status_domain_check'), 'SQL missing work_items_status_domain_check');
must(sql.includes("'deleted'"), 'SQL missing deleted status');
must(sql.includes('ALTER TABLE public.work_items'), 'SQL missing work_items ALTER TABLE');

const statuses = read('src/lib/domain-statuses.ts');
must(statuses.includes("'deleted'"), 'domain-statuses.ts missing deleted status');
must(statuses.includes('TASK_STATUS_VALUES'), 'domain-statuses.ts missing TASK_STATUS_VALUES');
must(statuses.includes('EVENT_STATUS_VALUES'), 'domain-statuses.ts missing EVENT_STATUS_VALUES');

console.log('STAGE228R47_SQL_DELETED_STATUS_CONSTRAINT PASS');
