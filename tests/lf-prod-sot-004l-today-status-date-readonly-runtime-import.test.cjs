const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = process.cwd()
const adapterRel = 'src/lib/source-of-truth/today-status-date-readonly-runtime.ts'
const hostRel = 'src/lib/work-items/normalize.ts'
const reportRel = '_project/runs/LF-PROD-SOT-004L_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'

function read(rel) {
  const full = path.join(ROOT, rel)
  assert.equal(fs.existsSync(full), true, `${rel} must exist`)
  return fs.readFileSync(full, 'utf8')
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

test('004L adapter has required metadata-only markers', () => {
  const adapter = read(adapterRel)
  for (const token of [
    'LF-PROD-SOT-004L',
    'TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT',
    'LF-PROD-SOT-004K_TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN',
    'TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN_CLOSED',
    'READONLY_METADATA_IMPORT_ONLY',
    'READONLY_RUNTIME_BOUNDARY_IMPORT',
    'NO_OUTPUT_DRIFT',
    'FORBIDDEN',
    'LF-PROD-SOT-004M_TODAY_RUNTIME_IMPORT_SMOKE_AND_DECISION',
  ]) assert.equal(adapter.includes(token), true, `missing ${token}`)
})

test('004L adapter does not import forbidden runtime/UI areas', () => {
  const adapter = read(adapterRel)
  for (const token of ["from 'react'", 'from "react"', 'document.', 'window.', 'src/pages/', 'src/components/', 'src/styles/', '.css', 'supabase', 'google-calendar', 'CaseDetail', 'Finance']) {
    assert.equal(adapter.includes(token), false, `forbidden token ${token}`)
  }
})

test('004L import host is metadata-only void import', () => {
  const host = read(hostRel)
  assert.equal(host.includes("from '../source-of-truth/today-status-date-readonly-runtime'"), true)
  assert.equal(host.includes('void todayStatusDateReadonlyRuntimeReport'), true)
  assert.equal((host.match(/todayStatusDateReadonlyRuntimeReport/g) || []).length, 2)
})

test('004L report exists and 004M file is not created', () => {
  const report = read(reportRel)
  assert.equal(report.includes('TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED'), true)
  assert.equal(report.includes('MANUAL_SMOKE_REQUIRED_AFTER_004L'), true)
  const files = walk(ROOT)
  assert.equal(files.some((file) => /004M/.test(file)), false)
})