#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'src/pages/Today.tsx');
let text = fs.readFileSync(file, 'utf8');

const before = text;

text = text.replace(
  /(\/\/ STAGE30A_TODAY_GUARD_COMPAT: marker only\. Global actions stay in Layout,\r?\n)\s+not rendered locally in Today\./,
  '$1//   not rendered locally in Today.'
);

text = text.replace(
  /(\r?\n)\s+not rendered locally in Today\./g,
  '$1//   not rendered locally in Today.'
);

if (!text.includes('//   not rendered locally in Today.')) {
  throw new Error('TODAY_LEGACY_COMMENT_REPAIR_FAILED');
}

if (text !== before) {
  fs.writeFileSync(file, text, 'utf8');
  console.log('CLOSEFLOW_TODAY_LEGACY_COMMENT_FOR_GATE_REPAIRED');
} else {
  console.log('CLOSEFLOW_TODAY_LEGACY_COMMENT_FOR_GATE_ALREADY_OK');
}
