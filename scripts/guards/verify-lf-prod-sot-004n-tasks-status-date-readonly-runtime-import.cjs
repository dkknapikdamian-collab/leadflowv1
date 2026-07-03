const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const fail = (message) => {
  console.error('[004N] FAIL ' + message)
  process.exit(1)
}
const must = (text, marker, label) => {
  if (!text.includes(marker)) fail(label + ' missing ' + marker)
}

const adapterRel = 'src/lib/source-of-truth/tasks-status-date-readonly-runtime.ts'
const reportRel = '_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.cjs'
const testRel = 'tests/lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.test.cjs'
const decisionRel = '_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md'
const report004oRel = '_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const adapter004oRel = 'src/lib/source-of-truth/calendar-status-date-readonly-runtime.ts'
const host004oRel = 'src/lib/calendar-items.ts'
const report004pRel = '_project/runs/LF-PROD-SOT-004P_LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const adapter004pRel = 'src/lib/source-of-truth/list-cards-status-date-readonly-runtime.ts'
const host004pRels = ['src/lib/work-items/normalize.ts', 'src/lib/clients.ts', 'src/lib/cases.ts']
const requiredFiles = [adapterRel, reportRel, guardRel, testRel, decisionRel]

for (const file of requiredFiles) if (!exists(file)) fail('missing ' + file)

const adapter = read(adapterRel)
const report = read(reportRel)
const pkg = read('package.json')
const decision = read(decisionRel)

for (const marker of ['LF-PROD-SOT-004N','TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT','LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED','READONLY_METADATA_IMPORT_ONLY','SMOKE_DEFERRED_DEBT_FROM_004M','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','DEFERRED_BY_OWNER_NOT_PASS','FORBIDDEN','REQUIRED']) must(adapter, marker, adapterRel)
for (const marker of ['TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT','SMOKE_DEFERRED_DEBT_FROM_004M','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','LOCAL_RERUN_PASS_AFTER_R2']) must(report, marker, reportRel)
for (const marker of ['OWNER_DECISION_RECORDED','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','NEXT_READONLY_NO_DRIFT_STAGE_ALLOWED']) must(decision, marker, decisionRel)
if (!pkg.includes('verify:lf-prod-sot-004n-tasks-status-date-readonly-runtime-import')) fail('package alias missing')

const hostFiles = ['src/lib/work-items/normalize.ts', 'src/pages/Tasks.tsx', 'src/pages/TasksStable.tsx']
const hosts = hostFiles.filter((file) => exists(file) && read(file).includes('tasksStatusDateReadonlyRuntimeReport'))
if (hosts.length < 1 || hosts.length > 2) fail('bad host count ' + hosts.length)
for (const host of hosts) {
  const text = read(host)
  if (!text.includes('tasks-status-date-readonly-runtime')) fail('host import missing ' + host)
  if (!text.includes('void tasksStatusDateReadonlyRuntimeReport')) fail('host void missing ' + host)
}

const has004o = fs.readdirSync(rel('_project/runs')).some((name) => name.includes('LF-PROD-SOT-004O'))
if (has004o) {
  if (!exists(report004oRel)) fail('004O report missing')
  if (!exists(adapter004oRel)) fail('004O adapter missing')
  if (!exists(host004oRel)) fail('004O host missing')
  const report004o = read(report004oRel)
  const adapter004o = read(adapter004oRel)
  const host004o = read(host004oRel)
  for (const marker of ['CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT','SMOKE_DEFERRED_DEBT_FROM_004M','SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE','MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','NO_GCAL_CHANGE']) must(report004o, marker, report004oRel)
  for (const marker of ['LF-PROD-SOT-004O','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT','SMOKE_DEFERRED_DEBT_FROM_004M','NO_GCAL_CHANGE','GoogleCalendarSyncChange','GoogleCalendarMapperChange','remoteProviderChange']) must(adapter004o, marker, adapter004oRel)
  if (!host004o.includes('calendar-status-date-readonly-runtime')) fail('004O host import missing')
  if (!host004o.includes('void calendarStatusDateReadonlyRuntimeReport')) fail('004O host void missing')
}

const has004p = fs.readdirSync(rel('_project/runs')).some((name) => name.includes('LF-PROD-SOT-004P'))
if (has004p) {
  for (const file of [report004pRel, adapter004pRel, ...host004pRels]) if (!exists(file)) fail('004P missing ' + file)
  const report004p = read(report004pRel)
  const adapter004p = read(adapter004pRel)
  for (const marker of ['LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED','READONLY_METADATA_IMPORT_ONLY','NO_OUTPUT_DRIFT','SMOKE_DEFERRED_DEBT_FROM_004M','FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE','NO_GCAL_CHANGE']) must(report004p, marker, report004pRel)
  for (const marker of ['LF-PROD-SOT-004P','LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT','READONLY_METADATA_IMPORT_ONLY','NO_RUNTIME_BEHAVIOR_CHANGE','NO_OUTPUT_DRIFT','ListCardCountChange','ListSortChange','ListFilterChange','GoogleCalendarSyncChange']) must(adapter004p, marker, adapter004pRel)
  for (const host004p of host004pRels) { const h = read(host004p); must(h, 'list-cards-status-date-readonly-runtime', host004p); must(h, 'void listCardsStatusDateReadonlyRuntimeReport', host004p) }
}

let changed = []
try { changed = childProcess.execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean) } catch (_) {}
const allowed = new Set([
  'package.json',
  adapterRel,
  reportRel,
  guardRel,
  testRel,
  decisionRel,
  report004oRel,
  adapter004oRel,
  host004oRel,
  'scripts/guards/verify-lf-prod-sot-004o-calendar-status-date-readonly-runtime-import.cjs',
  'tests/lf-prod-sot-004o-calendar-status-date-readonly-runtime-import.test.cjs',
  report004pRel,
  adapter004pRel,
  ...host004pRels,
  'scripts/guards/verify-lf-prod-sot-004p-list-cards-status-date-readonly-runtime-import.cjs',
  'tests/lf-prod-sot-004p-list-cards-status-date-readonly-runtime-import.test.cjs',
  'scripts/guards/verify-lf-prod-sot-004m-today-runtime-import-smoke-and-decision.cjs',
])
for (const file of changed) if (!allowed.has(file)) fail('unexpected changed file ' + file)

const mojibakeChars = [0xfffd, 0x0000, 0x0102, 0x00c2, 0x00c3, 0x0139, 0x203a]
const hasMojibake = (text) => Array.from(text).some((char) => mojibakeChars.includes(char.charCodeAt(0)))
for (const file of [adapterRel, reportRel, decisionRel, ...hosts, ...(has004o ? [report004oRel, adapter004oRel, host004oRel] : []), ...(has004p ? [report004pRel, adapter004pRel, ...host004pRels] : [])]) {
  if (hasMojibake(read(file))) fail('mojibake ' + file)
}

console.log('[004N] PASS')