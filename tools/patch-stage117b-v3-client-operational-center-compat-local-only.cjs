const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const testPath = path.join(root, 'tests', 'client-detail-v1-operational-center.test.cjs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function replaceTestBlock(source, testName, replacementLines) {
  const needle = `test('${testName}', () => {`;
  const start = source.indexOf(needle);
  if (start === -1) {
    throw new Error(`Stage117B v3 cannot find test block: ${testName}`);
  }
  const next = source.indexOf('\ntest(', start + needle.length);
  if (next === -1) {
    throw new Error(`Stage117B v3 cannot find next test after: ${testName}`);
  }
  return source.slice(0, start) + replacementLines.join('\n') + '\n' + source.slice(next + 1);
}

if (!fs.existsSync(testPath)) {
  throw new Error('Missing tests/client-detail-v1-operational-center.test.cjs');
}

let testSource = read(testPath);

testSource = replaceTestBlock(
  testSource,
  'ClientDetail uses current cases route from client context',
  [
    "test('ClientDetail uses current cases route from client context without lead cockpit links', () => {",
    "  const source = read('src/pages/ClientDetail.tsx');",
    "",
    "  assert.ok(source.includes('`/cases/${String(caseRecord.id)}`'));",
    "  assert.ok(source.includes('STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT'));",
    "  assert.equal(source.includes('`/cases/${String(lead.linkedCaseId)}`'), false);",
    "  assert.equal(source.includes('navigate(`/case/${String(caseRecord.id)}`)'), false);",
    "  assert.equal(source.includes('navigate(`/case/${String(lead.linkedCaseId)}`)'), false);",
    "  assert.equal(source.includes('navigate(`/leads/${String(lead.id)}`)'), false);",
    "  assert.equal(source.includes('Otwórz lead'), false);",
    "});",
  ],
);

if (!testSource.includes('without lead cockpit links')) {
  throw new Error('Stage117B v3 failed to update operational center contract wording.');
}
if (testSource.includes("assert.ok(source.includes('`/cases/${String(lead.linkedCaseId)}`'))")) {
  throw new Error('Stage117B v3 legacy linkedCaseId assertion still present.');
}

write(testPath, testSource);
console.log('Stage117B v3 updated ClientDetail V1 operational center contract for no-lead-view decision.');
