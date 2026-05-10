#!/usr/bin/env node
const fs = require('fs');
const path = 'package.json';
let text = fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(text);
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-calendar-bundle-import-source'] = 'node scripts/check-closeflow-calendar-bundle-import-source.cjs';
// Remove known broken temporary script from failed import-regression repair.
delete pkg.scripts['check:closeflow-tsc-import-regression'];
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_CALENDAR_BUNDLE_IMPORT_DEDUP_REPAIR4_PACKAGE_OK');
