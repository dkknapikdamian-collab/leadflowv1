const assert = require('assert/strict')
const fs = require('fs')
const path = require('path')
const test = require('node:test')

const ROOT = process.cwd()

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8')
}

test('LF-PROD-SOT-004B read-only runtime adoption contract is present and sealed', () => {
  const runtime = read('src/lib/source-of-truth/runtime-adoption-readonly.ts')

  for (const token of [
    'runtimeAdoptionStage',
    'runtimeAdoptionMode',
    'runtimeAdoptionSourceMap',
    'safeReadOnlyAdoptionAreas',
    'blockedRuntimeAdoptionAreas',
    'runtimeAdoptionHardRules',
    'runtimeAdoptionRepositoryBoundaries',
    'runtimeAdoptionNoOutputDriftPolicy',
    'runtimeAdoptionNextStages',
    'runtimeAdoptionReport',
    'LF-PROD-SOT-004B',
    'SAFE_READ_ONLY_ADOPTION_STAGE_1',
    'runtimeBehaviorChange',
    'uiChange',
    'cssChange',
    'dataWriteChange',
    'FORBIDDEN',
    'NOT_STARTED',
    'GUARDS_TESTS_ADAPTERS_ONLY',
    'visibleOutputDrift',
  ]) {
    assert.equal(runtime.includes(token), true, `runtime contract missing ${token}`)
  }

  for (const token of [
    'document.',
    'window.',
    'querySelector',
    'classList',
    'getElementById',
    'createElement',
    'appendChild',
    "from 'react'",
    'from "react"',
    'src/pages/',
    'src/components/',
    'src/styles/',
    '.css',
    'tailwind',
    'supabase',
  ]) {
    assert.equal(runtime.includes(token), false, `runtime contract must not include ${token}`)
  }
})

test('LF-PROD-SOT-004B package alias, guard and report are wired', () => {
  const pkg = read('package.json')
  const guard = read('scripts/guards/verify-lf-prod-sot-004b-readonly-runtime-adoption.cjs')
  const report = read('_project/runs/LF-PROD-SOT-004B_SAFE_RUNTIME_ADOPTION_STAGE_1.md')

  assert.equal(pkg.includes('"verify:lf-prod-sot-004b-readonly-runtime-adoption"'), true)
  assert.equal(pkg.includes('node scripts/guards/verify-lf-prod-sot-004b-readonly-runtime-adoption.cjs'), true)

  assert.equal(guard.includes('LF-PROD-SOT-004B'), true)
  assert.equal(guard.includes('SAFE_READ_ONLY_ADOPTION_STAGE_1'), true)
  assert.equal(guard.includes('allowedChangedFiles'), true)
  assert.equal(guard.includes('runtime-adoption-readonly.ts'), true)

  assert.equal(report.includes('## Linki SOT / mapa wejściowa'), true)
  assert.equal(report.includes('LF-PROD-SOT-004A_RUNTIME_ADOPTION_MAP.md'), true)
  assert.equal(report.includes('00_MAPY_I_ZALEZNOSCI_SOT.md'), true)
  assert.equal(report.includes('runtime: NOT_TOUCHED'), true)
  assert.equal(report.includes('LF-PROD-SOT-004C: NOT_STARTED'), true)
})
