#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const dataContract = read('src/lib/data-contract.ts');
expect(/from ['"]\.\/domain-statuses\.js['"]/.test(dataContract), 'src/lib/data-contract.ts must import domain-statuses with .js for Vercel API runtime');
expect(!/from ['"]\.\/domain-statuses['"]/.test(dataContract), 'src/lib/data-contract.ts still has extensionless domain-statuses import');

for (const file of ['api/leads.ts', 'api/cases.ts', 'api/work-items.ts']) {
  const content = read(file);
  expect(!/from ['"][^'"]*domain-statuses['"]/.test(content), `${file} has extensionless domain-statuses import`);
}

const pkg = JSON.parse(read('package.json'));
expect(pkg.scripts && pkg.scripts['check:a20-runtime-imports'], 'package.json missing check:a20-runtime-imports');

if (fail.length) {
  console.error('A20 runtime import guard failed.');
  for (const item of fail) console.error(`- ${item}`);
  process.exit(1);
}

console.log('OK: A20 API runtime imports guard passed.');