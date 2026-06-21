const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

function read(path) { return fs.readFileSync(path, 'utf8'); }
function section(source, start, end) {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, 'missing section start: ' + start);
  const endIndex = end ? source.indexOf(end, startIndex + start.length) : -1;
  return endIndex > startIndex ? source.slice(startIndex, endIndex) : source.slice(startIndex);
}

test('LeadDetail add missing item does not create every missing item as high priority blocker', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const addHandler = section(lead, 'const handleAddLeadMissingFromManagerStage232I4R14 = async () => {', 'const handleToggleLeadMissingBlockerStage232I4R14 = async');
  assert.match(addHandler, /priority:\s*leadMissingManagerBlocksProgress\s*\?\s*'high'\s*:\s*'medium'/);
  assert.equal(addHandler.includes("priority: 'high'"), false);
});

test('LeadDetail blocker toggle persists status, priority and payload together', () => {
  const lead = read('src/pages/LeadDetail.tsx');
  const toggleHandler = section(lead, 'const handleToggleLeadMissingBlockerStage232I4R14 = async', 'const handleResolveLeadMissingItemStage228R13');
  assert.ok(toggleHandler.includes("const nextPriorityStage232I4R16ZR8 = blocksProgress ? 'high' : 'medium';"));
  assert.ok(toggleHandler.includes('status: nextStatus'));
  assert.ok(toggleHandler.includes('priority: nextPriorityStage232I4R16ZR8'));
  assert.ok(toggleHandler.includes('blocksProgress'));
  assert.ok(toggleHandler.includes("stage232i4_r16z_r8_lead_missing_blocker_toggle_priority_fix"));
});

test('R16Z_R8 scope is allowed by CF runtime and R16Z_R5 close guard', () => {
  const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');
  const closeGuard = read('scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs');
  assert.ok(cfRuntime.includes('STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX_ALLOWLIST'));
  assert.ok(closeGuard.includes('STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX_ALLOWLIST'));
});
