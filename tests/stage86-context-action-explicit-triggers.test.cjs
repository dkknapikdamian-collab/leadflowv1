const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = path.join(__dirname, '..');
function read(rel) { return fs.readFileSync(path.join(repo, rel), 'utf8'); }
function chars() { return String.fromCharCode.apply(String, arguments); }

function hasNoMojibake(rel) {
  const body = read(rel);
  [chars(0x0139), chars(0x00c4), chars(0x0102), chars(0x00c5, 0x00bc), chars(0x00c3, 0x00b3)].forEach((fragment) => assert.equal(body.includes(fragment), false, rel));
}

test('Stage86 routes LeadDetail visible action buttons to the shared dialog event bus', () => {
  const body = read('src/pages/LeadDetail.tsx');
  assert.match(body, /openLeadContextAction/);
  assert.match(body, /openLeadContextAction('task')/);
  assert.match(body, /openLeadContextAction('event')/);
  assert.match(body, /openLeadContextAction('note')/);
  assert.doesNotMatch(body, /setIsQuickTaskOpen(true)/);
  assert.doesNotMatch(body, /setIsQuickEventOpen(true)/);
});

test('Stage86 routes CaseDetail visible action buttons to the shared dialog event bus', () => {
  const body = read('src/pages/CaseDetail.tsx');
  assert.match(body, /openCaseContextAction/);
  assert.match(body, /openCaseContextAction('task')/);
  assert.match(body, /openCaseContextAction('event')/);
  assert.match(body, /openCaseContextAction('note')/);
});

test('Stage86 prepares ClientDetail for the same shared context action contract', () => {
  const body = read('src/pages/ClientDetail.tsx');
  assert.match(body, /openClientContextAction/);
  assert.match(body, /recordType: 'client'/);
  assert.match(body, /clientId/);
});

test('Stage86 files do not carry mojibake fragments', () => {
  ['src/pages/LeadDetail.tsx', 'src/pages/CaseDetail.tsx', 'src/pages/ClientDetail.tsx', 'scripts/check-stage86-context-action-explicit-triggers.cjs'].forEach(hasNoMojibake);
});
