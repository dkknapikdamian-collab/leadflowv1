const fs = require('fs');
const p = 'package.json';
let text = fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
const pkg = JSON.parse(text);
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-fin7-client-finance-summary'] = 'node scripts/check-closeflow-fin7-client-finance-summary.cjs';
fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_FIN7_CLIENT_FINANCE_SUMMARY_PACKAGE_OK');
