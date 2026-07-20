const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-client-inline-edit-and-task-edit.cjs');
const tasks = fs.readFileSync(path.join(root, 'src/pages/Tasks.tsx'), 'utf8');
const clientDetail = fs.readFileSync(path.join(root, 'src/pages/ClientDetail.tsx'), 'utf8');
const topicContact = fs.readFileSync(path.join(root, 'src/lib/topic-contact.ts'), 'utf8');
const guard = fs.readFileSync(guardPath, 'utf8');

test('reconciled R20 guard passes against current source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /guard reconciled with current contact and relation source truth/);
});

test('task add and edit flows preserve client relation and expose current edit controls', () => {
  assert.match(tasks, /clientId: newTask\.clientId \|\| null/);
  assert.match(tasks, /clientId: editTask\.clientId \|\| payload\.clientId \|\| null/);
  assert.match(tasks, /Status zadania/);
  assert.match(tasks, /selectedEditTaskOption/);
});

test('topic-contact resolves client identifiers for task relations', () => {
  assert.match(topicContact, /clientId: option\.clientId \|\| null/);
  assert.match(topicContact, /clientId\?: string \| null/);
  assert.match(topicContact, /option\.clientId === params\.clientId && !option\.disabled/);
});

test('ClientDetail uses the current inline multi-contact editor and visible labels', () => {
  assert.match(clientDetail, /data-client-inline-contact-edit="true"/);
  assert.match(clientDetail, /contactEditing \? 'Zapisz dane' : 'Edytuj dane'/);
  assert.match(clientDetail, /<ClientMultiContactField/);
  assert.match(clientDetail, /kind="phone"/);
  assert.match(clientDetail, /kind="email"/);
});

test('ClientDetail copy actions are wired without restoring the duplicate Kontakt tab', () => {
  assert.match(clientDetail, /const copyValue = async/);
  assert.match(clientDetail, /copyValue\('Telefon', String\(client\.phone \|\| ''\)\)/);
  assert.match(clientDetail, /copyValue\('E-mail', String\(client\.email \|\| ''\)\)/);
  assert.match(clientDetail, />Kopiuj<\/button>/);
  assert.doesNotMatch(clientDetail, /\{ key: 'contact', label: 'Kontakt' \}/);
  assert.doesNotMatch(clientDetail, /setActiveTab\('contact'\)/);
});

test('guard asserts current semantics instead of historical copy-label literals', () => {
  assert.match(guard, /Zapisz dane/);
  assert.match(guard, /Edytuj dane/);
  assert.match(guard, /ClientMultiContactField/);
  assert.match(guard, /copyValue\('Telefon'/);
  assert.match(guard, /copyValue\('E-mail'/);
  assert.doesNotMatch(guard, /ClientDetail missing phone copy icon/);
  assert.doesNotMatch(guard, /ClientDetail missing email copy icon/);
});
