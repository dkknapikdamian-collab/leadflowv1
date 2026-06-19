const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const src = fs.readFileSync(path.join(root, 'api', 'work-items.ts'), 'utf8');
const vercel = fs.readFileSync(path.join(root, 'vercel.json'), 'utf8');

test('/api/tasks is a rewrite to api/work-items, not api/tasks.ts', () => {
  assert.match(vercel, /"source"\s*:\s*"\/api\/tasks"/);
  assert.match(vercel, /"destination"\s*:\s*"\/api\/work-items\?kind=tasks"/);
  assert.equal(fs.existsSync(path.join(root, 'api', 'tasks.ts')), false, 'api/tasks.ts should not be the target in this repo');
});

test('POST tasks preserves client missing_item source truth in work_items', () => {
  assert.match(src, /client_id:\s*asNullableUuid\(body\.clientId\)/);
  assert.match(src, /type:\s*body\.type\s*\|\|\s*\(isMissingItemStage232I4R8 \? 'missing_item' : 'task'\)/);
  assert.match(src, /const normalizeMissingItemDbStatusStage232I4R9/);
  assert.match(src, /return normalizeTaskStatus\('todo'\)/);
  assert.doesNotMatch(src, /status:\s*isMissingItemStage232I4R8\s*\?\s*\(body\.blocksProgress/);
  assert.match(src, /show_in_tasks:\s*true/);
  assert.match(src, /show_in_calendar:\s*isMissingItemStage232I4R8 \? false : true/);
});

test('missing_item is not synced to Google Calendar as a task', () => {
  const postBlock = src.slice(src.indexOf('const isMissingItemStage232I4R8'), src.indexOf('res.status(200).json(normalizeTask(inserted));') + 80);
  assert.match(postBlock, /if \(body\.leadId && !isMissingItemStage232I4R8\) await syncLeadNextAction/);
  assert.match(postBlock, /if \(!isMissingItemStage232I4R8\) \{[\s\S]*syncGoogleCalendarEventAfterMutation/);
});

test('GET task normalization returns fields required by ClientDetail missing tile/manager', () => {
  assert.match(src, /status:\s*normalizeTaskStatusPreserveMissingStage232I4R8\(row\.status \?\? task\.status\)/);
  assert.match(src, /type:\s*getTaskRawTypeStage232I4R8\(row\) \|\| String\(task\.type \|\| 'task'\)/);
  assert.match(src, /clientId:\s*task\.clientId/);
  assert.match(src, /sourceEntityType:/);
  assert.match(src, /sourceEntityId:/);
  assert.match(src, /recordType:/);
  assert.match(src, /recordId:/);
  assert.match(src, /payload:\s*syntheticMissingPayloadStage232I4R8\(row\)/);
  assert.match(src, /blocksProgress:/);
});

