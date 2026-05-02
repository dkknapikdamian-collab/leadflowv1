#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src/pages/TodayStable.tsx');
const source = fs.readFileSync(file, 'utf8');

const fail = [];
function expect(condition, message) {
  if (!condition) fail.push(message);
}

expect(source.includes('key?: string; to: string; title: string; meta?: string; helper?: string; badge?: string'), 'RowLink props type must include key?: string for current JSX/TS checking');
expect(source.includes('<RowLink'), 'TodayStable should still render RowLink entries');
expect(!source.includes('const EXAMPLES = [const EXAMPLES = ['), 'TodayStable guard sanity check');

if (fail.length) {
  console.error('P10D TodayStable RowLink key guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: P10D TodayStable RowLink key guard passed.');
