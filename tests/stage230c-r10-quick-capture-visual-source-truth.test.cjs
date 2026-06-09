const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');

test('Stage230C-R10/R15 quick capture visual source truth guard passes', () => {
  const output = execFileSync(process.execPath, ['scripts/check-stage230c-r10-quick-capture-visual-source-truth.cjs'], {
    encoding: 'utf8',
  });

  assert.match(output, /STAGE230C_R10_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH PASS/);
});
