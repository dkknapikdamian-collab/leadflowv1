const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const start = source.indexOf('function isCaseActivitySourceForWorkRow');
const nextFunction = source.indexOf('\nfunction ', start + 1);
const nextConst = source.indexOf('\nconst ', start + 1);
const ends = [nextFunction, nextConst].filter((value) => value > start);
const end = ends.length ? Math.min(...ends) : source.length;
const block = source.slice(start, end);

test('STAGE232Q activity source detection is not payload-only', () => {
  assert.match(source, /STAGE232Q_CASE_DETAIL_MISSING_PAYLOAD_ROW_RENDER/);
  assert.match(block, /hasExplicitActivityShapeStage232Q/);
  assert.match(block, /'eventType' in value \|\| 'actorType' in value/);
  assert.doesNotMatch(block, /'payload' in value/);
});

test('STAGE232Q task-based missing_item rows with payload are allowed to render', () => {
  assert.match(block, /hasWorkRowShapeStage232Q/);
  assert.match(block, /'title' in value/);
  assert.match(block, /'status' in value/);
  assert.match(source, /data-work-kind=\{entry\.kind\}/);
});

test('STAGE232Q blockers group count and items use same missing filter source', () => {
  assert.match(source, /count: workItems\.filter\(\(entry\) => entry\.kind === 'missing'\)\.length/);
  assert.match(source, /items: workItems\.filter\(\(entry\) => entry\.kind === 'missing'\)\.slice\(0, 5\)/);
  assert.match(source, /group\.items\.map\(\(entry\) =>/);
});
