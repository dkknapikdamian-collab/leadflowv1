const fs = require('fs');
const path = require('path');

const pkgPath = path.join(process.cwd(), 'package.json');
const raw = fs.readFileSync(pkgPath, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(raw);

pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-fb2-leads-list-right-rail-cleanup'] = 'node scripts/check-closeflow-fb2-leads-list-right-rail-cleanup.cjs';

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP_PACKAGE_OK');
