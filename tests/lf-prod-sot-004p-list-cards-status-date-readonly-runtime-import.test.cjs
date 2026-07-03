const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const root = process.cwd()
const rel = (p) => path.join(root, p)
const read = (p) => fs.readFileSync(rel(p), 'utf8')
const exists = (p) => fs.existsSync(rel(p))
const adapterRel = 'src/lib/source-of-truth/list-cards-status-date-readonly-runtime.ts'
const reportRel = '_project/runs/LF-PROD-SOT-004P_LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'
const hosts = ['src/lib/work-items/normalize.ts', 'src/lib/clients.ts', 'src/lib/cases.ts']

test('004P contract exists and keeps smoke debt active', () => {
  assert.equal(exists(adapterRel), true)
  assert.equal(exists(reportRel), true)
  assert.equal(exists('_project/runs/LF-PROD-SOT-004M-R2_OWNER_DECISION_SMOKE_DEFERRED.md'), true)
  assert.equal(exists('_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'), true)
  assert.equal(exists('_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md'), true)
  const adapter = read(adapterRel)
  const report = read(reportRel)
  const repN = read('_project/runs/LF-PROD-SOT-004N_TASKS_STATUS_DATE_READONLY_RUNTIME_IMPORT.md')
  const repO = read('_project/runs/LF-PROD-SOT-004O_CALENDAR_STATUS_DATE_READONLY_RUNTIME_IMPORT.md')
  for (const marker of [
    'LF-PROD-SOT-004P',
    'LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT',
    'READONLY_METADATA_IMPORT_ONLY',
    'NO_OUTPUT_DRIFT',
    'NO_RUNTIME_BEHAVIOR_CHANGE',
    'SMOKE_DEFERRED_DEBT_FROM_004M',
    'FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE',
    'ListCardCountChange: FORBIDDEN',
    'ListSortChange: FORBIDDEN',
    'ListFilterChange: FORBIDDEN',
    'GoogleCalendarSyncChange: FORBIDDEN',
  ]) assert.ok(adapter.includes(marker), marker)
  for (const marker of [
    'LISTS_CARDS_STATUS_DATE_READONLY_RUNTIME_IMPORT_ADDED',
    'READONLY_METADATA_IMPORT_ONLY',
    'NO_OUTPUT_DRIFT',
    'list counts changed: NO',
    'list sorting changed: NO',
    'list filters changed: NO',
    '004Q created: NO',
  ]) assert.ok(report.includes(marker), marker)
  assert.ok(repN.includes('LOCAL_RERUN_PASS_AFTER_R2'))
  assert.ok(repO.includes('NO_GCAL_CHANGE'))
})

test('004P host imports are void-only and 004Q is absent', () => {
  for (const host of hosts) {
    const text = read(host)
    assert.ok(text.includes('list-cards-status-date-readonly-runtime'))
    assert.ok(text.includes('void listCardsStatusDateReadonlyRuntimeReport'))
    assert.equal(text.includes('return listCardsStatusDateReadonlyRuntimeReport'), false)
    assert.equal(text.includes('if (listCardsStatusDateReadonlyRuntimeReport'), false)
  }
  assert.equal(fs.readdirSync(rel('_project/runs')).some((name) => name.includes('LF-PROD-SOT-004Q')), false)
})

test('004P adapter has no forbidden imports', () => {
  const imports = read(adapterRel).split(/\r?\n/).filter((line) => /^\s*import\b/.test(line)).join('\n')
  for (const snippet of ['react', 'react-dom', '../pages/', './pages/', '../components/', './components/', '.css', 'google-calendar', 'gcal', 'calendar-sync', 'calendar-provider', 'CaseDetail', 'case-detail', 'finance/', 'supabase', 'fetch(', 'axios']) {
    assert.equal(imports.includes(snippet), false, snippet)
  }
})