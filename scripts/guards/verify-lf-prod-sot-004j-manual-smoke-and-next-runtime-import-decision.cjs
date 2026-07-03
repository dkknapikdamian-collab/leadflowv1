const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const ROOT = process.cwd()
const STAGE = 'LF-PROD-SOT-004J-R2'

const reportRel = '_project/runs/LF-PROD-SOT-004J_MANUAL_SMOKE_AND_NEXT_RUNTIME_IMPORT_DECISION.md'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004j-manual-smoke-and-next-runtime-import-decision.cjs'
const testRel = 'tests/lf-prod-sot-004j-manual-smoke-and-next-runtime-import-decision.test.cjs'
const packageRel = 'package.json'

const allowedChanged = new Set([packageRel, reportRel, guardRel, testRel])

const forbiddenExact = new Set([
  'src/lib/calendar-operational-entry-contract.ts',
  'src/lib/calendar-items.ts',
  'src/lib/scheduling.ts',
  'src/lib/work-items/normalize.ts',
  'src/index.css',
])

const forbiddenPrefixes = [
  'src/lib/source-of-truth/',
  'src/pages/',
  'src/components/',
  'src/ui-system/',
  'src/styles/',
  'supabase/',
  'migrations/',
  'sql/',
  'src/lib/google',
  'src/lib/remote-calendar',
  'src/lib/finance',
  'src/lib/case',
]

const requiredReportTokens = [
  'LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT',
  'MANUAL_SMOKE_REQUIRED_BEFORE_NEXT_RUNTIME_IMPORT',
  'NEXT_RUNTIME_IMPORT_DECISION_NEEDED',
  'Google Calendar sync: NOT_TOUCHED',
  'UI/CSS/SQL/Supabase/API: NOT_TOUCHED',
  'runtime changes in 004J: NONE',
  'runtime changes in 004J-R2: NONE',
  'R2_FORMAL_CLEANUP_DONE',
  'App commit: 86ed4abd5c2b527b7ad1165904e5d2096b360001',
]

const legalStatuses = [
  'MANUAL_SMOKE_PENDING / NEXT_RUNTIME_IMPORT_BLOCKED / NO_RUNTIME_CHANGE / NO_UI_CHANGE / NO_CSS_CHANGE / NO_SQL_CHANGE / R2_FORMAL_CLEANUP_DONE',
  'MANUAL_SMOKE_RED / NEXT_RUNTIME_IMPORT_BLOCKED / NO_RUNTIME_CHANGE / NO_UI_CHANGE / NO_CSS_CHANGE / NO_SQL_CHANGE / R2_FORMAL_CLEANUP_DONE',
  'MANUAL_SMOKE_PASS / NEXT_RUNTIME_IMPORT_DECISION_SELECTED / READY_FOR_004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN / NO_RUNTIME_CHANGE / NO_UI_CHANGE / NO_CSS_CHANGE / NO_SQL_CHANGE / R2_FORMAL_CLEANUP_DONE',
]

const mojibakeTokens = ['Ă„ĹąÄąÄ˝Ă‹ĹĄ', 'Ă„â€šĂ˘â‚¬Â¦', 'Ă„â€šĂ˘â‚¬Ĺľ', 'Ă„â€šĂ‚Â', 'Ă„â€šĂ˘â‚¬Ĺˇ', 'Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬', 'Ă„â€šĂ‹ÂÄ‚ËĂ˘â‚¬ĹˇĂ‚Â¬Ä‚ËĂ˘â‚¬ĹľĂ‹Â', 'Ă„â€šĂ˘â‚¬Â¦Ä‚ËĂ˘â€šÂ¬ÄąĹş', 'Ă„â€šĂ˘â‚¬Â¦Ä‚ËĂ˘â€šÂ¬ÄąË‡', 'Ă„â€šĂ˘â‚¬Â¦Ä‚â€šĂ„Ëť', 'Ă„â€šĂ˘â‚¬Â¦Ä‚â€šÄąĹş', 'Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â€šÂ¬Ă‚Â¦', 'Ă„â€šĂ˘â‚¬ĹľÄ‚ËĂ˘â‚¬ĹľĂ‹Â', 'Ä‚â€žĂ˘â‚¬ĹˇĂ„Ä…Ă˘â‚¬Ĺˇ']

function read(rel) {
  const full = path.join(ROOT, rel)
  if (!fs.existsSync(full)) throw new Error(`Missing required file: ${rel}`)
  return fs.readFileSync(full, 'utf8')
}

function assertIncludes(text, token, label) {
  if (!text.includes(token)) throw new Error(`${label} missing token: ${token}`)
}

function assertNoMojibake(rel, text) {
  if (rel === guardRel) {
    text = text.replace(/const mojibakeTokens = \[[\s\S]*?\]/, 'const mojibakeTokens = []')
  }
  for (const token of mojibakeTokens) {
    if (text.includes(token)) throw new Error(`${rel} contains mojibake token ${token}`)
  }
}

function changedFiles() {
  const output = cp.execSync('git status --short', { cwd: ROOT, encoding: 'utf8' })
  return output
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => line.replace(/^.{2}\s+/, '').replace(/^"|"$/g, ''))
}

for (const rel of [reportRel, guardRel, testRel, packageRel]) read(rel)

const report = read(reportRel)
const pkg = read(packageRel)

assertIncludes(pkg, 'verify:lf-prod-sot-004j-manual-smoke-and-next-runtime-import-decision', packageRel)
assertIncludes(pkg, guardRel, packageRel)

for (const token of requiredReportTokens) assertIncludes(report, token, reportRel)

if (!legalStatuses.some((status) => report.includes(status))) {
  throw new Error(`${reportRel} must contain one legal 004J-R2 status`)
}

if (report.includes('TO_BE_CREATED_AFTER_COMMIT')) {
  throw new Error('004J-R2 must replace App commit placeholder with real commit SHA')
}

if (report.includes('READY_FOR_004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN')) {
  assertIncludes(report, 'MANUAL_SMOKE_PASS', reportRel)
  assertIncludes(report, 'NEXT_RUNTIME_IMPORT_DECISION:\nTODAY_STATUS_DATE_READONLY_IMPORT_NEXT', reportRel)
  assertIncludes(report, 'Decision reason:', reportRel)
}

if (report.includes('MANUAL_SMOKE_PENDING') || report.includes('MANUAL_SMOKE_RED')) {
  assertIncludes(report, 'NEXT_RUNTIME_IMPORT_BLOCKED', reportRel)
  assertIncludes(report, 'BLOCKED_UNTIL_MANUAL_SMOKE_PASS', reportRel)
  if (report.includes('READY_FOR_004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN')) {
    throw new Error('Pending/red smoke must not be ready for 004K')
  }
}

if (/004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT(?!_PLAN)/.test(report)) {
  throw new Error('004J-R2 must not implement or create runtime import 004K')
}

for (const file of changedFiles()) {
  if (allowedChanged.has(file)) continue
  if (forbiddenExact.has(file) || forbiddenPrefixes.some((prefix) => file === prefix || file.startsWith(prefix))) {
    throw new Error(`Forbidden changed file detected in 004J-R2: ${file}`)
  }
  throw new Error(`Changed file outside 004J-R2 allowlist: ${file}`)
}

for (const rel of [reportRel, guardRel, testRel]) {
  assertNoMojibake(rel, read(rel))
}

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  checked: {
    packageAlias: true,
    reportExists: true,
    guardExists: true,
    testExists: true,
    legalR2Status: true,
    appCommitPlaceholderRemoved: true,
    readyFor004KRequiresSmokePass: true,
    pendingOrRedBlocks004K: true,
    noRuntimeChange: true,
    noUiCssSqlSupabaseApiChange: true,
    noGoogleCalendarChange: true,
    noCaseDetailChange: true,
    noFinanceChange: true
  }
}, null, 2))
