const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

function read(path) { return fs.readFileSync(path, 'utf8'); }
function section(source, start, end) {
  const startIndex = source.indexOf(start);
  assert.notEqual(startIndex, -1, 'missing section start: ' + start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, 'missing section end: ' + end);
  return source.slice(startIndex, endIndex);
}

test('manager direct false blocker source overrides stale raw blocking status', () => {
  const manager = read('src/components/detail/MissingItemsManagerDialog.tsx');
  const fn = section(manager, 'function isManagerItemBlocker(item: MissingItemsManagerItem)', 'function managerItemTitle');
  assert.ok(fn.includes('const direct = item?.isBlocker ?? item?.blocksProgress ?? item?.blocks_progress;'));
  assert.ok(fn.includes('if (direct !== undefined && direct !== null) return isTruthyBooleanLike(direct);'));
  assert.ok(fn.indexOf('if (direct !== undefined') < fn.indexOf('const status ='));
  assert.ok(fn.indexOf('if (direct !== undefined') < fn.indexOf('const priority ='));
});

test('manager raw/payload blocksProgress false overrides stale status/priority fallback', () => {
  const manager = read('src/components/detail/MissingItemsManagerDialog.tsx');
  const fn = section(manager, 'function isManagerItemBlocker(item: MissingItemsManagerItem)', 'function managerItemTitle');
  assert.ok(fn.includes('const rawOrPayloadDirect = raw?.blocksProgress ?? raw?.blocks_progress ?? payload?.blocksProgress ?? payload?.blocks_progress;'));
  assert.ok(fn.includes('if (rawOrPayloadDirect !== undefined && rawOrPayloadDirect !== null) return isTruthyBooleanLike(rawOrPayloadDirect);'));
  assert.ok(fn.indexOf('if (rawOrPayloadDirect !== undefined') < fn.indexOf('const status ='));
  assert.ok(fn.includes("status === 'blocking_missing_item'"));
  assert.ok(fn.includes("priority === 'high'"));
});

test('R16Z_R9 scope is allowed in runtime and close guards', () => {
  const cfRuntime = read('scripts/check-cf-runtime-00-source-truth.cjs');
  const closeGuard = read('scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs');
  assert.ok(cfRuntime.includes('STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE_ALLOWLIST'));
  assert.ok(closeGuard.includes('STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE_ALLOWLIST'));
});
