const fs = require('fs');
function fail(message) {
  console.error('STAGE231B0_R12_CASES_RECORD_SCOPE_RUNTIME_REPAIR FAIL: ' + message);
  process.exit(1);
}
const cases = fs.readFileSync('src/pages/Cases.tsx', 'utf8');
const mapStart = cases.indexOf('filteredCases.map((record, index) => {');
if (mapStart < 0) fail('missing filteredCases map');
const mapWindow = cases.slice(mapStart, Math.min(cases.length, mapStart + 30000));
const requiredGlobal = [
  'STAGE231B0_R13_CASES_MAP_RECORD_SCOPE_REAL_FIX',
  'STAGE231B0_R13_R2_CASES_MAP_CLOSED_LOGIC_COMPLETION',
  'STAGE231B0_R13_R3_NEXT_ACTION_GUARD_AND_MAP_COMPLETION',
  'STAGE231B0_R13_R4_GUARD_MAP_WINDOW_REPAIR',
  'STAGE231B0_R13_R6_OWNER_RISK_MINIMAL_SAFE_CALL',
  'const activeCases = useMemo',
  '() => cases.filter((record) => !isClosedCaseStatus(record.status))',
  'const closedCases = useMemo',
  '() => cases.filter((record) => isClosedCaseStatus(record.status))',
];
for (const token of requiredGlobal) {
  if (!cases.includes(token)) fail('missing global token: ' + token);
}
const requiredMap = [
  'const isCaseClosedStage231B0R13 = isClosedCaseStatus(record.status);',
  'const attention = isCaseClosedStage231B0R13 ? false : caseNeedsAttention(record);',
  "const statusTone = isCaseClosedStage231B0R13 ? 'green'",
  'const compactLifecyclePill = isCaseClosedStage231B0R13 ? null',
  'const nextActionLabel = isCaseClosedStage231B0R13 ?',
  'nearestCaseAction ? formatNearestCaseAction(nearestCaseAction) : compactNextAction(lifecycle.nextOperatorAction)',
  'const ownerRiskBadges = isCaseClosedStage231B0R13',
  '? []',
  ': getCaseOwnerRiskBadges(record, {',
  'lifecycle,',
  'nearestCaseAction,',
  'nextActionLabel,',
  'statusLabel,',
  'compactLifecycleLabel,',
  'compactLifecyclePill,',
  'percent,',
  'updatedAt,',
  'const metaParts = [',
  'data-stage231b0-r13-closed-case-row-banner',
];
for (const token of requiredMap) {
  if (!mapWindow.includes(token)) fail('missing map token: ' + token);
}
const forbiddenInMapWindow = [
  'typeof caseRecord !== "undefined"',
  "typeof caseRecord !== 'undefined'",
  'const renderClosedCaseBannerStage231B0R12 =',
  'isClosedCaseStatus((typeof caseRecord',
];
for (const token of forbiddenInMapWindow) {
  if (mapWindow.includes(token)) fail('map window contains forbidden token: ' + token);
}
const ownerRiskCount = (mapWindow.match(/const ownerRiskBadges =/g) || []).length;
if (ownerRiskCount !== 1) fail('ownerRiskBadges declarations count=' + ownerRiskCount);
const metaPartsIndex = mapWindow.indexOf('const metaParts = [');
const ownerRiskIndex = mapWindow.indexOf('const ownerRiskBadges =');
if (ownerRiskIndex < 0 || metaPartsIndex < 0 || ownerRiskIndex > metaPartsIndex) fail('ownerRiskBadges must appear before metaParts');
const ownerRiskChunk = mapWindow.slice(ownerRiskIndex, metaPartsIndex);
if (!ownerRiskChunk.includes('});')) fail('ownerRiskBadges chunk is not closed before metaParts');
if (ownerRiskChunk.includes('const metaParts')) fail('ownerRiskBadges chunk leaked into metaParts');
console.log('STAGE231B0_R12_CASES_RECORD_SCOPE_RUNTIME_REPAIR PASS');