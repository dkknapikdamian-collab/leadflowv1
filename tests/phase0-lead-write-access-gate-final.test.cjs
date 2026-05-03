const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const gate = fs.readFileSync(path.join(root, 'src/server/_access-gate.ts'), 'utf8');

test('workspace write gate keeps paid/trial/free access contract and date guard marker', () => {
  assert.match(gate, /export\s+async\s+function\s+assertWorkspaceWriteAccess/);
  assert.match(gate, /status\s*===\s*['"]paid_active['"]/);
  assert.match(gate, /isPastDate\(nextBillingAt\)/);
  assert.match(gate, /status\s*===\s*['"]trial_active['"]\s*\|\|\s*status\s*===\s*['"]trial_ending['"]/);
  assert.match(gate, /status\s*===\s*['"]free_active['"]/);
  assert.match(gate, /WORKSPACE_WRITE_ACCESS_REQUIRED/);
});

test('access gate exports AI and entity limit helpers used by Vercel handlers', () => {
  assert.match(gate, /export\s+async\s+function\s+assertWorkspaceAiAllowed/);
  assert.match(gate, /export\s+async\s+function\s+assertWorkspaceEntityLimit/);
  assert.match(gate, /FREE_LIMITS/);
  assert.match(gate, /WORKSPACE_AI_ACCESS_REQUIRED/);
  assert.match(gate, /WORKSPACE_ENTITY_LIMIT_REACHED/);
});
