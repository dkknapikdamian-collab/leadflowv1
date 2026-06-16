const fs = require('fs');
const assert = require('assert');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const context = fs.readFileSync('src/components/ContextActionDialogs.tsx', 'utf8');

function mustInclude(source, token, label) {
  assert.ok(source.includes(token), label + ': missing token ' + token);
}

function mustMatch(source, regex, label) {
  assert.ok(regex.test(source), label + ': missing regex ' + regex);
}

mustInclude(lead, 'STAGE232A_R6_LEAD_MISSING_BLOCKER_ACTIVE_LIST_AND_TOP_CARD_SOURCE_TRUTH', 'LeadDetail R6 marker');
mustMatch(
  lead,
  /linkedTasks\s*\n\s*\.filter\(\(entry: any\) => isActiveMissingItemTaskStage232AR(?:6|8)\(entry(?:,\s*leadMissingActivityMetadataStage232AR8)?\)\)/,
  'active missing still comes from linkedTasks through R6 or R8 successor helper'
);
mustInclude(lead, 'const activeMissingItemEntriesStage232AR6 = activeMissingItemEntriesStage232AR8;', 'R6 alias to R8 active missing source');
mustInclude(lead, 'const activeMissingItemEntriesStage228R19R2 = activeMissingItemEntriesStage232AR8;', 'legacy active missing alias uses R8 source');
mustInclude(lead, 'leadBlockerEntries', 'lead blocker entries exist');
mustMatch(
  lead,
  /activeMissingItemEntriesStage232AR8\.filter\(\(entry: any\) => isLeadBlockerTaskStage232AR8\(entry\.raw \|\| entry, leadMissingActivityMetadataStage232AR8\)\)/,
  'blocker subset uses explicit R8 helper'
);
mustInclude(lead, "count: activeMissingItemEntriesStage228R19R2.length", 'Braki group counts active missing items');
mustInclude(lead, "items: activeMissingItemEntriesStage228R19R2.slice(0, 5)", 'Braki group renders active missing items');
mustInclude(lead, "history is not active source truth", 'history source truth boundary remains documented');

mustInclude(context, 'STAGE232A_R6_CONTEXT_ACTION_MISSING_BLOCKER_TASK_PERSISTENCE', 'ContextActionDialogs R6 marker');
mustInclude(context, 'missingKind', 'missing kind persists');
mustInclude(context, 'blocksProgress', 'blocksProgress persists');
mustInclude(context, 'blockScope', 'blockScope persists');
mustInclude(context, 'taskId: (createdMissingTask as any)?.id || null', 'R8 taskId bridge exists for hard refresh compatibility');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232A_R6_LEAD_MISSING_BLOCKER_ACTIVE_LIST_AND_TOP_CARD_SOURCE_TRUTH',
  guard: 'check-stage232a-r6-lead-missing-active-source',
  compatibility: 'R6 guard accepts R8 successor linkedTasks source and timeline rendering'
}, null, 2));
