const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

test('Stage227C3B wires ClientDetail Brak to shared modal and lightweight persistence', () => {
  const client = read('src/pages/ClientDetail.tsx');
  assert.match(client, /MissingItemQuickActionModal/);
  assert.match(client, /buildMissingItemModalDraft/);
  assert.match(client, /data-stage227c3b-client-missing-action="true"/);
  assert.match(client, /insertTaskToSupabase\(\{/);
  assert.match(client, /type: 'missing_item'/);
  assert.match(client, /status: 'missing_item'/);
  assert.match(client, /eventType: 'missing_item_created'/);
});

test('Stage227C3B formalizes ClientDetail Braki i blokady list', () => {
  const client = read('src/pages/ClientDetail.tsx');
  assert.match(client, /clientMissingItemsStage227C3B/);
  assert.match(client, /data-stage227c3b-client-missing-items-list="true"/);
  assert.match(client, /data-stage227c3b-client-missing-item-row="true"/);
  assert.match(client, /type === 'missing_item'/);
  assert.match(client, /status === 'missing_item'/);
});

test('Stage227C3B keeps CaseDetail on existing case_items model', () => {
  const caseQuick = read('src/components/CaseQuickActions.tsx');
  const caseDialog = read('src/components/AddCaseMissingItemDialog.tsx');
  assert.match(caseQuick, /key: 'missing'/);
  assert.match(caseQuick, /AddCaseMissingItemDialog/);
  assert.match(caseDialog, /insertCaseItemToSupabase/);
  assert.match(caseDialog, /status: 'missing'/);
  assert.match(caseDialog, /isRequired: true/);
  assert.doesNotMatch(caseDialog, /CREATE TABLE/i);
});
