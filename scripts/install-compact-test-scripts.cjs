#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
pkg.scripts = pkg.scripts || {};

const currentTest = String(pkg.scripts.test || '').trim();
const compactCommand = 'node scripts/run-tests-compact.cjs';

if (currentTest && currentTest !== compactCommand && !pkg.scripts['test:raw']) {
  pkg.scripts['test:raw'] = currentTest;
}

pkg.scripts.test = compactCommand;
pkg.scripts['test:compact'] = compactCommand;
pkg.scripts['test:critical'] = 'node scripts/run-tests-compact.cjs --critical';
if (!pkg.scripts['test:raw']) pkg.scripts['test:raw'] = 'node --test "tests/**/*.test.cjs"';

fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
console.log('OK: package.json uses compact test output. Raw output remains available via npm run test:raw.');
