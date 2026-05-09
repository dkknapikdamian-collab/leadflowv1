#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const packagePath = path.join(process.cwd(), 'package.json');
const raw = fs.readFileSync(packagePath, 'utf8');
const pkg = JSON.parse(raw);

pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-wide-syntax-gate'] = 'node scripts/check-closeflow-wide-syntax-gate.cjs';

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_WIDE_SYNTAX_GATE_PACKAGE_PATCH_OK');
