#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const pkgPath = path.join(repo, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['audit:closeflow-visual-system-inventory'] = 'node scripts/audit-closeflow-visual-system-inventory.cjs --write';
pkg.scripts['check:closeflow-visual-system-inventory'] = 'node scripts/check-closeflow-visual-system-inventory.cjs';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_VS0_PACKAGE_JSON_PATCH_OK');
