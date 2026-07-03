const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')
const root = process.cwd(); const rel = (p)=>path.join(root,p); const exists=(p)=>fs.existsSync(rel(p)); const read=(p)=>fs.readFileSync(rel(p),'utf8')
const fail=(m)=>{console.error('[004N] FAIL '+m);process.exit(1)}; const must=(t,m,l)=>{if(!t.includes(m))fail(l+' missing '+m)}
const adapterRel='src/lib/source-of-truth/tasks-status-date-readonly-runtime.ts', reportRel='_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md', decisionRel='_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md'
for (const f of [adapterRel,reportRel,decisionRel,'package.json']) if(!exists(f)) fail('missing '+f)
const adapter=read(adapterRel), report=read(reportRel), decision=read(decisionRel), pkg=read('package.json')
for (const m of ['LF-PROD-SOT-004N','TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT','READONLY_METADATA_IMPORT_ONLY','SMOKE_DEFERRED_DEBT_FROM_004M','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','FORBIDDEN']) must(adapter,m,adapterRel)
for (const m of ['TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT','LOCAL_RERUN_PASS_AFTER_R2']) must(report,m,reportRel)
for (const m of ['OWNER_DECISION_RECORDED','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','NEXT_READONLY_NO_DRIFT_STAGE_ALLOWED']) must(decision,m,decisionRel)
must(pkg,'verify:lf-prod-sot-004n-tasks-status-date-readonly-runtime-import','package.json')
const optionalFiles = ['_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md','_project/runs/LF-PROD-SOT-004P_LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md','_project/runs/LF-PROD-SOT-004Q_READONLY_REWIRE_CLOSURE_GATE_AND_SMOKE_DEBT_LEDGER.md']
for (const f of optionalFiles.filter(exists)) must(read(f), 'NO_OUTPUT_DRIFT', f)
let changed=[]; try { changed=childProcess.execSync('git diff --name-only HEAD',{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean) } catch(_){}
const allowed=new Set(['package.json',adapterRel,reportRel,decisionRel,'scripts/guards/verify-lf-prod-sot-004m-today-runtime-import-smoke-and-decision.cjs','scripts/guards/verify-lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.cjs','scripts/guards/verify-lf-prod-sot-004o-calendar-status-date-readonly-runtime-import.cjs','scripts/guards/verify-lf-prod-sot-004p-list-cards-status-date-readonly-runtime-import.cjs','scripts/guards/verify-lf-prod-sot-004q-readonly-rewire-closure-gate.cjs','tests/lf-prod-sot-004q-readonly-rewire-closure-gate.test.cjs','src/lib/source-of-truth/readonly-rewire-closure-gate.ts','_project/runs/LF-PROD-SOT-004Q_READONLY_REWIRE_CLOSURE_GATE_AND_SMOKE_DEBT_LEDGER.md'])
for (const f of changed) if(!allowed.has(f)) fail('unexpected changed file '+f)
console.log('[004N] PASS')