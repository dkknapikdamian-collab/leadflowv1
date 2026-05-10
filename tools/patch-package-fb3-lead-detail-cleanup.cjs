const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pkgPath = path.join(root, 'package.json');
let raw = fs.readFileSync(pkgPath, 'utf8');
raw = raw.replace(/^\uFEFF/, '');
const pkg = JSON.parse(raw);
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-fb3-lead-detail-cleanup'] = 'node scripts/check-closeflow-fb3-lead-detail-cleanup.cjs';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_FB3_LEAD_DETAIL_CLEANUP_PACKAGE_OK');
