const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientDetailPath = path.join(root, 'src/pages/ClientDetail.tsx');
const packagePath = path.join(root, 'package.json');
const hookCheckPath = path.join(root, 'scripts/check-closeflow-clientdetail-hook-order-stabilizer-repair1.cjs');
const nullCheckPath = path.join(root, 'scripts/check-closeflow-clientdetail-loading-null-safe.cjs');
const docPath = path.join(root, 'docs/release/CLOSEFLOW_CLIENTDETAIL_LOADING_NULL_SAFE_2026-05-12.md');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}
function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}
function getLoadingBranch(source) {
  const start = source.indexOf('if (loading || workspaceLoading) {');
  if (start < 0) throw new Error('Missing ClientDetail loading branch marker.');
  const end = source.indexOf('if (!client) {', start);
  if (end < 0) throw new Error('Missing ClientDetail not-found branch marker after loading branch.');
  return { start, end, text: source.slice(start, end) };
}

if (!fs.existsSync(clientDetailPath)) throw new Error('Missing src/pages/ClientDetail.tsx');
let source = read(clientDetailPath);

let loading = getLoadingBranch(source);
const riskyFinanceBlock = /\n\s*<div\s+data-fin7-client-detail-finance-summary="true">[\s\S]*?<ClientFinanceRelationSummary[\s\S]*?\/>[\s\S]*?<\/div>\s*/;
if (riskyFinanceBlock.test(loading.text)) {
  const cleanedBranch = loading.text.replace(riskyFinanceBlock, '\n');
  source = source.slice(0, loading.start) + cleanedBranch + source.slice(loading.end);
  write(clientDetailPath, source);
  console.log('OK: removed ClientFinanceRelationSummary from ClientDetail loading branch.');
} else {
  console.log('OK: ClientDetail loading branch has no ClientFinanceRelationSummary block.');
}

const hookCheck = `const fs = require('fs');
const path = require('path');
const root = process.cwd();
const file = path.join(root, 'src/pages/ClientDetail.tsx');
const source = fs.readFileSync(file, 'utf8');
const marker = 'CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_STABILIZER_REPAIR1_2026_05_12';
const loadingStart = source.indexOf('if (loading || workspaceLoading) {');
if (loadingStart < 0) throw new Error('Missing ClientDetail loading branch.');
const loadingEnd = source.indexOf('if (!client) {', loadingStart);
if (loadingEnd < 0) throw new Error('Missing ClientDetail not-found branch after loading branch.');
const branch = source.slice(loadingStart, loadingEnd);
const occurrences = (branch.match(new RegExp(marker, 'g')) || []).length;
if (occurrences !== 1) throw new Error('Expected exactly one stabilizer marker inside loading branch, found ' + occurrences);
const markerIndex = branch.indexOf(marker);
const useMemoIndex = branch.indexOf('useMemo(() => null, []);', markerIndex);
const returnIndex = branch.indexOf('return (', markerIndex);
if (useMemoIndex < 0) throw new Error('Stabilizer useMemo call is missing inside loading branch.');
if (returnIndex < 0) throw new Error('Loading branch return is missing.');
if (useMemoIndex > returnIndex) throw new Error('Stabilizer useMemo must be before loading return.');
console.log('OK closeflow-clientdetail-hook-order-stabilizer-repair1: loading branch hook order is stabilized.');
`;
write(hookCheckPath, hookCheck);

const nullCheck = `const fs = require('fs');
const path = require('path');
const root = process.cwd();
const file = path.join(root, 'src/pages/ClientDetail.tsx');
const source = fs.readFileSync(file, 'utf8');
const loadingStart = source.indexOf('if (loading || workspaceLoading) {');
if (loadingStart < 0) throw new Error('Missing ClientDetail loading branch.');
const loadingEnd = source.indexOf('if (!client) {', loadingStart);
if (loadingEnd < 0) throw new Error('Missing ClientDetail not-found branch after loading branch.');
const branch = source.slice(loadingStart, loadingEnd);
const forbidden = ['ClientFinanceRelationSummary', 'data-fin7-client-detail-finance-summary'];
for (const token of forbidden) {
  if (branch.includes(token)) {
    throw new Error('ClientDetail loading branch still renders nullable finance summary token: ' + token);
  }
}
if (!branch.includes('client-detail-loading-card')) {
  throw new Error('ClientDetail loading card marker missing.');
}
console.log('OK closeflow-clientdetail-loading-null-safe: loading branch does not render nullable finance summary.');
`;
write(nullCheckPath, nullCheck);

const doc = `# CLOSEFLOW_CLIENTDETAIL_LOADING_NULL_SAFE_2026-05-12

## Goal

Fix the production ClientDetail runtime error: Cannot read properties of null (reading 'length').

## Finding

After hook-order stabilization, the loading branch still rendered ClientFinanceRelationSummary while client can be null. That summary can read list lengths from nullable data before the client record is loaded.

## Change

- Remove ClientFinanceRelationSummary from the loading branch only.
- Keep the loaded ClientDetail view unchanged.
- Repair the hook-order stabilizer check so it counts the marker inside the loading branch, not the top file comment.
- Add a guard ensuring the loading branch cannot render the nullable finance summary again.

## Scope

- src/pages/ClientDetail.tsx
- scripts/check-closeflow-clientdetail-hook-order-stabilizer-repair1.cjs
- scripts/check-closeflow-clientdetail-loading-null-safe.cjs
- package.json

## Completion criteria

- npm run check:closeflow-clientdetail-hook-order-stabilizer-repair1 passes.
- npm run check:closeflow-clientdetail-loading-null-safe passes.
- npm run build passes.
- /clients/:id no longer crashes on loading/null client state.
`;
write(docPath, doc);

const pkg = JSON.parse(read(packagePath));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-clientdetail-hook-order-stabilizer-repair1'] = 'node scripts/check-closeflow-clientdetail-hook-order-stabilizer-repair1.cjs';
pkg.scripts['check:closeflow-clientdetail-loading-null-safe'] = 'node scripts/check-closeflow-clientdetail-loading-null-safe.cjs';
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');
console.log('OK patch-closeflow-clientdetail-loading-null-safe: applied loading null-safe repair.');
