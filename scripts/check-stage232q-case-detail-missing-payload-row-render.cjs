const fs = require('fs');
const assert = require('assert');

const stage = 'STAGE232Q_CASE_DETAIL_MISSING_PAYLOAD_ROW_RENDER';
const source = fs.readFileSync('src/pages/CaseDetail.tsx', 'utf8');
const start = source.indexOf('function isCaseActivitySourceForWorkRow');
assert.ok(start >= 0, 'isCaseActivitySourceForWorkRow missing');
const nextFunction = source.indexOf('\nfunction ', start + 1);
const nextConst = source.indexOf('\nconst ', start + 1);
const ends = [nextFunction, nextConst].filter((value) => value > start);
const end = ends.length ? Math.min(...ends) : source.length;
const block = source.slice(start, end);

assert.ok(source.includes(stage), 'STAGE232Q marker missing');
assert.ok(block.includes('hasExplicitActivityShapeStage232Q'), 'activity detection must require explicit activity shape');
assert.ok(block.includes("'eventType' in value || 'actorType' in value"), 'activity detection must use eventType/actorType');
assert.ok(block.includes('hasWorkRowShapeStage232Q'), 'work row shape exclusion missing');
assert.ok(!block.includes("'payload' in value"), 'payload-only source must not be treated as activity');
assert.ok(source.includes('if (isCaseActivitySourceForWorkRow(entry.source))'), 'WorkItemRow guard call missing');
assert.ok(source.includes('data-work-kind={entry.kind}'), 'WorkItemRow data-work-kind marker missing');

const hasGroupCountAndItems =
  source.includes("count: workItems.filter((entry) => entry.kind === 'missing').length") &&
  source.includes("items: workItems.filter((entry) => entry.kind === 'missing').slice(0, 5)");
assert.ok(hasGroupCountAndItems, 'blockers group count/items contract changed');

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage232q-case-detail-missing-payload-row-render' }, null, 2));
