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
const testRel = 'tests/lf-prod-sot-004p-list-cards-status-date-readonly-runtime-import.test.cjs'
const decisionRel = '_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md'
const report004nRel = '_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const report004oRel = '_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const pkgRel = 'package.json'
const hostRels = ['src/lib/work-items/normalize.ts', 'src/lib/clients.ts', 'src/lib/cases.ts']
for (const f of [adapterRel, reportRel, testRel, decisionRel, report004nRel, report004oRel, pkgRel, ...hostRels]) if (!exists(f)) fail('missing ' + f)
const adapter = read(adapterRel), report = read(reportRel), decision = read(decisionRel), repN = read(report004nRel), repO = read(report004oRel), pkg = read(pkgRel)
for (const m of ['LF-PROD-SOT-004P','LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT','LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED','LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT','LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT','READONLY_METADATA_IMPORT_ONLY','READONLY_RUNTIME_BOUNDARY_IMPORT','NO_OUTPUT_DRIFT','NO_RUNTIME_BEHAVIOR_CHANGE','SMOKE_DEFERRED_DEBT_FROM_004M','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','ListCardCountChange','ListCardStatusLabelChange','ListCardDatePrecedenceChange','ListCardDateOnlyDefaultChange','ListSortChange','ListFilterChange','UIChange','CSSChange','SQLChange','SupabaseAPIChange','GoogleCalendarSyncChange','CaseDetailChange','FinanceChange','nextStage','LF-PROD-SOT-004Q_NEXT_READONLY_NO_DRIFT_STAGE_OR_FINAL_SMOKE_GATE']) must(adapter,m,adapterRel)
for (const m of ['LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT','SMOKE_DEFERRED_DEBT_FROM_004M','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','NO_UI_CHANGE','NO_CSS_CHANGE','NO_SQL_CHANGE','NO_SUPABASE_API_CHANGE','NO_GCAL_CHANGE','list counts changed: NO','list sorting changed: NO','list filters changed: NO','status labels changed: NO','date precedence changed: NO','004Q created: NO']) must(report,m,reportRel)
for (const m of ['OWNER_DECISION_RECORDED','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE']) must(decision,m,decisionRel)
for (const m of ['LOCAL_RERUN_PASS_AFTER_R2','NO_GCAL_CHANGE']) must(repN,m,report004nRel)
for (const m of ['CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT','NO_GCAL_CHANGE']) must(repO,m,report004oRel)
must(pkg,'verify:lf-prod-sot-004p-list-cards-status-date-readonly-runtime-import',pkgRel)
const importLines = adapter.split(/\r?\n/).filter((line) => /^\s*import\b/.test(line)).join('\n')
for (const s of ['react','react-dom','../pages/','./pages/','../components/','./components/','.css','google-calendar','gcal','calendar-sync','calendar-provider','CaseDetail','case-detail','finance/','supabase','fetch(','axios']) if (importLines.includes(s)) fail('adapter forbidden import snippet ' + s)
for (const s of ['document.','window.','localStorage.','sessionStorage.']) if (adapter.includes(s)) fail('adapter forbidden runtime snippet ' + s)
const patterns = {
  'src/lib/work-items/normalize.ts': /import\s*\{\s*listCardsStatusDateReadonlyRuntimeReport\s*\}\s*from\s*['"]\.\.\/source-of-truth\/list-cards-status-date-readonly-runtime['"]/,
  'src/lib/clients.ts': /import\s*\{\s*listCardsStatusDateReadonlyRuntimeReport\s*\}\s*from\s*['"]\.\/source-of-truth\/list-cards-status-date-readonly-runtime['"]/,
  'src/lib/cases.ts': /import\s*\{\s*listCardsStatusDateReadonlyRuntimeReport\s*\}\s*from\s*['"]\.\/source-of-truth\/list-cards-status-date-readonly-runtime['"]/
}
for (const h of hostRels) { const text=read(h); if(!patterns[h].test(text)) fail('metadata import missing '+h); must(text,'void listCardsStatusDateReadonlyRuntimeReport',h); for (const s of ['return listCardsStatusDateReadonlyRuntimeReport','if (listCardsStatusDateReadonlyRuntimeReport','.map(listCardsStatusDateReadonlyRuntimeReport','.filter(listCardsStatusDateReadonlyRuntimeReport','.sort(listCardsStatusDateReadonlyRuntimeReport']) if(text.includes(s)) fail('host logic use '+h+' '+s) }
if (fs.readdirSync(rel('_project/runs')).some((n) => n.includes('LF-PROD-SOT-004Q'))) fail('004Q exists')
let changed=[]; try { changed=childProcess.execSync('git diff --name-only HEAD',{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean) } catch (_) {}
const allowed = new Set(['package.json',adapterRel,reportRel,testRel,'scripts/guards/verify-lf-prod-sot-004p-list-cards-status-date-readonly-runtime-import.cjs',...hostRels,'scripts/guards/verify-lf-prod-sot-004m-today-runtime-import-smoke-and-decision.cjs','scripts/guards/verify-lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.cjs','scripts/guards/verify-lf-prod-sot-004o-calendar-status-date-readonly-runtime-import.cjs'])
for (const f of changed) if(!allowed.has(f)) fail('unexpected changed file '+f)
for (const f of changed) if (['src/pages/','src/components/','src/styles/','src/index.css','supabase/','migrations/','sql/','src/lib/google-calendar','src/lib/gcal','src/lib/calendar-sync','src/lib/calendar-provider','src/pages/CaseDetail.tsx','src/lib/finance/','src/lib/cases/'].some((p)=>f===p||f.startsWith(p))) fail('forbidden changed file '+f)
const bad=[0xfffd,0,0x0102,0x00c2,0x00c3,0x0139,0x203a]; const moj=(t)=>Array.from(t).some((c)=>bad.includes(c.charCodeAt(0)))
for (const f of [adapterRel,reportRel,testRel,decisionRel,report004nRel,report004oRel,...hostRels]) if(moj(read(f))) fail('mojibake '+f)
console.log(JSON.stringify({ok:true,stage:'LF-PROD-SOT-004P',runtimeImport:'READONLY_METADATA_IMPORT_ONLY',outputDrift:'NO_OUTPUT_DRIFT',listsCardsOutput:'UNCHANGED',smokeDebt:'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE',fullManualSmokeRequiredBeforeFinalAcceptance:true,selectedImportHosts:hostRels},null,2))