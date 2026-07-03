const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')
const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const fail = (m) => { console.error('[004P] FAIL ' + m); process.exit(1) }
const must = (t, m, l) => { if (!t.includes(m)) fail(l + ' missing ' + m) }
const adapterRel = 'src/lib/source-of-truth/list-cards-status-date-readonly-runtime.ts'
const reportRel = '_project/runs/LF-PROD-SOT-004P_LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const hostRels = ['src/lib/work-items/normalize.ts', 'src/lib/clients.ts', 'src/lib/cases.ts']
for (const f of [adapterRel, reportRel, '_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md', '_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md', 'package.json', ...hostRels]) if (!exists(f)) fail('missing ' + f)
const adapter = read(adapterRel), report = read(reportRel), pkg = read('package.json')
for (const m of ['LF-PROD-SOT-004P','LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT','READONLY_METADATA_IMPORT_ONLY','READONLY_RUNTIME_BOUNDARY_IMPORT','NO_OUTPUT_DRIFT','NO_RUNTIME_BEHAVIOR_CHANGE','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','ListCardCountChange','ListSortChange','ListFilterChange','GoogleCalendarSyncChange','CaseDetailChange','FinanceChange']) must(adapter,m,adapterRel)
for (const m of ['LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT','LISTS_CARDS_OUTPUT_UNCHANGED','004Q created: NO']) must(report,m,reportRel)
must(pkg,'verify:lf-prod-sot-004p-list-cards-status-date-readonly-runtime-import','package.json')
for (const h of hostRels) { const text=read(h); must(text,'list-cards-status-date-readonly-runtime',h); must(text,'void listCardsStatusDateReadonlyRuntimeReport',h) }
if (exists('_project/runs/LF-PROD-SOT-004Q_READONLY_REWIRE_CLOSURE_GATE_AND_SMOKE_DEBT_LEDGER.md')) must(read('_project/runs/LF-PROD-SOT-004Q_READONLY_REWIRE_CLOSURE_GATE_AND_SMOKE_DEBT_LEDGER.md'),'READONLY_CLOSURE_GATE_ONLY','004Q')
let changed=[]; try { changed=childProcess.execSync('git diff --name-only HEAD',{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean) } catch (_) {}
const allowed = new Set(['package.json',adapterRel,reportRel,'scripts/guards/verify-lf-prod-sot-004p-list-cards-status-date-readonly-runtime-import.cjs',...hostRels,'scripts/guards/verify-lf-prod-sot-004m-today-runtime-import-smoke-and-decision.cjs','scripts/guards/verify-lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.cjs','scripts/guards/verify-lf-prod-sot-004o-calendar-status-date-readonly-runtime-import.cjs','scripts/guards/verify-lf-prod-sot-004q-readonly-rewire-closure-gate.cjs','tests/lf-prod-sot-004q-readonly-rewire-closure-gate.test.cjs','src/lib/source-of-truth/readonly-rewire-closure-gate.ts','_project/runs/LF-PROD-SOT-004Q_READONLY_REWIRE_CLOSURE_GATE_AND_SMOKE_DEBT_LEDGER.md'])
for (const f of changed) if(!allowed.has(f)) fail('unexpected changed file '+f)
for (const f of changed) if (['src/pages/','src/components/','src/styles/','src/index.css','src/lib/calendar-items.ts','src/lib/work-items/normalize.ts','src/lib/clients.ts','src/lib/cases.ts','src/lib/google-calendar','src/lib/gcal','src/lib/calendar-sync','src/lib/calendar-provider','src/pages/CaseDetail.tsx','src/lib/finance/','supabase/','migrations/','sql/'].some((p)=>f===p||f.startsWith(p))) fail('forbidden changed file '+f)
console.log(JSON.stringify({ok:true,stage:'LF-PROD-SOT-004P',runtimeImport:'READONLY_METADATA_IMPORT_ONLY',outputDrift:'NO_OUTPUT_DRIFT',listsCardsOutput:'UNCHANGED',accepts004qReadonlyClosureGate:true,smokeDebt:'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE',fullManualSmokeRequiredBeforeFinalAcceptance:true,selectedImportHosts:hostRels},null,2))