const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

test('Stage17 adds a central registry for context action kinds', () => {
  const src = read('src/lib/context-action-contract.ts');
  assert.match(src, /STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1/);
  assert.match(src, /CONTEXT_ACTION_KIND_VALUES\s*=\s*\['task', 'event', 'note'\]/);
  assert.match(src, /dialogComponent:\s*'TaskCreateDialog'/);
  assert.match(src, /dialogComponent:\s*'EventCreateDialog'/);
  assert.match(src, /dialogComponent:\s*'ContextNoteDialog'/);
  assert.match(src, /persistenceTarget:\s*'tasks'/);
  assert.match(src, /persistenceTarget:\s*'events'/);
  assert.match(src, /persistenceTarget:\s*'activities'/);
});

test('Stage17 exposes registry evidence on the shared dialog host', () => {
  const src = read('src/components/ContextActionDialogs.tsx');
  assert.match(src, /context-action-contract/);
  assert.match(src, /data-stage17=\{STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY\}/);
  assert.match(src, /data-context-action-contract-kinds=\{Object\.keys\(CONTEXT_ACTION_CONTRACT\)\.join/);
  assert.equal((src.match(/<TaskCreateDialog /g) || []).length, 1);
  assert.equal((src.match(/<EventCreateDialog /g) || []).length, 1);
  assert.equal((src.match(/<ContextNoteDialog /g) || []).length, 1);
});

test('Stage17 keeps detail pages on shared action routing', () => {
  for (const rel of ['src/pages/LeadDetail.tsx', 'src/pages/ClientDetail.tsx', 'src/pages/CaseDetail.tsx']) {
    const src = read(rel);
    assert.match(src, /openContextQuickAction/);
    assert.doesNotMatch(src, /from ['"]\.\.\/components\/TaskCreateDialog['"]/);
    assert.doesNotMatch(src, /from ['"]\.\.\/components\/EventCreateDialog['"]/);
  }
});

test('Stage17 scripts are registered and docs exist', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['check:stage17-context-action-contract-registry-v1'], 'node scripts/check-stage17-context-action-contract-registry.cjs');
  assert.equal(pkg.scripts['test:stage17-context-action-contract-registry-v1'], 'node --test tests/stage17-context-action-contract-registry.test.cjs');
  assert.equal(exists('docs/release/STAGE17_CONTEXT_ACTION_CONTRACT_REGISTRY_V1_2026-05-06.md'), true);
});
