const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = process.cwd()
const planRel = 'src/lib/source-of-truth/today-status-date-readonly-runtime-plan.ts'
const planPath = path.join(ROOT, planRel)

function readPlan() {
  assert.equal(fs.existsSync(planPath), true, `${planRel} must exist`)
  return fs.readFileSync(planPath, 'utf8')
}

test('004K plan file has required plan-only markers', () => {
  const plan = readPlan()
  for (const token of [
    'LF-PROD-SOT-004K',
    'TODAY_STATUS_DATE_READONLY_RUNTIME_IMPORT_PLAN',
    'MANUAL_SMOKE_PASS_AND_TODAY_STATUS_DATE_READONLY_IMPORT_NEXT',
    'NOT_STARTED_IN_004K_PLAN_ONLY',
    'NEXT_RUNTIME_IMPORT_004L_CANDIDATE_AFTER_004K_PASS',
    'TaskStatusLabelChange',
    'EventStatusLabelChange',
    'DoneCancelledPendingLabelChange',
    'datePrecedenceChange',
    'dateOnlyDefaultChange',
    'TodayTaskEventCountChange',
  ]) {
    assert.equal(plan.includes(token), true, `missing ${token}`)
  }
})

test('004K plan does not import UI/runtime files', () => {
  const plan = readPlan()
  for (const token of [
    "from 'react'",
    'from "react"',
    'src/pages/',
    'src/components/',
    'src/styles/',
    '.css',
    'document.',
    'window.',
  ]) {
    assert.equal(plan.includes(token), false, `forbidden token ${token}`)
  }
})