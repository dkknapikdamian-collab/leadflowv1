const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

const guard = fs.readFileSync('scripts/check-ui-patch-layers.cjs', 'utf8');

test('UI patch layer guard encodes delete action and DOM patch contracts', () => {
  assert.match(guard, /guard:ui:patch-layers/);
  assert.match(guard, /EntityTrashButton or EntityActionButton tone="danger"/);
  assert.match(guard, /querySelector\/querySelectorAll runtime UI patches/);
  assert.match(guard, /replaceChildren DOM rewrites/);
  assert.match(guard, /inline style on action\/icon\/delete controls/);
  assert.match(guard, /new direct Trash2 delete controls/);
  assert.match(guard, /new stacked stage\/source-truth CSS imports/);
});

test('UI patch layer guard keeps existing debt explicit through allowlists', () => {
  assert.match(guard, /DOM_PATCH_ALLOWLIST/);
  assert.match(guard, /DIRECT_TRASH2_ALLOWLIST/);
  assert.match(guard, /STYLE_LAYER_ALLOWLIST_MAX/);
  assert.match(guard, /STAGE_CLASS_ALLOWLIST_MAX/);
  assert.match(guard, /knownDebt/);
});

test('guard:ui:patch-layers passes on current explicit baseline', () => {
  const result = spawnSync(process.execPath, ['scripts/check-ui-patch-layers.cjs'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /"ok": true/);
});
