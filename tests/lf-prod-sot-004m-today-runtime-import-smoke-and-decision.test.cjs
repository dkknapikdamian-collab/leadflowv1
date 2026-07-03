const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = process.cwd()
const reportRel = '_project/runs/LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION.md'
const previousReportRel = '_project/runs/LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const packageRel = 'package.json'

function full(rel) {
  return path.join(ROOT, rel)
}

function read(rel) {
  assert.equal(fs.existsSync(full(rel)), true, `${rel} must exist`)
  return fs.readFileSync(full(rel), 'utf8')
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'dist'].includes(entry.name)) continue
    const abs = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(abs, out)
    else out.push(path.relative(ROOT, abs).replace(/\\/g, '/'))
  }
  return out
}

test('004M report exists and links 004L metadata-only boundary', () => {
  const report = read(reportRel)
  const previous = read(previousReportRel)
  assert.equal(report.includes('LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT'), true)
  assert.equal(report.includes('READONLY_METADATA_IMPORT_ONLY'), true)
  assert.equal(report.includes('MANUAL_SMOKE_REQUIRED_AFTER_004L'), true)
  assert.equal(previous.includes('MANUAL_SMOKE_REQUIRED_AFTER_004L'), true)
})

test('004M report records pending smoke and blocks next runtime import', () => {
  const report = read(reportRel)
  for (const token of [
    'MANUAL_SMOKE_PENDING',
    'NEXT_RUNTIME_IMPORT_BLOCKED',
    'Manual smoke checklist',
    'Smoke result',
    'Decision',
    'DECISION_REQUIRED_BEFORE_004N',
  ]) assert.equal(report.includes(token), true, `missing ${token}`)
})

test('004M is no-runtime/no-ui/no-css/no-sql/no-gcal change', () => {
  const report = read(reportRel)
  for (const token of [
    'NO_RUNTIME_CHANGE',
    'NO_UI_CHANGE',
    'NO_CSS_CHANGE',
    'NO_SQL_CHANGE',
    'NO_GCAL_CHANGE',
    'runtime changes in 004M: NONE',
    'Today runtime: NOT_TOUCHED',
    'Google Calendar sync: NOT_TOUCHED',
    'CaseDetail runtime: NOT_TOUCHED',
    'Finance runtime: NOT_TOUCHED',
  ]) assert.equal(report.includes(token), true, `missing ${token}`)
})

test('004M does not create 004N', () => {
  const report = read(reportRel)
  assert.equal(report.includes('Nie tworzono 004N'), true)
  const files = walk(ROOT)
  assert.deepEqual(files.filter((file) => /004N|004n/.test(file)), [])
})

test('004M package alias exists', () => {
  const pkg = read(packageRel)
  assert.equal(pkg.includes('verify:lf-prod-sot-004m-today-runtime-import-smoke-and-decision'), true)
  assert.equal(pkg.includes('scripts/guards/verify-lf-prod-sot-004m-today-runtime-import-smoke-and-decision.cjs'), true)
})

test('004M report has no mojibake', () => {
  const report = read(reportRel)
  assert.equal(/[Ă…Ă„ĂĂ‚ďż˝]/.test(report), false)
})
