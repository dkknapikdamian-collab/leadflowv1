const fs = require('fs');
const path = 'package.json';
const raw = fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(raw);
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-fin9-finance-duplicate-safety'] = 'node scripts/check-closeflow-fin9-finance-duplicate-safety.cjs';
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
console.log('CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY_PACKAGE_OK');
