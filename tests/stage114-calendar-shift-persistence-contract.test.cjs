const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const calendar = fs.readFileSync(path.join(root, 'src/pages/Calendar.tsx'), 'utf8');

function getFunctionBlock(name) {
  const start = calendar.indexOf(`const ${name} = async`);
  assert.notEqual(start, -1, `${name} missing`);
  const next = calendar.indexOf('\n  const ', start + 10);
  return calendar.slice(start, next === -1 ? calendar.length : next);
}

function getTaskUpdateBlock(fnBlock) {
  const taskBranch = fnBlock.indexOf("entry.kind === 'task'");
  assert.notEqual(taskBranch, -1, 'task branch missing');
  const updateStart = fnBlock.indexOf('await updateTaskInSupabase({', taskBranch);
  assert.notEqual(updateStart, -1, 'updateTaskInSupabase missing in task branch');
  const updateEnd = fnBlock.indexOf('});', updateStart);
  assert.notEqual(updateEnd, -1, 'updateTaskInSupabase block not closed');
  return fnBlock.slice(updateStart, updateEnd + 3);
}

for (const functionName of ['handleShiftEntry', 'handleShiftEntryHours']) {
  test(`Stage114E ${functionName} persists task calendar date fields`, () => {
    const block = getFunctionBlock(functionName);
    const update = getTaskUpdateBlock(block);
    assert.match(block, /const\s+sourceId\s*=\s*String\(entry\.sourceId\s*\|\|\s*entry\.raw\?\.id\s*\|\|\s*entry\.id\)/, `${functionName} must use sourceId fallback.`);
    assert.match(update, /id:\s*sourceId,/, `${functionName} must update by sourceId fallback.`);
    assert.match(update, /date:\s*taskPayload\.date,/, `${functionName} must persist date.`);
    assert.match(update, /scheduledAt:\s*taskPayload\.dueAt,/, `${functionName} must persist scheduledAt.`);
    assert.match(update, /dueAt:\s*taskPayload\.dueAt,/, `${functionName} must persist dueAt.`);
    assert.match(update, /time:\s*taskPayload\.time,/, `${functionName} must persist time.`);
    assert.match(block, /await\s+refreshSupabaseBundle\(\)/, `${functionName} must refetch after update.`);
  });
}
