const test = require('node:test'); const assert = require('node:assert/strict'); const fs = require('node:fs'); const path = require('node:path');
const root = process.cwd(); const r = p => path.join(root,p); const read = p => fs.readFileSync(r(p),'utf8'); const exists = p => fs.existsSync(r(p));
test('004N static no-drift contract', () => {
  for (const f of ['src/lib/source-of-truth/tasks-status-date-readonly-runtime.ts','_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md','_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md']) assert.equal(exists(f), true, f);
  const a = read('src/lib/source-of-truth/tasks-status-date-readonly-runtime.ts'); const rep = read('_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md');
  for (const m of ['LF-PROD-SOT-004N','TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT','READONLY_METADATA_IMPORT_ONLY','SMOKE_DEFERRED_DEBT_FROM_004M','DEFERRED_BY_OWNER_NOT_PASS','FORBIDDEN']) assert.match(a, new RegExp(m));
  for (const m of ['TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','NO_OUTPUT_DRIFT','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE']) assert.match(rep, new RegExp(m));
  const hosts = ['src/lib/work-items/normalize.ts','src/pages/Tasks.tsx','src/pages/TasksStable.tsx'].filter(f => exists(f) && read(f).includes('tasksStatusDateReadonlyRuntimeReport'));
  assert.ok(hosts.length >= 1 && hosts.length <= 2); for (const h of hosts) assert.match(read(h), /void tasksStatusDateReadonlyRuntimeReport/);
});
test('004N did not create 004O', () => assert.equal(fs.readdirSync(r('_project/runs')).some(n => n.includes('LF-PROD-SOT-004O')), false));