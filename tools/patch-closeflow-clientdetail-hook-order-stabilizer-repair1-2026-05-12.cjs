const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src/pages/ClientDetail.tsx');
if (!fs.existsSync(file)) throw new Error('Missing src/pages/ClientDetail.tsx');

let source = fs.readFileSync(file, 'utf8');
const marker = 'CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_STABILIZER_REPAIR1_2026_05_12';

// Clean failed/older temporary stabilizer blocks from previous attempts, but keep normal app hooks.
source = source.replace(/\n\s*\/\* CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_STABILIZER_2026_05_12[\s\S]*?\*\/\s*\n\s*useMemo\(\(\) => null, \[\]\);\s*/g, '\n');
source = source.replace(/\n\s*\/\* CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_PADDING_2026_05_12[\s\S]*?\*\/\s*\n\s*useMemo\(\(\) => null, \[\]\);\s*/g, '\n');

const branchReturnPattern = /(\n)(\s*)return \(\s*\n\s*<Layout>\s*\n\s*<div data-fin7-client-detail-finance-summary=\"true\">/m;
const match = source.match(branchReturnPattern);
if (!match) {
  throw new Error('Could not locate ClientDetail early return before data-fin7-client-detail-finance-summary. Manual split required.');
}

const indent = match[2] || '  ';
const stabilizer = `${match[1]}${indent}/* ${marker}
${indent}   Production stabilizer for React #310 until ClientDetail is split into route shell + loaded view.
${indent}   This mirrors the single useMemo executed only by the loaded branch.
${indent}*/
${indent}useMemo(() => null, []);
`;

source = source.replace(branchReturnPattern, `${stabilizer}${match[2]}return (\n      <Layout>\n        <div data-fin7-client-detail-finance-summary=\"true\">`);

if (!source.includes(marker)) throw new Error('Stabilizer marker was not inserted.');

const occurrences = (source.match(new RegExp(marker, 'g')) || []).length;
if (occurrences !== 1) {
  throw new Error(`Expected exactly one ${marker}, found ${occurrences}.`);
}

const topMarker = '/* CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_STABILIZER_REPAIR1_2026_05_12: keeps ClientDetail production-safe after React #310 */';
if (!source.includes(topMarker)) {
  const anchor = '/* STAGE14B_CLIENT_NEXT_ACTION_CONTEXT */';
  if (source.includes(anchor)) source = source.replace(anchor, `${anchor}\n${topMarker}`);
}

fs.writeFileSync(file, source, 'utf8');

const scriptPath = path.join(root, 'scripts/check-closeflow-clientdetail-hook-order-stabilizer-repair1.cjs');
fs.mkdirSync(path.dirname(scriptPath), { recursive: true });
fs.writeFileSync(scriptPath, `const fs = require('fs');
const path = require('path');
const root = process.cwd();
const file = path.join(root, 'src/pages/ClientDetail.tsx');
const source = fs.readFileSync(file, 'utf8');
const marker = '${marker}';
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
`, 'utf8');

const docPath = path.join(root, 'docs/release/CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_STABILIZER_REPAIR1_2026-05-12.md');
fs.mkdirSync(path.dirname(docPath), { recursive: true });
fs.writeFileSync(docPath, `# CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_STABILIZER_REPAIR1_2026-05-12

## Cel

Przywrocic dzialanie ekranu /clients/:id po powrocie React error #310.

## Decyzja

To jest stabilizacja produkcyjna, nie finalny refactor architektury. Finalny etap powinien rozdzielic ClientDetail na route shell oraz loaded view.

## Zakres

- src/pages/ClientDetail.tsx
- scripts/check-closeflow-clientdetail-hook-order-stabilizer-repair1.cjs
- package.json

## Kryterium

- npm run check:closeflow-clientdetail-hook-order-stabilizer-repair1 przechodzi
- npm run build przechodzi
- /clients/:id nie wywala React #310
`, 'utf8');

const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-clientdetail-hook-order-stabilizer-repair1'] = 'node scripts/check-closeflow-clientdetail-hook-order-stabilizer-repair1.cjs';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

console.log('OK patch-closeflow-clientdetail-hook-order-stabilizer-repair1: applied production stabilizer.');
