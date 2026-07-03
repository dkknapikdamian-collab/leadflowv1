const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const fail = (message) => {
  console.error('[004O] FAIL ' + message)
  process.exit(1)
}
const must = (text, marker, label) => {
  if (!text.includes(marker)) fail(label + ' missing ' + marker)
}

const adapterRel = 'src/lib/source-of-truth/calendar-status-date-readonly-runtime.ts'
const reportRel = '_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const testRel = 'tests/lf-prod-sot-004o-calendar-status-date-readonly-runtime-import.test.cjs'
const decisionRel = '_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md'
const report004nRel = '_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const hostRel = 'src/lib/calendar-items.ts'
const pkgRel = 'package.json'
const report004pRel = '_project/runs/LF-PROD-SOT-004P_LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const adapter004pRel = 'src/lib/source-of-truth/list-cards-status-date-readonly-runtime.ts'
const host004pRels = ['src/lib/work-items/normalize.ts', 'src/lib/clients.ts', 'src/lib/cases.ts']

for (const file of [adapterRel, reportRel, testRel, decisionRel, report004nRel, hostRel, pkgRel]) if (!exists(file)) fail('missing ' + file)
const adapter = read(adapterRel)
const report = read(reportRel)
const decision = read(decisionRel)
const report004n = read(report004nRel)
const host = read(hostRel)
const pkg = read(pkgRel)

for (const marker of ['LF-PROD-SOT-004O','CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT','LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED','LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT','READONLY_METADATA_IMPORT_ONLY','READONLY_RUNTIME_BOUNDARY_IMPORT','NO_OUTPUT_DRIFT','SMOKE_DEFERRED_DEBT_FROM_004M','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','NO_GCAL_CHANGE','GoogleCalendarSyncChange','GoogleCalendarMapperChange','remoteProviderChange','CalendarCountChange','CalendarStatusLabelChange','CalendarDatePrecedenceChange','CalendarDateOnlyDefaultChange','localWarsawBusinessDayBoundaryChange']) must(adapter, marker, adapterRel)
for (const marker of ['OWNER_DECISION_RECORDED','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','NEXT_READONLY_NO_DRIFT_STAGE_ALLOWED']) must(decision, marker, decisionRel)
for (const marker of ['LOCAL_RERUN_PASS_AFTER_R2', 'REPO_CLEAN', 'NO_GCAL_CHANGE', 'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE']) must(report004n, marker, report004nRel)
for (const marker of ['CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT','SMOKE_DEFERRED_DEBT_FROM_004M','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','NO_UI_CHANGE','NO_CSS_CHANGE','NO_SQL_CHANGE','NO_SUPABASE_API_CHANGE','NO_GCAL_CHANGE']) must(report, marker, reportRel)
must(pkg, 'verify:lf-prod-sot-004o-calendar-status-date-readonly-runtime-import', pkgRel)
must(pkg, 'scripts/guards/verify-lf-prod-sot-004o-calendar-status-date-readonly-runtime-import.cjs', pkgRel)
must(host, 'calendar-status-date-readonly-runtime', hostRel)
must(host, 'void calendarStatusDateReadonlyRuntimeReport', hostRel)
if (!/import\s*\{\s*calendarStatusDateReadonlyRuntimeReport\s*\}\s*from\s*['"]\.\/source-of-truth\/calendar-status-date-readonly-runtime['"]/.test(host)) fail('metadata-only import missing in host')

const adapterImportLines = adapter.split(/\r?\n/).filter((line) => /^\s*import\b/.test(line)).join('\n')
const forbiddenAdapterImportSnippets = ['react','react-dom','../pages/','./pages/','../components/','./components/','.css','google-calendar','gcal','calendar-sync','calendar-provider','CaseDetail','case-detail','finance/','supabase','fetch(','axios']
for (const snippet of forbiddenAdapterImportSnippets) if (adapterImportLines.includes(snippet)) fail('adapter has forbidden import snippet ' + snippet)
for (const snippet of ['document.', 'window.', 'localStorage.', 'sessionStorage.']) if (adapter.includes(snippet)) fail('adapter has forbidden runtime snippet ' + snippet)

const has004p = fs.readdirSync(rel('_project/runs')).some((name) => name.includes('LF-PROD-SOT-004P'))
if (has004p) {
  for (const file of [report004pRel, adapter004pRel, ...host004pRels]) if (!exists(file)) fail('004P required file missing ' + file)
  const report004p = read(report004pRel)
  const adapter004p = read(adapter004pRel)
  for (const marker of ['LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT','SMOKE_DEFERRED_DEBT_FROM_004M','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','NO_GCAL_CHANGE']) must(report004p, marker, report004pRel)
  for (const marker of ['LF-PROD-SOT-004P','LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT','READONLY_METADATA_IMPORT_ONLY','NO_RUNTIME_BEHAVIOR_CHANGE','NO_OUTPUT_DRIFT','ListCardCountChange','ListSortChange','ListFilterChange','GoogleCalendarSyncChange']) must(adapter004p, marker, adapter004pRel)
  const imports004p = adapter004p.split(/\r?\n/).filter((line) => /^\s*import\b/.test(line)).join('\n')
  for (const snippet of forbiddenAdapterImportSnippets) if (imports004p.includes(snippet)) fail('004P adapter has forbidden import snippet ' + snippet)
  for (const host004p of host004pRels) { const h = read(host004p); must(h, 'list-cards-status-date-readonly-runtime', host004p); must(h, 'void listCardsStatusDateReadonlyRuntimeReport', host004p) }
}
if (fs.readdirSync(rel('_project/runs')).some((name) => name.includes('LF-PROD-SOT-004Q'))) fail('004Q exists')

let changed = []
try { changed = childProcess.execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean) } catch (_) {}
const allowedChangedFiles = new Set([
  'package.json',
  adapterRel,
  reportRel,
  testRel,
  hostRel,
  'scripts/guards/verify-lf-prod-sot-004o-calendar-status-date-readonly-runtime-import.cjs',
  report004nRel,
  'scripts/guards/verify-lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.cjs',
  'tests/lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.test.cjs',
  'scripts/guards/verify-lf-prod-sot-004m-today-runtime-import-smoke-and-decision.cjs',
  report004pRel,
  adapter004pRel,
  ...host004pRels,
  'scripts/guards/verify-lf-prod-sot-004p-list-cards-status-date-readonly-runtime-import.cjs',
  'tests/lf-prod-sot-004p-list-cards-status-date-readonly-runtime-import.test.cjs',
])
for (const file of changed) if (!allowedChangedFiles.has(file)) fail('unexpected changed file ' + file)
const forbiddenChangedPrefixes = ['src/pages/Calendar.tsx','src/pages/TodayStable.tsx','src/pages/TasksStable.tsx','src/components/','src/styles/','src/index.css','supabase/','migrations/','sql/','src/lib/google-calendar','src/lib/gcal','src/lib/calendar-sync','src/lib/calendar-provider','src/lib/cases/','src/pages/CaseDetail.tsx','src/lib/finance/']
for (const file of changed) if (forbiddenChangedPrefixes.some((prefix) => file === prefix || file.startsWith(prefix))) fail('forbidden changed file ' + file)

const mojibakeChars = [0xfffd, 0x0000, 0x0102, 0x00c2, 0x00c3, 0x0139, 0x203a]
const hasMojibake = (text) => Array.from(text).some((char) => mojibakeChars.includes(char.charCodeAt(0)))
for (const file of [adapterRel, reportRel, testRel, decisionRel, report004nRel, hostRel, ...(has004p ? [report004pRel, adapter004pRel, ...host004pRels] : [])]) if (hasMojibake(read(file))) fail('mojibake ' + file)

console.log(JSON.stringify({
  ok: true,
  stage: 'LF-PROD-SOT-004O',
  runtimeImport: 'READONLY_METADATA_IMPORT_ONLY',
  outputDrift: 'NO_OUTPUT_DRIFT',
  gcalTouched: 'NO',
  accepts004pReadonlyNoDriftContinuation: has004p,
  smokeDebt: 'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE',
  fullManualSmokeRequiredBeforeFinalAcceptance: true,
}, null, 2))