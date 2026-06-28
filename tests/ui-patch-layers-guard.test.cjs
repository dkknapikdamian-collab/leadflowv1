const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

const guard = fs.readFileSync('scripts/check-ui-patch-layers.cjs', 'utf8');

test('UI patch layer guard encodes base anti-patch contracts', () => {
  assert.ok(guard.includes('guard:ui:patch-layers'));
  assert.ok(guard.includes('EntityTrashButton or EntityActionButton tone="danger"'));
  assert.ok(guard.includes('querySelector/querySelectorAll runtime UI patches'));
  assert.ok(guard.includes('replaceChildren DOM rewrites'));
  assert.ok(guard.includes('inline style on action/icon/delete controls'));
  assert.ok(guard.includes('new direct Trash2 delete controls'));
  assert.ok(guard.includes('new stacked stage/source-truth/hotfix CSS imports'));
});

test('UI patch layer guard encodes widened anti-patch policy', () => {
  assert.ok(guard.includes('RAW_BUTTON_ALLOWLIST'));
  assert.ok(guard.includes('LUCIDE_REACT_IMPORT_ALLOWLIST'));
  assert.ok(guard.includes('APP_STYLES_IMPORT_MAX'));
  assert.ok(guard.includes('LOCAL_ICON_BUTTON_CLONE_ALLOWLIST'));
  assert.ok(guard.includes('LOCAL_COLOR_MAP_ALLOWLIST'));
  assert.ok(guard.includes('ROUTE_LITERAL_ALLOWLIST'));
  assert.ok(guard.includes('raw <button> in src/pages or src/components outside explicit debt allowlist'));
  assert.ok(guard.includes('new direct lucide-react imports'));
  assert.ok(guard.includes('new stacked App/global CSS imports'));
  assert.ok(guard.includes('display:none/z-index/!important workarounds in TSX'));
  assert.ok(guard.includes('local status/badge color maps and status label helpers'));
  assert.ok(guard.includes('manual route literals where route helpers exist'));
});

test('UI patch layer guard encodes CSS anti-patch scan', () => {
  assert.ok(guard.includes('CSS_SCAN_ROOTS'));
  assert.ok(guard.includes('CSS_EXTENSIONS'));
  assert.ok(guard.includes('CSS_PATCH_ALLOWLIST'));
  assert.ok(guard.includes('CSS display:none/z-index/!important/fixed/absolute patch patterns'));
  assert.ok(guard.includes('position'));
  assert.ok(guard.includes('fixed|absolute'));
});

test('UI patch layer guard keeps existing debt explicit through allowlists', () => {
  assert.ok(guard.includes('DOM_PATCH_ALLOWLIST'));
  assert.ok(guard.includes('DIRECT_TRASH2_ALLOWLIST'));
  assert.ok(guard.includes('STYLE_LAYER_ALLOWLIST_MAX'));
  assert.ok(guard.includes('STAGE_CLASS_ALLOWLIST_MAX'));
  assert.ok(guard.includes('knownDebt'));
});

test('guard:ui:patch-layers passes on current explicit baseline', () => {
  const result = spawnSync(process.execPath, ['scripts/check-ui-patch-layers.cjs'], {
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /"ok": true/);
});
