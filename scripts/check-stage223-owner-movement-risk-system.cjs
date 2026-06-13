const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

function fail(message) {
  console.error('STAGE223_OWNER_MOVEMENT_RISK_SYSTEM_FAIL: ' + message);
  process.exit(1);
}

function assertFile(file) {
  if (!exists(file)) fail('missing ' + file);
}

function assertIncludes(source, token, message) {
  if (!source.includes(token)) fail(message || ('missing token: ' + token));
}

function assertNotIncludes(source, token, message) {
  if (source.includes(token)) fail(message || ('forbidden token: ' + token));
}

function countOccurrences(source, token) {
  return source.split(token).length - 1;
}

for (const file of [
  'src/lib/owner-control/next-move-contract.ts',
  'src/lib/owner-control/activity-truth.ts',
  'src/lib/owner-control/owner-risk-rules.ts',
  'src/lib/record-operational-badges.ts',
  'tests/stage223-owner-movement-risk-system.test.cjs',
  'tests/stage223-owner-risk-runtime-contract.test.cjs',
]) {
  assertFile(file);
}

const nextMove = read('src/lib/owner-control/next-move-contract.ts');
const activityTruth = read('src/lib/owner-control/activity-truth.ts');
const ownerRisk = read('src/lib/owner-control/owner-risk-rules.ts');
const recordBadges = read('src/lib/record-operational-badges.ts');
const today = read('src/pages/TodayStable.tsx');
const leadDetail = exists('src/pages/LeadDetail.tsx') ? read('src/pages/LeadDetail.tsx') : '';
const caseDetail = exists('src/pages/CaseDetail.tsx') ? read('src/pages/CaseDetail.tsx') : '';
const leads = exists('src/pages/Leads.tsx') ? read('src/pages/Leads.tsx') : '';
const cases = exists('src/pages/Cases.tsx') ? read('src/pages/Cases.tsx') : '';
const clients = exists('src/pages/Clients.tsx') ? read('src/pages/Clients.tsx') : '';
const finalTest = read('tests/stage223-owner-movement-risk-system.test.cjs');
const runtimeTest = read('tests/stage223-owner-risk-runtime-contract.test.cjs');
const pkg = JSON.parse(read('package.json'));

for (const token of [
  'NextMoveStatus',
  'NextMoveContract',
  'buildNextMoveContract',
  'missing',
  'overdue',
  'today',
  'planned',
  'closed',
  'Brak następnej akcji',
  'Brak następnego ruchu',
]) {
  assertIncludes(nextMove, token, 'next move missing token: ' + token);
}

for (const token of [
  'ActivityTruth',
  'buildActivityTruth',
  'lastContactAt',
  'lastActivityAt',
  'contactSilentDays',
  'activitySilentDays',
  'lastContactIsFallback',
  'lastActivityIsFallback',
  'updatedAt is fallback only',
]) {
  assertIncludes(activityTruth, token, 'activity truth missing token: ' + token);
}

for (const token of [
  "import { buildActivityTruth",
  "from './activity-truth'",
  "import { buildNextMoveContract",
  "from './next-move-contract'",
  'nextMove?: NextMoveContract | null',
  'activityTruth?: ActivityTruth | null',
  'resolveNextMove',
  'resolveActivityTruth',
  'SALES_SILENCE_THRESHOLDS_DAYS = [1, 2, 3, 5, 7, 14] as const',
  'settings.warningDays',
  'settings.criticalDays',
  'Brak następnej akcji',
  'Brak następnego ruchu',
  'Pieniądze bez ruchu',
]) {
  assertIncludes(ownerRisk, token, 'owner risk must keep one-source contract token: ' + token);
}

assertIncludes(recordBadges, "from './owner-control/activity-truth'", 'record badges must use activity truth');
assertIncludes(recordBadges, "from './owner-control/next-move-contract'", 'record badges must use next move contract');
assertIncludes(recordBadges, "from './owner-control/owner-risk-rules'", 'record badges must use owner risk rules');

assertNotIncludes(today, '<h2>Kontrola sprzedaży</h2>', 'Today must not get duplicated Kontrola sprzedaży panel');
assertIncludes(today, 'Wysoka wartość / ryzyko', 'Today must keep existing Wysoka wartość / ryzyko section');

const pageFiles = [
  ['src/pages/Leads.tsx', leads],
  ['src/pages/Clients.tsx', clients],
  ['src/pages/Cases.tsx', cases],
  ['src/pages/LeadDetail.tsx', leadDetail],
  ['src/pages/CaseDetail.tsx', caseDetail],
  ['src/pages/TodayStable.tsx', today],
];

const badgeLabels = [
  'Cisza 7+ dni',
  'Cisza 14+ dni',
  'Brak świeżego ruchu 7+ dni',
  'Brak świeżego ruchu 14+ dni',
  'Brak następnej akcji',
  'Brak następnego ruchu',
  'Sprawa bez ruchu 7+ dni',
  'Sprawa bez ruchu 14+ dni',
  'Pieniądze bez ruchu',
];

for (const [file, source] of pageFiles) {
  for (const label of badgeLabels) {
    if (source.includes(`'${label}'`) || source.includes(`"${label}"`) || source.includes(`>${label}<`)) {
      fail(`${file} hard-codes owner-risk badge label instead of using owner-risk-rules: ${label}`);
    }
  }
}

if (/const\s+\w*brak\w*Ruch/i.test(leadDetail) || leadDetail.includes("'Brak następnego ruchu'") || leadDetail.includes('"Brak następnego ruchu"')) {
  fail('LeadDetail must not define its own local "Brak następnego ruchu" logic');
}

if (/const\s+\w*sprawa\w*bez\w*ruchu/i.test(caseDetail) || caseDetail.includes("'Sprawa bez ruchu") || caseDetail.includes('"Sprawa bez ruchu')) {
  fail('CaseDetail must not define its own local "Sprawa bez ruchu" logic');
}

const silenceArrayToken = '[1, 2, 3, 5, 7, 14]';
let thresholdOwners = 0;
for (const [file, source] of [
  ['owner-risk-rules', ownerRisk],
  ...pageFiles,
  ['record-operational-badges', recordBadges],
]) {
  if (source.includes(silenceArrayToken)) {
    thresholdOwners += 1;
    if (file !== 'owner-risk-rules') fail(`${file} defines silence thresholds outside owner-risk-rules`);
  }
}
if (thresholdOwners !== 1) fail('silence thresholds must exist exactly once, in owner-risk-rules');

for (const token of [
  'buildSync',
  'loadTs',
  "loadTs('src/lib/owner-control/next-move-contract.ts')",
  "loadTs('src/lib/owner-control/activity-truth.ts')",
  "loadTs('src/lib/owner-control/owner-risk-rules.ts')",
  'buildNextMoveContract({',
  'buildActivityTruth({',
  'getLeadOwnerRiskBadges(',
  'getCaseOwnerRiskBadges(',
  'getMoneyOwnerRiskBadges(',
  'assert.ok(',
  'assert.equal(',
]) {
  assertIncludes(finalTest, token, 'final test must execute real runtime function calls, not only token checks: ' + token);
}

for (const token of [
  'assert.match',
  'readFileSync(path.join(root,',
]) {
  if (countOccurrences(finalTest, token) > 2) {
    fail('final Stage223 test appears too token-heavy; keep runtime function assertions as the main proof');
  }
}

if (pkg.scripts['check:stage223-owner-movement-risk-system'] !== 'node scripts/check-stage223-owner-movement-risk-system.cjs') {
  fail('missing package check script');
}
if (pkg.scripts['test:stage223-owner-movement-risk-system'] !== 'node --test tests/stage223-owner-movement-risk-system.test.cjs') {
  fail('missing final Stage223 movement system test script');
}
if (pkg.scripts['test:stage223-owner-risk-runtime-contract'] !== 'node --test tests/stage223-owner-risk-runtime-contract.test.cjs') {
  fail('missing compatibility runtime test script');
}

assertIncludes(runtimeTest, 'getLeadOwnerRiskBadges(', 'runtime compatibility test must still call lead risk badges');
assertIncludes(runtimeTest, 'getCaseOwnerRiskBadges(', 'runtime compatibility test must still call case risk badges');
assertIncludes(runtimeTest, 'getMoneyOwnerRiskBadges(', 'runtime compatibility test must still call money risk badges');

console.log('STAGE223_OWNER_MOVEMENT_RISK_SYSTEM: OK');
