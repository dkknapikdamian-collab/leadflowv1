const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

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

test('STAGE232R freezes CaseDetail blockers count-to-row rendering', () => {
  assert.match(caseDetail, /count: workItems\.filter\(\(entry\) => entry\.kind === 'missing'\)\.length/);
  assert.match(caseDetail, /items: workItems\.filter\(\(entry\) => entry\.kind === 'missing'\)\.slice\(0, 5\)/);
  assert.match(caseDetail, /group\.items\.map\(\(entry\) => \(/);
  assert.match(caseDetail, /<WorkItemRow/);
  assert.match(caseDetail, /if \(kind === 'missing'\) return 'Brak';/);
});

test('STAGE232R freezes payload-not-activity rule', () => {
  assert.match(activityBlock, /hasExplicitActivityShapeStage232Q/);
  assert.match(activityBlock, /'eventType' in value \|\| 'actorType' in value/);
  assert.match(activityBlock, /hasWorkRowShapeStage232Q/);
  assert.doesNotMatch(activityBlock, /'payload' in value/);
});

test('STAGE232R freezes LeadDetail missing item labels', () => {
  assert.match(leadDetail, /function getLeadTimelineKindLabelStage232N\(entry: any\)/);
  assert.match(leadDetail, /isBlockingMissingItemTimelineEntryStage232N\(entry\) \? 'Blokada' : 'Brak'/);
  assert.match(leadDetail, /activityBridgeMissingStage232O/);
  assert.doesNotMatch(leadDetail, /<small>\{entry\.kind === 'task' \? 'Zadanie' : 'Wydarzenie'\}<\/small>/);
  assert.doesNotMatch(leadDetail, /<small>\{entry\.kind === 'task' \? 'Zadanie' : 'Wydarzenie'\} • \{entry\.statusLabel\}<\/small>/);
});

test('STAGE232R freezes enriched no-flicker missing record', () => {
  assert.match(contextDialogs, /displayKind: 'missing'/);
  assert.match(contextDialogs, /businessKind: 'missing_item'/);
  assert.match(contextDialogs, /await handleSaved\(createdMissingTaskRecordStage232O \|\| createdMissingTask \|\| undefined\);/);
});
