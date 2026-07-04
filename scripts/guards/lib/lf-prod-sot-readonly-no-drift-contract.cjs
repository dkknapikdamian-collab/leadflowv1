const fs = require('node:fs')
const path = require('node:path')
const childProcess = require('node:child_process')

const root = process.cwd()
const rel = (p) => path.join(root, p)

const DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES = [
  'src/pages/',
  'src/components/',
  'src/styles/',
  'src/index.css',
  'src/lib/calendar-items.ts',
  'src/lib/work-items/normalize.ts',
  'src/lib/clients.ts',
  'src/lib/cases.ts',
  'src/lib/google-calendar',
  'src/lib/gcal',
  'src/lib/calendar-sync',
  'src/lib/calendar-provider',
  'src/pages/CaseDetail.tsx',
  'src/lib/finance/',
  'supabase/',
  'migrations/',
  'sql/',
  'runtime/data/',
  'data/flows.json',
  '.env',
  'dist/',
]

const DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS = [
  'FINAL_MANUAL_SMOKE_GATE_PASS',
  'PRODUCTION_HOST_SMOKE_PASS',
  'TODAY_SMOKE_PASS',
  'TASKS_SMOKE_PASS',
  'CALENDAR_SMOKE_PASS',
  'LISTS_CARDS_SMOKE_PASS',
  'SMOKE_DEFERRED_DEBT_FROM_004M_RESOLVED',
  'FULL_MANUAL_SMOKE_REQUIRED_BEFORE_FINAL_ACCEPTANCE: SATISFIED',
  'FINAL_ACCEPTANCE_PASS',
  'FINAL_ACCEPTANCE_UNBLOCKED',
  'PRODUCTION_VERIFIED',
  'RUNTIME_IMPORT_DONE',
  'OUTPUT_CHANGED',
  'UI_CHANGED',
  'CSS_CHANGED',
  'GCAL_CHANGED',
  'SQL_CHANGED',
]

function fail(message) {
  throw new Error(message)
}

function assertFileExists(filePath) {
  if (!fs.existsSync(rel(filePath))) fail('missing file: ' + filePath)
}

function readText(filePath) {
  assertFileExists(filePath)
  return fs.readFileSync(rel(filePath), 'utf8').replace(/^\uFEFF/, '')
}

function assertRequiredTokens(text, tokens, label) {
  if (!Array.isArray(tokens)) fail(label + ' tokens must be an array')
  for (const token of tokens) {
    if (!text.includes(token)) fail(label + ' missing required token: ' + token)
  }
}

function assertForbiddenTokensAbsent(text, tokens, label) {
  if (!Array.isArray(tokens)) fail(label + ' forbidden tokens must be an array')
  for (const token of tokens) {
    if (text.includes(token)) fail(label + ' contains forbidden token: ' + token)
  }
}

function assertNoFutureStageCreated(stagePrefix) {
  const runsDir = rel('_project/runs')
  if (!fs.existsSync(runsDir)) fail('missing runs directory: _project/runs')
  const hit = fs.readdirSync(runsDir).find((name) => name.includes(stagePrefix))
  if (hit) fail('future stage exists too early: ' + hit)
}

function getChangedFiles(gitBaseRef) {
  const base = gitBaseRef || 'HEAD'
  const out = childProcess.execSync('git diff --name-only ' + base, { encoding: 'utf8' })
  return out.trim().split(/\r?\n/).filter(Boolean)
}

function assertNoForbiddenChangedFiles(options) {
  const opts = options || {}
  const allowedChangedFiles = new Set(opts.allowedChangedFiles || [])
  const forbiddenPrefixes = opts.forbiddenPrefixes || []
  const changedFiles = opts.changedFiles || getChangedFiles(opts.gitBaseRef || 'HEAD')

  for (const file of changedFiles) {
    for (const prefix of forbiddenPrefixes) {
      if (file.startsWith(prefix)) fail('forbidden changed file prefix: ' + prefix + ' file: ' + file)
    }
    if (!allowedChangedFiles.has(file)) fail('changed file is not in allowlist: ' + file)
  }
}

module.exports = {
  assertRequiredTokens,
  assertForbiddenTokensAbsent,
  assertNoForbiddenChangedFiles,
  assertNoFutureStageCreated,
  assertFileExists,
  readText,
  DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES,
  DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS,
}
