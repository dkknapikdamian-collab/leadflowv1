const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();

function fail(message) {
  console.error('[CASE_HISTORY_WORKROW_FIX PATCH FAIL] ' + message);
  process.exit(1);
}

function read(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) fail('Brak pliku: ' + relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}

function write(relativePath, content) {
  const fullPath = path.join(repoRoot, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

const casePath = 'src/pages/CaseDetail.tsx';
const quietPath = 'scripts/closeflow-release-check-quiet.cjs';
const testPath = 'tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs';
const checkPath = 'scripts/check-case-detail-history-workrow-leak-fix-2026-05-13.cjs';
const docPath = 'docs/release/CLOSEFLOW_CASE_DETAIL_HISTORY_WORKROW_LEAK_FIX_2026-05-13.md';

let source = read(casePath);

const marker = "CLOSEFLOW_CASE_HISTORY_WORKROW_LEAK_FIX_2026_05_13";

if (!source.includes(marker)) {
  const helperAnchor = "function getStatusClass(status?: string) {";
  const helperIndex = source.indexOf(helperAnchor);
  if (helperIndex < 0) fail('Nie znaleziono anchoru getStatusClass.');

  const helper = `
const ${marker} = 'CaseActivity history entries must not render through case-detail-work-row';
void ${marker};

function isCaseActivitySourceForWorkRow(source: WorkItem['source']) {
  if (!source || typeof source !== 'object') return false;
  const value = source as CaseActivity;
  return Boolean(
    'eventType' in value ||
    'actorType' in value ||
    'payload' in value
  );
}

`;
  source = source.slice(0, helperIndex) + helper + source.slice(helperIndex);
}

const rowFunction = "function WorkItemRow({";
const rowIndex = source.indexOf(rowFunction);
if (rowIndex < 0) fail('Nie znaleziono funkcji WorkItemRow.');

const returnAnchor = "  return (\n    <article className=\"case-detail-work-row\">";
const returnIndex = source.indexOf(returnAnchor, rowIndex);
if (returnIndex < 0) fail('Nie znaleziono return article case-detail-work-row w WorkItemRow.');

if (!source.slice(rowIndex, returnIndex).includes('isCaseActivitySourceForWorkRow(entry.source)')) {
  const guard = `  if (isCaseActivitySourceForWorkRow(entry.source)) {
    return null;
  }

`;
  source = source.slice(0, returnIndex) + guard + source.slice(returnIndex);
}

write(casePath, source);

const check = `const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(repoRoot, 'src/pages/CaseDetail.tsx'), 'utf8');

function fail(message) {
  console.error('FAIL check:case-detail-history-workrow-leak-fix:', message);
  process.exit(1);
}

for (const token of [
  'CLOSEFLOW_CASE_HISTORY_WORKROW_LEAK_FIX_2026_05_13',
  'function isCaseActivitySourceForWorkRow',
  'isCaseActivitySourceForWorkRow(entry.source)',
  'return null;',
  '<article className="case-detail-work-row"',
  '<article className="case-history-row"',
  "activeTab === 'history'"
]) {
  if (!source.includes(token)) fail('Brak tokenu: ' + token);
}

console.log('OK check:case-detail-history-workrow-leak-fix');
`;
write(checkPath, check);

const test = `const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('CaseActivity history entries do not render through WorkItemRow cards', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.ok(source.includes('CLOSEFLOW_CASE_HISTORY_WORKROW_LEAK_FIX_2026_05_13'));
  assert.ok(source.includes('function isCaseActivitySourceForWorkRow'));
  assert.ok(source.includes('isCaseActivitySourceForWorkRow(entry.source)'));
  assert.ok(source.includes('return null;'));
});

test('CaseDetail keeps separate compact history row render', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.ok(source.includes('<article className="case-history-row"'));
  assert.ok(source.includes('<article key={activity.id} className="case-detail-history-row"'));
  assert.ok(source.includes('<article className="case-detail-work-row"'));
});

test('Case history workrow leak fix is included in quiet release gate', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(quiet.includes("'tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs'"));
});
`;
write(testPath, test);

let quiet = read(quietPath);
const entry = "  'tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs',";
if (!quiet.includes(entry)) {
  const anchor = "  'tests/case-detail-v1-command-center.test.cjs',";
  if (!quiet.includes(anchor)) fail('Nie znaleziono anchoru case-detail-v1-command-center w quiet gate.');
  quiet = quiet.replace(anchor, anchor + "\\n" + entry);
}
write(quietPath, quiet);

write(docPath, `# CloseFlow - CaseDetail history workrow leak fix - 2026-05-13

## Problem

Historia sprawy miala dwa style, bo czesc historycznych CaseActivity renderowala sie przez roboczy komponent WorkItemRow jako case-detail-work-row.

## Naprawa

- CaseActivity nie renderuje sie juz przez WorkItemRow.
- Historia pozostaje w kompaktowych rowach case-history-row / case-detail-history-row.
- Prawdziwe zadania, wydarzenia i braki nadal moga renderowac sie przez WorkItemRow.

## Weryfikacja

- node scripts/check-case-detail-history-workrow-leak-fix-2026-05-13.cjs
- node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
- npm.cmd run build
- npm.cmd run verify:closeflow:quiet
`);

console.log('OK patch-case-detail-history-workrow-leak-fix');
