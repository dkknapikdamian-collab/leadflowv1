const test = require('node:test');
const assert = require('node:assert/strict');
const { validateUiTruthCopy } = require('../scripts/check-ui-truth-copy.cjs');

test('UI truth/copy contract has clean Polish text and honest feature status copy', () => {
  const failures = validateUiTruthCopy(process.cwd());
  assert.deepEqual(failures, []);
});
