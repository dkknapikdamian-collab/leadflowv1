const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const baseline = fs.readFileSync('src/lib/owner-control/owner-control-baseline.ts', 'utf8');
const helper = fs.readFileSync('src/lib/owner-control/owner-control-missing-blockers.ts', 'utf8');
const today = fs.readFileSync('src/pages/TodayStable.tsx', 'utf8');

function functionBody(name) {
  const marker = `function ${name}`;
  const start = helper.indexOf(marker);
  assert.notEqual(start, -1, `${name} missing`);
  const next = helper.indexOf('\n}\n\n', start);
  assert.notEqual(next, -1, `${name} body end missing`);
  return helper.slice(start, next + 3);
}

test('I3 Owner Control reads cross-entity missing item source rows', () => {
  assert.match(helper, /STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION/);
  assert.match(baseline, /buildMissingOwnerControlItems\(\{ tasks, now \}\)/);
  assert.match(helper, /sourceEntityType = declaredType/);
  assert.match(helper, /normalized\.caseId/);
  assert.match(helper, /normalized\.clientId/);
  assert.match(helper, /normalized\.leadId/);
});

test('I3 source badges and source routes exist for Lead, Sprawa and Klient', () => {
  assert.match(helper, /return 'Lead' as const/);
  assert.match(helper, /return 'Sprawa' as const/);
  assert.match(helper, /return 'Klient' as const/);
  assert.match(helper, /return `\/leads\/\$\{encodedId\}`/);
  assert.match(helper, /return `\/case\/\$\{encodedId\}`/);
  assert.match(helper, /return `\/clients\/\$\{encodedId\}`/);
  assert.match(helper, /statusLabel: `\[\$\{sourceLabel\}\] \$\{blocking \? 'Blokada' : 'Brak'\}`/);
});

test('I3 blocker rule uses status or blocksProgress, not title guessing', () => {
  const body = functionBody('isBlockingMissingItem');
  assert.match(body, /status === 'blocking_missing_item'/);
  assert.match(body, /readBoolean\(record, \['blocksProgress', 'blocks_progress'\]\)/);
  assert.doesNotMatch(body, /title/i);
  assert.doesNotMatch(body, /name/i);
});

test('I3 deduplicates by sourceEntityType sourceEntityId and item id', () => {
  assert.match(helper, /sourceKey = `\$\{source\.sourceEntityType\}:\$\{source\.sourceEntityId\}:\$\{source\.normalized\.id\}`/);
  assert.match(helper, /deduped\.set\(sourceKey, row\)/);
});

test('I3 resolve path uses source task id through existing Today action', () => {
  assert.match(helper, /entityType: 'task'/);
  assert.match(helper, /entityId: source\.normalized\.id/);
  assert.match(today, /taskId=\{item\.entityType === 'task' \? item\.entityId : undefined\}/);
});

test('I3 does not add SQL, mojibake or active case_items source', () => {
  assert.doesNotMatch(helper, /case_items/);
  assert.doesNotMatch(helper, /Ä|Ĺ|Ă/);
  assert.equal(fs.existsSync('supabase/migrations/STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION.sql'), false);
});
