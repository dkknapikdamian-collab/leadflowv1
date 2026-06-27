const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

test('lead shadow action contract allows the buttons Calendar renders', () => {
  const contract = read('src/lib/calendar-operational-entry-contract.ts');
  const policy = read('src/lib/calendar-lead-shadow-entry-policy.ts');

  assert.match(contract, /return \['edit', 'shift', 'complete', 'delete', 'open-related'\]/);
  assert.match(policy, /LEAD_ALLOWED_ACTIONS = new Set\(\['edit', 'shift', 'complete', 'delete', 'open-related'\]\)/);
});

test('lead delete/complete clear lead next-action fields without deleting the lead', () => {
  const calendar = read('src/pages/Calendar.tsx');
  const completeHandlerIndex = calendar.indexOf('const handleCompleteEntry = async (entry: ScheduleEntry) => {');
  const completeLeadBranchIndex = calendar.indexOf("if (entry.kind === 'lead')", completeHandlerIndex);
  const localSeedIndex = calendar.indexOf('const isLocalCalendarSeed', completeHandlerIndex);

  assert.match(calendar, /calendar_lead_next_action_completed/);
  assert.match(calendar, /calendar_lead_next_action_deleted/);
  assert.match(calendar, /lastContactAt: completedAtStage232T_R4/);
  assert.match(calendar, /nextActionAt: null/);
  assert.match(calendar, /nextActionTitle: ''/);
  assert.match(calendar, /nextActionItemId: null/);
  assert.match(calendar, /retainCompletedLeadShadowEntryStage232T_R5/);
  assert.match(calendar, /completedLeadShadowEntriesStage232T_R5/);
  assert.ok(completeLeadBranchIndex > completeHandlerIndex, 'lead complete branch must exist in handleCompleteEntry');
  assert.ok(localSeedIndex > completeLeadBranchIndex, 'lead complete branch must run before local seed fallback');
  assert.doesNotMatch(calendar, /deleteLeadFromSupabase/);
});

test('lead PATCH can clear next_action_item_id as canonical source link', () => {
  const leadsApi = read('api/leads.ts');

  assert.match(leadsApi, /STAGE232T_R4_LEAD_NEXT_ACTION_ITEM_ID_PATCH/);
  assert.match(leadsApi, /body\.nextActionItemId !== undefined \|\| body\.next_action_item_id !== undefined/);
  assert.match(leadsApi, /payload\.next_action_item_id = asText\(body\.nextActionItemId \?\? body\.next_action_item_id\) \|\| null/);
});

test('lead shift keeps lead.next_action_at as source of truth', () => {
  const calendar = read('src/pages/Calendar.tsx');

  assert.match(calendar, /actionEntry\.kind === 'lead'/);
  assert.match(calendar, /nextActionAt: shiftedStartAt/);
  assert.match(calendar, /shiftLeadNextActionLocalStateStage232T_R4\(leadId, shiftedStartAt, nextTitle\)/);
});

test('lead shadow dedupe still hides shadows covered by task or event', () => {
  const policy = read('src/lib/calendar-lead-shadow-entry-policy.ts');

  assert.match(policy, /getLeadShadowCoveredSourceId/);
  assert.match(policy, /covered_by_task_or_event/);
  assert.match(policy, /coveredKeys\.has\(`source:\$\{coveredSourceId\}`\)/);
});
