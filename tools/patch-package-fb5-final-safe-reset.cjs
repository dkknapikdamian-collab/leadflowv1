const fs = require('fs');
const path = require('path');

const pkgPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(pkgPath)) throw new Error('Missing package.json');
const raw = fs.readFileSync(pkgPath, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(raw);
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-fb5-toast-danger-source'] = 'node scripts/check-closeflow-fb5-toast-danger-source.cjs';
pkg.scripts['check:closeflow-fb5-heavy-ui-guards'] = 'node scripts/check-closeflow-fb5-heavy-ui-guards.cjs';
pkg.scripts['check:closeflow-fb5-bulk-ui-contract'] = 'node scripts/check-closeflow-fb5-bulk-ui-contract.cjs';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_FB5_PACKAGE_SCRIPTS_FIX4_OK');
