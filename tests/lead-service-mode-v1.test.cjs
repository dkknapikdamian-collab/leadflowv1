const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Lead service handoff opens case detail directly after start', () => {
  const source = read('src/pages/LeadDetail.tsx');

  assert.ok(
    source.includes('navigate(`/case/${startServiceSuccess.caseId}`);'),
    'Po starcie obs\u0142ugi ma kierowa\u0107 bezpo\u015Brednio do /case/:id.',
  );

  assert.ok(
    !source.includes('navigate(`/cases/${startServiceSuccess.caseId}`);'),
    'Nie mo\u017Ce zosta\u0107 b\u0142\u0119dny redirect na /cases/:id.',
  );
});

test('LeadDetail marks sold/service lead as operational archive', () => {
  const source = read('src/pages/LeadDetail.tsx');

  assert.match(source, /const leadOperationalArchive = Boolean/);
  assert.match(source, /leadMovedToService \|\| associatedCase \|\| startServiceSuccess/);
});

test('LeadDetail blocks quick actions after handoff to case', () => {
  const source = read('src/pages/LeadDetail.tsx');
  const taskStart = source.indexOf('const handleCreateQuickTask');
  const eventStart = source.indexOf('const handleCreateQuickEvent');
  const editorStart = source.indexOf('const openLinkedTaskEditor');

  assert.notEqual(taskStart, -1, 'Brak handleCreateQuickTask.');
  assert.notEqual(eventStart, -1, 'Brak handleCreateQuickEvent.');
  assert.notEqual(editorStart, -1, 'Brak openLinkedTaskEditor.');

  const taskRegion = source.slice(taskStart, eventStart);
  const eventRegion = source.slice(eventStart, editorStart);

  assert.match(taskRegion, /leadOperationalArchive/);
  assert.match(taskRegion, /Dodawaj dalsze zadania w sprawie/);
  assert.match(eventRegion, /leadOperationalArchive/);
  assert.match(eventRegion, /Dodawaj dalsze wydarzenia w sprawie/);
});

test('Lead service mode documentation exists', () => {
  const doc = read('docs/LEAD_SERVICE_MODE_V1_2026-04-24.md');

  assert.ok(doc.includes('Lead service mode V1'));
  assert.ok(doc.includes('/case/:id'));
  assert.ok(doc.includes('jedna prawde operacyjna'));
});
