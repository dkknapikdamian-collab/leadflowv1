const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = process.cwd()

const reportRel = '_project/runs/LF-PROD-SOT-004H_FIRST_RUNTIME_IMPORT_DECISION_MAP.md'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004h-first-runtime-import-decision-map.cjs'
const packageRel = 'package.json'
const report004gRel = '_project/runs/LF-PROD-SOT-004G_CALENDAR_DATE_TIME_BOUNDARY_ADOPTION_PLAN.md'

function read(rel) {
  const full = path.join(ROOT, rel)
  assert.equal(fs.existsSync(full), true, `${rel} must exist`)
  return fs.readFileSync(full, 'utf8')
}

test('LF-PROD-SOT-004H report, guard and package alias exist', () => {
  const report = read(reportRel)
  const guard = read(guardRel)
  const pkg = read(packageRel)

  assert.ok(report.includes('LF-PROD-SOT-004H'), 'report must identify 004H')
  assert.ok(guard.includes('LF-PROD-SOT-004H'), 'guard must identify 004H')
  assert.ok(pkg.includes('verify:lf-prod-sot-004h-first-runtime-import-decision-map'), 'package alias must exist')
})

test('LF-PROD-SOT-004H selects exactly one first runtime import', () => {
  const report = read(reportRel)
  const selectedMatches = report.match(/selectedFirstImport:\s*TRUE/g) || []

  assert.equal(selectedMatches.length, 1, 'exactly one selectedFirstImport TRUE marker is required')
  assert.ok(report.includes('CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT_FIRST'), 'calendar boundary import must be selected first')
})

test('LF-PROD-SOT-004H lists and evaluates all required candidates', () => {
  const report = read(reportRel)

  for (const token of [
    'CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT',
    'TODAY_STATUS_DATE_READONLY_IMPORT',
    'LISTS_CARDS_STATUS_DATE_READONLY_IMPORT',
    'FORMS_MODALS_ACTION_VISUAL_READONLY_IMPORT',
    'CASEDETAIL_ISOLATED_RUNTIME_IMPORT',
    'FINANCE_RUNTIME_IMPORT',
  ]) {
    assert.ok(report.includes(token), `missing candidate ${token}`)
  }
})

test('LF-PROD-SOT-004H keeps high-risk paths blocked', () => {
  const report = read(reportRel)

  assert.match(
    report,
    /candidateId:\s*CASEDETAIL_ISOLATED_RUNTIME_IMPORT[\s\S]*risk level:\s*VERY_HIGH[\s\S]*recommendation:\s*BLOCKED_FOR_LATER/,
    'CaseDetail must be VERY_HIGH and blocked for later'
  )

  assert.match(
    report,
    /candidateId:\s*FINANCE_RUNTIME_IMPORT[\s\S]*recommendation:\s*BLOCKED_FOR_LATER/,
    'Finance must be blocked for later'
  )
})

test('LF-PROD-SOT-004H references 004G and names next stage', () => {
  const report = read(reportRel)
  const report004g = read(report004gRel)

  assert.ok(report.includes('FIRST_RUNTIME_IMPORT_DECISION_NEEDED_FROM_004G'), '004H must bridge from 004G decision-needed marker')
  assert.ok(report004g.includes('FIRST_RUNTIME_IMPORT_DECISION_NEEDED'), '004G must contain first runtime import decision-needed marker')
  assert.ok(report.includes('NEXT_STAGE_AFTER_004H'), '004H must name next stage')
  assert.ok(report.includes('LF-PROD-SOT-004I_CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT'), '004I must be named')
})

test('LF-PROD-SOT-004H does not introduce forbidden implementation claims', () => {
  const report = read(reportRel)

  for (const token of [
    'Runtime import: FORBIDDEN_IN_004H',
    'UI change: FORBIDDEN',
    'CSS change: FORBIDDEN',
    'SQL change: FORBIDDEN',
    'Supabase/API change: FORBIDDEN',
    'Google Calendar sync change: FORBIDDEN',
    'runtime behavior: NOT_TOUCHED',
  ]) {
    assert.ok(report.includes(token), `missing hard boundary ${token}`)
  }
})
