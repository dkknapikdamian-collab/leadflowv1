const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('ClientDetail imports operational data sources', () => {
  const source = read('src/pages/ClientDetail.tsx');

  assert.ok(source.includes('fetchTasksFromSupabase'));
  assert.ok(source.includes('fetchEventsFromSupabase'));
  assert.ok(source.includes('fetchActivitiesFromSupabase'));
});

test('ClientDetail exposes V1 operational center sections', () => {
  const source = read('src/pages/ClientDetail.tsx');

  assert.ok(source.includes('Nast\u0119pny ruch'));
  assert.ok(source.includes('Zadania klienta'));
  assert.ok(source.includes('Wydarzenia klienta'));
  assert.ok(source.includes('AktywnoĹ›Ä‡ klienta'));
  assert.ok(source.includes('buildClientNextAction'));
});

test('ClientDetail filters tasks events and activity through lead and case relations', () => {
  const source = read('src/pages/ClientDetail.tsx');

  assert.ok(source.includes('relationIds.leadIds.has(String(task.leadId'));
  assert.ok(source.includes('relationIds.caseIds.has(String(task.caseId'));
  assert.ok(source.includes('relationIds.leadIds.has(String(event.leadId'));
  assert.ok(source.includes('relationIds.caseIds.has(String(event.caseId'));
  assert.ok(source.includes('relationIds.leadIds.has(String(activity.leadId'));
  assert.ok(source.includes('relationIds.caseIds.has(String(activity.caseId'));
});

test('ClientDetail uses current cases route from client context', () => {
  const source = read('src/pages/ClientDetail.tsx');

  assert.ok(source.includes('`/cases/${String(caseRecord.id)}`'));
  assert.ok(source.includes('`/cases/${String(lead.linkedCaseId)}`'));
  assert.equal(source.includes('navigate(`/case/${String(caseRecord.id)}`)'), false);
  assert.equal(source.includes('navigate(`/case/${String(lead.linkedCaseId)}`)'), false);
});

test('ClientDetail operational center documentation exists', () => {
  const doc = read('docs/CLIENT_DETAIL_V1_OPERATIONAL_CENTER_2026-04-24.md');

  assert.ok(doc.includes('Client Detail V1 operational center'));
  assert.ok(doc.includes('nastÄ™pny ruch klienta'));
  assert.ok(doc.includes('/cases/:id'));
});
