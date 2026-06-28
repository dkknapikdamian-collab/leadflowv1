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

test('starting lead service redirects directly to canonical case detail window', () => {
  const leadDetail = read('src/pages/LeadDetail.tsx');

  expectText(leadDetail, 'startServiceSuccess?.caseId');
  expectText(leadDetail, 'caseDetailPath');
  expectText(leadDetail, 'navigate(caseDetailPath(result.caseId));');
  expectText(leadDetail, 'navigate(caseDetailPath(serviceCaseId));');
});

test('case detail route uses route constants and legacy redirect component', () => {
  const app = read('src/App.tsx');

  expectText(app, 'CLOSEFLOW_ROUTES.legacyCaseDetail');
  expectText(app, 'CLOSEFLOW_ROUTES.caseDetail');
  expectText(app, '<LegacyCaseRedirect />');
  expectText(app, '<CaseDetail />');
  expectText(app, 'caseDetailPath(caseId)');
});

test('release gates include lead start service case redirect regression test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  expectText(quietGate, 'tests/lead-start-service-case-redirect.test.cjs');
  expectText(fullGate, 'tests/lead-start-service-case-redirect.test.cjs');
});
