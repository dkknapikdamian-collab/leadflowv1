#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const STAGE = 'STAGE232T_R4_CALENDAR_LEAD_SHADOW_ACTIONS_FIX';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/^\uFEFF/, '');
}

let failures = 0;
function pass(label) {
  console.log('PASS ' + label);
}
function fail(label) {
  failures += 1;
  console.error('FAIL ' + STAGE + ': ' + label);
}
function contains(src, needle, label) {
  if (src.includes(needle)) pass(label);
  else fail('missing ' + label + ' [' + needle + ']');
}
function notContains(src, needle, label) {
  if (!src.includes(needle)) pass(label);
  else fail('forbidden ' + label + ' [' + needle + ']');
}
function matches(src, pattern, label) {
  if (pattern.test(src)) pass(label);
  else fail('missing ' + label + ' [' + pattern + ']');
}

const contract = read('src/lib/calendar-operational-entry-contract.ts');
const leadPolicy = read('src/lib/calendar-lead-shadow-entry-policy.ts');
const calendar = read('src/pages/Calendar.tsx');
const leadsApi = read('api/leads.ts');
const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');

contains(contract, "return ['edit', 'shift', 'complete', 'delete', 'open-related'];", 'lead operational action contract includes complete/delete');
contains(leadPolicy, "new Set(['edit', 'shift', 'complete', 'delete', 'open-related'])", 'lead-shadow policy allows complete/delete');
contains(leadPolicy, 'covered_by_task_or_event', 'lead-shadow still dedupes against covered task/event');
contains(leadPolicy, 'getLeadShadowCoveredSourceId', 'lead-shadow policy checks nextActionItemId coverage');

contains(leadsApi, 'STAGE232T_R4_LEAD_NEXT_ACTION_ITEM_ID_PATCH', 'lead PATCH marker for nextActionItemId');
contains(leadsApi, 'body.nextActionItemId !== undefined || body.next_action_item_id !== undefined', 'lead PATCH accepts camel/snake nextActionItemId');
contains(leadsApi, 'payload.next_action_item_id = asText(body.nextActionItemId ?? body.next_action_item_id) || null', 'lead PATCH can clear next_action_item_id');

contains(calendar, 'STAGE232T_R4_CALENDAR_LEAD_SHADOW_ACTION_SOURCE_TRUTH', 'Calendar declares lead-shadow source truth');
contains(calendar, 'getLeadShadowSourceIdStage232T_R4', 'Calendar resolves canonical lead id');
contains(calendar, 'clearLeadNextActionLocalStateStage232T_R4', 'Calendar can clear lead next action locally');
contains(calendar, 'shiftLeadNextActionLocalStateStage232T_R4', 'Calendar can shift lead next action locally');
contains(calendar, "action: 'calendar_lead_next_action_completed'", 'Calendar lead complete action payload marker');
contains(calendar, "action: 'calendar_lead_next_action_deleted'", 'Calendar lead delete action payload marker');
contains(calendar, 'lastContactAt: completedAtStage232T_R4', 'Calendar lead complete stamps lastContactAt');
contains(calendar, 'nextActionAt: null', 'Calendar lead complete/delete clears nextActionAt');
contains(calendar, "nextActionTitle: ''", 'Calendar lead complete/delete clears nextActionTitle');
contains(calendar, 'nextActionItemId: null', 'Calendar lead complete/delete clears nextActionItemId');
contains(calendar, "toast.success('Akcja leada oznaczona jako zrobiona')", 'Calendar lead complete has explicit success');
contains(calendar, "toast.success('Zaplanowana akcja leada usunięta z kalendarza')", 'Calendar lead delete has explicit success');
contains(calendar, "window.confirm('Usunąć zaplanowaną akcję leada z kalendarza? Lead zostanie.')", 'Calendar lead delete confirms lead is kept');
contains(calendar, 'shiftLeadNextActionLocalStateStage232T_R4(leadId, shiftedStartAt, nextTitle);', 'Calendar lead shift updates local state');
contains(calendar, "await updateLeadInSupabase({\n          id: leadId,", 'Calendar lead actions PATCH /api/leads via updateLeadInSupabase');
notContains(calendar, "if (entry.kind === 'lead') {\n        deleteLeadFromSupabase", 'Calendar lead delete must not delete lead');

matches(calendar, /if \(entry\.kind === 'lead'\)[\s\S]{0,1200}calendar_lead_next_action_completed/, 'handleCompleteEntry has lead branch');
matches(calendar, /if \(entry\.kind === 'lead'\)[\s\S]{0,1400}calendar_lead_next_action_deleted/, 'handleDeleteEntry has lead branch');
matches(calendar, /actionEntry\.kind === 'lead'[\s\S]{0,700}nextActionAt: shiftedStartAt[\s\S]{0,700}shiftLeadNextActionLocalStateStage232T_R4/, 'lead shift branch persists and locally updates nextActionAt');

contains(cfRuntime, 'STAGE232T_R4_CALENDAR_LEAD_SHADOW_ACTIONS_FIX_ALLOWLIST', 'CF runtime allowlist includes R4 stage');
contains(cfRuntime, 'scripts/check-stage232t-r4-calendar-lead-shadow-actions.cjs', 'CF runtime allowlist includes R4 guard');
contains(cfRuntime, 'tests/stage232t-r4-calendar-lead-shadow-actions.test.cjs', 'CF runtime allowlist includes R4 test');

notContains(calendar, 'STAGE232T_R4_LOCALSTORAGE_TOMBSTONE_FIX', 'no localStorage tombstone final fix');
notContains(calendar, 'display: none', 'no display none plaster in Calendar source');

if (failures) {
  console.error('\n' + STAGE + ' guard failures: ' + failures);
  process.exit(1);
}

console.log('PASS ' + STAGE);
