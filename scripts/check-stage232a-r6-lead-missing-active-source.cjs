const fs = require('fs');
const assert = require('assert');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function mustInclude(text, token, label) {
  assert.ok(text.includes(token), label + ': missing token ' + token);
}

const lead = read('src/pages/LeadDetail.tsx');
const context = read('src/components/ContextActionDialogs.tsx');

mustInclude(lead, 'STAGE232A_R6_LEAD_MISSING_BLOCKER_ACTIVE_LIST_AND_TOP_CARD_SOURCE_TRUTH', 'LeadDetail R6 marker');
mustInclude(lead, 'function isActiveMissingItemTaskStage232AR6', 'active missing helper');
mustInclude(lead, 'function isLeadBlockerTaskStage232AR6', 'blocker helper');
mustInclude(lead, 'activeMissingItemEntriesStage232AR6', 'active missing selector');
mustInclude(lead, 'linkedTasks.filter((entry: any) => isActiveMissingItemTaskStage232AR6(entry))', 'active missing from linkedTasks');
mustInclude(lead, 'leadBlockerEntries = useMemo', 'blockers are useMemo');
mustInclude(lead, 'activeMissingItemEntriesStage232AR6.filter((entry: any) => isLeadBlockerTaskStage232AR6(entry))', 'blockers subset source');
mustInclude(lead, "metadata.blocksProgress === true || metadata.status.includes('block')", 'explicit blocker logic');
mustInclude(lead, "!isMissingItemTimelineEntry(entry)", 'next actions exclude missing helper');
mustInclude(lead, 'lead-detail-stage228b-r14-source-copy', 'action center source copy');

assert.ok(!lead.includes('const leadBlockerEntries = activeMissingItemEntriesStage228R19R2;'), 'leadBlockerEntries must not equal all active missing items');

const selectorStart = lead.indexOf('const activeMissingItemEntriesStage232AR6');
const selectorEnd = lead.indexOf('const leadNextActionEntries', selectorStart);
assert.ok(selectorStart > -1 && selectorEnd > selectorStart, 'cannot locate R6 selector segment');
const selectorSegment = lead.slice(selectorStart, selectorEnd);
assert.ok(!selectorSegment.includes("title.includes('brak')"), 'active missing selector must not infer Brak by title');
assert.ok(!selectorSegment.includes("title.includes('missing')"), 'active missing selector must not infer missing by title');
assert.ok(!selectorSegment.includes('activities.'), 'active missing selector must not read activities');
assert.ok(!selectorSegment.includes('timeline.filter'), 'active missing selector must not derive from timeline/history');

mustInclude(context, 'STAGE232A_R6_CONTEXT_ACTION_MISSING_BLOCKER_TASK_PERSISTENCE', 'ContextActionDialogs R6 marker');
mustInclude(context, 'let createdMissingTask: Record<string, unknown> | null = null;', 'createdMissingTask scope');
mustInclude(context, "status: draft.blocksProgress ? 'blocking_missing_item' : 'missing_item'", 'blocking status persistence');
mustInclude(context, 'missingKind: draft.missingKind', 'missingKind persistence');
mustInclude(context, 'blocksProgress: draft.blocksProgress', 'blocksProgress persistence');
mustInclude(context, 'blockScope: draft.blockScope || null', 'blockScope persistence');
mustInclude(context, "source: 'stage232a_r6_lead_missing_blocker_active_source_truth'", 'payload source');
mustInclude(context, 'item: createdMissingTask ? { ...createdMissingTask, ...stage232aMissingItemMetadata } : stage232aMissingItemMetadata', 'no-flicker saved metadata');
mustInclude(context, 'await handleSaved(createdMissingTask || undefined);', 'saved event receives task');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE232A_R6_LEAD_MISSING_BLOCKER_ACTIVE_LIST_AND_TOP_CARD_SOURCE_TRUTH',
  guard: 'check-stage232a-r6-lead-missing-active-source'
}, null, 2));
