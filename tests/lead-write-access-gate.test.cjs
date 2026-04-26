const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function source(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('lead writes require active workspace access', () => {
  const leadsApi = source('api/leads.ts');
  const gate = source('src/server/_access-gate.ts');

  assert.ok(leadsApi.includes("import { assertWorkspaceWriteAccess } from '../src/server/_access-gate.js';"), 'no import');
  assert.ok(leadsApi.includes('await assertWorkspaceWriteAccess(workspaceId);'), 'no workspace gate');
  assert.ok(leadsApi.includes('await assertWorkspaceWriteAccess(finalWorkspaceId);'), 'no final gate');
  assert.ok(leadsApi.includes("res.status(402).json({ error: 'WORKSPACE_WRITE_ACCESS_REQUIRED' });"), 'no 402');

  assert.ok(gate.includes("status === 'paid_active'"), 'no paid check');
  assert.ok(gate.includes('isPastDate(nextBillingAt)'), 'no date check');
  assert.ok(gate.includes("status === 'trial_active' || status === 'trial_ending'"), 'no trial check');
});
