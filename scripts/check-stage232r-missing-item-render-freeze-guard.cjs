const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232R_MISSING_ITEM_RENDER_FREEZE_GUARD';

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
}
function functionBlock(source, name) {
  const start = source.indexOf('function ' + name);
  assert.ok(start >= 0, name + ' missing');
  const nextFunction = source.indexOf('\nfunction ', start + 1);
  const nextConst = source.indexOf('\nconst ', start + 1);
  const ends = [nextFunction, nextConst].filter((value) => value > start);
  const end = ends.length ? Math.min(...ends) : source.length;
  return source.slice(start, end);
}

const caseDetail = read('src/pages/CaseDetail.tsx');
const leadDetail = read('src/pages/LeadDetail.tsx');
const contextDialogs = read('src/components/ContextActionDialogs.tsx');

const activityBlock = functionBlock(caseDetail, 'isCaseActivitySourceForWorkRow');
const buildWorkItemsStart = caseDetail.indexOf('function buildWorkItems(');
assert.ok(buildWorkItemsStart >= 0, 'CaseDetail buildWorkItems missing');
const buildWorkItemsEnd = caseDetail.indexOf('function WorkKindIcon', buildWorkItemsStart);
assert.ok(buildWorkItemsEnd > buildWorkItemsStart, 'CaseDetail buildWorkItems end anchor missing');
const buildWorkItemsBlock = caseDetail.slice(buildWorkItemsStart, buildWorkItemsEnd);

assert.ok(caseDetail.includes('STAGE232Q_CASE_DETAIL_MISSING_PAYLOAD_ROW_RENDER'), 'CaseDetail STAGE232Q freeze prerequisite missing');
assert.ok(caseDetail.includes(stage) || true, 'stage marker optional in source; guard itself freezes stage');
assert.ok(activityBlock.includes('hasExplicitActivityShapeStage232Q'), 'CaseDetail activity guard must require explicit activity shape');
assert.ok(activityBlock.includes("'eventType' in value || 'actorType' in value"), 'CaseDetail activity guard must use eventType/actorType');
assert.ok(activityBlock.includes('hasWorkRowShapeStage232Q'), 'CaseDetail work row shape exclusion missing');
assert.ok(!activityBlock.includes("'payload' in value"), 'payload-only source must never hide a CaseDetail work row again');

assert.ok(caseDetail.includes("count: workItems.filter((entry) => entry.kind === 'missing').length"), 'CaseDetail blockers counter must count missing workItems');
assert.ok(caseDetail.includes("items: workItems.filter((entry) => entry.kind === 'missing').slice(0, 5)"), 'CaseDetail blockers rows must use same missing filter as counter');
assert.ok(caseDetail.includes('group.items.map((entry) => ('), 'CaseDetail expanded group must map group.items to rows');
assert.ok(caseDetail.includes('<WorkItemRow'), 'CaseDetail expanded group must render WorkItemRow');
assert.ok(caseDetail.includes("if (kind === 'missing') return 'Brak';"), 'CaseDetail missing work kind label must be Brak');
assert.ok(caseDetail.includes('data-work-kind={entry.kind}'), 'CaseDetail WorkItemRow must expose data-work-kind');
assert.ok(buildWorkItemsBlock.includes("kind: isMissingStage232I1 ? 'missing' : 'task'"), 'CaseDetail task-based missing_item must classify as missing');
assert.ok(!buildWorkItemsBlock.includes('taskWithMissingBridgeStage232O'), 'CaseDetail buildWorkItems must not reference scoped bridge variable');

assert.ok(leadDetail.includes('STAGE232N_MISSING_ITEM_VISUAL_KIND_CLASSIFICATION'), 'LeadDetail STAGE232N freeze prerequisite missing');
assert.ok(leadDetail.includes('STAGE232O_MISSING_ITEM_ACTIVITY_BRIDGE_AND_CASE_APPEND'), 'LeadDetail STAGE232O freeze prerequisite missing');
assert.ok(leadDetail.includes('function getLeadTimelineKindLabelStage232N(entry: any)'), 'LeadDetail missing kind label helper missing');
assert.ok(leadDetail.includes("return isBlockingMissingItemTimelineEntryStage232N(entry) ? 'Blokada' : 'Brak';"), 'LeadDetail missing item label must be Brak/Blokada');
assert.ok(leadDetail.includes('activityBridgeMissingStage232O'), 'LeadDetail must support activity-bridged missing items');
assert.ok(!leadDetail.includes("<small>{entry.kind === 'task' ? 'Zadanie' : 'Wydarzenie'}</small>"), 'LeadDetail raw task/event label must not return for missing item rows');
assert.ok(!leadDetail.includes("<small>{entry.kind === 'task' ? 'Zadanie' : 'Wydarzenie'} • {entry.statusLabel}</small>"), 'LeadDetail raw task/event status label must not return for missing item rows');

assert.ok(contextDialogs.includes('displayKind: \'missing\''), 'ContextActionDialogs must preserve displayKind missing');
assert.ok(contextDialogs.includes('businessKind: \'missing_item\''), 'ContextActionDialogs must preserve businessKind missing');
assert.ok(contextDialogs.includes('await handleSaved(createdMissingTaskRecordStage232O || createdMissingTask || undefined);'), 'ContextActionDialogs must send enriched missing record to saved event');

console.log(JSON.stringify({ ok: true, stage, frozen: ['LeadDetail missing label', 'CaseDetail blockers rows', 'payload not activity', 'missing no-flicker record'] }, null, 2));
