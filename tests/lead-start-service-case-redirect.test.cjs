const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function expectText(source, text) {
  assert.ok(source.includes(text), 'Missing text: ' + text);
}

function rejectText(source, text) {
  assert.ok(!source.includes(text), 'Unexpected text: ' + text);
}

test('starting lead service redirects directly to case detail window', () => {
  const leadDetail = read('src/pages/LeadDetail.tsx');

  expectText(leadDetail, 'startServiceSuccess?.caseId');
  expectText(leadDetail, 'navigate(`/case/${startServiceSuccess.caseId}`);');
  rejectText(leadDetail, 'navigate(`/cases/${startServiceSuccess.caseId}`);');
});

test('case detail route supports singular and legacy plural URLs', () => {
  const app = read('src/App.tsx');

  expectText(app, 'path="/case/:caseId"');
  expectText(app, 'path="/cases/:caseId"');
  expectText(app, '<CaseDetail />');
});

test('release gates include lead start service case redirect regression test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  expectText(quietGate, 'tests/lead-start-service-case-redirect.test.cjs');
  expectText(fullGate, 'tests/lead-start-service-case-redirect.test.cjs');
});
