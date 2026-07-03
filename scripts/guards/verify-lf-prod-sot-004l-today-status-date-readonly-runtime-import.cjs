const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

const ROOT = process.cwd()
const adapterRel = 'src/lib/source-of-truth/today-status-date-readonly-runtime.ts'
const hostRel = 'src/lib/work-items/normalize.ts'
const reportRel = '_project/runs/LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004l-today-status-date-readonly-runtime-import.cjs'
const testRel = 'tests/lf-prod-sot-004l-today-status-date-readonly-runtime-import.test.cjs'
const packageRel = 'package.json'

function read(rel) {
  const full = path.join(ROOT, rel)
  if (!fs.existsSync(full)) throw new Error(`Missing required file: ${rel}`)
  return fs.readFileSync(full, 'utf8')
}
function mustHave(text, token, label) {
  if (!text.includes(token)) throw new Error(`${label} missing token: ${token}`)
}
function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else out.push(path.relative(ROOT, full).replace(/\\/g, '/'))
  }
  return out
}

const adapter = read(adapterRel)
const host = read(hostRel)
const report = read(reportRel)
const pkg = read(packageRel)
read(guardRel)
read(testRel)

for (const token of [
  'LF-PROD-SOT-004L',
  'TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT',
  'LF-PROD-SOT-004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN',
  'TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN_CLOSED',
  'READONLY_METADATA_IMPORT_ONLY',
  'READONLY_RUNTIME_BOUNDARY_IMPORT',
  'outputDrift',
  'FORBIDDEN',
  'TodayTaskEventCountChange',
  'TodaySectionCountChange',
  'TodayEmptyStateChange',
  'TaskStatusLabelChange',
  'EventStatusLabelChange',
  'DoneCancelledPendingLabelChange',
  'datePrecedenceChange',
  'dateOnlyDefaultChange',
  'GoogleCalendarSyncChange',
  'UIChange',
  'CSSChange',
  'SQLChange',
  'SupabaseAPIChange',
  'CaseDetailChange',
  'FinanceChange',
  'manualSmokeRequiredAfter004L',
  'REQUIRED',
  'LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION',
]) mustHave(adapter, token, adapterRel)

for (const exportName of [
  'todayStatusDateReadonlyRuntimeStage',
  'todayStatusDateReadonlyRuntimeMode',
  'todayStatusDateReadonlyRuntimeInputPlan',
  'todayStatusDateReadonlyRuntimeSourceOfTruthUsage',
  'todayStatusDateReadonlyRuntimeAllowedImports',
  'todayStatusDateReadonlyRuntimeForbiddenChanges',
  'todayStatusDateReadonlyRuntimeNoDriftContract',
  'todayStatusDateReadonlyRuntimeStatusContract',
  'todayStatusDateReadonlyRuntimeDateContract',
  'todayStatusDateReadonlyRuntimeCountContract',
  'todayStatusDateReadonlyRuntimeManualSmokePolicy',
  'todayStatusDateReadonlyRuntimeNextStages',
  'todayStatusDateReadonlyRuntimeReport',
]) mustHave(adapter, `export const ${exportName}`, adapterRel)

const forbiddenRuntimeSnippets = ["from 'react'", 'from "react"', 'document.', 'window.', 'src/pages/', 'src/components/', 'src/styles/', '.css', 'supabase', 'google-calendar']
for (const token of forbiddenRuntimeSnippets) {
  if (adapter.includes(token)) throw new Error(`${adapterRel} contains forbidden runtime/import token: ${token}`)
}
// CaseDetailChange and FinanceChange are required no-drift metadata markers, not runtime imports.

mustHave(pkg, 'verify:lf-prod-sot-004l-today-status-date-readonly-runtime-import', packageRel)
mustHave(pkg, guardRel, packageRel)
mustHave(host, "from '../source-of-truth/today-status-date-readonly-runtime'", hostRel)
mustHave(host, 'void todayStatusDateReadonlyRuntimeReport', hostRel)
const hostUses = (host.match(/todayStatusDateReadonlyRuntimeReport/g) || []).length
if (hostUses !== 2) throw new Error(`${hostRel} must use todayStatusDateReadonlyRuntimeReport exactly in import and void; got ${hostUses}`)

for (const token of ['TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED', 'READONLY_METADATA_IMPORT_ONLY', 'NO_OUTPUT_DRIFT', 'MANUAL_SMOKE_REQUIRED_AFTER_004L', 'LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION']) {
  mustHave(report, token, reportRel)
}

const files = walk(ROOT)
if (files.some((file) => /004M/.test(file))) throw new Error('004M file exists; forbidden in 004L')
const changed = childProcess.execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean)
const allowed = new Set([adapterRel, hostRel, reportRel, guardRel, testRel, packageRel])
for (const file of changed) {
  if (!allowed.has(file)) throw new Error(`Unexpected changed file in 004L: ${file}`)
  if (/^(src\/pages|src\/components|src\/styles|src\/ui-system|supabase|migrations|sql)/i.test(file)) throw new Error(`Forbidden changed path: ${file}`)
}

for (const [label, text] of Object.entries({ adapter, host, report, pkg })) {
  if (/[Ă…Ă„ĂĂ‚ďż˝]/.test(text)) throw new Error(`Possible mojibake in ${label}`)
}

console.log(JSON.stringify({
  ok: true,
  stage: 'LF-PROD-SOT-004L',
  importHost: hostRel,
  runtimeImport: 'READONLY_METADATA_IMPORT_ONLY',
  outputDrift: 'NO_OUTPUT_DRIFT'
}, null, 2))