const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
function section(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = end ? source.indexOf(end, startIndex + start.length) : -1;
  assert.notEqual(startIndex, -1, 'missing section ' + start);
  return endIndex > startIndex ? source.slice(startIndex, endIndex) : source.slice(startIndex);
}

test('R10 direct task false beats stale activity fallback', () => {
  const classifier = section(lead, 'function isLeadBlockerTaskStage232AR8', 'function isWorkItemOverdue');
  assert.ok(classifier.indexOf('const directOverride = readLeadMissingDirectBlockerOverrideStage232I4R10(item);') < classifier.indexOf('isLeadBlockerTaskStage232AR6(item)'));
  assert.ok(classifier.includes('if (directOverride !== null) return directOverride;'));
});

test('R10 activity metadata keeps newest state and explicit false', () => {
  const builder = section(lead, 'function buildLeadMissingActivityMetadataStage232AR8', 'function readActivityMissingMetadataStage232AR8');
  assert.match(builder, /explicitBlocksProgress !== undefined && explicitBlocksProgress !== null \? boolStage232AR8\(explicitBlocksProgress\)/);
  assert.match(builder, /metadata\.happenedAtMs >= current\.happenedAtMs/);
});

test('R10 toggle writes neutral state activity with false-capable payload', () => {
  const toggle = section(lead, 'const handleToggleLeadMissingBlockerStage232I4R14', 'const handleResolveLeadMissingItemStage228R13');
  assert.ok(toggle.includes("await addActivity('missing_item_state_updated'"));
  assert.ok(toggle.includes('blocksProgress,'));
  assert.ok(toggle.includes('priority: nextPriorityStage232I4R16ZR8'));
  assert.ok(!toggle.includes('missing_item_blocker_updated'));
});
