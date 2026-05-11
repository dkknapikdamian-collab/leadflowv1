#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pkgPath = path.join(root, 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('package.json not found');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-admin-feedback-2026-05-11-p2'] = 'node scripts/check-closeflow-admin-feedback-2026-05-11-p2.cjs';
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
console.log('Updated package.json with check:closeflow-admin-feedback-2026-05-11-p2');
