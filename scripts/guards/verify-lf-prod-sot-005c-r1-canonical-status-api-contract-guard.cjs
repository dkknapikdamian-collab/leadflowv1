const path = require('node:path')
const childProcess = require('node:child_process')

const helperRel = 'scripts/guards/lib/lf-prod-sot-readonly-no-drift-contract.cjs'
const helper = require(path.join(process.cwd(), helperRel))

const {
  assertRequiredTokens,
  assertForbiddenTokensAbsent,
  assertNoForbiddenChangedFiles,
  assertNoFutureStageCreated,
  assertFileExists,
  readText,
  DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES,
  DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS,
} = helper

const stage = 'LF-PROD-SOT-005C-R1'

function fail(message) {
  console.error('[005C-R1] FAIL ' + message)
  process.exit(1)
}

function assertHelperContract() {
  for (const name of [
    'assertRequiredTokens',
    'assertForbiddenTokensAbsent',
    'assertNoForbiddenChangedFiles',
    'assertNoFutureStageCreated',
    'readText',
    'assertFileExists',
  ]) {
    if (typeof helper[name] !== 'function') fail('helper missing function export: ' + name)
  }
  if (!Array.isArray(DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES)) fail('helper missing DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES')
  if (!Array.isArray(DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS)) fail('helper missing DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS')
}

function gitGrep(pattern) {
  try {
    return childProcess.execFileSync('git', ['grep', '-n', '-E', pattern, '--', 'src'], { encoding: 'utf8' })
      .trim()
      .split(/\r?\n/)
      .filter(Boolean)
  } catch (err) {
    if (err && err.status === 1) return []
    throw err
  }
}

function fileFromGrepLine(line) {
  const idx = line.indexOf(':')
  return idx === -1 ? line : line.slice(0, idx)
}

function assertNoNewLocalStatusMaps() {
  const knownDebtPrefixes = [
    'src/lib/domain-statuses.ts',
    'src/lib/data-contract.ts',
    'src/lib/lead-health.ts',
    'src/lib/scheduling.ts',
    'src/lib/lead-finance.ts',
    'src/lib/finance/case-finance-source.ts',
    'src/lib/owner-control/',
    'src/lib/reminders.ts',
    'src/lib/topic-contact.ts',
    'src/pages/CaseDetail.tsx',
    'src/pages/ClientDetail.tsx',
    'src/pages/LeadDetail.tsx',
    'src/pages/Leads.tsx',
    'src/pages/Cases.tsx',
    'src/components/work-item-card.tsx',
    'src/components/detail/MissingItemsManagerDialog.tsx',
    'src/components/ContextActionDialogs.tsx',
    'src/lib/source-of-truth/status-repository.ts',
    'src/lib/source-of-truth/lead-options.ts',
    'src/lib/source-of-truth/case-options.ts',
    'src/lib/config/lead-status.ts',
    'src/lib/config/case-status.ts',
  ]

  const suspiciousPattern = [
    'CLOSED_STATUSES',
    'OPEN_CASE_STATUSES',
    'PAID_LIKE_STATUSES',
    'DUE_LIKE_STATUSES',
    'STATUS_LABELS',
    'STATUS_TONES',
    'STATUS_COLORS',
    'LEGACY_STATUS_MAP',
    'caseStatusMap',
    'leadStatusMap',
    'statusMap',
    'statusLabels',
  ].join('|')

  const hits = gitGrep(suspiciousPattern)
  for (const line of hits) {
    const file = fileFromGrepLine(line)
    if (!knownDebtPrefixes.some((prefix) => file === prefix || file.startsWith(prefix))) {
      fail('new or unclassified local status map/list outside whitelist: ' + line)
    }
  }
}

function assertCanonicalApiContract(statusRepositoryText, leadOptionsText, caseOptionsText, leadFacadeText, caseFacadeText) {
  assertRequiredTokens(statusRepositoryText, [
    'export type StatusSourceKind',
    'export type StatusMeta',
    'export type StatusRepositorySection',
    'closedValues',
    'legacyAliases',
    'labels',
    'tones',
    'items',
    'export const leadStatus',
    'export const caseStatus',
    'export const statusRepository',
    'export const STATUS_REPOSITORY_SOURCE_MAP',
  ], 'src/lib/source-of-truth/status-repository.ts')

  assertRequiredTokens(leadOptionsText, [
    'LEAD_STATUS_VALUES',
    'LEAD_STATUS_META_BY_VALUE',
    'LEAD_STATUS_OPTIONS',
    'getLeadStatusMeta',
    'getLeadStatusLabel',
    'getLeadStatusTone',
    'getLeadStatusPillClass',
  ], 'src/lib/source-of-truth/lead-options.ts')

  assertRequiredTokens(caseOptionsText, [
    'CASE_STATUS_VALUES',
    'CASE_CLOSED_STATUSES',
    'CASE_STATUS_META_BY_VALUE',
    'CASE_STATUS_OPTIONS',
    'getCaseStatusMeta',
    'getCaseStatusLabel',
    'getCaseStatusTone',
    'isClosedCaseStatus',
  ], 'src/lib/source-of-truth/case-options.ts')

  assertRequiredTokens(leadFacadeText, [
    "from '../source-of-truth/lead-options'",
    'LEAD_STATUS_META_BY_VALUE as LEAD_STATUS_CONFIG',
    'LEAD_STATUS_OPTIONS',
    'getLeadStatusMeta as getLeadStatusConfig',
  ], 'src/lib/config/lead-status.ts')

  assertRequiredTokens(caseFacadeText, [
    "from '../source-of-truth/case-options'",
    'CASE_STATUS_META_BY_VALUE as CASE_STATUS_CONFIG',
    'CASE_STATUS_OPTIONS',
    'getCaseStatusMeta as getCaseStatusConfig',
    'isClosedCaseStatus as isClosedCaseStatusValue',
  ], 'src/lib/config/case-status.ts')
}

function main() {
  const statusRepositoryRel = 'src/lib/source-of-truth/status-repository.ts'
  const domainStatusesRel = 'src/lib/domain-statuses.ts'
  const leadOptionsRel = 'src/lib/source-of-truth/lead-options.ts'
  const caseOptionsRel = 'src/lib/source-of-truth/case-options.ts'
  const leadFacadeRel = 'src/lib/config/lead-status.ts'
  const caseFacadeRel = 'src/lib/config/case-status.ts'
  const appReportRel = '_project/runs/LF-PROD-SOT-005C-R1_CANONICAL_STATUS_API_CONTRACT_GUARD_DO_POTWIERDZENIA.md'
  const guardRel = 'scripts/guards/verify-lf-prod-sot-005c-r1-canonical-status-api-contract-guard.cjs'
  const testRel = 'tests/lf-prod-sot-005c-r1-canonical-status-api-contract-guard.test.cjs'

  for (const file of [
    statusRepositoryRel,
    domainStatusesRel,
    leadOptionsRel,
    caseOptionsRel,
    leadFacadeRel,
    caseFacadeRel,
    appReportRel,
    guardRel,
    testRel,
  ]) {
    assertFileExists(file)
  }

  assertHelperContract()

  const statusRepositoryText = readText(statusRepositoryRel)
  const leadOptionsText = readText(leadOptionsRel)
  const caseOptionsText = readText(caseOptionsRel)
  const leadFacadeText = readText(leadFacadeRel)
  const caseFacadeText = readText(caseFacadeRel)
  const appReport = readText(appReportRel)

  assertCanonicalApiContract(statusRepositoryText, leadOptionsText, caseOptionsText, leadFacadeText, caseFacadeText)
  assertNoNewLocalStatusMaps()

  assertRequiredTokens(appReport, [
    'LF-PROD-SOT-005C-R1_CANONICAL_STATUS_API_CONTRACT_GUARD_DO_POTWIERDZENIA',
    'CANONICAL_STATUS_API_CONTRACT_GUARD_ADDED',
    'GUARD_ONLY',
    'CONTRACT_ONLY',
    'NO_RUNTIME_REWIRE',
    'NO_RUNTIME_CHANGE',
    'NO_OUTPUT_DRIFT',
    'NO_UI_CHANGE',
    'NO_CSS_CHANGE',
    'NO_SQL_CHANGE',
    'NO_SUPABASE_API_CHANGE',
    'NO_GCAL_CHANGE',
    'NO_CASEDETAIL_CHANGE',
    'NO_FINANCE_CHANGE',
    'NO_RUNTIME_DATA_CHANGE',
    'NO_DATA_FLOWS_CHANGE',
    'SRC_TOUCHED: NO',
    'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    'MANUAL_SMOKE_STILL_NOT_PASS',
    'FINAL_ACCEPTANCE_BLOCKED',
    'NEXT_STAGE_SELECTED: LF-PROD-SOT-005C-R2_DOMAIN_STATUSES_FACADE_DECISION_DO_POTWIERDZENIA',
    '005C_R2_CREATED: NO',
  ], appReportRel)

  assertForbiddenTokensAbsent(appReport, [
    ...DEFAULT_FORBIDDEN_POSITIVE_CLAIM_TOKENS,
    'STATUS_REWIRE_DONE',
    'STATUS_DRIFT_FIXED',
    'PRODUCTION_VERIFIED',
  ], appReportRel)

  assertNoFutureStageCreated('LF-PROD-SOT-005C-R2')

  assertNoForbiddenChangedFiles({
    allowedChangedFiles: [
      guardRel,
      testRel,
      appReportRel,
    ],
    forbiddenPrefixes: DEFAULT_FORBIDDEN_READONLY_NO_DRIFT_PREFIXES,
  })

  const mojibakeMarkers = [0xfffd, 0x00c5, 0x00c4, 0x00c3].map((code) => String.fromCharCode(code))
  for (const f of [guardRel, testRel, appReportRel]) {
    const txt = readText(f)
    if (mojibakeMarkers.some((marker) => txt.includes(marker))) fail('possible mojibake in ' + f)
  }

  console.log(JSON.stringify({
    ok: true,
    stage,
    mode: 'CANONICAL_STATUS_API_CONTRACT_GUARD_ONLY',
    guardOnly: true,
    contractOnly: true,
    runtimeRewire: 'NO_RUNTIME_REWIRE',
    runtimeChange: 'NO_RUNTIME_CHANGE',
    outputDrift: 'NO_OUTPUT_DRIFT',
    srcTouched: false,
    canonicalApiContractGuard: 'ADDED',
    packageAlias: 'NOT_ADDED_BY_CONNECTOR_SAFE_WRITE_LIMITATION',
    productionHostSmoke: 'PRODUCTION_HOST_SMOKE_NOT_EXECUTED',
    manualSmoke: 'MANUAL_SMOKE_STILL_NOT_PASS',
    finalAcceptance: 'FINAL_ACCEPTANCE_BLOCKED',
    nextStageSelected: 'LF-PROD-SOT-005C-R2_DOMAIN_STATUSES_FACADE_DECISION_DO_POTWIERDZENIA',
    created005CR2: false,
  }, null, 2))
}

try {
  main()
} catch (err) {
  fail(err && err.message ? err.message : String(err))
}
