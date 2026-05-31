#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'scripts/check-stage180c-apply-wrapper-ascii.cjs');
const self = fs.readFileSync(file, 'utf8');
if (/Ä|Å|Ĺ|Â|â|�/.test(self)) {
  console.error('STAGE180C_ASCII_WRAPPER_GUARD_FAIL: wrapper/guard contains mojibake.');
  process.exit(1);
}
console.log('STAGE180C_ASCII_WRAPPER_GUARD_PASS');
