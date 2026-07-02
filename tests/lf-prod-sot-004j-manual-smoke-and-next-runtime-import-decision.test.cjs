const assert = require('assert')
const fs = require('fs')
const path = require('path')
const cp = require('child_process')
const test = require('node:test')

const ROOT = process.cwd()
const reportRel = '_project/runs/LF-PROD-SOT-004J_MANUAL_SMOKE_AND_NEXT_RUNTIME_IMPORT_DECISION.md'
const packageRel = 'package.json'
const guardRel = 'scripts/guards/verify-lf-prod-sot-004j-manual-smoke-and-next-runtime-import-decision.cjs'
const testRel = 'tests/lf-prod-sot-004j-manual-smoke-and-next-runtime-import-decision.test.cjs'

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

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8')
}

function changedFiles() {
  const output = cp.execSync('git status --short', { cwd: ROOT, encoding: 'utf8' })
  return output
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => line.replace(/^.{2}\s+/, '').replace(/^"|"$/g, ''))
}

test('004J report exists and has required decision sections', () => {
  assert.ok(fs.existsSync(path.join(ROOT, reportRel)), 'missing report')
  const report = read(reportRel)
  for (const section of [
    '## Status',
    '## Linki SOT / mapa wejsciowa',
    '## Manual smoke checklist',
    '## Smoke result',
    '## Next runtime import decision',
    '## Czego nie ruszano',
    '## Risk audit',
    '## Wyniki wykonanych komend',
  ]) {
    assert.ok(report.includes(section), `missing section ${section}`)
  }
})

test('004J package alias and files exist', () => {
  const pkg = read(packageRel)
  assert.ok(pkg.includes('verify:lf-prod-sot-004j-manual-smoke-and-next-runtime-import-decision'))
  assert.ok(pkg.includes(guardRel))
  assert.ok(fs.existsSync(path.join(ROOT, guardRel)), 'missing guard')
  assert.ok(fs.existsSync(path.join(ROOT, testRel)), 'missing test')
})

test('004J cannot mark ready without smoke PASS, explicit decision, reason, and no runtime change', () => {
  const report = read(reportRel)
  if (!report.includes('READY_FOR_NEXT_RUNTIME_IMPORT_STAGE')) return
  assert.ok(report.includes('MANUAL_SMOKE_PASS'), 'ready requires smoke PASS')
  assert.ok(report.includes('NEXT_RUNTIME_IMPORT_DECISION:'), 'ready requires explicit decision')
  assert.ok(report.includes('Decision reason:'), 'ready requires reason')
  assert.ok(report.includes('runtime changes in 004J: NONE'), 'ready requires zero runtime changes confirmation')
})

test('004J pending or red blocks the next runtime import', () => {
  const report = read(reportRel)
  if (report.includes('MANUAL_SMOKE_PENDING') || report.includes('MANUAL_SMOKE_RED')) {
    assert.ok(report.includes('NEXT_RUNTIME_IMPORT_BLOCKED'))
    assert.ok(report.includes('BLOCKED_UNTIL_MANUAL_SMOKE_PASS'))
    assert.equal(report.includes('READY_FOR_NEXT_RUNTIME_IMPORT_STAGE'), false)
  }
})

test('004J changed files do not include runtime, UI, CSS, SQL, Supabase, GCal, CaseDetail, or Finance', () => {
  const allowed = new Set([packageRel, reportRel, guardRel, testRel])
  for (const file of changedFiles()) {
    if (allowed.has(file)) continue
    assert.equal(forbiddenExact.has(file), false, `forbidden exact file changed: ${file}`)
    assert.equal(forbiddenPrefixes.some((prefix) => file === prefix || file.startsWith(prefix)), false, `forbidden prefix changed: ${file}`)
    assert.fail(`changed file outside 004J allowlist: ${file}`)
  }
})