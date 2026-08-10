const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const baseSha = '5b620308';
const sourcePath = 'src/pages/CaseDetail.tsx';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function normalizeEol(value) {
  return value.replace(/\r\n/g, '\n');
}

const current = normalizeEol(fs.readFileSync(path.join(root, sourcePath), 'utf8'));
const base = normalizeEol(execFileSync('git', ['show', `${baseSha}:${sourcePath}`], {
  cwd: root,
  encoding: 'utf8',
}));

const startMarker = 'function CaseDetailLoadingState() {';
const endMarker = '\n\n\nconst CASEDETAIL_ACTION_COLOR_TAXONOMY_V1';
const start = base.indexOf(startMarker);
const end = base.indexOf(endMarker, start);

assert(start >= 0, 'base must contain the orphan CaseDetailLoadingState declaration');
assert(end > start, 'base orphan loading declaration boundary must be stable');
const orphanBlock = base.slice(start, end);

const expected = base.replace(orphanBlock, '').replace(/\n{4,}(?=const CASEDETAIL_ACTION_COLOR_TAXONOMY_V1)/, '\n\n\n');
assert(current === expected, 'current source must equal base with only the orphan loading declaration removed');
assert(!current.includes(startMarker), 'orphan CaseDetailLoadingState declaration must be removed');
assert(current.includes('if (loading) {'), 'active CaseDetail loading branch must remain');
assert(current.includes('open={deleteCaseOpen}'), 'active delete confirmation dialog must remain');
assert(current.includes('async function handleConfirmDeleteCaseRecord()'), 'active delete handler must remain');
for (const token of ['const [deleteCaseOpen, setDeleteCaseOpen]', 'const [deleteCasePending, setDeleteCasePending]']) {
  assert(current.includes(token), `active CaseDetail delete state must remain canonical: ${token}`);
}

console.log('PASS: A2-07 removes only the unreferenced out-of-scope CaseDetail loading declaration.');
