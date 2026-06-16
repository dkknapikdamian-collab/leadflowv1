const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const caseDetailPath = path.join(repoRoot, 'src/pages/CaseDetail.tsx');
const quietGatePath = path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs');

function read(relativeOrAbsolutePath) {
  const filePath = path.isAbsolute(relativeOrAbsolutePath)
    ? relativeOrAbsolutePath
    : path.join(repoRoot, relativeOrAbsolutePath);
  return fs.readFileSync(filePath, 'utf8');
}

const source = read(caseDetailPath);
const unsafeMarker = 'CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_GUARD_2026_05_11';
const stageMarker = 'CLOSEFLOW_CASE_DETAIL_LOADING_REFERENCE_GUARD_R3_RAIL_MARKER_COMPAT';
void stageMarker;

assert.ok(!source.includes(unsafeMarker), 'Unsafe duplicate loading guard marker must not exist in CaseDetail.tsx');

const componentStartCandidates = [
  source.indexOf('export default function CaseDetail'),
  source.indexOf('function CaseDetail'),
  source.indexOf('const CaseDetail'),
].filter((index) => index >= 0);
assert.ok(componentStartCandidates.length > 0, 'CaseDetail component start must be detectable');
const componentStart = Math.min(...componentStartCandidates);

const loadingStateIndex = source.indexOf('const [loading, setLoading] = useState(true)', componentStart);
assert.ok(loadingStateIndex > componentStart, 'loading state must be declared inside CaseDetail component');

const firstLoadingGuard = source.indexOf('if (loading)', loadingStateIndex);
assert.ok(firstLoadingGuard > loadingStateIndex, 'CaseDetail must keep an early loading guard');

const settlementSourceTruthCandidates = [
  '<CaseSettlementPanel',
  '<CaseSettlementSection',
  'data-case-settlement-rail-card="true"',
  'data-case-settlement-compact="true"',
  'data-case-finance-panel="true"',
  'data-fin11-case-right-finance-panel="true"',
  'data-stage220a13-case-finance-scope-card="true"',
];

const settlementCandidates = settlementSourceTruthCandidates
  .map((marker) => ({ marker, index: source.indexOf(marker, componentStart) }))
  .filter((candidate) => candidate.index >= 0);

assert.ok(
  settlementCandidates.length > 0,
  'CaseDetail must still render a settlement source truth rail/section marker'
);

const firstSettlementCandidate = settlementCandidates.reduce((best, candidate) => (
  candidate.index < best.index ? candidate : best
));

assert.ok(
  firstLoadingGuard < firstSettlementCandidate.index,
  'loading guard must appear before case settlement render source truth marker: ' + firstSettlementCandidate.marker
);

const afterSettlement = source.slice(firstSettlementCandidate.index);
assert.ok(
  !/if\s*\(\s*loading\s*\)/.test(afterSettlement),
  'loading must not be referenced after CaseDetail settlement render source truth marker'
);

const quietGate = read(quietGatePath);
assert.match(
  quietGate,
  /case detail loading reference[\s\S]*check-closeflow-case-detail-loading-reference\.cjs/,
  'quiet release gate must run the CaseDetail loading reference guard'
);

console.log('✔ CaseDetail loading reference is scoped and guarded with current settlement rail source truth');
