const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')

const visualPath = 'src/lib/source-of-truth/visual-repository.ts'
const reportPath = '_project/runs/LF-PROD-SOT-003B_VISUAL_REPOSITORY.md'

test('LF-PROD-SOT-003B visual repository exists and exports required contracts', () => {
  assert.equal(fs.existsSync(path.join(root, visualPath)), true)
  const visual = read(visualPath)

  for (const exported of [
    'visualTokenSourceMap',
    'globalVisualContract',
    'pageShellVisualContract',
    'sidebarVisualContract',
    'metricTileVisualContract',
    'recordListVisualContract',
    'detailViewVisualContract',
    'buttonActionVisualContract',
    'formFieldVisualContract',
    'modalDialogVisualContract',
    'badgeToneVisualContract',
    'statusToneVisualContract',
    'severityToneVisualContract',
    'semanticIconVisualContract',
    'financeVisualContract',
    'calendarTaskEventVisualContract',
    'aiDraftVisualContract',
    'visualRepository',
  ]) {
    assert.match(visual, new RegExp(`export\\s+const\\s+${exported}\\b`), `missing ${exported}`)
  }
})

test('global contract contains global CSS and token source markers', () => {
  const visual = read(visualPath)
  for (const marker of [
    'src/index.css',
    'closeflow-tokens.css',
    'closeflow-icons.css',
    'closeflow-visual-source-truth.css',
    'closeflow-record-list-source-truth.css',
    'closeflow-modal-visual-system.css',
    'closeflow-page-header-card-source-truth.css',
    'closeflow-page-header-final-lock.css',
    'closeflow-metric-tiles.css',
    'closeflow-detail-view-source-truth-stage219.css',
    'closeflow-right-rail-source-truth.css',
    'closeflow-finance.css',
  ]) {
    assert.ok(visual.includes(marker), `missing marker ${marker}`)
  }
})

test('shell, tile, list, detail, action, form and modal contracts are present', () => {
  const visual = read(visualPath)
  for (const marker of [
    'pageShellVisualContract',
    'sidebarVisualContract',
    'metricTileVisualContract',
    'recordListVisualContract',
    'detailViewVisualContract',
    'buttonActionVisualContract',
    'formFieldVisualContract',
    'modalDialogVisualContract',
  ]) {
    assert.ok(visual.includes(marker), `missing ${marker}`)
  }
})

test('detail view contract marks CaseDetail as high-risk visual hotspot', () => {
  const visual = read(visualPath)
  assert.ok(visual.includes('CaseDetail.tsx'))
  assert.ok(visual.includes('HIGH_RISK_CASE_DETAIL_HOTSPOT'))
  assert.ok(visual.includes('003B is not allowed to refactor it'))
})

test('action contract records raw button debt without replacing buttons', () => {
  const visual = read(visualPath)
  assert.ok(visual.includes('RAW_BUTTON_DEBT'))
  assert.ok(visual.includes('No button replacement in 003B'))
})

test('tone contracts remain separate from status and date-time truth', () => {
  const visual = read(visualPath)
  assert.ok(visual.includes('statusToneVisualContract'))
  assert.ok(visual.includes('severityToneVisualContract'))
  assert.ok(visual.includes('status-repository.ts'))
  assert.ok(visual.includes('date-time-repository.ts'))
  assert.ok(visual.includes('Status truth stays in status-repository'))
  assert.ok(visual.includes('Date urgency stays in date-time repository'))
})

test('semantic icon contract documents SemanticIcon, lucide and local icon color risk', () => {
  const visual = read(visualPath)
  assert.ok(visual.includes('semanticIconVisualContract'))
  assert.ok(visual.includes('SemanticIcon.tsx'))
  assert.ok(visual.includes('LUCIDE_IMPORT_DEBT'))
  assert.ok(visual.includes('LOCAL_ICON_COLOR'))
})

test('finance and calendar contracts are separated from runtime/data repositories', () => {
  const visual = read(visualPath)
  assert.ok(visual.includes('financeVisualContract'))
  assert.ok(visual.includes('finance runtime/data'))
  assert.ok(visual.includes('calendarTaskEventVisualContract'))
  assert.ok(visual.includes('separate from date-time repository'))
})

test('AI draft visual contract exists', () => {
  const visual = read(visualPath)
  assert.ok(visual.includes('aiDraftVisualContract'))
  assert.ok(visual.includes('AiDrafts.tsx'))
  assert.ok(visual.includes('AdminAiSettings.tsx'))
  assert.ok(visual.includes('LeadAiFollowupDraft'))
})

test('repository is import-free and has no DOM/runtime logic tokens', () => {
  const visual = read(visualPath)
  const importLines = visual.split(/\r?\n/).filter((line) => /^\s*import\s/.test(line) || /\sfrom\s+['"]/.test(line))
  assert.deepEqual(importLines, [])
  for (const token of ['document.', 'window.', 'querySelector', 'classList', 'getElementById', 'createElement', 'appendChild', 'className']) {
    assert.equal(visual.includes(token), false, `forbidden token ${token}`)
  }
})

test('report contains status and untouched markers', () => {
  assert.equal(fs.existsSync(path.join(root, reportPath)), true)
  const report = read(reportPath)
  for (const marker of [
    'VISUAL_REPOSITORY_ADDED',
    'ADOPTION_DEFERRED_TO_NEXT_STAGE',
    'runtime: NOT_TOUCHED',
    'Today: NOT_TOUCHED',
    'Leads: NOT_TOUCHED',
    'Clients: NOT_TOUCHED',
    'Cases: NOT_TOUCHED',
    'CaseDetail: NOT_TOUCHED',
    'Calendar: NOT_TOUCHED',
    'Billing/Finance: NOT_TOUCHED',
    'CSS: NOT_TOUCHED',
    'Tailwind config: NOT_TOUCHED',
    'UI components: NOT_TOUCHED',
    'status repository: NOT_TOUCHED',
    'date-time repository: NOT_TOUCHED',
    'Supabase/API: NOT_TOUCHED',
    'SQL/migrations: NOT_TOUCHED',
    'routing: NOT_TOUCHED',
    'auth: NOT_TOUCHED',
    'data provider: NOT_TOUCHED',
  ]) {
    assert.ok(report.includes(marker), `missing report marker ${marker}`)
  }
})
