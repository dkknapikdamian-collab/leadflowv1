const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

function fail(message) {
  console.error('STAGE223_OWNER_MOVEMENT_RISK_SYSTEM_FAIL: ' + message);
  process.exit(1);
}

for (const file of [
  'src/lib/owner-control/next-move-contract.ts',
  'src/lib/owner-control/activity-truth.ts',
  'src/lib/owner-control/owner-risk-rules.ts',
  'src/lib/record-operational-badges.ts',
  'tests/stage223-owner-risk-runtime-contract.test.cjs',
]) {
  if (!exists(file)) fail('missing ' + file);
}

const nextMove = read('src/lib/owner-control/next-move-contract.ts');
const activityTruth = read('src/lib/owner-control/activity-truth.ts');
const ownerRisk = read('src/lib/owner-control/owner-risk-rules.ts');
const recordBadges = read('src/lib/record-operational-badges.ts');
const today = read('src/pages/TodayStable.tsx');
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
  if (!nextMove.includes(token)) fail('next move missing token: ' + token);
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
  if (!activityTruth.includes(token)) fail('activity truth missing token: ' + token);
}

if (!ownerRisk.includes("from './activity-truth'")) fail('owner risk must import activity truth');
if (!ownerRisk.includes("from './next-move-contract'")) fail('owner risk must import next move contract');
if (!ownerRisk.includes('Brak świeżego ruchu 7+ dni')) fail('owner risk must distinguish activity fallback label');
if (!ownerRisk.includes('Cisza 7+ dni')) fail('owner risk must keep real contact silence label');
if (!ownerRisk.includes('Pieniądze bez ruchu')) fail('owner risk must keep money risk');

if (!recordBadges.includes("from './owner-control/activity-truth'")) fail('record badges must use activity truth');
if (!recordBadges.includes("from './owner-control/next-move-contract'")) fail('record badges must use next move contract');

if (today.includes('Kontrola sprzedaży')) fail('Today must not get duplicated Kontrola sprzedaży panel');
if (!today.includes('Wysoka wartość / ryzyko')) fail('Today must keep existing Wysoka wartość / ryzyko section');

if (pkg.scripts['check:stage223-owner-movement-risk-system'] !== 'node scripts/check-stage223-owner-movement-risk-system.cjs') fail('missing package check script');
if (pkg.scripts['test:stage223-owner-risk-runtime-contract'] !== 'node --test tests/stage223-owner-risk-runtime-contract.test.cjs') fail('missing runtime test script');

console.log('STAGE223_OWNER_MOVEMENT_RISK_SYSTEM: OK');
