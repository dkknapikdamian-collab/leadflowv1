const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const client = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const manager = fs.readFileSync('src/components/detail/MissingItemsManagerDialog.tsx', 'utf8');

test('R16Y_R2 source truth helper reads legal priority high as blocker', () => {
  assert.match(client, /function\s+isStage232I2BlockingMissingItem[\s\S]*priority\s*===\s*['"]high['"]/);
});

test('R16Y_R2 create path does not mark every missing item as high priority', () => {
  assert.ok(client.includes("priority: clientMissingBlocksProgress ? 'high' : 'medium'"));
});

test('R16Y_R2 toggle PATCH persists priority but not missing status to DB status', () => {
  const start = client.indexOf('const handleToggleClientMissingBlockerStage232I4R13F = useCallback');
  const end = client.indexOf('  const handleResolveClientMissingItemStage228R13', start);
  assert.ok(start >= 0 && end > start);
  const block = client.slice(start, end);
  const patchStart = block.indexOf('await updateTaskInSupabase({');
  const patchEnd = block.indexOf('} as any);', patchStart);
  assert.ok(patchStart >= 0 && patchEnd > patchStart);
  const payload = block.slice(patchStart, patchEnd);
  assert.match(payload, /priority\s*:\s*nextPriorityStage232I4R16X/);
  assert.doesNotMatch(payload, /\n\s*status\s*:\s*nextMissingStateStage232I4R16X\s*,/);
  assert.doesNotMatch(payload, /status\s*:\s*['"](?:missing_item|blocking_missing_item)['"]/);
});

test('R16Y_R2 manager keeps accepted compact layout and visible delete action', () => {
  assert.ok(manager.includes('!w-[620px]'));
  assert.ok(manager.includes('data-stage232i4-r16y-r2-manager-delete-visible="true"'));
  assert.ok(manager.includes('Uzupełnij'));
  assert.ok(manager.includes('Usuń'));
  assert.ok(manager.includes('>Blokuje<'));
  assert.doesNotMatch(manager, /overflow-x-auto|overflow-x-scroll/);
});
