const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const ROOT = process.cwd()
const STAGE = 'LF-PROD-SOT-004H'

const guardRel = 'scripts/guards/verify-lf-prod-sot-004h-first-runtime-import-decision-map.cjs'
const testRel = 'tests/lf-prod-sot-004h-first-runtime-import-decision-map.test.cjs'
const reportRel = '_project/runs/LF-PROD-SOT-004H_FIRST_RUNTIME_IMPORT_DECISION_MAP.md'
const report004gRel = '_project/runs/LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN.md'
const packageRel = 'package.json'

const requiredReportTokens = [
  'LF-PROD-SOT-004H',
  'FIRST_RUNTIME_IMPORT_DECISION_MAP_ADDED',
  'FIRST_RUNTIME_IMPORT_DECISION_NEEDED_FROM_004G',
  'LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN',
  'CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT',
  'TODAY_STATUS_DATE_READONLY_IMPORT',
  'LISTS_CARDS_STATUS_DATE_READONLY_IMPORT',
  'FORMS_MODALS_ACTION_VISUAL_READONLY_IMPORT',
  'CASEDETAIL_ISOLATED_RUNTIME_IMPORT',
  'FINANCE_RUNTIME_IMPORT',
  'risk level: VERY_HIGH',
  'recommendation: BLOCKED_FOR_LATER',
  'Google Calendar sync change: FORBIDDEN',
  'Runtime import: FORBIDDEN_IN_004H',
  'FIRST_RUNTIME_IMPORT_DECISION',
  'CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT_FIRST',
  'NEXT_STAGE_AFTER_004H',
  'LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT',
  'runtime behavior: NOT_TOUCHED',
  'KONIEC ETAPU LF-PROD-SOT-004H',
]

const required004gTokens = [
  'FIRST_RUNTIME_IMPORT_DECISION_NEEDED',
  'KONIEC ETAPU LF-PROD-SOT-004G',
]

const allowedChanged = new Set([
  packageRel,
  guardRel,
  testRel,
  reportRel,
])

const forbiddenChangedPrefixes = [
  'src/pages/',
  'src/components/',
  'src/ui-system/',
  'src/styles/',
  'src/lib/source-of-truth/',
  'src/lib/calendar-items.ts',
  'src/lib/scheduling.ts',
  'src/lib/work-items/',
  'src/lib/finance/',
  'supabase/',
  'migrations/',
  'sql/',
]

const mojibakeTokens = ['�', 'Å', 'Ä', 'Ã', 'Â', 'â€', 'â€™', 'Å›', 'Å‚', 'Å¼', 'Åº', 'Ä…', 'Ä™', 'Ăł']

function read(rel) {
  const full = path.join(ROOT, rel)
  if (!fs.existsSync(full)) throw new Error(`Missing required file: ${rel}`)
  return fs.readFileSync(full, 'utf8')
}

function assertIncludes(text, token, label) {
  if (!text.includes(token)) throw new Error(`${label} missing token: ${token}`)
}

function assertNoMojibake(rel, text) {
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

const report = read(reportRel)
const report004g = read(report004gRel)
const guard = read(guardRel)
const test = read(testRel)
const pkg = read(packageRel)

for (const token of requiredReportTokens) {
  assertIncludes(report, token, reportRel)
}

for (const token of required004gTokens) {
  assertIncludes(report004g, token, report004gRel)
}

assertIncludes(pkg, 'verify:lf-prod-sot-004h-first-runtime-import-decision-map', packageRel)
assertIncludes(pkg, guardRel, packageRel)

const selectedMatches = report.match(/selectedFirstImport:\s*TRUE/g) || []
if (selectedMatches.length !== 1) {
  throw new Error(`${reportRel} must contain exactly one selectedFirstImport: TRUE marker, found ${selectedMatches.length}`)
}

if (!/candidateId:\s*CASEDETAIL_ISOLATED_RUNTIME_IMPORT[\s\S]*risk level:\s*VERY_HIGH[\s\S]*recommendation:\s*BLOCKED_FOR_LATER/.test(report)) {
  throw new Error(`${reportRel} must block CaseDetail as VERY_HIGH / BLOCKED_FOR_LATER`)
}

if (!/candidateId:\s*FINANCE_RUNTIME_IMPORT[\s\S]*recommendation:\s*BLOCKED_FOR_LATER/.test(report)) {
  throw new Error(`${reportRel} must block Finance as BLOCKED_FOR_LATER`)
}

for (const rel of [reportRel, report004gRel, guardRel, testRel]) {
  assertNoMojibake(rel, read(rel))
}

for (const file of changedFiles()) {
  if (allowedChanged.has(file)) continue
  if (forbiddenChangedPrefixes.some((prefix) => file === prefix || file.startsWith(prefix))) {
    throw new Error(`Forbidden changed file detected in 004H: ${file}`)
  }
}

console.log(JSON.stringify({
  ok: true,
  stage: STAGE,
  checked: {
    packageAlias: true,
    reportExists: true,
    guardExists: true,
    testExists: true,
    selectedFirstImportExactlyOne: true,
    selectedFirstImport: 'CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT_FIRST',
    candidatesChecked: 6,
    caseDetailBlocked: true,
    financeBlocked: true,
    noRuntimeChange: true,
    noUiChange: true,
    noCssChange: true,
    noSqlChange: true,
    noMojibake: true
  }
}, null, 2))
