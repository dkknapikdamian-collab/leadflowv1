const fs = require('fs');
const path = require('path');
const root = process.cwd();
const file = path.join(root, 'src/pages/ClientDetail.tsx');
const source = fs.readFileSync(file, 'utf8');
const marker = 'CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_STABILIZER_REPAIR1_2026_05_12';
if (!source.includes(marker)) throw new Error('Missing ClientDetail hook order stabilizer marker.');
const occurrences = (source.match(new RegExp(marker, 'g')) || []).length;
if (occurrences !== 1) throw new Error('Expected exactly one stabilizer marker, found ' + occurrences);
const markerIndex = source.indexOf(marker);
const returnIndex = source.indexOf('return (', markerIndex);
const branchNeedle = '<div data-fin7-client-detail-finance-summary="true">';
const branchIndex = source.indexOf(branchNeedle, markerIndex);
if (returnIndex < 0 || branchIndex < 0 || returnIndex > branchIndex) {
  throw new Error('Stabilizer must sit directly before the ClientDetail early return branch.');
}
const afterMarker = source.slice(markerIndex, branchIndex);
if (!afterMarker.includes('useMemo(() => null, []);')) throw new Error('Stabilizer useMemo call is missing.');
console.log('OK closeflow-clientdetail-hook-order-stabilizer-repair1: ClientDetail early return hook order is stabilized.');
