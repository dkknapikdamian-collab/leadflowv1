const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

test('MissingItem contract stores explicit blocker metadata', () => {
  const contract = read('src/lib/missing-items/stage227c2-missing-item-modal-contract.ts');
  assert.match(contract, /missingKind/);
  assert.match(contract, /blocksProgress/);
  assert.match(contract, /blockScope/);
  assert.match(contract, /normalizeMissingItemKind/);
});

test('MissingItem modal exposes kind and blocking fields without duplicate input regression', () => {
  const modal = read('src/components/detail/MissingItemQuickActionModal.tsx');
  assert.match(modal, /missingKindValue/);
  assert.match(modal, /blocksProgressValue/);
  assert.match(modal, /blockScopeValue/);
  assert.match(modal, /data-stage232a-blocks-progress-field/);
  assert.doesNotMatch(modal, /<input\s*<input/);
});

test('ContextActionDialogs persists metadata into activity and local no-flicker record', () => {
  const host = read('src/components/ContextActionDialogs.tsx');
  assert.match(host, /stage232aMissingItemMetadata/);
  assert.match(host, /missingKind: draft\.missingKind/);
  assert.match(host, /blocksProgress: draft\.blocksProgress/);
  assert.match(host, /blockScope: draft\.blockScope/);
  assert.match(host, /\.\.\.stage232aMissingItemMetadata/);
});

test('Activity timeline labels missing_item as Brak or Blokada', () => {
  const timeline = read('src/lib/activity-timeline.ts');
  assert.match(timeline, /Blokada/);
  assert.match(timeline, /Brak/);
});
