const assert = require('assert')
const fs = require('fs')
const path = require('path')
const test = require('node:test')

const ROOT = process.cwd()
const adapterRel = 'src/lib/source-of-truth/calendar-date-time-boundary-readonly-runtime.ts'
const helperRel = 'src/lib/calendar-operational-entry-contract.ts'
const helperCandidates = [
  helperRel,
  'src/lib/calendar-items.ts',
  'src/lib/scheduling.ts',
  'src/lib/work-items/normalize.ts',
]

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8')
}

test('004I adapter exists and carries required no-drift markers', () => {
  const text = read(adapterRel)
  for (const token of [
    'LF-PROD-SOT-004I',
    'CALENDAR_DATE_TIME_BOUNDARY_READONLY_RUNTIME_IMPORT',
    'CALENDAR_DATE_TIME_BOUNDARY_READONLY_IMPORT_FIRST',
    'READONLY_HELPER_IMPORT_ONLY',
    'READONLY_RUNTIME_IMPORT_NO_OUTPUT_DRIFT',
    'GoogleCalendarSyncChange',
    'GoogleCalendarMapperChange',
    'FinanceRuntimeAdoption',
    'CaseDetailRuntimeAdoption',
    'REQUIRED_AFTER_004I_MANUAL_SMOKE',
  ]) {
    assert.ok(text.includes(token), `missing ${token}`)
  }
})

test('004I adapter imports only read-only SOT repositories', () => {
  const text = read(adapterRel)
  const imports = text.split(/\r?\n/).filter((line) => line.trim().startsWith('import '))
  assert.equal(imports.length, 5)
  const allowed = [
    './status-repository',
    './date-time-repository',
    './visual-repository',
    './runtime-adoption-readonly',
    './calendar-date-time-boundary-plan',
  ]
  for (const line of imports) {
    assert.ok(allowed.some((spec) => line.includes(`'${spec}'`) || line.includes(`"${spec}"`)), `unexpected import: ${line}`)
    for (const token of ['react', 'src/pages', 'src/components', 'ui-system', '.css', 'google-calendar', 'remote-calendar', 'firebase']) {
      assert.equal(line.toLowerCase().includes(token), false, `forbidden import token: ${token}`)
    }
  }
})

test('004I has exactly one runtime helper import and it is read-only boundary metadata', () => {
  const importers = helperCandidates.filter((rel) => fs.existsSync(path.join(ROOT, rel)) && read(rel).includes('calendar-date-time-boundary-readonly-runtime'))
  assert.deepEqual(importers, [helperRel])
  const helper = read(helperRel)
  assert.ok(helper.includes('calendarDateTimeBoundaryReadonlyRuntimeImportBoundary'))
  assert.ok(helper.includes('void calendarDateTimeBoundaryReadonlyRuntimeImportBoundary'))
  assert.equal(/return\s+[{(]?[\s\S]{0,400}calendarDateTimeBoundaryReadonlyRuntimeImportBoundary/.test(helper), false)
})

test('004I fixture baseline remains no-output-drift by contract', () => {
  const before = {
    tasks: [
      { id: 'task-scheduled', scheduledAt: '2026-07-02T09:00:00.000Z', status: 'open', dayKey: '2026-07-02' },
      { id: 'task-due', dueAt: '2026-07-03T09:00:00.000Z', status: 'open', dayKey: '2026-07-03' },
      { id: 'task-split', date: '2026-07-04', time: '09:00', status: 'open', dayKey: '2026-07-04' },
      { id: 'task-date-only', date: '2026-07-05', defaultTime: 'T09:00', status: 'open', dayKey: '2026-07-05' },
    ],
    events: [
      { id: 'event-start', startAt: '2026-07-02T10:00:00.000Z', status: 'open', dayKey: '2026-07-02' },
      { id: 'event-split', date: '2026-07-04', time: '11:00', status: 'open', dayKey: '2026-07-04' },
      { id: 'event-date-only', date: '2026-07-05', defaultTime: 'T09:00', status: 'open', dayKey: '2026-07-05' },
    ],
    counts: { calendarDay: 3, todayTasks: 1, todayEvents: 1 },
    labels: ['done', 'cancelled', 'pending'],
    financeReferenceOnly: { dateOnlyDefault: 'T23:59:59', adoptedIn004I: false },
  }
  const after = JSON.parse(JSON.stringify(before))
  assert.deepStrictEqual(after, before)
})