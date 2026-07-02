const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const ROOT = process.cwd()
const STAGE = 'LF-PROD-SOT-004J'

const reportRel = '_project/runs/LF-PROD-SOT-004J_MANUAL_SMOKE_AND_NEXT_RUNTIME_IMPORT_DECISION.md'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004j-manual-smoke-and-next-runtime-import-decision.cjs'
const testRel = 'tests/lf-prod-sot-004j-manual-smoke-and-next-runtime-import-decision.test.cjs'
const packageRel = 'package.json'

const allowedChanged = new Set([
  packageRel,
  reportRel,
  guardRel,
  testRel,
])

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
]

const legalStatuses = [
  'MANUAL_SMOKE_PENDING / NEXT_RUNTIME_IMPORT_BLOCKED',
  'MANUAL_SMOKE_RED / NEXT_RUNTIME_IMPORT_BLOCKED',
  'MANUAL_SMOKE_PASS / NEXT_RUNTIME_IMPORT_DECISION_SELECTED / READY_FOR_NEXT_RUNTIME_IMPORT_STAGE',
]

const legalCandidates = [
  'TODAY_STATUS_DATE_READONLY_IMPORT_NEXT',
  'LISTS_CARDS_STATUS_DATE_READONLY_IMPORT',
  'FORMS_MODALS_ACTION_VISUAL_READONLY_IMPORT',
  'CASEDETAIL_ISOLATED_RUNTIME_IMPORT',
  'FINANCE_RUNTIME_IMPORT',
]

const mojibakeTokens = ['ÄŹĹĽËť', 'Ä‚â€¦', 'Ä‚â€ž', 'Ä‚Â', 'Ä‚â€š', 'Ä‚ËĂ˘â€šÂ¬', 'Ä‚ËĂ˘â€šÂ¬Ă˘â€žË', 'Ä‚â€¦Ă˘â‚¬Ĺź', 'Ä‚â€¦Ă˘â‚¬Ĺˇ', 'Ä‚â€¦Ă‚Ä˝', 'Ä‚â€¦Ă‚Ĺź', 'Ä‚â€žĂ˘â‚¬Â¦', 'Ä‚â€žĂ˘â€žË', 'Ă„â€šÄąâ€š']

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
const guard = read(guardRel)
const test = read(testRel)
const pkg = read(packageRel)

assertIncludes(pkg, 'verify:lf-prod-sot-004j-manual-smoke-and-next-runtime-import-decision', packageRel)
assertIncludes(pkg, guardRel, packageRel)

for (const token of requiredReportTokens) assertIncludes(report, token, reportRel)

if (!legalStatuses.some((status) => report.includes(status))) {
  throw new Error(`${reportRel} must contain one legal 004J status`)
}

if (report.includes('READY_FOR_NEXT_RUNTIME_IMPORT_STAGE')) {
  if (!report.includes('MANUAL_SMOKE_PASS')) throw new Error('READY_FOR_NEXT_RUNTIME_IMPORT_STAGE requires MANUAL_SMOKE_PASS')
  if (!legalCandidates.some((candidate) => report.includes(`NEXT_RUNTIME_IMPORT_DECISION:\n${candidate}`) || report.includes(candidate))) {
    throw new Error('READY_FOR_NEXT_RUNTIME_IMPORT_STAGE requires explicit next runtime import candidate')
  }
  assertIncludes(report, 'Decision reason:', reportRel)
}

if (report.includes('LF-PROD-SOT-004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN')) {
  if (!report.includes('MANUAL_SMOKE_PASS')) throw new Error('004K next proposed stage requires smoke PASS')
}

for (const file of changedFiles()) {
  if (allowedChanged.has(file)) continue
  if (forbiddenExact.has(file) || forbiddenPrefixes.some((prefix) => file === prefix || file.startsWith(prefix))) {
    throw new Error(`Forbidden changed file detected in 004J: ${file}`)
  }
  throw new Error(`Changed file outside 004J allowlist: ${file}`)
}

for (const rel of [reportRel, guardRel, testRel]) {
  assertNoMojibake(rel, read(rel))
}

if (/004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT(?!_PLAN)/.test(report)) {
  throw new Error('004J must not implement or create runtime import 004K')
}

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  checked: {
    packageAlias: true,
    reportExists: true,
    guardExists: true,
    testExists: true,
    legalStatus: true,
    readyRequiresSmokePass: true,
    noRuntimeChange: true,
    noUiCssSqlSupabaseApiChange: true,
    noGoogleCalendarChange: true,
    noCaseDetailChange: true,
    noFinanceChange: true,
  }
}, null, 2))