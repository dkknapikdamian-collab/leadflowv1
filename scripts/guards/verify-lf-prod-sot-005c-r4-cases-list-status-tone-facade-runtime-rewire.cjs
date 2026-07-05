const fs = require('fs');
const cp = require('child_process');

const stage = 'LF-PROD-SOT-005C-R4-REPAIR';

function fail(message, extra) {
  console.error(`[${stage}] FAIL ${message}`);
  if (extra) console.error(extra);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function run(command) {
  return cp.execSync(command, { encoding: 'utf8' }).trim();
}

const allowedChangedFiles = new Set([
  'scripts/guards/verify-lf-prod-sot-005c-r4-cases-list-status-tone-facade-runtime-rewire.cjs',
  'tests/lf-prod-sot-005c-r4-cases-list-status-tone-facade-runtime-rewire.test.cjs',
  '_project/runs/LF-PROD-SOT-005C-R4_CASES_LIST_STATUS_TONE_FACADE_RUNTIME_REWIRE_DO_POTWIERDZENIA.md',
]);

const statusLines = run('git status --porcelain').split(/\r?\n/).filter(Boolean);
const changed = statusLines
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''))
  .filter((path) => !path.startsWith('_project/tmp/'));

const unexpected = changed.filter((path) => !allowedChangedFiles.has(path));
if (unexpected.length) {
  fail('unexpected changed files during R4 repair', unexpected.join('\n'));
}

const forbiddenPrefixes = [
  'src/pages/CaseDetail.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/components/finance/',
  'src/lib/domain-statuses.ts',
  'src/lib/lead-health.ts',
  'src/lib/scheduling.ts',
  'src/lib/reminders.ts',
  'src/lib/owner-control/',
  'supabase/',
  'runtime/data/',
  'data/flows.json',
  'data/flows',
];

for (const path of changed) {
  for (const prefix of forbiddenPrefixes) {
    if (path === prefix || path.startsWith(prefix)) {
      fail('forbidden scope changed', path);
    }
  }
}

const cases = read('src/pages/Cases.tsx');

if (!cases.includes("import { getCaseStatusLabel, getCaseStatusTone } from '../lib/config/case-status';")) {
  fail('Cases.tsx must import getCaseStatusTone from ../lib/config/case-status');
}

if (!cases.includes('const statusLabel = getCaseStatusLabel(record.status);')) {
  fail('getCaseStatusLabel(record.status) must remain');
}

const forbiddenInlineTone = "record.status === 'blocked' ? 'red' : record.status === 'waiting_on_client' ? 'amber' : 'blue'";
if (cases.includes(forbiddenInlineTone)) {
  fail('local inline case status tone must be removed');
}

if (!cases.includes("const statusTone = isCaseClosedStage231B0R13 ? 'green' : getCaseStatusTone(record.status);")) {
  fail('closed override + getCaseStatusTone(record.status) must be used for statusTone');
}

for (const option of [
  '<option value="in_progress">W realizacji</option>',
  '<option value="waiting_on_client">Czeka na klienta</option>',
  '<option value="blocked">Zablokowana</option>',
  '<option value="ready_to_start">Gotowa do startu</option>',
]) {
  if (!cases.includes(option)) fail('create case status select option changed or missing', option);
}

if (!cases.includes('status: newCase.status')) {
  fail('createCaseInSupabase status payload must remain status: newCase.status');
}

if (!cases.includes('() => cases.filter((record) => !isClosedCaseStatus(record.status))')) {
  fail('activeCases closed/open filter changed or missing');
}

if (!cases.includes('() => cases.filter((record) => isClosedCaseStatus(record.status))')) {
  fail('closedCases closed/open filter changed or missing');
}

if (!cases.includes("import { deleteCaseWithRelations, isClosedCaseStatus } from '../lib/cases';")) {
  fail('isClosedCaseStatus import changed');
}

if (!cases.includes('data-cf-status-tone={statusTone}>{statusLabel}</span>')) {
  fail('main status pill must still use statusTone and statusLabel');
}

const pkg = JSON.parse(read('package.json'));
const alias = pkg.scripts && pkg.scripts['verify:lf-prod-sot-005c-r4'];
if (alias !== 'node scripts/guards/verify-lf-prod-sot-005c-r4-cases-list-status-tone-facade-runtime-rewire.cjs') {
  fail('package.json R4 verify alias missing or wrong');
}

console.log(JSON.stringify({
  ok: true,
  stage,
  repair: true,
  runtimeRewire: 'CASES_LIST_STATUS_TONE_ONLY',
  displayOnly: true,
  srcRuntimeChangeAlreadyPushed: '20a355c7af633c743542d7ea74babed41a234a24',
  repairAddsOnly: [
    'guard',
    'node test',
    'app report'
  ],
  forbiddenScopePreserved: true,
  createSelectPreserved: true,
  createPayloadPreserved: true,
  closedOpenFiltersPreserved: true,
  lifecycleChange: 'NO',
  caseDetailChange: 'NO',
  financeChange: 'NO',
  outputDriftExpected: 'NO_OUTPUT_DRIFT_EXPECTED'
}, null, 2));