const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const fail = (message) => {
  console.error('[004N] FAIL ' + message)
  process.exit(1)
}

const adapterRel = 'src/lib/source-of-truth/tasks-status-date-readonly-runtime.ts'
const reportRel = '_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.cjs'
const testRel = 'tests/lf-prod-sot-004n-tasks-status-date-readonly-runtime-import.test.cjs'
const decisionRel = '_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md'
const requiredFiles = [adapterRel, reportRel, guardRel, testRel, decisionRel]

for (const file of requiredFiles) {
  if (!exists(file)) fail('missing ' + file)
}

const adapter = read(adapterRel)
const report = read(reportRel)
const pkg = read('package.json')
const decision = read(decisionRel)

for (const marker of [
  'LF-PROD-SOT-004N',
  'TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT',
  'LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED',
  'READONLY_METADATA_IMPORT_ONLY',
  'SMOKE_DEFERRED_DEBT_FROM_004M',
  'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE',
  'DEFERRED_BY_OWNER_NOT_PASS',
  'FORBIDDEN',
  'REQUIRED',
]) {
  if (!adapter.includes(marker)) fail('adapter missing ' + marker)
}

for (const marker of [
  'TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED',
  'READONLY_METADATA_IMPORT_ONLY',
  'NO_OUTPUT_DRIFT',
  'SMOKE_DEFERRED_DEBT_FROM_004M',
  'MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS',
  'FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE',
]) {
  if (!report.includes(marker)) fail('report missing ' + marker)
}

for (const marker of [
  'OWNER_DECISION_RECORDED',
  'MANUAL_SMOKE_DEFERRED_BY_OWNER_NOT_PASS',
  'SMOKE_DEFERRED_DEBT_FROM_004M_ACTIVE',
]) {
  if (!decision.includes(marker)) fail('decision missing ' + marker)
}

if (!pkg.includes('verify:lf-prod-sot-004n-tasks-status-date-readonly-runtime-import')) fail('package alias missing')

const hostFiles = ['src/lib/work-items/normalize.ts', 'src/pages/Tasks.tsx', 'src/pages/TasksStable.tsx']
const hosts = hostFiles.filter((file) => exists(file) && read(file).includes('tasksStatusDateReadonlyRuntimeReport'))
if (hosts.length < 1 || hosts.length > 2) fail('bad host count ' + hosts.length)
for (const host of hosts) {
  const text = read(host)
  if (!text.includes('tasks-status-date-readonly-runtime')) fail('host import missing ' + host)
  if (!text.includes('void tasksStatusDateReadonlyRuntimeReport')) fail('host void missing ' + host)
}

if (fs.readdirSync(rel('_project/runs')).some((name) => name.includes('LF-PROD-SOT-004O'))) fail('004O exists')

const mojibakeChars = [0xfffd, 0x0000, 0x0102, 0x00c2, 0x00c3, 0x0139, 0x203a]
function hasMojibake(text) {
  return Array.from(text).some((char) => mojibakeChars.includes(char.charCodeAt(0)))
}

for (const file of [adapterRel, reportRel, decisionRel, ...hosts]) {
  if (hasMojibake(read(file))) fail('mojibake ' + file)
}

console.log('[004N] PASS')
