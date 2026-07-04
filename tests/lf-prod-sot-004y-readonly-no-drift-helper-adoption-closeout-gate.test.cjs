const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')
const test = require('node:test')

const root = process.cwd()
const rel = (p) => path.join(root, p)
const exists = (p) => fs.existsSync(rel(p))
const read = (p) => fs.readFileSync(rel(p), 'utf8').replace(/^\uFEFF/, '')

const helperRel = 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'
const guard004xRel = 'scripts/guards/verify-lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.cjs'
const guard004yRel = 'scripts/guards/verify-lf-prod-sot-004y-readonly-no-drift-helper-adoption-closeout-gate.cjs'
const test004xRel = 'tests/lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards.test.cjs'
const test004yRel = 'tests/lf-prod-sot-004y-readonly-no-drift-helper-adoption-closeout-gate.test.cjs'
const report004yRel = '_project/runs/LF-PROD-SOT-004Y_READONLY_NO_DRIFT_HELPER_ADOPTION_CLOSEOUT_GATE.md'
const pkgRel = 'package.json'

const required004YReportTokens = [
  'LF-PROD-SOT-004Y_READONLY_NO_DRIFT_HELPER_ADOPTION_CLOSEOUT_GATE',
  'HELPER_ADOPTION_CLOSEOUT_GATE_ONLY',
  'GUARD_ONLY',
  'NO_RUNTIME_CHANGE',
  'NO_OUTPUT_DRIFT',
  'NO_UI_CHANGE',
  'NO_CSS_CHANGE',
  'NO_SQL_CHANGE',
  'NO_SUPABASE_API_CHANGE',
  'NO_GCAL_CHANGE',
  'NO_CASEDETAIL_CHANGE',
  'NO_FINANCE_CHANGE',
  'NO_RUNTIME_DATA_CHANGE',
  'NO_DATA_FLOWS_CHANGE',
  'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
  'MANUAL_SMOKE_STILL_NOT_PASS',
  'SMOKE_DEFERRED_DEBT_FROM_004M_STILL_ACTIVE',
  'FINAL_ACCEPTANCE_BLOCKED',
  'HELPER_ADOPTION_SERIES_REVIEWED: YES',
  'HELPER_ADOPTION_SERIES_APP_GUARDS_PRESENT: YES',
  'HELPER_ADOPTION_SERIES_OBSIDIAN_STATUS_PRESENT: YES',
  'NEXT_DECISION_REQUIRED: FINAL_MANUAL_SMOKE_GATE_OR_EXPLICIT_NEXT_READONLY_NO_DRIFT_STAGE',
  '004Z_CREATED: NO',
]

function assertIncludesAll(text, tokens, label) {
  for (const token of tokens) assert.ok(text.includes(token), `${label} missing ${token}`)
}

test('004Y package alias is directly after 004X alias', () => {
  const pkg = read(pkgRel)
  const aliasX = '"verify:lf-prod-sot-004x-readonly-no-drift-helper-adoption-scope-guards"'
  const aliasY = '"verify:lf-prod-sot-004y-readonly-no-drift-helper-adoption-closeout-gate"'
  const posX = pkg.indexOf(aliasX)
  const posY = pkg.indexOf(aliasY)
  assert.notEqual(posX, -1, '004X package alias missing')
  assert.notEqual(posY, -1, '004Y package alias missing')
  assert.ok(posY > posX, '004Y alias must be after 004X alias')
  assert.equal(pkg.slice(posX, posY).includes('"check:a25-nearest-planned-action"'), false, '004Y alias must be directly after 004X alias')
})

test('004Y guard test and report exist', () => {
  assert.ok(exists(helperRel), 'helper missing')
  assert.ok(exists(guard004xRel), '004X compatibility guard missing')
  assert.ok(exists(guard004yRel), '004Y guard missing')
  assert.ok(exists(test004xRel), '004X compatibility test missing')
  assert.ok(exists(test004yRel), '004Y node test missing')
  assert.ok(exists(report004yRel), '004Y app report missing')
})

test('004Y report contains closeout gate tokens and no forbidden positive claims', () => {
  const report = read(report004yRel)
  assertIncludesAll(report, required004YReportTokens, report004yRel)

  for (const token of [
    'FINAL_MANUAL_SMOKE_GATE_PASS',
    'PRODUCTION_HOST_SMOKE_PASS',
    'TODAY_SMOKE_PASS',
    'TASKS_SMOKE_PASS',
    'CALENDAR_SMOKE_PASS',
    'LISTS_CARDS_SMOKE_PASS',
    'SMOKE_DEFERRED_DEBT_FROM_004M_RESOLVED',
    'FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE: SATISFIED',
    'FINAL_ACCEPTANCE_PASS',
    'FINAL_ACCEPTANCE_UNBLOCKED',
    'PRODUCTION_VERIFIED',
    'RUNTIME_IMPORT_DONE',
    'OUTPUT_CHANGED',
    'UI_CHANGED',
    'CSS_CHANGED',
    'GCAL_CHANGED',
    'SQL_CHANGED',
  ]) {
    assert.equal(report.includes(token), false, `004Y report contains forbidden claim ${token}`)
  }
})

test('004X compatibility allows selected 004Y and blocks 004Z', () => {
  const guard004x = read(guard004xRel)
  const test004x = read(test004xRel)
  assert.ok(guard004x.includes(report004yRel), '004X guard must verify selected 004Y when present')
  assert.ok(guard004x.includes("assertNoFutureStageCreated('LF-PROD-SOT-004Z')"), '004X guard must block 004Z')
  assert.ok(test004x.includes(report004yRel), '004X test must know 004Y report')
  assert.equal(fs.readdirSync(rel('_project/runs')).some((name) => name.includes('LF-PROD-SOT-004Z')), false, '004Z report exists too early')
})

test('004Y guard uses shared helper contract', () => {
  const guard = read(guard004yRel)
  assert.ok(guard.includes(helperRel), '004Y guard imports helper')
  assertIncludesAll(guard, [
    'assertRequiredTokens',
    'assertForbiddenTokensAbsent',
    'assertNoForbiddenChangedFiles',
    'assertNoFutureStageCreated',
    'readText',
    'assertFileExists',
    'DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES',
    'DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS',
  ], guard004yRel)
})

test('004Y changed files stay inside allowlist and no forbidden runtime paths are changed', () => {
  const allowed = new Set([
    'package.json',
    guard004xRel,
    test004xRel,
    guard004yRel,
    test004yRel,
    report004yRel,
  ])
  const forbiddenPrefixes = [
    'src/pages/',
    'src/components/',
    'src/styles/',
    'src/index.css',
    'src/lib/calendar-items.ts',
    'src/lib/work-items/normalize.ts',
    'src/lib/clients.ts',
    'src/lib/cases.ts',
    'src/lib/google-calendar',
    'src/lib/gcal',
    'src/lib/calendar-sync',
    'src/lib/calendar-provider',
    'src/pages/CaseDetail.tsx',
    'src/lib/finance/',
    'supabase/',
    'migrations/',
    'sql/',
    'runtime/data/',
    'data/flows.json',
    '.env',
    'dist/',
  ]

  const changed = childProcess.execSync('git diff --name-only HEAD', { encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean)
  for (const file of changed) {
    assert.ok(allowed.has(file), `changed file is not allowed in 004Y: ${file}`)
    assert.equal(forbiddenPrefixes.some((prefix) => file.startsWith(prefix)), false, `forbidden changed file: ${file}`)
  }
})
