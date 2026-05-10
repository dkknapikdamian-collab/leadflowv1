const fs = require('fs');
const p = 'package.json';
const pkg = JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-fin8-finance-visual-integration'] = 'node scripts/check-closeflow-fin8-finance-visual-integration.cjs';
pkg.scripts['check:closeflow-fin6-payments-list-types'] = 'node scripts/check-closeflow-fin6-payments-list-types.cjs';
fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_FIN8_BULK_VISUAL_CONTRACT_PACKAGE_OK');
