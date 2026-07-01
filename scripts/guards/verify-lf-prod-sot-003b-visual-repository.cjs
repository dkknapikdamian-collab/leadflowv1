const fs = require('node:fs')
const path = require('node:path')
const cp = require('node:child_process')

const root = process.cwd()
const rel = (...parts) => path.join(root, ...parts)
const read = (file) => fs.readFileSync(rel(file), 'utf8')
const exists = (file) => fs.existsSync(rel(file))

const failures = []
const requireOk = (condition, message) => {
  if (!condition) failures.push(message)
}

const visualFile = 'src/lib/source-of-truth/visual-repository.ts'
const reportFile = '_project/runs/LF-PROD-SOT-003B_VISUAL_REPOSITORY.md'
const testFile = 'tests/lf-prod-sot-003b-visual-repository.test.cjs'
const packageFile = 'package.json'

requireOk(exists(visualFile), `missing ${visualFile}`)
requireOk(exists(reportFile), `missing ${reportFile}`)
requireOk(exists(testFile), `missing ${testFile}`)
requireOk(exists(packageFile), 'missing package.json')

const visual = exists(visualFile) ? read(visualFile) : ''
const report = exists(reportFile) ? read(reportFile) : ''
const pkg = exists(packageFile) ? JSON.parse(read(packageFile)) : { scripts: {} }

const requiredAlias = 'verify:lf-prod-sot-003b-visual-repository'
requireOk(
  pkg.scripts && pkg.scripts[requiredAlias] === 'node scripts/guards/verify-lf-prod-sot-003b-visual-repository.cjs',
  `missing package alias ${requiredAlias}`,
)

const requiredExports = [
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
]

for (const item of requiredExports) {
  requireOk(new RegExp(`export\\s+const\\s+${item}\\b`).test(visual), `missing export ${item}`)
}

const requiredFields = [
  'sourceFiles',
  'activePrimitives',
  'cssSources',
  'tokenSources',
  'tailwindSources',
  'inlineStyleRisk',
  'patchLayerRisk',
  'legacyVisualRisk',
  'localColorMaps',
  'localToneMaps',
  'localBadgeMaps',
  'localIconColors',
  'typographyPolicy',
  'spacingPolicy',
  'surfacePolicy',
  'radiusPolicy',
  'shadowPolicy',
  'borderPolicy',
  'responsivePolicy',
  'forbiddenPatterns',
  'consumers',
  'riskMarkers',
  'recommendation',
]

for (const field of requiredFields) {
  requireOk(visual.includes(field), `missing contract field ${field}`)
}

const sourceMarkers = [
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
  'Layout.tsx',
  'TodayStable.tsx',
  'Leads.tsx',
  'LeadDetail.tsx',
  'Clients.tsx',
  'ClientDetail.tsx',
  'Cases.tsx',
  'CaseDetail.tsx',
  'TasksStable.tsx',
  'Calendar.tsx',
  'Billing.tsx',
  'AiDrafts.tsx',
  'AdminAiSettings.tsx',
  'ActionIcon.tsx',
  'SemanticIcon.tsx',
]

for (const marker of sourceMarkers) {
  requireOk(visual.includes(marker), `missing source marker ${marker}`)
}

const importLines = visual
  .split(/\r?\n/)
  .filter((line) => /^\s*import\s/.test(line) || /\sfrom\s+['"]/.test(line))

requireOk(importLines.length === 0, `visual repository must be import-free, got: ${importLines.join(' | ')}`)

const runtimeForbidden = ['document.', 'window.', 'querySelector', 'classList', 'getElementById', 'createElement', 'appendChild']
for (const token of runtimeForbidden) {
  requireOk(!visual.includes(token), `visual repository contains runtime token ${token}`)
}

requireOk(!visual.includes('className'), 'visual repository must not define className styling')
requireOk(!visual.includes('ADOPTION_ACTIVE'), 'visual repository must not claim active runtime adoption')

const changed = new Set()
try {
  const diffFiles = cp.execSync('git diff --name-only HEAD', { cwd: root, encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean)
  const untracked = cp.execSync('git ls-files --others --exclude-standard', { cwd: root, encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean)
  for (const file of [...diffFiles, ...untracked]) changed.add(file.replace(/\\/g, '/'))
} catch (error) {
  failures.push(`git changed-file inspection failed: ${error.message}`)
}

const allowedChanged = new Set([
  'src/lib/source-of-truth/visual-repository.ts',
  'scripts/guards/verify-lf-prod-sot-003b-visual-repository.cjs',
  'tests/lf-prod-sot-003b-visual-repository.test.cjs',
  '_project/runs/LF-PROD-SOT-003B_VISUAL_REPOSITORY.md',
  'package.json',
])

for (const file of changed) {
  if (!allowedChanged.has(file)) {
    failures.push(`unexpected changed file in 003B: ${file}`)
  }
  requireOk(!file.endsWith('.css'), `CSS touched in 003B: ${file}`)
  requireOk(!/tailwind\.config\./.test(file), `Tailwind config touched in 003B: ${file}`)
  requireOk(!file.startsWith('src/pages/'), `runtime page touched in 003B: ${file}`)
  requireOk(!file.startsWith('src/components/'), `runtime component touched in 003B: ${file}`)
  requireOk(!file.startsWith('src/server/'), `server/API touched in 003B: ${file}`)
  requireOk(!file.startsWith('supabase/') && !file.includes('/migrations/'), `SQL/Supabase touched in 003B: ${file}`)
}

requireOk(!changed.has('src/lib/source-of-truth/status-repository.ts'), 'forbidden change: status-repository.ts')
requireOk(!changed.has('src/lib/source-of-truth/date-time-repository.ts'), 'forbidden change: date-time-repository.ts')

const mojibakeTokens = ['Ã', 'Â', 'â€™', 'â€', '�']
for (const [file, content] of [
  [visualFile, visual],
  [reportFile, report],
  [testFile, exists(testFile) ? read(testFile) : ''],
]) {
  for (const token of mojibakeTokens) {
    requireOk(!content.includes(token), `mojibake token ${token} in ${file}`)
  }
}

requireOk(report.includes('VISUAL_REPOSITORY_ADDED'), 'report must include VISUAL_REPOSITORY_ADDED')
requireOk(report.includes('ADOPTION_DEFERRED_TO_NEXT_STAGE'), 'report must mark runtime adoption deferred')
requireOk(report.includes('runtime: NOT_TOUCHED'), 'report missing runtime untouched marker')
requireOk(report.includes('CSS: NOT_TOUCHED'), 'report missing CSS untouched marker')
requireOk(report.includes('status repository: NOT_TOUCHED'), 'report missing status repository untouched marker')
requireOk(report.includes('date-time repository: NOT_TOUCHED'), 'report missing date-time repository untouched marker')

if (failures.length) {
  console.error(JSON.stringify({ ok: false, guard: requiredAlias, failures }, null, 2))
  process.exit(1)
}

console.log(JSON.stringify({
  ok: true,
  guard: requiredAlias,
  checked: {
    requiredExports: requiredExports.length,
    requiredFields: requiredFields.length,
    sourceMarkers: sourceMarkers.length,
    changedFiles: [...changed].sort(),
    adoption: 'ADOPTION_DEFERRED_TO_NEXT_STAGE',
  },
}, null, 2))
