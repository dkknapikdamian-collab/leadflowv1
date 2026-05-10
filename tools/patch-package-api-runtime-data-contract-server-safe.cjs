const fs = require('fs');

const p = 'package.json';
let text = fs.readFileSync(p, 'utf8');
text = text.replace(/^\uFEFF/, '');
const pkg = JSON.parse(text);
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:closeflow-api-runtime-data-contract-server-safe'] = 'node scripts/check-closeflow-api-runtime-data-contract-server-safe.cjs';
fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
console.log('CLOSEFLOW_API_RUNTIME_DATA_CONTRACT_SERVER_SAFE_PACKAGE_OK');
