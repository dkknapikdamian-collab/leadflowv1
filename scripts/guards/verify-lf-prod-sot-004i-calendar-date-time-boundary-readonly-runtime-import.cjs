const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const ROOT = process.cwd()
const STAGE = 'LF-PROD-SOT-004I'

const adapterRel = 'src/lib/source-of-truth/calendar-date-time-boundary-readonly-runtime.ts'
const helperRel = 'src/lib/calendar-operational-entry-contract.ts'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004i-calendar-date-time-boundary-readonly-runtime-import.cjs'
const testRel = 'tests/lf-prod-sot-004i-calendar-date-time-boundary-readonly-runtime-import.test.cjs'
const reportRel = '_project/runs/LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT.md'
const packageRel = 'package.json'

const allowedChanged = new Set([
  adapterRel,
  helperRel,
  guardRel,
  testRel,
  reportRel,
  packageRel,
])

const helperCandidates = [
  helperRel,
  'src/lib/calendar-items.ts',
  'src/lib/scheduling.ts',
  'src/lib/work-items/normalize.ts',
]

const forbiddenChangedPrefixes = [
  'src/pages/',
  'src/components/',
  'src/ui-system/',
  'src/styles/',
  'src/index.css',
  'supabase/',
  'migrations/',
  'sql/',
  'src/lib/finance/',
  'src/lib/case',
  'src/lib/google',
  'src/lib/remote-calendar',
]

const requiredExports = [
  'calendarDateTimeBoundaryReadonlyRuntimeStage',
  'calendarDateTimeBoundaryReadonlyRuntimeMode',
  'calendarDateTimeBoundaryReadonlyRuntimeDecision',
  'calendarDateTimeBoundaryReadonlyRuntimeSourceMap',
  'calendarDateTimeBoundaryReadonlyRuntimeRepositories',
  'calendarDateTimeBoundaryReadonlyRuntimeAllowedImports',
  'calendarDateTimeBoundaryReadonlyRuntimeBlockedAreas',
  'calendarDateTimeBoundaryReadonlyRuntimeHardRules',
  'calendarDateTimeBoundaryReadonlyRuntimeNoDriftPolicy',
  'calendarDateTimeBoundaryReadonlyRuntimeDatePolicy',
  'calendarDateTimeBoundaryReadonlyRuntimeStatusPolicy',
  'calendarDateTimeBoundaryReadonlyRuntimeAdapterContract',
  'calendarDateTimeBoundaryReadonlyRuntimeFixturePolicy',
  'calendarDateTimeBoundaryReadonlyRuntimeManualSmokePolicy',
  'calendarDateTimeBoundaryReadonlyRuntimeNextStages',
  'calendarDateTimeBoundaryReadonlyRuntimeReport',
]

const requiredMarkers = [
  'LF-PROD-SOT-004I',
  'CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT',
  'CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT_FIRST',
  'READONLY_HELPER_IMPORT_ONLY',
  'runtimeBehaviorChange',
  'FORBIDDEN',
  'visibleOutputDrift',
  'uiChange',
  'cssChange',
  'sqlChange',
  'supabaseApiChange',
  'GoogleCalendarSyncChange',
  'GoogleCalendarMapperChange',
  'RemoteCalendarBoundaryChange',
  'CalendarRuntimeAdoption',
  'TasksRuntimeAdoption',
  'TodayRuntimeAdoption',
  'LocalCalendarDayCountChange',
  'TodayTaskEventCountChange',
  'TaskStatusLabelChange',
  'EventStatusLabelChange',
  'DoneCancelledPendingLabelChange',
  'datePrecedenceChange',
  'dateOnlyDefaultChange',
  'taskDateOnlyDefaultT0900Change',
  'eventDateOnlyDefaultT0900Change',
  'financeDateOnlyDefaultT235959Change',
  'FORBIDDEN_REFERENCE_ONLY',
  'timezonePolicyChange',
  'localWarsawBusinessDayBoundaryChange',
  'recurrenceExpansionChange',
  'calendarItemExpansionChange',
  'workItemsNormalizeOutputChange',
  'schedulingOutputChange',
  'dataWriteChange',
  'READONLY_RUNTIME_IMPORT_NO_OUTPUT_DRIFT',
  'REQUIRED_AND_BLOCKING_BEFORE_NEXT_RUNTIME_IMPORT',
  'FinanceRuntimeAdoption',
  'CaseDetailRuntimeAdoption',
  'REQUIRED_AFTER_004I_MANUAL_SMOKE',
]

const requiredReportTokens = [
  'LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT',
  'LF-PROD-SOT-004H_FIRST_RUNTIME_IMPORT_DECISION_MAP',
  'CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT_FIRST',
  'READONLY_RUNTIME_IMPORT_NO_OUTPUT_DRIFT',
  'Google Calendar sync: NOT_TOUCHED',
  'Calendar day counts: NO_DRIFT',
  'Today task/event counts: NO_DRIFT',
  'date-only defaults: NO_DRIFT',
  'runtime output: NO_DRIFT',
  'manual smoke: REQUIRED_BEFORE_NEXT_RUNTIME_IMPORT',
]

const allowedAdapterImports = new Set([
  './status-repository',
  './date-time-repository',
  './visual-repository',
  './runtime-adoption-readonly',
  './calendar-date-time-boundary-plan',
])

const forbiddenImportTokens = [
  'react',
  'src/pages',
  'src/components',
  'ui-system',
  '.css',
  'google-calendar',
  'remote-calendar',
  'firebase',
]

const mojibakeTokens = ['ďż˝', 'Ă…', 'Ă„', 'Ă', 'Ă‚', 'Ă˘â‚¬', 'Ă˘â‚¬â„˘', 'Ă…â€ş', 'Ă…â€š', 'Ă…ÂĽ', 'Ă…Âş', 'Ă„â€¦', 'Ă„â„˘', 'Ä‚Ĺ‚']

function read(rel) {
  const full = path.join(ROOT, rel)
  if (!fs.existsSync(full)) throw new Error(`Missing required file: ${rel}`)
  return fs.readFileSync(full, 'utf8')
}

function assertIncludes(text, token, label) {
  if (!text.includes(token)) throw new Error(`${label} missing token: ${token}`)
}

function assertNoMojibake(rel, text) {
  // The guard must contain the mojibake dictionary to detect bad text.
  // Do not count that literal dictionary as mojibake in the guard itself.
  if (rel === guardRel) {
    text = text.replace(/const mojibakeTokens = \[\s\S]*?\]/, 'const mojibakeTokens = []')
  }
  for (const token of mojibakeTokens) {
    if (text.includes(token)) throw new Error(`${rel} contains mojibake token ${token}`)
  }
}

function changedFiles() {
  const output = cp.execSync('git status --short', { cwd: ROOT, encoding: 'utf8' })
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^..\s+/, '').replace(/^"|"$/g, ''))
}

for (const rel of [adapterRel, helperRel, guardRel, testRel, reportRel, packageRel]) read(rel)

const adapter = read(adapterRel)
const helper = read(helperRel)
const guard = read(guardRel)
const test = read(testRel)
const report = read(reportRel)
const pkg = read(packageRel)

for (const name of requiredExports) assertIncludes(adapter, `export const ${name}`, adapterRel)
for (const token of requiredMarkers) assertIncludes(adapter, token, adapterRel)
for (const token of requiredReportTokens) assertIncludes(report, token, reportRel)

assertIncludes(pkg, 'verify:lf-prod-sot-004i-calendar-date-time-boundary-readonly-runtime-import', packageRel)
assertIncludes(pkg, guardRel, packageRel)

const adapterImportLines = adapter.split(/\r?\n/).filter((line) => line.trim().startsWith('import '))
if (adapterImportLines.length !== 5) throw new Error(`${adapterRel} must contain exactly 5 read-only SOT imports`)
for (const line of adapterImportLines) {
  const match = line.match(/from\s+['"]([^'"]+)['"]/) || line.match(/import\s+['"]([^'"]+)['"]/) 
  if (!match) throw new Error(`Unparseable adapter import: ${line}`)
  const spec = match[1]
  if (!allowedAdapterImports.has(spec)) throw new Error(`Unexpected adapter import: ${spec}`)
  const lower = spec.toLowerCase()
  for (const token of forbiddenImportTokens) {
    if (lower.includes(token)) throw new Error(`Forbidden adapter import token ${token}: ${spec}`)
  }
}

const helperImportMatches = helperCandidates.filter((rel) => fs.existsSync(path.join(ROOT, rel)) && read(rel).includes('calendar-date-time-boundary-readonly-runtime'))
if (helperImportMatches.length !== 1 || helperImportMatches[0] !== helperRel) {
  throw new Error(`Exactly one allowed runtime helper must import adapter, found: ${helperImportMatches.join(', ')}`)
}

assertIncludes(helper, 'calendarDateTimeBoundaryReadonlyRuntimeImportBoundary', helperRel)
assertIncludes(helper, 'void calendarDateTimeBoundaryReadonlyRuntimeImportBoundary', helperRel)
if (/return\s+[{(]?[\s\S]{0,400}calendarDateTimeBoundaryReadonlyRuntimeImportBoundary/.test(helper)) {
  throw new Error(`${helperRel} must not expose boundary metadata in return/output`)
}

for (const file of changedFiles()) {
  if (allowedChanged.has(file)) continue
  if (forbiddenChangedPrefixes.some((prefix) => file === prefix || file.startsWith(prefix))) {
    throw new Error(`Forbidden changed file detected in 004I: ${file}`)
  }
}

for (const rel of [adapterRel, helperRel, testRel, reportRel]) {
  assertNoMojibake(rel, read(rel))
}

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  checked: {
    packageAlias: true,
    adapterExists: true,
    guardExists: true,
    testExists: true,
    reportExists: true,
    requiredExports: requiredExports.length,
    requiredMarkers: requiredMarkers.length,
    runtimeHelperTouched: helperRel,
    exactlyOneRuntimeHelperImport: true,
    noPagesChange: true,
    noComponentsChange: true,
    noCssChange: true,
    noSqlChange: true,
    noSupabaseApiChange: true,
    noGoogleCalendarSyncChange: true,
    noCaseDetailRuntimeChange: true,
    noFinanceRuntimeChange: true,
    noOutputDriftPolicy: 'READONLY_RUNTIME_IMPORT_NO_OUTPUT_DRIFT',
    manualSmokeRequired: true,
  }
}, null, 2))