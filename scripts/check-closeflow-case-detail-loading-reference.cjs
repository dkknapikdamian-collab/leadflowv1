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

const settlementIndex = source.indexOf('<CaseSettlementPanel', componentStart);
assert.ok(settlementIndex > componentStart, 'CaseSettlementPanel must still exist in CaseDetail');
assert.ok(firstLoadingGuard < settlementIndex, 'loading guard must appear before CaseSettlementPanel');

const afterSettlement = source.slice(settlementIndex);
assert.ok(!/if\s*\(\s*loading\s*\)/.test(afterSettlement), 'loading must not be referenced after CaseSettlementPanel render scope');

const quietGate = read(quietGatePath);
assert.match(
  quietGate,
  /case detail loading reference[\s\S]*check-closeflow-case-detail-loading-reference\.cjs/,
  'quiet release gate must run the CaseDetail loading reference guard',
);

console.log('✔ CaseDetail loading reference is scoped and guarded');
