'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const MARKER = 'STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY';

test(`${MARKER}: visual source of truth guard passes`, () => {
  const script = path.join(process.cwd(), 'scripts', 'check-stage231d0a-visual-source-truth-consistency.cjs');
  const result = spawnSync(process.execPath, [script], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, [
    `${MARKER} guard failed`,
    result.stdout,
    result.stderr,
  ].join('\n'));
  assert.match(result.stdout, new RegExp(`${MARKER}: PASS`));
});
