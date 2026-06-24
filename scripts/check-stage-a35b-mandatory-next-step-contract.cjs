const fs = require('fs');
const path = require('path');
const assert = require('assert');

const stage = 'STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT';
const baselinePath = 'src/lib/owner-control/owner-control-baseline.ts';
const nextMovePath = 'src/lib/owner-control/next-move-contract.ts';
const todayPath = 'src/pages/TodayStable.tsx';
const normalizePath = 'src/lib/work-items/normalize.ts';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function must(source, token, label) {
  assert.ok(source.includes(token), label + ' missing: ' + token);
}

function mustNot(source, token, label) {
  assert.ok(!source.includes(token), label + ' forbidden: ' + token);
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const baseline = read(baselinePath);
const nextMove = read(nextMovePath);
const today = read(todayPath);
const normalize = read(normalizePath);

must(baseline, stage, 'baseline stage marker');
must(nextMove, stage, 'next move stage marker');
must(today, stage, 'Today stage marker');

must(nextMove, 'buildNextMoveContract', 'next step contract function');
must(nextMove, "'follow_up'", 'follow-up action type in contract');
must(baseline, 'getRecordNextAction(input.record)', 'record nextActionAt fallback');
must(baseline, 'nextActionAt', 'nextActionAt source');
must(baseline, 'followUpAt', 'follow-up date source');

must(today, 'fetchClientsFromSupabase', 'Today fetches existing clients source');
must(today, 'clients: data.clients', 'Today passes clients to Owner Control');
must(baseline, 'clients?: unknown[]', 'baseline accepts clients');
must(baseline, 'clientRequiresOwnerControlRecord', 'client active-service gate');
must(baseline, 'suppressMissingNextStep: clientIdsWithRelatedRecordProblem.has(clientId)', 'client duplicate suppression');

must(baseline, 'priority = 150', 'overdue priority above missing');
must(baseline, 'priority = 130', 'missing next step priority');
must(baseline, 'Wysoka wartość bez bezpiecznego ruchu', 'high value without movement signal');
must(baseline, 'Cisza', 'silence signal preserved');

must(baseline, 'sourceEntityType: input.entityType', 'record source type metadata');
must(baseline, 'sourceBadge: getOwnerControlSourceLabel(input.entityType)', 'record source badge metadata');
must(baseline, 'getOwnerControlSourceHref(input.entityType, id)', 'record click routes to source');
must(baseline, 'const source = resolveNoteSource(normalized)', 'task/event source resolution');
must(baseline, 'if (!source) return null', 'ownerless task/event noise blocked');
must(baseline, 'sourceEntityType: source.sourceEntityType', 'task/event source type metadata');

must(baseline, 'buildMissingOwnerControlItems({ tasks, now })', 'A35/R2 missing/follow-up gap preserved');
must(baseline, 'buildNoteWithoutFollowUpOwnerControlItems({ items: workItems, now })', 'note without follow-up gap preserved');
must(baseline, 'isOwnerMissingControlItem(raw)', 'missing item excluded from note gap');
must(normalize, "type WorkItemType = 'task' | 'event' | 'follow_up'", 'existing work item source includes follow_up');

mustNot(baseline, 'ownerId', 'ownerId must not become Owner Control requirement');
mustNot(nextMove, 'ownerId', 'ownerId must not become next step requirement');

assert.ok(fs.existsSync('tests/stage-a35b-mandatory-next-step-contract.test.cjs'), 'A35B node test missing');
assert.ok(fs.existsSync('_project/runs/STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT.md'), 'A35B run report missing');
assert.ok(fs.existsSync('_project/obsidian_updates/2026-06-24_STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT.md'), 'A35B Obsidian payload missing');

for (const file of walk('supabase/migrations')) {
  assert.ok(!/A35B|MANDATORY_NEXT_STEP/i.test(file), 'A35B must not add SQL migration: ' + file);
}
assert.ok(!fs.existsSync('supabase/migrations/STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT.sql'), 'A35B must not add SQL migration');
assert.ok(!fs.existsSync('supabase/migrations/STAGE_A35B_MANDATORY_NEXT_STEP_CONTRACT.sql'), 'A35B must not add SQL migration');

console.log(JSON.stringify({
  ok: true,
  stage,
  guard: 'check-stage-a35b-mandatory-next-step-contract',
  sql: 'NO_SQL_OR_NEW_TABLES_DETECTED_BY_STAGE_NAME',
  ownerless: 'BLOCKED_FOR_OWNER_CONTROL_TASK_EVENT_ROWS',
}, null, 2));
