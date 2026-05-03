const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/server/_access-gate.ts'), 'utf8');

test('workspace write access ignores req object as status argument and keeps runtime compat marker', () => {
  assert.ok(source.includes('PHASE0_WORKSPACE_WRITE_ACCESS_RUNTIME_REQ_COMPAT_2026_05_03'));
  assert.ok(source.includes('function isRequestLike'));
  assert.ok(source.includes('isRequestLike(statusInput) ? undefined : statusInput'));
  assert.ok(source.includes("return { id: workspaceId, access_status: 'trial_active' }"));
});

test('workspace write access still blocks expired or inactive states and keeps date guard', () => {
  assert.match(source, /trial_expired/);
  assert.match(source, /isPastDate\(nextBillingAt\)/);
  assert.match(source, /WORKSPACE_WRITE_ACCESS_REQUIRED/);
  assert.match(source, /paid_active/);
  assert.match(source, /trial_active/);
  assert.match(source, /free_active/);
});

test('entity limit helper accepts singular runtime entity aliases', () => {
  assert.ok(source.includes("normalized === 'lead'"));
  assert.ok(source.includes("return 'activeLeads'"));
  assert.ok(source.includes("normalized === 'task'"));
  assert.ok(source.includes("return 'activeTasks'"));
});
