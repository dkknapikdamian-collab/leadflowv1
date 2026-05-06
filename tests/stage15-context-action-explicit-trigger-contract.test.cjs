const fs = require('fs');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('Stage15 adds explicit data attribute route contract without removing text fallback', () => {
  const host = read('src/components/ContextActionDialogs.tsx');
  assert.match(host, /STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT/);
  assert.ok(host.includes("CONTEXT_ACTION_KIND_ATTR = 'data-context-action-kind'"));
  assert.ok(host.includes("CONTEXT_ACTION_RECORD_TYPE_ATTR = 'data-context-record-type'"));
  assert.ok(host.includes("CONTEXT_ACTION_RECORD_ID_ATTR = 'data-context-record-id'"));
  assert.match(host, /function normalizeContextActionKind/);
  assert.match(host, /function buildContextFromExplicitClick/);
  assert.ok(host.includes("target.closest('[data-context-action-kind], button, a, [role=\"button\"]')"));
  assert.ok(host.includes("merged.includes('dodaj zadanie')"));
  assert.ok(host.includes("merged.includes('dodaj wydarzenie')"));
  assert.ok(host.includes("merged.includes('dodaj notat')"));
});

test('Stage15 keeps detail pages routed through shared context action dispatcher', () => {
  for (const rel of ['src/pages/LeadDetail.tsx', 'src/pages/ClientDetail.tsx', 'src/pages/CaseDetail.tsx']) {
    const src = read(rel);
    assert.ok(src.includes('openContextQuickAction'), rel + ' must use shared dispatcher');
    assert.equal(src.includes("from '../components/TaskCreateDialog'"), false, rel + ' must not import TaskCreateDialog directly');
    assert.equal(src.includes("from '../components/EventCreateDialog'"), false, rel + ' must not import EventCreateDialog directly');
  }
});

test('Stage15 package scripts and release note exist', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['check:stage15-context-action-explicit-trigger-contract-v1'], 'node scripts/check-stage15-context-action-explicit-trigger-contract.cjs');
  assert.equal(pkg.scripts['test:stage15-context-action-explicit-trigger-contract-v1'], 'node --test tests/stage15-context-action-explicit-trigger-contract.test.cjs');
  assert.ok(pkg.scripts['verify:stage15-context-action-contract'].includes('verify:stage14-action-route-parity'));
  const doc = read('docs/release/STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT_V1_2026-05-06.md');
  assert.match(doc, /STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT/);
  assert.match(doc, /explicit data-context-action-kind/);
});
