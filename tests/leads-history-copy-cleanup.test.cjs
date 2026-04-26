const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

test('lead history cards do not show extra explanatory suffix copy', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/pages/Leads.tsx'), 'utf8');

  assert.doesNotMatch(source, /pełni rolę historii pozyskania/u);
  assert.doesNotMatch(source, /•\s*Obsługa/u);
  assert.match(source, /Historia/);
});
