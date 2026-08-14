const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/pages/Cases.tsx';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-10-cases-closed-view-record-scope.cjs';
const baseSha = 'c44dd3d0';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-10 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-10/);
});

test('A2-10 repairs only the stale closed-view binding', () => {
  const base = readFromGit(`${baseSha}:${sourcePath}`);
  const current = read(sourcePath);
  const staleExpression = 'isClosedCaseStatus((typeof caseRecord !== "undefined" ? caseRecord : null)?.status)';
  const canonicalExpression = 'isClosedCaseStatus(record?.status)';
  assert.equal(current, base.replace(staleExpression, canonicalExpression));
});

test('A2-10 preserves the canonical helper and view contract', () => {
  const current = read(sourcePath);
  assert.doesNotMatch(current, /typeof caseRecord/);
  assert.match(current, /matches\(record: \{ status\?: unknown \}, caseView: CaseView\)/);
  assert.match(current, /isClosedCaseStatus\(record\?\.status\)/);
  assert.match(current, /\(\) => cases\.filter\(\(record\) => !isClosedCaseStatus\(record\.status\)\)/);
  assert.match(current, /\(\) => cases\.filter\(\(record\) => isClosedCaseStatus\(record\.status\)\)/);
});

function readFromGit(spec) {
  return execFileSync('git', ['show', spec], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
}
