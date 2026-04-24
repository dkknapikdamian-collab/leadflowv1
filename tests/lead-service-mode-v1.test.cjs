const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Lead service handoff uses current cases route', () => {
  const source = read('src/pages/LeadDetail.tsx');
  assert.ok(source.includes("navigate(`/cases/${startServiceSuccess.caseId}`);"));
  assert.ok(!source.includes("navigate(`/case/${startServiceSuccess.caseId}`);"));
});

test('LeadDetail marks sold/service lead as operational archive', () => {
  const source = read('src/pages/LeadDetail.tsx');
  assert.match(source, /const leadOperationalArchive = Boolean/);
  assert.match(source, /leadMovedToService || associatedCase || startServiceSuccess/);
});

test('LeadDetail blocks quick actions after handoff to case', () => {
  const source = read('src/pages/LeadDetail.tsx');
  const taskRegion = source.slice(source.indexOf('const handleCreateQuickTask'), source.indexOf('const handleCreateQuickEvent'));
  const eventRegion = source.slice(source.indexOf('const handleCreateQuickEvent'), source.indexOf('const openLinkedTaskEditor'));
  assert.match(taskRegion, /leadOperationalArchive/);
  assert.match(taskRegion, /Dodawaj dalsze zadania w sprawie/);
  assert.match(eventRegion, /leadOperationalArchive/);
  assert.match(eventRegion, /Dodawaj dalsze wydarzenia w sprawie/);
});

test('Lead service mode documentation exists', () => {
  const doc = read('docs/LEAD_SERVICE_MODE_V1_2026-04-24.md');
  assert.match(doc, /Lead service mode V1/);
  assert.match(doc, //cases/:id/);
  assert.match(doc, /jedna prawde operacyjna/);
});
