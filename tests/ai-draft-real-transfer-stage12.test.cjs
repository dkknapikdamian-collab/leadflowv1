const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const page = fs.readFileSync(path.join(root, 'src/pages/AiDrafts.tsx'), 'utf8');
const helper = fs.readFileSync(path.join(root, 'src/lib/ai-draft-approval.ts'), 'utf8');

test('Stage12 AI drafts transfer uses real selectable target forms', () => {
  assert.match(page, /AI_DRAFT_REAL_TRANSFER_STAGE12/);
  assert.match(helper, /AI_DRAFT_REAL_TRANSFER_STAGE12/);
  assert.match(page, /data-ai-draft-transfer-target-selector="true"/);
  assert.match(page, /data-ai-draft-real-transfer-form="true"/);
  assert.match(page, /data-ai-draft-real-record-create="true"/);
  assert.match(page, /handleApprovalRecordTypeChange/);
  assert.match(page, /buildAiDraftApprovalForm\(\{ \.\.\.draft, type: nextType \}\)/);
});

test('Stage12 AI draft approval keeps final writes in approval flow only', () => {
  assert.match(page, /createLeadFromAiDraftApprovalInSupabase/);
  assert.match(page, /insertTaskToSupabase/);
  assert.match(page, /insertEventToSupabase/);
  assert.match(page, /insertActivityToSupabase/);
  assert.match(page, /markAiLeadDraftConvertedAsync\(draft\.id\)/);
  assert.match(page, /Przenieś do aplikacji/);
  assert.match(page, /przeniesiony ze szkicu AI/);
});

test('Stage12 forms use the same option dictionaries as normal app forms', () => {
  assert.match(page, /SOURCE_OPTIONS/);
  assert.match(page, /TASK_TYPES/);
  assert.match(page, /EVENT_TYPES/);
  assert.match(page, /PRIORITY_OPTIONS/);
  assert.match(helper, /taskType: string/);
  assert.match(helper, /eventType: string/);
  assert.match(page, /type: form\.taskType \|\| 'follow_up'/);
  assert.match(page, /type: form\.eventType \|\| 'meeting'/);
});

test('Stage12 files keep Polish encoding clean', () => {
  for (const [name, source] of [['AiDrafts', page], ['approval helper', helper]]) {
    assert.doesNotMatch(source, /\u00c4|\u0139|\u00c5|\u00c3/u, `${name} has mojibake`);
  }
});
