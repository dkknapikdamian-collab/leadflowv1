const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME';
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const dialogs = fs.readFileSync('src/components/ContextActionDialogs.tsx', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

must(client, stage, 'ClientDetail stage marker');
must(dialogs, 'STAGE232I2_CONTEXT_ACTION_CLIENT_MISSING_ITEM_SOURCE', 'ContextActionDialogs direct client source');
must(dialogs, 'sourceEntityType: request.recordType', 'sourceEntityType');
must(dialogs, 'sourceEntityId: request.recordId', 'sourceEntityId');
must(dialogs, 'clientId: clientId || null', 'clientId');
must(dialogs, 'missingKind: draft.missingKind', 'missingKind');
must(dialogs, 'blocksProgress: draft.blocksProgress', 'blocksProgress');

must(client, 'directClientMissingItems', 'direct client aggregation');
must(client, 'leadMissingItems', 'lead aggregation');
must(client, 'caseMissingItems', 'case aggregation');
must(client, 'directClientBlockers', 'direct blockers');
must(client, 'leadBlockers', 'lead blockers');
must(client, 'caseBlockers', 'case blockers');
must(client, 'data-stage232i2-client-missing-source-badge={sourceType}', 'source badge');
must(client, '[{sourceLabel}]', 'visible source label');
must(client, 'data-stage232i2-client-missing-filter={filter.key}', 'filters');
must(client, 'data-stage232i2-resolve-source-item="true"', 'resolve source item');
must(client, 'data-stage232i2-delete-source-item="true"', 'delete source item');

assert.ok(!client.includes('insertCaseItemToSupabase'), 'ClientDetail must not use case_items for active missing');
assert.ok(!fs.existsSync('supabase/migrations/STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME.sql'), 'STAGE232I2 must not add SQL');
assert.ok(fs.existsSync('_project/runs/STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME.md'), 'run report missing');
assert.ok(fs.existsSync('_project/obsidian_updates/2026-06-17_STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME.md'), 'obsidian payload missing');

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage232i2-client-detail-missing-blocker-runtime' }, null, 2));
