const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = path.join(__dirname, '..');
function read(rel) { return fs.readFileSync(path.join(repo, rel), 'utf8'); }

test('Stage89 removes local quick task/event dialogs from LeadDetail', () => {
  const body = read('src/pages/LeadDetail.tsx');
  assert.match(body, /openLeadContextAction\('task'\)/);
  assert.match(body, /openLeadContextAction\('event'\)/);
  assert.match(body, /openLeadContextAction\('note'\)/);
  assert.doesNotMatch(body, /isQuickTaskOpen/);
  assert.doesNotMatch(body, /isQuickEventOpen/);
  assert.doesNotMatch(body, /handleCreateQuickTask/);
  assert.doesNotMatch(body, /handleCreateQuickEvent/);
});

test('Stage89 removes local task/event/note dialogs from CaseDetail but keeps CaseItemDialog', () => {
  const body = read('src/pages/CaseDetail.tsx');
  assert.match(body, /openCaseContextAction\('task'\)/);
  assert.match(body, /openCaseContextAction\('event'\)/);
  assert.match(body, /openCaseContextAction\('note'\)/);
  assert.match(body, /CaseItemDialog/);
  assert.doesNotMatch(body, /function CaseTaskDialog\(/);
  assert.doesNotMatch(body, /function CaseEventDialog\(/);
  assert.doesNotMatch(body, /function CaseNoteDialog\(/);
  assert.doesNotMatch(body, /<CaseTaskDialog /);
  assert.doesNotMatch(body, /<CaseEventDialog /);
  assert.doesNotMatch(body, /<CaseNoteDialog /);
});

test('Stage89 routes ClientDetail note quick action to shared context dialog', () => {
  const body = read('src/pages/ClientDetail.tsx');
  assert.match(body, /openClientContextAction\('note'\)/);
  assert.doesNotMatch(body, /Dodaj notatk.*setContactEditing\(true\)/);
});
