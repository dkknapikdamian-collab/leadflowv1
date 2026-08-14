const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const baseSha = 'c44dd3d0';
const sourcePath = 'src/pages/Cases.tsx';
const staleExpression = 'isClosedCaseStatus((typeof caseRecord !== "undefined" ? caseRecord : null)?.status)';
const canonicalExpression = 'isClosedCaseStatus(record?.status)';

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

assert((base.match(new RegExp(staleExpression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length === 1, 'base must contain exactly one stale closed-view expression');
assert(!current.includes(staleExpression), 'current source must not reference the stale caseRecord expression');
assert(current.includes(canonicalExpression), 'current source must use the existing record parameter');
assert(current === base.replace(staleExpression, canonicalExpression), 'current source must equal base with only the closed-view expression repaired');
assert(current.includes('matches(record: { status?: unknown }, caseView: CaseView)'), 'closed-view contract must keep its record parameter');
assert(current.includes('isClosedCaseStatus(record.status)'), 'active/closed list filters must remain on the canonical status helper');

console.log('PASS: A2-10 closed-view contract uses its declared record parameter.');
