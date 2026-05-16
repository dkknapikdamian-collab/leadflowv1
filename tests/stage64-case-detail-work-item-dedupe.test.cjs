const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const caseDetailPath = path.join(repoRoot, 'src', 'pages', 'CaseDetail.tsx');

test('Stage64 CaseDetail dedupes case tasks, events and final work items', () => {
  const source = fs.readFileSync(caseDetailPath, 'utf8');

  assert.match(source, /STAGE64_CASE_DETAIL_WORK_ITEM_DEDUPE/);
  assert.match(source, /function getCaseRelationPriority\(/);
  assert.match(source, /function dedupeCaseTasks\(/);
  assert.match(source, /function dedupeCaseEvents\(/);
  assert.match(source, /function dedupeCaseWorkItems\(/);
  assert.match(source, /dedupeCaseTasks\([\s\S]*taskRowsRaw[\s\S]*belongsToCase/);
  assert.match(source, /dedupeCaseEvents\([\s\S]*eventRowsRaw[\s\S]*belongsToCase/);
  assert.match(source, /dedupeCaseWorkItems\(buildWorkItems\(openTasks, plannedEvents, items, activities\)\)/);
});

test('Stage64 CaseDetail keeps direct case relation priority over lead/client relation fallback', () => {
  const source = fs.readFileSync(caseDetailPath, 'utf8');

  const caseIdCheckIndex = source.indexOf("normalizeCaseRelationId(entry.caseId)");
  const leadIdCheckIndex = source.indexOf("normalizeCaseRelationId(entry.leadId)");
  const clientIdCheckIndex = source.indexOf("normalizeCaseRelationId(entry.clientId)");

  assert.ok(caseIdCheckIndex > -1, 'caseId priority check exists');
  assert.ok(leadIdCheckIndex > -1, 'leadId fallback check exists');
  assert.ok(clientIdCheckIndex > -1, 'clientId fallback check exists');
  assert.ok(caseIdCheckIndex < leadIdCheckIndex, 'caseId is checked before leadId');
  assert.ok(leadIdCheckIndex < clientIdCheckIndex, 'leadId is checked before clientId');
});
