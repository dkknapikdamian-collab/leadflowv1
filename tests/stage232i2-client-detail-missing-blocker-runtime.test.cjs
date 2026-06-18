const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const dialogs = fs.readFileSync('src/components/ContextActionDialogs.tsx', 'utf8');

test('I2 direct client Brak creates missing_item with explicit client source', () => {
  assert.match(dialogs, /STAGE232I2_CONTEXT_ACTION_CLIENT_MISSING_ITEM_SOURCE/);
  assert.match(dialogs, /clientId: clientId \|\| null/);
  assert.match(dialogs, /sourceEntityType: request\.recordType/);
  assert.match(dialogs, /sourceEntityId: request\.recordId/);
  assert.match(dialogs, /missingKind: draft\.missingKind/);
  assert.match(dialogs, /blocksProgress: draft\.blocksProgress/);
});

test('I2 ClientDetail aggregates direct client, lead and case missing items', () => {
  assert.match(client, /directClientMissingItems/);
  assert.match(client, /leadMissingItems/);
  assert.match(client, /caseMissingItems/);
  assert.match(client, /directClientBlockers/);
  assert.match(client, /leadBlockers/);
  assert.match(client, /caseBlockers/);
});

test('I2 ClientDetail renders source badges and filters', () => {
  assert.match(client, /data-stage232i2-client-missing-source-badge=\{sourceType\}/);
  assert.match(client, /\[\{sourceLabel\}\]/);
  assert.match(client, /data-stage232i2-client-missing-filter=\{filter.key\}/);
  assert.match(client, /Klient/);
  assert.match(client, /Leady/);
  assert.match(client, /Sprawy/);
  assert.match(client, /Blokady/);
});

test('I2 resolve/delete calls source task handlers by item', () => {
  assert.match(client, /handleResolveClientMissingItemStage228R13\(item\)/);
  assert.match(client, /handleDeleteClientMissingItemStage228R15\(item\)/);
  assert.match(client, /data-stage232i2-resolve-source-item="true"/);
  assert.match(client, /data-stage232i2-delete-source-item="true"/);
});

test('I2 does not add SQL, Owner Control runtime or case_items active source', () => {
  assert.doesNotMatch(client, /insertCaseItemToSupabase/);
  assert.doesNotMatch(client, /owner-control\/owner-control-baseline/);
  assert.equal(fs.existsSync('supabase/migrations/STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME.sql'), false);
});
