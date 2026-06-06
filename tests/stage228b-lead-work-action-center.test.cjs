const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = process.cwd();
const leadDetail = fs.readFileSync(path.join(repoRoot, 'src/pages/LeadDetail.tsx'), 'utf8');

test('Stage228B renders a lead action center before notes/history', () => {
  const centerIndex = leadDetail.indexOf('data-stage228b-lead-work-action-center="true"');
  const notesIndex = leadDetail.indexOf('lead-detail-history-center lead-detail-notes-only-section');
  assert.notEqual(centerIndex, -1);
  assert.notEqual(notesIndex, -1);
  assert.ok(centerIndex < notesIndex, 'lead work action center should be above notes/history in the main work column');
  assert.match(leadDetail, /Co robimy teraz\?/);
  assert.match(leadDetail, /Działania leada/);
});

test('Stage228B keeps lead work items actionable, not read-only', () => {
  for (const token of [
    'Edytuj',
    'Jutro',
    'Zrobione',
    'Usuń',
    'openLinkedTaskEditor(entry.raw)',
    'openLinkedEventEditor(entry.raw)',
    'handleRescheduleLinkedTask(entry.raw, 24 * 60 * 60 * 1000, \'Jutro\')',
    'handleRescheduleLinkedEvent(entry.raw, 24 * 60 * 60 * 1000, \'Jutro\')',
    'handleToggleLinkedTask(entry.raw)',
    'handleToggleLinkedEvent(entry.raw)',
    'handleDeleteLinkedTask(entry.raw)',
    'handleDeleteLinkedEvent(entry.raw)',
  ]) {
    assert.ok(leadDetail.includes(token), `missing action token: ${token}`);
  }
});

test('Stage228B exposes human-readable quick actions for lead continuation', () => {
  for (const token of [
    'Dodaj notatkę',
    'Dodaj zadanie',
    'Dodaj wydarzenie',
    'Dodaj brak',
    'Oznacz utracony',
    'Najbliższe działania',
    'Braki i blokady',
    'Wszystkie aktywne',
  ]) {
    assert.ok(leadDetail.includes(token), `missing UI token: ${token}`);
  }
  assert.ok(leadDetail.includes('handleCreateQuickTask'));
  assert.ok(leadDetail.includes('handleCreateQuickEvent'));
  assert.ok(leadDetail.includes("handleUpdateStatus('lost')"));
});
