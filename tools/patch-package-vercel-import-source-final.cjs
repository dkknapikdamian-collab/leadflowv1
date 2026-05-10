#!/usr/bin/env node
const fs = require('fs');

const path = 'package.json';
const text = fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(text);
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-vercel-import-source-final'] = 'node scripts/check-closeflow-vercel-import-source-final.cjs';
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_VERCEL_IMPORT_SOURCE_FINAL_PACKAGE_OK');
