const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/pages/CaseDetail.tsx';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-07-case-detail-loading-scope.cjs';
const baseSha = '5b620308';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-07 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-07/);
});

test('A2-07 removes exactly the orphan loading declaration', () => {
  const base = execFileSync('git', ['show', `${baseSha}:${sourcePath}`], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
  const current = read(sourcePath);
  const start = base.indexOf('function CaseDetailLoadingState() {');
  const end = base.indexOf('\n\n\nconst CASEDETAIL_ACTION_COLOR_TAXONOMY_V1', start);
  assert.ok(start >= 0 && end > start);
  const expected = base.replace(base.slice(start, end), '').replace(/\n{4,}(?=const CASEDETAIL_ACTION_COLOR_TAXONOMY_V1)/, '\n\n\n');
  assert.equal(current, expected);
  assert.doesNotMatch(current, /function CaseDetailLoadingState\(\)/);
});

test('A2-07 preserves the active loading and delete contracts', () => {
  const current = read(sourcePath);
  assert.match(current, /if \(loading\) \{/);
  assert.match(current, /open=\{deleteCaseOpen\}/);
  assert.match(current, /async function handleConfirmDeleteCaseRecord\(\)/);
  assert.match(current, /const \[deleteCaseOpen, setDeleteCaseOpen\]/);
  assert.match(current, /const \[deleteCasePending, setDeleteCasePending\]/);
});
