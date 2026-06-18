const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232N_MISSING_ITEM_VISUAL_KIND_CLASSIFICATION';
const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const context = fs.readFileSync('src/components/ContextActionDialogs.tsx', 'utf8');
const caseDetail = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');

assert.ok(lead.includes(stage), 'LeadDetail STAGE232N marker missing');
assert.ok(lead.includes('function getLeadTimelineKindLabelStage232N(entry: any)'), 'LeadDetail kind label helper missing');
assert.ok(lead.includes('function getLeadTimelineStatusLabelStage232N(entry: any)'), 'LeadDetail status label helper missing');
assert.ok(lead.includes("return isBlockingMissingItemTimelineEntryStage232N(entry) ? 'Blokada' : 'Brak';"), 'LeadDetail missing label must be Brak/Blokada');
assert.ok(lead.includes('getLeadTimelineKindLabelStage232N(entry)'), 'LeadDetail row kind helper must be used');
assert.ok(lead.includes('getLeadTimelineStatusLabelStage232N(entry)'), 'LeadDetail row status helper must be used');
assert.ok(lead.includes('data-stage232n-row-kind={getLeadTimelineRowDataKindStage232N(entry)}'), 'LeadDetail row kind data marker missing');
assert.ok(!lead.includes("<small>{entry.kind === 'task' ? 'Zadanie' : 'Wydarzenie'}</small>"), 'LeadDetail raw task/event small label still present');
assert.ok(!lead.includes("<small>{entry.kind === 'task' ? 'Zadanie' : 'Wydarzenie'} • {entry.statusLabel}</small>"), 'LeadDetail raw task/event status small label still present');

assert.ok(context.includes('STAGE232N_CONTEXT_ACTION_MISSING_NO_FLICKER_DISPLAY_KIND'), 'ContextActionDialogs STAGE232N marker missing');
assert.ok(context.includes("displayKind: 'missing'"), 'ContextActionDialogs displayKind missing');
assert.ok(context.includes("businessKind: 'missing_item'"), 'ContextActionDialogs businessKind missing');
assert.ok(context.includes('record: createdMissingTaskRecordStage232N'), 'ContextActionDialogs no-flicker record missing');

assert.ok(caseDetail.includes("kind: isMissingStage232I1 ? 'missing' : 'task'"), 'CaseDetail missing_item classification must remain missing, not task');
assert.ok(caseDetail.includes('inactiveStatusesStage232M'), 'CaseDetail STAGE232M inactive filter must remain');

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage232n-missing-item-visual-kind-classification' }, null, 2));
