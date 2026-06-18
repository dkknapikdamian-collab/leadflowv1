const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION';
const baseline = fs.readFileSync('src/lib/owner-control/owner-control-baseline.ts', 'utf8');
const helper = fs.readFileSync('src/lib/owner-control/owner-control-missing-blockers.ts', 'utf8');
const today = fs.readFileSync('src/pages/TodayStable.tsx', 'utf8');
const cfRuntimeGuard = fs.readFileSync('scripts/check-cf-runtime-00-source-truth.cjs', 'utf8');

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

must(helper, stage, 'helper stage marker');
must(baseline, "buildMissingOwnerControlItems({ tasks, now })", 'baseline missing item injection');
must(baseline, 'isOwnerMissingControlItem(record)', 'baseline excludes missing items from generic task rows');
must(baseline, "sourceEntityType?: 'lead' | 'case' | 'client'", 'sourceEntityType field');
must(baseline, "sourceBadge?: 'Lead' | 'Sprawa' | 'Klient'", 'sourceBadge field');

must(helper, "type MissingSourceEntityType = 'lead' | 'case' | 'client'", 'source entity type');
must(helper, "return 'Lead' as const", 'Lead badge');
must(helper, "return 'Sprawa' as const", 'Sprawa badge');
must(helper, "return 'Klient' as const", 'Klient badge');
must(helper, "return `/leads/${encodedId}`", 'Lead route');
must(helper, "return `/case/${encodedId}`", 'Case route');
must(helper, "return `/clients/${encodedId}`", 'Client route');
must(helper, "status === 'blocking_missing_item'", 'blocking status');
must(helper, "readBoolean(record, ['blocksProgress', 'blocks_progress'])", 'blocksProgress flag');
must(helper, "sourceKey = `${source.sourceEntityType}:${source.sourceEntityId}:${source.normalized.id}`", 'dedup key');
must(helper, "entityType: 'task'", 'source task entity type');
must(helper, "entityId: source.normalized.id", 'source task id resolve');
must(helper, "statusLabel: `[${sourceLabel}] ${blocking ? 'Blokada' : 'Brak'}`", 'source badge status label');
must(today, "taskId={item.entityType === 'task' ? item.entityId : undefined}", 'Today source task done action');

must(cfRuntimeGuard, 'CF_RUNTIME_00_STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_SCOPE_COMPAT', 'CF runtime I3 scope marker');
must(cfRuntimeGuard, 'src/lib/owner-control/owner-control-baseline.ts', 'CF runtime I3 baseline scope');
must(cfRuntimeGuard, 'src/lib/owner-control/owner-control-missing-blockers.ts', 'CF runtime I3 helper scope');
must(cfRuntimeGuard, 'scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs', 'CF runtime I3 guard scope');
must(cfRuntimeGuard, 'tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs', 'CF runtime I3 test scope');

assert.ok(!helper.includes('case_items'), 'helper must not read active case_items source');
assert.ok(!/title.*blok/i.test(helper), 'helper must not infer blocker by title fallback');
assert.ok(!/[ÄĹĂ]/.test(helper), 'helper must not contain mojibake characters');
assert.ok(!fs.existsSync('supabase/migrations/STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION.sql'), 'I3 must not add SQL migration');

const runPath = '_project/runs/STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION.md';
const payloadPath = '_project/obsidian_updates/2026-06-18_STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION.md';
assert.ok(fs.existsSync(runPath), 'run report missing');
assert.ok(fs.existsSync(payloadPath), 'Obsidian payload missing');

console.log(JSON.stringify({
  ok: true,
  stage,
  guard: 'check-stage232i3-owner-control-missing-blocker-cross-entity-integration'
}, null, 2));
