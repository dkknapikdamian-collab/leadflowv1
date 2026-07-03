const fs = require('node:fs'); const path = require('node:path');
const root = process.cwd(); const r = p => path.join(root,p); const read = p => fs.readFileSync(r(p),'utf8'); const exists = p => fs.existsSync(r(p));
const fail = m => { console.error('[004N] FAIL ' + m); process.exit(1); };
const files = ['src/lib/source-of-truth/tasks-status-date-readonly-runtime.ts','_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md','scripts/guards/verify-lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.cjs','tests/lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.test.cjs','_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md'];
for (const f of files) if (!exists(f)) fail('missing ' + f);
const adapter = read(files[0]), report = read(files[1]), pkg = read('package.json'), decision = read(files[4]);
for (const m of ['LF-PROD-SOT-004N','TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT','LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED','READONLY_METADATA_IMPORT_ONLY','SMOKE_DEFERRED_DEBT_FROM_004M','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','DEFERRED_BY_OWNER_NOT_PASS','FORBIDDEN','REQUIRED']) if (!adapter.includes(m)) fail('adapter missing ' + m);
for (const m of ['TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT','SMOKE_DEFERRED_DEBT_FROM_004M','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE']) if (!report.includes(m)) fail('report missing ' + m);
for (const m of ['OWNER_DECISION_RECORDED','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE']) if (!decision.includes(m)) fail('decision missing ' + m);
if (!pkg.includes('verify:lf-prod-sot-004n-tasks-status-date-readonly-runtime-import')) fail('package alias missing');
const hostFiles = ['src/lib/work-items/normalize.ts','src/pages/Tasks.tsx','src/pages/TasksStable.tsx'];
const hosts = hostFiles.filter(f => exists(f) && read(f).includes('tasksStatusDateReadonlyRuntimeReport'));
if (hosts.length < 1 || hosts.length > 2) fail('bad host count ' + hosts.length);
for (const h of hosts) { const t = read(h); if (!t.includes('tasks-status-date-readonly-runtime')) fail('host import missing ' + h); if (!t.includes('void tasksStatusDateReadonlyRuntimeReport')) fail('host void missing ' + h); }
if (fs.readdirSync(r('_project/runs')).some(n => n.includes('LF-PROD-SOT-004O'))) fail('004O exists');
for (const f of files.concat(hosts)) if (/[ďż˝\u0000]|Ă|Ă‚|Ă˘â‚¬/.test(read(f))) fail('mojibake ' + f);
console.log('[004N] PASS');